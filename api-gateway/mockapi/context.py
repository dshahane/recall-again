import sys
import os
import json
import uuid
import random
from typing import List, Optional, Dict, Any

from pydantic import BaseModel

from trl.models.context import Context
from trl.models.model import Model
from trl.models.pipeline import Pipeline
from mockapi.agents import Expectation

# Add stubs directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
stubs_dir = os.path.join(project_root, 'fastapi-stubs', 'src')
sys.path.append(stubs_dir)

# --- Pydantic Models based on the OpenAPI Schema ---
# These models are created based on the schemas defined in the provided
# context.api.spec.yaml file to ensure mock data matches the API contract.

# class ContextCreate(BaseModel):
#     name: str
#     type: str
#     scope: str
#     sourceSchemas: List[str]
#     schema_def: str # Renamed to avoid Python keyword conflict
#     tags: Optional[List[str]] = None
#     pipeline: Optional[str] = None
#
# class ContextUpdate(ContextCreate):
#     isActive: Optional[bool] = None
#
# class Context(BaseModel):
#     id: str
#     name: str
#     type: str
#     scope: str
#     sourceSchemas: List[str]
#     schema_def: str # Renamed to avoid Python keyword conflict
#     tags: Optional[List[str]] = None
#     pipeline: Optional[str] = None
#     isActive: bool = True
#
# class PipelineCreate(BaseModel):
#     name: str
#     sourceSchemas: List[str]
#     targetSchema: str
#     model: str
#
# class Pipeline(BaseModel):
#     id: str
#     name: str
#     sourceSchemas: List[str]
#     targetSchema: str
#     model: str
#
# class Model(BaseModel):
#     id: str
#     name: str
#     supportedSourceSchemas: List[str]
#     supportedTargetSchema: str
#     supportedContextTypes: List[str]
#
# class Expectation(BaseModel):
#     """
#     A Pydantic model for a MockServer expectation, mapping a request to a response.
#     """
#     httpRequest: dict
#     httpResponse: dict

# --- Generate Mock Data for All API Endpoints ---

# Static data sets to use for generation
CONTEXT_TYPES = ["customer-support", "sales", "marketing", "logistics"]
CONTEXT_SCOPES = ["user", "team", "organization"]
SCHEMAS = ["schema_A", "schema_B", "schema_C"]
PIPELINES = [str(uuid.uuid4()) for _ in range(3)]
MODELS = [str(uuid.uuid4()) for _ in range(3)]

# Create a list to hold all the mock context objects.
mock_contexts: List[Context] = []
for i in range(1, 11):
    mock_context = Context(
        id=str(uuid.uuid4()),
        name=f"Context-{i}",
        type=random.choice(CONTEXT_TYPES),
        scope=random.choice(CONTEXT_SCOPES),
        sourceSchemas=random.sample(SCHEMAS, random.randint(1, len(SCHEMAS))),
        schema_def=f"{{ \"$id\": \"{uuid.uuid4()}\", \"title\": \"Schema {i}\" }}",
        tags=random.sample(["tag-A", "tag-B", "tag-C"], random.randint(1, 3)),
        pipeline=random.choice(PIPELINES),
        isActive=random.choice([True, False])
    )
    mock_contexts.append(mock_context)

# Create mock data for pipelines.
mock_pipelines: List[Pipeline] = []
for i in range(1, 6):
    mock_pipeline = Pipeline(
        id=str(uuid.uuid4()),
        name=f"Pipeline-{i}",
        sourceSchemas=random.sample(SCHEMAS, random.randint(1, len(SCHEMAS))),
        targetSchema=random.choice(SCHEMAS),
        model=random.choice(MODELS)
    )
    mock_pipelines.append(mock_pipeline)

# Create mock data for models.
mock_models: List[Model] = []
for i in range(1, 6):
    mock_model = Model(
        id=str(uuid.uuid4()),
        name=f"Model-{i}",
        supportedSourceSchemas=random.sample(SCHEMAS, random.randint(1, len(SCHEMAS))),
        supportedTargetSchema=random.choice(SCHEMAS),
        supportedContextTypes=random.sample(CONTEXT_TYPES, random.randint(1, 2))
    )
    mock_models.append(mock_model)

