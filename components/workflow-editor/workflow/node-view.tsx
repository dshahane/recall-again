// File: components/workflow/node-view.tsx
'use client'

import React, {MouseEvent, useCallback} from 'react';
import {AnyNode, PortName} from '@/components/workflow-editor/workflow/types';
import {Vec2} from '@/app/types/app';
import {XCircle} from 'lucide-react';
import {cn} from '@/lib/utils';
import {getNodeMetadata} from "@/components/workflow-editor/workflow/node-config-types";
import { nodeRect} from "@/components/workflow-editor/workflow/workflow-utils";

// Define the props interface for clarity
interface NodeViewProps {
    node: AnyNode;
    selected: boolean;
    isBeingDragged: boolean;
    draggedPosition: Vec2 | null;
    // The onNodeDrag prop now expects the full mouse event
    onNodeDrag: (id: string, e: MouseEvent) => void;
    onNodeClick: (nodeId: string, e: MouseEvent) => void;
    onDelete: (nodeId: string) => void;
    onPortMouseDown: (e: MouseEvent, nodeId: string, portName: string) => void;
    onPortMouseUp: (e: MouseEvent, nodeId: string, portName: string) => void;
}

export default function NodeView({
                                     node,
                                     selected,
                                     isBeingDragged,
                                     draggedPosition,
                                     onNodeDrag,
                                     onNodeClick,
                                     onDelete,
                                     onPortMouseDown,
                                     onPortMouseUp,
                                 }: NodeViewProps) {
    // Determine the position to render the node, accounting for dragging
    const pos = draggedPosition || node.pos;
    const style = {
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: nodeRect.w,
        height: nodeRect.h,
    };
    const inPorts = getNodeMetadata(node.kind).portLabels().in;
    const outPorts = getNodeMetadata(node.kind).portLabels().out;
    // Use a useCallback for memoization, preventing unnecessary re-renders
    const handleMouseDown = useCallback((e: MouseEvent) => {
        // Pass the node ID and the raw mouse event to the parent's handler
        onNodeDrag(node.id, e);
    }, [onNodeDrag, node.id]);

    const handleDeleteClick = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        onDelete(node.id);
    }, [onDelete, node.id]);

    return (
        <div
            className={cn(
                'absolute rounded-lg border-2 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md transition-shadow',
                selected && 'shadow-lg ring-2 ring-blue-500/50',
                isBeingDragged && 'z-50 cursor-grabbing'
            )}
            style={style}
            // Use onMouseDown for a custom drag interaction that aligns with the parent's logic
            onMouseDown={handleMouseDown}
            onClick={(e) => onNodeClick(node.id, e)}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center bg-gray-100 dark:bg-zinc-800 p-2 rounded-t-lg">
                    <span className="font-semibold text-sm truncate">{node.name}</span>
                    <button
                        onClick={handleDeleteClick}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <XCircle size={16} />
                    </button>
                </div>
                {/* Body */}
                <div className="p-2 text-sm flex-1 overflow-hidden">
                    <span className="text-gray-500 dark:text-gray-400">{node.kind} Node</span>
                </div>
                {/* IN Ports */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 flex -mt-2">
                    {inPorts.length > 0 && inPorts.map((portName, portIndex) => (
                        <div
                            key={portIndex}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                onPortMouseDown(e, node.id, portName);
                            }}
                            onMouseUp={(e) => {
                                e.stopPropagation();
                                onPortMouseUp(e, node.id, portName);
                            }}
                            className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white dark:bg-zinc-900 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                            {/* <span className="text-sm text-gray-500">{portName}</span> */}
                        </div>
                    ))}
                </div>
                {/* Out Ports */}
                <div className="absolute top-1/2 right-0 translate-x-1/2 flex -mt-2">
                    {outPorts.length > 0 && outPorts.map((portName, portIndex) => (
                        <div
                            key={portIndex}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                onPortMouseDown(e, node.id, portName);
                            }}
                            onMouseUp={(e) => {
                                e.stopPropagation();
                                onPortMouseUp(e, node.id, portName);
                            }}
                            className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white dark:bg-zinc-900 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                            {/* <span className="text-sm text-gray-500">{portName}</span> */}
                        </div>
                    ))}
                </div>
                {/* ?? */}
                {/*node.config.inPorts > 0 && <Separator className="my-2" />*/}
            </div>
        </div>
    );
}




