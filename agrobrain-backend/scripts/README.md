# Database Seeding Scripts

This directory contains scripts to populate the AgroBrain MongoDB database with sample data for development and testing.

## Scripts Overview

### 1. `seed_data.py`
**Purpose**: Seeds basic reference data
- Daily farming tips (bilingual: Hindi/English)
- Crop metadata (22 crops with seasons and water requirements)

**Usage**:
```bash
python scripts/seed_data.py
```

### 2. `seed_sample_users.py`
**Purpose**: Seeds sample users and related data
- 3 sample farmer profiles with realistic data
- Farm locations with geospatial coordinates
- Sample weather data and forecasts

**Usage**:
```bash
python scripts/seed_sample_users.py
```

### 3. `seed_recommendations_chats.py`
**Purpose**: Seeds ML recommendations and chat history
- Crop recommendations with AI explanations
- Sample chat conversations (bilingual)
- User feedback data

**Usage**:
```bash
python scripts/seed_recommendations_chats.py
```

### 4. `seed_all.py` (Master Script)
**Purpose**: Runs all seed scripts in the correct order
- Executes all individual scripts sequentially
- Provides summary of seeding results
- Handles errors gracefully

**Usage**:
```bash
python scripts/seed_all.py
```

## Database Schema

The scripts populate the following collections:

| Collection | Description | Records |
|------------|-------------|---------|
| `daily_tips` | Bilingual farming tips | 3 |
| `crops` | Crop metadata for ML model | 22 |
| `users` | Farmer profiles | 3 |
| `locations` | Farm locations (geospatial) | 3 |
| `weather_logs` | Weather data and forecasts | 3 |
| `crop_recommendations` | ML-based recommendations | 3 |
| `chat_history` | AI chat conversations | 3 |

## Sample Data Details

### Users
- **Ramesh Kumar**: Hindi-speaking farmer from Lucknow, UP (5.5 acres)
- **Sita Devi**: Hindi-speaking farmer from Kanpur, UP (3.2 acres, soil sensor)
- **Rajesh Singh**: English-speaking farmer from Patna, Bihar (8.0 acres)

### Locations
- Geospatial coordinates for each farm
- Complete address details (village, district, state, pincode)
- Agro-climatic zone information

### Weather Data
- Current conditions (temperature, humidity, wind)
- 7-day forecasts with farming advisories
- Weather alerts (rain, drought, etc.)

### Crop Recommendations
- ML model outputs with confidence scores
- AI-generated explanations (Hindi/English)
- Fertilizer and irrigation recommendations

### Chat History
- Sample conversations in Hindi and English
- Session management with context tracking
- AI response metrics (tokens, response time)

## Environment Setup

Make sure your `.env` file contains:
```env
MONGODB_URL=mongodb+srv://your-connection-string
DATABASE_NAME=agrobrain
```

## Running Scripts

### Quick Start (Recommended):
```bash
# From the backend directory
python scripts/seed_all.py
```

### Individual Scripts:
```bash
# Run specific scripts
python scripts/seed_data.py
python scripts/seed_sample_users.py
python scripts/seed_recommendations_chats.py
```

## Notes

- Scripts use async MongoDB operations (motor)
- Data is cleared before reseeding (delete_many)
- Uses timezone-aware datetime objects
- Includes realistic agricultural data for Indian context
- Supports bilingual content (Hindi/English)

## Troubleshooting

1. **Connection Issues**: Verify MongoDB URL in `.env`
2. **Permission Errors**: Ensure database user has read/write permissions
3. **Import Errors**: Make sure all dependencies are installed (`pip install -r requirements.txt`)

## Data Reset

To completely reset the database:
```bash
python scripts/seed_all.py
```

This will clear all existing data and populate fresh sample data.
