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

export const apiNodeSchema = z.object({
    // 'query_source' is a required string.
    url: z.string().describe("Source of the query data.").default("URL"),
    // 'query_params' is an object for key-value pairs.
    params: z.record(z.string(), z.string()).describe("Parameters for the endpoint."),
});

// -----------------------------------------------------------
// ZOD SCHEMAS FOR INDIVIDUAL NODE CONFIGURATION
// -----------------------------------------------------------

/**
 * Schema for nodes that query structured data.
 * This is a common schema for Table, Catalog, Sql, Sheet, and Sparql nodes.
 */
const dataQuerySchema = z.object({
    source_name: z.string().describe("The name of the data source (e.g., 'Google Sheets', 'SQL Database')."),
    query_string: z.string().describe("The query string to retrieve data. For SQL and Sparql, this is the main query."),
    use_cache: z.boolean().describe("Whether to use a cached result for this query.").default(true),
    // Additional parameters for a given query can be dynamic.
    query_parameters: z.record(z.string(), z.string()).describe("Dynamic parameters for the query."),
});

/**
 * Schema for the ApiSink node.
 * This node is for making outbound API calls.
 */
const apiSinkSchema = z.object({
    endpoint_url: z.string().url().describe("The API endpoint URL to send data to."),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).describe("The HTTP method for the API call.").default('POST'),
    headers: z.record(z.string(), z.string()).describe("Custom headers for the API request.").default({}),
    body_data: z.string().describe("The request body data. This can be a JSON string or other payload."),
});

/**
 * Schema for nodes that store or retrieve data from the application context.
 */
const contextSchema = z.object({
    context_key: z.string().min(1).describe("The key used to identify the data in the application context."),
});

/**
 * Schema for the Delay node.
 * This node pauses the execution flow.
 */
const delaySchema = z.object({
    delay_in_ms: z.number().int().min(0).describe("The duration of the delay in milliseconds.").default(1000),
});

/**
 * Schema for the VisualizationSink node.
 * This node is used for displaying data, typically in a chart.
 */
const visualizationSchema = z.object({
    chart_type: z.enum(['BarChart', 'LineChart', 'PieChart', 'ScatterPlot']).describe("The type of chart to display."),
    data_source_key: z.string().describe("The key of the data source from which to get the visualization data."),
    x_axis_key: z.string().describe("The key in the data to use for the X-axis."),
    y_axis_key: z.string().describe("The key in the data to use for the Y-axis."),
});

/**
 * Schema for trigger nodes that initiate a workflow.
 */
const timerTriggerSchema = z.object({
    cron_expression: z.string().describe("The cron expression to schedule the trigger (e.g., '0 * * * *')."),
});

const documentTriggerSchema = z.object({
    collection_path: z.string().describe("The Firestore-like path to the collection to listen to."),
});

const sessionTriggerSchema = z.object({
    session_id: z.string().describe("The key to identify a specific user session.").default("user_session"),
});

/**
 * Schema for logic and control flow nodes.
 */
const conditionSchema = z.object({
    condition_expression: z.string().describe("A JavaScript-like expression that evaluates to a boolean (e.g., 'input.value > 100')."),
});

const loopSchema = z.object({
    array_source_key: z.string().describe("The key of the array data to iterate over."),
    iterator_variable_name: z.string().describe("The name of the variable to hold the current item in the loop.").default("item"),
});

/**
 * Schema for AI/ML nodes.
 */
const modelSchema = z.object({
    model_name: z.string().describe("The name or ID of the machine learning model to use."),
    input_data_key: z.string().describe("The key of the data to be processed by the model."),
});

const rankerSchema = z.object({
    items_source_key: z.string().describe("The key of the array of items to rank."),
    ranking_criteria: z.string().describe("A description or expression of the criteria to use for ranking."),
});

const transformationSchema = z.object({
    transformation_script: z.string().describe("A JavaScript or Python script to perform the data transformation.").default("return data;"),
});

/**
 * Schema for a node that defines variables.
 */
const variablesSchema = z.object({
    variables: z.record(z.string(), z.string()).describe("Key-value pairs for variables that will be available in the workflow."),
});

