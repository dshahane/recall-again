'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Save, Upload, Download, Trash2, Link2, Scissors, Settings, Wand2, GitBranch, Plus, CircleDot, Workflow, Bot, Repeat, AlertTriangle, Braces, List, HelpCircle, Spline, LayoutDashboard, Database, BarChart3, ChevronDown, CheckCircle2, User, FileText, FileQuestion, Lightbulb, SortAsc, Filter, MessageSquare, Terminal, Table, Hand, Eye, LayoutGrid } from 'lucide-react';

// ----------------------------- Types -----------------------------

type PortName = "out" | "true" | "false" | "catch" | "body";

type NodeKind =
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

type Vec2 = { x: number; y: number };

type Edge = {
    id: string;
    from: { nodeId: string; port: PortName };
    to: { nodeId: string };
};

type BaseNode = {
    id: string;
    kind: NodeKind;
    name: string;
    pos: Vec2;
};

type APINode = BaseNode & {
    kind: "api";
    config: {
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        url: string; // can contain {{vars}}
        headers: Record<string, string>;
        body: string; // raw string or JSON with {{vars}}
        saveAs: string; // context key to store response JSON/text
        asJSON: boolean;
    };
};

type LLMNode = BaseNode & {
    kind: "llm";
    config: {
        provider: "openai" | "anthropic" | "azure-openai" | "ollama" | "other";
        model: string;
        prompt: string; // template with {{vars}}
        system?: string;
        temperature: number;
        saveAs: string;
    };
};

type ConditionNode = BaseNode & {
    kind: "condition";
    config: {
        expression: string; // JS expression using ctx, e.g. ctx.score > 0.8
    };
};

type LoopNode = BaseNode & {
    kind: "loop";
    config: {
        mode: "times" | "forEach" | "while";
        times?: number;
        listExpr?: string; // expression -> array
        whileExpr?: string; // boolean expression
        iterName: string; // ctx variable name for current item or index
        maxIterations?: number;
    };
};

type TryCatchNode = BaseNode & {
    kind: "trycatch";
    config: { note?: string };
};

type DelayNode = BaseNode & {
    kind: "delay";
    config: { ms: number };
};

type VariablesNode = BaseNode & {
    kind: "variables";
    config: { json: string };
};

type AnyNode = APINode | LLMNode | ConditionNode | LoopNode | TryCatchNode | DelayNode | VariablesNode | BaseNode;

type Workflow = {
    nodes: AnyNode[];
    edges: Edge[];
    startId?: string;
    meta?: { name: string; description?: string };
};

// ----------------------------- Utilities -----------------------------

const genId = () => uuidv4();

function snap(n: number, grid = 8) {
    return Math.round(n / grid) * grid;
}

function portLabel(kind: NodeKind, port: PortName): string {
    if (port === "out") return "out";
    if (port === "true") return "true";
    if (port === "false") return "false";
    if (port === "catch") return "catch";
    if (port === "body") return "body";
    return port;
}

function nodeColor(kind: NodeKind): string {
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

function nodeIcon(kind: NodeKind) {
    switch (kind) {
        // Triggers
        case "query": return <FileQuestion className="w-4 h-4" />;
        case "document": return <FileText className="w-4 h-4" />;
        case "session": return <User className="w-4 h-4" />;
        // Activities
        case "transformation": return <Spline className="w-4 h-4" />;
        case "llm": return <Bot className="w-4 h-4" />;
        case "classifier": return <GitBranch className="w-4 h-4" />;
        case "regressor": return <BarChart3 className="w-4 h-4" />;
        case "ranker": return <SortAsc className="w-4 h-4" />;
        case "intent-detection": return <Lightbulb className="w-4 h-4" />;
        case "context": return <Braces className="w-4 h-4" />;
        // Sinks
        case "table": return <Table className="w-4 h-4" />;
        case "visualization": return <BarChart3 className="w-4 h-4" />;
        case "context-out": return <List className="w-4 h-4" />;
        // Control Flow
        case "condition": return <GitBranch className="w-4 h-4" />;
        case "loop": return <Repeat className="w-4 h-4" />;
        // Other (from original list)
        case "api": return <Link2 className="w-4 h-4" />;
        case "trycatch": return <AlertTriangle className="w-4 h-4" />;
        case "delay": return <HourglassIcon />;
        case "variables": return <Braces className="w-4 h-4" />;
        default: return <CircleDot className="w-4 h-4" />;
    }
}

function HourglassIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 2h12M6 22h12M7 2v5a5 5 0 0 0 10 0V2M17 22v-5a5 5 0 0 0-10 0v5" />
        </svg>
    );
}

