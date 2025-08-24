// File: components/workflow/types.ts

import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
    Bot,
    GitBranch,
    BarChart3,
    User,
    FileText,
    FileQuestion,
    Lightbulb,
    SortAsc,
    Braces,
    Repeat,
    AlertTriangle,
    List,
    Spline,
    Link2,
    Table,
    CircleDot
} from 'lucide-react';

// ----------------------------- Types -----------------------------

export type PortName = "out" | "in" | "true" | "false" | "catch" | "body";

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
    | "variables";

export type Vec2 = { x: number; y: number };

export type Edge = {
    id: string;
    from: { nodeId: string; port: PortName };
    to: { nodeId: string };
};

export type BaseNode = {
    id: string;
    kind: NodeKind;
    name: string;
    pos: Vec2;
};

export type APINode = BaseNode & {
    kind: "api";
    config: { method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; url: string; headers: Record<string, string>; body: string; saveAs: string; asJSON: boolean; };
};
export type LLMNode = BaseNode & { kind: "llm"; config: { provider: string; model: string; prompt: string; system?: string; temperature: number; saveAs: string; }; };
export type ConditionNode = BaseNode & { kind: "condition"; config: { expression: string; }; };
export type LoopNode = BaseNode & { kind: "loop"; config: { mode: string; times?: number; listExpr?: string; whileExpr?: string; iterName: string; maxIterations?: number; }; };
export type TryCatchNode = BaseNode & { kind: "trycatch"; config: { note?: string }; };
export type DelayNode = BaseNode & { kind: "delay"; config: { ms: number }; };
export type VariablesNode = BaseNode & { kind: "variables"; config: { json: string }; };

export type AnyNode = APINode | LLMNode | ConditionNode | LoopNode | TryCatchNode | DelayNode | VariablesNode | BaseNode;

export type Workflow = {
    nodes: AnyNode[];
    edges: Edge[];
    startId?: string;
    meta?: { name: string; description?: string };
};

// ----------------------------- Utility Functions -----------------------------

export function HourglassIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 2h12M6 22h12M7 2v5a5 5 0 0 0 10 0V2M17 22v-5a5 5 0 0 0-10 0v5" />
        </svg>
    );
}

// ----------------------------- Palette Data -----------------------------

export interface PaletteNode {
    kind: NodeKind;
    label: string;
    icon: React.ReactNode;
    tip: string;
}

export interface PaletteCategory {
    title: string;
    nodes: PaletteNode[];
}

export const PALETTE_DATA: PaletteCategory[] = [
    {
        title: "Triggers",
        nodes: [
            { kind: "query", label: "Query", icon: <FileQuestion className="w-4 h-4" />, tip: "Starts workflow with a user query." },
            { kind: "document", label: "Document", icon: <FileText className="w-4 h-4" />, tip: "Starts workflow with a document upload." },
            { kind: "session", label: "Session", icon: <User className="w-4 h-4" />, tip: "Starts workflow from a live session." },
        ],
    },
    {
        title: "Activities",
        nodes: [
            { kind: "llm", label: "LLM", icon: <Bot className="w-4 h-4" />, tip: "Call a Large Language Model." },
            { kind: "transformation", label: "Transformation", icon: <Spline className="w-4 h-4" />, tip: "Transform data from one format to another." },
            { kind: "classifier", label: "Classifier", icon: <GitBranch className="w-4 h-4" />, tip: "Categorize input data." },
            { kind: "regressor", label: "Regressor", icon: <BarChart3 className="w-4 h-4" />, tip: "Predict a numerical value." },
            { kind: "ranker", label: "Ranker", icon: <SortAsc className="w-4 h-4" />, tip: "Order items by relevance or score." },
            { kind: "intent-detection", label: "Intent Detection", icon: <Lightbulb className="w-4 h-4" />, tip: "Detect the user's intent." },
            { kind: "context", label: "Context", icon: <Braces className="w-4 h-4" />, tip: "Save data to the workflow context." },
        ],
    },
    {
        title: "Control Flow",
        nodes: [
            { kind: "condition", label: "Condition", icon: <GitBranch className="w-4 h-4" />, tip: "Branch based on a boolean expression." },
            { kind: "loop", label: "Loop", icon: <Repeat className="w-4 h-4" />, tip: "Repeat a sequence of actions." },
            { kind: "trycatch", label: "Try/Catch", icon: <AlertTriangle className="w-4 h-4" />, tip: "Handle potential errors." },
            { kind: "delay", label: "Delay", icon: <HourglassIcon />, tip: "Pause execution for a set duration." },
        ],
    },
    {
        title: "Sink",
        nodes: [
            { kind: "table", label: "Table", icon: <Table className="w-4 h-4" />, tip: "Display data in a tabular format." },
            { kind: "visualization", label: "Visualization", icon: <BarChart3 className="w-4 h-4" />, tip: "Output a data visualization." },
            { kind: "context-out", label: "Context Out", icon: <List className="w-4 h-4" />, tip: "Finalize workflow with a context output." },
        ],
    },
];

