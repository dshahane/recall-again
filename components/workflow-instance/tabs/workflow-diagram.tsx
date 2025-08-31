'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface WorkflowDiagramProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export function WorkflowDiagram({ initialNodes, initialEdges }: WorkflowDiagramProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
      (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
      []
  );
  const onEdgesChange = useCallback(
      (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
      []
  );
  const onConnect = useCallback(
      (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
      []
  );

  const nodeTypes = useMemo(() => ({
    // custom node types go here if needed
  }), []);

  return (
      <div className="h-[200px] w-full border border-gray-200 rounded-md">
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultViewport={{ x: 10, y: 10, zoom: 1.0 }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
  );
}
