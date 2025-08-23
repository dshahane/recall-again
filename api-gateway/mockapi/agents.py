import sys
import os
import json
import uuid
from typing import List

from pydantic import BaseModel

# Add stubs directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
stubs_dir = os.path.join(project_root, 'fastapi-stubs', 'src')
sys.path.append(stubs_dir)

# Now you can import your generated stubs
from trl.models.agent import Agent
from trl.models.agent_usage import AgentUsage
from trl.models.agent_accuracy import AgentAccuracy

# --- Pydantic Models ---

class Expectation(BaseModel):
    """
    A Pydantic model for a MockServer expectation, mapping a request to a response.
    """
    httpRequest: dict
    httpResponse: dict

# --- Generate Mock Agent Data ---

# Create a list to hold all the mock agent objects.
mock_agents: List[Agent] = []
# Generate 10 mock agents.
for i in range(1, 11):
    mock_agent = Agent(
        id=str(i),
        name=f"Agent-{i}",
        developer="dss@iname.com",
        description=f"This agent keeps track of customers and is agent number {i}",
        icon="customers",
        specialty=["revenue", "support", "returns"],
        usage=AgentUsage(),
        accuracy=AgentAccuracy(),
    )
    mock_agents.append(mock_agent)

# --- Generate Expectations for the Mock Server ---

all_expectations: List[Expectation] = []

# Create the expectation for the main /v1/agents endpoint.
# The body of the response is a JSON array of all generated agents.
list_all_agents_expectation = Expectation(
    httpRequest={
        "path": "/v1/agents",
        "method": "GET"
    },
    httpResponse={
        "statusCode": 200,
        "body": [agent.model_dump() for agent in mock_agents],
    }
)
all_expectations.append(list_all_agents_expectation)

# Create an expectation for each individual agent endpoint (/v1/agents/{id}).
for agent in mock_agents:
    expectation_data = Expectation(
        httpRequest={
            "path": f"/v1/agents/{agent.id}",
            "method": "GET"
        },
        httpResponse={
            "statusCode": 200,
            "body": agent.model_dump(),
        }
    )
    all_expectations.append(expectation_data)

# --- Save Expectations to JSON file ---

# Convert the list of expectation objects to a list of dictionaries.
expectations_as_dicts = [exp.model_dump() for exp in all_expectations]

# Convert the list of dictionaries to JSON and save to a file.
with open("expectations.json", "w") as f:
    json.dump(expectations_as_dicts, f, indent=2)

print("Expectation JSON file with all agents and individual agents created successfully!")
