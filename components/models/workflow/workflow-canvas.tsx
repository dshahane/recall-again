// File: components/workflow/WorkflowCanvas.tsx

'use client'

import React from 'react';
import { Vec2 } from '@/app/types/app';
import { AnyNode, Edge, PortName, NodeKind, Workflow } from './types';
import { completeNode, nodePortPos, defaultBezierPoints, snap } from './workflow-utils';
import { v4 as uuidv4 } from "uuid";
import NodeView from './node-view';
import EdgeView from './edge-view';

interface WorkflowCanvasProps {
    wf: { nodes: AnyNode[], edges: Edge[], startId?: string };
    canvasRef: React.RefObject<HTMLDivElement | null>;
    draggedNodePos: { id: string; pos: Vec2 } | null;
    connectingFrom: { nodeId: string; port: PortName } | null;
    connectingTo: Vec2 | null;
    setWf: React.Dispatch<React.SetStateAction<any>>;
    onNodeDrag: (id: string, e: React.MouseEvent) => void;
    onNodeClick: (id: string, e: React.MouseEvent) => void;
    onDeleteNode: (id: string) => void;
    onPortMouseDown: (nodeId: string, port: PortName, e: React.MouseEvent) => void;
    onPortMouseUp: (nodeId: string, port: PortName, e: React.MouseEvent) => void;
    handleEdgeClick: (id: string, e: React.MouseEvent) => void;
    handleDragControlPoint: (edgeId: string, controlPoint: 'c1' | 'c2', e: React.MouseEvent) => void;
    isTriggerNode: (kind: NodeKind) => boolean;
    draggedNode: any | null;
    setDraggedNode: React.Dispatch<React.SetStateAction<any | null>>;
    setModalMessage: (msg: string) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    onCanvasClick: (e: React.MouseEvent) => void;
    onCanvasMouseMove: (e: React.MouseEvent) => void;
    selectedId: string | undefined;
    selectedEdgeId: string | undefined;
}

const nodeRect = { w: 224, h: 96 };

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
                                                           wf, canvasRef, draggedNodePos, connectingFrom, connectingTo, setWf,
                                                           onNodeDrag, onNodeClick, onDeleteNode, onPortMouseDown, onPortMouseUp,
                                                           handleEdgeClick, handleDragControlPoint, isTriggerNode, draggedNode,
                                                           setDraggedNode, setModalMessage, setIsModalOpen, onCanvasClick,
                                                           onCanvasMouseMove, selectedId, selectedEdgeId
                                                       }) => {
    return (
        <div
            className="flex-1 overflow-hidden relative"
            onMouseMove={onCanvasMouseMove}
            // `onMouseUp` is a standard DOM event handler, not a prop.
            // It will be handled correctly by the `WorkflowBuilder` component.
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
                    const snappedPos = snap(x - nodeRect.w / 2, y - nodeRect.h / 2) as Vec2;

                    const newNode = completeNode({
                        id: uuidv4(),
                        kind: draggedNode.kind as NodeKind,
                        name: draggedNode.label,
                        pos: snappedPos,
                    });

                    setWf( (w: Workflow) => ({
                        ...w,
                        nodes: [...w.nodes, newNode],
                        startId: isTriggerNode(newNode.kind) ? newNode.id : w.startId
                    }));
                    setDraggedNode(null);
                }}
                onClick={onCanvasClick}
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
                    {connectingFrom && connectingTo && (
                        <EdgeView
                            from={nodePortPos(wf.nodes.find(n => n.id === connectingFrom.nodeId)!, connectingFrom.port)}
                            to={connectingTo}
                            c1={defaultBezierPoints(nodePortPos(wf.nodes.find(n => n.id === connectingFrom.nodeId)!, connectingFrom.port), connectingTo).c1}
                            c2={defaultBezierPoints(nodePortPos(wf.nodes.find(n => n.id === connectingFrom.nodeId)!, connectingFrom.port), connectingTo).c2}
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
                        onNodeClick={onNodeClick}
                        onDelete={onDeleteNode}
                        onPortMouseDown={onPortMouseDown}
                        onPortMouseUp={onPortMouseUp}
                    />
                ))}
            </div>
        </div>
    );
};

export default WorkflowCanvas;