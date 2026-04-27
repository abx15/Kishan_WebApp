"""
Admin Routes — AgroBrain AI
Enterprise-level admin endpoints:
- User management (list, view, ban, role changes, verify)
- System statistics and monitoring
- Cache management and job monitoring
- API logging and system health
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId

from app.core.database import get_db
from app.core.redis import get_redis
from app.core.logger import logger
from app.core.permissions import require_role, require_admin, PermissionChecker
from app.core.security import get_current_user
from app.schemas.user import (
    UserResponse, UserListResponse, UserBanRequest,
    UserRoleUpdateRequest, AdminStatsResponse,
)

# ──────────────────────────────────────────────────────────────────
# NOTE: prefix is "/admin" — main.py already adds "/api" prefix
# Full path: /api/admin/...
# ──────────────────────────────────────────────────────────────────
router = APIRouter(prefix="/admin", tags=["Admin"])


# ─── GET /admin/users ─────────────────────────────────────────────────────────
@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    role: Optional[str] = Query(None, description="Filter by role"),
    search: Optional[str] = Query(None, description="Search by name/email/username"),
    is_verified: Optional[bool] = Query(None, description="Filter by verification status"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    is_banned: Optional[bool] = Query(None, description="Filter by ban status"),
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db=Depends(get_db),
):
    """Get paginated list of users with filtering and search."""
    try:
        filter_query: Dict[str, Any] = {}

        if role:
            filter_query["role"] = role
        if is_verified is not None:
            filter_query["is_verified"] = is_verified
        if is_active is not None:
            filter_query["is_active"] = is_active
        if is_banned is not None:
            filter_query["is_banned"] = is_banned
        if search:
            regex = {"$regex": search, "$options": "i"}
            filter_query["$or"] = [{"name": regex}, {"email": regex}, {"username": regex}]

        total = await db.users.count_documents(filter_query)
        skip = (page - 1) * limit

        cursor = db.users.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
        users = []
        async for doc in cursor:
            users.append(UserResponse.from_mongo(doc))

        return {
            "success": True,
            "data": {
                "users": [u.model_dump() for u in users],
                "total": total,
                "page": page,
                "limit": limit,
                "has_next": total > (skip + limit),
                "has_prev": page > 1,
                "total_pages": (total + limit - 1) // limit,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get users: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve users")


# ─── GET /admin/users/{user_id} ───────────────────────────────────────────────
@router.get("/users/{user_id}")
async def get_user_details(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db=Depends(get_db),
):
    """Get full user details by ID."""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {"success": True, "data": UserResponse.from_mongo(user).model_dump()}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get user details: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user details")


# ─── PATCH /admin/users/{user_id}/ban ─────────────────────────────────────────
@router.patch("/users/{user_id}/ban")
async def ban_user(
    user_id: str,
    request: UserBanRequest,
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db=Depends(get_db),
):
    """Toggle ban/unban for a user."""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if not PermissionChecker.can_ban_user(current_user, user):
            raise HTTPException(status_code=403, detail="You cannot ban this user")

        is_banned = not user.get("is_banned", False)
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "is_banned": is_banned,
                "ban_reason": request.reason if is_banned else None,
                "updated_at": datetime.now(timezone.utc),
            }},
        )

        action = "banned" if is_banned else "unbanned"
        logger.info(f"User {user_id} {action} by admin {current_user['_id']}")
        return {"success": True, "message": f"User {action} successfully", "is_banned": is_banned}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to ban/unban user: {e}")
        raise HTTPException(status_code=500, detail="Failed to update user status")


# ─── PATCH /admin/users/{user_id}/role ────────────────────────────────────────
@router.patch("/users/{user_id}/role")
async def change_user_role(
    user_id: str,
    request: UserRoleUpdateRequest,
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db=Depends(get_db),
):
    """Change a user's role."""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if not PermissionChecker.can_change_role(current_user, user):
            raise HTTPException(status_code=403, detail="You cannot change this user's role")

        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"role": request.role, "updated_at": datetime.now(timezone.utc)}},
        )

        logger.info(f"User {user_id} role → {request.role} by admin {current_user['_id']}")
        return {"success": True, "message": "User role updated", "new_role": request.role}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to change user role: {e}")
        raise HTTPException(status_code=500, detail="Failed to update user role")


