'use client'

import React, { useCallback, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WorkflowIcon, Save, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import { Vec2 } from '@/app/types/app';
import { PortName, Workflow as WorkflowType } from './types';
import { createStarterWorkflow, snap } from '@/components/models/workflow/workflow-utils';
import { isSinkNode, isTriggerNode } from '@/components/models/workflow/node-config-types';
import { deleteEdge, deleteNode, updateNodeConfig, updateNodeName } from '@/components/models/workflow//workflow-manager';

import NodeConfig from './node-config';
import Palette from './palette';
import EdgeConfig from './edge-config';
import WorkflowCanvas from './workflow-canvas';
import { useMouseDrag } from '@/hooks/use-mouse-drag';
import { useConnection } from '@/hooks/use-connection';
import {usePalette} from "@/hooks/use-palette";

export default function WorkflowBuilder() {
    const [wf, setWf] = useState<WorkflowType>(() => createStarterWorkflow());
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | undefined>(undefined);
    const [draggedNode, setDraggedNode] = useState<any | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [loadString, setLoadString] = useState("");
    const paletteData = usePalette('standalone');
    const canvasRef = useRef<HTMLDivElement | null>(null);

    const { onPortMouseDown, connectingFrom, connectingTo, onCanvasMouseMove, onCanvasMouseUp, resetConnection: resetHookConnection } = useConnection(canvasRef);

    const { handleMouseDown: onNodeDragStart, currentDraggedPos: draggedNodePos } = useMouseDrag(
        (finalPos) => {
            if (selectedId) {
                setWf(prevWf => ({
                    ...prevWf,
                    nodes: prevWf.nodes.map(n => (n.id === selectedId ? { ...n, pos: snap(finalPos.x, finalPos.y) as Vec2 } : n))
                }));
            }
        }
    );

    const { handleMouseDown: onEdgeControlPointDragStart } = useMouseDrag(
        (finalPos) => {
            if (selectedEdgeId) {
                setWf(prevWf => ({
                    ...prevWf,
                    edges: prevWf.edges.map(edge => {
                        if (edge.id === selectedEdgeId) {
                            return { ...edge, c1: finalPos };
                        }
                        return edge;
                    })
                }));
            }
        }
    );

    const onNodeDrag = useCallback((id: string, e: React.MouseEvent) => {
        const node = wf.nodes.find(n => n.id === id);
        if (!node) return;
        setSelectedId(id);
        setSelectedEdgeId(undefined);
        onNodeDragStart(e, node.pos);
    }, [wf.nodes, setSelectedId, setSelectedEdgeId, onNodeDragStart]);

    const handleNodeClick = useCallback((nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Node clicked:', nodeId);
        setSelectedId(nodeId);
        setSelectedEdgeId(undefined);
    }, []);

    const handleCanvasClick = useCallback(() => {
        console.log('Canvas clicked, deselecting all.');
        setSelectedId(undefined);
        setSelectedEdgeId(undefined);
    }, []);

    const handleEdgeClick = useCallback((edgeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Edge clicked:', edgeId);
        setSelectedEdgeId(edgeId);
        setSelectedId(undefined);
    }, []);

    const handleDragControlPoint = useCallback((edgeId: string, controlPoint: 'c1' | 'c2', e: React.MouseEvent) => {
        e.stopPropagation();
        const edge = wf.edges.find(e => e.id === edgeId);
        if (!edge) return;
        const initialPoint = edge[controlPoint] || { x: 0, y: 0 };
        onEdgeControlPointDragStart(e, initialPoint);
    }, [wf.edges, onEdgeControlPointDragStart]);

    const onDeleteNode = useCallback((id: string) => {
        setWf(w => deleteNode(w, id));
        if (selectedId === id) setSelectedId(undefined);
    }, [selectedId]);

    const onDeleteEdge = useCallback((id: string) => {
        setWf(w => deleteEdge(w, id));
        setSelectedEdgeId(undefined);
    }, []);

    const handleConfigChange = useCallback((id: string, newConfig: any) => {
        setWf(w => updateNodeConfig(w, id, newConfig));
    }, []);

    const handleNameChange = useCallback((id: string, newName: string) => {
        setWf(w => updateNodeName(w, id, newName));
    }, []);

    const handleSave = useCallback(() => {
        try {
            const serialized = JSON.stringify(wf);
            const encoded = btoa(serialized);
            setLoadString(encoded);
            toast.success("Workflow Saved", { description: "Copy the string below to save your workflow." });
            setIsLoadModalOpen(true);
        } catch (error) {
            toast.error("Failed to save workflow.", { description: "An error occurred while saving the workflow." });
        }
    }, [wf]);

    const handleLoad = useCallback(() => {
        try {
            const decoded = atob(loadString);
            const parsed = JSON.parse(decoded);
            setWf(parsed);
            toast.success("Workflow Loaded", { description: "Your workflow has been loaded successfully." });
            setIsLoadModalOpen(false);
            setLoadString("");
        } catch (error) {
            toast.error("Invalid workflow data.", { description: "Please check the string. The data is not in a valid format." });
        }
    }, [loadString, setWf]);

    const handleRun = useCallback(async () => {
        setRunning(true);
        setLogs(currentLogs => ["Running workflow...", ...currentLogs]);
        if (!wf.startId) {
            toast.error("Workflow cannot run", { description: "Please add a Trigger node (Query, Document, or Session) to start the workflow." });
            setLogs(currentLogs => ["Error: No Trigger node found.", ...currentLogs]);
            setRunning(false);
            return;
        }
        toast.info("Workflow Started", { description: "Simulating a workflow run. Check the Logs tab for progress." });
        await new Promise(r => setTimeout(r, 2000));
        setLogs(currentLogs => ["Workflow finished.", ...currentLogs]);
        setRunning(false);
    }, [wf.startId]);

    // Handle edge creation when mouse is released on a port
    const onPortMouseUp = useCallback((toNodeId: string, toPort: PortName, e: React.MouseEvent) => {
        e.stopPropagation();

        const fromNode = wf.nodes.find(n => n.id === connectingFrom?.nodeId);
        const toNode = wf.nodes.find(n => n.id === toNodeId);
        console.log('onPortMouseUp fired.');

        if (fromNode && toNode && connectingFrom) {
            // Validation: can't connect a trigger to a trigger, a sink from a sink,
            // or an input to an input/output to an output.
            if (isTriggerNode(toNode.kind)) {
                toast.error("Invalid connection", { description: "You cannot connect to a Trigger node." });
            } else if (isSinkNode(fromNode.kind)) {
                toast.error("Invalid connection", { description: "You cannot connect from a Sink node." });
            } else if (connectingFrom.port === toPort) {
                toast.error("Invalid connection", { description: "Cannot connect an input to an input or an output to an output." });
            } else {
                const newEdgeId = uuidv4();
                setWf(prevWf => ({
                    ...prevWf,
                    edges: [...prevWf.edges, {
                        id: newEdgeId,
                        from: { nodeId: connectingFrom.nodeId, port: connectingFrom.port },
                        to: { nodeId: toNodeId, port: toPort },
                    }]
                }));

                // ⭐ This is the fix: Select the newly created edge
                setSelectedEdgeId(newEdgeId);
                setSelectedId(undefined); // Deselect any node
                console.log('New edge created and selected:', newEdgeId);
                toast.success("Edge created!");
            }
        }
        // Always reset the connection state after mouse up
        resetHookConnection();
    }, [connectingFrom, wf.nodes, resetHookConnection, setSelectedEdgeId, setSelectedId]);


    const selectedNode = useMemo(() => wf.nodes.find(n => n.id === selectedId), [wf.nodes, selectedId]);
    const selectedEdge = useMemo(() => wf.edges.find(e => e.id === selectedEdgeId), [wf.edges, selectedEdgeId]);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-hidden font-sans">
            <Palette setDraggedNode={setDraggedNode} paletteData={paletteData} />
            <div className="flex-1 flex flex-col relative">
                <div className="flex justify-center items-center py-2 px-4 border-b border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                    <Button variant="ghost" className="mr-2" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button variant="ghost" className="mr-2" onClick={() => setIsLoadModalOpen(true)}>
                        <FolderOpen className="h-4 w-4 mr-2" /> Load
                    </Button>
                    <Button onClick={handleRun} disabled={running}>
                        <WorkflowIcon className="h-4 w-4 mr-2" /> {running ? "Running..." : "Run Workflow"}
                    </Button>
                </div>
                <WorkflowCanvas
                    wf={wf}
                    canvasRef={canvasRef}
                    draggedNodePos={draggedNodePos ? { id: selectedId!, pos: draggedNodePos } : null}
                    connectingFrom={connectingFrom}
                    connectingTo={connectingTo}
                    setWf={setWf}
                    onNodeDrag={onNodeDrag}
                    onNodeClick={handleNodeClick}
                    onDeleteNode={onDeleteNode}
                    onPortMouseDown={onPortMouseDown}
                    onPortMouseUp={onPortMouseUp}
                    handleEdgeClick={handleEdgeClick}
                    handleDragControlPoint={handleDragControlPoint}
                    isTriggerNode={isTriggerNode}
                    draggedNode={draggedNode}
                    setDraggedNode={setDraggedNode}
                    setModalMessage={setModalMessage}
                    setIsModalOpen={setIsModalOpen}
                    onCanvasClick={handleCanvasClick}
                    onCanvasMouseMove={onCanvasMouseMove}
                    //onCanvasMouseUp={onCanvasMouseUp}
                    selectedId={selectedId}
                    selectedEdgeId={selectedEdgeId}
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
                            {selectedNode ? (
                                <NodeConfig node={selectedNode} onChange={handleConfigChange} onNameChange={handleNameChange} />
                            ) : selectedEdge ? (
                                <EdgeConfig edge={selectedEdge} onDelete={onDeleteEdge} />
                            ) : (
                                <div className="text-center text-gray-400 dark:text-zinc-500 text-sm py-8">Select a node or edge to configure</div>
                            )}
                        </TabsContent>
                        <TabsContent value="logs" className="space-y-2">
                            <div className="flex flex-col-reverse space-y-2 text-xs text-gray-700 dark:text-gray-300">
                                {logs.length > 0 ? (
                                    logs.map((log, index) => (
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
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cannot Add Node</DialogTitle>
                        <DialogDescription>{modalMessage}</DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setIsModalOpen(false)}>OK</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={isLoadModalOpen} onOpenChange={setIsLoadModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save/Load Workflow</DialogTitle>
                        <DialogDescription>
                            Copy the string to save your workflow, or paste a string to load one.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="workflow-data">Workflow Data</Label>
                        <Textarea id="workflow-data" value={loadString} onChange={(e) => setLoadString(e.target.value)} rows={6} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => {
                            if (loadString) {
                                document.execCommand('copy');
                                toast.success("Copied!", { description: "Workflow data copied to clipboard." });
                            }
                        }}>
                            Copy
                        </Button>
                        <Button onClick={handleLoad}>
                            Load
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Toaster />
        </div>
    );
}