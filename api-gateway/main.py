# agents.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import agents, ingestion

app = FastAPI(title="Agent Management API")

# Define the origins that are allowed to make requests
origins = [
    "http://localhost:3000",
    "http://192.168.5.30:3000",  # Your local network IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(agents.router, prefix="/api/v1/agents", tags=["agents"])
app.include_router(ingestion.router, prefix="/api/v1/ingestion", tags=["ingestion"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Agent Management API!"}