/**
 * Schema for a node that handles reviews (e.g., for sentiment analysis or categorization).
 */
const reviewsSchema = z.object({
    product_id: z.string().describe("The ID of the product for which to get reviews."),
    review_source_key: z.string().describe("The key of the data source containing the reviews."),
});


/**
 * Returns the appropriate Zod schema for a given NodeKind.
 *
 * @param {NodeKind} kind The type of the node.
 * @returns {z.ZodTypeAny} The Zod schema for that node's configuration.
 */
export const getNodeSchema = (kind: NodeKind): z.ZodTypeAny => {
    switch (kind) {
        case NodeKind.Llm:
        return llmNodeSchema;
        case NodeKind.QueryTrigger:
            return queryNodeSchema;
        case NodeKind.Api:
            return apiNodeSchema;
        case NodeKind.Table:
        case NodeKind.Catalog:
        case NodeKind.Sql:
        case NodeKind.Sheet:
        case NodeKind.Sparql:
            return dataQuerySchema;
        case NodeKind.ApiSink:
            return apiSinkSchema;
        case NodeKind.ContextSink:
        case NodeKind.Context:
            return contextSchema;
        case NodeKind.Delay:
            return delaySchema;
        case NodeKind.VisualizationSink:
            return visualizationSchema;
        case NodeKind.TimerTrigger:
            return timerTriggerSchema;
        case NodeKind.DocumentTrigger:
            return documentTriggerSchema;
        case NodeKind.SessionTrigger:
            return sessionTriggerSchema;
        case NodeKind.Condition:
            return conditionSchema;
        case NodeKind.Loop:
            return loopSchema;
        case NodeKind.Ranker:
            return rankerSchema;
        case NodeKind.Regressor:
        case NodeKind.Classifier:
        case NodeKind.IntentDetection:
            return modelSchema;
        case NodeKind.Transformation:
            return transformationSchema;
        case NodeKind.Variables:
            return variablesSchema;
        case NodeKind.Reviews:
            return reviewsSchema;
        case NodeKind.TryCatch:
            // This node is for flow control and doesn't need custom configuration.
            return z.object({});
        default:
            // Return an empty schema for any unhandled node kinds.
            console.warn(`No specific schema found for NodeKind: ${kind}`);
            return z.object({});
    }
};


// Create a mapping object to easily access schemas by node 'kind'.
export const nodeSchemas = {
    [NodeKind.Llm]: llmNodeSchema,
    [NodeKind.QueryTrigger]: queryNodeSchema,
    [NodeKind.Api]: apiNodeSchema,
    [NodeKind.Table]: queryNodeSchema,
    [NodeKind.Catalog]: queryNodeSchema,
    [NodeKind.ApiSink]: queryNodeSchema,
    [NodeKind.ContextSink]: queryNodeSchema,
    [NodeKind.Delay]: queryNodeSchema,
    [NodeKind.VisualizationSink]: queryNodeSchema,
    [NodeKind.TimerTrigger]: queryNodeSchema,
    [NodeKind.DocumentTrigger]: queryNodeSchema,
    [NodeKind.SessionTrigger]: queryNodeSchema,
    [NodeKind.TryCatch]: queryNodeSchema,
    [NodeKind.Condition]: queryNodeSchema,
    [NodeKind.Ranker]: queryNodeSchema,
    [NodeKind.Context]: queryNodeSchema,
    [NodeKind.Regressor]: queryNodeSchema,
    [NodeKind.Classifier]: queryNodeSchema,
    [NodeKind.Transformation]: queryNodeSchema,
    [NodeKind.IntentDetection]: queryNodeSchema,
    [NodeKind.Loop]: queryNodeSchema,
    [NodeKind.Variables]: queryNodeSchema,
    [NodeKind.Reviews]: queryNodeSchema,
    [NodeKind.Sql]: queryNodeSchema,
    [NodeKind.Sheet]: queryNodeSchema,
    [NodeKind.Sparql]: queryNodeSchema,
    // Add more schemas here as you define them for other node kinds
    // For example:
    // 'classifier': classifierNodeSchema,
    // 'sql': sqlNodeSchema
};