// ----------------------------- Palette Data -----------------------------

interface PaletteNode {
    kind: NodeKind;
    label: string;
    icon: React.ReactNode;
    tip: string;
}

interface PaletteCategory {
    title: string;
    nodes: PaletteNode[];
}

const PALETTE_DATA: PaletteCategory[] = [
    {
        title: "Triggers",
        nodes: [
            { kind: "query", label: "Query", icon: nodeIcon("query"), tip: "Starts workflow with a user query." },
            { kind: "document", label: "Document", icon: nodeIcon("document"), tip: "Starts workflow with a document upload." },
            { kind: "session", label: "Session", icon: nodeIcon("session"), tip: "Starts workflow from a live session." },
        ],
    },
    {
        title: "Activities",
        nodes: [
            { kind: "llm", label: "LLM", icon: nodeIcon("llm"), tip: "Call a Large Language Model." },
            { kind: "transformation", label: "Transformation", icon: nodeIcon("transformation"), tip: "Transform data from one format to another." },
            { kind: "classifier", label: "Classifier", icon: nodeIcon("classifier"), tip: "Categorize input data." },
            { kind: "regressor", label: "Regressor", icon: nodeIcon("regressor"), tip: "Predict a numerical value." },
            { kind: "ranker", label: "Ranker", icon: nodeIcon("ranker"), tip: "Order items by relevance or score." },
            { kind: "intent-detection", label: "Intent Detection", icon: nodeIcon("intent-detection"), tip: "Detect the user's intent." },
            { kind: "context", label: "Context", icon: nodeIcon("context"), tip: "Save data to the workflow context." },
        ],
    },
    {
        title: "Control Flow",
        nodes: [
            { kind: "condition", label: "Condition", icon: nodeIcon("condition"), tip: "Branch based on a boolean expression." },
            { kind: "loop", label: "Loop", icon: nodeIcon("loop"), tip: "Repeat a sequence of actions." },
            { kind: "trycatch", label: "Try/Catch", icon: nodeIcon("trycatch"), tip: "Handle potential errors." },
            { kind: "delay", label: "Delay", icon: nodeIcon("delay"), tip: "Pause execution for a set duration." },
        ],
    },
    {
        title: "Sink",
        nodes: [
            { kind: "table", label: "Table", icon: nodeIcon("table"), tip: "Display data in a tabular format." },
            { kind: "visualization", label: "Visualization", icon: nodeIcon("visualization"), tip: "Output a data visualization." },
            { kind: "context-out", label: "Context Out", icon: nodeIcon("context-out"), tip: "Finalize workflow with a context output." },
        ],
    },
];

function completeNode(base: BaseNode): AnyNode {
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
        // New nodes with minimal config
        default:
            return { ...base, config: {} as any };
    }
}

function createStarterWorkflow(): Workflow {
    return {
        nodes: [],
        edges: [],
        meta: { name: "New Workflow" },
    };
}

// ----------------------------- Node Views -----------------------------

function portPositions(width: number, height: number, kind: NodeKind) {
    const cx = width / 2;
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

function NodeView({ node, selected, onDrag, onSelect, onDelete, onPortClick }: {
    node: AnyNode;
    selected: boolean;
    onDrag: (id: string, pos: Vec2) => void;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onPortClick: (id: string, port: PortName, evt: React.MouseEvent) => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const size = { w: 220, h: 84 };

    const handleDragStart = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button, input, textarea, select")) return;
        setDragging(true);
        onSelect(node.id);
        e.stopPropagation();
    }, [node.id, onSelect]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragging || !ref.current) return;
        const parentRect = ref.current.parentElement!.getBoundingClientRect();
        const newX = snap(e.clientX - parentRect.left - size.w / 2);
        const newY = snap(e.clientY - parentRect.top - size.h / 2);
        onDrag(node.id, { x: newX, y: newY });
    }, [dragging, node.id, onDrag, size.w, size.h]);

    const handleMouseUp = useCallback(() => {
        setDragging(false);
    }, []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, handleMouseMove, handleMouseUp]);

    const ports = portPositions(size.w, size.h, node.kind);

    return (
        <div
            ref={ref}
            className={`absolute rounded-2xl border ${nodeColor(node.kind)} ${selected ? "ring-2 ring-white/60" : ""} shadow-md backdrop-blur-sm`}
            style={{ left: node.pos.x, top: node.pos.y, width: size.w, height: size.h }}
            onMouseDown={handleDragStart}
            onClick={() => onSelect(node.id)}
        >
            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                    {nodeIcon(node.kind)}
                    <div className="text-sm font-medium truncate max-w-[130px]" title={node.name}>{node.name}</div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px]">
                        <DropdownMenuItem onClick={() => onSelect(node.id)}>Configure</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(node.id)} className="text-rose-500">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="px-3 pb-2 text-xs text-zinc-300/80">
                {node.kind === "api" && <span>HTTP { (node as APINode).config.method } → {(node as APINode).config.saveAs || "_" }</span>}
                {node.kind === "llm" && <span>{ (node as LLMNode).config.model } → {(node as LLMNode).config.saveAs || "_" }</span>}
                {node.kind === "condition" && <span>{ (node as ConditionNode).config.expression }</span>}
                {node.kind === "loop" && <span>{ (node as LoopNode).config.mode }</span>}
                {node.kind === "delay" && <span>{ (node as DelayNode).config.ms } ms</span>}
                {node.kind === "variables" && <span>merge ctx</span>}
            </div>
            {/* Ports */}
            {Object.entries(ports).map(([port, pos]) => (
                <button
                    key={port}
                    onClick={(e) => onPortClick(node.id, port as PortName, e)}
                    className="absolute -right-3 bg-zinc-900 border border-zinc-600 rounded-full w-6 h-6 flex items-center justify-center shadow hover:scale-105"
                    style={{ left: (pos!.x - 9), top: (pos!.y - 9) }}
                    title={`Connect ${portLabel(node.kind, port as PortName)}`}
                >
                    <CircleDot className="w-3 h-3" />
                </button>
            ))}
            {/* Inlet (left center) */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-600 rounded-full w-6 h-6 shadow" />
        </div>
    );
}

