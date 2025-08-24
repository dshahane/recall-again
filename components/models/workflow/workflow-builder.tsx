// File: components/workflow/WorkflowBuilder.tsx
'use client'

import React, { useCallback, useMemo, useRef, useState } from "react";
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

const nodePortPos = (n: AnyNode, port: PortName, kind: 'out' | 'in') => {
    const rect = { w: 220, h: 84 };
    if (kind === 'in') {
        return { x: n.pos.x, y: n.pos.y + rect.h / 2 };
    }
    const pp = portPositions(rect.w, rect.h, n.kind)[port] || { x: rect.w, y: rect.h / 2 };
    return { x: n.pos.x + pp.x, y: n.pos.y + pp.y };
};


export default function WorkflowBuilder() {
    const [wf, setWf] = useState<WorkflowType>(() => createStarterWorkflow());
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const connectingFrom = useRef<{ nodeId: string; port: PortName } | null>(null);
    const [connectingTo, setConnectingTo] = useState<Vec2 | null>(null);
    const [draggedNodePos, setDraggedNodePos] = useState<{ id: string; pos: Vec2 } | null>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [running, setRunning] = useState(false);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [draggedNode, setDraggedNode] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const isTriggerNode = (kind: NodeKind) => ["query", "document", "session"].includes(kind);

    const onDrag = useCallback((id: string, pos: Vec2) => {
        setDraggedNodePos({ id, pos });
    }, []);

    const onDragEnd = useCallback((id: string, pos: Vec2) => {
        setWf(w => {
            const newNodes = w.nodes.map(n => (n.id === id ? { ...n, pos } : n));
            return { ...w, nodes: newNodes };
        });
        setDraggedNodePos(null);
    }, []);

    const deleteNode = useCallback((id: string) => {
        setWf(w => ({
            ...w,
            nodes: w.nodes.filter(n => n.id !== id),
            edges: w.edges.filter(e => e.from.nodeId !== id && e.to.nodeId !== id),
            startId: w.startId === id ? undefined : w.startId,
        }));
        if (selectedId === id) setSelectedId(undefined);
    }, [selectedId]);

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setSelectedId(undefined);
            connectingFrom.current = null;
        }
    }, []);

    const onPortMouseDown = useCallback((nodeId: string, port: PortName, e: React.MouseEvent) => {
        e.stopPropagation();
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

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (connectingFrom.current) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                setConnectingTo({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
        }
    }, [connectingFrom]);

    const handleConfigChange = useCallback((id: string, newConfig: any) => {
        setWf(w => ({
            ...w,
            nodes: w.nodes.map(n => {
                if (n.id === id) {
                    if ('config' in n) {
                        return { ...n, config: newConfig };
                    }
                }
                return n;
            }) as AnyNode[]
        }));
    }, []);

    const handleNameChange = useCallback((id: string, newName: string) => {
        setWf(w => ({ ...w, nodes: w.nodes.map(n => n.id === id ? { ...n, name: newName } : n) }));
    }, []);

    const selectedNode = useMemo(() => wf.nodes.find(n => n.id === selectedId), [wf.nodes, selectedId]);

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
            <Palette setDraggedNode={setDraggedNode} isTriggerNode={isTriggerNode} />

            <div className="flex-1 flex flex-col relative">
                <div
                    className="flex-1 overflow-hidden relative"
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => { if (connectingFrom.current) { connectingFrom.current = null; setConnectingTo(null); } }}
                    onClick={handleCanvasClick}
                >
                    <div
                        ref={canvasRef}
                        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200%20L0%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23252525%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] bg-repeat"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            const canvasRect = canvasRef.current?.getBoundingClientRect();
                            if (!canvasRect || !draggedNode) return;
                            const x = e.clientX - canvasRect.left;
                            const y = e.clientY - canvasRect.top;
                            if (isTriggerNode(draggedNode.kind) && wf.nodes.some(n => isTriggerNode(n.kind))) {
                                setModalMessage("A workflow can only have one Trigger node.");
                                setIsModalOpen(true);
                                return;
                            }
                            const newNode = completeNode({ id: uuidv4(), kind: draggedNode.kind, name: draggedNode.label, pos: { x: snap(x - 110), y: snap(y - 42) } });
                            setWf(w => ({ ...w, nodes: [...w.nodes, newNode], startId: isTriggerNode(newNode.kind) ? newNode.id : w.startId }));
                            setSelectedId(newNode.id);
                            setDraggedNode(null);
                        }}
                    >
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#d4d4d8" />
                                </marker>
                            </defs>
                            {wf.edges.map(edge => {
                                const fromNode = wf.nodes.find(n => n.id === edge.from.nodeId);
                                const toNode = wf.nodes.find(n => n.id === edge.to.nodeId);
                                if (!fromNode || !toNode) return null;

                                const finalFromNode = draggedNodePos?.id === fromNode.id ? { ...fromNode, pos: draggedNodePos.pos } : fromNode;
                                const finalToNode = draggedNodePos?.id === toNode.id ? { ...toNode, pos: draggedNodePos.pos } : toNode;

                                const fromPos = nodePortPos(finalFromNode, edge.from.port, 'out');
                                const toPos = nodePortPos(finalToNode, 'out', 'in');

                                return <EdgeView key={edge.id} from={fromPos} to={toPos} fromKind={finalFromNode.kind} />;
                            })}
                            {connectingFrom.current && connectingTo && (
                                <EdgeView
                                    from={nodePortPos(wf.nodes.find(n => n.id === connectingFrom.current!.nodeId)!, connectingFrom.current!.port, 'out')}
                                    to={connectingTo}
                                    fromKind={wf.nodes.find(n => n.id === connectingFrom.current!.nodeId)!.kind}
                                />
                            )}
                        </svg>

                        {wf.nodes.map(node => (
                            <NodeView
                                key={node.id}
                                node={draggedNodePos?.id === node.id ? { ...node, pos: draggedNodePos.pos } : node}
                                selected={node.id === selectedId}
                                onDrag={onDrag}
                                onDragEnd={onDragEnd}
                                onSelect={setSelectedId}
                                onDelete={deleteNode}
                                onPortMouseDown={onPortMouseDown}
                                onPortMouseUp={onPortMouseUp}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-80 flex-shrink-0 border-l border-zinc-800 bg-zinc-900/50 p-4 overflow-y-auto">
                <Tabs defaultValue="configure" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="configure">Configure</TabsTrigger>
                        <TabsTrigger value="logs">Logs</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 mt-4">
                        <TabsContent value="configure" className="space-y-4">
                            {!selectedNode ? (
                                <div className="text-center text-zinc-500 text-sm py-8">Select a node to configure</div>
                            ) : (
                                <NodeConfig node={selectedNode} onChange={handleConfigChange} onNameChange={handleNameChange} />
                            )}
                        </TabsContent>
                        <TabsContent value="logs" className="space-y-2">
                            {/* ... (Logs content from original code) */}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}