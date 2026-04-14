import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import sys

# Add current directory to path so we can import app
sys.path.append(os.getcwd())

from app.core.security import hash_password

async def run():
    load_dotenv()
    client = AsyncIOMotorClient(os.getenv('MONGODB_URL'))
    db = client.get_default_database()
    
    admin_email = 'admin@kishan.com'
    hashed_password = hash_password("Test@1234")
    
    print(f"Setting up admin {admin_email}...")
    
    await db.users.update_one(
        {'email': admin_email}, 
        {'$set': {
            'username': 'admin',
            'hashed_password': hashed_password, 
            'role': 'admin', 
            'is_active': True,
            'is_verified': True,
            'is_banned': False
        }},
        upsert=True
    )
    print("Admin setup complete.")

if __name__ == "__main__":
    asyncio.run(run())
