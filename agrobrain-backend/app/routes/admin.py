"""
Admin routes for AgroBrain AI backend.
Provides endpoints for system management, cache clearing, and job monitoring.
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.core.security import get_current_active_user
from app.core.redis import redis_manager
from app.core.scheduler import agro_scheduler
from app.core.logger import logger

router = APIRouter()

async def require_admin(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Dependency to restrict access to admin users only."""
    if current_user.get("role") != "admin":
        logger.warning(f"Unauthorized admin access attempt by user: {current_user.get('_id')}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

@router.post("/cache/clear", tags=["Admin"])
async def clear_cache(
    pattern: str = Query("*", description="Pattern to match keys (e.g., 'weather:*')"),
    admin: Dict = Depends(require_admin)
):
    """
    Clear Redis cache keys matching a pattern.
    Default pattern '*' clears everything.
    """
    try:
        if pattern == "*":
            # Direct flush if everything is requested
            await redis_manager.redis.flushdb()
            logger.info(f"Admin {admin['_id']} cleared entire Redis cache")
            return {"message": "All cache cleared successfully"}
        else:
            deleted_count = await redis_manager.delete_cache_pattern(pattern)
            logger.info(f"Admin {admin['_id']} cleared cache pattern '{pattern}': {deleted_count} keys removed")
            return {"message": f"Cleared {deleted_count} keys matching '{pattern}'"}
    except Exception as e:
        logger.error(f"Error clearing cache: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/jobs/status", tags=["Admin"])
async def get_jobs_status(admin: Dict = Depends(require_admin)):
    """
    Check the status of background jobs in the scheduler.
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
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cache/stats", tags=["Admin"])
async def get_cache_stats_endpoint(admin: Dict = Depends(require_admin)):
    """
    Get detailed Redis statistics.
    """
    stats = await redis_manager.get_cache_stats()
    return stats
