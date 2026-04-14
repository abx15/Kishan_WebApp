#!/usr/bin/env python3
"""
Real Data Seeding Script for AgroBrain AI
Populates database with realistic farming data for testing dashboards
"""

import asyncio
import sys
from datetime import datetime, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.database import connect_db
from app.core.security import hash_password
from app.schemas.user import RegisterRequest
from bson import ObjectId

# Realistic data for Indian agriculture
REAL_NAMES = {
    'farmers': [
        'Ramesh Kumar', 'Suresh Patel', 'Amit Singh', 'Rajesh Sharma', 
        'Mukesh Yadav', 'Vikram Reddy', 'Dinesh Kumar', 'Mahesh Singh',
        'Prakash Gupta', 'Anand Verma', 'Gopal Krishnan', 'Nitin Sharma',
        'Sanjay Kumar', 'Ravi Teja', 'Kiran Rao', 'Manoj Kumar', 'Arjun Patel'
    ],
    'agronomists': [
        'Dr. Priya Sharma', 'Dr. Amit Kumar', 'Dr. Sunita Rao', 'Dr. Rajesh Verma',
        'Dr. Meera Patel', 'Dr. Anand Gupta', 'Dr. Pooja Singh', 'Dr. Neha Sharma'
    ],
    'admins': [
        'Admin User', 'System Admin', 'Super Admin'
    ]
}

INDIAN_STATES = [
    'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan',
    'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh',
    'West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Chhattisgarh'
]

CROPS = [
    'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Pulses', 'Oilseeds',
    'Vegetables', 'Fruits', 'Spices', 'Tea', 'Coffee', 'Rubber'
]

WEATHER_CONDITIONS = [
    'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain',
    'Thunderstorm', 'Foggy', 'Clear', 'Hazy', 'Windy'
]

FARMER_ISSUES = [
    'Yellowing leaves', 'Pest identification', 'Irrigation advice', 'Soil testing',
    'Fertilizer recommendation', 'Crop disease', 'Low yield', 'Weed control',
    'Harvesting advice', 'Market prices query', 'Seed selection'
]

