'use client'

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {NodeKind, Workflow as WorkflowType} from '@/components/workflow-editor/workflow/types';
import NeoWorkflowEngine from './neo-workflow-engine';
import {useWorkflowPersistence} from "@/hooks/use-workflow-persistance";
import NeoWorkflowView from "@/components/workflow-editor/neo/neo-workflow-view";
import {WorkflowProvider} from "@/components/workflow-editor/context/workflow-context";

const initialWorkflowData: WorkflowType = {
    nodes: [{
        id: '1',
        kind: 'query' as NodeKind,
        name: 'Initial Query',
        pos: { x: 100, y: 100 },
        config: {}
    }],
    edges: []
};

export default function NeoWorkflowBuilder() {
    // Call the hook to get the persistence logic
    const { handleCommit, handleLoad } = useWorkflowPersistence();

    // Use the initial data as the default
    const [initialWorkflow] = useState(() => handleLoad() || initialWorkflowData );

    return (
        <div className="flex h-screen flex-col">
            <header className="p-4 bg-gray-200 dark:bg-zinc-800 flex justify-between items-center">
                <h1 className="text-xl font-bold">Should go to Settings</h1>
                <div className="space-x-2">
                    <Button onClick={handleLoad}>Load Context Workflow</Button>
                </div>
            </header>
            <main className="flex-1">
                <NeoWorkflowEngine
                    initialWorkflow={initialWorkflow}
                    onCommit={handleCommit}
                >
                    {/*(api) => <NeoWorkflowView api={api} mode={"standalone"} />*/}
                    {(api) => (
                        <WorkflowProvider api={api}>
                            <NeoWorkflowView mode={"standalone"}/>
                        </WorkflowProvider>
                    )}
                </NeoWorkflowEngine>
            </main>
        </div>
    );
}