#!/usr/bin/env python3
"""
AgroBrain AI Complete Application Startup Script

This script starts both backend and frontend servers simultaneously.
"""

import os
import sys
import subprocess
import signal
import time
import threading
from pathlib import Path

class ServerManager:
    def __init__(self):
        self.processes = []
        self.running = True

    def start_backend(self):
        """Start the backend server."""
        print("Starting backend server...")
        backend_dir = Path(__file__).parent / "backend"
        
        cmd = [
            sys.executable, "-m", "uvicorn",
            "app.main:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload",
            "--log-level", "info"
        ]
        
        try:
            process = subprocess.Popen(
                cmd,
                cwd=backend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            self.processes.append(("backend", process))
            
            # Monitor backend output
            def monitor_backend():
                for line in process.stdout:
                    if self.running:
                        print(f"[BACKEND] {line.strip()}")
            
            threading.Thread(target=monitor_backend, daemon=True).start()
            
        except Exception as e:
            print(f"Failed to start backend: {e}")
            self.stop_all()
            sys.exit(1)

    def start_frontend(self):
        """Start the frontend server."""
        print("Starting frontend server...")
        frontend_dir = Path(__file__).parent / "frontend"
        
        # Set environment variables
        env = os.environ.copy()
        env["NEXT_PUBLIC_API_URL"] = "http://localhost:8000"
        env["NEXT_PUBLIC_APP_NAME"] = "AgroBrain AI"
        
        cmd = ["npm", "run", "dev"]
        
        try:
            process = subprocess.Popen(
                cmd,
                cwd=frontend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
                env=env
            )
            
            self.processes.append(("frontend", process))
            
            # Monitor frontend output
            def monitor_frontend():
                for line in process.stdout:
                    if self.running:
                        print(f"[FRONTEND] {line.strip()}")
            
            threading.Thread(target=monitor_frontend, daemon=True).start()
            
        except Exception as e:
            print(f"Failed to start frontend: {e}")
            self.stop_all()
            sys.exit(1)

    def stop_all(self):
        """Stop all running processes."""
        print("\nStopping all servers...")
        self.running = False
        
        for name, process in self.processes:
            try:
                print(f"Stopping {name} server...")
                process.terminate()
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                print(f"Force killing {name} server...")
                process.kill()
                process.wait()
            except Exception as e:
                print(f"Error stopping {name}: {e}")

    def wait_for_servers(self):
        """Wait for servers to be ready."""
        print("Waiting for servers to start...")
        
        # Wait for backend to be ready
        backend_ready = False
        for i in range(30):  # Wait up to 30 seconds
            try:
                import requests
                response = requests.get("http://localhost:8000/health", timeout=1)
                if response.status_code == 200:
                    backend_ready = True
                    break
            except:
                pass
            time.sleep(1)
        
        if backend_ready:
            print("Backend server is ready! http://localhost:8000")
        else:
            print("Backend server may not be ready yet")
        
        # Wait for frontend to be ready
        frontend_ready = False
        for i in range(30):  # Wait up to 30 seconds
            try:
                import requests
                response = requests.get("http://localhost:3000", timeout=1)
                if response.status_code == 200:
                    frontend_ready = True
                    break
            except:
                pass
            time.sleep(1)
        
        if frontend_ready:
            print("Frontend server is ready! http://localhost:3000")
        else:
            print("Frontend server may not be ready yet")

def check_requirements():
    """Check if all requirements are met."""
    print("Checking requirements...")
    
    # Check Python
    if sys.version_info < (3, 8):
        print("Error: Python 3.8 or higher is required")
        return False
    
    # Check Node.js
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode != 0:
            print("Error: Node.js is not installed")
            return False
        print(f"Node.js: {result.stdout.strip()}")
    except FileNotFoundError:
        print("Error: Node.js is not found")
        return False
    
    # Check npm
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"npm: {result.stdout.strip()}")
    except FileNotFoundError:
        print("Warning: npm is not found")
    
    print("Requirements check passed!")
    return True

def setup_signal_handlers(manager):
    """Setup signal handlers for graceful shutdown."""
    def signal_handler(signum, frame):
        print(f"\nReceived signal {signum}. Shutting down gracefully...")
        manager.stop_all()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

def main():
    """Main function."""
    print("=" * 60)
    print("AgroBrain AI - Complete Application Startup")
    print("=" * 60)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Create server manager
    manager = ServerManager()
    
    # Setup signal handlers
    setup_signal_handlers(manager)
    
    try:
        # Start servers
        manager.start_backend()
        time.sleep(2)  # Give backend time to start
        manager.start_frontend()
        
        # Wait for servers to be ready
        time.sleep(3)
        manager.wait_for_servers()
        
        print("\n" + "=" * 60)
        print("AgroBrain AI is running!")
        print("=" * 60)
        print("Frontend: http://localhost:3000")
        print("Backend API: http://localhost:8000")
        print("API Docs: http://localhost:8000/docs")
        print("\nPress Ctrl+C to stop all servers")
        print("=" * 60)
        
        # Keep running until interrupted
        while manager.running:
            time.sleep(1)
            
            # Check if any process has stopped unexpectedly
            for name, process in manager.processes:
                if process.poll() is not None:
                    print(f"{name} server stopped unexpectedly!")
                    manager.stop_all()
                    sys.exit(1)
    
    except KeyboardInterrupt:
        pass
    finally:
        manager.stop_all()

if __name__ == "__main__":
    main()
