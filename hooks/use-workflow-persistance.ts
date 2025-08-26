import { useState } from 'react';
import { Workflow as WorkflowType } from '@/components/models/workflow/types';
import {toast} from "sonner";

interface WorkflowPersistence {
    savedWorkflow: WorkflowType | null;
    handleCommit: (workflow: WorkflowType) => void;
    handleLoad: () => WorkflowType | null;
}

export const useWorkflowPersistence = (): WorkflowPersistence => {
    const [savedWorkflow, setSavedWorkflow] = useState<WorkflowType | null>(null);

    const handleCommit = (workflow: WorkflowType) => {
        setSavedWorkflow(workflow);
        console.log("Workflow saved by host application:", workflow);
        alert("Workflow saved! Check the console.");
    };

    const handleLoad = () => {
        // If no workflow is saved, return null
        if (savedWorkflow) {
            toast("Workflow loaded from state.");
            return savedWorkflow;
        } else {
            toast("No saved workflow found.");
            return null;
        }
    };

    return {
        savedWorkflow,
        handleCommit,
        handleLoad,
    };
};