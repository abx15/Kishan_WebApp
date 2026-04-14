#!/usr/bin/env python3
"""
AgroBrain AI Frontend Startup Script

This script starts the Next.js frontend development server.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

def check_node_version():
    """Check if Node.js is installed and version is compatible."""
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"Node.js version: {version}")
            
            # Extract version number
            version_num = version.replace("v", "").split(".")
            major = int(version_num[0])
            
            if major < 18:
                print("Warning: Node.js 18 or higher is recommended")
        else:
            print("Error: Node.js is not installed")
            sys.exit(1)
    except FileNotFoundError:
        print("Error: Node.js is not found in PATH")
        sys.exit(1)

def check_npm_version():
    """Check if npm is installed."""
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"npm version: {version}")
        else:
            print("Warning: npm is not available")
    except FileNotFoundError:
        print("Warning: npm is not found in PATH")

def install_dependencies():
    """Install frontend dependencies if needed."""
    frontend_dir = Path(__file__).parent / "frontend"
    package_json = frontend_dir / "package.json"
    node_modules = frontend_dir / "node_modules"
    
    if not package_json.exists():
        print("Error: package.json not found in frontend directory")
        return False
    
    if not node_modules.exists():
        print("Installing frontend dependencies...")
        os.chdir(frontend_dir)
        
        try:
            subprocess.run(["npm", "install"], check=True)
            print("Dependencies installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("Failed to install dependencies")
            return False
    
    return True

def start_frontend_server():
    """Start the Next.js development server."""
    print("Starting AgroBrain AI Frontend Server...")
    
    # Change to frontend directory
    frontend_dir = Path(__file__).parent / "frontend"
    os.chdir(frontend_dir)
    
    # Set environment variables
    env = os.environ.copy()
    env["NEXT_PUBLIC_API_URL"] = "http://localhost:8000"
    env["NEXT_PUBLIC_APP_NAME"] = "AgroBrain AI"
    
    # Start Next.js development server
    cmd = ["npm", "run", "dev"]
    
    print(f"Running command: {' '.join(cmd)}")
    print("Frontend server will be available at: http://localhost:3000")
    
    try:
        subprocess.run(cmd, env=env, check=True)
    except KeyboardInterrupt:
        print("\nFrontend server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"Failed to start frontend server: {e}")
        sys.exit(1)

def build_frontend():
    """Build the frontend for production."""
    print("Building AgroBrain AI Frontend...")
    
    # Change to frontend directory
    frontend_dir = Path(__file__).parent / "frontend"
    os.chdir(frontend_dir)
    
    # Set environment variables
    env = os.environ.copy()
    env["NEXT_PUBLIC_API_URL"] = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")
    env["NEXT_PUBLIC_APP_NAME"] = "AgroBrain AI"
    
    # Build Next.js application
    cmd = ["npm", "run", "build"]
    
    print(f"Running command: {' '.join(cmd)}")
    
    try:
        subprocess.run(cmd, env=env, check=True)
        print("Frontend build completed successfully!")
        print("Build files are in: frontend/out")
    except subprocess.CalledProcessError as e:
        print(f"Failed to build frontend: {e}")
        sys.exit(1)

def main():
    """Main function to handle frontend startup."""
    parser = argparse.ArgumentParser(description="Start AgroBrain AI Frontend")
    parser.add_argument("--install", action="store_true", help="Install dependencies")
    parser.add_argument("--build", action="store_true", help="Build for production")
    parser.add_argument("--start", action="store_true", help="Start development server (default)")
    
    args = parser.parse_args()
    
    print("=" * 50)
    print("AgroBrain AI Frontend Startup")
    print("=" * 50)
    
    # Check requirements
    check_node_version()
    check_npm_version()
    
    # Install dependencies if requested
    if args.install:
        if not install_dependencies():
            sys.exit(1)
    
    # Build for production if requested
    if args.build:
        build_frontend()
        return
    
    # Start development server (default behavior)
    if not install_dependencies():
        sys.exit(1)
    
    start_frontend_server()

if __name__ == "__main__":
    main()
