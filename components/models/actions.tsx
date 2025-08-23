'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Save, Upload, Download, Trash2, Link2, Scissors, Settings, Wand2, GitBranch, Plus, CircleDot, Workflow, Bot, Repeat, AlertTriangle, Braces, List, HelpCircle, Spline } from "lucide-react";

/**
 * Next.js + Tailwind + shadcn UI Workflow Builder
 * - Drag nodes onto canvas (API, LLM, Condition, Loop, Try/Catch, Delay)
 * - Connect via ports (default, true/false, catch, body)
 * - Configure each node in the side panel
 * - Execute workflow with logs and variable context
 * - Save / Load JSON definition
 *
 * Notes
 * - This is a single-file React component ready to drop into a Next.js app (app router or pages).
 * - Expects shadcn/ui components and lucide-react to be installed.
 * - Provides mock /api/llm and /api/proxy endpoint shapes (see inline comments) you can wire up.
 */

// ----------------------------- Types -----------------------------

type PortName = "out" | "true" | "false" | "catch" | "body";

type NodeKind =
    | "api"
    | "llm"
    | "condition"
    | "loop"
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

type AnyNode = APINode | LLMNode | ConditionNode | LoopNode | TryCatchNode | DelayNode | VariablesNode;

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
        case "api":
            return "bg-blue-500/20 border-blue-400/60";
        case "llm":
            return "bg-purple-500/20 border-purple-400/60";
        case "condition":
            return "bg-amber-500/20 border-amber-400/60";
        case "loop":
            return "bg-green-500/20 border-green-400/60";
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
        case "api":
            return <Link2 className="w-4 h-4" />;
        case "llm":
            return <Bot className="w-4 h-4" />;
        case "condition":
            return <GitBranch className="w-4 h-4" />;
        case "loop":
            return <Repeat className="w-4 h-4" />;
        case "trycatch":
            return <AlertTriangle className="w-4 h-4" />;
        case "delay":
            return <HourglassIcon />;
        case "variables":
            return <Braces className="w-4 h-4" />;
        default:
            return <CircleDot className="w-4 h-4" />;
    }
}

function HourglassIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 2h12M6 22h12M7 2v5a5 5 0 0 0 10 0V2M17 22v-5a5 5 0 0 0-10 0v5" />
        </svg>
    );
}

// Simple template expansion using {{var}} from ctx
function renderTemplate(tpl: string, ctx: Record<string, any>) {
    return tpl.replace(/{{\s*([\w\.]+)\s*}}/g, (_, key) => {
        try {
            const val = key.split(".").reduce((acc: any, k: string) => (acc ? acc[k] : undefined), ctx);
            return val == null ? "" : String(val);
        } catch (e) {
            return "";
        }
    });
}

// ----------------------------- Executor -----------------------------

type RunLog = { id: string; level: "info" | "error" | "warn"; msg: string; nodeId?: string };

function evaluateExpression(expr: string, ctx: Record<string, any>): any {
    // sandbox-lite: make ctx available as a const. DO NOT expose window
    // eslint-disable-next-line no-new-func
    const fn = new Function("ctx", `return (${expr})`);
    return fn(ctx);
}

