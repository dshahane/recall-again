// File: components/workflow/NeoWorkflowView.tsx
'use client'

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WorkflowIcon, Save, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast, Toaster } from 'sonner';

import { isTriggerNode } from '@/components/models/workflow/node-config-types';
import NodeConfig from '@/components/models/workflow/node-config';
import Palette from '@/components/models/workflow/palette';
import EdgeConfig from '@/components/models/workflow/edge-config';
import WorkflowCanvas from '@/components/models/workflow/workflow-canvas';

import {usePalette} from "@/hooks/use-palette";
import { useWorkflow } from '@/components/models/context/workflow-context';
import { getNodeSchema } from '@/data/node-schemas'; // Import nodeSchemas

interface NeoWorkflowViewProps {
    mode: 'standalone' | 'embedded';
}

export default function NeoWorkflowView({ mode }: NeoWorkflowViewProps) {
    // Get the API object from the context
    const api = useWorkflow();
    const paletteData = usePalette(mode);

    // Find the currently selected node or edge object from the workflow data
    const selectedNode = api.wf.nodes.find((node: any) => node.id === api.selectedId);
    const selectedEdge = api.wf.edges.find((edge: any) => edge.id === api.selectedEdgeId);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-hidden font-sans">
            <Palette setDraggedNode={api.setDraggedNode} paletteData={paletteData} />
            <div className="flex-1 flex flex-col relative">
                <div className="flex justify-center items-center py-2 px-4 border-b border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                    <Button variant="ghost" className="mr-2" onClick={api.handleSave}>
                        <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button variant="ghost" className="mr-2" onClick={() => api.setIsLoadModalOpen(true)}>
                        <FolderOpen className="h-4 w-4 mr-2" /> Load
                    </Button>
                    <Button onClick={api.handleRun} disabled={api.running}>
                        <WorkflowIcon className="h-4 w-4 mr-2" /> {api.running ? "Running..." : "Run Workflow"}
                    </Button>
                </div>
                <WorkflowCanvas
                    wf={api.wf}
                    canvasRef={api.canvasRef}
                    draggedNodePos={api.draggedNodePos ? { id: api.selectedId!, pos: api.draggedNodePos } : null}
                    connectingFrom={api.connectingFrom}
                    connectingTo={api.connectingTo}
                    setWf={api.setWf}
                    onNodeDrag={api.onNodeDrag}
                    onNodeClick={api.onNodeClick}
                    onDeleteNode={api.onDeleteNode}
                    onPortMouseDown={api.onPortMouseDown}
                    onPortMouseUp={api.onPortMouseUp}
                    handleEdgeClick={api.handleEdgeClick}
                    handleDragControlPoint={api.handleDragControlPoint}
                    isTriggerNode={isTriggerNode}
                    draggedNode={api.draggedNode}
                    setDraggedNode={api.setDraggedNode}
                    setModalMessage={api.setModalMessage}
                    setIsModalOpen={api.setIsModalOpen}
                    onCanvasClick={api.handleCanvasClick}
                    onCanvasMouseMove={api.onCanvasMouseMove}
                    selectedId={api.selectedId}
                    selectedEdgeId={api.selectedEdgeId}
                />
            </div>
            <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-4 overflow-y-auto">
                <Tabs defaultValue="configure" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="configure">Configure</TabsTrigger>
                        <TabsTrigger value="logs">Logs</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 mt-4">
                        <TabsContent value="configure" className="space-y-4">
                            {/* Correctly handle conditional rendering here */}
                            {selectedNode && getNodeSchema(selectedNode.kind) ? (
                                <NodeConfig node={selectedNode} onChange={api.handleConfigChange} onNameChange={api.handleNameChange} />
                            ) : selectedEdge ? (
                                <EdgeConfig edge={selectedEdge} onDelete={api.onDeleteEdge} />
                            ) : (
                                <div className="text-center text-gray-400 dark:text-zinc-500 text-sm py-8">Select a node or edge to configure</div>
                            )}
                        </TabsContent>
                        <TabsContent value="logs" className="space-y-2">
                            <div className="flex flex-col-reverse space-y-2 text-xs text-gray-700 dark:text-gray-300">
                                {api.logs.length > 0 ? (
                                    api.logs.map((log: string, index: number) => (
                                        <div key={index} className="bg-gray-200 dark:bg-zinc-800 p-2 rounded-md font-mono">
                                            {log}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-400 dark:text-zinc-500 text-sm py-8">Logs will appear here</div>
                                )}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            <Dialog open={api.isModalOpen} onOpenChange={api.setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cannot Add Node</DialogTitle>
                        <DialogDescription>{api.modalMessage}</DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => api.setIsModalOpen(false)}>OK</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={api.isLoadModalOpen} onOpenChange={api.setIsLoadModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save/Load Workflow</DialogTitle>
                        <DialogDescription>
                            Copy the string to save your workflow, or paste a string to load one.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="workflow-data">Workflow Data</Label>
                        <Textarea id="workflow-data" value={api.loadString} onChange={(e) => api.setLoadString(e.target.value)} rows={6} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => {
                            if (api.loadString) {
                                navigator.clipboard.writeText(api.loadString);
                                toast.success("Copied!", { description: "Workflow data copied to clipboard." });
                            }
                        }}>
                            Copy
                        </Button>
                        <Button onClick={api.handleLoad}>
                            Load
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Toaster />
        </div>
    );
}
