// File: components/workflow/types.ts
import { Vec2 } from '@/app/types/app'; // Or from a shared types file if you create one

export type NodeKind =
    | "query"
    | "document"
    | "session"
    | "timer"
    | "transformation"
    | "llm"
    | "classifier"
    | "regressor"
    | "ranker"
    | "intent-detection"
    | "context"
    | "loop"
    | "condition"
    | "trycatch"
    | "delay"
    | "variables"
    | "api"
    | "table"
    | "catalog"
    | "reviews"
    | "sql"
    | "sparql"
    | "sheet"
    | "context-out"
    | "api-out"
    | "visualization"
    ;

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
    to: { nodeId: string; port: PortName; };
    c1?: Vec2;
    c2?: Vec2;
}

export interface Workflow {
    startId?: string;
    nodes: AnyNode[];
    edges: Edge[];
}

// Node dimensions for consistent calculations
export const nodeRect = { w: 224, h: 96 };

export const snap = (x: number, y?: number): Vec2 | number => {
    const s = 10;
    if (y === undefined) {
        return Math.round(x / s) * s;
    }
    return { x: Math.round(x / s) * s, y: Math.round(y / s) * s };
};