async function executeWorkflow(wf: Workflow, appendLog: (l: RunLog) => void, setCtx: (fn: (c: any) => any) => void, signal: AbortSignal) {
    const idToNode = new Map(wf.nodes.map(n => [n.id, n] as const));
    const fromPort = (id: string, port: PortName) => wf.edges.find(e => e.from.nodeId === id && e.from.port === port)?.to.nodeId;
    const defaultNext = (id: string) => fromPort(id, "out");

    let currentId: string | undefined = wf.startId || wf.nodes[0]?.id;
    const ctx: Record<string, any> = {};

    appendLog({ id: genId(), level: "info", msg: `Started at node ${currentId}` });

    // prime ctx with any Variables nodes connected from start
    const primeVars = (node: AnyNode) => {
        if (node.kind === "variables") {
            try {
                Object.assign(ctx, JSON.parse((node as VariablesNode).config.json || "{}"));
                appendLog({ id: genId(), level: "info", msg: `Variables loaded`, nodeId: node.id });
            } catch (e: any) {
                appendLog({ id: genId(), level: "error", msg: `Invalid variables JSON: ${e?.message}`, nodeId: node.id });
            }
        }
    };

    // Visit detached Variables nodes at start
    wf.nodes.filter(n => n.kind === "variables").forEach(primeVars);

    mainLoop: while (currentId) {
        if (signal.aborted) throw new Error("Execution aborted");

        const node = idToNode.get(currentId);
        if (!node) {
            appendLog({ id: genId(), level: "error", msg: `Node ${currentId} not found` });
            break;
        }

        try {
            switch (node.kind) {
                case "api": {
                    const n = node as APINode;
                    const url = renderTemplate(n.config.url, ctx);
                    const bodyStr = renderTemplate(n.config.body || "", ctx);
                    const headers = Object.fromEntries(
                        Object.entries(n.config.headers || {}).map(([k, v]) => [k, renderTemplate(v, ctx)])
                    );
                    appendLog({ id: genId(), level: "info", msg: `${n.config.method} ${url}`, nodeId: node.id });

                    // Example: forward via a Next.js route you implement (/api/proxy)
                    // The route should accept { method, url, headers, body } and pipe out the result to avoid CORS.
                    const res = await fetch("/api/proxy", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            method: n.config.method,
                            url,
                            headers,
                            body: bodyStr || undefined,
                        }),
                        signal,
                    });
                    const contentType = res.headers.get("content-type") || "";
                    let data: any = null;
                    if (n.config.asJSON && contentType.includes("application/json")) data = await res.json();
                    else data = await res.text();
                    if (!res.ok) throw new Error(`HTTP ${res.status}: ${typeof data === "string" ? data.slice(0, 200) : ""}`);

                    if (n.config.saveAs) ctx[n.config.saveAs] = data;
                    appendLog({ id: genId(), level: "info", msg: `Saved -> ctx.${n.config.saveAs || "_"}` , nodeId: node.id});

                    currentId = defaultNext(node.id);
                    break;
                }
                case "llm": {
                    const n = node as LLMNode;
                    const prompt = renderTemplate(n.config.prompt, ctx);
                    const system = renderTemplate(n.config.system || "", ctx);
                    appendLog({ id: genId(), level: "info", msg: `LLM ${n.config.provider}:${n.config.model} prompt len=${prompt.length}`, nodeId: node.id });

                    // Example: you implement /api/llm to call your provider securely (server-side)
                    const res = await fetch("/api/llm", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            provider: n.config.provider,
                            model: n.config.model,
                            prompt,
                            system,
                            temperature: n.config.temperature,
                        }),
                        signal,
                    });
                    if (!res.ok) throw new Error(`LLM call failed ${res.status}`);
                    const data = await res.json();
                    const text = data?.output ?? data?.text ?? JSON.stringify(data);
                    if (n.config.saveAs) ctx[n.config.saveAs] = text;
                    appendLog({ id: genId(), level: "info", msg: `LLM -> ctx.${n.config.saveAs || "_"}` , nodeId: node.id});
                    currentId = defaultNext(node.id);
                    break;
                }
                case "condition": {
                    const n = node as ConditionNode;
                    const result = !!evaluateExpression(n.config.expression || "false", ctx);
                    appendLog({ id: genId(), level: "info", msg: `Condition = ${result}`, nodeId: node.id });
                    currentId = fromPort(node.id, result ? "true" : "false") || defaultNext(node.id);
                    break;
                }
                case "loop": {
                    const n = node as LoopNode;
                    const bodyNext = fromPort(node.id, "body");
                    const afterLoop = defaultNext(node.id);
                    let iterations = 0;
                    if (!bodyNext) {
                        appendLog({ id: genId(), level: "warn", msg: `Loop has no body connection`, nodeId: node.id });
                        currentId = afterLoop;
                        break;
                    }
                    switch (n.config.mode) {
                        case "times": {
                            const times = Math.min(n.config.times ?? 0, n.config.maxIterations ?? 1000);
                            for (let i = 0; i < times; i++) {
                                if (signal.aborted) break mainLoop;
                                ctx[n.config.iterName || "i"] = i;
                                appendLog({ id: genId(), level: "info", msg: `Loop ${i + 1}/${times}`, nodeId: node.id });
                                await executeBranch(bodyNext);
                                iterations++;
                            }
                            break;
                        }
                        case "forEach": {
                            const list = evaluateExpression(n.config.listExpr || "[]", ctx);
                            const arr = Array.isArray(list) ? list : [];
                            const cap = Math.min(arr.length, n.config.maxIterations ?? 1000);
                            for (let i = 0; i < cap; i++) {
                                if (signal.aborted) break mainLoop;
                                ctx[n.config.iterName || "item"] = arr[i];
                                ctx[`${n.config.iterName || "item"}Index`] = i;
                                appendLog({ id: genId(), level: "info", msg: `Loop item ${i + 1}/${cap}`, nodeId: node.id });
                                await executeBranch(bodyNext);
                                iterations++;
                            }
                            break;
                        }
                        case "while": {
                            const cap = n.config.maxIterations ?? 1000;
                            let i = 0;
                            while (i < cap && !!evaluateExpression(n.config.whileExpr || "false", ctx)) {
                                if (signal.aborted) break mainLoop;
                                ctx[n.config.iterName || "i"] = i;
                                appendLog({ id: genId(), level: "info", msg: `Loop while #${i + 1}`, nodeId: node.id });
                                await executeBranch(bodyNext);
                                i++; iterations++;
                            }
                            break;
                        }
                    }
                    appendLog({ id: genId(), level: "info", msg: `Loop finished (${iterations} iters)`, nodeId: node.id });
                    currentId = afterLoop;
                    break;
                }
                case "trycatch": {
                    const body = fromPort(node.id, "body");
                    const onCatch = fromPort(node.id, "catch");
                    const after = defaultNext(node.id);
                    try {
                        if (body) await executeBranch(body);
                        currentId = after;
                    } catch (err: any) {
                        appendLog({ id: genId(), level: "error", msg: `Caught error: ${err?.message || err}`, nodeId: node.id });
                        currentId = onCatch || after;
                    }
                    break;
                }
                case "delay": {
                    const ms = (node as DelayNode).config.ms || 0;
                    appendLog({ id: genId(), level: "info", msg: `Delay ${ms}ms`, nodeId: node.id });
                    await new Promise(r => setTimeout(r, ms));
                    currentId = defaultNext(node.id);
                    break;
                }
                case "variables": {
                    // Variables nodes can be used mid-flow as well
                    const n = node as VariablesNode;
                    try {
                        Object.assign(ctx, JSON.parse(n.config.json || "{}"));
                        appendLog({ id: genId(), level: "info", msg: `Variables merged`, nodeId: node.id });
                    } catch (e: any) {
                        appendLog({ id: genId(), level: "error", msg: `Invalid JSON: ${e?.message}`, nodeId: node.id });
                    }
                    currentId = defaultNext(node.id);
                    break;
                }
                default:
                    currentId = defaultNext(node.id);
            }
        } catch (err: any) {
            // try to follow catch port if exists
            const catchNode = wf.edges.find(e => e.from.nodeId === node.id && e.from.port === "catch");
            if (catchNode) {
                appendLog({ id: genId(), level: "warn", msg: `Error at ${node.name}, jumping to catch`, nodeId: node.id });
                currentId = catchNode.to.nodeId;
            } else {
                appendLog({ id: genId(), level: "error", msg: `Fatal error at ${node.name}: ${err?.message || err}`, nodeId: node.id });
                break;
            }
        }
    }

    function cloneCtx() {
        return JSON.parse(JSON.stringify(ctx));
    }

    async function executeBranch(startNodeId: string) {
        let ptr: string | undefined = startNodeId;
        while (ptr) {
            if (signal.aborted) throw new Error("Execution aborted");
            const node = idToNode.get(ptr);
            if (!node) throw new Error(`Branch node ${ptr} not found`);
            // Re-enter minimal subset (api, llm, condition, delay, variables)
            if (node.kind === "api") {
                const n = node as APINode;
                const url = renderTemplate(n.config.url, ctx);
                const bodyStr = renderTemplate(n.config.body || "", ctx);
                const headers = Object.fromEntries(
                    Object.entries(n.config.headers || {}).map(([k, v]) => [k, renderTemplate(v, ctx)])
                );
                const res = await fetch("/api/proxy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ method: n.config.method, url, headers, body: bodyStr || undefined }),
                    signal,
                });
                const contentType = res.headers.get("content-type") || "";
                let data: any = null;
                if (n.config.asJSON && contentType.includes("application/json")) data = await res.json();
                else data = await res.text();
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                if (n.config.saveAs) ctx[n.config.saveAs] = data;
                ptr = defaultNext(node.id);
            } else if (node.kind === "llm") {
                const n = node as LLMNode;
                const prompt = renderTemplate(n.config.prompt, ctx);
                const system = renderTemplate(n.config.system || "", ctx);
                const res = await fetch("/api/llm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ provider: n.config.provider, model: n.config.model, prompt, system, temperature: n.config.temperature }),
                    signal,
                });
                if (!res.ok) throw new Error(`LLM call failed ${res.status}`);
                const data = await res.json();
                const text = data?.output ?? data?.text ?? JSON.stringify(data);
                if (n.config.saveAs) ctx[n.config.saveAs] = text;
                ptr = defaultNext(node.id);
            } else if (node.kind === "condition") {
                const n = node as ConditionNode;
                const result = !!evaluateExpression(n.config.expression || "false", ctx);
                ptr = fromPort(node.id, result ? "true" : "false") || defaultNext(node.id);
            } else if (node.kind === "delay") {
                await new Promise(r => setTimeout(r, (node as DelayNode).config.ms || 0));
                ptr = defaultNext(node.id);
            } else if (node.kind === "variables") {
                const n = node as VariablesNode;
                Object.assign(ctx, JSON.parse(n.config.json || "{}"));
                ptr = defaultNext(node.id);
            } else if (node.kind === "trycatch" || node.kind === "loop") {
                // For nested complex nodes, return control to main loop to handle them
                currentId = node.id;
                return; // exit branch, main loop continues
            } else {
                ptr = defaultNext(node.id);
            }
        }
        // copy ctx back into React state
        setCtx(() => cloneCtx());
    }

    setCtx(() => cloneCtx());
    appendLog({ id: genId(), level: "info", msg: `Workflow finished` });
}

