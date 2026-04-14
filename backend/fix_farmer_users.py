import asyncio
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from app.core.security import hash_password

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DATABASE_NAME", "agrobrain")

async def fix_farmer_users():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    # Delete all existing farmers
    await db.users.delete_many({"role": "farmer"})
    print("Deleted all existing farmers")

    # Create proper farmer users with email
    farmers = [
        {
            "email": "ramesh@agrobrain.ai",
            "username": "ramesh",
            "hashed_password": hash_password("Farmer@123"),
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
            "email": "sita@agrobrain.ai",
            "username": "sita",
            "hashed_password": hash_password("Farmer@123"),
            "phone": "+919876543210",
            "name": "Sita Devi",
            "language": "hi",
            "avatar_url": "https://picsum.photos/seed/farmer2/200/200.jpg",
            "default_location": {
                "lat": 26.8467,
                "lng": 80.9462,
                "village": "Kanpur",
                "district": "Kanpur Nagar",
                "state": "Uttar Pradesh",
                "pincode": "208001"
            },
            "farm_profile": {
                "total_area_acres": 3.2,
                "soil_type": "clay",
                "primary_crops": ["pulses", "vegetables"],
                "irrigation_type": "tube_well",
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
            "email": "mohan@agrobrain.ai",
            "username": "mohan",
            "hashed_password": hash_password("Farmer@123"),
            "phone": "+919876543211",
            "name": "Mohan Singh",
            "language": "hi",
            "avatar_url": "https://picsum.photos/seed/farmer3/200/200.jpg",
            "default_location": {
                "lat": 25.3176,
                "lng": 82.9739,
                "village": "Varanasi",
                "district": "Varanasi",
                "state": "Uttar Pradesh",
                "pincode": "221001"
            },
            "farm_profile": {
                "total_area_acres": 7.8,
                "soil_type": "loamy",
                "primary_crops": ["rice", "wheat", "pulses"],
                "irrigation_type": "mixed",
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

    # Insert farmers
    result = await db.users.insert_many(farmers)
    print(f"Inserted {len(result.inserted_ids)} farmers with email")

    # Verify insertion
    users = await db.users.find({'role': 'farmer'}).to_list(length=10)
    print(f'Verification: Found {len(users)} farmers:')
    for user in users:
        print(f'  - {user.get("email", "No email")} | {user.get("name", "No name")}')

    client.close()

if __name__ == "__main__":
    asyncio.run(fix_farmer_users())
