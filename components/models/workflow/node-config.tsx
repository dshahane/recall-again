// File: components/workflow/NodeConfig.tsx
'use client'

import React, { FC } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    AnyNode,
    APINode,
    LLMNode,
    ConditionNode,
    LoopNode,
    TryCatchNode,
    DelayNode,
    VariablesNode
} from './types';

interface NodeConfigProps {
    node: AnyNode;
    onChange: (id: string, newConfig: any) => void;
    onNameChange: (id: string, newName: string) => void;
}

// Type guard function
function hasConfig(node: AnyNode): node is APINode | LLMNode | ConditionNode | LoopNode | TryCatchNode | DelayNode | VariablesNode {
    return 'config' in node;
}

const NodeConfig: FC<NodeConfigProps> = ({ node, onChange, onNameChange }) => {
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

                {/* Use the type guard to conditionally render configuration */}
                {hasConfig(node) ? (
                    <>
                        {/* LLM Node Configuration */}
                        {node.kind === "llm" && (
                            <>
                                <Label htmlFor="llm-model">Model</Label>
                                <Input
                                    id="llm-model"
                                    value={node.config.model}
                                    onChange={(e) => onChange(node.id, { ...node.config, model: e.target.value })}
                                />
                                <Label htmlFor="llm-prompt">Prompt</Label>
                                <Textarea
                                    id="llm-prompt"
                                    value={node.config.prompt}
                                    onChange={(e) => onChange(node.id, { ...node.config, prompt: e.target.value })}
                                />
                            </>
                        )}

                        {/* API Node Configuration */}
                        {node.kind === "api" && (
                            <>
                                <Label htmlFor="api-url">URL</Label>
                                <Input
                                    id="api-url"
                                    value={node.config.url}
                                    onChange={(e) => onChange(node.id, { ...node.config, url: e.target.value })}
                                />
                                <Label htmlFor="api-method">Method</Label>
                                <Input
                                    id="api-method"
                                    value={node.config.method}
                                    onChange={(e) => onChange(node.id, { ...node.config, method: e.target.value })}
                                />
                                <Label htmlFor="api-save-as">Save As</Label>
                                <Input
                                    id="api-save-as"
                                    value={node.config.saveAs}
                                    onChange={(e) => onChange(node.id, { ...node.config, saveAs: e.target.value })}
                                />
                            </>
                        )}

                        {/* Condition Node Configuration */}
                        {node.kind === "condition" && (
                            <>
                                <Label htmlFor="condition-expression">Expression</Label>
                                <Textarea
                                    id="condition-expression"
                                    value={node.config.expression}
                                    onChange={(e) => onChange(node.id, { ...node.config, expression: e.target.value })}
                                />
                            </>
                        )}

                        {/* Loop Node Configuration */}
                        {node.kind === "loop" && (
                            <>
                                <Label htmlFor="loop-mode">Mode</Label>
                                <Input
                                    id="loop-mode"
                                    value={node.config.mode}
                                    onChange={(e) => onChange(node.id, { ...node.config, mode: e.target.value })}
                                />
                            </>
                        )}

                        {/* Delay Node Configuration */}
                        {node.kind === "delay" && (
                            <>
                                <Label htmlFor="delay-ms">Delay (ms)</Label>
                                <Input
                                    id="delay-ms"
                                    type="number"
                                    value={node.config.ms}
                                    onChange={(e) => onChange(node.id, { ...node.config, ms: parseInt(e.target.value) })}
                                />
                            </>
                        )}

                        {/* Try/Catch Node Configuration */}
                        {node.kind === "trycatch" && (
                            <div className="text-sm text-zinc-400">
                                This node does not require a configuration.
                            </div>
                        )}

                        {/* Variables Node Configuration */}
                        {node.kind === "variables" && (
                            <>
                                <Label htmlFor="variables-json">JSON</Label>
                                <Textarea
                                    id="variables-json"
                                    value={node.config.json}
                                    onChange={(e) => onChange(node.id, { ...node.config, json: e.target.value })}
                                />
                            </>
                        )}
                    </>
                ) : (
                    // Other generic nodes
                    <div className="text-sm text-zinc-400">
                        This node does not require a specific configuration.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NodeConfig;