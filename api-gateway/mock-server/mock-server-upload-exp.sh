#!/bin/bash

# upload.sh
# This script first clears all existing MockServer expectations,
# then uploads a new JSON file containing fresh expectations.

# --- Configuration ---
# You can change these default values or pass them as arguments
DEFAULT_MOCKSERVER_URL="http://localhost:1080"
EXPECTATION_PATH="/mockserver/expectation"
CLEAR_PATH="/mockserver/clear"
DEFAULT_FILE="expectations.json"

# --- Argument Parsing ---
# Check if the correct number of arguments are provided
if [ "$#" -eq 0 ]; then
    FILE_TO_UPLOAD="$DEFAULT_FILE"
    MOCKSERVER_URL="$DEFAULT_MOCKSERVER_URL"
elif [ "$#" -eq 1 ]; then
    FILE_TO_UPLOAD="$1"
    MOCKSERVER_URL="$DEFAULT_MOCKSERVER_URL"
elif [ "$#" -eq 2 ]; then
    FILE_TO_UPLOAD="$1"
    MOCKSERVER_URL="$2"
else
    echo "Usage: $0 [file_path] [mockserver_url]"
    echo "  file_path (optional): The JSON file to upload. Defaults to '${DEFAULT_FILE}'."
    echo "  mockserver_url (optional): The MockServer base URL. Defaults to '${DEFAULT_MOCKSERVER_URL}'."
    exit 1
fi

# --- Main Script Logic ---

# Step 1: Delete all existing expectations
echo "Deleting all expectations from ${MOCKSERVER_URL}${CLEAR_PATH}..."
# The correct payload to clear all expectations is an empty JSON object
curl_delete_response=$(curl -sS -X PUT "${MOCKSERVER_URL}${CLEAR_PATH}" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nHTTP Status Code: %{http_code}\n")
echo "$curl_delete_response"
delete_status=$(echo "$curl_delete_response" | awk 'END{print $NF}')

if [ "$delete_status" -ne 200 ]; then
    echo "Deletion failed. Exiting."
    exit 1
fi

echo "----------------------------------------"

# Step 2: Upload the new expectations
# Check if the file exists
if [ ! -f "$FILE_TO_UPLOAD" ]; then
    echo "Error: File not found at '$FILE_TO_UPLOAD'"
    exit 1
fi

echo "Uploading '$FILE_TO_UPLOAD' to ${MOCKSERVER_URL}${EXPECTATION_PATH}..."

# Use curl to send the PUT request
curl_upload_response=$(curl -sS -X PUT "${MOCKSERVER_URL}${EXPECTATION_PATH}" \
  -H "Content-Type: application/json" \
  -d "@$FILE_TO_UPLOAD" \
  -w "\nHTTP Status Code: %{http_code}\n")
echo "$curl_upload_response"

# Check the HTTP status code
upload_status=$(echo "$curl_upload_response" | awk 'END{print $NF}')
if [ "$upload_status" -eq 200 ] || [ "$upload_status" -eq 201 ]; then
    echo "Success!"
else
    echo "Upload failed."
    exit 1
fi

