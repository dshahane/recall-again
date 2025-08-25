// File: components/workflow/workflowManager.ts
import { AnyNode, Edge, Workflow as WorkflowType } from './types';

// Helper function to check for trigger nodes, you can move this here too
export const isTriggerNode = (kind: AnyNode['kind']): boolean => {
    return ["query", "document", "session"].includes(kind);
};

// Pure function to delete a node and its connected edges
export const deleteNode = (wf: WorkflowType, id: string): WorkflowType => ({
    ...wf,
    nodes: wf.nodes.filter(n => n.id !== id),
    edges: wf.edges.filter(e => e.from.nodeId !== id && e.to.nodeId !== id),
    startId: wf.startId === id ? undefined : wf.startId,
});

// Pure function to delete a single edge
export const deleteEdge = (wf: WorkflowType, id: string): WorkflowType => ({
    ...wf,
    edges: wf.edges.filter(e => e.id !== id),
});

// Pure function to update a node's configuration
export const updateNodeConfig = (wf: WorkflowType, id: string, newConfig: any): WorkflowType => ({
    ...wf,
    nodes: wf.nodes.map(n => (n.id === id ? { ...n, config: newConfig } : n)),
});

// Pure function to update a node's name
export const updateNodeName = (wf: WorkflowType, id: string, newName: string): WorkflowType => ({
    ...wf,
    nodes: wf.nodes.map(n => (n.id === id ? { ...n, name: newName } : n)),
});