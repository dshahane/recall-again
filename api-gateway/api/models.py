# api/models.py

from pydantic import BaseModel
from typing import Optional, List


class AgentBase(BaseModel):
    name: str
    description: str
    persona: str
    status: str
    imageUrl: str

class AgentCreate(AgentBase):
    pass

class Agent(AgentBase):
    id: int

    class Config:
        from_attributes = True

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    persona: Optional[str] = None
    status: Optional[str] = None
    imageUrl: Optional[str] = None

# Define Pydantic models for the data structures
class Pipeline(BaseModel):
    name: str
    status: str
    lastRun: str
    itemsIngested: int
    failures: int

class SchemaItem(BaseModel):
    type: str
    description: str
    mappedFrom: str

class IngestionTrend(BaseModel):
    name: str
    Items_Ingested: int # FastAPI handles the camelCase conversion

class FailureReason(BaseModel):
    name: str
    value: int

class Analytics(BaseModel):
    ingestionTrends: List[IngestionTrend]
    failureReasons: List[FailureReason]

class IngestionData(BaseModel):
    pipelines: List[Pipeline]
    schema: List[SchemaItem]
    analytics: Analytics