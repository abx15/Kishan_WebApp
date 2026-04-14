import httpx
import json
import asyncio
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000/api/v1"

class BackendAudit:
    def __init__(self):
        self.client = httpx.Client(base_url=BASE_URL, timeout=30.0)
        self.farmer_token = None
        self.admin_token = None
        self.results = []

    def log_result(self, test_name, status, message, response=None):
        self.results.append({
            "test": test_name,
            "status": "PASS" if status else "FAIL",
            "message": message,
            "code": response.status_code if response else "N/A"
        })
        status_str = "PASS" if status else "FAIL"
        print(f"{status_str} {test_name}: {message} ({response.status_code if response else ''})")

    async def run_audit(self):
        print(f"\n--- AgroBrain AI Backend Audit - {datetime.utcnow().isoformat()} ---\n")

        # 1. Health Check
        try:
            res = self.client.get("http://127.0.0.1:8000/health")
            self.log_result("Health Check", res.status_code == 200, "System reports healthy", res)
        except Exception as e:
            self.log_result("Health Check", False, f"Connection failed: {e}")

        # 2. Auth Flow - Farmer
        try:
            # Login
            res = self.client.post("/auth/login", json={"email": "ramesh@test.com", "password": "Test@1234"})
            if res.status_code == 200:
                self.farmer_token = res.json().get("access_token")
                self.log_result("Farmer Login", True, "Authentication successful", res)
            else:
                self.log_result("Farmer Login", False, "Authentication failed", res)
        except Exception as e:
            self.log_result("Farmer Login", False, f"Error: {e}")

        # 3. Auth Flow - Admin
        try:
            # We use the known admin account
            res = self.client.post("/auth/login", json={"email": "admin@kishan.com", "password": "Test@1234"})
            if res.status_code == 200:
                self.admin_token = res.json().get("access_token")
                self.log_result("Admin Login", True, "Authentication successful", res)
            else:
                self.log_result("Admin Login", False, "Authentication failed (Ensure audit_setup.py was run)", res)
        except Exception as e:
            self.log_result("Admin Login", False, f"Error: {e}")

        if not self.farmer_token or not self.admin_token:
            print("\nCritical Auth failure. Stopping audit.")
            return

        # 4. Weather API (Farmer)
        headers = {"Authorization": f"Bearer {self.farmer_token}"}
        res = self.client.get("/weather/current?lat=28.61&lng=77.20", headers=headers)
        self.log_result("Weather API", res.status_code == 200, "Fetched current weather for Delhi", res)

        # 5. Recommendation API (Farmer)
        res = self.client.post("/recommend/crop", json={
            "lat": 28.61, "lng": 77.20,
            "soil": {"n": 90, "p": 42, "k": 43, "temp": 20.8, "hum": 82.0, "ph": 6.5, "rain": 202.9},
            "season": "kharif"
        }, headers=headers)
        self.log_result("Recommend API", res.status_code in [200, 201], "Generated crop recommendation", res)

        # 6. Chat API (Farmer)
        res = self.client.post("/chat/message", json={
            "message": "आलू की खेती कैसे करें?",
            "language": "hi"
        }, headers=headers)
        self.log_result("Chat API", res.status_code == 200, "REST chat message processed", res)

        # 7. Voice intent API (Farmer) - NEWLY INTEGRATED
        res = self.client.post("/voice/query", json={
            "text": "Check the weather in Delhi",
            "language": "en"
        }, headers=headers)
        self.log_result("Voice Intent API", res.status_code == 200, "Voice query routed correctly", res)

        # 8. Admin APIs - NEWLY INTEGRATED
        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # User list
        res = self.client.get("/admin/users", headers=admin_headers)
        self.log_result("Admin: List Users", res.status_code == 200, f"Retrieved {res.json().get('total', 0)} users", res)

        # Stats
        res = self.client.get("/admin/stats", headers=admin_headers)
        self.log_result("Admin: Dashboard Stats", res.status_code == 200, "Retrieved system stats", res)

        # Cache clear
        res = self.client.post("/admin/cache/clear?pattern=weather:*", headers=admin_headers)
        self.log_result("Admin: Cache Management", res.status_code == 200, "Cleared weather cache", res)

        print("\n--- Audit Report Summary ---")
        passed = len([r for r in self.results if r["status"] == "PASS"])
        total = len(self.results)
        print(f"Total Tests: {total} | Passed: {passed} | Failed: {total - passed}")
        
        # Write results to json for report generation
        with open("audit_results.json", "w") as f:
            json.dump(self.results, f, indent=2)

if __name__ == "__main__":
    audit = BackendAudit()
    asyncio.run(audit.run_audit())