// ----------------------------- Canvas / UI -----------------------------

type Tool = Exclude<NodeKind, never>;

const DefaultPalette: { kind: Tool; label: string; icon: React.ReactNode; tip: string }[] = [
    { kind: "api", label: "HTTP API", icon: <Link2 className="w-4 h-4" />, tip: "Call any REST endpoint" },
    { kind: "llm", label: "LLM Call", icon: <Wand2 className="w-4 h-4" />, tip: "Invoke a text model" },
    { kind: "condition", label: "Condition", icon: <GitBranch className="w-4 h-4" />, tip: "Branch on expression" },
    { kind: "loop", label: "Loop", icon: <Repeat className="w-4 h-4" />, tip: "times/forEach/while" },
    { kind: "trycatch", label: "Try/Catch", icon: <AlertTriangle className="w-4 h-4" />, tip: "Handle errors" },
    { kind: "delay", label: "Delay", icon: <HourglassIcon />, tip: "Wait ms" },
    { kind: "variables", label: "Variables", icon: <Braces className="w-4 h-4" />, tip: "Seed/merge ctx" },
];

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

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onMouseDown = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest("button, input, textarea, select")) return;
            setDragging(true);
            onSelect(node.id);
            e.preventDefault();
        };
        el.addEventListener("mousedown", onMouseDown);
        const onMouseUp = () => setDragging(false);
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            const parent = el.parentElement!.getBoundingClientRect();
            const nx = snap(e.clientX - parent.left - size.w / 2);
            const ny = snap(e.clientY - parent.top - size.h / 2);
            onDrag(node.id, { x: nx, y: ny });
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            el.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [dragging, node.id, onDrag, onSelect]);

    const ports = portPositions(size.w, size.h, node.kind);

    return (
        <div
            ref={ref}
            className={`absolute rounded-2xl border ${nodeColor(node.kind)} ${selected ? "ring-2 ring-white/60" : ""} shadow-md backdrop-blur-sm`}
            style={{ left: node.pos.x, top: node.pos.y, width: size.w, height: size.h }}
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
        api: "stroke-blue-400/80",
        llm: "stroke-purple-400/80",
        condition: "stroke-amber-400/80",
        loop: "stroke-green-400/80",
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
    const [selectedId, setSelectedId] = useState<string | undefined>(wf.startId);
    const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; port: PortName } | null>(null);
    const [logs, setLogs] = useState<RunLog[]>([]);
    const [running, setRunning] = useState(false);
    const [ctxView, setCtxView] = useState<Record<string, any>>({});
    const abortRef = useRef<AbortController | null>(null);

    const selectedNode = useMemo(() => wf.nodes.find(n => n.id === selectedId), [wf.nodes, selectedId]);

    const canvasRef = useRef<HTMLDivElement | null>(null);

    const nodeCenter = (n: AnyNode) => ({ x: n.pos.x + 220, y: n.pos.y + 42 });
    const nodePortPos = (n: AnyNode, port: PortName) => {
        const rect = { w: 220, h: 84 };
        const pp = portPositions(rect.w, rect.h, n.kind)[port] || { x: rect.w, y: rect.h / 2 };
        return { x: n.pos.x + pp.x, y: n.pos.y + pp.y };
    };

    const addNode = (kind: NodeKind) => {
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

    const onPortClick = (nodeId: string, port: PortName, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!connectingFrom) {
            setConnectingFrom({ nodeId, port });
        } else {
            if (connectingFrom.nodeId === nodeId) {
                setConnectingFrom(null);
                return;
            }
            const id = genId();
            setWf(w => ({ ...w, edges: [...w.edges, { id, from: connectingFrom, to: { nodeId } }] }));
            setConnectingFrom(null);
        }
    };

    const startRun = async () => {
        if (running) return;
        setLogs([]);
        setRunning(true);
        abortRef.current = new AbortController();
        try {
            await executeWorkflow(wf, (l) => setLogs(s => [...s, l]), setCtxView, abortRef.current.signal);
        } catch (e: any) {
            setLogs(s => [...s, { id: genId(), level: "error", msg: `Aborted: ${e?.message || e}` }]);
        } finally {
            setRunning(false);
            abortRef.current = null;
        }
    };

    const stopRun = () => {
        abortRef.current?.abort();
    };

    const exportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wf, null, 2));
        const a = document.createElement("a");
        a.href = dataStr;
        a.download = (wf.meta?.name?.replace(/\s+/g, "-") || "workflow") + ".json";
        a.click();
    };

    const importJSON = () => {
        const inp = document.createElement("input");
        inp.type = "file";
        inp.accept = "application/json";
        inp.onchange = () => {
            const file = (inp.files?.[0]);
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsed = JSON.parse(String(reader.result));
                    setWf(parsed);
                    setSelectedId(parsed.startId || parsed.nodes?.[0]?.id);
                } catch (e) {
                    alert("Invalid JSON");
                }
            };
            reader.readAsText(file);
        };
        inp.click();
    };

    return (
        <div className="w-full h-[calc(100vh-2rem)] mx-auto grid grid-cols-[280px_1fr_360px] gap-2 p-2 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-zinc-100">
            {/* Palette */}
            <div className="flex flex-col gap-3 border border-zinc-800 rounded-2xl p-3 bg-zinc-900/40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Workflow className="w-5 h-5" />
                        <div className="font-semibold">Palette</div>
                    </div>
                    <Badge variant="outline" className="bg-zinc-800/50">Nodes</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {DefaultPalette.map(p => (
                        <Button key={p.kind} variant="outline" className="justify-start gap-2 rounded-xl border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/60" onClick={() => addNode(p.kind)} title={p.tip}>
                            {p.icon}
                            {p.label}
                        </Button>
                    ))}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <Label htmlFor="wf-name">Workflow name</Label>
                    <Input id="wf-name" placeholder="My Workflow" value={wf.meta?.name || "Untitled Workflow"} onChange={(e) => setWf(w => ({ ...w, meta: { ...w.meta, name: e.target.value } }))} />
                    <Textarea placeholder="Description (optional)" value={wf.meta?.description || ""} onChange={(e) => setWf(w => ({ ...w, meta: { ...w.meta, description: e.target.value } }))} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <Button onClick={startRun} disabled={running} className="rounded-xl">
                        <Play className="w-4 h-4 mr-2" /> Run
                    </Button>
                    <Button onClick={stopRun} variant="outline" disabled={!running} className="rounded-xl">
                        <Square className="w-4 h-4 mr-2" /> Stop
                    </Button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" onClick={exportJSON} className="rounded-xl"><Download className="w-4 h-4 mr-2"/>Export</Button>
                    <Button variant="outline" onClick={importJSON} className="rounded-xl"><Upload className="w-4 h-4 mr-2"/>Import</Button>
                </div>
                <div className="mt-4 text-xs text-zinc-400 leading-relaxed">
                    <p className="mb-2">Tips:</p>
                    <ul className="list-disc ml-4 space-y-1">
                        <li>Click a node to configure it in the panel.</li>
                        <li>Click a port to begin a connection, then click another node to connect.</li>
                        <li>Use <code className="bg-zinc-800 px-1 rounded">{`{{var}}`}</code> templates inside prompts and URLs.</li>
                        <li>Use <code className="bg-zinc-800 px-1 rounded">ctx</code> in expressions (e.g. <code>ctx.score &gt; 0.8</code>).</li>
                    </ul>
                </div>
            </div>

            {/* Canvas */}
            <div ref={canvasRef} className="relative border border-zinc-800 rounded-2xl bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:16px_16px] overflow-hidden">
                <svg className="absolute inset-0 w-full h-full">
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#a1a1aa" />
                        </marker>
                    </defs>
                    {wf.edges.map(e => {
                        const from = wf.nodes.find(n => n.id === e.from.nodeId);
                        const to = wf.nodes.find(n => n.id === e.to.nodeId);
                        if (!from || !to) return null;
                        const fp = nodePortPos(from, e.from.port);
                        const tp = { x: to.pos.x, y: to.pos.y + 42 };
                        return <EdgeView key={e.id} from={fp} to={tp} fromKind={from.kind} />;
                    })}
                    {connectingFrom && (
                        <EdgePreview from={nodePortPos(wf.nodes.find(n => n.id === connectingFrom.nodeId)!, connectingFrom.port)} />
                    )}
                </svg>

                {wf.nodes.map(n => (
                    <NodeView key={n.id} node={n} selected={selectedId === n.id} onDrag={onDrag} onSelect={setSelectedId} onDelete={deleteNode} onPortClick={onPortClick} />
                ))}
            </div>

            {/* Inspector / Logs */}
            <div className="flex flex-col gap-3 border border-zinc-800 rounded-2xl p-3 bg-zinc-900/40 overflow-hidden">
                <Tabs defaultValue="inspector" className="flex-1 flex flex-col max-h-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="inspector" className="flex-1">Inspector</TabsTrigger>
                        <TabsTrigger value="context" className="flex-1">Context</TabsTrigger>
                        <TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
                    </TabsList>
                    <TabsContent value="inspector" className="flex-1 overflow-auto">
                        {selectedNode ? (
                            <NodeInspector node={selectedNode} onChange={(n) => setWf(w => ({ ...w, nodes: w.nodes.map(x => x.id === n.id ? n : x) }))} onSetStart={() => setWf(w => ({ ...w, startId: selectedNode.id }))} isStart={wf.startId === selectedNode.id} />
                        ) : (
                            <div className="text-sm text-zinc-400 p-3">Select a node to configure it.</div>
                        )}
                    </TabsContent>
                    <TabsContent value="context" className="flex-1 overflow-auto">
                        <pre className="text-xs bg-zinc-950/60 rounded-xl p-3 border border-zinc-800 whitespace-pre-wrap break-all min-h-[200px]">{JSON.stringify(ctxView, null, 2) || "{}"}</pre>
                    </TabsContent>
                    <TabsContent value="logs" className="flex-1 overflow-auto">
                        <div className="text-xs space-y-2">
                            {logs.map(l => (
                                <div key={l.id} className={`px-2 py-1 rounded-lg border ${l.level === "error" ? "border-rose-500/50 bg-rose-500/10" : l.level === "warn" ? "border-amber-500/50 bg-amber-500/10" : "border-zinc-700 bg-zinc-900/60"}`}>
                                    <span className="opacity-70">[{l.level}]</span> {l.msg}
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function EdgePreview({ from }: { from: Vec2 }) {
    const [mouse, setMouse] = useState<Vec2>({ x: 0, y: 0 });
    useEffect(() => {
        const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);
    const path = `M ${from.x},${from.y} C ${from.x + 60},${from.y} ${mouse.x - 60},${mouse.y} ${mouse.x},${mouse.y}`;
    return <path d={path} className="stroke-zinc-500/60" fill="none" strokeWidth={2} markerEnd="url(#arrow)" />;
}

function labelFor(kind: NodeKind) {
    switch (kind) {
        case "api": return "HTTP API";
        case "llm": return "LLM Call";
        case "condition": return "Condition";
        case "loop": return "Loop";
        case "trycatch": return "Try/Catch";
        case "delay": return "Delay";
        case "variables": return "Variables";
    }
}

function completeNode(n: AnyNode): AnyNode {
    switch (n.kind) {
        case "api":
            return { ...n, config: { method: "GET", url: "https://api.example.com/search?q={{query}}", headers: {}, body: "", saveAs: "apiResult", asJSON: true } } as APINode;
        case "llm":
            return { ...n, config: { provider: "openai", model: "gpt-4o-mini", prompt: "Summarize: {{apiResult}}", system: "You are helpful.", temperature: 0.2, saveAs: "summary" } } as LLMNode;
        case "condition":
            return { ...n, config: { expression: "(ctx.summary || '').length > 0" } } as ConditionNode;
        case "loop":
            return { ...n, config: { mode: "times", times: 3, iterName: "i", maxIterations: 100 } } as LoopNode;
        case "trycatch":
            return { ...n, config: { note: "Wrap body and catch errors" } } as TryCatchNode;
        case "delay":
            return { ...n, config: { ms: 500 } } as DelayNode;
        case "variables":
            return { ...n, config: { json: JSON.stringify({ query: "cats" }, null, 2) } } as VariablesNode;
    }
}

function NodeInspector({ node, onChange, onSetStart, isStart }: { node: AnyNode; onChange: (n: AnyNode) => void; onSetStart: () => void; isStart: boolean }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="font-semibold">{node.name}</div>
                <div className="flex items-center gap-2">
                    {!isStart && (
                        <Button size="sm" variant="outline" onClick={onSetStart} className="rounded-lg">Set Start</Button>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label>Name</Label>
                <Input value={node.name} onChange={(e) => onChange({ ...node, name: e.target.value })} />
            </div>

            {node.kind === "api" && <APINodeInspector node={node as APINode} onChange={n => onChange(n as AnyNode)} />}
            {node.kind === "llm" && <LLMNodeInspector node={node as LLMNode} onChange={n => onChange(n as AnyNode)} />}
            {node.kind === "condition" && <ConditionInspector node={node as ConditionNode} onChange={n => onChange(n as AnyNode)} />}
            {node.kind === "loop" && <LoopInspector node={node as LoopNode} onChange={n => onChange(n as AnyNode)} />}
            {node.kind === "trycatch" && <TryCatchInspector node={node as TryCatchNode} onChange={n => onChange(n as AnyNode)} />}
            {node.kind === "delay" && <DelayInspector node={node as DelayNode} onChange={n => onChange(n as AnyNode)} />}
            {node.kind === "variables" && <VariablesInspector node={node as VariablesNode} onChange={n => onChange(n as AnyNode)} />}

            <div className="pt-2 text-xs text-zinc-400">
                ID: <code className="bg-zinc-800 px-1 rounded">{node.id}</code>
            </div>
        </div>
    );
}

function APINodeInspector({ node, onChange }: { node: APINode; onChange: (n: APINode) => void }) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label>Method</Label>
                    <Select value={node.config.method} onValueChange={(v: any) => onChange({ ...node, config: { ...node.config, method: v } })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {(["GET", "POST", "PUT", "PATCH", "DELETE"] as const).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Save As</Label>
                <Input value={node.config.saveAs} placeholder="apiResult" onChange={(e) => onChange({ ...node, config: { ...node.config, saveAs: e.target.value } })} />
            </div>
        </div>
    <div className="space-y-2">
        <Label>URL</Label>
        <Input value={node.config.url} onChange={(e) => onChange({ ...node, config: { ...node.config, url: e.target.value } })} />
    </div>
    <div className="space-y-2">
        <Label>Headers (JSON)</Label>
        <Textarea rows={3} value={JSON.stringify(node.config.headers || {}, null, 2)} onChange={(e) => {
            try { onChange({ ...node, config: { ...node.config, headers: JSON.parse(e.target.value || "{}") } }); } catch {}
        }} />
    </div>
{(["POST", "PUT", "PATCH"].includes(node.config.method)) && (
        <div className="space-y-2">
            <Label>Body</Label>
            <Textarea rows={5} value={node.config.body} onChange={(e) => onChange({ ...node, config: { ...node.config, body: e.target.value } })} />
        </div>
    )}
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Switch checked={node.config.asJSON} onCheckedChange={(v) => onChange({ ...node, config: { ...node.config, asJSON: v } })} />
            <Label>Parse JSON</Label>
        </div>
    </div>
</div>
);
}

function LLMNodeInspector({ node, onChange }: { node: LLMNode; onChange: (n: LLMNode) => void }) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select value={node.config.provider} onValueChange={(v: any) => onChange({ ...node, config: { ...node.config, provider: v } })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {(["openai", "anthropic", "azure-openai", "ollama", "other"] as const).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Model</Label>
                <Input value={node.config.model} onChange={(e) => onChange({ ...node, config: { ...node.config, model: e.target.value } })} />
            </div>
        </div>
    <div className="space-y-2">
        <Label>System</Label>
        <Textarea rows={2} value={node.config.system || ""} onChange={(e) => onChange({ ...node, config: { ...node.config, system: e.target.value } })} />
    </div>
    <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea rows={5} value={node.config.prompt} onChange={(e) => onChange({ ...node, config: { ...node.config, prompt: e.target.value } })} />
    </div>
    <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
            <Label>Temperature</Label>
            <Input type="number" step="0.1" value={node.config.temperature} onChange={(e) => onChange({ ...node, config: { ...node.config, temperature: Number(e.target.value) } })} />
        </div>
        <div className="space-y-2">
            <Label>Save As</Label>
            <Input value={node.config.saveAs} onChange={(e) => onChange({ ...node, config: { ...node.config, saveAs: e.target.value } })} />
        </div>
    </div>
</div>
);
}

function ConditionInspector({ node, onChange }: { node: ConditionNode; onChange: (n: ConditionNode) => void }) {
    return (
        <div className="space-y-2">
            <Label>Expression (JS, use ctx)</Label>
            <Input value={node.config.expression} onChange={(e) => onChange({ ...node, config: { expression: e.target.value } })} placeholder="ctx.score > 0.8" />
            <div className="text-xs text-zinc-400">Ports: <Badge className="mx-1">true</Badge> <Badge>false</Badge> (fallback to out)</div>
        </div>
    );
}

function LoopInspector({ node, onChange }: { node: LoopNode; onChange: (n: LoopNode) => void }) {
    return (
        <div className="space-y-3">
            <div className="space-y-2">
                <Label>Mode</Label>
                <Select value={node.config.mode} onValueChange={(v: any) => onChange({ ...node, config: { ...node.config, mode: v } })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="times">times</SelectItem>
                        <SelectItem value="forEach">forEach</SelectItem>
                        <SelectItem value="while">while</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {node.config.mode === "times" && (
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <Label>Times</Label>
                        <Input type="number" value={node.config.times ?? 1} onChange={(e) => onChange({ ...node, config: { ...node.config, times: Number(e.target.value) } })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Max Iters</Label>
                        <Input type="number" value={node.config.maxIterations ?? 100} onChange={(e) => onChange({ ...node, config: { ...node.config, maxIterations: Number(e.target.value) } })} />
                    </div>
                </div>
            )}
            {node.config.mode === "forEach" && (
                <div className="space-y-2">
                    <Label>List Expr (JS)</Label>
                    <Input value={node.config.listExpr || ""} onChange={(e) => onChange({ ...node, config: { ...node.config, listExpr: e.target.value } })} placeholder="ctx.items" />
                </div>
            )}
            {node.config.mode === "while" && (
                <div className="space-y-2">
                    <Label>While Expr (JS)</Label>
                    <Input value={node.config.whileExpr || ""} onChange={(e) => onChange({ ...node, config: { ...node.config, whileExpr: e.target.value } })} placeholder="ctx.count < 5" />
                </div>
            )}
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label>Iter Name</Label>
                    <Input value={node.config.iterName} onChange={(e) => onChange({ ...node, config: { ...node.config, iterName: e.target.value } })} />
                </div>
                <div className="space-y-2">
                    <Label>Max Iters</Label>
                    <Input type="number" value={node.config.maxIterations ?? 100} onChange={(e) => onChange({ ...node, config: { ...node.config, maxIterations: Number(e.target.value) } })} />
                </div>
            </div>
            <div className="text-xs text-zinc-400">Ports: <Badge className="mx-1">body</Badge> (loop body) → <Badge>out</Badge> (after loop)</div>
        </div>
    );
}

function TryCatchInspector({ node, onChange }: { node: TryCatchNode; onChange: (n: TryCatchNode) => void }) {
    return (
        <div className="space-y-2">
            <Label>Note</Label>
            <Input value={node.config.note || ""} onChange={(e) => onChange({ ...node, config: { note: e.target.value } })} />
            <div className="text-xs text-zinc-400">Ports: <Badge className="mx-1">body</Badge> (try) • <Badge className="mx-1">catch</Badge> (on error) → <Badge>out</Badge></div>
        </div>
    );
}

function DelayInspector({ node, onChange }: { node: DelayNode; onChange: (n: DelayNode) => void }) {
    return (
        <div className="space-y-2">
            <Label>Milliseconds</Label>
            <Input type="number" value={node.config.ms} onChange={(e) => onChange({ ...node, config: { ms: Number(e.target.value) } })} />
        </div>
    );
}

function VariablesInspector({ node, onChange }: { node: VariablesNode; onChange: (n: VariablesNode) => void }) {
    return (
        <div className="space-y-2">
            <Label>JSON</Label>
            <Textarea rows={8} value={node.config.json} onChange={(e) => onChange({ ...node, config: { json: e.target.value } })} />
        </div>
    );
}

function createStarterWorkflow(): Workflow {
    const vars: VariablesNode = {
        id: genId(), kind: "variables", name: "Seed Vars", pos: { x: 40, y: 80 },
        config: { json: JSON.stringify({ query: "what is zappier?", items: ["alpaca", "llama", "vicuna"], score: 0.9 }, null, 2) }
    };
    const api: APINode = {
        id: genId(), kind: "api", name: "Search API", pos: { x: 320, y: 80 },
        config: { method: "GET", url: "https://httpbin.org/get?query={{query}}", headers: {}, body: "", saveAs: "apiResult", asJSON: true }
    };
    const llm: LLMNode = {
        id: genId(), kind: "llm", name: "Summarize", pos: { x: 600, y: 80 },
        config: { provider: "openai", model: "gpt-4o-mini", prompt: "Summarize: {{apiResult}}", system: "You are concise.", temperature: 0.2, saveAs: "summary" }
    };
    const cond: ConditionNode = { id: genId(), kind: "condition", name: "Has Summary?", pos: { x: 880, y: 70 }, config: { expression: "(ctx.summary||'').length>0" } };
    const loop: LoopNode = { id: genId(), kind: "loop", name: "ForEach Item", pos: { x: 880, y: 170 }, config: { mode: "forEach", listExpr: "ctx.items", iterName: "item", maxIterations: 10 } };
    const llm2: LLMNode = { id: genId(), kind: "llm", name: "Classify", pos: { x: 1160, y: 170 }, config: { provider: "openai", model: "gpt-4o-mini", prompt: "Classify {{item}} as animal or other", temperature: 0, saveAs: "lastClass" } };
    const tryc: TryCatchNode = { id: genId(), kind: "trycatch", name: "Try API", pos: { x: 320, y: 220 }, config: { note: "Call may fail" } };
    const badApi: APINode = { id: genId(), kind: "api", name: "Unreliable API", pos: { x: 600, y: 220 }, config: { method: "GET", url: "https://httpbin.org/status/400", headers: {}, body: "", saveAs: "bad", asJSON: false } };
    const delay: DelayNode = { id: genId(), kind: "delay", name: "Wait", pos: { x: 880, y: 220 }, config: { ms: 400 } };

    const nodes: AnyNode[] = [vars, api, llm, cond, loop, llm2, tryc, badApi, delay];
    const edges: Edge[] = [
        { id: genId(), from: { nodeId: vars.id, port: "out" }, to: { nodeId: api.id } },
        { id: genId(), from: { nodeId: api.id, port: "out" }, to: { nodeId: llm.id } },
        { id: genId(), from: { nodeId: llm.id, port: "out" }, to: { nodeId: cond.id } },
        { id: genId(), from: { nodeId: cond.id, port: "true" }, to: { nodeId: loop.id } },
        { id: genId(), from: { nodeId: loop.id, port: "body" }, to: { nodeId: llm2.id } },
        { id: genId(), from: { nodeId: llm2.id, port: "out" }, to: { nodeId: delay.id } },

        { id: genId(), from: { nodeId: tryc.id, port: "body" }, to: { nodeId: badApi.id } },
        { id: genId(), from: { nodeId: badApi.id, port: "out" }, to: { nodeId: delay.id } },
        { id: genId(), from: { nodeId: badApi.id, port: "catch" }, to: { nodeId: delay.id } }, // unreachable; API throws error and main loop catch follows catch-port if present
    ];

    return { nodes, edges, startId: vars.id, meta: { name: "Starter: Search → Summarize → Loop Classify" } };
}

// ----------------------------- Server Route Stubs (Docs) -----------------------------
/**
 * Create /api/proxy route (Next.js App Router example):
 *
 * // app/api/proxy/route.ts
 * import { NextRequest, NextResponse } from "next/server";
 * export async function POST(req: NextRequest) {
 *   const { method, url, headers, body } = await req.json();
 *   const resp = await fetch(url, { method, headers, body });
 *   const buf = await resp.arrayBuffer();
 *   const out = new NextResponse(buf, { status: resp.status });
 *   resp.headers.forEach((v, k) => out.headers.set(k, v));
 *   return out;
 * }
 *
 * Create /api/llm route to call your provider securely:
 * // app/api/llm/route.ts
 * import { NextRequest, NextResponse } from "next/server";
 * export async function POST(req: NextRequest) {
 *   const { provider, model, prompt, system, temperature } = await req.json();
 *   // TODO: switch by provider and call server-side SDK with your API key(s)
 *   // For demo, just echo prompt
 *   return NextResponse.json({ output: `Echo: ${prompt.slice(0, 140)}` });
 * }
 */
