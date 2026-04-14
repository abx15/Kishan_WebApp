"""
Agronomist Routes for AgroBrain AI
Provides endpoints for agronomist dashboard functionality
"""

from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger
from app.core.database import get_db
from app.core.security import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/agronomist", tags=["Agronomist"])

# ─────────────────────────────────────────────────────────────────
# GET /agronomist/stats - Get agronomist dashboard statistics
# ─────────────────────────────────────────────────────────────────
@router.get("/stats", status_code=200)
async def get_agronomist_stats(db=Depends(get_db)):
    """Get agronomist dashboard statistics"""
    try:
        current_user = await get_current_user(db)
        
        # Check if user is admin or agronomist
        if current_user.get("role") not in ["admin", "agronomist"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Agronomist access required"
            )
        
        # Get all agronomists count
        total_agronomists = await db.users.count_documents({"role": "agronomist"})
        
        # Get verified agronomists
        verified_agronomists = await db.users.count_documents({
            "role": "agronomist",
            "is_verified": True
        })
        
        # Get consultations count (mock for now)
        total_consultations = 45  # This would come from chat_history
        success_rate = 94  # Mock success rate
        
        # Get crops diagnosed count (mock for now)
        crops_diagnosed = 234  # This would come from chat analysis
        
        stats = {
            "totalAgronomists": total_agronomists,
            "verifiedAgronomists": verified_agronomists,
            "totalConsultations": total_consultations,
            "cropsDiagnosed": crops_diagnosed,
            "successRate": success_rate,
            "farmersHelped": 147
        }
        
        logger.info(f"Agronomist stats fetched: {stats}")
        return stats
        
    except Exception as e:
        logger.error(f"Error fetching agronomist stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch statistics"
        )

# ─────────────────────────────────────────────────────────────────
# GET /agronomist/consultations - Get consultations for agronomist
# ─────────────────────────────────────────────────────────────────
@router.get("/consultations", status_code=200)
async def get_consultations(db=Depends(get_db)):
    """Get consultations for agronomist dashboard"""
    try:
        current_user = await get_current_user(db)
        
        # Check if user is admin or agronomist
        if current_user.get("role") not in ["admin", "agronomist"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Agronomist access required"
            )
        
        # Mock consultations data for now
        consultations = [
            {
                "id": "1",
                "farmer_id": "farmer_1",
                "farmer_name": "Ramesh Kumar",
                "crop": "Wheat",
                "issue": "Yellowing leaves",
                "priority": "high",
                "status": "resolved",
                "created_at": "2024-01-10T10:30:00Z",
                "resolved_at": "2024-01-10T12:00:00Z"
            },
            {
                "id": "2",
                "farmer_id": "farmer_2", 
                "farmer_name": "Suresh Patel",
                "crop": "Rice",
                "issue": "Pest identification",
                "priority": "medium",
                "status": "in-progress",
                "created_at": "2024-01-11T14:15:00Z",
                "resolved_at": None
            },
            {
                "id": "3",
                "farmer_id": "farmer_3",
                "farmer_name": "Mukesh Yadav",
                "crop": "Cotton",
                "issue": "Irrigation advice",
                "priority": "low",
                "status": "pending",
                "created_at": "2024-01-12T09:20:00Z",
                "resolved_at": None
            }
        ]
        
        logger.info(f"Consultations fetched: {len(consultations)} consultations")
        return consultations
        
    except Exception as e:
        logger.error(f"Error fetching consultations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch consultations"
        )

# ─────────────────────────────────────────────────────────────────
# GET /agronomist/advisory-tips - Get advisory tips for agronomist
# ─────────────────────────────────────────────────────────────────
@router.get("/advisory-tips", status_code=200)
async def get_advisory_tips(db=Depends(get_db)):
    """Get advisory tips for agronomist dashboard"""
    try:
        current_user = await get_current_user(db)
        
        # Check if user is admin or agronomist
        if current_user.get("role") not in ["admin", "agronomist"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Agronomist access required"
            )
        
        # Mock advisory tips for now
        tips = [
            {
                "id": "1",
                "title": "Wheat Season Alert",
                "description": "Monitor for rust diseases in current weather conditions",
                "type": "warning",
                "priority": "high",
                "created_at": "2024-01-15T08:00:00Z"
            },
            {
                "id": "2", 
                "title": "Optimal Planting Time",
                "description": "Next 7 days ideal for Rabi crops in North India",
                "type": "success",
                "priority": "medium",
                "created_at": "2024-01-14T10:00:00Z"
            },
            {
                "id": "3",
                "title": "New Pest Treatment",
                "description": "Organic pest control approved for cotton farming",
                "type": "info",
                "priority": "low",
                "created_at": "2024-01-13T12:00:00Z"
            }
        ]
        
        logger.info(f"Advisory tips fetched: {len(tips)} tips")
        return tips
        
    except Exception as e:
        logger.error(f"Error fetching advisory tips: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch advisory tips"
        )