function EdgeView({ from, to, fromKind }: { from: Vec2; to: Vec2; fromKind: NodeKind }) {
    const path = `M ${from.x},${from.y} C ${from.x + 60},${from.y} ${to.x - 60},${to.y} ${to.x},${to.y}`;
    const color = {
        query: "stroke-sky-400/80",
        document: "stroke-sky-400/80",
        session: "stroke-sky-400/80",
        transformation: "stroke-purple-400/80",
        llm: "stroke-purple-400/80",
        classifier: "stroke-purple-400/80",
        regressor: "stroke-purple-400/80",
        ranker: "stroke-purple-400/80",
        'intent-detection': "stroke-purple-400/80",
        context: "stroke-purple-400/80",
        table: "stroke-teal-400/80",
        visualization: "stroke-teal-400/80",
        'context-out': "stroke-teal-400/80",
        condition: "stroke-amber-400/80",
        loop: "stroke-amber-400/80",
        api: "stroke-blue-400/80",
        trycatch: "stroke-rose-400/80",
        delay: "stroke-slate-400/80",
        variables: "stroke-cyan-400/80",
    }[fromKind];
    return (
        <path d={path} className={`${color}`} fill="none" strokeWidth={2.5} markerEnd="url(#arrow)" />
    );
}

// ----------------------------- Main Component -----------------------------

