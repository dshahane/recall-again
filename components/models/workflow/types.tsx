// File: components/workflow/types.ts
import { PlaySquare, FileText, Bot, List, Rocket, Wand, MessageSquare, Plus, Minus, Table, LayoutDashboard, Database, Repeat, Split, Code, Timer, GitBranch, Lightbulb } from 'lucide-react';

export type NodeKind =
    | "query"
    | "document"
    | "session"
    | "transformation"
    | "llm"
    | "classifier"
    | "regressor"
    | "ranker"
    | "intent-detection"
    | "context"
    | "table"
    | "visualization"
    | "context-out"
    | "loop"
    | "condition"
    | "api"
    | "trycatch"
    | "delay"
    | "variables"
    | "text-generation"; // Add this kind

// ...


export interface Vec2 {
    x: number;
    y: number;
}

export type AnyNode = {
    id: string;
    kind: NodeKind;
    name: string;
    pos: Vec2;
    config?: any;
};

export type PortName = "in" | "out" | "true" | "false" | "try" | "catch" | "out1" | "out2" | "out3";

export interface Edge {
    id: string;
    from: { nodeId: string; port: PortName; };
    to: { nodeId: string; };
    c1?: Vec2;
    c2?: Vec2;
}

export interface Workflow {
    startId?: string;
    nodes: AnyNode[];
    edges: Edge[];
}

// Node dimensions for consistent calculations
const nodeRect = { w: 224, h: 96 };

export const PALETTE_DATA = [
    {
        label: "Triggers",
        items: [
            { label: "Query", kind: "query", icon: <PlaySquare className="w-4 h-4" /> },
            { label: "Document", kind: "document", icon: <FileText className="w-4 h-4" /> },
            { label: "Session", kind: "session", icon: <MessageSquare className="w-4 h-4" /> },
        ]
    },
    {
        label: "Models",
        items: [
            { label: "LLM", kind: "llm", icon: <Bot className="w-4 h-4" /> },
            { label: "Classifier", kind: "classifier", icon: <Bot className="w-4 h-4" /> },
            { label: "Regressor", kind: "regressor", icon: <Bot className="w-4 h-4" /> },
            { label: "Ranker", kind: "ranker", icon: <Bot className="w-4 h-4" /> },
            { label: "Intent Detection", kind: "intent-detection", icon: <Lightbulb className="w-4 h-4" /> },
        ]
    },
    {
        label: "Tools",
        items: [
            { label: "API", kind: "api", icon: <Rocket className="w-4 h-4" /> },
            { label: "Transformation", kind: "transformation", icon: <Wand className="w-4 h-4" /> },
            { label: "Context", kind: "context", icon: <Database className="w-4 h-4" /> },
            { label: "Table", kind: "table", icon: <Table className="w-4 h-4" /> },
        ]
    },
    {
        label: "Sinks",
        items: [
            { label: "Context Out", kind: "context-out", icon: <Database className="w-4 h-4" /> },
            { label: "Visualization", kind: "visualization", icon: <LayoutDashboard className="w-4 h-4" /> },
            { label: "Variables", kind: "variables", icon: <Code className="w-4 h-4" /> },
        ]
    },
    {
        label: "Flow Control",
        items: [
            { label: "Loop", kind: "loop", icon: <Repeat className="w-4 h-4" /> },
            { label: "Condition", kind: "condition", icon: <Split className="w-4 h-4" /> },
            { label: "Try/Catch", kind: "trycatch", icon: <GitBranch className="w-4 h-4" /> },
            { label: "Delay", kind: "delay", icon: <Timer className="w-4 h-4" /> },
        ]
    },
];

export const nodeColor = (kind: NodeKind) => {
    switch (kind) {
        case 'query':
        case 'document':
        case 'session':
            return 'bg-green-100 dark:bg-green-800';
        case 'llm':
        case 'classifier':
        case 'regressor':
        case 'ranker':
        case 'intent-detection':
            return 'bg-purple-100 dark:bg-purple-800';
        case 'transformation':
        case 'api':
        case 'context':
        case 'table':
            return 'bg-blue-100 dark:bg-blue-800';
        case 'context-out':
        case 'visualization':
        case 'variables':
            return 'bg-yellow-100 dark:bg-yellow-800';
        case 'loop':
        case 'condition':
        case 'trycatch':
        case 'delay':
            return 'bg-orange-100 dark:bg-orange-800';
        default:
            return 'bg-gray-100 dark:bg-gray-800';
    }
};

