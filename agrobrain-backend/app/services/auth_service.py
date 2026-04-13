"""
Authentication service for AgroBrain AI backend.

This module handles Firebase token verification, user management,
JWT token creation/validation, and authentication flow.
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Union

import firebase_admin
from firebase_admin import auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from bson import ObjectId

from app.core.config import settings
from app.core.logger import logger
from app.core.database import get_database
from app.core.redis import get_redis_client
from app.models.user import UserDocument
from app.schemas.user import UserResponse, TokenResponse

# JWT Configuration
JWT_SECRET_KEY = settings.jwt_secret_key
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30

# Security scheme for Bearer tokens
security = HTTPBearer()


class AuthService:
    """Service class for handling authentication operations."""
    
    def __init__(self):
        """Initialize AuthService with Firebase Admin SDK."""
        self.logger = logger.bind(service="auth")
    
    async def verify_firebase_token(self, id_token: str, phone: Optional[str] = None) -> Dict[str, Any]:
        """
        Verify Firebase ID token and extract user information.
        Falls back to dev OTP mode if Firebase is not configured.
        """
        # DEV MODE FALLBACK
        if id_token == "123456" or not firebase_admin._apps:
            self.logger.warning(f"Firebase not configured or dev OTP used, using dev mode for phone: {phone}")
            if not phone:
                 raise HTTPException(status_code=400, detail="Phone number required for dev OTP mode")
            return {
                "phone": phone,
                "uid": f"dev_user_{phone}",
                "verified": True
            }

        try:
            # Verify the ID token with Firebase Admin SDK
            decoded_token = auth.verify_id_token(id_token)
            
            # Extract phone number from token
            phone_number = decoded_token.get('phone_number')
            uid = decoded_token.get('uid')
            
            if not phone_number:
                self.logger.error("Phone number not found in Firebase token")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number not found in token"
                )
            
            # Mask phone for logging
            masked_phone = f"+91XXXXXX{phone_number[-4:]}" if len(phone_number) > 4 else phone_number
            self.logger.info(f"Firebase token verified for phone: {masked_phone}")
            
            return {
                "phone": phone_number,
                "uid": uid,
                "verified": True
            }
            
        except auth.ExpiredIdTokenError:
            self.logger.warning("Expired Firebase ID token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
            
        except auth.InvalidIdTokenError:
            self.logger.warning("Invalid Firebase ID token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
            
        except auth.RevokedIdTokenError:
            self.logger.warning("Revoked Firebase ID token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked"
            )
            
        except Exception as e:
            self.logger.error(f"Firebase token verification failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token verification failed"
            )
    
    async def get_or_create_user(self, phone: str) -> Dict[str, Any]:
        """
        Get existing user or create new user from phone number.
        
        Args:
            phone: Phone number in E.164 format
            
        Returns:
            User document data
        """
        try:
            db = get_database()
            users_collection = db.users
            
            # Check if user exists
            existing_user = await users_collection.find_one({"phone": phone})
            
            if existing_user:
                # Update last login for existing user
                await users_collection.update_one(
                    {"_id": existing_user["_id"]},
                    {"$set": {"last_login": datetime.utcnow(), "updated_at": datetime.utcnow()}}
                )
                
                # Mask phone for logging
                masked_phone = f"+91XXXXXX{phone[-4:]}" if len(phone) > 4 else phone
                self.logger.info(f"Existing user logged in: {masked_phone}")
                
                return existing_user
            
            else:
                # Create new user with defaults
                new_user = UserDocument(
                    phone=phone,
                    language="hi",  # Default to Hindi for Indian farmers
                    role="farmer",
                    is_verified=True,
                    is_active=True
                )
                
                # Set default profiles
                new_user.set_default_farm_profile()
                new_user.set_default_location()
                new_user.update_last_login()
                
                # Insert into database
                user_dict = new_user.to_dict()
                result = await users_collection.insert_one(user_dict)
                
                # Get the inserted document
                created_user = await users_collection.find_one({"_id": result.inserted_id})
                
                # Mask phone for logging
                masked_phone = f"+91XXXXXX{phone[-4:]}" if len(phone) > 4 else phone
                self.logger.info(f"New user created: {masked_phone}")
                
                return created_user
                
        except Exception as e:
            self.logger.error(f"User creation/retrieval failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User operation failed"
            )
    
    async def create_tokens(self, user_id: str, phone: str, role: str) -> TokenResponse:
        """
        Create JWT access and refresh tokens.
        
        Args:
            user_id: MongoDB user ID
            phone: User phone number
            role: User role
            
        Returns:
            TokenResponse with access and refresh tokens
        """
        try:
            now = datetime.utcnow()
            
            # Create access token payload
            access_payload = {
                "sub": user_id,
                "phone": phone,
                "role": role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            }
            
            # Create refresh token payload
            refresh_payload = {
                "sub": user_id,
                "type": "refresh",
                "iat": now,
                "exp": now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
            }
            
            # Generate tokens
            access_token = jwt.encode(access_payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
            refresh_token = jwt.encode(refresh_payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
            
            # Store refresh token in Redis
            redis_client = get_redis_client()
            refresh_key = f"refresh:{user_id}"
            await redis_client.setex(
                refresh_key,
                timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
                refresh_token
            )
            
            self.logger.info(f"Tokens created for user: {user_id}")
            
            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="Bearer",
                expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
            )
            
        except Exception as e:
            self.logger.error(f"Token creation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token creation failed"
            )
    
    async def refresh_access_token(self, refresh_token: str) -> TokenResponse:
        """
        Refresh access token using refresh token.
        
        Args:
            refresh_token: JWT refresh token
            
        Returns:
            New TokenResponse
        """
        try:
            # Verify refresh token
            payload = jwt.decode(refresh_token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            
            # Validate token type
            if payload.get("type") != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload"
                )
            
            # Check if refresh token exists in Redis (not revoked)
            redis_client = get_redis_client()
            refresh_key = f"refresh:{user_id}"
            stored_token = await redis_client.get(refresh_key)
            
            if not stored_token or stored_token != refresh_token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Refresh token invalid or revoked"
                )
            
            # Get user from database
            db = get_database()
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            
            if not user or not user.get("is_active"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found or inactive"
                )
            
            # Create new tokens
            return await self.create_tokens(
                user_id=str(user["_id"]),
                phone=user["phone"],
                role=user["role"]
            )
            
        except JWTError as e:
            self.logger.warning(f"JWT decode error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
            
        except HTTPException:
            raise
            
        except Exception as e:
            self.logger.error(f"Token refresh failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token refresh failed"
            )
    
    async def logout(self, user_id: str) -> bool:
        """
        Logout user by removing refresh token from Redis.
        
        Args:
            user_id: User ID to logout
            
        Returns:
            True if successful
        """
        try:
            redis_client = get_redis_client()
            refresh_key = f"refresh:{user_id}"
            
            # Delete refresh token from Redis
            result = await redis_client.delete(refresh_key)
            
            self.logger.info(f"User logged out: {user_id}")
            return result > 0
            
        except Exception as e:
            self.logger.error(f"Logout failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Logout failed"
            )
    
    async def get_current_user(
        self, 
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ) -> Dict[str, Any]:
        """
        FastAPI dependency to get current authenticated user.
        
        Args:
            credentials: Bearer token from Authorization header
            
        Returns:
            User document from database
            
        Raises:
            HTTPException: If authentication fails
        """
        try:
            # Extract and verify access token
            token = credentials.credentials
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            
            # Validate token type
            if payload.get("type") != "access":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload"
                )
            
            # Get user from database
            db = get_database()
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found"
                )
            
            if not user.get("is_active"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User account is inactive"
                )
            
            return user
            
        except JWTError as e:
            self.logger.warning(f"JWT decode error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
            
        except HTTPException:
            raise
            
        except Exception as e:
            self.logger.error(f"Authentication failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication failed"
            )


# Create singleton instance
auth_service = AuthService()


# Dependency function
get_current_user = auth_service.get_current_user
