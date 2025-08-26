// File: components/workflow/workflow-utils.ts
import { v4 as uuidv4 } from "uuid";
import { Vec2 } from '@/app/types/app';
import { AnyNode, NodeKind, nodeRect } from './types';
import { NODE_METADATA } from './node-config-types';

export const completeNode = (incompleteNode: any): AnyNode => {
    return {
        ...incompleteNode,
        config: incompleteNode.config || {},
    };
};

export const createStarterWorkflow = () => {
    const startNode = completeNode({
        id: uuidv4(),
        kind: 'query' as NodeKind,
        name: 'Start',
        pos: { x: 50, y: 50 },
    });
    return {
        startId: startNode.id,
        nodes: [startNode],
        edges: [],
    };
};

export const nodePortPos = (n: AnyNode, port: string): Vec2 => {
    const metadata = NODE_METADATA[n.kind];
    const pp = metadata?.portPositions?.(nodeRect.w, nodeRect.h)[port];
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

export const isTriggerNode = (kind: NodeKind): boolean => {
    return ["query", "document", "session", "timer"].includes(kind);
};

export const isSinkNode = (kind: NodeKind): boolean => {
    return ["table-out", "context-out", "visualization", "variables"].includes(kind);
};