export const nodeIcon = (kind: NodeKind) => {
    switch (kind) {
        case 'query':
            return <PlaySquare className="w-5 h-5" />;
        case 'document':
            return <FileText className="w-5 h-5" />;
        case 'session':
            return <MessageSquare className="w-5 h-5" />;
        case 'llm':
            return <Bot className="w-5 h-5" />;
        case 'classifier':
            return <Bot className="w-5 h-5" />;
        case 'regressor':
            return <Bot className="w-5 h-5" />;
        case 'ranker':
            return <Bot className="w-5 h-5" />;
        case 'intent-detection':
            return <Lightbulb className="w-5 h-5" />;
        case 'transformation':
            return <Wand className="w-5 h-5" />;
        case 'context':
            return <Database className="w-5 h-5" />;
        case 'table':
            return <Table className="w-5 h-5" />;
        case 'visualization':
            return <LayoutDashboard className="w-5 h-5" />;
        case 'context-out':
            return <Database className="w-5 h-5" />;
        case 'loop':
            return <Repeat className="w-5 h-5" />;
        case 'condition':
            return <Split className="w-5 h-5" />;
        case 'api':
            return <Rocket className="w-5 h-5" />;
        case 'trycatch':
            return <GitBranch className="w-5 h-5" />;
        case 'delay':
            return <Timer className="w-5 h-5" />;
        case 'variables':
            return <Code className="w-5 h-5" />;
        default:
            return null;
    }
};

export const portLabel = (kind: NodeKind, port: PortName) => {
    if (kind === 'llm' && port === 'out') return 'output';
    if (kind === 'api' && port === 'out') return 'response';
    if (kind === 'transformation' && port === 'out') return 'transformed';
    if (kind === 'condition' && port === 'true') return 'true';
    if (kind === 'condition' && port === 'false') return 'false';
    if (kind === 'trycatch' && port === 'try') return 'try';
    if (kind === 'trycatch' && port === 'catch') return 'catch';
    if (port === 'in') return 'in';
    return port;
};

// Helper function to identify sink nodes
// Update the isSinkNode function
export const isSinkNode = (kind: NodeKind): boolean => {
    return ["table", "context-out", "visualization", "variables"].includes(kind);
};

// Update the portPositions function to handle "text-generation"
export const portPositions = (w: number, h: number, kind: NodeKind): Record<string, Vec2> => {
    const ports: { [key: string]: Vec2 } = {};

    if (isSinkNode(kind)) {
        ports['in'] = { x: 0, y: h / 2 };
        return ports;
    }

    ports['in'] = { x: 0, y: h / 2 };

    if (['query', 'document', 'session', 'api', 'llm', 'classifier', 'regressor', 'ranker', 'intent-detection', 'transformation', 'context', 'text-generation', 'loop'].includes(kind)) {
        ports['out'] = { x: w, y: h / 2 };
    }
    if (kind === 'condition') {
        ports['true'] = { x: w, y: h / 3 };
        ports['false'] = { x: w, y: h / 3 * 2 };
    }
    if (kind === 'trycatch') {
        ports['try'] = { x: w, y: h / 3 };
        ports['catch'] = { x: w, y: h / 3 * 2 };
    }
    return ports;
};


export const createStarterWorkflow = (): Workflow => {
    const startNode = completeNode({
        id: 'start-node',
        kind: 'query',
        name: 'Start',
        pos: { x: 50, y: 50 },
    });
    return {
        startId: startNode.id,
        nodes: [startNode],
        edges: [],
    };
};

export const completeNode = (incompleteNode: any): AnyNode => {
    return {
        ...incompleteNode,
        config: incompleteNode.config || {}
    };
};

export const isTriggerNode = (kind: NodeKind): boolean => {
    return ["query", "document", "session"].includes(kind);
};

export const nodePortPos = (n: AnyNode, port: string): Vec2 => {
    const pp = portPositions(nodeRect.w, nodeRect.h, n.kind)[port];
    if (!pp) {
        return { x: n.pos.x, y: n.pos.y };
    }
    return { x: n.pos.x + pp.x, y: n.pos.y + pp.y };
};

export const defaultBezierPoints = (from: Vec2, to: Vec2): { c1: Vec2; c2: Vec2 } => {
    const c1Offset = Math.min(Math.abs(from.x - to.x) / 3, 50);
    return {
        c1: { x: from.x + c1Offset, y: from.y },
        c2: { x: to.x - c1Offset, y: to.y }
    };
};

export const snap = (x: number, y?: number): Vec2 | number => {
    const s = 10;
    if (y === undefined) {
        return Math.round(x / s) * s;
    }
    return { x: Math.round(x / s) * s, y: Math.round(y / s) * s };
};