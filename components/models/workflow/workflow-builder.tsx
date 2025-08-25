// File: components/workflow/WorkflowBuilder.tsx
'use client'

import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WorkflowIcon, ChevronDown, CheckCheck, Trash2, Save, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import {
    AnyNode,
    Edge,
    NodeKind,
    PortName,
    Vec2,
    Workflow as WorkflowType,
    completeNode,
    createStarterWorkflow,
    snap,
    portPositions,
} from './types';
import NodeView from './node-view';
import EdgeView from './edge-view';
import NodeConfig from './node-config';
import Palette from './palette';
import EdgeConfig from './edge-config';

const nodeRect = { w: 224, h: 96 }; // Adjusted to better match Tailwind's w-56 h-24

const nodePortPos = (n: AnyNode, port: PortName) => {
    const pp = portPositions(nodeRect.w, nodeRect.h, n.kind)[port];
    if (!pp) {
        // Fallback for missing ports, should not happen with the new types.ts
        return { x: n.pos.x, y: n.pos.y };
    }
    return { x: n.pos.x + pp.x, y: n.pos.y + pp.y };
};

const defaultBezierPoints = (from: Vec2, to: Vec2): { c1: Vec2, c2: Vec2 } => {
    // The control points are now placed horizontally to create a smooth, side-to-side curve
    // The offset is a smaller percentage to keep the curve tighter.
    const c1Offset = Math.min(Math.abs(from.x - to.x) / 3, 50);
    return {
        c1: { x: from.x + c1Offset, y: from.y },
        c2: { x: to.x - c1Offset, y: to.y }
    };
};