# --- Generate Expectations for the Mock Server ---
all_expectations: List[Expectation] = []

# --- Contexts Endpoints ---

# GET /contexts
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/contexts", "method": "GET"},
    httpResponse={"statusCode": 200, "body": [c.model_dump(by_alias=True) for c in mock_contexts]}
))

# POST /contexts
post_context_body = {
    "name": "New-Context-1",
    "type": "customer-support",
    "scope": "user",
    "sourceSchemas": ["schema_A"],
    "schema_def": "{ \"$id\": \"new-schema\", \"title\": \"New Context Schema\" }"
}
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/contexts", "method": "POST", "body": post_context_body},
    httpResponse={"statusCode": 201, "body": {**post_context_body, "id": str(uuid.uuid4()), "isActive": True}}
))

# PUT /contexts/{contextId} (for the first mock context)
first_context_update = mock_contexts[0].model_dump()
first_context_update['name'] = "Updated-Context"
all_expectations.append(Expectation(
    httpRequest={"path": f"/v1/contexts/{mock_contexts[0].id}", "method": "PUT", "body": first_context_update},
    httpResponse={"statusCode": 200, "body": first_context_update}
))

# DELETE /contexts/{contextId} (for the second mock context)
all_expectations.append(Expectation(
    httpRequest={"path": f"/v1/contexts/{mock_contexts[1].id}", "method": "DELETE"},
    httpResponse={"statusCode": 204}
))

# PATCH /contexts/{contextId}/toggle-active (for the third mock context)
all_expectations.append(Expectation(
    httpRequest={"path": f"/v1/contexts/{mock_contexts[2].id}/toggle-active", "method": "PATCH", "body": {"isActive": True}},
    httpResponse={"statusCode": 200}
))

# --- Pipelines Endpoints ---

# GET /pipelines
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/pipelines", "method": "GET"},
    httpResponse={"statusCode": 200, "body": [p.model_dump(by_alias=True) for p in mock_pipelines]}
))

# POST /pipelines
post_pipeline_body = {
    "name": "New-Pipeline-1",
    "sourceSchemas": ["schema_B"],
    "targetSchema": "schema_C",
    "model": "model_1"
}
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/pipelines", "method": "POST", "body": post_pipeline_body},
    httpResponse={"statusCode": 201, "body": {**post_pipeline_body, "id": str(uuid.uuid4())}}
))

# --- Models Endpoint ---

# GET /models (with no query parameters)
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/models", "method": "GET"},
    httpResponse={"statusCode": 200, "body": [m.model_dump(by_alias=True) for m in mock_models]}
))

# GET /models (with query parameters)
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/models", "method": "GET", "queryStringParameters": {"sourceSchemas": "schema_A"}},
    httpResponse={"statusCode": 200, "body": [m.model_dump(by_alias=True) for m in mock_models if "schema_A" in m.supportedSourceSchemas]}
))

# --- Static Data Endpoints ---

# GET /static-data/context-types
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/static-data/context-types", "method": "GET"},
    httpResponse={"statusCode": 200, "body": CONTEXT_TYPES}
))

# GET /static-data/context-scopes
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/static-data/context-scopes", "method": "GET"},
    httpResponse={"statusCode": 200, "body": CONTEXT_SCOPES}
))

# GET /static-data/schemas
all_expectations.append(Expectation(
    httpRequest={"path": "/v1/static-data/schemas", "method": "GET"},
    httpResponse={"statusCode": 200, "body": SCHEMAS}
))

# --- Save Expectations to JSON file ---

# Convert the list of expectation objects to a list of dictionaries.
expectations_as_dicts = [exp.model_dump(by_alias=True) for exp in all_expectations]

# Convert the list of dictionaries to JSON and save to a file.
with open("expectations.json", "w") as f:
    json.dump(expectations_as_dicts, f, indent=2)

print("Expectation JSON file for all Context API methods created successfully!")
