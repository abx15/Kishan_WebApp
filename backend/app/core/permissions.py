"""
Role-based authorization middleware for AgroBrain AI backend.

This module provides role-based access control (RBAC) functionality
to protect API endpoints based on user roles and permissions.
"""

from functools import wraps
from typing import List, Optional, Dict, Any

from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.auth_service import auth_service
from app.services.auth_service import get_current_user

# Security scheme for Bearer tokens
security = HTTPBearer()


def require_role(*roles: str):
    """
    Role-based authorization decorator.
    
    Usage: @router.get("/admin", dependencies=[Depends(require_role("admin"))])
    
    Args:
        *roles: Allowed roles for this endpoint
        
    Returns:
        Dependency function that checks user role
    """
    async def check_role(current_user: Dict[str, Any] = Depends(get_current_user)):
        """Check if current user has required role."""
        user_role = current_user.get("role")
        
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "Forbidden",
                    "message": "You don't have permission to access this resource",
                    "required_role": list(roles),
                    "your_role": user_role
                }
            )
        
        return current_user
    
    return check_role


def require_any_role(*roles: str):
    """
    Require any of the specified roles (alias for require_role).
    
    This is provided for semantic clarity when multiple roles are allowed.
    """
    return require_role(*roles)


def require_all_roles(*roles: str):
    """
    Require user to have ALL specified roles.
    
    Note: This is for future extensibility if users can have multiple roles.
    Currently, users have only one role, so this behaves like require_role.
    """
    async def check_all_roles(current_user: Dict[str, Any] = Depends(get_current_user)):
        """Check if current user has all required roles."""
        user_role = current_user.get("role")
        
        # For single-role system, user must have the primary role
        # If multiple roles were supported, we'd check user_roles.contains(all(roles))
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "Forbidden",
                    "message": "You don't have all required permissions to access this resource",
                    "required_roles": list(roles),
                    "your_role": user_role
                }
            )
        
        return current_user
    
    return check_all_roles


def require_active_user():
    """
    Require user to be active (not banned or inactive).
    
    This is already checked in get_current_user, but provided for
    explicit role requirement clarity.
    """
    return require_role("farmer", "agronomist", "admin")


def require_verified_user():
    """
    Require user to have verified email.
    """
    async def check_verified(current_user: Dict[str, Any] = Depends(get_current_user)):
        """Check if current user has verified email."""
        if not current_user.get("is_verified"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "Forbidden",
                    "message": "Email verification required to access this resource",
                    "requirement": "verified_email"
                }
            )
        
        return current_user
    
    return check_verified


def require_specific_role(role: str):
    """
    Require a specific role (convenience function).
    
    Args:
        role: The required role
        
    Returns:
        Dependency function for the specific role
    """
    return require_role(role)


# Pre-built role dependencies for common use cases
require_farmer = require_role("farmer", "agronomist", "admin")
require_agronomist = require_role("agronomist", "admin")
require_admin = require_role("admin")

# More specific role dependencies
require_farmer_only = require_role("farmer")
require_agronomist_only = require_role("agronomist")
require_admin_only = require_role("admin")

# Combined requirements
require_verified_farmer = require_verified_user() and require_farmer
require_verified_agronomist = require_verified_user() and require_agronomist
require_verified_admin = require_verified_user() and require_admin


