'use client'

import React from 'react';
import { Edge } from './types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

// Defines the props for the EdgeConfig component
interface EdgeConfigProps {
    edge: Edge;
    onDelete: (id: string) => void;
}

/**
 * A component to configure a selected edge.
 * @param props - The component props.
 * @returns A React component for edge configuration.
 */
export default function EdgeConfig({ edge, onDelete }: EdgeConfigProps) {
    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-inner bg-gray-200/50 dark:bg-zinc-800/50">
            <h3 className="font-bold text-lg">Edge Configuration</h3>

            <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                    From Port: <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">{edge.from.port}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                    From Node ID: <span className="font-mono text-xs">{edge.from.nodeId.substring(0, 8)}...</span>
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                    To Port: <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">{edge.to.port}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                    To Node ID: <span className="font-mono text-xs">{edge.to.nodeId.substring(0, 8)}...</span>
                </p>
            </div>

            <div className="flex justify-end mt-2">
                <Button variant="destructive" onClick={() => onDelete(edge.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Edge
                </Button>
            </div>
        </div>
    );
}