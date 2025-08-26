// File: components/workflow/WorkflowCanvas.tsx
'use client'

import React, {DragEvent, useEffect, useRef} from 'react';
import { Vec2 } from '@/app/types/app';
import { AnyNode, Edge, NodeKind, Workflow } from './types';
import NodeView from './node-view';
import EdgeView from './edge-view';
import { completeNode, defaultBezierPoints, nodePortPos, snap } from "@/components/models/workflow/workflow-utils";
import { isTriggerNode } from './node-config-types';
import { v4 as uuidv4 } from "uuid";
import { toast, Toaster } from "sonner";
import { nodeRect} from "@/components/models/workflow/workflow-utils";

// Define the props interface for clarity and type-safety
interface WorkflowCanvasProps {
    wf: Workflow;
    canvasRef: React.RefObject<HTMLDivElement>;
    draggedNodePos: { id: string; pos: Vec2 } | null;
    connectingFrom: { nodeId: string; port: string } | null;
    connectingTo: Vec2 | null;
    setWf: React.Dispatch<React.SetStateAction<Workflow>>;
    onNodeDrag: (id: string, newPos: Vec2) => void;
    onNodeClick: (nodeId: string, e: React.MouseEvent) => void;
    onDeleteNode: (nodeId: string) => void;
    onPortMouseDown: (e: React.MouseEvent, nodeId: string, port: string) => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: string, port: string) => void;
    handleEdgeClick: (edgeId: string, e: React.MouseEvent) => void;
    handleDragControlPoint: (edgeId: string, cPoint: 'c1' | 'c2', e: React.MouseEvent) => void;
    onCanvasClick: (e: React.MouseEvent) => void;
    onCanvasMouseMove: (e: React.MouseEvent) => void;
    onCanvasMouseUp: (e: React.MouseEvent) => void;
    draggedNodeId: string | null;
    draggedPos: Vec2 | null;
    isModalOpen: boolean;
    setModalMessage: (message: string) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    selectedId: string | undefined;
    selectedEdgeId: string | undefined;
    draggedNode: AnyNode | null;
    setDraggedNode: (node: AnyNode | null) => void;
}

export default function WorkflowCanvas({
                                           wf,
                                           canvasRef,
                                           draggedNodePos,
                                           connectingFrom,
                                           connectingTo,
                                           setWf,
                                           onNodeDrag,
                                           onNodeClick,
                                           onDeleteNode,
                                           onPortMouseDown,
                                           onPortMouseUp,
                                           handleEdgeClick,
                                           handleDragControlPoint,
                                           onCanvasClick,
                                           onCanvasMouseMove,
                                           onCanvasMouseUp,
                                           draggedNodeId,
                                           draggedPos,
                                           setModalMessage,
                                           setIsModalOpen,
                                           selectedId,
                                           selectedEdgeId,
                                           draggedNode,
                                           setDraggedNode
                                       }: WorkflowCanvasProps) {

    // Helper function to get the correct node with its updated position
    const getUpdatedNode = (nodeId: string) => {
        const node = wf.nodes.find((n: AnyNode) => n.id === nodeId);
        if (!node) return null;

        if (draggedNodeId === nodeId && draggedPos) {
            return {
                ...node,
                pos: draggedPos
            };
        }
        return node;
    };

    // Check for initial workflow state and show a toast if needed.
    useEffect(() => {
        const hasNodes = wf.nodes && wf.nodes.length > 0;
        if (!hasNodes) {
            toast("No saved workflow found.", {
                description: "Start by dragging a node from the palette.",
                action: {
                    label: "Ok",
                    onClick: () => console.log("Ok"),
                },
            });
        }
    }, [wf.nodes]); // Dependency on wf.nodes ensures this runs when the workflow is loaded

    return (
        <div
            className="flex-1 overflow-hidden relative"
            onMouseMove={onCanvasMouseMove}
            onMouseUp={onCanvasMouseUp}
            onClick={onCanvasClick}
        >
            <Toaster />
            <div
                ref={canvasRef}
                className="absolute inset-0 bg-white bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200%20L0%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] dark:bg-zinc-950 dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200%20L0%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23252525%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] bg-repeat"
                onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                    const canvasRect = canvasRef.current?.getBoundingClientRect();
                    if (!canvasRect) return;

                    const draggedNodeData = JSON.parse(e.dataTransfer.getData('application/json'));
                    if (!draggedNodeData) return;

                    const x = e.clientX - canvasRect.left;
                    const y = e.clientY - canvasRect.y;

                    if (isTriggerNode(draggedNodeData.kind) && wf.nodes.some((n: AnyNode) => isTriggerNode(n.kind))) {
                        setModalMessage("A workflow can only have one Trigger node.");
                        setIsModalOpen(true);
                        return;
                    }

                    const snappedPos = snap(x - nodeRect.w / 2, y - nodeRect.h / 2) as Vec2;

                    const newNode = completeNode({
                        id: uuidv4(),
                        kind: draggedNodeData.kind as NodeKind,
                        name: draggedNodeData.label,
                        pos: snappedPos,
                    });

                    setWf((w: Workflow) => ({
                        ...w,
                        nodes: [...w.nodes, newNode],
                        startId: isTriggerNode(newNode.kind) ? newNode.id : w.startId
                    }));
                }}
            >
                <svg className="absolute inset-0 w-full h-full pointer-events-auto z-0">
                    {wf.edges.map((edge: Edge) => {
                        const fromNode = getUpdatedNode(edge.from.nodeId);
                        const toNode = getUpdatedNode(edge.to.nodeId);

                        if (!fromNode || !toNode) return null;

                        const fromPos = nodePortPos(fromNode, edge.from.port);
                        const toPos = nodePortPos(toNode, edge.to.port);
                        //console.log("Canvas Drop from-pos", fromPos );
                        //console.log("Canvas Drop to-pos", toPos );
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
                    {connectingFrom && connectingTo && (() => {
                        // We must first get the node object before trying to get its position.
                        const fromNode = getUpdatedNode(connectingFrom.nodeId);

                        // Render nothing if the node is not found.
                        if (!fromNode) {
                            return null;
                        }

                        // Now we can safely calculate the positions and render the EdgeView
                        const fromPos = nodePortPos(fromNode, connectingFrom.port);
                        const {c1, c2} = defaultBezierPoints(fromPos, connectingTo);

                        return (
                            <EdgeView
                                from={fromPos}
                                to={connectingTo}
                                c1={c1}
                                c2={c2}
                                selected={false}
                                onSelect={() => {}}
                                onDragControlPoint={() => {}}
                            />
                        );
                    })()}
                </svg>

                {wf.nodes.map((node: AnyNode) => {
                    const isBeingDragged = draggedNodeId === node.id;
                    const draggedPosition = isBeingDragged ? draggedPos : node.pos;

                    return (
                        <NodeView
                            key={node.id}
                            node={node}
                            selected={node.id === selectedId}
                            isBeingDragged={isBeingDragged}
                            draggedPosition={draggedPosition as Vec2}
                            onNodeDrag={onNodeDrag}
                            onNodeClick={onNodeClick}
                            onDelete={onDeleteNode}
                            onPortMouseDown={onPortMouseDown}
                            onPortMouseUp={onPortMouseUp}
                        />
                    );
                })}
            </div>
        </div>
    );
};
