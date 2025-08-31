import { v4 as uuidv4 } from "uuid";
import { Vec2 } from '@/app/types/app';
import { AnyNode, NodeKind } from './types';
import {getPortPositions} from "@/components/workflow-editor/workflow/port-config-types";
import {getNodeMetadata} from "@/components/workflow-editor/workflow/node-config-types";
import {log} from "node:util";

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
    // 1. Get the node's metadata
    const metadata = getNodeMetadata(n.kind);
    // Safety check to ensure metadata exists
    if (!metadata) {
        return { x: n.pos.x, y: n.pos.y };
    }

    // 2. Pass the correct `portConfig` enum to get all ports
    const allPorts = getPortPositions(nodeRect.w, nodeRect.h, metadata.portConfig);

    // 3. Get the specific port's position from the result
    const pp = allPorts[port];

    if (!pp) {
        return { x: n.pos.x, y: n.pos.y };
    }
    // 4. Return the calculated position
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

export const nodeRect = { w: 224, h: 96 };