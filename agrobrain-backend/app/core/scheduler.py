"""
Background job scheduler module for AgroBrain AI backend.
Uses APScheduler with MongoDB jobstore for persistence.
"""

import asyncio
import random
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.mongodb import MongoDBJobStore
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from firebase_admin import messaging
from loguru import logger
import openai

from app.core.config import settings
from app.core.database import get_database
from app.core.redis import redis_manager, DAILY_TIPS_CACHE
from app.services.weather_service import weather_service

# IST Timezone (UTC+5:30)
IST = timezone(timedelta(hours=5, minutes=30))

class AgroScheduler:
    """Background task scheduler with MongoDB persistence."""
    
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.db = None
        self.openai_semaphore = asyncio.Semaphore(10)  # Max 10 concurrent OpenAI calls

    async def setup(self):
        """Initialize scheduler with jobstores and start."""
        try:
            # MongoDB JobStore for persistence across restarts
            jobstores = {
                'default': MongoDBJobStore(
                    database=settings.mongodb_db_name,
                    collection="apscheduler_jobs",
                    client=get_database().client
                )
            }
            self.scheduler.configure(jobstores=jobstores)
            self.scheduler.start()
            logger.info("AgroBrain Scheduler started with MongoDB jobstore")
            
            # Schedule jobs if they don't exist
            self._schedule_base_jobs()
            
            # Run warmup immediately in background
            asyncio.create_task(self.cache_warmup())
            
        except Exception as e:
            logger.error(f"Failed to setup scheduler: {str(e)}")

    def _schedule_base_jobs(self):
        """Add permanent jobs to the scheduler."""
        # Job 1: Weather Alerts - every 30 mins
        if not self.scheduler.get_job("check_weather_alerts"):
            self.scheduler.add_job(
                self.check_weather_alerts,
                IntervalTrigger(minutes=30, jitter=120),
                id="check_weather_alerts",
                replace_existing=True
            )
            logger.debug("Scheduled weather alerts job")

        # Job 2: Daily Tips - every day at 6:00 AM IST
        if not self.scheduler.get_job("generate_daily_tips"):
            self.scheduler.add_job(
                self.generate_daily_tips,
                CronTrigger(hour=6, minute=0, timezone=IST, jitter=300),
                id="generate_daily_tips",
                replace_existing=True
            )
            logger.debug("Scheduled daily tips job")

        # Job 3: Session Cleanup - every day at 2:00 AM IST
        if not self.scheduler.get_job("cleanup_tasks"):
            self.scheduler.add_job(
                self.cleanup_tasks,
                CronTrigger(hour=2, minute=0, timezone=IST, jitter=600),
                id="cleanup_tasks",
                replace_existing=True
            )
            logger.debug("Scheduled cleanup tasks job")

    async def shutdown(self):
        """Gracefully shutdown scheduler."""
        self.scheduler.shutdown()
        logger.info("AgroBrain Scheduler shut down")

    # --- JOB 1: Weather Alerts ---
    async def check_weather_alerts(self):
        """Scan user locations and send alerts via FCM."""
        logger.info("[Job: WeatherAlerts] Starting weather alert scan...")
        if not redis_manager.is_available():
            logger.warning("[Job: WeatherAlerts] Redis unavailable, skipping scan.")
            return

        try:
            db = get_database()
            # Get distinct locations from users
            locations_cursor = db.users.aggregate([
                {"$match": {"default_location.lat": {"$ne": None}}},
                {"$group": {
                    "_id": {
                        "lat": "$default_location.lat",
                        "lng": "$default_location.lng"
                    }
                }}
            ])
            
            locations = await locations_cursor.to_list(length=None)
            logger.info(f"[Job: WeatherAlerts] Processing {len(locations)} unique locations")
            
            # Process in chunks of 50
            for i in range(0, len(locations), 50):
                chunk = locations[i:i+50]
                tasks = [self._process_location_alert(loc['_id']['lat'], loc['_id']['lng']) for loc in chunk]
                await asyncio.gather(*tasks)
                
            logger.info("[Job: WeatherAlerts] Weather alert scan completed")
        except Exception as e:
            logger.error(f"[Job: WeatherAlerts] Error: {str(e)}")

    async def _process_location_alert(self, lat: float, lng: float):
        """Process alerts for a specific coordinate."""
        try:
            # Check weather (uses internal cache if fresh)
            weather_data = await weather_service.fetch_current_weather(lat, lng)
            alerts = weather_data.alerts
            
            if not alerts:
                return

            # Find users at this location to notify
            db = get_database()
            users_cursor = db.users.find({
                "default_location.lat": lat,
                "default_location.lng": lng,
                "is_active": True
            })
            
            async for user in users_cursor:
                # Send notifications for each new alert
                for alert in alerts:
                    # In a real app, we might check if we've already sent this alert recently
                    await self._send_fcm_notification(user, alert)
                    
        except Exception as e:
            logger.error(f"Error processing alert for {lat},{lng}: {str(e)}")

    async def _send_fcm_notification(self, user: Dict, alert: Any):
        """Send push notification via Firebase."""
        token = user.get("fcm_token")
        if not token:
            return
            
        try:
            # Use English or Hindi depending on user preference
            lang = user.get("language", "hi")
            title = "Mausam Alert" if lang == "hi" else "Weather Alert"
            body = alert.message_hi if lang == "hi" else alert.message_en
            
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                token=token,
                data={
                    "type": "weather_alert",
                    "severity": alert.severity,
                    "alert_type": alert.type
                }
            )
            messaging.send(message)
            logger.debug(f"Alert sent to user {user['_id']}")
        except Exception as e:
            logger.warning(f"FCM failed for user {user['_id']}: {str(e)}")

    # --- JOB 2: Daily Tips ---
    async def generate_daily_tips(self):
        """Generate AI tips for active users (last login < 30 days)."""
        logger.info("[Job: DailyTips] Generating tips for active users...")
        try:
            db = get_database()
            threshold = datetime.utcnow() - timedelta(days=30)
            users_cursor = db.users.find({
                "last_login": {"$gte": threshold},
                "is_active": True
            })
            
            processed = 0
            ai_calls = 0
            start_time = datetime.utcnow()
            
            async for user in users_cursor:
                await self._process_user_tips(user)
                processed += 1
                ai_calls += 1
            
            duration = (datetime.utcnow() - start_time).total_seconds() * 1000
            logger.info(f"[Job: DailyTips] Finished. Users: {processed}, AI Calls: {ai_calls}, Time: {duration:.2f}ms")
            
        except Exception as e:
            logger.error(f"[Job: DailyTips] Error: {str(e)}")

    async def _process_user_tips(self, user: Dict):
        """Generate and cache tips for a specific user using OpenAI."""
        user_id = str(user["_id"])
        today = datetime.now(IST).strftime("%Y-%m-%d")
        cache_key = DAILY_TIPS_CACHE.format(user_id=user_id, date=today)
        
        # Check if already cached
        if await redis_manager.get_cache(cache_key):
            return

        async with self.openai_semaphore:
            try:
                # Personalize prompt based on farm profile
                crops = user.get("farm_profile", {}).get("primary_crops", ["Indian crops"])
                soil = user.get("farm_profile", {}).get("soil_type", "General")
                
                prompt = (
                    f"You are a master agronomist in India. Provide 3 short, actionable daily tips for a farmer "
                    f"growing {', '.join(crops)} in {soil} soil. Tips should be practical and scientific. "
                    f"Format: Return a JSON array of 3 strings. Language: {user.get('language', 'hi')}."
                )
                
                client = openai.AsyncOpenAI(api_key=settings.openai_api_key)
                response = await client.chat.completions.create(
                    model=settings.openai_model,
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"}
                )
                
                import json
                tips_data = json.loads(response.choices[0].message.content)
                tips = tips_data.get("tips", [])
                
                # Cache until midnight IST
                now = datetime.now(IST)
                midnight = datetime.combine(now + timedelta(days=1), datetime.min.time(), tzinfo=IST)
                ttl = int((midnight - now).total_seconds())
                
                await redis_manager.set_cache(cache_key, tips, ttl=ttl)
                
                # Optional: Store in MongoDB history
                db = get_database()
                await db.daily_tips_history.insert_one({
                    "user_id": user_id,
                    "date": today,
                    "tips": tips,
                    "created_at": datetime.utcnow()
                })
                
            except Exception as e:
                logger.error(f"Error generating tips for user {user_id}: {str(e)}")

    # --- JOB 3: Cleanup ---
    async def cleanup_tasks(self):
        """Cleanup old sessions and weather logs."""
        logger.info("[Job: Cleanup] Starting records cleanup...")
        try:
            db = get_database()
            
            # 1. Cleanup chat sessions > 90 days
            session_threshold = datetime.utcnow() - timedelta(days=90)
            res1 = await db.chat_sessions.delete_many({"updated_at": {"$lt": session_threshold}})
            
            # 2. Cleanup weather logs > 7 days (as a verification for TTL index)
            weather_threshold = datetime.utcnow() - timedelta(days=7)
            res2 = await db.weather_logs.delete_many({"fetched_at": {"$lt": weather_threshold}})
            
            logger.info(f"[Job: Cleanup] Deleted {res1.deleted_count} sessions and {res2.deleted_count} weather logs")
        except Exception as e:
            logger.error(f"[Job: Cleanup] Error: {str(e)}")

    # --- JOB 4: Warmup ---
    async def cache_warmup(self):
        """Pre-fetch weather for major cities."""
        logger.info("[Job: Warmup] Warming up weather cache for top cities...")
        top_cities = [
            {"name": "Nashik", "lat": 19.9975, "lng": 73.7898},
            {"name": "Nagpur", "lat": 21.1458, "lng": 79.0882},
            {"name": "Guntur", "lat": 16.3067, "lng": 80.4365},
            {"name": "Vijayawada", "lat": 16.5062, "lng": 80.6480},
            {"name": "Bhatinda", "lat": 30.2110, "lng": 74.9455},
            {"name": "Jalgaon", "lat": 21.0077, "lng": 75.5626},
            {"name": "Indore", "lat": 22.7196, "lng": 75.8577},
            {"name": "Rajkot", "lat": 22.3039, "lng": 70.8022},
            {"name": "Kurnool", "lat": 15.8281, "lng": 78.0373},
            {"name": "Ludhiana", "lat": 30.9010, "lng": 75.8573},
        ]
        
        for city in top_cities:
            try:
                await weather_service.fetch_current_weather(city["lat"], city["lng"])
                logger.debug(f"Warmed up cache for {city['name']}")
            except Exception as e:
                logger.warning(f"Warmup failed for {city['name']}: {str(e)}")
        
        logger.info("[Job: Warmup] Cache warmup completed")

# Singleton instance
agro_scheduler = AgroScheduler()
