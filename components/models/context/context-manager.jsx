'use client'

import * as React from 'react';
import {useEffect, useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {toast} from 'sonner';
import SavedContexts from "@/components/models/context/saved-context";
import CreateNewContext from "@/components/models/context/create-new-context";

// Main App Component
const ContextManagerApp = () => {
    // Static data for demonstration
    const contextTypes = ['Personalization', 'Document Understanding', 'Query / Question Understanding', 'Retrieval', 'Ranking', 'Time Series', 'Analytical'];
    const contextScopes = ['User', 'Request', 'Session', 'Document', 'Forever'];
    const schemaOptions = ['Article', 'Event', 'Person', 'Product', 'Place', 'Organization', 'Review', 'Recipe', 'Book', 'Movie', 'RankedProductList', 'EntityExtractionResult'];

    // --- MOCK DATA FOR DEMONSTRATION ---
    const mockModels = [
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

    const mockPipelines = [
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

    const mockContexts = [
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
    // --- END MOCK DATA ---

    // State for contexts and pipelines
    const [savedContexts, setSavedContexts] = useState(mockContexts);
    const [pipelines, setPipelines] = useState(mockPipelines);

    // Main UI State: Controls the primary tabs
    const [mainTab, setMainTab] = useState('list');
    const [editingContextId, setEditingContextId] = useState(null);

    // State for the main context form
    const [contextName, setContextName] = useState('');
    const [contextType, setContextType] = useState('');
    const [contextScope, setContextScope] = useState('');
    const [contextSourceSchemas, setContextSourceSchemas] = useState([]);
    const [contextSchema, setContextSchema] = useState('');
    const [selectedPipeline, setSelectedPipeline] = useState('');
    const [contextTags, setContextTags] = useState([]);
    const [currentContextTagInput, setCurrentContextTagInput] = useState('');
    const [showPipelineBuilder, setShowPipelineBuilder] = useState(false);

    // State for the pipeline form (driven by main form)
    const [newPipelineName, setNewPipelineName] = useState('');
    const [newPipelineModel, setNewPipelineModel] = useState('');
    const [newPipelineTargetSchema, setNewPipelineTargetSchema] = useState('');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [contextToDelete, setContextToDelete] = useState(null);

    // Helper to find model by ID
    const getModelById = (modelId) => mockModels.find(m => m.id === modelId);

    // Effect to sync editor state with selected context
    useEffect(() => {
        if (editingContextId !== null) {
            const context = savedContexts.find(c => c.id === editingContextId);
            if (context) {
                setContextName(context.name);
                setContextType(context.type);
                setContextScope(context.scope);
                setContextSourceSchemas(context.sourceSchemas);
                setContextSchema(context.schema);
                setSelectedPipeline(context.pipeline);
                setContextTags(context.tags);
            }
        } else {
            resetForm();
        }
    }, [editingContextId, savedContexts]);

    // Effect to automatically update target schema when model changes
    useEffect(() => {
        if (newPipelineModel) {
            const model = getModelById(newPipelineModel);
            if (model) {
                setNewPipelineTargetSchema(model.supportedTargetSchema);
            }
        } else {
            setNewPipelineTargetSchema('');
        }
    }, [newPipelineModel]);

    const handleSaveContext = () => {
        if (!contextName || !contextType || !contextScope) {
            toast.error("Please fill out all required fields.");
            return;
        }
        const newContext = {
            id: editingContextId || Date.now(),
            name: contextName,
            type: contextType,
            scope: contextScope,
            sourceSchemas: contextSourceSchemas,
            schema: contextSchema,
            tags: contextTags,
            pipeline: selectedPipeline,
            isActive: true,
        };

        if (editingContextId) {
            setSavedContexts(savedContexts.map(c => c.id === editingContextId ? newContext : c));
            toast.success("Context updated successfully!");
        } else {
            setSavedContexts([...savedContexts, newContext]);
            toast.success("New context created!");
        }

        setMainTab('list');
        resetForm();
    };

    const handleDeleteContext = (id) => {
        setContextToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        setSavedContexts(savedContexts.filter(c => c.id !== contextToDelete));
        toast.success("Context deleted successfully!");
        setContextToDelete(null);
        setIsConfirmOpen(false);
    };

    const resetForm = () => {
        setContextName('');
        setContextType('');
        setContextScope('');
        setContextSourceSchemas([]);
        setContextSchema('');
        setSelectedPipeline('');
        setContextTags([]);
        setEditingContextId(null);
        setShowPipelineBuilder(false);
    };

    const resetPipelineForm = () => {
        setNewPipelineName('');
        setNewPipelineModel('');
        setNewPipelineTargetSchema('');
        setShowPipelineBuilder(false);
    };

    const handleEditContext = (id) => {
        setEditingContextId(id);
        setMainTab('wizard');
    }

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">Context Management</h1>
            <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list" onClick={resetForm}>Saved Contexts</TabsTrigger>
                    <TabsTrigger value="wizard">
                        {editingContextId ? 'Edit Context' : 'Create New Context'}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    <SavedContexts
                        savedContexts={savedContexts}
                        onEditContext={handleEditContext}
                        onDeleteContext={handleDeleteContext}
                        isConfirmOpen={isConfirmOpen}
                        setIsConfirmOpen={setIsConfirmOpen}
                        contextToDelete={contextToDelete}
                        confirmDelete={confirmDelete}
                    />
                </TabsContent>
                <TabsContent value="wizard">
                    <CreateNewContext
                        contextTypes={contextTypes}
                        contextScopes={contextScopes}
                        schemaOptions={schemaOptions}
                        mockModels={mockModels}
                        pipelines={pipelines}
                        editingContextId={editingContextId}
                        contextName={contextName}
                        setContextName={setContextName}
                        contextType={contextType}
                        setContextType={setContextType}
                        contextScope={contextScope}
                        setContextScope={setContextScope}
                        contextSourceSchemas={contextSourceSchemas}
                        setContextSourceSchemas={setContextSourceSchemas}
                        contextSchema={contextSchema}
                        setContextSchema={setContextSchema}
                        selectedPipeline={selectedPipeline}
                        setSelectedPipeline={setSelectedPipeline}
                        contextTags={contextTags}
                        setContextTags={setContextTags}
                        currentContextTagInput={currentContextTagInput}
                        setCurrentContextTagInput={setCurrentContextTagInput}
                        showPipelineBuilder={showPipelineBuilder}
                        setShowPipelineBuilder={setShowPipelineBuilder}
                        newPipelineName={newPipelineName}
                        setNewPipelineName={setNewPipelineName}
                        newPipelineModel={newPipelineModel}
                        setNewPipelineModel={setNewPipelineModel}
                        newPipelineTargetSchema={newPipelineTargetSchema}
                        setNewPipelineTargetSchema={setNewPipelineTargetSchema}
                        setPipelines={setPipelines}
                        onSaveContext={handleSaveContext}
                        resetPipelineForm={resetPipelineForm}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ContextManagerApp;
