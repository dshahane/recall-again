// File: components/workflow/EdgeConfig.tsx
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
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                    Connection from Node ID: <span className="font-mono text-xs">{edge.from.nodeId.substring(0, 8)}...</span>
                </p>
                <Button variant="destructive" onClick={() => onDelete(edge.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Edge
                </Button>
            </div>
        </div>
    );
}
