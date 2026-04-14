import asyncio
from app.core.database import connect_db, get_db

async def check_users():
    # Connect to database
    await connect_db()
    
    db = get_db()
    users = await db.users.find({'role': 'farmer'}).to_list(length=10)
    print(f'Found {len(users)} farmers:')
    for user in users:
        print(f'  - {user.get("email", "No email")} | {user.get("name", "No name")}')

if __name__ == "__main__":
    asyncio.run(check_users())
