import asyncio
import os
import bcrypt
import uuid
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB_NAME", "agrobrain")

async def seed_comprehensive_data():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    # Clear existing data
    print("Clearing existing data...")
    collections_to_clear = [
        'users', 'farms', 'crops', 'daily_tips', 'chats', 'messages',
        'recommendations', 'weather_data', 'soil_data', 'market_data'
    ]
    for collection in collections_to_clear:
        await db[collection].delete_many({})
        print(f"Cleared {collection}")

    # 1. Seed Users with different roles
    print("Seeding users...")
    users_data = [
        # Admin User
        {
            "username": "admin",
            "email": "admin@agrobrain.ai",
            "name": "Admin User",
            "hashed_password": bcrypt.hashpw("Admin@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "role": "admin",
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "language": "en",
            "auth_provider": "email",
            "default_location": {
                "lat": 28.6139,
                "lng": 77.2090,
                "village": "New Delhi",
                "district": "Central Delhi",
                "state": "Delhi",
                "pincode": "110001"
            },
            "farm_profile": {},
            "agronomist_profile": {},
            "login_count": 15,
            "last_login": datetime.utcnow(),
            "created_at": datetime.utcnow() - timedelta(days=90),
            "updated_at": datetime.utcnow()
        },
        # Agronomist Users
        {
            "username": "dr_sharma",
            "email": "sharma@agrobrain.ai",
            "name": "Dr. Rajesh Sharma",
            "phone": "+919876543210",
            "role": "agronomist",
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "language": "hi",
            "auth_provider": "email",
            "hashed_password": bcrypt.hashpw("Agronomist@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "default_location": {
                "lat": 26.8467,
                "lng": 80.9462,
                "village": "Lucknow",
                "district": "Lucknow",
                "state": "Uttar Pradesh",
                "pincode": "226001"
            },
            "farm_profile": {},
            "agronomist_profile": {
                "specialization": ["soil_science", "crop_management", "organic_farming"],
                "experience_years": 15,
                "states_served": ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh"],
                "is_approved": True,
                "qualification": "Ph.D. in Agriculture",
                "license_number": "UP-AGRO-2024-001"
            },
            "login_count": 45,
            "last_login": datetime.utcnow() - timedelta(hours=2),
            "created_at": datetime.utcnow() - timedelta(days=60),
            "updated_at": datetime.utcnow()
        },
        {
            "username": "dr_patel",
            "email": "patel@agrobrain.ai",
            "name": "Dr. Anita Patel",
            "phone": "+919876543211",
            "role": "agronomist",
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "language": "hi",
            "auth_provider": "email",
            "hashed_password": bcrypt.hashpw("Agronomist@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "default_location": {
                "lat": 23.2599,
                "lng": 77.4126,
                "village": "Bhopal",
                "district": "Bhopal",
                "state": "Madhya Pradesh",
                "pincode": "462001"
            },
            "farm_profile": {},
            "agronomist_profile": {
                "specialization": ["plant_pathology", "pest_management", "sustainable_agriculture"],
                "experience_years": 12,
                "states_served": ["Madhya Pradesh", "Maharashtra", "Gujarat", "Rajasthan"],
                "is_approved": True,
                "qualification": "M.Sc. in Plant Pathology",
                "license_number": "MP-AGRO-2024-002"
            },
            "login_count": 32,
            "last_login": datetime.utcnow() - timedelta(hours=6),
            "created_at": datetime.utcnow() - timedelta(days=45),
            "updated_at": datetime.utcnow()
        },
        # Farmer Users
        {
            "username": "ramesh_farmer",
            "email": "ramesh@agrobrain.ai",
            "name": "Ramesh Kumar",
            "phone": "+919129939972",
            "role": "farmer",
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "language": "hi",
            "auth_provider": "email",
            "hashed_password": bcrypt.hashpw("Farmer@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "default_location": {
                "lat": 26.8467,
                "lng": 80.9462,
                "village": "Nawabganj",
                "district": "Unnao",
                "state": "Uttar Pradesh",
                "pincode": "209861"
            },
            "farm_profile": {
                "total_area_acres": 15.5,
                "soil_type": "loamy_soil",
                "primary_crops": ["wheat", "rice", "pulses"],
                "irrigation_type": "tube_well",
                "has_soil_sensor": True,
                "farm_size_category": "medium",
                "organic_certified": False,
                "livestock_count": {"cows": 2, "buffaloes": 3, "goats": 5}
            },
            "agronomist_profile": {},
            "login_count": 89,
            "last_login": datetime.utcnow() - timedelta(minutes=30),
            "created_at": datetime.utcnow() - timedelta(days=30),
            "updated_at": datetime.utcnow()
        },
        {
            "username": "sita_farm",
            "email": "sita@agrobrain.ai",
            "name": "Sita Devi",
            "phone": "+919129939973",
            "role": "farmer",
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "language": "hi",
            "auth_provider": "email",
            "hashed_password": bcrypt.hashpw("Farmer@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "default_location": {
                "lat": 26.9124,
                "lng": 75.8235,
                "village": "Jaipur",
                "district": "Jaipur",
                "state": "Rajasthan",
                "pincode": "302001"
            },
            "farm_profile": {
                "total_area_acres": 8.2,
                "soil_type": "sandy_loam",
                "primary_crops": ["millet", "gram", "mustard"],
                "irrigation_type": "drip_irrigation",
                "has_soil_sensor": False,
                "farm_size_category": "small",
                "organic_certified": True,
                "livestock_count": {"cows": 1, "goats": 8}
            },
            "agronomist_profile": {},
            "login_count": 67,
            "last_login": datetime.utcnow() - timedelta(hours=1),
            "created_at": datetime.utcnow() - timedelta(days=25),
            "updated_at": datetime.utcnow()
        },
        {
            "username": "mohan_patel",
            "email": "mohan@agrobrain.ai",
            "name": "Mohan Patel",
            "phone": "+919129939974",
            "role": "farmer",
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "language": "hi",
            "auth_provider": "email",
            "hashed_password": bcrypt.hashpw("Farmer@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "default_location": {
                "lat": 22.2587,
                "lng": 71.1924,
                "village": "Anand",
                "district": "Anand",
                "state": "Gujarat",
                "pincode": "388001"
            },
            "farm_profile": {
                "total_area_acres": 24.8,
                "soil_type": "black_cotton_soil",
                "primary_crops": ["cotton", "castor", "groundnut"],
                "irrigation_type": "canal_irrigation",
                "has_soil_sensor": True,
                "farm_size_category": "large",
                "organic_certified": False,
                "livestock_count": {"buffaloes": 5, "cows": 3}
            },
            "agronomist_profile": {},
            "login_count": 103,
            "last_login": datetime.utcnow() - timedelta(minutes=15),
            "created_at": datetime.utcnow() - timedelta(days=20),
            "updated_at": datetime.utcnow()
        },
        {
            "username": "lakshmi_reddy",
            "email": "lakshmi@agrobrain.ai",
            "name": "Lakshmi Reddy",
            "phone": "+919129939975",
            "role": "farmer",
            "is_verified": True,
            "is_active": True,
            "is_banned": False,
            "language": "hi",
            "auth_provider": "email",
            "hashed_password": bcrypt.hashpw("Farmer@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "default_location": {
                "lat": 17.3850,
                "lng": 78.4867,
                "village": "Hyderabad",
                "district": "Hyderabad",
                "state": "Telangana",
                "pincode": "500001"
            },
            "farm_profile": {
                "total_area_acres": 12.3,
                "soil_type": "red_soil",
                "primary_crops": ["rice", "chili", "turmeric"],
                "irrigation_type": "tank_irrigation",
                "has_soil_sensor": False,
                "farm_size_category": "medium",
                "organic_certified": False,
                "livestock_count": {"cows": 2, "buffaloes": 2, "goats": 6}
            },
            "agronomist_profile": {},
            "login_count": 78,
            "last_login": datetime.utcnow() - timedelta(hours=3),
            "created_at": datetime.utcnow() - timedelta(days=18),
            "updated_at": datetime.utcnow()
        }
    ]

    # Insert users and get their IDs
    inserted_users = await db.users.insert_many(users_data)
    
    # Create user lookup dictionary
    users = await db.users.find().to_list(None)
    user_lookup = {user["username"]: user for user in users}
    
    print(f"Created {len(users)} users")

    # 2. Seed Farms
    print("Seeding farms...")
    farms_data = [
        {
            "user_id": user_lookup["ramesh_farmer"]["_id"],
            "farm_name": "Green Valley Farm",
            "location": {
                "lat": 26.8467,
                "lng": 80.9462,
                "village": "Nawabganj",
                "district": "Unnao",
                "state": "Uttar Pradesh",
                "pincode": "209861"
            },
            "total_area_acres": 15.5,
            "soil_type": "loamy_soil",
            "ph_level": 6.8,
            "organic_matter": 2.5,
            "irrigation_source": "tube_well",
            "certifications": [],
            "created_at": datetime.utcnow() - timedelta(days=30),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": user_lookup["sita_farm"]["_id"],
            "farm_name": "Sita Organic Farm",
            "location": {
                "lat": 26.9124,
                "lng": 75.8235,
                "village": "Jaipur",
                "district": "Jaipur",
                "state": "Rajasthan",
                "pincode": "302001"
            },
            "total_area_acres": 8.2,
            "soil_type": "sandy_loam",
            "ph_level": 7.2,
            "organic_matter": 3.1,
            "irrigation_source": "drip_irrigation",
            "certifications": ["organic_india"],
            "created_at": datetime.utcnow() - timedelta(days=25),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": user_lookup["mohan_patel"]["_id"],
            "farm_name": "Patel Agricultural Farm",
            "location": {
                "lat": 22.2587,
                "lng": 71.1924,
                "village": "Anand",
                "district": "Anand",
                "state": "Gujarat",
                "pincode": "388001"
            },
            "total_area_acres": 24.8,
            "soil_type": "black_cotton_soil",
            "ph_level": 7.5,
            "organic_matter": 2.8,
            "irrigation_source": "canal_irrigation",
            "certifications": ["good_agricultural_practices"],
            "created_at": datetime.utcnow() - timedelta(days=20),
            "updated_at": datetime.utcnow()
        }
    ]

    inserted_farms = await db.farms.insert_many(farms_data)
    farm_lookup = {farm["farm_name"]: farm for farm in await db.farms.find().to_list(None)}
    print(f"Created {len(farms_data)} farms")

    # 3. Seed Crops Metadata
    print("Seeding crop metadata...")
    crops_data = [
        {"name": "rice", "label": "Rice", "season": "Kharif", "water_needs": "High", "growing_days": 120, "optimal_ph": (5.5, 7.0)},
        {"name": "wheat", "label": "Wheat", "season": "Rabi", "water_needs": "Medium", "growing_days": 110, "optimal_ph": (6.0, 7.5)},
        {"name": "maize", "label": "Maize", "season": "Kharif", "water_needs": "Medium", "growing_days": 90, "optimal_ph": (5.5, 7.0)},
        {"name": "cotton", "label": "Cotton", "season": "Kharif", "water_needs": "Medium", "growing_days": 150, "optimal_ph": (6.0, 7.5)},
        {"name": "pulses", "label": "Pulses", "season": "Rabi", "water_needs": "Low", "growing_days": 80, "optimal_ph": (6.0, 7.0)},
        {"name": "millet", "label": "Millet", "season": "Kharif", "water_needs": "Low", "growing_days": 70, "optimal_ph": (6.0, 7.5)},
        {"name": "mustard", "label": "Mustard", "season": "Rabi", "water_needs": "Low", "growing_days": 90, "optimal_ph": (6.0, 7.5)},
        {"name": "groundnut", "label": "Groundnut", "season": "Kharif", "water_needs": "Medium", "growing_days": 100, "optimal_ph": (6.0, 7.0)},
        {"name": "chili", "label": "Chili", "season": "Whole Year", "water_needs": "Medium", "growing_days": 120, "optimal_ph": (6.5, 7.5)},
        {"name": "turmeric", "label": "Turmeric", "season": "Kharif", "water_needs": "Medium", "growing_days": 180, "optimal_ph": (6.0, 7.5)}
    ]
    await db.crops.insert_many(crops_data)
    print(f"Created {len(crops_data)} crop types")

    # 4. Seed Daily Tips
    print("Seeding daily tips...")
    tips_data = [
        {
            "tip_en": "Apply organic fertilizers in the early morning for better absorption.",
            "tip_hi": "Behtar awshoshan ke liye subah-subah jaivik khad ka upyog karein.",
            "category": "fertilizer",
            "active": True,
            "priority": "high",
            "created_at": datetime.utcnow()
        },
        {
            "tip_en": "Check soil moisture before irrigation to prevent root rot.",
            "tip_hi": "Jadon ke sadne se bachne ke liye sichai se pehle mitti ki nami ki janch karein.",
            "category": "irrigation",
            "active": True,
            "priority": "medium",
            "created_at": datetime.utcnow()
        },
        {
            "tip_en": "Rotate crops annually to maintain soil health.",
            "tip_hi": "Mitti ke swasthya ko banaye rakhne ke liye har saal faslon ko badal-badal kar lagayein.",
            "category": "soil",
            "active": True,
            "priority": "high",
            "created_at": datetime.utcnow()
        },
        {
            "tip_en": "Monitor pest activity regularly and use integrated pest management.",
            "tip_hi": "Kiron ki gatividhi ka nirdhar banat rakhein aur sangat ke kiron prabandhan ka upyog karein.",
            "category": "pest_management",
            "active": True,
            "priority": "high",
            "created_at": datetime.utcnow()
        },
        {
            "tip_en": "Use drip irrigation for water conservation in dry areas.",
            "tip_hi": "Sukhe ilaakon mein paani ki bachat ke liye drip sichai ka upyog karein.",
            "category": "irrigation",
            "active": True,
            "priority": "medium",
            "created_at": datetime.utcnow()
        }
    ]
    await db.daily_tips.insert_many(tips_data)
    print(f"Created {len(tips_data)} daily tips")

    # 5. Seed Chat Conversations
    print("Seeding chat conversations...")
    chats_data = [
        {
            "user_id": user_lookup["ramesh_farmer"]["_id"],
            "agronomist_id": user_lookup["dr_sharma"]["_id"],
            "status": "active",
            "topic": "wheat_disease_management",
            "created_at": datetime.utcnow() - timedelta(days=5),
            "updated_at": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "user_id": user_lookup["sita_farm"]["_id"],
            "agronomist_id": user_lookup["dr_patel"]["_id"],
            "status": "resolved",
            "topic": "organic_fertilizer_recommendation",
            "created_at": datetime.utcnow() - timedelta(days=3),
            "updated_at": datetime.utcnow() - timedelta(hours=12)
        },
        {
            "user_id": user_lookup["mohan_patel"]["_id"],
            "agronomist_id": user_lookup["dr_sharma"]["_id"],
            "status": "active",
            "topic": "cotton_pest_control",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "updated_at": datetime.utcnow() - timedelta(minutes=30)
        }
    ]

    inserted_chats = await db.chats.insert_many(chats_data)
    chats = await db.chats.find().to_list(None)
    chat_lookup = {i: chat for i, chat in enumerate(chats)}
    print(f"Created {len(chats_data)} chat conversations")

    # 6. Seed Chat Messages
    print("Seeding chat messages...")
    messages_data = []

    # Messages for first chat (Ramesh & Dr. Sharma)
    messages_data.extend([
        {
            "chat_id": chat_lookup[0]["_id"],
            "sender_id": user_lookup["ramesh_farmer"]["_id"],
            "sender_type": "user",
            "message": "Namaste Doctor! My wheat crop is showing yellowing leaves. What could be the problem?",
            "message_hi": "namaste doctor! mera gehun ka fasla patti peele kar raha hai. samasya kya ho sakti hai?",
            "timestamp": datetime.utcnow() - timedelta(days=5, hours=4),
            "read": True
        },
        {
            "chat_id": chat_lookup[0]["_id"],
            "sender_id": user_lookup["dr_sharma"]["_id"],
            "sender_type": "agronomist",
            "message": "Hello Ramesh! Yellowing leaves could be due to nitrogen deficiency or water logging. Can you tell me about your fertilizer application and irrigation schedule?",
            "message_hi": "namaste ramesh! patti peelpan ki samasya nitrogens ki kami ya paani bharne se ho sakti hai. kya aap mujhe khad lagane aur paani dene ka time table bata sakte hain?",
            "timestamp": datetime.utcnow() - timedelta(days=5, hours=3, minutes=30),
            "read": True
        },
        {
            "chat_id": chat_lookup[0]["_id"],
            "sender_id": user_lookup["ramesh_farmer"]["_id"],
            "sender_type": "user",
            "message": "I applied urea 3 weeks ago and irrigate every 5 days. The soil feels a bit wet.",
            "message_hi": "maine 3 hafte pehle urea lagaya tha aur har 5 din mein paani deta hun. mitti thodi gili lag rahi hai.",
            "timestamp": datetime.utcnow() - timedelta(days=5, hours=2),
            "read": True
        },
        {
            "chat_id": chat_lookup[0]["_id"],
            "sender_id": user_lookup["dr_sharma"]["_id"],
            "sender_type": "agronomist",
            "message": "The issue is likely water logging. Reduce irrigation frequency and improve drainage. Apply zinc sulfate 10kg per acre to treat yellowing.",
            "message_hi": "samasya jyadatar paani bharne ki wajah se hai. paani kam dijiye aur drainage behtar karein. patti peelpan ke ilaaj ke liye zinc sulfate 10kg per acre lagayein.",
            "timestamp": datetime.utcnow() - timedelta(days=5, hours=1),
            "read": True
        }
    ])

    # Messages for second chat (Sita & Dr. Patel)
    messages_data.extend([
        {
            "chat_id": chat_lookup[1]["_id"],
            "sender_id": user_lookup["sita_farm"]["_id"],
            "sender_type": "user",
            "message": "Hello Doctor! I need organic fertilizer recommendations for my millet crop.",
            "message_hi": "namaste doctor! mujhe mere bajre ke fasle ke liye jaivik khad ki suvidha chahiye.",
            "timestamp": datetime.utcnow() - timedelta(days=3, hours=2),
            "read": True
        },
        {
            "chat_id": chat_lookup[1]["_id"],
            "sender_id": user_lookup["dr_patel"]["_id"],
            "sender_type": "agronomist",
            "message": "Hello Sita! For organic millet farming, I recommend vermicompost 2 tons per acre and neem cake 200kg per acre.",
            "message_hi": "namaste sita! jaivik bajre ki kheti ke liye main vermicompost 2 tons per acre aur neem cake 200kg per acre lagane ki salah deta hun.",
            "timestamp": datetime.utcnow() - timedelta(days=3, hours=1, minutes=30),
            "read": True
        },
        {
            "chat_id": chat_lookup[1]["_id"],
            "sender_id": user_lookup["sita_farm"]["_id"],
            "sender_type": "user",
            "message": "Thank you Doctor! When should I apply these fertilizers?",
            "message_hi": "dhanyawad doctor! main in khadon ko kab lagana chahiye?",
            "timestamp": datetime.utcnow() - timedelta(days=3, hours=1),
            "read": True
        },
        {
            "chat_id": chat_lookup[1]["_id"],
            "sender_id": user_lookup["dr_patel"]["_id"],
            "sender_type": "agronomist",
            "message": "Apply vermicompost before sowing and neem cake 20 days after sowing. This will give best results.",
            "message_hi": "vermicompost bovane se pehle aur neem cake bovane ke 20 din baad lagayein. isse sabse accha result milega.",
            "timestamp": datetime.utcnow() - timedelta(days=2, hours=23),
            "read": True
        }
    ])

    await db.messages.insert_many(messages_data)
    print(f"Created {len(messages_data)} chat messages")

    # 7. Seed Recommendations
    print("Seeding recommendations...")
    recommendations_data = [
        {
            "user_id": user_lookup["ramesh_farmer"]["_id"],
            "crop_type": "wheat",
            "recommendation_type": "fertilizer",
            "recommendation": {
                "primary": "Apply urea 40kg per acre at tillering stage",
                "secondary": "Add DAP 20kg per acre as basal dose",
                "organic": "Use FYM 2 tons per acre for soil health"
            },
            "confidence_score": 0.92,
            "season": "rabi",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "implemented": False
        },
        {
            "user_id": user_lookup["sita_farm"]["_id"],
            "crop_type": "millet",
            "recommendation_type": "irrigation",
            "recommendation": {
                "frequency": "Irrigate every 7-10 days",
                "method": "Use drip irrigation for water conservation",
                "timing": "Early morning or late evening"
            },
            "confidence_score": 0.88,
            "season": "kharif",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "implemented": True
        },
        {
            "user_id": user_lookup["mohan_patel"]["_id"],
            "crop_type": "cotton",
            "recommendation_type": "pest_control",
            "recommendation": {
                "preventive": "Use neem oil spray as preventive measure",
                "curative": "For bollworm, use approved biopesticides",
                "monitoring": "Regular field scouting twice a week"
            },
            "confidence_score": 0.85,
            "season": "kharif",
            "created_at": datetime.utcnow() - timedelta(hours=6),
            "implemented": False
        }
    ]

    await db.recommendations.insert_many(recommendations_data)
    print(f"Created {len(recommendations_data)} recommendations")

    # 8. Seed Weather Data
    print("Seeding weather data...")
    import random
    weather_data = []
    
    for i in range(30):  # Last 30 days
        date = datetime.utcnow() - timedelta(days=i)
        for user in users:
            if user["role"] == "farmer":
                weather_data.append({
                    "user_id": user["_id"],
                    "date": date,
                    "location": user["default_location"],
                    "temperature": {
                        "max": random.uniform(25, 35),
                        "min": random.uniform(15, 25),
                        "avg": random.uniform(20, 30)
                    },
                    "humidity": random.uniform(40, 80),
                    "rainfall": random.uniform(0, 10) if random.random() > 0.7 else 0,
                    "wind_speed": random.uniform(5, 15),
                    "soil_moisture": random.uniform(30, 70),
                    "created_at": date
                })

    await db.weather_data.insert_many(weather_data)
    print(f"Created {len(weather_data)} weather records")

    # 9. Seed Soil Data
    print("Seeding soil data...")
    soil_data = []
    
    for user in users:
        if user["role"] == "farmer" and user["username"] in ["ramesh_farmer", "sita_farm", "mohan_patel"]:
            for i in range(12):  # Last 12 months
                date = datetime.utcnow() - timedelta(days=i*30)
                soil_data.append({
                    "user_id": user["_id"],
                    "date": date,
                    "location": user["default_location"],
                    "ph": random.uniform(6.0, 7.5),
                    "nitrogen": random.uniform(150, 300),
                    "phosphorus": random.uniform(20, 60),
                    "potassium": random.uniform(100, 250),
                    "organic_matter": random.uniform(1.5, 3.5),
                    "soil_type": user["farm_profile"]["soil_type"],
                    "created_at": date
                })

    await db.soil_data.insert_many(soil_data)
    print(f"Created {len(soil_data)} soil records")

    # 10. Seed Market Data
    print("Seeding market data...")
    market_data = []
    crops_market = ["wheat", "rice", "cotton", "pulses", "maize"]
    mandis = [
        {"name": "Delhi Mandi", "location": {"lat": 28.6139, "lng": 77.2090}},
        {"name": "Lucknow Mandi", "location": {"lat": 26.8467, "lng": 80.9462}},
        {"name": "Jaipur Mandi", "location": {"lat": 26.9124, "lng": 75.8235}},
        {"name": "Ahmedabad Mandi", "location": {"lat": 23.2599, "lng": 72.1924}},
        {"name": "Hyderabad Mandi", "location": {"lat": 17.3850, "lng": 78.4867}}
    ]

    for i in range(30):  # Last 30 days
        date = datetime.utcnow() - timedelta(days=i)
        for crop in crops_market:
            for mandi in mandis:
                base_price = {
                    "wheat": 2200,
                    "rice": 2500,
                    "cotton": 6500,
                    "pulses": 6000,
                    "maize": 1800
                }[crop]
                
                market_data.append({
                    "crop": crop,
                    "mandi": mandi["name"],
                    "location": mandi["location"],
                    "date": date,
                    "price_per_quintal": base_price + random.uniform(-200, 200),
                    "min_price": base_price - 100,
                    "max_price": base_price + 100,
                    "trend": random.choice(["up", "down", "stable"]),
                    "volume": random.randint(100, 1000),
                    "quality_grade": random.choice(["A", "B", "C"]),
                    "created_at": date
                })

    await db.market_data.insert_many(market_data)
    print(f"Created {len(market_data)} market records")

    print("\n" + "="*50)
    print("DATABASE SEEDING COMPLETE!")
    print("="*50)
    
    print("\nLOGIN CREDENTIALS:")
    print("-" * 30)
    print("ADMIN USER:")
    print("  Email: admin@agrobrain.ai")
    print("  Password: Admin@123")
    print()
    print("AGRONOMISTS:")
    print("  Email: sharma@agrobrain.ai")
    print("  Password: Agronomist@123")
    print("  Email: patel@agrobrain.ai")
    print("  Password: Agronomist@123")
    print()
    print("FARMERS:")
    print("  Email: ramesh@agrobrain.ai")
    print("  Password: Farmer@123")
    print("  Email: sita@agrobrain.ai")
    print("  Password: Farmer@123")
    print("  Email: mohan@agrobrain.ai")
    print("  Password: Farmer@123")
    print("  Email: lakshmi@agrobrain.ai")
    print("  Password: Farmer@123")
    print()
    
    print("\nSUMMARY:")
    print("-" * 30)
    print(f"Users: {len(users)}")
    print(f"Farms: {len(farms_data)}")
    print(f"Crop Types: {len(crops_data)}")
    print(f"Daily Tips: {len(tips_data)}")
    print(f"Chat Conversations: {len(chats_data)}")
    print(f"Chat Messages: {len(messages_data)}")
    print(f"Recommendations: {len(recommendations_data)}")
    print(f"Weather Records: {len(weather_data)}")
    print(f"Soil Records: {len(soil_data)}")
    print(f"Market Records: {len(market_data)}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_comprehensive_data())
