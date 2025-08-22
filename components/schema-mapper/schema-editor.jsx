"use client";

import React, { useCallback } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Crosshair } from "lucide-react";

// ---------- Port Handle with Hover Crosshair ----------
function PortHandle({ type, position, id }) {
    const [hover, setHover] = React.useState(false);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Handle
                type={type}
                position={position}
                id={id}
                className="w-3 h-3 bg-blue-500 border border-white dark:border-gray-700 rounded-full hover:scale-110 transition-transform"
            />
            {hover && (
                <Crosshair className="absolute -top-5 left-1/2 -translate-x-1/2 text-blue-600 dark:text-blue-400 w-4 h-4 pointer-events-none" />
            )}
        </div>
    );
}

// ---------- Schema Node ----------
function SchemaNode({ data }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md px-4 py-2 w-48">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                {data.label}
            </p>
            <div className="space-y-1">
                {data.fields?.map((field, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-gray-700 dark:text-gray-300">{field}</span>
                        <PortHandle type="source" position={Position.Right} id={field} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------- Function Node ----------
function FunctionNode({ data }) {
    return (
        <div className="bg-indigo-50 dark:bg-indigo-900 border border-indigo-300 dark:border-indigo-700 rounded-xl shadow-md px-4 py-2 w-56">
            <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-100 mb-2">
                {data.label}
            </p>
            <div className="flex flex-col gap-2">
                {data.inputs?.map((input, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <PortHandle type="target" position={Position.Left} id={input} />
                        <span className="text-xs text-gray-800 dark:text-gray-200">{input}</span>
                    </div>
                ))}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-800 dark:text-gray-200">Output</span>
                    <PortHandle type="source" position={Position.Right} id="output" />
                </div>
            </div>
        </div>
    );
}

// ---------- Node Types ----------
const nodeTypes = {
    schema: SchemaNode,
    function: FunctionNode,
};

// ---------- Example SchemaEditor ----------
export default function SchemaEditor() {
    const initialNodes = [
        {
            id: "1",
            type: "schema",
            position: { x: 50, y: 100 },
            data: { label: "User Schema", fields: ["id", "name", "email"] },
        },
        {
            id: "2",
            type: "function",
            position: { x: 350, y: 100 },
            data: { label: "Transform Function", inputs: ["id", "name", "email"] },
        },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        []
    );

    return (
        <div className="h-[600px] w-full rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background gap={12} size={1} color="#ccc" />
                <MiniMap
                    nodeColor={(n) =>
                        n.type === "schema"
                            ? "#2563eb" // blue
                            : "#9333ea" // purple
                    }
                />
                <Controls />
            </ReactFlow>
        </div>
    );
}
