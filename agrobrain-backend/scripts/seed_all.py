#!/usr/bin/env python3
"""
Master seed script for AgroBrain database.
Runs all individual seed scripts in the correct order.
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import the seed modules
sys.path.append(str(Path(__file__).parent))

async def run_seed_script(script_name, description):
    """Run a single seed script."""
    print(f"\n{'='*50}")
    print(f"Running: {description}")
    print(f"Script: {script_name}")
    print(f"{'='*50}")
    
    try:
        if script_name == "seed_data.py":
            from seed_data import seed_data
            await seed_data()
        elif script_name == "seed_sample_users.py":
            from seed_sample_users import seed_sample_users
            await seed_sample_users()
        elif script_name == "seed_recommendations_chats.py":
            from seed_recommendations_chats import seed_recommendations_and_chats
            await seed_recommendations_and_chats()
        else:
            print(f"Unknown script: {script_name}")
            return False
            
        print(f"Successfully completed: {description}")
        return True
        
    except Exception as e:
        print(f"Error running {script_name}: {str(e)}")
        return False

async def main():
    """Main seeding function."""
    print("Starting AgroBrain database seeding...")
    print("This will populate the database with sample data for development and testing.")
    
    # Define seed scripts in order
    seed_scripts = [
        ("seed_data.py", "Basic data (daily tips, crop metadata)"),
        ("seed_sample_users.py", "Sample users, locations, and weather data"),
        ("seed_recommendations_chats.py", "Crop recommendations and chat history")
    ]
    
    success_count = 0
    total_scripts = len(seed_scripts)
    
    for script_name, description in seed_scripts:
        if await run_seed_script(script_name, description):
            success_count += 1
        else:
            print(f"Failed to run {script_name}. Continuing with next script...")
    
    print(f"\n{'='*50}")
    print("SEEDING SUMMARY")
    print(f"{'='*50}")
    print(f"Completed: {success_count}/{total_scripts} scripts")
    
    if success_count == total_scripts:
        print("All seeding completed successfully!")
        print("\nDatabase now contains:")
        print("- Daily tips (fertilizer, irrigation, soil advice)")
        print("- Crop metadata (22 crops with seasons and water needs)")
        print("- Sample users (3 farmers with profiles)")
        print("- Farm locations (geospatial data)")
        print("- Weather data (current conditions and forecasts)")
        print("- Crop recommendations (ML-based with AI explanations)")
        print("- Chat history (sample conversations)")
    else:
        print("Some seeding scripts failed. Please check the errors above.")
    
    print(f"\nDatabase URL: {os.getenv('MONGODB_URL', 'mongodb://localhost:27017')}")
    print(f"Database Name: {os.getenv('DATABASE_NAME', 'agrobrain')}")

if __name__ == "__main__":
    asyncio.run(main())
