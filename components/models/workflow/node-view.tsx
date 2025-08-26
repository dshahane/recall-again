'use client'

import React from 'react';
import { PortName, AnyNode, NodeKind, } from './types';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {getNodeMetadata} from "@/components/models/workflow/node-config-types";
import {getPortPositions} from "@/components/models/workflow/port-config-types";

interface NodeViewProps {
    node: AnyNode;
    selected: boolean;
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
                                     onNodeDrag,
                                     onNodeClick,
                                     onDelete,
                                     onPortMouseDown,
                                     onPortMouseUp
                                 }: NodeViewProps) {
    const nodeMeta = getNodeMetadata(node.kind);
    const NodeIcon = nodeMeta?.icon;
    const ports = getPortPositions(nodeRect.w, nodeRect.h, nodeMeta?.portConfig) || {};
    const hasInput = !!ports['in'];
    const hasOutputs = Object.keys(ports).length > 1;

    const isDualPortNode = (kind: NodeKind) => ["condition", "trycatch"].includes(kind);

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
                left: node.pos.x,
                top: node.pos.y,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onNodeDrag(node.id, e);
            }}
            onClick={(e) => onNodeClick(node.id, e)}
        >
            {/* Input Port */}
            {hasInput && (
                <div
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors"
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => onPortMouseUp(node.id, 'in', e)}
                />
            )}

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

            {/* Output Ports */}
            {hasOutputs && (
                <div className={cn("flex absolute -right-2 top-1/2 -translate-y-1/2", isDualPortNode(node.kind) ? "flex-col gap-2" : "")}>
                    {Object.keys(ports)
                        .filter(port => port !== 'in')
                        .map(port => (
                            <div
                                key={port}
                                className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors"
                                onMouseDown={(e) => onPortMouseDown(node.id, port as PortName, e)}
                                onMouseUp={(e) => e.stopPropagation()}
                                style={{
                                    top: isDualPortNode(node.kind) ? ports[port].y : '50%',
                                    position: isDualPortNode(node.kind) ? 'absolute' : 'relative',
                                    transform: isDualPortNode(node.kind) ? 'none' : 'translateY(-50%)'
                                }}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}