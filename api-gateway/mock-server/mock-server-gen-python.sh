#!/usr/bin/env bash
docker run --rm -v $(pwd)/api-gateway:/local openapitools/openapi-generator-cli generate \
  -i /local/mock-server/api.spec.yaml \
  -g python-fastapi \
  -o /local/fastapi-stubs \
  --additional-properties packageName=trl,projectName=Token-Recall