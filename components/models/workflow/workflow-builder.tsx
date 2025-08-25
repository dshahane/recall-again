// File: components/workflow/WorkflowBuilder.tsx
'use client'

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronDown, Workflow } from 'lucide-react';

import {
    AnyNode,
    Edge,
    NodeKind,
    PortName,
    Vec2,
    Workflow as WorkflowType,
    PALETTE_DATA,
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

const nodePortPos = (n: AnyNode, port: PortName) => {
    const rect = { w: 220, h: 84 };
    const pp = portPositions(rect.w, rect.h, n.kind)[port];
    if (!pp) {
        return { x: n.pos.x, y: n.pos.y };
    }
    return { x: n.pos.x + pp.x, y: n.pos.y + pp.y };
};

const defaultBezierPoints = (from: Vec2, to: Vec2): { c1: Vec2, c2: Vec2 } => {
    // Calculate midpoints
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;

    // Determine the direction of the line
    const dx = Math.abs(from.x - to.x);
    const dy = Math.abs(from.y - to.y);

    if (from.x > to.x) {
        // Bend backwards for edges that go from right to left
        return {
            c1: { x: midX, y: from.y + dy / 2 },
            c2: { x: midX, y: to.y + dy / 2 }
        };
    } else if (Math.abs(from.y - to.y) < 20) {
        // Bend up/down for nearly horizontal lines
        return {
            c1: { x: midX, y: from.y + 50 },
            c2: { x: midX, y: to.y + 50 }
        };
    } else {
        // General case: create a gentle curve
        return {
            c1: { x: from.x + dx * 0.25, y: from.y },
            c2: { x: to.x - dx * 0.25, y: to.y }
        };
    }
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
    const [logs, setLogs] = useState<any[]>([]);
    const [running, setRunning] = useState(false);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [draggedNode, setDraggedNode] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

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
            // Set the state to true to trigger the useEffect
            setIsDraggingControlPoint(true);
        }
    }, [wf.edges, wf.nodes, setWf]);

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

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setSelectedId(undefined);
            setSelectedEdgeId(undefined);
            connectingFrom.current = null;
        }
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

    // Using a ref to avoid stale closure issues with useCallback
    const handleEdgeControlPointDrag = useCallback((e: MouseEvent) => {
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
    }, []); // No dependencies needed

    const handleEdgeControlPointDragEnd = useCallback(() => {
        draggedEdgeControlPoint.current = null;
        document.removeEventListener('mousemove', handleEdgeControlPointDrag);
        document.removeEventListener('mouseup', handleEdgeControlPointDragEnd);
    }, [handleEdgeControlPointDrag]);

    const selectedNode = useMemo(() => wf.nodes.find(n => n.id === selectedId), [wf.nodes, selectedId]);
    const selectedEdge = useMemo(() => wf.edges.find(e => e.id === selectedEdgeId), [wf.edges, selectedEdgeId]);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-hidden font-sans">
            <Palette setDraggedNode={setDraggedNode} isTriggerNode={isTriggerNode} />

            <div className="flex-1 flex flex-col relative">
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
                    onClick={handleCanvasClick}
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
                            const newNode = completeNode({ id: uuidv4(), kind: draggedNode.kind, name: draggedNode.label, pos: { x: snap(x - 110), y: snap(y - 42) } });
                            setWf(w => ({ ...w, nodes: [...w.nodes, newNode], startId: isTriggerNode(newNode.kind) ? newNode.id : w.startId }));
                            setSelectedId(newNode.id);
                            setSelectedEdgeId(undefined);
                            setDraggedNode(null);
                        }}
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
                                <EdgeConfig edge={selectedEdge} />
                            ) : (
                                <div className="text-center text-gray-400 dark:text-zinc-500 text-sm py-8">Select a node or edge to configure</div>
                            )}
                        </TabsContent>
                        <TabsContent value="logs" className="space-y-2">
                            {/* ... (Logs content) */}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}