import asyncio
import json
import aiohttp
from datetime import datetime

async def test_login(session, email, password, user_type):
    """Test login for a user"""
    url = "http://localhost:8000/api/auth/login"
    data = {"email": email, "password": password}
    
    try:
        async with session.post(url, json=data) as response:
            if response.status == 200:
                result = await response.json()
                print(f"✅ {user_type} Login Successful")
                print(f"   Email: {email}")
                print(f"   Name: {result['user']['name']}")
                print(f"   Role: {result['user']['role']}")
                print(f"   Verified: {result['user']['is_verified']}")
                print(f"   Active: {result['user']['is_active']}")
                print()
                return True
            else:
                error = await response.text()
                print(f"❌ {user_type} Login Failed")
                print(f"   Email: {email}")
                print(f"   Error: {error}")
                print()
                return False
    except Exception as e:
        print(f"❌ {user_type} Login Error")
        print(f"   Email: {email}")
        print(f"   Error: {str(e)}")
        print()
        return False

async def main():
    print("🔐 Testing All User Logins")
    print("=" * 50)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test users
    users = [
        ("admin@agrobrain.ai", "Admin@123", "Admin"),
        ("sharma@agrobrain.ai", "Agronomist@123", "Agronomist 1"),
        ("patel@agrobrain.ai", "Agronomist@123", "Agronomist 2"),
        ("ramesh@agrobrain.ai", "Farmer@123", "Farmer 1"),
        ("sita@agrobrain.ai", "Farmer@123", "Farmer 2"),
        ("mohan@agrobrain.ai", "Farmer@123", "Farmer 3"),
    ]
    
    async with aiohttp.ClientSession() as session:
        results = []
        for email, password, user_type in users:
            success = await test_login(session, email, password, user_type)
            results.append((user_type, email, success))
        
        # Summary
        print("📊 LOGIN SUMMARY")
        print("=" * 50)
        successful = sum(1 for _, _, success in results if success)
        total = len(results)
        
        for user_type, email, success in results:
            status = "✅" if success else "❌"
            print(f"{status} {user_type}: {email}")
        
        print()
        print(f"Total: {successful}/{total} logins successful")
        
        if successful == total:
            print("🎉 ALL USERS CAN LOGIN SUCCESSFULLY!")
        else:
            print("⚠️  Some users cannot login")

if __name__ == "__main__":
    asyncio.run(main())
