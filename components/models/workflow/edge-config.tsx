// File: components/workflow/edge-config.tsx
'use client'

import React, { FC } from 'react';
import { Edge } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface EdgeConfigProps {
    edge: Edge;
}

const EdgeConfig: FC<EdgeConfigProps> = ({ edge }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Edge Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                    <Label htmlFor="from-node">From Node ID</Label>
                    <p id="from-node" className="font-mono text-xs p-2 bg-gray-100 dark:bg-zinc-800 rounded">
                        {edge.from.nodeId}
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="from-port">From Port</Label>
                    <p id="from-port" className="font-mono text-xs p-2 bg-gray-100 dark:bg-zinc-800 rounded">
                        {edge.from.port}
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="to-node">To Node ID</Label>
                    <p id="to-node" className="font-mono text-xs p-2 bg-gray-100 dark:bg-zinc-800 rounded">
                        {edge.to.nodeId}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default EdgeConfig;