# ─── POST /admin/users/{user_id}/verify ───────────────────────────────────────
@router.post("/users/{user_id}/verify")
async def verify_user_email(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db=Depends(get_db),
):
    """Manually verify a user's email."""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "is_verified": True,
                "email_verify_token": None,
                "updated_at": datetime.now(timezone.utc),
            }},
        )

        logger.info(f"User {user_id} email verified by admin {current_user['_id']}")
        return {"success": True, "message": "User email verified successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to verify user email: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify user email")


# ─── GET /admin/stats ─────────────────────────────────────────────────────────
@router.get("/stats")
async def get_admin_stats(
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db=Depends(get_db),
    redis=Depends(get_redis),
):
    """Get comprehensive admin statistics."""
    try:
        now = datetime.now(timezone.utc)
        yesterday = now - timedelta(days=1)
        week_ago = now - timedelta(days=7)

        total_users = await db.users.count_documents({})
        farmers = await db.users.count_documents({"role": "farmer"})
        agronomists = await db.users.count_documents({"role": "agronomist"})
        admins = await db.users.count_documents({"role": "admin"})
        active_today = await db.users.count_documents({"last_login": {"$gte": yesterday}})
        new_this_week = await db.users.count_documents({"created_at": {"$gte": week_ago}})
        total_recommendations = await db.crop_recommendations.count_documents({})
        total_chats = await db.chat_sessions.count_documents({})

        # Cache stats (graceful if Redis unavailable)
        cache_hit_rate = 0.0
        if redis:
            try:
                cache_stats = await redis.info("stats")
                hits = cache_stats.get("keyspace_hits", 0)
                misses = cache_stats.get("keyspace_misses", 1)
                cache_hit_rate = round(hits / max(hits + misses, 1) * 100, 2)
            except Exception:
                pass

        return {
            "success": True,
            "data": {
                "total_users": total_users,
                "farmers": farmers,
                "agronomists": agronomists,
                "admins": admins,
                "active_today": active_today,
                "new_this_week": new_this_week,
                "total_recommendations": total_recommendations,
                "total_chats": total_chats,
                "cache_hit_rate": cache_hit_rate,
                "avg_response_ms": 120.0,  # Placeholder — implement with real metrics
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get admin stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve statistics")


# ─── GET /admin/logs ──────────────────────────────────────────────────────────
@router.get("/logs")
async def get_api_logs(
    limit: int = Query(50, ge=1, le=500, description="Number of recent logs"),
    level: Optional[str] = Query(None, description="Filter by log level"),
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db=Depends(get_db),
):
    """Get recent API logs from the database."""
    try:
        filter_query: Dict[str, Any] = {}
        if level:
            filter_query["level"] = level

        cursor = db.api_logs.find(filter_query).sort("timestamp", -1).limit(limit)
        logs = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            logs.append(doc)

        # Fallback sample data if log collection is empty
        if not logs:
            logs = [
                {
                    "id": "sample_1",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "level": "info",
                    "message": "API request processed",
                    "endpoint": "/api/auth/login",
                    "method": "POST",
                    "response_time_ms": 120,
                },
            ]

        return {
            "success": True,
            "data": {
                "logs": logs,
                "total": len(logs),
                "limit": limit,
                "level_filter": level,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get API logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve logs")


# ─── POST /admin/cache/clear ──────────────────────────────────────────────────
@router.post("/cache/clear")
async def clear_cache(
    pattern: str = Query("*", description="Pattern to match keys"),
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    redis=Depends(get_redis),
):
    """Clear Redis cache keys matching a pattern."""
    try:
        if not redis:
            return {"success": False, "message": "Redis unavailable"}

        if pattern == "*":
            await redis.flushdb()
            logger.info(f"Admin {current_user['_id']} cleared entire Redis cache")
            return {"success": True, "message": "All cache cleared"}
        else:
            keys = await redis.keys(pattern)
            deleted = await redis.delete(*keys) if keys else 0
            logger.info(f"Admin cleared {deleted} keys matching '{pattern}'")
            return {"success": True, "message": f"Cleared {deleted} keys matching '{pattern}'"}

    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear cache")


# ─── GET /admin/cache/stats ───────────────────────────────────────────────────
@router.get("/cache/stats")
async def get_cache_stats(
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    redis=Depends(get_redis),
):
    """Get detailed Redis statistics."""
    try:
        if not redis:
            return {"success": False, "message": "Redis unavailable", "data": {}}

        info = await redis.info()
        hits = info.get("keyspace_hits", 0)
        misses = info.get("keyspace_misses", 1)

        return {
            "success": True,
            "data": {
                "redis_version": info.get("redis_version"),
                "used_memory": info.get("used_memory_human"),
                "used_memory_peak": info.get("used_memory_peak_human"),
                "total_commands": info.get("total_commands_processed"),
                "connected_clients": info.get("connected_clients"),
                "keyspace_hits": hits,
                "keyspace_misses": misses,
                "hit_rate": round(hits / max(hits + misses, 1) * 100, 2),
                "uptime_seconds": info.get("uptime_in_seconds"),
                "uptime_days": info.get("uptime_in_seconds", 0) // 86400,
            },
        }

    except Exception as e:
        logger.error(f"Error getting cache stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve cache stats")


# ─── GET /admin/jobs/status ───────────────────────────────────────────────────
@router.get("/jobs/status")
async def get_jobs_status(
    current_user: Dict[str, Any] = Depends(require_role("admin")),
):
    """Check background scheduler job status."""
    try:
        from app.core.scheduler import agro_scheduler
        jobs = []
        for job in agro_scheduler.scheduler.get_jobs():
            jobs.append({
                "id": job.id,
                "name": job.name,
                "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
                "trigger": str(job.trigger),
                "pending": job.pending,
            })

        return {
            "success": True,
            "data": {
                "is_running": agro_scheduler.scheduler.running,
                "job_count": len(jobs),
                "jobs": jobs,
            },
        }

    except Exception as e:
        logger.error(f"Error fetching jobs status: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve job status")


# ─── GET /admin/system/health ─────────────────────────────────────────────────
@router.get("/system/health")
async def get_system_health(
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db=Depends(get_db),
    redis=Depends(get_redis),
):
    """Get comprehensive system health status."""
    try:
        health: Dict[str, Any] = {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "services": {},
        }

        # MongoDB
        try:
            t0 = datetime.now(timezone.utc)
            await db.command("ping")
            ms = (datetime.now(timezone.utc) - t0).total_seconds() * 1000
            health["services"]["mongodb"] = {"status": "healthy", "response_time_ms": round(ms, 1)}
        except Exception as e:
            health["services"]["mongodb"] = {"status": "unhealthy", "error": str(e)}
            health["status"] = "degraded"

        # Redis
        if redis:
            try:
                t0 = datetime.now(timezone.utc)
                await redis.ping()
                ms = (datetime.now(timezone.utc) - t0).total_seconds() * 1000
                health["services"]["redis"] = {"status": "healthy", "response_time_ms": round(ms, 1)}
            except Exception as e:
                health["services"]["redis"] = {"status": "unhealthy", "error": str(e)}
                health["status"] = "degraded"
        else:
            health["services"]["redis"] = {"status": "unavailable"}

        # Scheduler
        try:
            from app.core.scheduler import agro_scheduler
            running = agro_scheduler.scheduler.running
            health["services"]["scheduler"] = {
                "status": "healthy" if running else "stopped",
                "running": running,
            }
            if not running:
                health["status"] = "degraded"
        except Exception as e:
            health["services"]["scheduler"] = {"status": "unavailable", "error": str(e)}

        return {"success": True, "data": health}

    except Exception as e:
        logger.error(f"Error getting system health: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve system health")
