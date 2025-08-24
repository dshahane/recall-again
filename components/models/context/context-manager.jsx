'use client'

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '../../ui/card';
import {
    Input
} from '../../ui/input';
import {
    Label
} from '../../ui/label';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '../..//ui/select';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Textarea } from '../../ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../ui/table';
import { ScrollArea } from '../../ui/scroll-area';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../../ui/command';
import {
    X,
    ChevronDownIcon,
    CheckIcon,
    LayoutDashboard,
    LayoutList,
    FileText,
    Brain,
    ClipboardList,
    Pencil,
    Trash2,
    ListFilter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';

// ---
// A custom multi-select component using shadcn/ui primitives.
// This provides a cleaner interface for schema selection.
// ---
const MultiSelect = ({ options, selected, onSelect, placeholder, disabled }) => {
    const [open, setOpen] = useState(false);
    const selectedValues = useMemo(() => new Set(selected), [selected]);

    if (disabled) {
        return (
            <div className="w-full justify-between p-2 border rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                {selected.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selected.map((value) => (
                            <Badge key={value} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                {value}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <span>{placeholder}</span>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setOpen(!open)}
                className="w-full justify-between pr-2"
                role="combobox"
                aria-expanded={open}
            >
                <span>{placeholder}</span>
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            {selectedValues.size > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selected.map((value) => (
                        <Badge key={value} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {value}
                            <button
                                className="ml-1 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                                onClick={() => onSelect(value)}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            {open && (
                <Command className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border rounded-md shadow-lg">
                    <CommandInput placeholder="Search schemas..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option}
                                    onSelect={() => onSelect(option)}
                                    className="cursor-pointer"
                                >
                                    <CheckIcon
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedValues.has(option) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {option}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            )}
        </div>
    );
};

// Main App Component
const ContextManagerApp = () => {
    // Static data for demonstration
    const contextTypes = ['Personalization', 'Document Understanding', 'Query / Question Understanding', 'Retrieval', 'Ranking', 'Time Series', 'Analytical'];
    const contextScopes = ['User', 'Request', 'Session', 'Document', 'Forever'];
    const contextTypeSignificance = {
        'Personalization': 'Used for creating user profiles and tailoring content.',
        'Document Understanding': 'Used for extracting key entities and relationships from unstructured text.',
        'Query / Question Understanding': 'Used for interpreting natural language queries to provide relevant answers.',
        'Retrieval': 'Used for fetching relevant data based on a user\'s query.',
        'Ranking': 'Used for ordering search results or recommendations by relevance.',
        'Time Series': 'Used for analyzing data that changes over time, like stock prices.',
        'Analytical': 'Used for aggregating and summarizing data for business intelligence.'
    };
    const schemaOptions = ['Article', 'Event', 'Person', 'Product', 'Place', 'Organization', 'Review', 'Recipe', 'Book', 'Movie', 'RankedProductList', 'EntityExtractionResult'];
    const suggestedTags = ['web-app', 'api', 'data-model', 'json', 'real-time', 'analytics', 'search', 'docs', 'ui-ux'];

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

    // UI State to manage the active view
    const [currentView, setCurrentView] = useState('list'); // 'list' or 'editor'
    const [editingContextId, setEditingContextId] = useState(null);
    const [sheetMode, setSheetMode] = useState('context'); // 'context' or 'pipeline-editor' or 'schema-editor'
    const [pipelineViewMode, setPipelineViewMode] = useState('form'); // 'form' or 'graphical'
    const [activePropertySheet, setActivePropertySheet] = useState(null); // 'contextName', 'taxonomy', etc.

    // State for the main context form
    const [contextName, setContextName] = useState('');
    const [contextType, setContextType] = useState('');
    const [contextScope, setContextScope] = useState('');
    const [contextSourceSchemas, setContextSourceSchemas] = useState([]);
    const [contextSchema, setContextSchema] = useState('');
    const [selectedPipeline, setSelectedPipeline] = useState('');
    const [contextTags, setContextTags] = useState([]);
    const [currentContextTagInput, setCurrentContextTagInput] = useState('');

    // State for the pipeline form (driven by main form)
    const [newPipelineName, setNewPipelineName] = useState('');
    const [newPipelineModel, setNewPipelineModel] = useState('');
    const [newPipelineTargetSchema, setNewPipelineTargetSchema] = useState('');

    // Helper to find model by ID
    const getModelById = (modelId) => mockModels.find(m => m.id === modelId);
    const getPipelineNameById = (pipelineId) => {
        const p = pipelines.find(p => p.id === pipelineId);
        return p ? p.name : 'N/A';
    };

    const getTargetSchemaName = (schemaString) => {
        try {
            const parsed = JSON.parse(schemaString);
            // Attempt to find a simple name from the schema structure
            if (parsed.rankedProducts) return 'Ranked Product List';
            if (parsed.entities) return 'Entity Extraction Result';
            if (parsed.userId) return 'User Preferences';
            return Object.keys(parsed)[0] || 'JSON Schema';
        } catch (e) {
            return schemaString || 'No Schema Name';
        }
    }

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

    // Filters models based on source schemas and context type
    const getFilteredModels = useMemo(() => {
        const filtered = mockModels.filter(model => {
            // Check for a context type match
            const contextTypeMatch = contextType && model.supportedContextTypes.includes(contextType);
            if (!contextTypeMatch) {
                return false;
            }
            // Check if all selected source schemas are supported by the model
            const sourceSchemasMatch = contextSourceSchemas.every(schema =>
                model.supportedSourceSchemas.includes(schema)
            );
            return sourceSchemasMatch;
        });
        return filtered;
    }, [contextSourceSchemas, contextType]);

    // Handlers for the main context form
    const handleAddContextTag = (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && currentContextTagInput.trim() !== '') {
            if (!contextTags.includes(currentContextTagInput.trim())) {
                setContextTags([...contextTags, currentContextTagInput.trim()]);
            }
            setCurrentContextTagInput('');
        }
    };

    const handleSaveContext = () => {
        if (!contextName || !contextType || !contextScope) return;
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
        } else {
            setSavedContexts([...savedContexts, newContext]);
        }

        setCurrentView('list'); // Return to list view after saving
    };

    const handleDeleteContext = (id) => {
        setSavedContexts(savedContexts.filter(c => c.id !== id));
        if (editingContextId === id) {
            setEditingContextId(null);
            setCurrentView('list');
        }
    };

    const handleToggleActive = (id, isActive) => {
        setSavedContexts(savedContexts.map(c => c.id === id ? { ...c, isActive: isActive } : c));
    };

    // Handlers for the pipeline form
    const handleCommitPipeline = () => {
        if (newPipelineName.trim() === '') return;
        const newPipeline = {
            id: Date.now(),
            name: newPipelineName,
            sourceSchemas: contextSourceSchemas,
            model: newPipelineModel,
            targetSchema: newPipelineTargetSchema,
        };
        setPipelines([...pipelines, newPipeline]);
        resetPipelineForm();
        setSheetMode('context'); // Return to context view after committing
        setActivePropertySheet(null);
    };

    const resetForm = () => {
        setContextName('');
        setContextType('');
        setContextScope('');
        setContextSourceSchemas([]);
        setContextSchema('');
        setSelectedPipeline('');
        setContextTags([]);
    };

    const resetPipelineForm = () => {
        setNewPipelineName('');
        setNewPipelineModel('');
        setNewPipelineTargetSchema('');
    };

    // Render List View
    const renderListView = () => (
        <div className="p-8 bg-transparent">
            <h1 className="text-3xl font-bold mb-6">Context Management</h1>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Saved Contexts</h2>
                <Button onClick={() => {
                    setEditingContextId(null);
                    setCurrentView('editor');
                }}>
                    Create New Context
                </Button>
            </div>
            <Card className="bg-transparent">
                <CardContent className="pt-4">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Context Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Scope</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {savedContexts.map(ctx => (
                                    <TableRow key={ctx.id}>
                                        <TableCell className="font-medium">{ctx.name}</TableCell>
                                        <TableCell>{ctx.type}</TableCell>
                                        <TableCell>{ctx.scope}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={ctx.isActive}
                                                onCheckedChange={(checked) => handleToggleActive(ctx.id, checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingContextId(ctx.id);
                                                        setCurrentView('editor');
                                                    }}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteContext(ctx.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );

    // Render property sheet views dynamically
    const renderPropertySheet = () => {
        switch (activePropertySheet) {
            case 'contextName':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Context Name Documentation</h3>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 border rounded-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                The **Context Name** is a unique identifier for your context object. Use a clear, descriptive name that reflects the purpose of the data you are collecting, such as `UserProfile`, `SearchQuery`, or `ArticleSummary`. This name will be used to reference the context throughout your system.
                            </p>
                        </div>
                    </div>
                );
            case 'taxonomy':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Taxonomy Documentation</h3>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 border rounded-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                A **Taxonomy** provides a structured way to classify your data. Currently, the system supports `trl.schema.org`, a widely-used vocabulary for structured data on the internet. Selecting a taxonomy ensures your data conforms to a known standard, improving interoperability and discoverability.
                            </p>
                        </div>
                    </div>
                );
            case 'contextType':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Context Type Significance</h3>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 border rounded-md">
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                {contextTypes.map(type => (
                                    <li key={type}>
                                        <strong>{type}:</strong> {contextTypeSignificance[type]}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'contextScope':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Context Scope Documentation</h3>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 border rounded-md">
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>**User:** Data persists for the lifetime of a user's account.</li>
                                <li>**Request:** Data is valid for a single request.</li>
                                <li>**Session:** Data persists for the user's current session.</li>
                                <li>**Document:** Data is tied to a specific document.</li>
                                <li>**Forever:** Data persists indefinitely.</li>
                            </ul>
                        </div>
                    </div>
                );
            case 'sourceSchema-editor':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Source Schema Editor</h3>
                        <p className="text-sm text-gray-500">Select one or more source schemas that feed into this context.</p>
                        <MultiSelect
                            options={schemaOptions}
                            selected={contextSourceSchemas}
                            onSelect={(schema) => setContextSourceSchemas(prev =>
                                prev.includes(schema)
                                    ? prev.filter(s => s !== schema)
                                    : [...prev, schema]
                            )}
                            placeholder="Select source schemas"
                        />
                    </div>
                );
            case 'schema-editor':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Schema Editor</h3>
                        <p className="text-sm text-gray-500">Define the JSON schema for your context object.</p>
                        <Textarea
                            className="min-h-[300px] font-mono text-sm"
                            placeholder="Enter your JSON schema here..."
                            value={contextSchema}
                            onChange={(e) => setContextSchema(e.target.value)}
                        />
                    </div>
                );
            case 'schema-mapper':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Schema Mapper</h3>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 border rounded-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                This component would allow you to visually map fields from your selected **Source Schemas** to the **Target Schema** of your pipeline.
                            </p>
                        </div>
                    </div>
                );
            case 'pipeline':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pipeline Configuration</h3>
                        {selectedPipeline ? (
                            <div className="p-4 text-center text-gray-500">
                                Details for pipeline "{getPipelineNameById(selectedPipeline)}" would appear here.
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                Select an existing pipeline or click "Add New" on the left to configure a new one.
                            </div>
                        )}
                    </div>
                );
            case 'tags':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Applicable Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    className="cursor-pointer bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                                    onClick={() => {
                                        if (!contextTags.includes(tag)) {
                                            setContextTags(prev => [...prev, tag]);
                                        }
                                    }}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Click a tag to add it to your context.</p>
                    </div>
                );
            case 'pipeline-editor':
                return (
                    <div className="space-y-6 flex flex-col h-full">
                        <h3 className="text-lg font-semibold">New Pipeline Editor</h3>
                        <Tabs value={pipelineViewMode} onValueChange={setPipelineViewMode}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="form">
                                    <LayoutList className="mr-2 h-4 w-4" /> Form View
                                </TabsTrigger>
                                <TabsTrigger value="graphical">
                                    <LayoutDashboard className="mr-2 h-4 w-4" /> Graphical View
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="form">
                                <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pipeline-name">Pipeline Name</Label>
                                            <Input
                                                id="pipeline-name"
                                                placeholder="e.g., ArticleToContext"
                                                value={newPipelineName}
                                                onChange={(e) => setNewPipelineName(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="source-schema-select">Source Schema(s)</Label>
                                            <div className="flex items-center gap-2">
                                                <MultiSelect
                                                    options={schemaOptions}
                                                    selected={contextSourceSchemas}
                                                    onSelect={() => {}} // Disabled
                                                    placeholder="Select source schemas"
                                                    disabled
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSheetMode('context');
                                                        setActivePropertySheet('schema-mapper');
                                                    }}
                                                >
                                                    <ListFilter className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="model-select">Model</Label>
                                            <Select
                                                value={newPipelineModel}
                                                onValueChange={setNewPipelineModel}
                                                disabled={getFilteredModels.length === 0}
                                            >
                                                <SelectTrigger id="model-select">
                                                    <SelectValue placeholder="Select a model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getFilteredModels.map(model => (
                                                        <SelectItem key={model.id} value={model.id}>
                                                            {model.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {getFilteredModels.length === 0 && (
                                                <p className="text-sm text-red-500">
                                                    No models available for the selected context type and schemas.
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="target-schema-display">Target Schema</Label>
                                            <div className="p-2 border rounded-md text-sm text-gray-500 bg-gray-100 dark:bg-gray-800">
                                                {newPipelineTargetSchema ? getTargetSchemaName(newPipelineTargetSchema) : 'No schema selected'}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="flex justify-end pt-0 mt-4">
                                    <Button onClick={handleCommitPipeline}>Commit Pipeline</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="graphical">
                                <ScrollArea className="h-[calc(100vh-400px)]">
                                    <div className="p-6 bg-white dark:bg-gray-800 border rounded-md">
                                        <div className="flex flex-col items-center justify-center py-8">
                                            {/* Source Schema Block */}
                                            <div className="relative text-center w-48 p-4">
                                                <div className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-md w-full p-4">
                                                    <div className="flex items-center justify-center mb-2 text-gray-400 dark:text-gray-500">
                                                        <FileText className="h-8 w-8" />
                                                    </div>
                                                    <span className="font-semibold text-gray-700 dark:text-gray-200">Source Schema(s)</span>
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        {contextSourceSchemas.length > 0 ? contextSourceSchemas.join(', ') : 'None selected'}
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 -mr-1 -mt-2 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                    INPUT
                                                </div>
                                            </div>
                                            {/* Line between blocks */}
                                            <div className="w-0.5 h-16 bg-gray-400 dark:bg-gray-600 my-4 relative">
                                                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* Model Block */}
                                            <div className="relative text-center w-48 p-4">
                                                <div className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-md w-full p-4">
                                                    <div className="flex items-center justify-center mb-2 text-gray-400 dark:text-gray-500">
                                                        <Brain className="h-8 w-8" />
                                                    </div>
                                                    <span className="font-semibold text-gray-700 dark:text-gray-200">Model</span>
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        {getModelById(newPipelineModel)?.name || 'No model selected'}
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 -mr-1 -mt-2 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                    PROCESSING
                                                </div>
                                            </div>
                                            {/* Line between blocks */}
                                            <div className="w-0.5 h-16 bg-gray-400 dark:bg-gray-600 my-4 relative">
                                                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* Context Schema Block */}
                                            <div className="relative text-center w-48 p-4">
                                                <div className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-md w-full p-4">
                                                    <div className="flex items-center justify-center mb-2 text-gray-400 dark:text-gray-500">
                                                        <ClipboardList className="h-8 w-8" />
                                                    </div>
                                                    <span className="font-semibold text-gray-700 dark:text-gray-200">Context Schema</span>
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        {contextName || 'No context name'}
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 -mr-1 -mt-2 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                    OUTPUT
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="flex justify-end pt-0 mt-4">
                                    <Button onClick={handleCommitPipeline}>Commit Pipeline</Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                );
            default:
                return (
                    <div className="p-4 text-center text-gray-500">
                        Select a field on the left to see its property sheet here.
                    </div>
                );
        }
    };

    // Render Editor View
    const renderEditorView = () => (
        <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-50 flex gap-8">
            {/* Master View (Left Panel) */}
            <Card className="flex-1 max-w-2xl">
                <CardHeader>
                    <CardTitle>
                        {editingContextId ? 'Edit Context' : 'Create New Context'}
                    </CardTitle>
                    <CardDescription>
                        Define a new context and its properties on the left.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                        <div className="space-y-6">
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="context-name">Context Name</Label>
                                    <Input
                                        id="context-name"
                                        placeholder="e.g., UserProfile"
                                        value={contextName}
                                        onChange={(e) => setContextName(e.target.value)}
                                        onFocus={() => {
                                            setSheetMode('context');
                                            setActivePropertySheet('contextName');
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="taxonomy-select">Taxonomy</Label>
                                    <Select defaultValue="trl.schema.org">
                                        <SelectTrigger id="taxonomy-select" onFocus={() => {
                                            setSheetMode('context');
                                            setActivePropertySheet('taxonomy');
                                        }}>
                                            <SelectValue placeholder="Select a taxonomy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="trl.schema.org">trl.schema.org</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="context-type-select">Context Type</Label>
                                    <Select onValueChange={setContextType} value={contextType}>
                                        <SelectTrigger id="context-type-select" onFocus={() => {
                                            setSheetMode('context');
                                            setActivePropertySheet('contextType');
                                        }}>
                                            <SelectValue placeholder="Select a context type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contextTypes.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="context-scope-select">Context Scope</Label>
                                    <Select onValueChange={setContextScope} value={contextScope}>
                                        <SelectTrigger id="context-scope-select" onFocus={() => {
                                            setSheetMode('context');
                                            setActivePropertySheet('contextScope');
                                        }}>
                                            <SelectValue placeholder="Select a scope" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contextScopes.map(scope => (
                                                <SelectItem key={scope} value={scope}>{scope}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="source-schema-select">Source Schema(s)</Label>
                                    <div className="flex gap-2">
                                        <MultiSelect
                                            options={schemaOptions}
                                            selected={contextSourceSchemas}
                                            onSelect={(schema) => setContextSourceSchemas(prev =>
                                                prev.includes(schema)
                                                    ? prev.filter(s => s !== schema)
                                                    : [...prev, schema]
                                            )}
                                            placeholder="Select source schemas"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setSheetMode('context');
                                                setActivePropertySheet('sourceSchema-editor');
                                            }}
                                            onFocus={() => {
                                                setSheetMode('context');
                                                setActivePropertySheet('sourceSchema-editor');
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="context-schema-select">Context Schema</Label>
                                    <div className="flex gap-2">
                                        <Select onValueChange={setContextSchema} value={contextSchema} className="flex-1">
                                            <SelectTrigger id="context-schema-select">
                                                <SelectValue placeholder="Select a predefined schema" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {schemaOptions.map(schema => (
                                                    <SelectItem key={schema} value={`{ "schema": "${schema}" }`}>{schema}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setSheetMode('context');
                                                setActivePropertySheet('schema-editor');
                                            }}
                                            onFocus={() => {
                                                setSheetMode('context');
                                                setActivePropertySheet('schema-editor');
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {contextSchema ? "Schema defined." : "No schema defined."}
                                    </p>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="pipeline-select">Pipeline</Label>
                                    <div className="flex gap-2">
                                        <Select onValueChange={setSelectedPipeline} value={selectedPipeline}>
                                            <SelectTrigger id="pipeline-select" onFocus={() => {
                                                setSheetMode('context');
                                                setActivePropertySheet('pipeline');
                                            }}>
                                                <SelectValue placeholder="Select a pipeline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pipelines.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSheetMode('pipeline-editor');
                                                setActivePropertySheet('pipeline-editor');
                                                setPipelineViewMode('form');
                                            }}>
                                            Add New
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="context-tags">Tags</Label>
                                    <Input
                                        id="context-tags"
                                        placeholder="Type a tag and press Enter"
                                        value={currentContextTagInput}
                                        onChange={(e) => setCurrentContextTagInput(e.target.value)}
                                        onKeyDown={handleAddContextTag}
                                        onFocus={() => {
                                            setSheetMode('context');
                                            setActivePropertySheet('tags');
                                        }}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {contextTags.map((tag, index) => (
                                            <Badge key={index} className="bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                                                {tag}
                                                <button
                                                    onClick={() => setContextTags(contextTags.filter(t => t !== tag))}
                                                    className="ml-1 text-xs text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-100"
                                                >
                                                    &times;
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
                <div className="flex justify-between p-6 pt-0">
                    <Button variant="outline" onClick={() => setCurrentView('list')}>Cancel</Button>
                    <Button onClick={handleSaveContext}>
                        {editingContextId ? 'Update Context' : 'Save Context'}
                    </Button>
                </div>
            </Card>

            {/* Detail View / Property Sheet (Right Panel) */}
            <Card className="flex-1 max-w-xl">
                <CardHeader>
                    <CardTitle>
                        {activePropertySheet === 'pipeline-editor' ? 'Pipeline Editor' : 'Property Sheet'}
                    </CardTitle>
                    <CardDescription>
                        {activePropertySheet === 'pipeline-editor' ?
                            'Configure the pipeline to transform schema data.' :
                            'Select a field on the left to see its property sheet.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                        {renderPropertySheet()}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="font-sans antialiased">
            {currentView === 'list' ? renderListView() : renderEditorView()}
        </div>
    );
};

export default ContextManagerApp;
