// pages/NeoContextBuilder.tsx (or a new component file)
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {NodeKind, Workflow as WorkflowType} from '@/components/models/workflow/types';
import NeoWorkflowEngine from './neo-workflow-engine';
import NeoWorkflowBuilder from './neo-workflow-builder';

export default function NeoContextBuilder() {
    const [savedWorkflow, setSavedWorkflow] = useState<WorkflowType | null>(null);

    const handleCommit = (workflow: WorkflowType) => {
        setSavedWorkflow(workflow);
        console.log("Workflow saved by host application:", workflow);
        alert("Workflow saved! Check the console.");
    };

    const handleLoad = () => {
        // You would load a previously saved workflow from your database or state here.
        if (savedWorkflow) {
            alert("Workflow loaded from state.");
        } else {
            alert("No saved workflow found.");
        }
    };

    const initialWorkflowData = {
        // This is an example of a workflow passed from the host application
        nodes: [{ id: '1', kind: 'query' as NodeKind, name: 'Initial Query', pos: { x: 100, y: 100 }, config: {}}],
        edges: []
    };


    return (
        <div className="flex h-screen flex-col">
            <header className="p-4 bg-gray-200 dark:bg-zinc-800 flex justify-between items-center">
                <h1 className="text-xl font-bold">Neo Context Engineering</h1>
                <div className="space-x-2">
                    <Button onClick={handleLoad}>Load Context Workflow</Button>
                </div>
            </header>
            <main className="flex-1">
                <NeoWorkflowEngine
                    initialWorkflow={initialWorkflowData}
                    onCommit={handleCommit}
                >
                    {(api) => <NeoWorkflowBuilder api={api} mode={"embedded"} />}
                </NeoWorkflowEngine>
            </main>
        </div>
    );
}