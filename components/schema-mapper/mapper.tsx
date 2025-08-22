"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
    Background,
    Controls,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Node,
    Handle,
    Position,
    useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
    FunctionSquare,
    Hash,
    Calendar,
    Type,
} from "lucide-react"; // icons

// -----------------------------
// Types
// -----------------------------
import { SchemaSpec } from "@/app/types/mapper";
export type FnCategory = "string" | "numeric" | "date";

export type FnMeta = {
    label: string;
    inputs: number | "many";
    category: FnCategory;
};

export type FunctionRegistry = Record<string, FnMeta>;

export interface SchemaMapperProps {
    sourceSchemas: SchemaSpec[];
    destinationSchema: SchemaSpec;
    functions?: FunctionRegistry;
    initialNodes?: Node[];
    initialEdges?: Edge[];
    onChange?: (state: { nodes: Node[]; edges: Edge[] }) => void;
    className?: string;
    showToolbar?: boolean;
}

// -----------------------------
// Default function registry
// -----------------------------
const DEFAULT_FUNCTIONS: FunctionRegistry = {
    concat: { label: "Concat", inputs: "many", category: "string" },
    substring: { label: "Substring", inputs: 2, category: "string" },
    upperCase: { label: "Upper Case", inputs: 1, category: "string" },
    sum: { label: "Sum", inputs: "many", category: "numeric" },
    divide: { label: "Divide", inputs: 2, category: "numeric" },
    formatDate: { label: "Format Date", inputs: 2, category: "date" },
};

