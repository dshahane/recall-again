// This file centralizes all static mock data for the application.

// Static data for demonstration
export const contextTypes = ['Personalization', 'Document Understanding', 'Query / Question Understanding', 'Retrieval', 'Ranking', 'Time Series', 'Analytical'];
export const contextScopes = ['User', 'Request', 'Session', 'Document', 'Forever'];
export const schemaOptions = ['Article', 'Event', 'Person', 'Product', 'Place', 'Organization', 'Review', 'Recipe', 'Book', 'Movie', 'RankedProductList', 'EntityExtractionResult'];

export const mockModels = [
    {
        id: 'model-ranking',
        name: 'Ranking Model',
        supportedSourceSchemas: ['Product'],
        supportedTargetSchema: '{"rankedProducts": [{"productId": "string", "score": "number"}]}',
        supportedContextTypes: ['Ranking'],
    },
    {
        id: 'model-ner',
        name: 'Named Entity Recognition Model',
        supportedSourceSchemas: ['Article'],
        supportedTargetSchema: '{"entities": [{"name": "string", "type": "string"}]}',
        supportedContextTypes: ['Document Understanding'],
    },
    {
        id: 'model-personalization',
        name: 'Personalization Model',
        supportedSourceSchemas: ['Person'],
        supportedTargetSchema: '{"userId": "string", "preferences": ["string"]}',
        supportedContextTypes: ['Personalization'],
    }
];

export const mockPipelines = [
    {
        id: 'pipe-1',
        name: 'Article to Entities',
        sourceSchemas: ['Article'],
        targetSchema: '{"entities": [{"name": "string", "type": "string"}]}',
        model: 'model-ner',
    },
    {
        id: 'pipe-2',
        name: 'Review to Product Rank',
        sourceSchemas: ['Review', 'Product'],
        targetSchema: '{"rankedProducts": [{"productId": "string", "score": "number"}]}',
        model: 'model-ranking',
    }
];

export const mockContexts = [
    {
        id: 'ctx-1',
        name: 'User Profile Context',
        type: 'Personalization',
        scope: 'User',
        sourceSchemas: ['Person'],
        schema: '{"userId": "string", "name": "string", "preferences": ["string"]}',
        tags: ['user', 'profile'],
        pipeline: null,
        isActive: true,
    },
    {
        id: 'ctx-2',
        name: 'Product Review Context',
        type: 'Document Understanding',
        scope: 'Document',
        sourceSchemas: ['Review', 'Product'],
        schema: '{"productId": "string", "averageRating": "number", "reviewCount": "number"}',
        tags: ['product', 'review'],
        pipeline: 'pipe-2',
        isActive: true,
    }
];

