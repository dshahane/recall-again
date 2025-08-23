# OpenAPI Development Workflow

**FOR NO#: Run the FastAPI server using the following command**
```bash
uvicorn main:app --reload

http://localhost:1080/mockserver/dashboard
```

This document provides a complete set of code and instructions for setting up a development workflow based on an OpenAPI specification, including:
- Setting up a **MockServer** for testing.
- Generating **FastAPI** stubs for the Python backend.
- Generating a subset of **Rust** stubs.
- Creating **database scripts** for persistence.


### 1. MockServer Setup with OpenAPI

MockServer can be run as a standalone application, and a simple way to get it running is with Docker. You can configure it to use your OpenAPI spec to automatically generate mock responses.

**Prerequisites:** Docker installed.

**Step 1: Save your OpenAPI spec**
Save your OpenAPI document as a file named `openapi.yaml` in your project directory.

**Step 2: Create a MockServer configuration file**
Create a file named `mockserver-config.json` with the following content. This configuration tells MockServer to load your spec.

```json
{
  "specUrlOrPayload": "file:///path/to/your/openapi.yaml"
}
```

**Note:** Be sure to replace `/path/to/your/openapi.yaml` with the actual absolute path to your file.

**Step 3: Run MockServer with Docker**
Execute the following command in your terminal from your project directory. It mounts your spec file and config into the Docker container.

```bash
docker run -d --rm \
  -p 1080:1080 \
  -v "$(pwd)/openapi.yaml:/mockserver/openapi.yaml" \
  -v "$(pwd)/mockserver-config.json:/config/mockserver-config.json" \
  --name my-mockserver \
  mockserver/mockserver
```

Once running, MockServer will serve mock responses based on the paths and examples in your `openapi.yaml` file at `http://localhost:1080`.

### 2. Generating FastAPI Stubs

The best tool for this is the `openapi-python-client` library, which generates a clean, modern Python client library. For a server stub, you can also use `openapi-generator-cli`. Here, we'll provide the `openapi-generator-cli` approach for server stubs, as it is a more general-purpose tool.

**Prerequisites:** Python 3.8+ and Java (for `openapi-generator-cli`).

**Step 1: Install the OpenAPI Generator CLI**
You can install this using `npm`, `brew`, or by downloading the JAR file. The Docker approach is the most straightforward as it avoids local dependencies.

```bash
# Using Docker to run the CLI
docker pull openapitools/openapi-generator-cli
```

**Step 2: Run the generator to create FastAPI stubs**
Assuming your OpenAPI spec is `openapi.yaml`, run the following command. This will generate a full FastAPI project in the `fastapi-stubs` directory.

```bash
docker run --rm -v $(pwd):/local openapitools/openapi-generator-cli generate \
  -i /local/openapi.yaml \
  -g python-fastapi \
  -o /local/fastapi-stubs \
  --additional-properties packageName=fastapi_app,projectName=fastapi_app
```

This command generates a complete, runnable FastAPI application. You can navigate into the `fastapi-stubs` directory and start the server with `uvicorn main:app --reload`.

### 3. Generating Rust Stubs

For generating a Rust server stub, we'll also use the `openapi-generator-cli` since it supports many languages.

**Prerequisites:** Rust installed (via `rustup`).

**Step 1: Generate the Rust server stubs**
Use the `openapi-generator-cli` with the Rust server generator. The `axum` framework is a popular choice for building web servers in Rust.

```bash
docker run --rm -v $(pwd):/local openapitools/openapi-generator-cli generate \
  -i /local/openapi.yaml \
  -g rust-server \
  -o /local/rust-stubs \
  --additional-properties library=axum
```

This command will create a new directory `rust-stubs` containing an `axum`-based server with all the necessary routes and models defined by your OpenAPI spec.

### 4. Creating Database Scripts

OpenAPI doesn't have a direct way to generate database schemas, but its **components/schemas** section is a great source for this. We can infer the table structure and relationships from the models you've defined.

Below is an example of a SQL script for a PostgreSQL database. You'll need to adapt it to your specific models and database system (e.g., MySQL, SQLite).

**Note:** This is a conceptual example. Replace `YourModelName` and `YourOtherModelName` with the names from your OpenAPI document. You'll also need to adjust data types (e.g., `VARCHAR` length, `INTEGER` vs. `BIGINT`) based on your specific requirements.

```sql
-- Database Schema for Entities from OpenAPI Specification
-- This script is a conceptual example for a PostgreSQL database.
-- Replace placeholders and adjust data types as needed.

-- Drop tables if they exist to allow for easy recreation during development
DROP TABLE IF EXISTS "orders";
DROP TABLE IF EXISTS "products";
DROP TABLE IF EXISTS "users";

-- Table for User entity
-- Corresponds to a User schema in your OpenAPI document
CREATE TABLE "users" (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL,  -- Using a UUID as a primary key
    "username" VARCHAR(50) UNIQUE NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Product entity
-- Corresponds to a Product schema in your OpenAPI document
CREATE TABLE "products" (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" NUMERIC(10, 2) NOT NULL,
    "stock_quantity" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Order entity
-- Corresponds to an Order schema, likely linking Users and Products
CREATE TABLE "orders" (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "total_amount" NUMERIC(10, 2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Define a foreign key constraint to link to the users table
    CONSTRAINT fk_user
        FOREIGN KEY ("user_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE -- Deletes the order if the user is deleted
);

-- Optional: Create a trigger to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


