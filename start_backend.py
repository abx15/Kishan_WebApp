#!/usr/bin/env python3
"""
AgroBrain AI Backend Startup Script

This script starts the FastAPI backend server with proper configuration
and optional database seeding.
"""

import asyncio
import os
import sys
import subprocess
import argparse
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 8):
        print("Error: Python 3.8 or higher is required")
        sys.exit(1)
    print(f"Python version: {sys.version}")

def check_env_file():
    """Check if .env file exists and create from example if needed."""
    env_file = Path(__file__).parent / "backend" / ".env"
    env_example = Path(__file__).parent / "backend" / ".env.example"
    
    if not env_file.exists():
        if env_example.exists():
            print("Creating .env file from .env.example...")
            import shutil
            shutil.copy(env_example, env_file)
            print("Please update the .env file with your configuration")
        else:
            print("Warning: No .env file found. Please create one manually")

async def seed_database():
    """Seed the database with initial data."""
    print("Seeding database...")
    try:
        from scripts.seed_data_comprehensive import seed_comprehensive_data
        await seed_comprehensive_data()
        print("Database seeding completed!")
    except Exception as e:
        print(f"Database seeding failed: {e}")
        return False
    return True

def start_backend_server():
    """Start the FastAPI backend server."""
    print("Starting AgroBrain AI Backend Server...")
    
    # Change to backend directory
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    # Start uvicorn server
    cmd = [
        sys.executable, "-m", "uvicorn",
        "app.main:app",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--reload",
        "--log-level", "info"
    ]
    
    print(f"Running command: {' '.join(cmd)}")
    print("Backend server will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    
    try:
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\nBackend server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"Failed to start backend server: {e}")
        sys.exit(1)

async def main():
    """Main function to handle startup."""
    parser = argparse.ArgumentParser(description="Start AgroBrain AI Backend")
    parser.add_argument("--seed", action="store_true", help="Seed database with initial data")
    parser.add_argument("--seed-only", action="store_true", help="Only seed database, don't start server")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload")
    
    args = parser.parse_args()
    
    print("=" * 50)
    print("AgroBrain AI Backend Startup")
    print("=" * 50)
    
    # Check requirements
    check_python_version()
    check_env_file()
    
    # Seed database if requested
    if args.seed or args.seed_only:
        success = await seed_database()
        if not success:
            print("Database seeding failed!")
            sys.exit(1)
        
        if args.seed_only:
            print("Database seeding completed. Exiting.")
            sys.exit(0)
    
    # Start backend server
    if not args.seed_only:
        start_backend_server()

if __name__ == "__main__":
    asyncio.run(main())
