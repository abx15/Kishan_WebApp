import asyncio
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DATABASE_NAME", "agrobrain")

async def seed_recommendations_and_chats():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    # Get existing users and locations
    users = await db.users.find().to_list(None)
    locations = await db.locations.find().to_list(None)
    
    if not users or not locations:
        print("No users or locations found. Please run seed_sample_users.py first!")
        return

    # 1. Seed Crop Recommendations
    print("Seeding crop recommendations...")
    recommendations = []
    
    for i, user in enumerate(users):
        location = locations[i] if i < len(locations) else locations[0]
        
        recommendations.append({
            "user_id": user["_id"],
            "location_id": location["_id"],
            "input": {
                "soil": {
                    "nitrogen_kg_ha": 80 + i*10,
                    "phosphorus_kg_ha": 40 + i*5,
                    "potassium_kg_ha": 60 + i*8,
                    "ph": 6.8 + i*0.2,
                    "moisture_pct": 45 + i*5,
                    "organic_matter_pct": 2.1 + i*0.3,
                    "soil_type": user["farm_profile"]["soil_type"]
                },
                "weather_snapshot": {
                    "temp_c": 28.0 + i*2,
                    "humidity_pct": 65 - i*5,
                    "rainfall_mm_annual": 900 + i*100
                },
                "season": "kharif",
                "area_acres": user["farm_profile"]["total_area_acres"]
            },
            "ml_recommendation": {
                "model_version": "v1.2.0",
                "top_crops": [
                    {
                        "rank": 1,
                        "crop": ["rice", "maize", "wheat"][i],
                        "confidence_pct": 92.4 - i*5,
                        "expected_yield_ton_ha": 4.2 + i*0.5,
                        "suitability_score": 0.924 - i*0.05
                    },
                    {
                        "rank": 2,
                        "crop": ["maize", "pigeonpeas", "rice"][i],
                        "confidence_pct": 78.1 - i*3,
                        "expected_yield_ton_ha": 3.8 + i*0.3,
                        "suitability_score": 0.781 - i*0.03
                    },
                    {
                        "rank": 3,
                        "crop": ["sugarcane", "cotton", "maize"][i],
                        "confidence_pct": 65.0 - i*2,
                        "expected_yield_ton_ha": 70.0 + i*5,
                        "suitability_score": 0.650 - i*0.02
                    }
                ],
                "inference_time_ms": 42 + i*10
            },
            "ai_explanation": {
                "summary_hi": f"aapki mitti aur mausam ke anusaar {['rice', 'maize', 'wheat'][i]} sabse upyukt fasal hai...",
                "summary_en": f"Based on your soil NPK values and current weather, {['rice', 'maize', 'wheat'][i]} is most suitable...",
                "irrigation_advice_hi": "pratidin 2 ghante sinchai karein",
                "irrigation_advice_en": "Irrigate for 2 hours daily in the morning",
                "fertilizer_plan": {
                    "basal": "DAP 50kg/acre at sowing",
                    "top_dress_1": "Urea 25kg/acre after 21 days",
                    "top_dress_2": "MOP 20kg/acre at flowering"
                }
            },
            "feedback": {
                "was_helpful": True,
                "rating": 4 + i % 2,
                "comment": ["Sahi tha recommendation", "Bahut accha", "Helpful advice"][i]
            },
            "created_at": datetime.now(timezone.utc)
        })
    
    await db.crop_recommendations.delete_many({})
    inserted_recommendations = await db.crop_recommendations.insert_many(recommendations)
    print(f"Inserted {len(inserted_recommendations.inserted_ids)} crop recommendations")

    # 2. Seed Chat History
    print("Seeding chat history...")
    chat_sessions = []
    
    conversations = [
        {
            "user_msg": "meri fasil peeli ho rahi hai kya karun?",
            "assistant_msg": "Fasil ka peela padna nitrogen ki kami ka sanket ho sakta hai. Aap DAP ya urea ki thodi maatra add karein. Pani bhi sahi dwayein."
        },
        {
            "user_msg": "What fertilizer should I use for wheat?",
            "assistant_msg": "For wheat, I recommend using DAP at sowing time (50kg/acre) and urea after 21 days (25kg/acre). Make sure soil pH is around 6.5-7.5."
        },
        {
            "user_msg": "kal mausam kaisa rahega?",
            "assistant_msg": "Kal partly cloudy rahega, temperature 36°C tak jayegi. 20% rain ki sambhavna hai. Sinchai ke liye accha din hai."
        }
    ]
    
    for i, user in enumerate(users):
        conversation = conversations[i % len(conversations)]
        session_id = f"sess_{user['_id']}_{'abc123xyz'[:8]}"
        
        chat_sessions.append({
            "user_id": user["_id"],
            "session_id": session_id,
            "session": {
                "started_at": datetime.now(timezone.utc),
                "ended_at": datetime.now(timezone.utc),
                "total_messages": 2,
                "language": user["language"],
                "context": {
                    "location_id": locations[i]["_id"] if i < len(locations) else locations[0]["_id"],
                    "active_crop": user["farm_profile"]["primary_crops"][0],
                    "weather_condition": "clear"
                }
            },
            "messages": [
                {
                    "msg_id": f"msg_{session_id}_001",
                    "role": "user",
                    "content": conversation["user_msg"],
                    "content_type": "text",
                    "language_detected": user["language"],
                    "timestamp": datetime.now(timezone.utc)
                },
                {
                    "msg_id": f"msg_{session_id}_002",
                    "role": "assistant",
                    "content": conversation["assistant_msg"],
                    "content_type": "text",
                    "model_used": "gpt-4o",
                    "tokens_used": 312,
                    "response_time_ms": 1840,
                    "timestamp": datetime.now(timezone.utc)
                }
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })
    
    await db.chat_history.delete_many({})
    inserted_chats = await db.chat_history.insert_many(chat_sessions)
    print(f"Inserted {len(inserted_chats.inserted_ids)} chat sessions")

    print("Recommendations and chat history seeding complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_recommendations_and_chats())
