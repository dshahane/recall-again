# api/agents.py

from fastapi import APIRouter, HTTPException
from typing import List
import httpx

from api.config import settings
from api.models import Agent, AgentCreate, AgentUpdate

router = APIRouter()

# Mock data to be used when settings.API_MODE == "mock"
mock_agents_data = [
    {
        "id": 1,
        "name": 'Sales Agent',
        "description": 'Specialized in lead generation and customer outreach. Optimizes sales funnels.',
        "status": 'online',
        "persona": "default",
        "imageUrl": 'https://placehold.co/60x60/34D399/FFFFFF?text=SA',
    },
    {
        "id": 2,
        "name": 'Support Bot',
        "description": 'Provides 24/7 customer support and handles common queries. Reduces ticket load.',
        "status": 'online',
        "persona": "default",
        "imageUrl": 'https://placehold.co/60x60/60A5FA/FFFFFF?text=SB',
    },
    {
        "id": 3,
        "name": 'Marketing Bot',
        "description": 'Creates and schedules social media posts, analyzes engagement metrics.',
        "status": 'offline',
        "persona": "default",
        "imageUrl": 'https://placehold.co/60x60/FCD34D/FFFFFF?text=MB',
    },
    {
        "id": 4,
        "name": 'Data Scraper',
        "description": 'Collects and processes data from various web sources for market analysis.',
        "status": 'online',
        "persona": "default",
        "imageUrl": 'https://placehold.co/60x60/F87171/FFFFFF?text=DS',
    },
    {
        "id": 5,
        "name": 'Document Understanding',
        "description": 'Understands PDF files.',
        "status": 'online',
        "persona": "default",
        "imageUrl": 'https://placehold.co/60x60/F87171/FFFFFF?text=DU',
    },
]

next_id = 5
# Helper function to find an agent
def find_agent(agent_id: int):
    for agent in mock_agents_data:
        if agent["id"] == agent_id:
            return agent
    return None

@router.get("/", response_model=List[Agent])
async def list_agents():
    """
    Retrieves a list of agents, either from mock data or the Rust backend.
    """
    if settings.API_MODE == "mock":
        return mock_agents_data
    else:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(settings.RUST_BACKEND_URL)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as exc:
                raise HTTPException(status_code=exc.response.status_code, detail="Rust backend returned an error.")
            except httpx.RequestError:
                raise HTTPException(status_code=500, detail="Could not connect to the Rust backend.")

@router.post("/", response_model=Agent)
async def create_agent(agent: AgentCreate):
    """
    Creates a new agent.
    """
    if settings.API_MODE == "mock":
        global next_id
        new_agent = agent.dict()
        new_agent["id"] = next_id
        mock_agents_data.append(new_agent)
        next_id += 1
        return new_agent
    else:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(settings.RUST_BACKEND_URL, json=agent.dict())
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as exc:
                raise HTTPException(status_code=exc.response.status_code, detail="Rust backend returned an error.")
            except httpx.RequestError:
                raise HTTPException(status_code=500, detail="Could not connect to the Rust backend.")

@router.get("/{agent_id}", response_model=Agent)
async def get_agent(agent_id: int):
    """
    Retrieves a single agent by ID.
    """
    if settings.API_MODE == "mock":
        for agent in mock_agents_data:
            if agent["id"] == agent_id:
                return agent
        raise HTTPException(status_code=404, detail="Agent not found.")
    else:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{settings.RUST_BACKEND_URL}/{agent_id}")
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as exc:
                if exc.response.status_code == 404:
                    raise HTTPException(status_code=404, detail="Agent not found.")
                raise HTTPException(status_code=exc.response.status_code, detail="Rust backend returned an error.")
            except httpx.RequestError:
                raise HTTPException(status_code=500, detail="Could not connect to the Rust backend.")

@router.put("/{agent_id}", response_model=Agent)
async def update_agent(agent_id: int, agent_update: AgentUpdate): # Note: using AgentCreate here for simplicity
    if settings.API_MODE == "mock":
        existing_agent = find_agent(agent_id)
        if not existing_agent:
            raise HTTPException(status_code=404, detail="Agent not found")

        # Update the agent's data
        existing_agent.update(agent_update.dict())
        return existing_agent
    else:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.put(settings.RUST_BACKEND_URL, json=agent_update.dict())
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as exc:
                raise HTTPException(status_code=exc.response.status_code, detail="Rust backend returned an error.")
            except httpx.RequestError:
                raise HTTPException(status_code=500, detail="Could not connect to the Rust backend.")

@router.delete("/{agent_id}", status_code=204) # 204 No Content for successful deletion
async def delete_agent(agent_id: int):
    if settings.API_MODE == "mock":
        existing_agent = find_agent(agent_id)
        if not existing_agent:
            raise HTTPException(status_code=404, detail="Agent not found")

        mock_agents_data.remove(existing_agent)
        return
    else:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(f"{settings.RUST_BACKEND_URL}/{agent_id}")
                # FastAPI will re-raise the HTTPException if the status code is an error
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as exc:
                raise HTTPException(status_code=exc.response.status_code, detail="Rust backend returned an error.")
            except httpx.RequestError:
                raise HTTPException(status_code=500, detail="Could not connect to the Rust backend.")