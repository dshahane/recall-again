'use client'

import React from 'react';
import { PortName, AnyNode, NodeKind } from './types';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {getNodeMetadata} from "@/components/models/workflow/node-config-types";
import {getPortPositions} from "@/components/models/workflow/port-config-types";
import {Vec2} from "@/app/types/app";

interface NodeViewProps {
    node: AnyNode;
    selected: boolean;
    isBeingDragged: boolean
    draggedPosition: Vec2,
    onNodeDrag: (id: string, e: React.MouseEvent) => void;
    onNodeClick: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string) => void;
    onPortMouseDown: (nodeId: string, port: PortName, e: React.MouseEvent) => void;
    onPortMouseUp: (nodeId: string, port: PortName, e: React.MouseEvent) => void;
}

const nodeRect = { w: 224, h: 96 };

export default function NodeView({
                                     node,
                                     selected,
                                     isBeingDragged,
                                     draggedPosition,
                                     onNodeDrag,
                                     onNodeClick,
                                     onDelete,
                                     onPortMouseDown,
                                     onPortMouseUp
                                 }: NodeViewProps) {
    const nodeMeta = getNodeMetadata(node.kind);
    const NodeIcon = nodeMeta?.icon;
    const ports = getPortPositions(nodeRect.w, nodeRect.h, nodeMeta?.portConfig) || {};
    // Determine the position to render: dragged position or stored position
    const position = isBeingDragged ? draggedPosition : node.pos;

    return (
        <div
            className={cn(
                "absolute rounded-xl shadow-md border-2 transition-shadow duration-150 ease-in-out cursor-grab active:cursor-grabbing",
                "bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80",
                nodeMeta?.color,
                selected ? "border-blue-500 shadow-lg" : "border-gray-300 dark:border-zinc-700",
                "w-56 h-24 flex flex-col justify-between"
            )}
            style={{
                left: position.x,
                top: position.y,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onNodeDrag(node.id, e);
            }}
            onClick={(e) => onNodeClick(node.id, e)}
        >
            {/* Node Header with name and delete button */}
            <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-zinc-700 bg-gray-100/50 dark:bg-zinc-900/50 rounded-t-lg">
                <span className="font-semibold text-sm flex items-center gap-2 truncate">
                    {NodeIcon && React.createElement(NodeIcon, { className: "h-4 w-4 text-gray-500 dark:text-zinc-400" })}
                    {node.name}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(node.id);
                    }}
                    className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    aria-label="Delete Node"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Node Body with kind info */}
            <div className="p-2 text-center flex-1 flex items-center justify-center">
                <span className="text-xs text-gray-500 dark:text-zinc-400 font-mono">{node.kind}</span>
            </div>

            {/* Dynamically Render All Ports */}
            {Object.entries(ports).map(([portName, pos]) => (
                <div
                    key={portName}
                    className={cn(
                        "absolute w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors",
                        // Use the port's x position to determine left or right placement
                        pos.x === 0 ? '-left-2' : '-right-2'
                    )}
                    style={{
                        top: pos.y,
                        // Center the port relative to the node
                        transform: 'translateY(-50%)'
                    }}
                    onMouseDown={(e) => onPortMouseDown(node.id, portName as PortName, e)}
                    onMouseUp={(e) => onPortMouseUp(node.id, portName as PortName, e)}
                />
            ))}
        </div>
    );
}