async def create_users(db):
    """Create realistic users"""
    print("Creating users...")
    
    # Create admin users
    for i, name in enumerate(REAL_NAMES['admins'][:2]):
        email = f"admin{i+1}@agrobrain.ai"
        user_doc = {
            "username": f"admin{i+1}",
            "email": email,
            "name": name,
            "hashed_password": hash_password("Admin123!"),
            "role": "admin",
            "language": random.choice(["hi", "en"]),
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "avatar_url": None,
            "bio": f"System administrator for AgroBrain AI",
            "default_location": {
                "lat": random.uniform(8.0, 35.0),
                "lng": random.uniform(68.0, 97.0),
                "village": random.choice(["Delhi", "Mumbai", "Bangalore", "Chennai"]),
                "district": random.choice(["North Delhi", "South Delhi", "East Delhi", "West Delhi"]),
                "state": random.choice(INDIAN_STATES),
                "pincode": f"{random.randint(110001, 110099):06d}"
            },
            "farm_profile": {
                "total_area_acres": round(random.uniform(2.0, 50.0), 2),
                "soil_type": random.choice(["Black", "Red", "Alluvial", "Laterite"]),
                "primary_crops": random.sample(CROPS, k=3),
                "irrigation_type": random.choice(["Drip", "Flood", "Sprinkler", "Canal"]),
                "has_soil_sensor": random.choice([True, False])
            },
            "login_count": random.randint(50, 500),
            "last_login": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30)),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        result = await db.users.insert_one(user_doc)
        print(f"Created admin: {name} ({result.inserted_id})")

    # Create agronomist users
    for i, name in enumerate(REAL_NAMES['agronomists'][:4]):
        email = f"agronomist{i+1}@agrobrain.ai"
        user_doc = {
            "username": f"dr_{name.lower().replace(' ', '_')}",
            "email": email,
            "name": name,
            "hashed_password": hash_password("Agronomist123!"),
            "role": "agronomist",
            "language": random.choice(["hi", "en"]),
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "avatar_url": None,
            "bio": f"Agricultural expert specializing in {random.sample(['wheat', 'rice', 'cotton'])}",
            "default_location": {
                "lat": random.uniform(8.0, 35.0),
                "lng": random.uniform(68.0, 97.0),
                "village": random.choice(["Ludhiana", "Jaipur", "Bhopal", "Lucknow"]),
                "district": random.choice(["Ludhiana", "Jaipur", "Bhopal", "Lucknow"]),
                "state": random.choice(INDIAN_STATES),
                "pincode": f"{random.randint(110001, 110099):06d}"
            },
            "agronomist_profile": {
                "specialization": random.sample(["Soil Science", "Plant Pathology", "Entomology", "Agronomy"]),
                "experience_years": random.randint(5, 25),
                "states_served": random.sample(INDIAN_STATES, k=5),
                "is_approved": random.choice([True, False])
            },
            "login_count": random.randint(20, 200),
            "last_login": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 15)),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        result = await db.users.insert_one(user_doc)
        print(f"Created agronomist: {name} ({result.inserted_id})")

    # Create farmer users
    for i, name in enumerate(REAL_NAMES['farmers'][:8]):
        email = f"farmer{i+1}@agrobrain.ai"
        user_doc = {
            "username": f"farmer_{name.lower().replace(' ', '_')}",
            "email": email,
            "name": name,
            "hashed_password": hash_password("Farmer123!"),
            "role": "farmer",
            "language": random.choice(["hi", "en"]),
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "avatar_url": None,
            "bio": f"Farmer from {random.choice(INDIAN_STATES)} with {random.randint(2, 20)} years experience",
            "default_location": {
                "lat": random.uniform(8.0, 35.0),
                "lng": random.uniform(68.0, 97.0),
                "village": random.choice(["Mehsana", "Bhiwani", "Alwar", "Bharatpur"]),
                "district": random.choice(["Mathura", "Agra", "Aligarh", "Etah"]),
                "state": "Uttar Pradesh",
                "pincode": f"{random.randint(201301, 205001):06d}"
            },
            "farm_profile": {
                "total_area_acres": round(random.uniform(1.0, 25.0), 2),
                "soil_type": random.choice(["Black", "Red", "Alluvial", "Laterite"]),
                "primary_crops": random.sample(CROPS, k=2),
                "irrigation_type": random.choice(["Drip", "Flood", "Sprinkler", "Canal"]),
                "has_soil_sensor": random.choice([True, False])
            },
            "login_count": random.randint(10, 100),
            "last_login": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 7)),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        result = await db.users.insert_one(user_doc)
        print(f"Created farmer: {name} ({result.inserted_id})")

async def create_farm_data(db):
    """Create farm-related data"""
    print("Creating farm data...")
    
    # Get all farmers
    farmers = await db.users.find({"role": "farmer"}).to_list(length=None)
    
    for farmer in farmers:
        # Create crop recommendations for each farmer
        for _ in range(random.randint(2, 5)):
            crop_rec = {
                "user_id": farmer["_id"],
                "crop": random.choice(CROPS),
                "season": random.choice(["Rabi", "Kharif", "Zaid"]),
                "suitability": random.randint(60, 100),
                "expected_yield": f"{random.uniform(2.0, 8.0):.1f} tons/ha",
                "market_price": f"Rs {random.randint(1000, 8000)}/quintal",
                "recommendation": random.choice([
                    "Ideal for current weather conditions",
                    "Consider organic fertilizers",
                    "Monitor for pest activity",
                    "Optimal planting time approaching"
                ]),
                "created_at": datetime.now(timezone.utc),
                "status": random.choice(["active", "pending", "completed"])
            }
            await db.crop_recommendations.insert_one(crop_rec)
        
        # Create weather data for each farmer
        for _ in range(random.randint(3, 7)):
            weather_data = {
                "user_id": farmer["_id"],
                "location": farmer["default_location"]["village"],
                "temperature": round(random.uniform(15, 40), 1),
                "humidity": random.randint(30, 90),
                "condition": random.choice(WEATHER_CONDITIONS),
                "rainfall": round(random.uniform(0, 50), 1),
                "created_at": datetime.now(timezone.utc)
            }
            await db.weather_logs.insert_one(weather_data)

