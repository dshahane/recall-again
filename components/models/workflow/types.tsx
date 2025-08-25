// File: components/workflow/types.ts
// Defines the core types and utility functions for the workflow builder.

export type Vec2 = { x: number; y: number; };

export type NodeKind = "query" | "document" | "session" | "text-generation" | "image-generation" | "action" | "table" | "output-context";
export type PortName = "in" | "out" | "out-1" | "out-2" | "out-3";

// Base node structure
export type Node = {
    id: string;
    kind: NodeKind;
    name: string;
    pos: Vec2;
    config: any;
};

// Specific node types for type safety
export type QueryNode = Node & { kind: "query"; };
export type DocumentNode = Node & { kind: "document"; };
export type SessionNode = Node & { kind: "session"; };
export type TextGenerationNode = Node & { kind: "text-generation"; };
export type ImageGenerationNode = Node & { kind: "image-generation"; };
export type ActionNode = Node & { kind: "action"; };
export type TableNode = Node & { kind: "table"; };
export type OutputContextNode = Node & { kind: "output-context"; };

export type AnyNode = QueryNode | DocumentNode | SessionNode | TextGenerationNode | ImageGenerationNode | ActionNode | TableNode | OutputContextNode;

export type Edge = {
    id: string;
    from: { nodeId: string; port: PortName; };
    to: { nodeId: string; };
    c1?: Vec2;
    c2?: Vec2;
};

export type Workflow = {
    startId?: string;
    nodes: AnyNode[];
    edges: Edge[];
};

/**
 * Utility function to create a new node with default configuration.
 * @param node - The partial node object to complete.
 * @returns A complete node object.
 */
export const completeNode = (node: Partial<Node>): AnyNode => {
    switch (node.kind) {
        case "query":
            return { ...node, kind: "query", name: node.name || "Query", config: { text: "What is a workflow?" } } as QueryNode;
        case "document":
            return { ...node, kind: "document", name: node.name || "Document", config: { content: "A workflow is a series of steps." } } as DocumentNode;
        case "session":
            return { ...node, kind: "session", name: node.name || "Session", config: { history: [] } } as SessionNode;
        case "text-generation":
            return { ...node, kind: "text-generation", name: node.name || "Text Gen", config: { prompt: "" } } as TextGenerationNode;
        case "image-generation":
            return { ...node, kind: "image-generation", name: node.name || "Image Gen", config: { prompt: "" } } as ImageGenerationNode;
        case "action":
            return { ...node, kind: "action", name: node.name || "Action", config: { code: "console.log('Hello');" } } as ActionNode;
        case "table":
            return { ...node, kind: "table", name: node.name || "Table", config: { name: "", columns: [] } } as TableNode;
        case "output-context":
            return { ...node, kind: "output-context", name: node.name || "Output Context", config: { key: "output" } } as OutputContextNode;
        default:
            return { ...node, kind: "action", name: node.name || "New Node", config: {} } as ActionNode;
    }
};

/**
 * Creates an initial starter workflow with a single Query node.
 * @returns A new starter workflow object.
 */
export const createStarterWorkflow = (): Workflow => {
    const startNodeId = "start-node";
    const startNode = completeNode({
        id: startNodeId,
        kind: "query",
        name: "Start",
        pos: { x: 300, y: 100 },
    });
    return {
        startId: startNodeId,
        nodes: [startNode],
        edges: [],
    };
};

/**
 * Snaps a number to the nearest grid increment.
 * @param n - The number to snap.
 * @returns The snapped number.
 */
export const snap = (n: number) => Math.round(n / 20) * 20;

/**
 * Calculates the relative positions of ports for a given node kind.
 * The positions are now on the left and right sides.
 * @param w - The node width.
 * @param h - The node height.
 * @param kind - The node kind.
 * @returns A record of port names to their relative positions.
 */
export const portPositions = (w: number, h: number, kind: NodeKind): Record<PortName, Vec2> => {
    const commonPorts = {
        in: { x: 0, y: h / 2 },
        out: { x: w, y: h / 2 },
    };

    switch (kind) {
        // Trigger nodes only have an output port
        case "query":
        case "document":
        case "session":
            return {
                out: commonPorts.out,
            } as Record<PortName, Vec2>;

        // Sink nodes only have an input port
        case "table":
        case "output-context":
            return {
                in: commonPorts.in,
            } as Record<PortName, Vec2>;

        // Generation nodes have multiple output ports
        case "text-generation":
        case "image-generation":
            const out1_y = h * 0.25;
            const out2_y = h * 0.5;
            const out3_y = h * 0.75;
            return {
                in: commonPorts.in,
                "out-1": { x: w, y: out1_y },
                "out-2": { x: w, y: out2_y },
                "out-3": { x: w, y: out3_y },
            };

        // All other nodes have a single input and output
        case "action":
        default:
            return commonPorts;
    }
};
