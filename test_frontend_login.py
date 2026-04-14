import asyncio
import aiohttp
from datetime import datetime

async def test_frontend_api():
    """Test frontend API calls"""
    
    print("🔍 Testing Frontend API Connection")
    print("=" * 50)
    
    # Test backend health
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:8000/health") as response:
                if response.status == 200:
                    health = await response.json()
                    print(f"✅ Backend Health: {health['status']}")
                    print(f"   Database: {health['database']}")
                    print(f"   Cache: {health['cache']}")
                else:
                    print(f"❌ Backend Health Failed: {response.status}")
    except Exception as e:
        print(f"❌ Backend Connection Error: {str(e)}")
        return
    
    print()
    
    # Test login API endpoint
    login_data = {
        "email": "ramesh@agrobrain.ai",
        "password": "Farmer@123"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post("http://localhost:8000/api/auth/login", json=login_data) as response:
                if response.status == 200:
                    result = await response.json()
                    print("✅ Login API Working")
                    print(f"   Access Token: {result['access_token'][:50]}...")
                    print(f"   User: {result['user']['name']} ({result['user']['role']})")
                    
                    # Test protected endpoint with token
                    headers = {"Authorization": f"Bearer {result['access_token']}"}
                    async with session.get("http://localhost:8000/api/auth/me", headers=headers) as me_response:
                        if me_response.status == 200:
                            me_data = await me_response.json()
                            print("✅ Protected API Working")
                            print(f"   User Profile: {me_data['name']}")
                        else:
                            print(f"❌ Protected API Failed: {me_response.status}")
                            
                else:
                    error = await response.text()
                    print(f"❌ Login API Failed: {response.status}")
                    print(f"   Error: {error}")
                    
    except Exception as e:
        print(f"❌ API Test Error: {str(e)}")
    
    print()
    print("🌐 Frontend URLs:")
    print("   - Frontend: http://localhost:3000")
    print("   - Backend API: http://localhost:8000")
    print("   - API Docs: http://localhost:8000/docs")
    print()
    print("📝 Test Login Credentials:")
    print("   - Farmer: ramesh@agrobrain.ai / Farmer@123")
    print("   - Agronomist: sharma@agrobrain.ai / Agronomist@123")
    print("   - Admin: admin@agrobrain.ai / Admin@123")

if __name__ == "__main__":
    asyncio.run(test_frontend_api())
