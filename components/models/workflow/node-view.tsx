// File: components/workflow/NodeView.tsx
'use client'

import React from 'react';
import { PortName, Vec2, AnyNode, NodeKind } from './types';
import { Trash2, Rocket, FileText, MessageSquare, Monitor, Table, ImageIcon, SearchIcon, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';

// Defines the component props for a single node view
interface NodeViewProps {
    node: AnyNode;
    selected: boolean;
    onNodeDrag: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string) => void;
    onPortMouseDown: (nodeId: string, port: PortName, e: React.MouseEvent) => void;
    onPortMouseUp: (nodeId: string, port: PortName, e: React.MouseEvent) => void;
}

const nodeIcons: Record<NodeKind, React.ElementType> = {
    "query": SearchIcon,
    "document": FileText,
    "session": MessageSquare,
    "text-generation": Rocket,
    "image-generation": ImageIcon,
    "action": Cog,
    "table": Table,
    "output-context": Monitor,
};

/**
 * A reusable component for displaying a single node on the workflow canvas.
 * @param props - The component props.
 * @returns A React component representing a node.
 */
export default function NodeView({
                                     node,
                                     selected,
                                     onNodeDrag,
                                     onDelete,
                                     onPortMouseDown,
                                     onPortMouseUp
                                 }: NodeViewProps) {
    const isTriggerNode = (kind: NodeKind) => ["query", "document", "session"].includes(kind);
    const isSinkNode = (kind: NodeKind) => ["table", "output-context"].includes(kind);
    const NodeIcon = nodeIcons[node.kind];

    return (
        <div
            className={cn(
                "absolute rounded-xl shadow-md border-2 transition-shadow duration-150 ease-in-out cursor-grab active:cursor-grabbing",
                "bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80",
                selected ? "border-blue-500 shadow-lg" : "border-gray-300 dark:border-zinc-700",
                "w-56 h-24 flex flex-col justify-between"
            )}
            style={{
                left: node.pos.x,
                top: node.pos.y,
            }}
            onMouseDown={(e) => onNodeDrag(node.id, e)}
        >
            {/* Input Port (on the left side) */}
            {!isTriggerNode(node.kind) && (
                <div
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors"
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => onPortMouseUp(node.id, 'in', e)}
                />
            )}

            {/* Node Header with name and delete button */}
            <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-zinc-700 bg-gray-100/50 dark:bg-zinc-900/50 rounded-t-lg">
                <span className="font-semibold text-sm flex items-center gap-2 truncate">
                    {NodeIcon && <NodeIcon className="h-4 w-4 text-gray-500 dark:text-zinc-400" />}
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

            {/* Output Ports (on the right side) */}
            {!isSinkNode(node.kind) && (
                <div className="flex absolute -right-2 top-1/2 -translate-y-1/2">
                    {isTriggerNode(node.kind) && (
                        <div
                            className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors"
                            onMouseDown={(e) => onPortMouseDown(node.id, 'out', e)}
                            onMouseUp={(e) => e.stopPropagation()}
                        />
                    )}
                    {node.kind === "action" && (
                        <div
                            className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors"
                            onMouseDown={(e) => onPortMouseDown(node.id, 'out', e)}
                            onMouseUp={(e) => e.stopPropagation()}
                        />
                    )}
                    {(node.kind === "text-generation" || node.kind === "image-generation") && (
                        <div className="flex flex-col gap-2">
                            <div
                                className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors"
                                onMouseDown={(e) => onPortMouseDown(node.id, 'out-1', e)}
                                onMouseUp={(e) => e.stopPropagation()}
                            />
                            <div
                                className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors"
                                onMouseDown={(e) => onPortMouseDown(node.id, 'out-2', e)}
                                onMouseUp={(e) => e.stopPropagation()}
                            />
                            <div
                                className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 cursor-crosshair hover:bg-blue-500 transition-colors"
                                onMouseDown={(e) => onPortMouseDown(node.id, 'out-3', e)}
                                onMouseUp={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