export default function WorkflowBuilder() {
    const [wf, setWf] = useState<Workflow>(() => createStarterWorkflow());
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; port: PortName } | null>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [running, setRunning] = useState(false);
    const [ctxView, setCtxView] = useState<Record<string, any>>({});
    const abortRef = useRef<AbortController | null>(null);
    const [loadId, setLoadId] = useState("");
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
    const [saveId, setSaveId] = useState("");
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [draggedNode, setDraggedNode] = useState<PaletteNode | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    const isTriggerNode = (kind: NodeKind) => ["query", "document", "session"].includes(kind);

    const handleDragStart = (e: React.DragEvent, node: PaletteNode) => {
        setDraggedNode(node);
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', node.kind);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect || !draggedNode) return;

        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        if (isTriggerNode(draggedNode.kind) && wf.nodes.some(n => isTriggerNode(n.kind))) {
            setModalMessage("A workflow can only have one Trigger node.");
            setIsModalOpen(true);
            return;
        }

        const newNode = completeNode({
            id: genId(),
            kind: draggedNode.kind,
            name: draggedNode.label,
            pos: { x: snap(x - 110), y: snap(y - 42) } // Center the node on drop
        });

        setWf(w => ({
            ...w,
            nodes: [...w.nodes, newNode],
            startId: isTriggerNode(newNode.kind) ? newNode.id : w.startId
        }));
        setSelectedId(newNode.id);
        setDraggedNode(null);
    };

    const handleAccordionToggle = (title: string) => {
        setActiveAccordion(activeAccordion === title ? null : title);
    };

    const selectedNode = useMemo(() => wf.nodes.find(n => n.id === selectedId), [wf.nodes, selectedId]);


    const addNode = (kind: NodeKind) => {
        // This is not used anymore due to drag-and-drop, but kept for completeness
        const id = genId();
        const base: BaseNode = { id, kind, name: labelFor(kind), pos: { x: 80, y: 80 } } as any;
        const node = completeNode(base as AnyNode);
        setWf(w => ({ ...w, nodes: [...w.nodes, node] }));
        setSelectedId(id);
    };

    const deleteNode = (id: string) => {
        setWf(w => ({
            ...w,
            nodes: w.nodes.filter(n => n.id !== id),
            edges: w.edges.filter(e => e.from.nodeId !== id && e.to.nodeId !== id),
            startId: w.startId === id ? undefined : w.startId,
        }));
        if (selectedId === id) setSelectedId(undefined);
    };

    const onDrag = (id: string, pos: Vec2) => setWf(w => ({ ...w, nodes: w.nodes.map(n => (n.id === id ? { ...n, pos } : n)) }));

    // ⭐️ Fix: A new utility function to calculate a node's port position
    const nodePortPos = useCallback((n: AnyNode, port: PortName, kind: 'out' | 'in') => {
        const rect = { w: 220, h: 84 };
        if (kind === 'in') {
            return { x: n.pos.x, y: n.pos.y + rect.h / 2 };
        }
        const pp = portPositions(rect.w, rect.h, n.kind)[port] || { x: rect.w, y: rect.h / 2 };
        return { x: n.pos.x + pp.x, y: n.pos.y + pp.y };
    }, []);

    // ⭐️ Fix: Corrected onPortClick logic
    const onPortClick = useCallback((nodeId: string, port: PortName, e: React.MouseEvent) => {
        e.stopPropagation();

        if (connectingFrom) {
            // Case 2: Complete the connection
            const sourceNode = wf.nodes.find(n => n.id === connectingFrom.nodeId);
            const targetNode = wf.nodes.find(n => n.id === nodeId);

            if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) {
                setConnectingFrom(null);
                return;
            }

            // Remove any existing edge from the source port
            const newEdges = wf.edges.filter(edge => !(edge.from.nodeId === connectingFrom.nodeId && edge.from.port === connectingFrom.port));

            // Create a new edge
            const newEdge: Edge = {
                id: genId(),
                from: { nodeId: connectingFrom.nodeId, port: connectingFrom.port },
                to: { nodeId: targetNode.id },
            };

            setWf(w => ({
                ...w,
                edges: [...newEdges, newEdge]
            }));
            setConnectingFrom(null);
        } else {
            // Case 1: Start a new connection
            setConnectingFrom({ nodeId, port });
        }
    }, [connectingFrom, wf.edges, wf.nodes]);

    const handleCanvasClick = () => {
        setSelectedId(undefined);
        setConnectingFrom(null); // Cancel any ongoing connection
    };


    // Placeholder for configuration and execution logic
    const handleConfigChange = (id: string, newConfig: any) => {
        setWf(w => ({
            ...w,
            nodes: w.nodes.map(n => n.id === id ? { ...n, config: newConfig } : n) as AnyNode[]
        }));
    };

    const handleNameChange = (id: string, newName: string) => {
        setWf(w => ({
            ...w,
            nodes: w.nodes.map(n => n.id === id ? { ...n, name: newName } : n)
        }));
    };

    const startExecution = () => {
        setRunning(true);
        // Placeholder for real execution logic
        setLogs(prev => [...prev, { level: 'info', msg: 'Execution started (mock)' }]);
        setTimeout(() => {
            setRunning(false);
            setLogs(prev => [...prev, { level: 'info', msg: 'Execution finished (mock)' }]);
        }, 3000);
    };

    const stopExecution = () => {
        setRunning(false);
        // Placeholder for abort logic
        setLogs(prev => [...prev, { level: 'warn', msg: 'Execution aborted (mock)' }]);
    };

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
            <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />
            {/* Palette Sidebar */}
            <div className="w-64 flex-shrink-0 border-r border-zinc-800 p-4 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                    <Workflow className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Node Palette</h2>
                </div>
                {PALETTE_DATA.map((category) => (
                    <div key={category.title} className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                        <button
                            onClick={() => handleAccordionToggle(category.title)}
                            className="w-full flex justify-between items-center p-3 text-sm font-medium hover:bg-zinc-800/50 transition-colors rounded-t-xl"
                        >
                            <span>{category.title}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === category.title ? 'rotate-180' : ''}`} />
                        </button>
                        {activeAccordion === category.title && (
                            <div className="p-2 border-t border-zinc-800">
                                <div className="grid grid-cols-2 gap-2">
                                    {category.nodes.map((node) => (
                                        <div
                                            key={node.kind}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, node)}
                                            className="group relative flex flex-col items-center justify-center p-2 text-center text-xs rounded-lg border border-zinc-700 bg-zinc-800/50 cursor-grab hover:bg-zinc-700/50 transition-colors"
                                        >
                                            <span className="mb-1">{node.icon}</span>
                                            {node.label}
                                            <div className="absolute inset-0 z-10 hidden group-hover:block pointer-events-none p-2 rounded-lg bg-zinc-700 text-white text-xs w-40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {node.tip}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex flex-col relative">
                <div className="flex-1 overflow-hidden relative" onClick={handleCanvasClick}>
                    <div
                        ref={canvasRef}
                        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200%20L0%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23252525%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')]"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {/* SVG for Edges */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#d4d4d8" />
                                </marker>
                            </defs>
                            {wf.edges.map(edge => {
                                const fromNode = wf.nodes.find(n => n.id === edge.from.nodeId);
                                const toNode = wf.nodes.find(n => n.id === edge.to.nodeId);
                                if (!fromNode || !toNode) return null;
                                const fromPos = nodePortPos(fromNode, edge.from.port, 'out');
                                const toPos = nodePortPos(toNode, 'out', 'in');
                                return (
                                    <EdgeView
                                        key={edge.id}
                                        from={fromPos}
                                        to={toPos}
                                        fromKind={fromNode.kind}
                                    />
                                );
                            })}
                        </svg>

                        {/* Render Nodes */}
                        {wf.nodes.map(node => (
                            <NodeView
                                key={node.id}
                                node={node}
                                selected={node.id === selectedId}
                                onDrag={onDrag}
                                onSelect={setSelectedId}
                                onDelete={deleteNode}
                                onPortClick={onPortClick}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Node Config / Logs Sidebar */}
            <div className="w-80 flex-shrink-0 border-l border-zinc-800 bg-zinc-900/50 p-4 overflow-y-auto">
                <Tabs defaultValue="configure" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="configure">Configure</TabsTrigger>
                        <TabsTrigger value="logs">Logs</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 mt-4">
                        <TabsContent value="configure" className="space-y-4">
                            {!selectedNode ? (
                                <div className="text-center text-zinc-500 text-sm py-8">
                                    Select a node to configure
                                </div>
                            ) : (
                                <NodeConfig node={selectedNode} onChange={handleConfigChange} onNameChange={handleNameChange} />
                            )}
                        </TabsContent>
                        <TabsContent value="logs" className="space-y-2">
                            {logs.length === 0 && (
                                <div className="text-center text-zinc-500 text-sm py-8">
                                    No logs yet. Run the workflow to see output.
                                </div>
                            )}
                            {logs.map((log, i) => (
                                <div key={i} className={`p-2 rounded-lg text-xs font-mono break-all ${log.level === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-zinc-800/50'}`}>
                                    [{log.level}] {log.msg}
                                </div>
                            ))}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