export function completeNode(base: BaseNode): AnyNode {
    switch (base.kind) {
        case "api":
            return { ...base, kind: "api", config: { method: "GET", url: "", headers: {}, body: "", saveAs: "response", asJSON: true } };
        case "llm":
            return { ...base, kind: "llm", config: { provider: "openai", model: "gpt-4o", prompt: "Hello world", temperature: 0.7, saveAs: "llm_output" } };
        case "condition":
            return { ...base, kind: "condition", config: { expression: "true" } };
        case "loop":
            return { ...base, kind: "loop", config: { mode: "times", times: 3, iterName: "i" } };
        case "trycatch":
            return { ...base, kind: "trycatch", config: {} };
        case "delay":
            return { ...base, kind: "delay", config: { ms: 1000 } };
        case "variables":
            return { ...base, kind: "variables", config: { json: "{}" } };
        default:
            return base; // Corrected: Return base node without an implicit 'any' config
    }
}

export function createStarterWorkflow(): Workflow {
    return {
        nodes: [],
        edges: [],
        meta: { name: "New Workflow" },
    };
}

export function snap(n: number, grid = 8) {
    return Math.round(n / grid) * grid;
}

export function portPositions(width: number, height: number, kind: NodeKind) {
    const cy = height / 2;
    const ports: { [K in PortName]?: Vec2 } = { out: { x: width, y: cy } };
    if (kind === "condition") {
        ports.true = { x: width, y: height * 0.25 };
        ports.false = { x: width, y: height * 0.75 };
    }
    if (kind === "trycatch") {
        ports.body = { x: width, y: height * 0.25 };
        ports.catch = { x: width, y: height * 0.75 };
    }
    if (kind === "loop") {
        ports.body = { x: width, y: cy };
    }
    return ports;
}

export function nodeColor(kind: NodeKind): string {
    switch (kind) {
        // Triggers
        case "query":
        case "document":
        case "session":
            return "bg-sky-500/20 border-sky-400/60";
        // Activities
        case "transformation":
        case "llm":
        case "classifier":
        case "regressor":
        case "ranker":
        case "intent-detection":
        case "context":
            return "bg-purple-500/20 border-purple-400/60";
        // Sinks
        case "table":
        case "visualization":
        case "context-out":
            return "bg-teal-500/20 border-teal-400/60";
        // Control Flow
        case "condition":
        case "loop":
            return "bg-amber-500/20 border-amber-400/60";
        // Other (from original list)
        case "api":
            return "bg-blue-500/20 border-blue-400/60";
        case "trycatch":
            return "bg-rose-500/20 border-rose-400/60";
        case "delay":
            return "bg-slate-500/20 border-slate-400/60";
        case "variables":
            return "bg-cyan-500/20 border-cyan-400/60";
        default:
            return "bg-zinc-700/30 border-zinc-600";
    }
}

export function nodeIcon(kind: NodeKind) {
    switch (kind) {
        case "query": return <FileQuestion className="w-4 h-4" />;
        case "document": return <FileText className="w-4 h-4" />;
        case "session": return <User className="w-4 h-4" />;
        case "transformation": return <Spline className="w-4 h-4" />;
        case "llm": return <Bot className="w-4 h-4" />;
        case "classifier": return <GitBranch className="w-4 h-4" />;
        case "regressor": return <BarChart3 className="w-4 h-4" />;
        case "ranker": return <SortAsc className="w-4 h-4" />;
        case "intent-detection": return <Lightbulb className="w-4 h-4" />;
        case "context": return <Braces className="w-4 h-4" />;
        case "table": return <Table className="w-4 h-4" />;
        case "visualization": return <BarChart3 className="w-4 h-4" />;
        case "context-out": return <List className="w-4 h-4" />;
        case "condition": return <GitBranch className="w-4 h-4" />;
        case "loop": return <Repeat className="w-4 h-4" />;
        case "api": return <Link2 className="w-4 h-4" />;
        case "trycatch": return <AlertTriangle className="w-4 h-4" />;
        case "delay": return <HourglassIcon />;
        case "variables": return <Braces className="w-4 h-4" />;
        default: return <CircleDot className="w-4 h-4" />;
    }
}

export function portLabel(kind: NodeKind, port: PortName): string {
    if (port === "out") return "out";
    if (port === "true") return "true";
    if (port === "false") return "false";
    if (port === "catch") return "catch";
    if (port === "body") return "body";
    return port;
}