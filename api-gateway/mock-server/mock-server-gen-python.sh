#!/usr/bin/env bash

# This script generates client stubs for multiple OpenAPI YAML files.
# It iterates through a list of files and runs the openapi-generator-cli
# command for each one, outputting them into a single, unified directory.

# --- Configuration ---
# Set the base directory for your OpenAPI specification files.
# The "$(pwd)" part gets the current working directory.
OPENAPI_DIR="$(pwd)/api-gateway"

# Define the list of OpenAPI specification files to process.
YAML_FILES=(
  "agent.api.spec.yaml"
  "context.api.spec.yaml"
)

# Set the single output directory for all generated stubs.
# All generated files will be placed here.
OUTPUT_DIR="${OPENAPI_DIR}/fastapi-stubs/src"

# Set the generator language.
GENERATOR="python-fastapi"

# Set additional properties for the generator.
ADDITIONAL_PROPS="packageName=trl,projectName=Token-Recall"

# --- Script Logic ---
# Create the output directory if it doesn't exist.
mkdir -p "${OUTPUT_DIR}"

# Loop through each file in the YAML_FILES array.
for file in "${YAML_FILES[@]}"; do
  # Construct the full path to the input file.
  INPUT_FILE="/local/mock-server/${file}"

  echo "Generating stubs for: ${file}"

  # Run the Docker command for the current file.
  # The -v flag mounts the local directory into the container.
  docker run --rm -v "${OPENAPI_DIR}:/local" openapitools/openapi-generator-cli generate \
    -i "${INPUT_FILE}" \
    -g "${GENERATOR}" \
    -o "/local/fastapi-stubs" \
    --additional-properties "${ADDITIONAL_PROPS}"

  echo "Generation complete for ${file}. All files placed in ${OUTPUT_DIR}"
  echo "--------------------------------------------------"
done

echo "All OpenAPI stubs have been generated successfully into a single directory."