// Simple modal component for alerts
const Modal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-zinc-800 rounded-lg p-6 shadow-xl max-w-sm">
                <h3 className="text-lg font-semibold text-white">Warning</h3>
                <p className="mt-4 text-sm text-zinc-300">{message}</p>
                <div className="flex justify-end mt-6">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

// Placeholder for NodeConfig component, assuming it exists
const NodeConfig = ({ node, onChange, onNameChange }: {
    node: AnyNode;
    onChange: (id: string, config: any) => void;
    onNameChange: (id: string, name: string) => void;
}) => {
    // This is a minimal, placeholder component. You would expand this to handle different node kinds.
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="node-name" className="text-sm">Node Name</Label>
                <Input
                    id="node-name"
                    value={node.name}
                    onChange={(e) => onNameChange(node.id, e.target.value)}
                    className="mt-1"
                />
            </div>
            <div className="space-y-2">
                <h4 className="text-sm font-medium">Configuration</h4>
                {node.kind === "llm" && (
                    <>
                        <Label htmlFor="llm-model">Model</Label>
                        <Input
                            id="llm-model"
                            value={(node as LLMNode).config.model}
                            onChange={(e) => onChange(node.id, { ...node.config, model: e.target.value })}
                        />
                        <Label htmlFor="llm-prompt">Prompt</Label>
                        <Textarea
                            id="llm-prompt"
                            value={(node as LLMNode).config.prompt}
                            onChange={(e) => onChange(node.id, { ...node.config, prompt: e.target.value })}
                        />
                    </>
                )}
                {/* Add more config sections for other node kinds */}
            </div>
        </div>
    );
};