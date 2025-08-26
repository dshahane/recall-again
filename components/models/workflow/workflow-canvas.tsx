// File: components/workflow/WorkflowCanvas.tsx
'use client'

import React, {DragEvent} from 'react';
import {Vec2} from '@/app/types/app';
import {AnyNode, Edge, NodeKind, Workflow} from './types';
import NodeView from './node-view';
import EdgeView from './edge-view';
import NeoWorkflowEngine from "@/components/models/neo/neo-workflow-engine";
import {completeNode, defaultBezierPoints, nodePortPos, snap} from "@/components/models/workflow/workflow-utils";
import {isTriggerNode} from './node-config-types';
import {v4 as uuidv4} from "uuid";

const nodeRect = { w: 224, h: 96 };

export default function WorkflowCanvas() {
    return (
        <NeoWorkflowEngine>
            {(api) => {
                // New helper function to get the correct node with its updated position
                const getUpdatedNode = (nodeId: string) => {
                    const node = api.wf.nodes.find((n: AnyNode) => n.id === nodeId);
                    if (!node) return null; // Node not found

                    // If the node is being dragged, return a new object with the updated position.
                    if (api.draggedNodeId === nodeId && api.draggedPos) {
                        return {
                            ...node,
                            pos: api.draggedPos
                        };
                    }
                    // Otherwise, return the node as-is.
                    return node;
                };

                return (
                    <div
                        className="flex-1 overflow-hidden relative"
                        onMouseMove={api.onCanvasMouseMove}
                        onMouseUp={api.onCanvasMouseUp}
                        onClick={api.onCanvasClick}
                    >
                        <div
                            ref={api.canvasRef}
                            className="absolute inset-0 bg-white bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200%20L0%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] dark:bg-zinc-950 dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200%20L0%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23252525%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] bg-repeat"
                            onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                            onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                                const canvasRect = api.canvasRef.current?.getBoundingClientRect();
                                if (!canvasRect) return;

                                // Get the dragged node data directly from the event
                                const draggedNodeData = JSON.parse(e.dataTransfer.getData('application/json'));
                                if (!draggedNodeData) return;

                                const x = e.clientX - canvasRect.left;
                                const y = e.clientY - canvasRect.y;

                                if (isTriggerNode(draggedNodeData.kind) && api.wf.nodes.some((n: AnyNode) => isTriggerNode(n.kind))) {
                                    api.setModalMessage("A workflow can only have one Trigger node.");
                                    api.setIsModalOpen(true);
                                    return;
                                }

                                const snappedPos = snap(x - nodeRect.w / 2, y - nodeRect.h / 2) as Vec2;

                                const newNode = completeNode({
                                    id: uuidv4(),
                                    kind: draggedNodeData.kind as NodeKind,
                                    name: draggedNodeData.label,
                                    pos: snappedPos,
                                });

                                api.setWf((w: any) => ({
                                    ...w,
                                    nodes: [...w.nodes, newNode],
                                    startId: isTriggerNode(newNode.kind) ? newNode.id : w.startId
                                }));
                            }}
                        >
                            <svg className="absolute inset-0 w-full h-full pointer-events-auto z-0">
                                {api.wf.edges.map((edge: Edge) => {
                                    // Pass the full, updated node object to nodePortPos
                                    const fromNode = getUpdatedNode(edge.from.nodeId);
                                    const toNode = getUpdatedNode(edge.to.nodeId);

                                    if (!fromNode || !toNode) return null;

                                    const fromPos = nodePortPos(fromNode, edge.from.port);
                                    const toPos = nodePortPos(toNode, 'in');

                                    const { c1, c2 } = edge.c1 && edge.c2 ? { c1: edge.c1, c2: edge.c2 } : defaultBezierPoints(fromPos, toPos);

                                    return (
                                        <EdgeView
                                            key={edge.id}
                                            from={fromPos}
                                            to={toPos}
                                            c1={c1}
                                            c2={c2}
                                            selected={edge.id === api.selectedEdgeId}
                                            onSelect={(e) => api.handleEdgeClick(edge.id, e)}
                                            onDragControlPoint={(cPoint, e) => api.handleDragControlPoint(edge.id, cPoint, e)}
                                        />
                                    );
                                })}
                                {api.connectingFrom && api.connectingTo && (
                                    <EdgeView
                                        // Pass the full, updated node object to nodePortPos
                                        from={nodePortPos(getUpdatedNode(api.connectingFrom!.nodeId), api.connectingFrom.port)}
                                        to={api.connectingTo}
                                        c1={defaultBezierPoints(nodePortPos(getUpdatedNode(api.connectingFrom!.nodeId), api.connectingFrom.port), api.connectingTo).c1}
                                        c2={defaultBezierPoints(nodePortPos(getUpdatedNode(api.connectingFrom!.nodeId), api.connectingFrom.port), api.connectingTo).c2}
                                        selected={false}
                                        onSelect={() => {}}
                                        onDragControlPoint={() => {}}
                                    />
                                )}
                            </svg>

                            {api.wf.nodes.map((node: AnyNode) => {
                                const isBeingDragged = api.draggedNodeId === node.id;
                                const draggedPosition = isBeingDragged ? api.draggedPos : node.pos;

                                return (
                                    <NodeView
                                        key={node.id}
                                        node={node}
                                        selected={node.id === api.selectedId}
                                        isBeingDragged={isBeingDragged}
                                        draggedPosition={draggedPosition as Vec2}
                                        onNodeDrag={api.onNodeDrag}
                                        onNodeClick={api.onNodeClick}
                                        onDelete={api.onDeleteNode}
                                        onPortMouseDown={api.onPortMouseDown}
                                        onPortMouseUp={api.onPortMouseUp}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            }}
        </NeoWorkflowEngine>
    );
};
