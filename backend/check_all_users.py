import asyncio
from app.core.database import connect_db, get_db

async def check_all_users():
    # Connect to database
    await connect_db()
    
    db = get_db()
    
    # Check all users
    users = await db.users.find({}).to_list(length=20)
    print(f'Found {len(users)} total users:')
    
    for user in users:
        email = user.get("email", "No email")
        name = user.get("name", "No name")
        role = user.get("role", "No role")
        has_password = "hashed_password" in user
        is_active = user.get("is_active", False)
        is_verified = user.get("is_verified", False)
        
        print(f'  - {email} | {name} | {role} | Password: {has_password} | Active: {is_active} | Verified: {is_verified}')

if __name__ == "__main__":
    asyncio.run(check_all_users())
