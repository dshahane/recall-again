'use client'

import { createContext, useContext, ReactNode } from 'react';

// Create a new context for the Workflow API
const WorkflowContext = createContext<any>(null);

// Create a custom hook to use the context
export const useWorkflow = () => {
    const api = useContext(WorkflowContext);
    if (!api) {
        // This check ensures the hook is used inside the WorkflowProvider
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return api;
};

// Create a provider component that will wrap the NeoWorkflowEngine
export const WorkflowProvider = ({ api, children }: { api: any, children: ReactNode }) => {
    return (
        <WorkflowContext.Provider value={api}>
            {children}
        </WorkflowContext.Provider>
    );
};