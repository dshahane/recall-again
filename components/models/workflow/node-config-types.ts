import {
    PlaySquare, FileText, Bot, Rocket, Wand, MessageSquare, Table, LayoutDashboard, Database, Repeat,
    Split, Code, Timer, GitBranch, Lightbulb, AlarmClock, Columns4, SearchIcon, ImageIcon, Cog, Monitor
} from 'lucide-react';
import React from "react";
import { NodeKind, PortName, } from './types';
import { Vec2 } from '@/app/types/app'

interface NodeMeta {
    icon: React.ElementType;
    color: string;
    portPositions?: (w: number, h: number) => Record<string, Vec2>;
    portLabels?: (port: PortName) => string;
}

// Map each NodeKind to its properties
export const NODE_METADATA: Record<NodeKind, NodeMeta> = {
    "query": {
        icon: PlaySquare,
        color: 'bg-green-100 dark:bg-green-800',
        portPositions: (w, h) => ({'out': {x: w, y: h / 2}}),
        portLabels: () => "out"
    },
    "document": {
        icon: FileText,
        color: 'bg-green-100 dark:bg-green-800',
        portPositions: (w, h) => ({'out': {x: w, y: h / 2}}),
        portLabels: () => "out"
    },
    "session": {
        icon: MessageSquare,
        color: 'bg-green-100 dark:bg-green-800',
        portPositions: (w, h) => ({'out': {x: w, y: h / 2}}),
        portLabels: () => "out"
    },
    "timer": {
        icon: AlarmClock,
        color: 'bg-green-100 dark:bg-green-800',
        portPositions: (w, h) => ({'out': {x: w, y: h / 2}}),
        portLabels: () => "out"
    },
    "llm": {
        icon: Bot,
        color: 'bg-purple-100 dark:bg-purple-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "output"
    },
    "classifier": {
        icon: Bot,
        color: 'bg-purple-100 dark:bg-purple-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "regressor": {
        icon: Bot,
        color: 'bg-purple-100 dark:bg-purple-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "ranker": {
        icon: Bot,
        color: 'bg-purple-100 dark:bg-purple-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "intent-detection": {
        icon: Bot,
        color: 'bg-purple-100 dark:bg-purple-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "context": {
        icon: Bot,
        color: 'bg-purple-100 dark:bg-purple-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "condition": {
        icon: Split,
        color: 'bg-orange-100 dark:bg-orange-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'true': {x: w, y: h / 3}, 'false': {x: w, y: h / 3 * 2}}),
        portLabels: (p) => p === "true" ? "true" : p === "false" ? "false" : "in"
    },
    "loop": {
        icon: Split,
        color: 'bg-orange-100 dark:bg-orange-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'true': {x: w, y: h / 3}, 'false': {x: w, y: h / 3 * 2}}),
        portLabels: (p) => p === "true" ? "true" : p === "false" ? "false" : "in"
    },
    "trycatch": {
        icon: Split,
        color: 'bg-orange-100 dark:bg-orange-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'true': {x: w, y: h / 3}, 'false': {x: w, y: h / 3 * 2}}),
        portLabels: (p) => p === "true" ? "true" : p === "false" ? "false" : "in"
    },
    "delay": {
        icon: Split,
        color: 'bg-orange-100 dark:bg-orange-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'true': {x: w, y: h / 3}, 'false': {x: w, y: h / 3 * 2}}),
        portLabels: (p) => p === "true" ? "true" : p === "false" ? "false" : "in"
    },
    "variables": {
        icon: Rocket,
        color: 'bg-purple-100 dark:bg-purple-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "api": {
        icon: Bot,
        color: 'bg-purple-100 dark:bg-purple-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "table": {
        icon: Wand,
        color: 'bg-blue-100 dark:bg-blue-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "transformed"
    },
    "transformation": {
        icon: Wand,
        color: 'bg-blue-100 dark:bg-blue-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "transformed"
    },
    "catalog": {
        icon: Columns4,
        color: 'bg-blue-100 dark:bg-blue-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "reviews": {
        icon: Columns4,
        color: 'bg-blue-100 dark:bg-blue-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "sql": {
        icon: Columns4,
        color: 'bg-blue-100 dark:bg-blue-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "sparql": {
        icon: Columns4,
        color: 'bg-blue-100 dark:bg-blue-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "sheet": {
        icon: Columns4,
        color: 'bg-blue-100 dark:bg-blue-800',
        portPositions: (w, h) => ({'in': {x: 0, y: h / 2}, 'out': {x: w, y: h / 2}}),
        portLabels: (p) => p === "in" ? "in" : "out"
    },
    "context-out": {
        icon: AlarmClock,
        color: 'bg-green-100 dark:bg-green-800',
        portPositions: (w, h) => ({'int': {x: w, y: h / 2}}),
        portLabels: () => "in"
    },
    "api-out": {
        icon: AlarmClock,
        color: 'bg-green-100 dark:bg-green-800',
        portPositions: (w, h) => ({'int': {x: w, y: h / 2}}),
        portLabels: () => "in"
    },
    "visualization": {
        icon: AlarmClock,
        color: 'bg-green-100 dark:bg-green-800',
        portPositions: (w, h) => ({'int': {x: w, y: h / 2}}),
        portLabels: () => "in"
    },
};

export const getNodeMetadata = (kind: NodeKind) => {
    return NODE_METADATA[kind] || { icon: null, color: 'bg-gray-100', portPositions: () => ({}), portLabels: () => "" };
};

export const isTriggerNode = (kind: NodeKind): boolean => {
    return ["query", "document", "session", "timer"].includes(kind);
};

export const isSinkNode = (kind: NodeKind): boolean => {
    return ["table-out", "context-out", "visualization", "variables"].includes(kind);
};