// -----------------------------
// Custom Nodes
// -----------------------------
const NamespaceGroupNode: React.FC<{ data: any }> = ({ data }) => {
    const { label, fields, nodeType, color } = data;
    const [collapsed, setCollapsed] = React.useState(false);
    const toggle = () => setCollapsed(!collapsed);

    return (
        <div
            className={`w-64 rounded-xl border p-2 shadow-sm bg-gray-800`}
            style={{
                backgroundColor: '#1f2937', // dark slate gray
                color: '#f9fafb', // light text
                borderColor: '#374151', // darker border
            }}
        >
            <div
                className="flex justify-between items-center mb-1 cursor-pointer"
                onClick={toggle}
            >
                <div className="font-semibold text-sm">
                    {label} {data.version ? `(v${data.version})` : ""}
                </div>
                <Button size="xs" variant="outline">
                    {collapsed ? "+" : "-"}
                </Button>
            </div>
            {!collapsed && (
                <div className="space-y-1">
                    {fields.map((f: string) => (
                        <div
                            key={f}
                            className="relative flex items-center justify-between text-xs"
                        >
                            {nodeType === "destination" && (
                                <Handle type="target" position={Position.Left} id={f} />
                            )}
                            <span className="truncate">{f}</span>
                            {nodeType === "source" && (
                                <Handle type="source" position={Position.Right} id={f} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const FunctionNode: React.FC<{ id: string; data: any }> = ({ id, data }) => {
    const { setNodes } = useReactFlow();
    const registry: FunctionRegistry = data.registry || DEFAULT_FUNCTIONS;
    const meta = registry[data.fn as string];
    if (!meta)
        return (
            <div className="rounded-xl border border-destructive bg-destructive/10 p-2 text-xs">
                Unknown fn
            </div>
        );

    const numInputs = meta.inputs === "many" ? data.inputs || 2 : meta.inputs;
    const addInput = () => {
        if (meta.inputs === "many")
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === id
                        ? {
                            ...n,
                            data: { ...n.data, inputs: (n.data.inputs || 2) + 1 },
                        }
                        : n
                )
            );
    };
    const removeInput = () => {
        if (meta.inputs === "many")
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === id
                        ? {
                            ...n,
                            data: { ...n.data, inputs: Math.max(1, (n.data.inputs || 2) - 1) },
                        }
                        : n
                )
            );
    };

    const catHue: Record<FnCategory, string> = {
        string: "bg-indigo-50 border-indigo-300",
        numeric: "bg-emerald-50 border-emerald-300",
        date: "bg-amber-50 border-amber-300",
    };

    return (
        <div
            className={`w-48 rounded-2xl border p-2 text-xs shadow-sm ${catHue[meta.category]}`}
            style={{
                backgroundColor: '#111827', // dark background
                color: '#f9fafb',           // light text
                borderColor: '#374151',
            }}
        >
            <div className="mb-1 flex items-center justify-between">
                <div className="font-semibold">{meta.label}</div>
                <Badge className="text-[10px] capitalize" variant="outline">
                    {meta.category}
                </Badge>
            </div>
            {Array.from({ length: numInputs as number }).map((_, i) => (
                <Handle
                    key={i}
                    type="target"
                    position={Position.Left}
                    id={`in${i + 1}`}
                    style={{ top: `${40 + i * 18}%` }}
                />
            ))}
            <Handle type="source" position={Position.Right} id="out" />
            {meta.inputs === "many" && (
                <div className="mt-2 flex items-center justify-center gap-2">
                    <Button size="xs" variant="secondary" onClick={addInput}>
                        + Add
                    </Button>
                    <Button size="xs" variant="ghost" onClick={removeInput}>
                        – Remove
                    </Button>
                </div>
            )}
        </div>
    );
};

const nodeTypes = { namespace: NamespaceGroupNode, function: FunctionNode };

// -----------------------------
// Palette
// -----------------------------
const ICONS: Record<FnCategory, React.ReactNode> = {
    string: <Type className="w-4 h-4 text-indigo-600" />,
    numeric: <Hash className="w-4 h-4 text-emerald-600" />,
    date: <Calendar className="w-4 h-4 text-amber-600" />,
};

const Palette: React.FC<{ registry: FunctionRegistry }> = ({ registry }) => {
    const grouped = useMemo(() => {
        const g: Record<FnCategory, [string, FnMeta][]> = {
            string: [],
            numeric: [],
            date: [],
        };
        Object.entries(registry).forEach((kv) =>
            g[kv[1].category].push(kv as any)
        );
        return g;
    }, [registry]);

    const onDragStart = (e: React.DragEvent, key: string) => {
        e.dataTransfer.setData("application/reactflow", key);
        e.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="h-full w-64 border-r bg-white dark:bg-gray-950 flex flex-col">
            <div className="px-3 py-2 font-semibold text-sm">Functions</div>
            <Separator />
            <ScrollArea className="flex-1 p-2">
                {(Object.keys(grouped) as FnCategory[]).map((cat) => (
                    <div key={cat} className="mb-4">
                        <div className="mb-2 flex items-center gap-2">
                            {ICONS[cat]}
                            <Badge variant="outline" className="capitalize">
                                {cat}
                            </Badge>
                        </div>
                        <div className="grid gap-2">
                            {grouped[cat].map(([key, meta]) => (
                                <Button
                                    key={key}
                                    variant="secondary"
                                    className="justify-start gap-2"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, key)}
                                >
                                    <FunctionSquare className="w-4 h-4" />
                                    {meta.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};

// -----------------------------
// Main SchemaMapper
// -----------------------------
export function SchemaMapper({
                                 sourceSchemas,
                                 destinationSchema,
                                 functions = DEFAULT_FUNCTIONS,
                                 initialNodes,
                                 initialEdges,
                                 onChange,
                                 className,
                                 showToolbar = true,
                             }: SchemaMapperProps) {
    const seedNodes = useMemo<Node[]>(() => {
        if (initialNodes && initialNodes.length) return initialNodes;
        const colors = ["bg-blue-50", "bg-green-50", "bg-rose-50", "bg-purple-50"];
        const srcNodes: Node[] = sourceSchemas.map((s, i) => ({
            id: `src-${i}`,
            type: "namespace",
            position: { x: 60, y: 120 * i },
            data: {
                ...s,
                nodeType: "source",
                color: colors[i % colors.length],
            },
        }));
        const dstNode: Node = {
            id: "dest",
            type: "namespace",
            position: { x: 740, y: 100 },
            data: {
                ...destinationSchema,
                nodeType: "destination",
                color: "bg-slate-50",
            },
        };
        return [...srcNodes, dstNode];
    }, [sourceSchemas, destinationSchema, initialNodes]);

    const [nodes, setNodes, onNodesChange] = useNodesState(seedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);

    useEffect(() => {
        onChange?.({ nodes, edges });
    }, [nodes, edges, onChange]);

    const onConnect = useCallback(
        (c: Edge | Connection) => setEdges((eds) => addEdge(c, eds)),
        []
    );

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const fnKey = event.dataTransfer.getData("application/reactflow");
            if (!fnKey) return;
            const bounds = (event.target as HTMLElement).getBoundingClientRect();
            const position = {
                x: event.clientX - bounds.left - 60,
                y: event.clientY - bounds.top - 20,
            };
            const id = `${fnKey}-${Date.now()}`;
            setNodes((nds) =>
                nds.concat({
                    id,
                    type: "function",
                    position,
                    data: { fn: fnKey, inputs: 2, registry: functions },
                })
            );
        },
        [setNodes, functions]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const handleExport = () => {
        const mapping = nodes
            .filter((n) => n.type === "function")
            .map((fnNode) => ({ id: fnNode.id, fn: fnNode.data.fn }));
        const blob = new Blob(
            [JSON.stringify({ meta: { sourceSchemas, destinationSchema }, mappings: mapping }, null, 2)],
            { type: "application/json" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mapping.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`h-[80vh] w-full overflow-hidden border rounded-xl ${className || ""}`}>
            {showToolbar && (
                <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
                    <div className="font-semibold text-base">Schema Mapping</div>
                    <Button variant="outline" onClick={handleExport}>
                        Export Mapping
                    </Button>
                </div>
            )}
            <div className="flex h-[calc(80vh-3rem)] w-full">
                <Palette registry={functions} />
                <div className="relative flex-1">
                    <ReactFlowProvider>
                        <div
                            className="absolute inset-0"
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        >
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                nodeTypes={nodeTypes}
                                fitView
                            >
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </div>
                    </ReactFlowProvider>
                </div>
            </div>
        </div>
    );
}
