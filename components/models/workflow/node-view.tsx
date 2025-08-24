// File: components/workflow/NodeView.tsx
'use client'

import React, { FC, useState } from 'react';
import { MinusCircle } from 'lucide-react';
import {
    AnyNode,
    nodeColor,
    nodeIcon,
    portPositions,
    PortName,
    portLabel,
} from './types';

interface NodeViewProps {
    node: AnyNode;
    selected: boolean;
    onNodeDrag: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string) => void;
    onPortMouseDown: (nodeId: string, port: PortName, e: React.MouseEvent) => void;
    onPortMouseUp: (nodeId: string, port: PortName, e: React.MouseEvent) => void;
}

const NodeView: FC<NodeViewProps> = ({ node, selected, onNodeDrag, onDelete, onPortMouseDown, onPortMouseUp }) => {
    const color = nodeColor(node.kind);
    const rect = { w: 220, h: 84 };
    const ports = portPositions(rect.w, rect.h, node.kind);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('.ports, button')) {
            return;
        }
        e.stopPropagation();
        onNodeDrag(node.id, e);
    };

    return (
        <div
            className={`absolute rounded-xl shadow-lg transition-all duration-100 ease-in-out cursor-grab active:cursor-grabbing ${color} ${selected ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
            style={{
                top: `${node.pos.y}px`,
                left: `${node.pos.x}px`,
                width: `${rect.w}px`,
                height: `${rect.h}px`,
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                        {nodeIcon(node.kind)} {node.name}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(node.id);
                        }}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <MinusCircle className="w-4 h-4 text-zinc-900 dark:text-zinc-50" />
                    </button>
                </div>
                <div className="flex-1 p-3 text-sm text-gray-500 dark:text-zinc-400 overflow-hidden text-ellipsis">
                    {node.kind}
                </div>
            </div>

            <div className="ports absolute inset-0 z-10 pointer-events-none">
                <div
                    className="port-in absolute w-4 h-4 -left-2 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-zinc-700 rounded-full cursor-pointer pointer-events-auto ring-2 ring-gray-300 dark:ring-zinc-900 transition-colors hover:bg-gray-400 dark:hover:bg-zinc-50"
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onPortMouseDown(node.id, 'in', e); }}
                    onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); onPortMouseUp(node.id, 'in', e); }}
                />
                {Object.entries(ports).map(([port, pos]) => (
                    <div
                        key={port}
                        className="port-out absolute w-4 h-4 bg-gray-200 dark:bg-zinc-700 rounded-full cursor-pointer pointer-events-auto ring-2 ring-gray-300 dark:ring-zinc-900 transition-colors hover:bg-gray-400 dark:hover:bg-zinc-50"
                        style={{ left: `${pos.x - 8}px`, top: `${pos.y - 8}px` }}
                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onPortMouseDown(node.id, port as PortName, e); }}
                        onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); onPortMouseUp(node.id, port as PortName, e); }}
                    >
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                            {portLabel(node.kind, port as PortName)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NodeView;