export default function WorkflowBuilder() {
    const [wf, setWf] = useState<WorkflowType>(() => createStarterWorkflow());
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | undefined>(undefined);
    const connectingFrom = useRef<{ nodeId: string; port: PortName } | null>(null);
    const [connectingTo, setConnectingTo] = useState<Vec2 | null>(null);
    const [draggedNodePos, setDraggedNodePos] = useState<{ id: string; pos: Vec2 } | null>(null);
    const draggedEdgeControlPoint = useRef<{ edgeId: string; controlPoint: 'c1' | 'c2'; startOffset: Vec2 } | null>(null);
    const [isDraggingControlPoint, setIsDraggingControlPoint] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [draggedNode, setDraggedNode] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [loadString, setLoadString] = useState("");

    const isTriggerNode = (kind: NodeKind) => ["query", "document", "session"].includes(kind);

    useEffect(() => {
        const handleDrag = (e: MouseEvent) => {
            if (!draggedEdgeControlPoint.current || !canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const newPos = {
                x: e.clientX - rect.left - draggedEdgeControlPoint.current.startOffset.x,
                y: e.clientY - rect.top - draggedEdgeControlPoint.current.startOffset.y,
            };
            setWf(w => ({
                ...w,
                edges: w.edges.map(edge => {
                    if (edge.id === draggedEdgeControlPoint.current!.edgeId) {
                        return { ...edge, [draggedEdgeControlPoint.current!.controlPoint]: newPos };
                    }
                    return edge;
                })
            }));
        };

        const handleDragEnd = () => {
            setIsDraggingControlPoint(false);
            draggedEdgeControlPoint.current = null;
        };

        if (isDraggingControlPoint) {
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
        };
    }, [isDraggingControlPoint, setWf]);

    const onNodeDrag = useCallback((id: string, e: React.MouseEvent) => {
        const node = wf.nodes.find(n => n.id === id);
        if (!node) return;

        e.preventDefault();
        e.stopPropagation();
        setSelectedId(node.id);
        setSelectedEdgeId(undefined);
        const dragStartPos = { x: e.clientX, y: e.clientY };
        const initialPos = { x: node.pos.x, y: node.pos.y };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - dragStartPos.x;
            const dy = moveEvent.clientY - dragStartPos.y;
            const newPos = { x: snap(initialPos.x + dx), y: snap(initialPos.y + dy) };
            setDraggedNodePos({ id, pos: newPos });
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            const dx = upEvent.clientX - dragStartPos.x;
            const dy = upEvent.clientY - dragStartPos.y;
            const finalPos = { x: snap(initialPos.x + dx), y: snap(initialPos.y + dy) };
            setWf(w => ({
                ...w,
                nodes: w.nodes.map(n => (n.id === id ? { ...n, pos: finalPos } : n))
            }));
            setDraggedNodePos(null);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [wf.nodes, setSelectedId, setSelectedEdgeId]);

    const handleNodeClick = useCallback((nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedId(nodeId);
        setSelectedEdgeId(undefined);
    }, []);

    const deleteNode = useCallback((id: string) => {
        setWf(w => ({
            ...w,
            nodes: w.nodes.filter(n => n.id !== id),
            edges: w.edges.filter(e => e.from.nodeId !== id && e.to.nodeId !== id),
            startId: w.startId === id ? undefined : w.startId,
        }));
        if (selectedId === id) setSelectedId(undefined);
        if (selectedEdgeId === id) setSelectedEdgeId(undefined);
    }, [selectedId, selectedEdgeId]);

    const deleteEdge = useCallback((id: string) => {
        setWf(w => ({
            ...w,
            edges: w.edges.filter(e => e.id !== id)
        }));
        setSelectedEdgeId(undefined);
    }, []);

    // This is the function that handles clicks on the canvas background.
    // It deselects any node or edge.
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        setSelectedId(undefined);
        setSelectedEdgeId(undefined);
        connectingFrom.current = null;
    }, []);

    const onPortMouseDown = useCallback((nodeId: string, port: PortName, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedId(nodeId);
        setSelectedEdgeId(undefined);
        if (port !== ('in' as PortName)) {
            connectingFrom.current = { nodeId, port };
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                setConnectingTo({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
        }
    }, []);

    const onPortMouseUp = useCallback((nodeId: string, port: PortName, e: React.MouseEvent) => {
        e.stopPropagation();
        const currentConnection = connectingFrom.current;
        if (currentConnection) {
            const fromNode = wf.nodes.find(n => n.id === currentConnection.nodeId);
            const toNode = wf.nodes.find(n => n.id === nodeId);

            if (port === ('in' as PortName) && currentConnection.port !== ('in' as PortName) && fromNode && toNode && fromNode.id !== toNode.id) {
                const newEdge: Edge = {
                    id: uuidv4(),
                    from: { nodeId: currentConnection.nodeId, port: currentConnection.port },
                    to: { nodeId: toNode.id },
                };
                setWf(w => ({ ...w, edges: [...w.edges, newEdge] }));
            }
        }
        connectingFrom.current = null;
        setConnectingTo(null);
    }, [wf.nodes, wf.edges]);

    const handleConfigChange = useCallback((id: string, newConfig: any) => {
        setWf(w => ({
            ...w,
            nodes: w.nodes.map(n => {
                if (n.id === id) {
                    return { ...n, config: newConfig };
                }
                return n;
            }) as AnyNode[]
        }));
    }, []);

    const handleNameChange = useCallback((id: string, newName: string) => {
        setWf(w => ({ ...w, nodes: w.nodes.map(n => n.id === id ? { ...n, name: newName } : n) }));
    }, []);

    const handleEdgeClick = useCallback((edgeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEdgeId(edgeId);
        setSelectedId(undefined);
    }, []);

    const handleDragControlPoint = useCallback((edgeId: string, controlPoint: 'c1' | 'c2', e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const edge = wf.edges.find(e => e.id === edgeId);
            if (!edge) return;
            const fromNode = wf.nodes.find(n => n.id === edge.from.nodeId)!;
            const toNode = wf.nodes.find(n => n.id === edge.to.nodeId)!;
            const fromPos = nodePortPos(fromNode, edge.from.port);
            const toPos = nodePortPos(toNode, 'in');
            const defaultPoints = defaultBezierPoints(fromPos, toPos);
            const currentPoint = edge[controlPoint] || defaultPoints[controlPoint];

            draggedEdgeControlPoint.current = {
                edgeId,
                controlPoint,
                startOffset: { x: e.clientX - rect.left - currentPoint.x, y: e.clientY - rect.top - currentPoint.y }
            };
            setIsDraggingControlPoint(true);
        }
    }, [wf.edges, wf.nodes, setWf]);

    const handleSave = useCallback(() => {
        try {
            const serialized = JSON.stringify(wf);
            const encoded = btoa(serialized);
            setLoadString(encoded);
            toast.success("Workflow Saved", {
                description: "Copy the string below to save your workflow.",
            });
            setIsLoadModalOpen(true);
        } catch (error) {
            toast.error("Failed to save workflow.", {
                description: "An error occurred while saving the workflow.",
            });
        }
    }, [wf]);

    const handleLoad = useCallback(() => {
        try {
            const decoded = atob(loadString);
            const parsed = JSON.parse(decoded);
            setWf(parsed);
            toast.success("Workflow Loaded", {
                description: "Your workflow has been loaded successfully.",
            });
            setIsLoadModalOpen(false);
            setLoadString("");
        } catch (error) {
            toast.error("Invalid workflow data.", {
                description: "Please check the string. The data is not in a valid format.",
            });
        }
    }, [loadString, setWf]);

    const handleRun = useCallback(async () => {
        setRunning(true);
        setLogs(currentLogs => ["Running workflow...", ...currentLogs]);

        // Validation check for a trigger node
        if (!wf.startId) {
            toast.error("Workflow cannot run", {
                description: "Please add a Trigger node (Query, Document, or Session) to start the workflow.",
            });
            setLogs(currentLogs => ["Error: No Trigger node found.", ...currentLogs]);
            setRunning(false);
            return;
        }

        toast.info("Workflow Started", {
            description: "Simulating a workflow run. Check the Logs tab for progress.",
        });

        // Simulating workflow execution
        await new Promise(r => setTimeout(r, 2000));

        setLogs(currentLogs => ["Workflow finished.", ...currentLogs]);
        setRunning(false);

    }, [wf.startId]);

    const selectedNode = useMemo(() => wf.nodes.find(n => n.id === selectedId), [wf.nodes, selectedId]);
    const selectedEdge = useMemo(() => wf.edges.find(e => e.id === selectedEdgeId), [wf.edges, selectedEdgeId]);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-hidden font-sans">
            <Palette setDraggedNode={setDraggedNode} />

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
                <div
                    className="flex-1 overflow-hidden relative"
                    onMouseMove={(e) => {
                        if (connectingFrom.current) {
                            const rect = canvasRef.current?.getBoundingClientRect();
                            if (rect) {
                                setConnectingTo({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                            }
                        }
                    }}
                    onMouseUp={() => { if (connectingFrom.current) { connectingFrom.current = null; setConnectingTo(null); } }}
                >
                    <div
                        ref={canvasRef}
                        className="absolute inset-0 bg-white bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200%20L0%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] dark:bg-zinc-950 dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200%20L0%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23252525%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] bg-repeat"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            const canvasRect = canvasRef.current?.getBoundingClientRect();
                            if (!canvasRect || !draggedNode) return;
                            const x = e.clientX - canvasRect.left;
                            const y = e.clientY - canvasRect.y;
                            if (isTriggerNode(draggedNode.kind) && wf.nodes.some(n => isTriggerNode(n.kind))) {
                                setModalMessage("A workflow can only have one Trigger node.");
                                setIsModalOpen(true);
                                return;
                            }
                            const newNode = completeNode({ id: uuidv4(), kind: draggedNode.kind as NodeKind, name: draggedNode.label, pos: { x: snap(x - nodeRect.w / 2), y: snap(y - nodeRect.h / 2) } });
                            setWf(w => ({ ...w, nodes: [...w.nodes, newNode], startId: isTriggerNode(newNode.kind) ? newNode.id : w.startId }));
                            setSelectedId(newNode.id);
                            setSelectedEdgeId(undefined);
                            setDraggedNode(null);
                        }}
                        onClick={handleCanvasClick}
                    >
                        <svg className="absolute inset-0 w-full h-full pointer-events-auto z-0">
                            {wf.edges.map(edge => {
                                const fromNode = wf.nodes.find(n => n.id === edge.from.nodeId);
                                const toNode = wf.nodes.find(n => n.id === edge.to.nodeId);
                                if (!fromNode || !toNode) return null;

                                const finalFromNode = draggedNodePos?.id === fromNode.id ? { ...fromNode, pos: draggedNodePos.pos } : fromNode;
                                const finalToNode = draggedNodePos?.id === toNode.id ? { ...toNode, pos: draggedNodePos.pos } : toNode;

                                const fromPos = nodePortPos(finalFromNode, edge.from.port);
                                const toPos = nodePortPos(finalToNode, 'in');

                                const { c1, c2 } = edge.c1 && edge.c2 ? { c1: edge.c1, c2: edge.c2 } : defaultBezierPoints(fromPos, toPos);

                                return (
                                    <EdgeView
                                        key={edge.id}
                                        from={fromPos}
                                        to={toPos}
                                        c1={c1}
                                        c2={c2}
                                        selected={edge.id === selectedEdgeId}
                                        onSelect={(e) => handleEdgeClick(edge.id, e)}
                                        onDragControlPoint={(cPoint, e) => handleDragControlPoint(edge.id, cPoint, e)}
                                    />
                                );
                            })}
                            {connectingFrom.current && connectingTo && (
                                <EdgeView
                                    from={nodePortPos(wf.nodes.find(n => n.id === connectingFrom.current!.nodeId)!, connectingFrom.current!.port)}
                                    to={connectingTo}
                                    c1={defaultBezierPoints(nodePortPos(wf.nodes.find(n => n.id === connectingFrom.current!.nodeId)!, connectingFrom.current!.port), connectingTo).c1}
                                    c2={defaultBezierPoints(nodePortPos(wf.nodes.find(n => n.id === connectingFrom.current!.nodeId)!, connectingFrom.current!.port), connectingTo).c2}
                                    selected={false}
                                    onSelect={() => {}}
                                    onDragControlPoint={() => {}}
                                />
                            )}
                        </svg>

                        {wf.nodes.map(node => (
                            <NodeView
                                key={node.id}
                                node={draggedNodePos?.id === node.id ? { ...node, pos: draggedNodePos.pos } : node}
                                selected={node.id === selectedId}
                                onNodeDrag={onNodeDrag}
                                onNodeClick={handleNodeClick}
                                onDelete={deleteNode}
                                onPortMouseDown={onPortMouseDown}
                                onPortMouseUp={onPortMouseUp}
                            />
                        ))}
                    </div>
                </div>
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
                                <EdgeConfig edge={selectedEdge} onDelete={deleteEdge} />
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
                                toast.success("Copied!", {
                                    description: "Workflow data copied to clipboard.",
                                });
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
