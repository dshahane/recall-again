'use client'

import * as React from 'react';
import { useState, useMemo, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { X, ChevronDownIcon, CheckIcon, LayoutDashboard, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';

// Use React.lazy to lazy-load the WorkflowBuilder component.
const LazyWorkflowBuilder = React.lazy(() => import('@/components/models/workflow/workflow-builder'));

// Mocked MultiSelect component for demonstration
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

const CreateNewContext = ({
                              contextTypes,
                              contextScopes,
                              schemaOptions,
                              mockModels,
                              pipelines,
                              editingContextId,
                              contextName,
                              setContextName,
                              contextType,
                              setContextType,
                              contextScope,
                              setContextScope,
                              contextSourceSchemas,
                              setContextSourceSchemas,
                              contextSchema,
                              setContextSchema,
                              selectedPipeline,
                              setSelectedPipeline,
                              contextTags,
                              setContextTags,
                              currentContextTagInput,
                              setCurrentContextTagInput,
                              showPipelineBuilder,
                              setShowPipelineBuilder,
                              newPipelineName,
                              setNewPipelineName,
                              newPipelineModel,
                              setNewPipelineModel,
                              newPipelineTargetSchema,
                              setNewPipelineTargetSchema,
                              setPipelines,
                              onSaveContext,
                              resetPipelineForm,
                          }) => {
    const [wizardTab, setWizardTab] = useState('details');

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
    };

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
    }, [contextSourceSchemas, contextType, mockModels]);

    const handleAddContextTag = (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && currentContextTagInput.trim() !== '') {
            if (!contextTags.includes(currentContextTagInput.trim())) {
                setContextTags([...contextTags, currentContextTagInput.trim()]);
            }
            setCurrentContextTagInput('');
        }
    };

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
        setPipelines(prev => [...prev, newPipeline]);
        setSelectedPipeline(newPipeline.id);
        setNewPipelineName('');
        setNewPipelineModel('');
        setNewPipelineTargetSchema('');
        setShowPipelineBuilder(false);
        toast.success("New pipeline created and selected!");
    };

    const handlePipelineSelectChange = (value) => {
        if (value === 'new-pipeline') {
            setShowPipelineBuilder(true);
        } else {
            setSelectedPipeline(value);
            setShowPipelineBuilder(false);
        }
    };

    const handleNext = () => {
        if (wizardTab === 'details') {
            if (!contextName || !contextType || !contextScope) {
                toast.error("Please fill out all required fields in this step.");
                return;
            }
            setWizardTab('schema');
        } else if (wizardTab === 'schema') {
            setWizardTab('pipeline');
        }
    };

    return (
        <Card className="mt-4">
            <CardContent className="pt-4 flex flex-col h-full">
                <Tabs value={wizardTab}>
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
                            <Button onClick={handleNext}>Next</Button>
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
                            <Button onClick={handleNext}>Next</Button>
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
                                        <LazyWorkflowBuilder
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
                                        />
                                    </Suspense>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between mt-4">
                            <Button variant="outline" onClick={() => setWizardTab('schema')}>Back</Button>
                            <Button onClick={onSaveContext}>Save Context</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default CreateNewContext;
