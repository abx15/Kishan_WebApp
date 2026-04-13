import asyncio
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DATABASE_NAME", "agrobrain")

async def seed_sample_users():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    # 1. Seed Sample Users
    print("Seeding sample users...")
    users = [
        {
            "phone": "+919129939972",
            "name": "Ramesh Kumar",
            "language": "hi",
            "avatar_url": "https://picsum.photos/seed/farmer1/200/200.jpg",
            "default_location": {
                "lat": 28.6139,
                "lng": 77.2090,
                "village": "Lucknow",
                "district": "Lucknow",
                "state": "Uttar Pradesh",
                "pincode": "226001"
            },
            "farm_profile": {
                "total_area_acres": 5.5,
                "soil_type": "alluvial",
                "primary_crops": ["wheat", "rice"],
                "irrigation_type": "canal",
                "has_soil_sensor": False
            },
            "is_verified": True,
            "is_active": True,
            "role": "farmer",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "last_login": datetime.now(timezone.utc)
        },
        {
            "phone": "+919876543210",
            "name": "Sita Devi",
            "language": "hi",
            "avatar_url": "https://picsum.photos/seed/farmer2/200/200.jpg",
            "default_location": {
                "lat": 26.8467,
                "lng": 80.9462,
                "village": "Kanpur",
                "district": "Kanpur",
                "state": "Uttar Pradesh",
                "pincode": "208001"
            },
            "farm_profile": {
                "total_area_acres": 3.2,
                "soil_type": "black",
                "primary_crops": ["pigeonpeas", "maize"],
                "irrigation_type": "drip",
                "has_soil_sensor": True
            },
            "is_verified": True,
            "is_active": True,
            "role": "farmer",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "last_login": datetime.now(timezone.utc)
        },
        {
            "phone": "+919112233445",
            "name": "Rajesh Singh",
            "language": "en",
            "avatar_url": "https://picsum.photos/seed/farmer3/200/200.jpg",
            "default_location": {
                "lat": 25.5941,
                "lng": 85.1376,
                "village": "Patna",
                "district": "Patna",
                "state": "Bihar",
                "pincode": "800001"
            },
            "farm_profile": {
                "total_area_acres": 8.0,
                "soil_type": "alluvial",
                "primary_crops": ["rice", "wheat", "maize"],
                "irrigation_type": "sprinkler",
                "has_soil_sensor": False
            },
            "is_verified": True,
            "is_active": True,
            "role": "farmer",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "last_login": datetime.now(timezone.utc)
        }
    ]
    
    await db.users.delete_many({})
    inserted_users = await db.users.insert_many(users)
    print(f"Inserted {len(inserted_users.inserted_ids)} users")

    # 2. Seed Locations for users
    print("Seeding locations...")
    locations = []
    for i, user_id in enumerate(inserted_users.inserted_ids):
        locations.append({
            "user_id": user_id,
            "label": "Main Farm",
            "is_default": True,
            "coordinates": {
                "type": "Point",
                "coordinates": [77.2090 - i*0.1, 28.6139 - i*0.1]
            },
            "address": {
                "village": f"Village {i+1}",
                "tehsil": f"Tehsil {i+1}",
                "district": ["Lucknow", "Kanpur", "Patna"][i],
                "state": ["Uttar Pradesh", "Uttar Pradesh", "Bihar"][i],
                "pincode": f"22600{i+1}",
                "country": "IN"
            },
            "agro_zone": ["Indo-Gangetic Plains", "Indo-Gangetic Plains", "Indo-Gangetic Plains"][i],
            "elevation_m": 126 + i*10,
            "created_at": datetime.now(timezone.utc)
        })
    
    await db.locations.delete_many({})
    inserted_locations = await db.locations.insert_many(locations)
    print(f"Inserted {len(inserted_locations.inserted_ids)} locations")

    # 3. Seed Sample Weather Data
    print("Seeding sample weather data...")
    weather_data = []
    for i, location_id in enumerate(inserted_locations.inserted_ids):
        weather_data.append({
            "user_id": inserted_users.inserted_ids[i],
            "location_id": location_id,
            "coordinates": {
                "lat": 28.6139 - i*0.1,
                "lng": 77.2090 - i*0.1
            },
            "current": {
                "temp_c": 34.2 + i*2,
                "feels_like_c": 38.0 + i*2,
                "humidity_pct": 72 - i*5,
                "wind_speed_kmh": 12.4 + i*3,
                "wind_direction": "NE",
                "pressure_hpa": 1008,
                "visibility_km": 8.0,
                "uv_index": 7,
                "condition": "partly_cloudy",
                "description": "Partly cloudy with moderate humidity",
                "icon_code": "02d"
            },
            "forecast": [
                {
                    "date": datetime.now(timezone.utc),
                    "temp_max_c": 36.0 + i*2,
                    "temp_min_c": 24.0 + i*2,
                    "humidity_pct": 68 - i*5,
                    "rain_probability_pct": 20,
                    "rain_mm": 0.0,
                    "condition": "clear",
                    "farming_advisory": "Good day for irrigation"
                }
            ],
            "alerts": [
                {
                    "type": "heavy_rain",
                    "severity": "moderate",
                    "message_hi": "kal bharhi barish ki sambhavna hai",
                    "message_en": "Heavy rain expected tomorrow",
                    "valid_from": datetime.now(timezone.utc),
                    "valid_until": datetime.now(timezone.utc)
                }
            ],
            "source": "openweathermap",
            "fetched_at": datetime.now(timezone.utc),
            "created_at": datetime.now(timezone.utc)
        })
    
    await db.weather_logs.delete_many({})
    inserted_weather = await db.weather_logs.insert_many(weather_data)
    print(f"Inserted {len(inserted_weather.inserted_ids)} weather logs")

    print("Sample users and related data seeding complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_sample_users())
