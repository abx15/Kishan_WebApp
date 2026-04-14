"""
Admin routes for AgroBrain AI backend.

This module provides comprehensive admin endpoints for:
- User management (list, view, ban, role changes)
- System statistics and monitoring
- Cache management and job monitoring
- API logging and system health
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId

from app.core.database import get_database
from app.core.redis import get_redis_client
from app.core.scheduler import agro_scheduler
from app.core.logger import logger
from app.core.permissions import require_role, require_admin, PermissionChecker
from app.services.auth_service import get_current_user
from app.services.auth_service import auth_service
from app.schemas.user import (
    UserResponse, UserListResponse, UserBanRequest,
    UserRoleUpdateRequest, AdminStatsResponse
)

# Create router
router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

@router.get("/users", response_model=UserListResponse)
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    role: Optional[str] = Query(None, description="Filter by role"),
    search: Optional[str] = Query(None, description="Search by name/email/username"),
    is_verified: Optional[bool] = Query(None, description="Filter by verification status"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    is_banned: Optional[bool] = Query(None, description="Filter by ban status"),
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db = Depends(get_database)
):
    """
    Get paginated list of users.
    
    All routes: require_admin
    
    Query parameters:
    - page: Page number (default: 1)
    - limit: Items per page (default: 20, max: 100)
    - role: Filter by role (farmer, agronomist, admin)
    - search: Search by name, email, or username
    - is_verified: Filter by verification status
    - is_active: Filter by active status
    - is_banned: Filter by ban status
    
    Response: Paginated user list
    """
    try:
        users_collection = db.users
        
        # Build filter query
        filter_query = {}
        
        if role:
            filter_query["role"] = role
        
        if is_verified is not None:
            filter_query["is_verified"] = is_verified
        
        if is_active is not None:
            filter_query["is_active"] = is_active
        
        if is_banned is not None:
            filter_query["is_banned"] = is_banned
        
        if search:
            search_regex = {"$regex": search, "$options": "i"}
            filter_query["$or"] = [
                {"name": search_regex},
                {"email": search_regex},
                {"username": search_regex}
            ]
        
        # Count total documents
        total = await users_collection.count_documents(filter_query)
        
        # Calculate pagination
        skip = (page - 1) * limit
        has_next = total > (skip + limit)
        has_prev = page > 1
        
        # Get users with pagination
        cursor = users_collection.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
        users = []
        
        async for user_doc in cursor:
            # Convert ObjectId to string for UserResponse
            user_dict = dict(user_doc)
            user_dict["_id"] = str(user_dict["_id"])
            users.append(UserResponse(**user_dict))
        
        return UserListResponse(
            users=users,
            total=total,
            page=page,
            limit=limit,
            has_next=has_next,
            has_prev=has_prev
        )
        
    except Exception as e:
        logger.error(f"Failed to get users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve users"
        )


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_details(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db = Depends(get_database)
):
    """
    Get full user details by ID.
    
    All routes: require_admin
    Response: Full user details
    """
    try:
        users_collection = db.users
        
        # Find user by ID
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Convert ObjectId to string for UserResponse
        user_dict = dict(user)
        user_dict["_id"] = str(user_dict["_id"])
        
        return UserResponse(**user_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get user details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user details"
        )


@router.patch("/users/{user_id}/ban")
async def ban_user(
    user_id: str,
    request: UserBanRequest,
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db = Depends(get_database)
):
    """
    Ban or unban a user.
    
    Body: { reason: str }
    If user is already banned, this will unban them.
    """
    try:
        users_collection = db.users
        
        # Find user
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check permission
        if not PermissionChecker.can_ban_user(current_user, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot ban this user"
            )
        
        # Toggle ban status
        is_banned = not user.get("is_banned", False)
        
        update_data = {
            "is_banned": is_banned,
            "ban_reason": request.reason if is_banned else None,
            "updated_at": datetime.utcnow()
        }
        
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        action = "banned" if is_banned else "unbanned"
        logger.info(f"User {user_id} {action} by admin {current_user['_id']}")
        
        return {
            "success": True,
            "message": f"User {action} successfully",
            "is_banned": is_banned
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to ban/unban user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user status"
        )


@router.patch("/users/{user_id}/role")
async def change_user_role(
    user_id: str,
    request: UserRoleUpdateRequest,
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db = Depends(get_database)
):
    """
    Change user role.
    
    Body: { role: "farmer" | "agronomist" | "admin" }
    """
    try:
        users_collection = db.users
        
        # Find user
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check permission
        if not PermissionChecker.can_change_role(current_user, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot change this user's role"
            )
        
        # Update role
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "role": request.role,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        logger.info(f"User {user_id} role changed to {request.role} by admin {current_user['_id']}")
        
        return {
            "success": True,
            "message": "User role updated successfully",
            "new_role": request.role
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to change user role: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user role"
        )


@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db = Depends(get_database),
    redis = Depends(get_redis_client)
):
    """
    Get comprehensive admin statistics.
    
    Response:
    {
        total_users, farmers, agronomists, admins,
        active_today, new_this_week,
        total_recommendations, total_chats,
        cache_hit_rate, avg_response_ms
    }
    """
    try:
        users_collection = db.users
        
        # Get user statistics
        total_users = await users_collection.count_documents({})
        farmers = await users_collection.count_documents({"role": "farmer"})
        agronomists = await users_collection.count_documents({"role": "agronomist"})
        admins = await users_collection.count_documents({"role": "admin"})
        
        # Active users today (last 24 hours)
        today = datetime.utcnow()
        yesterday = today - timedelta(days=1)
        active_today = await users_collection.count_documents({
            "last_login": {"$gte": yesterday}
        })
        
        # New users this week
        week_ago = today - timedelta(days=7)
        new_this_week = await users_collection.count_documents({
            "created_at": {"$gte": week_ago}
        })
        
        # Get Redis cache stats
        cache_info = await redis.info("memory")
        cache_stats = await redis.info("stats")
        cache_hit_rate = cache_stats.get("keyspace_hits", 0) / max(
            cache_stats.get("keyspace_hits", 0) + cache_stats.get("keyspace_misses", 1), 1
        ) * 100
        
        # Get other statistics (placeholder values for now)
        total_recommendations = 0  # TODO: Implement recommendation tracking
        total_chats = 0  # TODO: Implement chat tracking
        avg_response_ms = 150  # TODO: Implement response time tracking
        
        return AdminStatsResponse(
            total_users=total_users,
            farmers=farmers,
            agronomists=agronomists,
            admins=admins,
            active_today=active_today,
            new_this_week=new_this_week,
            total_recommendations=total_recommendations,
            total_chats=total_chats,
            cache_hit_rate=round(cache_hit_rate, 2),
            avg_response_ms=avg_response_ms
        )
        
    except Exception as e:
        logger.error(f"Failed to get admin stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve statistics"
        )


@router.get("/logs")
async def get_api_logs(
    limit: int = Query(50, description="Number of recent logs to retrieve"),
    level: Optional[str] = Query(None, description="Filter by log level"),
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """
    Get recent API logs.
    
    Query parameters:
    - limit: Number of logs to retrieve (default: 50, max: 500)
    - level: Filter by log level (info, warning, error)
    
    Response: Recent API logs
    """
    try:
        # This is a placeholder implementation
        # In a real application, you would query your logging system
        # (e.g., Elasticsearch, database logs, etc.)
        
        logs = [
            {
                "timestamp": datetime.utcnow().isoformat(),
                "level": "info",
                "message": "API request processed successfully",
                "endpoint": "/api/v1/auth/login",
                "method": "POST",
                "user_id": None,
                "ip_address": "127.0.0.1",
                "response_time_ms": 120
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(minutes=5)).isoformat(),
                "level": "warning",
                "message": "Rate limit exceeded",
                "endpoint": "/api/v1/auth/register",
                "method": "POST",
                "user_id": None,
                "ip_address": "192.168.1.100",
                "response_time_ms": 50
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(minutes=10)).isoformat(),
                "level": "error",
                "message": "Database connection failed",
                "endpoint": "/api/v1/weather",
                "method": "GET",
                "user_id": "507f1f77bcf86cd799439011",
                "ip_address": "10.0.0.1",
                "response_time_ms": 5000
            }
        ]
        
        # Filter by level if specified
        if level:
            logs = [log for log in logs if log["level"] == level]
        
        # Limit results
        logs = logs[:limit]
        
        return {
            "logs": logs,
            "total": len(logs),
            "limit": limit,
            "level_filter": level
        }
        
    except Exception as e:
        logger.error(f"Failed to get API logs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve logs"
        )


@router.post("/cache/clear")
async def clear_cache(
    pattern: str = Query("*", description="Pattern to match keys (e.g., 'weather:*')"),
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    redis = Depends(get_redis_client)
):
    """
    Clear Redis cache keys matching a pattern.
    
    Query parameters:
    - pattern: Pattern to match keys (default: "*" clears everything)
    
    Response: Cache clearing result
    """
    try:
        if pattern == "*":
            # Direct flush if everything is requested
            await redis.flushdb()
            logger.info(f"Admin {current_user['_id']} cleared entire Redis cache")
            return {"message": "All cache cleared successfully"}
        else:
            # Delete keys matching pattern
            keys = await redis.keys(pattern)
            if keys:
                deleted_count = await redis.delete(*keys)
                logger.info(f"Admin {current_user['_id']} cleared cache pattern '{pattern}': {deleted_count} keys removed")
                return {"message": f"Cleared {deleted_count} keys matching '{pattern}'"}
            else:
                return {"message": f"No keys found matching pattern '{pattern}'"}
        
    except Exception as e:
        logger.error(f"Error clearing cache: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear cache"
        )


@router.get("/cache/stats")
async def get_cache_stats(
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    redis = Depends(get_redis_client)
):
    """
    Get detailed Redis statistics.
    
    Response: Redis cache statistics
    """
    try:
        info = await redis.info()
        
        return {
            "redis_version": info.get("redis_version"),
            "used_memory": info.get("used_memory_human"),
            "used_memory_peak": info.get("used_memory_peak_human"),
            "total_commands_processed": info.get("total_commands_processed"),
            "total_connections_received": info.get("total_connections_received"),
            "connected_clients": info.get("connected_clients"),
            "keyspace_hits": info.get("keyspace_hits", 0),
            "keyspace_misses": info.get("keyspace_misses", 0),
            "hit_rate": round(
                info.get("keyspace_hits", 0) / max(
                    info.get("keyspace_hits", 0) + info.get("keyspace_misses", 1), 1
                ) * 100, 2
            ),
            "uptime_in_seconds": info.get("uptime_in_seconds"),
            "uptime_in_days": info.get("uptime_in_seconds", 0) // 86400
        }
        
    except Exception as e:
        logger.error(f"Error getting cache stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve cache statistics"
        )


@router.get("/jobs/status")
async def get_jobs_status(
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """
    Check the status of background jobs in the scheduler.
    
    Response: Scheduler job status
    """
    try:
        jobs = []
        for job in agro_scheduler.scheduler.get_jobs():
            jobs.append({
                "id": job.id,
                "name": job.name,
                "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
                "trigger": str(job.trigger),
                "pending": job.pending
            })
        
        return {
            "is_running": agro_scheduler.scheduler.running,
            "job_count": len(jobs),
            "jobs": jobs
        }
        
    except Exception as e:
        logger.error(f"Error fetching jobs status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve job status"
        )


@router.get("/system/health")
async def get_system_health(
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db = Depends(get_database),
    redis = Depends(get_redis_client)
):
    """
    Get comprehensive system health status.
    
    Response: System health information
    """
    try:
        health_status = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "services": {}
        }
        
        # Check MongoDB
        try:
            await db.command("ping")
            health_status["services"]["mongodb"] = {
                "status": "healthy",
                "response_time_ms": 10  # Placeholder
            }
        except Exception as e:
            health_status["services"]["mongodb"] = {
                "status": "unhealthy",
                "error": str(e)
            }
            health_status["status"] = "degraded"
        
        # Check Redis
        try:
            await redis.ping()
            health_status["services"]["redis"] = {
                "status": "healthy",
                "response_time_ms": 5  # Placeholder
            }
        except Exception as e:
            health_status["services"]["redis"] = {
                "status": "unhealthy",
                "error": str(e)
            }
            health_status["status"] = "degraded"
        
        # Check Scheduler
        try:
            is_running = agro_scheduler.scheduler.running
            health_status["services"]["scheduler"] = {
                "status": "healthy" if is_running else "stopped",
                "running": is_running
            }
            if not is_running:
                health_status["status"] = "degraded"
        except Exception as e:
            health_status["services"]["scheduler"] = {
                "status": "unhealthy",
                "error": str(e)
            }
            health_status["status"] = "degraded"
        
        return health_status
        
    except Exception as e:
        logger.error(f"Error getting system health: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve system health"
        )


@router.post("/users/{user_id}/verify")
async def verify_user_email(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_role("admin")),
    db = Depends(get_database)
):
    """
    Manually verify a user's email.
    
    This is an admin-only endpoint to manually verify user emails
    in case of issues with email verification.
    """
    try:
        users_collection = db.users
        
        # Find user
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update verification status
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "is_verified": True,
                    "email_verify_token": None,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        logger.info(f"User {user_id} email manually verified by admin {current_user['_id']}")
        
        return {
            "success": True,
            "message": "User email verified successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to verify user email: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify user email"
        )
