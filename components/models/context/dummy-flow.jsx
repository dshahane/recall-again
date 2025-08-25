import {useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../ui/tabs";
import {LayoutDashboard, LayoutList} from "lucide-react";
import {ScrollArea} from "../../ui/scroll-area";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../ui/select";
import {Card, CardContent} from "../../ui/card";
import {Button} from "../../ui/button";
import * as React from "react";

const DummyWorkflowBuilder = ({
                                  getFilteredModels,
                                  schemaOptions,
                                  contextSourceSchemas,
                                  newPipelineName,
                                  setNewPipelineName,
                                  newPipelineModel,
                                  setNewPipelineModel,
                                  newPipelineTargetSchema,
                                  getTargetSchemaName,
                                  onCancel,
                                  onCommit,
                              }) => {
    const [pipelineViewMode, setPipelineViewMode] = useState('form');

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
                                <MultiSelect
                                    options={schemaOptions}
                                    selected={contextSourceSchemas}
                                    onSelect={() => { }}
                                    placeholder="Select source schemas"
                                    disabled
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="model-select">Model</Label>
                                <Select
                                    value={newPipelineModel}
                                    onValueChange={setNewPipelineModel}
                                    disabled={getFilteredModels().length === 0}
                                >
                                    <SelectTrigger id="model-select">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getFilteredModels().map(model => (
                                            <SelectItem key={model.id} value={model.id}>
                                                {model.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getFilteredModels().length === 0 && (
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
                </TabsContent>
                <TabsContent value="graphical" className="flex-1">
                    <Card className="h-full">
                        <CardContent className="h-full flex items-center justify-center text-gray-500">
                            Graphical pipeline builder not yet implemented.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={onCommit}>
                    Commit Pipeline
                </Button>
            </div>
        </div>
    );
};