"""
Agronomist Routes for AgroBrain AI
Provides endpoints for agronomist dashboard functionality.
Enterprise-level: All routes use Depends(get_current_user) properly.
"""

from datetime import datetime, timezone
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger

from app.core.database import get_db
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/agronomist", tags=["Agronomist"])


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _require_agronomist_access(current_user: Dict[str, Any]) -> None:
    """Raise 403 if user is not agronomist/admin."""
    if current_user.get("role") not in ["admin", "agronomist"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agronomist access required",
        )


# ─── GET /agronomist/stats ────────────────────────────────────────────────────
@router.get("/stats", status_code=200)
async def get_agronomist_stats(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get agronomist dashboard statistics."""
    try:
        _require_agronomist_access(current_user)

        total_agronomists = await db.users.count_documents({"role": "agronomist"})
        verified_agronomists = await db.users.count_documents({
            "role": "agronomist",
            "is_verified": True,
        })
        total_farmers = await db.users.count_documents({"role": "farmer"})

        # Chat sessions resolved by this agronomist
        resolved_sessions = await db.chat_sessions.count_documents({
            "agronomist_id": str(current_user["_id"]),
            "is_active": False,
        })

        return {
            "success": True,
            "data": {
                "totalAgronomists": total_agronomists,
                "verifiedAgronomists": verified_agronomists,
                "totalFarmers": total_farmers,
                "resolvedConsultations": resolved_sessions,
                "totalConsultations": 45,    # Placeholder — replace with real query
                "cropsDiagnosed": 234,       # Placeholder
                "successRate": 94,           # Placeholder
                "farmersHelped": 147,        # Placeholder
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching agronomist stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch agronomist statistics",
        )


# ─── GET /agronomist/consultations ────────────────────────────────────────────
@router.get("/consultations", status_code=200)
async def get_consultations(
    limit: int = 20,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get consultations assigned to this agronomist."""
    try:
        _require_agronomist_access(current_user)

        cursor = db.chat_sessions.find(
            {"agronomist_id": str(current_user["_id"])}
        ).sort("started_at", -1).limit(min(limit, 100))

        consultations = []
        async for doc in cursor:
            consultations.append({
                "id": str(doc["_id"]),
                "session_id": doc.get("session_id", ""),
                "farmer_id": doc.get("user_id", ""),
                "is_active": doc.get("is_active", True),
                "total_messages": doc.get("total_messages", 0),
                "started_at": doc.get("started_at", datetime.now(timezone.utc)).isoformat(),
                "context": doc.get("context", {}),
            })

        # If no real data, return structured empty response
        return {
            "success": True,
            "data": {
                "consultations": consultations,
                "total": len(consultations),
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch consultations",
        )


# ─── GET /agronomist/advisory-tips ────────────────────────────────────────────
@router.get("/advisory-tips", status_code=200)
async def get_advisory_tips(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get advisory tips for the agronomist dashboard."""
    try:
        _require_agronomist_access(current_user)

        # Fetch from DB — fall back to static if collection empty
        cursor = db.advisory_tips.find({}).sort("created_at", -1).limit(10)
        tips = []
        async for doc in cursor:
            tips.append({
                "id": str(doc["_id"]),
                "title": doc.get("title", ""),
                "description": doc.get("description", ""),
                "type": doc.get("type", "info"),
                "priority": doc.get("priority", "low"),
                "created_at": doc.get("created_at", datetime.now(timezone.utc)).isoformat(),
            })

        # Default tips if DB is empty
        if not tips:
            tips = [
                {
                    "id": "tip_1",
                    "title": "Wheat Season Alert",
                    "description": "Monitor for rust diseases in current weather conditions",
                    "type": "warning",
                    "priority": "high",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "id": "tip_2",
                    "title": "Optimal Planting Window",
                    "description": "Next 7 days ideal for Rabi crops in North India",
                    "type": "success",
                    "priority": "medium",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "id": "tip_3",
                    "title": "Organic Pest Control Approved",
                    "description": "New organic treatment available for cotton bollworm",
                    "type": "info",
                    "priority": "low",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                },
            ]

        return {
            "success": True,
            "data": {"tips": tips, "total": len(tips)},
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching advisory tips: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch advisory tips",
        )


# ─── GET /agronomist/farmers ───────────────────────────────────────────────────
@router.get("/farmers", status_code=200)
async def get_assigned_farmers(
    limit: int = 20,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get farmers who have interacted with this agronomist."""
    try:
        _require_agronomist_access(current_user)

        # Get unique farmer IDs from chat sessions
        cursor = db.chat_sessions.find(
            {"agronomist_id": str(current_user["_id"])}
        ).limit(100)

        farmer_ids = set()
        async for doc in cursor:
            farmer_ids.add(doc.get("user_id"))

        # Fetch farmer details
        farmers = []
        from bson import ObjectId
        for fid in list(farmer_ids)[:min(limit, 50)]:
            try:
                user = await db.users.find_one({"_id": ObjectId(fid)})
                if user:
                    farmers.append({
                        "id": str(user["_id"]),
                        "name": user.get("name", ""),
                        "email": user.get("email", ""),
                        "village": user.get("default_location", {}).get("village", ""),
                        "state": user.get("default_location", {}).get("state", ""),
                        "last_login": (
                            user["last_login"].isoformat()
                            if user.get("last_login") else None
                        ),
                    })
            except Exception:
                pass

        return {
            "success": True,
            "data": {"farmers": farmers, "total": len(farmers)},
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching assigned farmers: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch farmer list",
        )
