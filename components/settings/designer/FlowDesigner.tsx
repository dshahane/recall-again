import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Define a type for the flow data that will be saved.
type FlowData = {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
};

// Define the props for the FlowDesigner component.
type FlowDesignerProps = {
  flowName: string;
  flowDescription: string;
  // onSave is a function that will be called with the saved flow data.
  // In a real application, this would likely be an API call.
  onSave: (data: FlowData) => void;
  // onDismiss is called to close the designer, often after saving.
  onDismiss: () => void;
};

// A unique ID counter for new nodes.
let id = 0;
const getId = () => `dndnode_${id++}`;

// The main FlowDesigner component.
const FlowDesigner: React.FC<FlowDesignerProps> = ({ flowName, flowDescription, onSave, onDismiss }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [name, setName] = useState(flowName);
  const [description, setDescription] = useState(flowDescription);

  // Callback to add a new edge when a connection is made.
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handler for when an element is dragged over the canvas.
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handler for when an element is dropped on the canvas.
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // Handler for a save and dismiss action.
  const handleSaveAndDismiss = useCallback(() => {
    const flowData: FlowData = {
      name,
      description,
      nodes,
      edges,
    };
    onSave(flowData);
    onDismiss();
  }, [name, description, nodes, edges, onSave, onDismiss]);

  // A simple palette item that can be dragged.
  const PaletteItem: React.FC<{ type: string; label: string }> = ({ type, label }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    };

    return (
      <div
        className="px-4 py-2 my-2 border border-blue-500 rounded-md cursor-grab bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
        {label}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Flow Designer</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="p-2 border rounded-md text-sm w-48"
            placeholder="Flow Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="p-2 border rounded-md text-sm w-64"
            placeholder="Flow Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={handleSaveAndDismiss}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Save & Dismiss
          </button>
        </div>
      </div>
      <div className="flex-grow flex border rounded-xl overflow-hidden bg-white shadow-lg">
        {/* Palette Section */}
        <div className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Activities</h2>
          <PaletteItem type="default" label="Default Node" />
          <PaletteItem type="input" label="Input Node" />
          <PaletteItem type="output" label="Output Node" />
          <PaletteItem type="custom-activity" label="Custom Activity" />
        </div>
        {/* React Flow Canvas */}
        <div className="flex-grow h-full" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              attributionPosition="bottom-left"
            >
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default FlowDesigner;
