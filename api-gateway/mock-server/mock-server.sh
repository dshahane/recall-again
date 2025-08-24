#!/usr/bin/env bash

# This script runs a Docker container for a mock server
# with the specified OpenAPI specification and configuration.

# --- Configuration ---
# Define the port to map from the host to the container.
# The MockServer container listens on port 1080 by default.
HOST_PORT=1080
CONTAINER_PORT=1080

# Define the name for the Docker container.
CONTAINER_NAME="my-mockserver"

# Define the paths to the OpenAPI spec and the MockServer configuration file.
# We're using the "$(pwd)" command to ensure the paths are relative to the
# current working directory where you run the script.
OPENAPI_SPEC_PATH="$(pwd)/api-gateway/mock-server/api.spec.yaml"
MOCKSERVER_CONFIG_PATH="$(pwd)/api-gateway/mock-server/mockserver-config.json"

# --- Script Logic ---

# Check if the container is already running.
# The 'docker ps' command with the -f flag filters by name.
# The '-q' flag returns only the container IDs.
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
  echo "The '${CONTAINER_NAME}' container is already running. Stopping it..."
  docker stop "${CONTAINER_NAME}"
fi

# Run the Docker container in detached mode (-d).
# The '--rm' flag ensures the container is automatically removed when it exits.
docker run -d --rm \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  -v "${OPENAPI_SPEC_PATH}:/mockserver/openapi.yaml" \
  -v "${MOCKSERVER_CONFIG_PATH}:/config/mockserver-config.json" \
  --name "${CONTAINER_NAME}" \
  mockserver/mockserver

echo "Mock server started successfully on port ${HOST_PORT}."
echo "Container name: ${CONTAINER_NAME}"
