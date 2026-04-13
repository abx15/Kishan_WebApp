import asyncio
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DATABASE_NAME", "agrobrain")

async def seed_data():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    # 1. Seed Categories/Tips
    print("Seeding daily tips...")
    tips = [
        {
            "tip_en": "Apply organic fertilizers in the early morning for better absorption.",
            "tip_hi": "Behtar awshoshan ke liye subah-subah jaivik khad ka upyog karein.",
            "category": "fertilizer",
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "tip_en": "Check soil moisture before irrigation to prevent root rot.",
            "tip_hi": "Jadon ke sadne se bachne ke liye sichai se pehle mitti ki nami ki janch karein.",
            "category": "irrigation",
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "tip_en": "Rotate crops annually to maintain soil health.",
            "tip_hi": "Mitti ke swasthya ko banaye rakhne ke liye har saal faslon ko badal-badal kar lagayein.",
            "category": "soil",
            "active": True,
            "created_at": datetime.utcnow()
        }
    ]
    await db.daily_tips.delete_many({})
    await db.daily_tips.insert_many(tips)

    # 2. Seed Sample Crops for Recommendation engine (Metadata)
    print("Seeding crop metadata...")
    crops = [
        {"name": "rice", "label": "Rice", "season": "Kharif", "water_needs": "High"},
        {"name": "maize", "label": "Maize", "season": "Kharif", "water_needs": "Medium"},
        {"name": "chickpea", "label": "Chickpea", "season": "Rabi", "water_needs": "Low"},
        {"name": "kidneybeans", "label": "Kidney Beans", "season": "Rabi", "water_needs": "Medium"},
        {"name": "pigeonpeas", "label": "Pigeon Peas", "season": "Kharif", "water_needs": "Low"},
        {"name": "mothbeans", "label": "Moth Beans", "season": "Kharif", "water_needs": "Low"},
        {"name": "mungbean", "label": "Mung Bean", "season": "Kharif", "water_needs": "Low"},
        {"name": "blackgram", "label": "Black Gram", "season": "Kharif", "water_needs": "Low"},
        {"name": "lentil", "label": "Lentil", "season": "Rabi", "water_needs": "Low"},
        {"name": "pomegranate", "label": "Pomegranate", "season": "Whole Year", "water_needs": "Medium"},
        {"name": "banana", "label": "Banana", "season": "Whole Year", "water_needs": "High"},
        {"name": "mango", "label": "Mango", "season": "Summer", "water_needs": "Medium"},
        {"name": "grapes", "label": "Grapes", "season": "Winter", "water_needs": "Medium"},
        {"name": "watermelon", "label": "Watermelon", "season": "Summer", "water_needs": "High"},
        {"name": "muskmelon", "label": "Muskmelon", "season": "Summer", "water_needs": "High"},
        {"name": "apple", "label": "Apple", "season": "Winter", "water_needs": "Medium"},
        {"name": "orange", "label": "Orange", "season": "Winter", "water_needs": "Medium"},
        {"name": "papaya", "label": "Papaya", "season": "Whole Year", "water_needs": "Medium"},
        {"name": "coconut", "label": "Coconut", "season": "Whole Year", "water_needs": "High"},
        {"name": "cotton", "label": "Cotton", "season": "Kharif", "water_needs": "Medium"},
        {"name": "jute", "label": "Jute", "season": "Kharif", "water_needs": "High"},
        {"name": "coffee", "label": "Coffee", "season": "Whole Year", "water_needs": "Medium"}
    ]
    await db.crops.delete_many({})
    await db.crops.insert_many(crops)

    print("Done! Database seeding complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
