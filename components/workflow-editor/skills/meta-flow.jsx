'use client';

import { useState, useCallback, useEffect } from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Label} from '@/components/ui/label';

import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    Background,
    Panel,
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Node component to display the step name
const CustomNode = ({ data }) => {
    return (
        <div className="bg-white border-2 border-gray-500 rounded-lg p-3 shadow-md text-center min-w-[150px] transition-transform duration-200 transform hover:scale-105">
            <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-3 !h-3" />
            <div className="font-bold text-lg text-gray-800">{data.label}</div>
            <div className="text-sm text-gray-600">{data.description}</div>
            <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-3 !h-3" />
        </div>
    );
};

const nodeTypes = {
    customNode: CustomNode,
};

// Main App component for the Query Flow Designer
export default function MetaFlow() {
    // State to hold the array of flow steps, which is the source of truth for the app
    const [flowSteps, setFlowSteps] = useState([
        { id: 'step-1', name: 'Initial Query', type: 'Query Input', input: 'User query (e.g., "running shoes")', output: 'Parsed query schema' },
        { id: 'step-2', name: 'Product Retrieval', type: 'Database Lookup', input: 'Parsed query schema', output: 'List of relevant product documents', config: { queryType: 'products', schema: 'Schema: Personalization, Categories' } },
        { id: 'step-3', name: 'Content Summarization', type: 'LLM Call', input: 'List of relevant product documents', output: 'Formatted product summaries', config: { modelName: 'gemini-1.5-pro', prompt: 'Summarize the following products...' } },
    ]);

    // State for the current step being edited
    const [editingStep, setEditingStep] = useState(null);

    // Function to add a new step to the flow
    const handleAddStep = () => {
        const newStep = {
            id: `step-${Date.now()}`,
            name: `New Step ${flowSteps.length + 1}`,
            type: 'LLM Call',
            input: '',
            output: '',
            config: {}
        };
        setFlowSteps([...flowSteps, newStep]);
        setEditingStep(newStep.id);
    };

    // Function to update a step's details
    const handleUpdateStep = (id, field, value) => {
        setFlowSteps(flowSteps.map(step =>
            step.id === id ? { ...step, [field]: value } : step
        ));
    };

    // Function to update nested configuration fields
    const handleUpdateConfig = (id, key, value) => {
        setFlowSteps(flowSteps.map(step =>
            step.id === id ? { ...step, config: { ...step.config, [key]: value } } : step
        ));
    };

    // Function to delete a step
    const handleDeleteStep = (id) => {
        setFlowSteps(flowSteps.filter(step => step.id !== id));
        if (editingStep === id) {
            setEditingStep(null);
        }
    };

    return (
        <div className="flex flex-col h-screen p-8 bg-gray-100 font-inter antialiased">
            <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Query Flow Designer</h1>
            <p className="text-center text-gray-600 mb-8">
                Visually design and configure your multi-step AI query flow.
            </p>

            <div className="flex flex-1 overflow-hidden space-x-8">
                {/* Left Panel: Flow Steps List */}
                <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Flow Steps</h2>
                        <Button onClick={handleAddStep}>Add Step</Button>
                    </div>
                    <div className="space-y-4">
                        {flowSteps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex justify-between items-center p-4 rounded-lg cursor-pointer transition-colors ${
                                    editingStep === step.id ? 'bg-blue-100 border border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                                onClick={() => setEditingStep(step.id)}
                            >
                                <span className="font-medium text-gray-800">{step.name}</span>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStep(step.id);
                                    }}
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700 p-0 h-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Step Editor */}
                <Card className="flex-1 overflow-y-auto">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-gray-700">Step Editor</h2>
                    </CardHeader>
                    <CardContent>
                        {editingStep ? (
                            <StepEditor
                                step={flowSteps.find(step => step.id === editingStep)}
                                onUpdate={handleUpdateStep}
                                onUpdateConfig={handleUpdateConfig}
                            />
                        ) : (
                            <div className="text-center p-8 text-gray-500">
                                <p className="mb-2">Select a step from the left to edit, or add a new one.</p>
                                <p>The "Query Input" is represented by the first step in the flow.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Live Preview Section with React Flow */}
            <Card className="mt-8 p-6 shadow-lg h-64">
                <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-700">Live Preview (Interactive Flow)</h2>
                </CardHeader>
                <CardContent className="h-full w-full">
                    <FlowPreview steps={flowSteps} setEditingStep={setEditingStep} />
                </CardContent>
            </Card>
        </div>
    );
}

