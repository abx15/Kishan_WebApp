import asyncio
import aiohttp
from datetime import datetime

async def test_frontend_login_flow():
    """Test complete frontend login flow"""
    
    print("🌐 Testing Frontend Login Flow")
    print("=" * 50)
    
    # Test frontend is accessible
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:3000") as response:
                if response.status == 200:
                    print("✅ Frontend Accessible")
                    print("   URL: http://localhost:3000")
                else:
                    print(f"❌ Frontend Not Accessible: {response.status}")
                    return
    except Exception as e:
        print(f"❌ Frontend Connection Error: {str(e)}")
        return
    
    print()
    
    # Test login API from frontend perspective
    login_data = {
        "email": "ramesh@agrobrain.ai",
        "password": "Farmer@123"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            # This is how frontend calls the API
            async with session.post("http://localhost:8000/api/auth/login", json=login_data) as response:
                if response.status == 200:
                    result = await response.json()
                    print("✅ Frontend Login API Working")
                    print(f"   User: {result['user']['name']}")
                    print(f"   Role: {result['user']['role']}")
                    print(f"   Token Received: {'Yes' if result.get('access_token') else 'No'}")
                    
                    # Test dashboard redirect
                    print("   Dashboard URL: http://localhost:3000/dashboard/farmer")
                    
                else:
                    error = await response.text()
                    print(f"❌ Frontend Login Failed: {response.status}")
                    print(f"   Error: {error}")
                    
    except Exception as e:
        print(f"❌ Frontend API Error: {str(e)}")
    
    print()
    print("📋 Manual Testing Steps:")
    print("1. Open browser: http://localhost:3000")
    print("2. Click on Login")
    print("3. Enter: ramesh@agrobrain.ai")
    print("4. Enter: Farmer@123")
    print("5. Click Login")
    print("6. Should redirect to: http://localhost:3000/dashboard/farmer")
    print()
    print("🔧 If login fails, check:")
    print("- Browser Console (F12) for errors")
    print("- Network tab for API calls")
    print("- Backend is running on port 8000")
    print("- Frontend is running on port 3000")

if __name__ == "__main__":
    asyncio.run(test_frontend_login_flow())