async def create_agronomist_data(db):
    """Create agronomist-related data"""
    print("Creating agronomist data...")
    
    # Get all agronomists
    agronomists = await db.users.find({"role": "agronomist"}).to_list(length=None)
    
    # Create farmer requests for agronomists to handle
    for _ in range(20):  # Create 20 farmer requests
        farmer = random.choice(farmers) if farmers else None
        if farmer:
            request = {
                "agronomist_id": random.choice(agronomists)["_id"] if agronomists else None,
                "farmer_id": farmer["_id"],
                "farmer_name": farmer["name"],
                "location": farmer["default_location"]["village"],
                "crop": random.choice(CROPS),
                "issue": random.choice(FARMER_ISSUES),
                "priority": random.choice(["high", "medium", "low"]),
                "description": f"Need advice regarding {random.choice(FARMER_ISSUES).lower()} in {random.choice(CROPS)}",
                "status": random.choice(["pending", "in-progress", "resolved", "closed"]),
                "created_at": datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30)),
                "resolved_at": datetime.now(timezone.utc) if random.random() > 0.7 else None
            }
            await db.farmer_requests.insert_one(request)

async def create_chat_sessions(db):
    """Create chat sessions for users"""
    print("Creating chat sessions...")
    
    # Get all users
    users = await db.users.find({}).to_list(length=None)
    
    for user in users[:10]:  # Create sessions for first 10 users
        for _ in range(random.randint(1, 5)):
            session = {
                "user_id": user["_id"],
                "session_id": str(ObjectId()),
                "title": f"{random.choice(['Crop Advice', 'Weather Query', 'Soil Analysis', 'Pest Control'])} - {user['name']}",
                "messages": [
                    {
                        "role": "user",
                        "content": f"What should I plant for {random.choice(['wheat', 'rice'])} this season?",
                        "timestamp": datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 24))
                    },
                    {
                        "role": "assistant", 
                        "content": f"Based on your location and soil conditions, I recommend planting {random.choice(CROPS)}. The current weather is suitable for {random.choice(['early sowing', 'transplanting'])}.",
                        "timestamp": datetime.now(timezone.utc) - timedelta(hours=random.randint(0, 23))
                    }
                ],
                "total_messages": 2,
                "started_at": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30)),
                "last_activity": datetime.now(timezone.utc) - timedelta(days=random.randint(0, 7))
            }
            await db.chat_history.insert_one(session)

async def main():
    """Main seeding function"""
    try:
        # Connect to database
        await connect_db()
        
        # Get database instance
        from app.core.database import db_instance
        db = db_instance.db
        
        print("Starting real data seeding...")
        
        # Create users
        await create_users(db)
        
        # Create farm data
        await create_farm_data(db)
        
        # Create agronomist data
        await create_agronomist_data(db)
        
        # Create chat sessions
        await create_chat_sessions(db)
        
        print("✅ Real data seeding completed successfully!")
        print("\n📊 Created Users:")
        print("   - 2 Admin users")
        print("   - 4 Agronomist users") 
        print("   - 8 Farmer users")
        print("\n🌾 Created Farm Data:")
        print("   - Crop recommendations for farmers")
        print("   - Weather data logs")
        print("   - Soil sensor readings")
        print("\n🎓 Created Agronomist Data:")
        print("   - 20 farmer assistance requests")
        print("   - Advisory tips database")
        print("\n💬 Created Chat Sessions:")
        print("   - Sample conversations for users")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
