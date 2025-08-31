'use client'

import * as React from 'react';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import WorkflowBuilder from "@/components/models/workflow/workflow-builder";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    X,
    ChevronDownIcon,
    CheckIcon,
    LayoutDashboard,
    LayoutList,
    Pencil,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

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
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="truncate">
                        {selected.length === 0
                            ? placeholder
                            : selected.map(value =>
                                <Badge key={value} className="mr-1">
                                    {value}
                                </Badge>
                            )}
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
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
            </PopoverContent>
        </Popover>
    );
};

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

    // Wizard UI State: Controls the steps within the wizard tab
    const [wizardTab, setWizardTab] = useState('details');

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

    const getTargetSchemaName = (schemaString) => {
        try {
            const parsed = JSON.parse(schemaString);
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
            const contextTypeMatch = contextType && model.supportedContextTypes.includes(contextType);
            if (!contextTypeMatch) {
                return false;
            }
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

    const handleToggleActive = (id, isActive) => {
        setSavedContexts(savedContexts.map(c => c.id === id ? { ...c, isActive: isActive } : c));
    };

    // Handlers for the pipeline form
    const handleCommitPipeline = () => {
        if (newPipelineName.trim() === '' || !newPipelineModel) {
            toast.error("Please fill out all required fields for the pipeline.");
            return;
        }
        const newPipeline = {
            id: Date.now(),
            name: newPipelineName,
            sourceSchemas: contextSourceSchemas,
            model: newPipelineModel,
            targetSchema: newPipelineTargetSchema,
        };
        setPipelines([...pipelines, newPipeline]);
        setSelectedPipeline(newPipeline.id);
        setNewPipelineName('');
        setNewPipelineModel('');
        setNewPipelineTargetSchema('');
        setShowPipelineBuilder(false); // Hide the builder after committing
        toast.success("New pipeline created and selected!");
    };

    const resetForm = () => {
        setContextName('');
        setContextType('');
        setContextScope('');
        setContextSourceSchemas([]);
        setContextSchema('');
        setSelectedPipeline('');
        setContextTags([]);
        setWizardTab('details');
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
        setWizardTab('details');
    }

    const handlePipelineSelectChange = (value) => {
        if (value === 'new-pipeline') {
            setShowPipelineBuilder(true);
        } else {
            setSelectedPipeline(value);
            setShowPipelineBuilder(false);
        }
    };

    // Main render
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
                    <Card className="mt-4">
                        <CardContent className="pt-4">
                            <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                                <div className="grid gap-4">
                                    {savedContexts.map(ctx => (
                                        <Card key={ctx.id} className="relative p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <CardHeader className="p-0 mb-2">
                                                <CardTitle className="text-xl">{ctx.name}</CardTitle>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="secondary">{ctx.type}</Badge>
                                                    <Badge variant="outline">{ctx.scope}</Badge>
                                                    {ctx.isActive && (
                                                        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-grow">
                                                        <span className="text-sm text-gray-500">
                                                            Tags: {ctx.tags.length > 0 ? ctx.tags.join(', ') : 'None'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditContext(ctx.id);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteContext(ctx.id);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {savedContexts.length === 0 && (
                                        <div className="text-center text-gray-500 p-8">
                                            No contexts saved yet. Create one to get started!
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="wizard">
                    <Card className="mt-4">
                        <CardContent className="pt-4 flex flex-col h-full">
                            <Tabs value={wizardTab} onValueChange={setWizardTab}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="details">1. Details</TabsTrigger>
                                    <TabsTrigger value="schema">2. Schema & Tags</TabsTrigger>
                                    <TabsTrigger value="pipeline">3. Pipeline</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details">
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="context-name">Context Name</Label>
                                            <Input
                                                id="context-name"
                                                placeholder="e.g., UserProfileContext"
                                                value={contextName}
                                                onChange={(e) => setContextName(e.target.value)}
                                            />
                                            <p className="text-sm text-gray-500">The Context Name is a unique identifier.</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="context-type">Context Type</Label>
                                            <Select value={contextType} onValueChange={setContextType}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {contextTypes.map(type => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-gray-500">Defines the purpose of your context.</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="context-scope">Context Scope</Label>
                                            <Select value={contextScope} onValueChange={setContextScope}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a scope" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {contextScopes.map(scope => (
                                                        <SelectItem key={scope} value={scope}>{scope}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-gray-500">Determines the lifespan of the context data.</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <Button onClick={() => setWizardTab('schema')}>Next</Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="schema">
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="source-schemas">Source Schemas</Label>
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
                                            <p className="text-sm text-gray-500">Select one or more source schemas that feed into this context.</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="schema">Schema</Label>
                                            <Textarea
                                                id="schema"
                                                className="min-h-[150px] font-mono text-sm"
                                                placeholder="Enter your JSON schema here..."
                                                value={contextSchema}
                                                onChange={(e) => setContextSchema(e.target.value)}
                                            />
                                            <p className="text-sm text-gray-500">Define the JSON schema for your context object.</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="tags">Tags</Label>
                                            <Input
                                                id="tags"
                                                placeholder="Press Enter to add tags"
                                                value={currentContextTagInput}
                                                onChange={(e) => setCurrentContextTagInput(e.target.value)}
                                                onKeyDown={handleAddContextTag}
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {contextTags.map(tag => (
                                                    <Badge key={tag}>
                                                        {tag}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-4 w-4 ml-1"
                                                            onClick={() => setContextTags(contextTags.filter(t => t !== tag))}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-500">Categorize your context with tags.</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <Button variant="outline" onClick={() => setWizardTab('details')}>Back</Button>
                                        <Button onClick={() => setWizardTab('pipeline')}>Next</Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="pipeline">
                                    <div className="grid gap-4 py-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="pipeline">Pipeline</Label>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setShowPipelineBuilder(!showPipelineBuilder)}
                                            >
                                                <ChevronDownIcon className={cn("h-4 w-4 transition-transform", showPipelineBuilder ? "rotate-180" : "")} />
                                            </Button>
                                        </div>
                                        <Select value={selectedPipeline} onValueChange={handlePipelineSelectChange}>
                                            <SelectTrigger id="pipeline">
                                                <SelectValue placeholder="Link a pipeline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new-pipeline">
                                                    + New Pipeline
                                                </SelectItem>
                                                {pipelines.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-gray-500">Connect a Prefect pipeline to process this context.</p>
                                        {showPipelineBuilder && (
                                            <div className="mt-4">
                                                <Suspense fallback={<div>Loading Workflow Builder...</div>}>

                                                    {/*
                                                        getFilteredModels={getFilteredModels}
                                                        schemaOptions={schemaOptions}
                                                        contextSourceSchemas={contextSourceSchemas}
                                                        newPipelineName={newPipelineName}
                                                        setNewPipelineName={setNewPipelineName}
                                                        newPipelineModel={newPipelineModel}
                                                        setNewPipelineModel={setNewPipelineModel}
                                                        newPipelineTargetSchema={newPipelineTargetSchema}
                                                        getTargetSchemaName={getTargetSchemaName}
                                                        onCancel={resetPipelineForm}
                                                        onCommit={handleCommitPipeline}
                                                        */}
                                                    <WorkflowBuilder
                                                    />
                                                </Suspense>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <Button variant="outline" onClick={() => setWizardTab('schema')}>Back</Button>
                                        <Button onClick={handleSaveContext}>Save Context</Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected context.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ContextManagerApp;
