import asyncio
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from app.core.security import hash_password

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DATABASE_NAME", "agrobrain")

async def create_admin_agronomist():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    # Create admin user
    admin = {
        "email": "admin@agrobrain.ai",
        "username": "admin",
        "hashed_password": hash_password("Admin@123"),
        "name": "System Administrator",
        "role": "admin",
        "is_verified": True,
        "is_active": True,
        "is_approved": True,
        "language": "en",
        "avatar_url": "https://picsum.photos/seed/admin/200/200.jpg",
        "login_count": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "last_login": None
    }

    # Create agronomist users
    agronomists = [
        {
            "email": "sharma@agrobrain.ai",
            "username": "sharma",
            "hashed_password": hash_password("Agronomist@123"),
            "name": "Dr. Rajesh Sharma",
            "role": "agronomist",
            "phone": "+919876543212",
            "language": "hi",
            "avatar_url": "https://picsum.photos/seed/agronomist1/200/200.jpg",
            "specialization": "crop_diseases",
            "experience_years": 15,
            "education": "PhD in Agriculture",
            "license_number": "AG-2023-001",
            "states_served": ["Uttar Pradesh", "Punjab", "Haryana"],
            "is_verified": True,
            "is_active": True,
            "is_approved": True,
            "login_count": 0,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "last_login": None
        },
        {
            "email": "patel@agrobrain.ai",
            "username": "patel",
            "hashed_password": hash_password("Agronomist@123"),
            "name": "Dr. Amit Patel",
            "role": "agronomist",
            "phone": "+919876543213",
            "language": "hi",
            "avatar_url": "https://picsum.photos/seed/agronomist2/200/200.jpg",
            "specialization": "soil_science",
            "experience_years": 12,
            "education": "MSc in Soil Science",
            "license_number": "AG-2023-002",
            "states_served": ["Gujarat", "Maharashtra", "Rajasthan"],
            "is_verified": True,
            "is_active": True,
            "is_approved": True,
            "login_count": 0,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "last_login": None
        }
    ]

    try:
        # Insert admin
        result = await db.users.insert_one(admin)
        print(f"✅ Created admin user: {admin['email']}")

        # Insert agronomists
        for agronomist in agronomists:
            result = await db.users.insert_one(agronomist)
            print(f"✅ Created agronomist user: {agronomist['email']}")

        # Verify all users
        users = await db.users.find({}).to_list(length=20)
        print(f"\n📊 Total users in database: {len(users)}")
        
        print("\n👥 All Users:")
        for user in users:
            email = user.get("email", "No email")
            name = user.get("name", "No name")
            role = user.get("role", "No role")
            has_password = "hashed_password" in user
            is_active = user.get("is_active", False)
            
            print(f"  - {email} | {name} | {role} | Password: {has_password} | Active: {is_active}")

    except Exception as e:
        print(f"❌ Error creating users: {str(e)}")

    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin_agronomist())
