from fastapi import APIRouter, HTTPException
from typing import List
import httpx

from api.config import settings
from api.models import IngestionData

router = APIRouter()

# The mock data is now defined in a dictionary that matches our Pydantic schema
mock_data_dict = {
    "pipelines": [
        { "name": "BMEcat Ingestion", "status": "Succeeded", "lastRun": "2025-08-20 10:30 AM", "itemsIngested": 15432, "failures": 0 },
        { "name": "Reviews Ingestion", "status": "Running", "lastRun": "2025-08-20 11:00 AM", "itemsIngested": 8760, "failures": 2 },
        { "name": "Clickstream Data", "status": "Succeeded", "lastRun": "2025-08-20 09:45 AM", "itemsIngested": 213214, "failures": 12 },
    ],
    "schema": [
        { "type": "schema.org/Product", "description": "Core product information", "mappedFrom": "BMEcat" },
        { "type": "schema.org/Offer", "description": "Pricing and availability", "mappedFrom": "BMEcat" },
        { "type": "schema.org/Review", "description": "Public domain reviews", "mappedFrom": "Reviews Dataset" },
        { "type": "schema.org/AggregateRating", "description": "Calculated average rating", "mappedFrom": "Reviews Dataset" },
        { "type": "schema.org/ViewAction", "description": "User product views", "mappedFrom": "Clickstream Data" },
        { "type": "schema.org/SearchAction", "description": "User search queries", "mappedFrom": "Query Data" },
    ],
    "analytics": {
        "ingestionTrends": [
            { "name": "Day 1", "Items_Ingested": 4000 },
            { "name": "Day 2", "Items_Ingested": 3000 },
            { "name": "Day 3", "Items_Ingested": 2000 },
            { "name": "Day 4", "Items_Ingested": 2780 },
            { "name": "Day 5", "Items_Ingested": 1890 },
            { "name": "Day 6", "Items_Ingested": 2390 },
            { "name": "Day 7", "Items_Ingested": 3490 },
        ],
        "failureReasons": [
            { "name": "Malformed Data", "value": 400 },
            { "name": "Schema Mismatch", "value": 300 },
            { "name": "Timeout", "value": 200 },
            { "name": "Duplicate Record", "value": 100 },
        ],
    },
}

# Define the API endpoint to serve all mock data with a Pydantic response model
@router.get("/data", response_model=IngestionData)
async def get_data():
    return mock_data_dict