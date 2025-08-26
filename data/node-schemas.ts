import { NodeKind } from '@/components/models/workflow/types';
import { z } from 'zod';

// Define the configuration schema for an 'llm' node.
export const llmNodeSchema = z.object({
    // 'prompt' is a required string.
    prompt: z.string().describe("Prompt for the LLM model.").default("Generate a response."),
    // 'model' is an enum with a predefined set of values.
    model: z.enum(["gemini-pro", "gpt-4o", "llama3"]).describe("Select the LLM model to use."),
    // 'temperature' is a number between 0 and 1.
    temperature: z.number().min(0).max(1).default(0.7).describe("Creativity level (0-1)."),
    // 'max_tokens' is an optional number.
    max_tokens: z.number().optional().describe("Max number of tokens to generate.")
});

// Define the configuration schema for a 'query' node.
export const queryNodeSchema = z.object({
    // 'query_source' is a required string.
    query_source: z.string().describe("Source of the query data.").default("Search"),
    // 'query_params' is an object for key-value pairs.
    query_params: z.record(z.string(), z.string()).describe("Parameters for the query."),
    // 'use_cache' is a boolean.
    use_cache: z.boolean().describe("Whether to use a cached result.").default(true)
});

// Create a mapping object to easily access schemas by node 'kind'.
export const nodeSchemas = {
    [NodeKind.Llm]: llmNodeSchema,
    [NodeKind.QueryTrigger]: queryNodeSchema,
    // Add more schemas here as you define them for other node kinds
    // For example:
    // 'classifier': classifierNodeSchema,
    // 'sql': sqlNodeSchema
};
