// components/workflow/NeoWorkflowEngine.tsx
'use client'

import React, {useCallback, useMemo, useRef, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {useMouseDrag} from '@/hooks/use-mouse-drag';
import {useConnection} from '@/hooks/use-connection';
import {Vec2} from '@/app/types/app';

import {PortName, Workflow as WorkflowType} from '@/components/models/workflow/types';
import {getNodeMetadata, isSinkNode, isTriggerNode} from '@/components/models/workflow/node-config-types';
import {createStarterWorkflow, nodeRect, snap} from '@/components/models/workflow/workflow-utils';
import {deleteEdge, deleteNode, updateNodeConfig, updateNodeName} from '@/components/models/workflow//workflow-manager';
import {getPortPositions} from "@/components/models/workflow/port-config-types";

interface NeoWorkflowEngineProps {
    initialWorkflow?: WorkflowType;
    onCommit?: (workflow: WorkflowType) => void;
    children: (props: any) => React.ReactNode;
}

export default function NeoWorkflowEngine({initialWorkflow, onCommit, children}: NeoWorkflowEngineProps) {
    const [wf, setWf] = useState<WorkflowType>(() => initialWorkflow || createStarterWorkflow());
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | undefined>(undefined);
    const [draggedNode, setDraggedNode] = useState<any | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [loadString, setLoadString] = useState("");

    const canvasRef = useRef<HTMLDivElement | null>(null);

    const {
        onPortMouseDown,
        connectingFrom,
        connectingTo,
        onCanvasMouseMove,
        onCanvasMouseUp,
        resetConnection: resetHookConnection
    } = useConnection(canvasRef);

    const {handleMouseDown: onNodeDragStart, currentDraggedPos: draggedNodePos} = useMouseDrag(
        (finalPos) => {
            if (selectedId) {
                setWf(prevWf => ({
                    ...prevWf,
                    nodes: prevWf.nodes.map(n => (n.id === selectedId ? {
                        ...n,
                        pos: snap(finalPos.x, finalPos.y) as Vec2
                    } : n))
                }));
            }
        }
    );

    const {handleMouseDown: onEdgeControlPointDragStart} = useMouseDrag(
        (finalPos) => {
            if (selectedEdgeId) {
                setWf(prevWf => ({
                    ...prevWf,
                    edges: prevWf.edges.map(edge => {
                        if (edge.id === selectedEdgeId) {
                            return {...edge, c1: finalPos};
                        }
                        return edge;
                    })
                }));
            }
        }
    );

    const onNodeDrag = useCallback((id: string, e: React.MouseEvent) => {
        const node = wf.nodes.find(n => n.id === id);
        if (!node) return;
        setSelectedId(id);
        setSelectedEdgeId(undefined);
        onNodeDragStart(e, node.pos);
    }, [wf.nodes, setSelectedId, setSelectedEdgeId, onNodeDragStart]);

    const handleNodeClick = useCallback((nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedId(nodeId);
        setSelectedEdgeId(undefined);
    }, []);

    const handleCanvasClick = useCallback(() => {
        setSelectedId(undefined);
        setSelectedEdgeId(undefined);
    }, []);

    const handleEdgeClick = useCallback((edgeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEdgeId(edgeId);
        setSelectedId(undefined);
    }, []);

    const handleDragControlPoint = useCallback((edgeId: string, controlPoint: 'c1' | 'c2', e: React.MouseEvent) => {
        e.stopPropagation();
        const edge = wf.edges.find(e => e.id === edgeId);
        if (!edge) return;
        const initialPoint = edge[controlPoint] || {x: 0, y: 0};
        onEdgeControlPointDragStart(e, initialPoint);
    }, [wf.edges, onEdgeControlPointDragStart]);

    const onDeleteNode = useCallback((id: string) => {
        setWf(w => deleteNode(w, id));
        if (selectedId === id) setSelectedId(undefined);
    }, [selectedId]);

    const onDeleteEdge = useCallback((id: string) => {
        setWf(w => deleteEdge(w, id));
        setSelectedEdgeId(undefined);
    }, []);

    const handleConfigChange = useCallback((id: string, newConfig: any) => {
        setWf(w => updateNodeConfig(w, id, newConfig));
    }, []);

    const handleNameChange = useCallback((id: string, newName: string) => {
        setWf(w => updateNodeName(w, id, newName));
    }, []);

    const onPortMouseUp = useCallback((toNodeId: string, toPort: PortName, e: React.MouseEvent) => {
        e.stopPropagation();
        const fromNode = wf.nodes.find(n => n.id === connectingFrom?.nodeId);
        const toNode = wf.nodes.find(n => n.id === toNodeId);

        if (!fromNode || !toNode || !connectingFrom) {
            // Handle cases where nodes or connection info are missing
            resetHookConnection();
            return;
        }

        const fromNodeMeta = getNodeMetadata(fromNode.kind);
        const toNodeMeta = getNodeMetadata(toNode.kind);

        const fromPorts = getPortPositions(nodeRect.w, nodeRect.h, fromNodeMeta.portConfig);
        const toPorts = getPortPositions(nodeRect.w, nodeRect.h, toNodeMeta.portConfig);

        // Consolidated Validation Logic
        if (isTriggerNode(toNode.kind)) {
            console.error("Invalid connection: cannot connect to a Trigger node.");
        } else if (isSinkNode(fromNode.kind)) {
            console.error("Invalid connection: cannot connect from a Sink node.");
        } else if (fromPorts[connectingFrom.port]?.x === 0 && toPorts[toPort]?.x === 0) {
            console.error("Invalid connection: cannot connect two input ports.");
        } else if (connectingFrom.port === toPort) {
            console.error("Invalid connection: cannot connect an input to an input or an output to an output.");
        } else {
            // All validation passed, create the new edge
            const newEdgeId = uuidv4();
            setWf(prevWf => ({
                ...prevWf,
                edges: [...prevWf.edges, {
                    id: newEdgeId,
                    from: { nodeId: connectingFrom.nodeId, port: connectingFrom.port },
                    to: { nodeId: toNodeId, port: toPort },
                }]
            }));
            setSelectedEdgeId(newEdgeId);
            setSelectedId(undefined);
        }

        resetHookConnection();
    }, [connectingFrom, wf.nodes, resetHookConnection]);

    const selectedNode = useMemo(() => wf.nodes.find(n => n.id === selectedId), [wf.nodes, selectedId]);
    const selectedEdge = useMemo(() => wf.edges.find(e => e.id === selectedEdgeId), [wf.edges, selectedEdgeId]);

    const runWorkflow = useCallback(async () => {
        setRunning(true);
        // ... your run logic here ...
        setRunning(false);
    }, [wf]);

    const saveWorkflow = useCallback(() => {
        if (onCommit) {
            onCommit(wf);
        } else {
            return JSON.stringify(wf);
        }
    }, [wf, onCommit]);

    const loadWorkflow = useCallback((jsonString: string) => {
        try {
            const loadedWf = JSON.parse(jsonString);
            setWf(loadedWf);
            return true;
        } catch (e) {
            return false;
        }
    }, []);

    const api = {
        wf,
        canvasRef,
        draggedNode,
        draggedNodePos,
        connectingFrom,
        connectingTo,
        onCanvasMouseMove,
        onCanvasMouseUp,
        selectedId,
        selectedEdgeId,
        setWf,
        setDraggedNode,
        setModalMessage,
        setIsModalOpen,
        onNodeDrag,
        onNodeClick: handleNodeClick,
        onDeleteNode,
        onPortMouseDown,
        onPortMouseUp,
        handleEdgeClick,
        handleDragControlPoint,
        handleCanvasClick,
        selectedNode,
        selectedEdge,
        handleConfigChange,
        handleNameChange,
        onDeleteEdge,
        logs,
        running,
        isModalOpen,
        modalMessage,
        isLoadModalOpen,
        setIsLoadModalOpen,
        loadString,
        setLoadString,
        handleLoad: loadWorkflow,
        handleRun: runWorkflow,
        handleSave: saveWorkflow,
    };

    return <>{children(api)}</>;
}