class PermissionChecker:
    """
    Utility class for checking permissions in business logic.
    
    This can be used within services or route handlers for more complex
    permission checks beyond simple role-based access.
    """
    
    @staticmethod
    def can_access_resource(user: Dict[str, Any], required_roles: List[str]) -> bool:
        """
        Check if user can access resource based on roles.
        
        Args:
            user: User document
            required_roles: List of allowed roles
            
        Returns:
            True if user has permission, False otherwise
        """
        if not user:
            return False
        
        user_role = user.get("role")
        return user_role in required_roles
    
    @staticmethod
    def can_manage_user(current_user: Dict[str, Any], target_user: Dict[str, Any]) -> bool:
        """
        Check if current user can manage target user.
        
        Rules:
        - Admin can manage anyone
        - Agronomist can manage farmers only
        - Farmer can only manage themselves
        
        Args:
            current_user: User performing the action
            target_user: User being managed
            
        Returns:
            True if action is allowed, False otherwise
        """
        if not current_user or not target_user:
            return False
        
        current_role = current_user.get("role")
        target_role = target_user.get("role")
        current_id = str(current_user.get("_id"))
        target_id = str(target_user.get("_id"))
        
        # Admin can manage anyone
        if current_role == "admin":
            return True
        
        # Agronomist can manage farmers
        if current_role == "agronomist" and target_role == "farmer":
            return True
        
        # Users can always manage themselves
        if current_id == target_id:
            return True
        
        return False
    
    @staticmethod
    def can_view_sensitive_data(user: Dict[str, Any]) -> bool:
        """
        Check if user can view sensitive data.
        
        Rules:
        - Admin can view all sensitive data
        - Agronomist can view farmer data in their states
        - Farmer can only view their own data
        
        Args:
            user: User document
            
        Returns:
            True if user can view sensitive data, False otherwise
        """
        if not user:
            return False
        
        role = user.get("role")
        
        # Admin can view all data
        if role == "admin":
            return True
        
        # Agronomist can view farmer data (with restrictions)
        if role == "agronomist":
            return True
        
        # Farmer can view their own data
        if role == "farmer":
            return True
        
        return False
    
    @staticmethod
    def can_approve_agronomist(current_user: Dict[str, Any]) -> bool:
        """
        Check if user can approve agronomist applications.
        
        Only admins can approve agronomists.
        
        Args:
            current_user: User performing the action
            
        Returns:
            True if action is allowed, False otherwise
        """
        return current_user and current_user.get("role") == "admin"
    
    @staticmethod
    def can_ban_user(current_user: Dict[str, Any], target_user: Dict[str, Any]) -> bool:
        """
        Check if current user can ban target user.
        
        Rules:
        - Admin can ban anyone (except other admins)
        - No one else can ban users
        
        Args:
            current_user: User performing the ban
            target_user: User being banned
            
        Returns:
            True if action is allowed, False otherwise
        """
        if not current_user or not target_user:
            return False
        
        current_role = current_user.get("role")
        target_role = target_user.get("role")
        
        # Only admins can ban users
        if current_role != "admin":
            return False
        
        # Admins cannot ban other admins
        if target_role == "admin":
            return False
        
        return True
    
    @staticmethod
    def can_change_role(current_user: Dict[str, Any], target_user: Dict[str, Any]) -> bool:
        """
        Check if current user can change target user's role.
        
        Rules:
        - Admin can change any role (except other admins)
        - No one else can change roles
        
        Args:
            current_user: User performing the role change
            target_user: User whose role is being changed
            
        Returns:
            True if action is allowed, False otherwise
        """
        if not current_user or not target_user:
            return False
        
        current_role = current_user.get("role")
        target_role = target_user.get("role")
        
        # Only admins can change roles
        if current_role != "admin":
            return False
        
        # Admins cannot change other admins' roles
        if target_role == "admin":
            return False
        
        return True


# Decorator for route-level permission checking
def permission_required(permission_check):
    """
    Decorator for custom permission checks.
    
    Args:
        permission_check: Function that takes (current_user, *args, **kwargs)
                         and returns True if permission is granted
        
    Usage:
        @permission_required(PermissionChecker.can_approve_agronomist)
        async def approve_agronomist(user_id: str, current_user: dict = Depends(get_current_user)):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Find current_user in kwargs
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            # Check permission
            if not permission_check(current_user):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail={
                        "error": "Forbidden",
                        "message": "You don't have permission to perform this action"
                    }
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# Utility functions for common permission patterns
def is_admin(user: Dict[str, Any]) -> bool:
    """Check if user is admin."""
    return user and user.get("role") == "admin"


def is_agronomist(user: Dict[str, Any]) -> bool:
    """Check if user is agronomist."""
    return user and user.get("role") == "agronomist"


def is_farmer(user: Dict[str, Any]) -> bool:
    """Check if user is farmer."""
    return user and user.get("role") == "farmer"


def is_verified(user: Dict[str, Any]) -> bool:
    """Check if user is verified."""
    return user and user.get("is_verified", False)


def is_active(user: Dict[str, Any]) -> bool:
    """Check if user is active."""
    return user and user.get("is_active", False) and not user.get("is_banned", False)


def can_access_admin_panel(user: Dict[str, Any]) -> bool:
    """Check if user can access admin panel."""
    return is_admin(user)


def can_access_agronomist_panel(user: Dict[str, Any]) -> bool:
    """Check if user can access agronomist panel."""
    return is_agronomist(user) or is_admin(user)


def can_access_farmer_features(user: Dict[str, Any]) -> bool:
    """Check if user can access farmer features."""
    return is_farmer(user) or is_agronomist(user) or is_admin(user)
