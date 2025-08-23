#!/usr/bin/env bash
docker run -d --rm \
  -p 1080:1080 \
  -v "$(pwd)/api-gateway/mock-server/api.spec.yaml:/mockserver/openapi.yaml" \
  -v "$(pwd)/api-gateway/mock-server/mockserver-config.json:/config/mockserver-config.json" \
  --name my-mockserver \
  mockserver/mockserver