// Component for editing a single step
function StepEditor({ step, onUpdate, onUpdateConfig }) {
    const renderConfigOptions = () => {
        switch (step.type) {
            case 'LLM Call':
                return (
                    <>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Model Name</label>
                            <input
                                type="text"
                                value={step.config.modelName || ''}
                                onChange={(e) => onUpdateConfig(step.id, 'modelName', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g., gemini-1.5-pro"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Prompt</label>
                            <textarea
                                value={step.config.prompt || ''}
                                onChange={(e) => onUpdateConfig(step.id, 'prompt', e.target.value)}
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter the prompt for this LLM call..."
                            />
                        </div>
                    </>
                );
            case 'Database Lookup':
                return (
                    <>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Query Type</label>
                            <select
                                value={step.config.queryType || 'products'}
                                onChange={(e) => onUpdateConfig(step.id, 'queryType', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="products">Products</option>
                                <option value="users">Users</option>
                                <option value="reviews">Reviews</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Schema</label>
                            <textarea
                                value={step.config.schema || ''}
                                onChange={(e) => onUpdateConfig(step.id, 'schema', e.target.value)}
                                rows="2"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g., Schema: Personalization, Categories"
                            />
                        </div>
                    </>
                );
            case 'Function Call':
                return (
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Function Name</label>
                        <input
                            type="text"
                            value={step.config.functionName || ''}
                            onChange={(e) => onUpdateConfig(step.id, 'functionName', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g., calculate_shipping"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Step: {step.name}</h2>

            <div>
                <label className="block text-gray-700 font-medium mb-1">Step Name</label>
                <input
                    type="text"
                    value={step.name}
                    onChange={(e) => onUpdate(step.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-1">Step Type</label>
                <select
                    value={step.type}
                    onChange={(e) => onUpdate(step.id, 'type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                >
                    <option value="Query Input">Query Input</option>
                    <option value="LLM Call">LLM Call</option>
                    <option value="Database Lookup">Database Lookup</option>
                    <option value="Function Call">Function Call</option>
                </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Step Configuration</h3>
                {renderConfigOptions()}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-1">Input Description</label>
                <textarea
                    value={step.input}
                    onChange={(e) => onUpdate(step.id, 'input', e.target.value)}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Describe the expected input for this step."
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-1">Output Description</label>
                <textarea
                    value={step.output}
                    onChange={(e) => onUpdate(step.id, 'output', e.target.value)}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Describe the expected output of this step."
                />
            </div>
        </div>
    );
}

// Component to render a live preview using React Flow
function FlowPreview({ steps, setEditingStep }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesState] = useEdgesState([]);

    // This effect runs whenever the main `steps` state changes.
    useEffect(() => {
        // Convert flow steps to React Flow nodes
        const newNodes = steps.map((step, index) => {
            // Calculate a horizontal position for the node
            const xPos = index * 250;
            const yPos = 150;
            return {
                id: step.id,
                position: { x: xPos, y: yPos },
                data: { label: step.name, description: step.type, input: step.input, output: step.output },
                type: 'customNode', // Use the custom node type
                style: {
                    border: 'none',
                    padding: '0'
                }
            };
        });
        setNodes(newNodes);

        // Convert flow steps into edges (connections between nodes)
        const newEdges = steps.slice(1).map((step, index) => ({
            id: `edge-${steps[index].id}-${step.id}`,
            source: steps[index].id,
            target: step.id,
            animated: true,
            label: 'Data Flow',
            style: { stroke: '#60a5fa' },
        }));
        setEdges(newEdges);
    }, [steps, setNodes, setEdges]);

    // Callback to handle when a node is clicked, updating the editing panel
    const onNodeClick = useCallback((event, node) => {
        setEditingStep(node.id);
    }, [setEditingStep]);

    // Callback for handling new connections
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesState}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            nodeTypes={nodeTypes}
        >
            <MiniMap />
            <Controls />
            <Background variant="dots" gap={12} size={1} />
            <Panel position="top-right">
        <span className="text-xs text-gray-500 bg-white p-2 rounded-md shadow-md">
          Drag nodes to rearrange
        </span>
            </Panel>
        </ReactFlow>
    );
}
