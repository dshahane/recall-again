// File: components/workflow/NodeConfig.tsx
'use client'

import React, {useCallback, useEffect, useState} from 'react';
import {AnyNode, _nodeIcons} from './types';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';

// Defines the props for the NodeConfig component
interface NodeConfigProps {
    node: AnyNode;
    onChange: (id: string, newConfig: any) => void;
    onNameChange: (id: string, newName: string) => void;
}

/**
 * A component to configure the properties of a selected node.
 * @param props - The component props.
 * @returns A React component for node configuration.
 */
export default function NodeConfig({ node, onChange, onNameChange }: NodeConfigProps) {
    const [config, setConfig] = useState(node.config);
    const [name, setName] = useState(node.name);

    // Update internal state when the selected node changes
    useEffect(() => {
        setConfig(node.config);
        setName(node.name);
    }, [node]);

    // Handle changes to node configuration
    const handleConfigChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newConfig = { ...config, [name]: value };
        setConfig(newConfig);
        onChange(node.id, newConfig);
    }, [config, onChange, node.id]);

    // Handle changes to the node's display name
    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        onNameChange(node.id, newName);
    }, [onNameChange, node.id]);

    const NodeIcon = nodeIcons[node.kind];

    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-inner bg-gray-200/50 dark:bg-zinc-800/50">
            <h3 className="font-bold text-lg flex items-center gap-2">
                {NodeIcon && <NodeIcon className="h-5 w-5 text-gray-500 dark:text-zinc-400" />}
                {node.name}
            </h3>
            <div className="space-y-2">
                <Label htmlFor="node-name">Name</Label>
                <Input
                    id="node-name"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                />
            </div>
            {node.kind === "query" && (
                <div className="space-y-2">
                    <Label htmlFor="query-text">Query Text</Label>
                    <Input
                        id="query-text"
                        name="text"
                        value={config?.text || ""}
                        onChange={handleConfigChange}
                    />
                </div>
            )}
            {node.kind === "document" && (
                <div className="space-y-2">
                    <Label htmlFor="document-content">Document Content</Label>
                    <Textarea
                        id="document-content"
                        name="content"
                        value={config?.content || ""}
                        onChange={handleConfigChange}
                        rows={6}
                    />
                </div>
            )}
            {(node.kind === "text-generation" || node.kind === "image-generation") && (
                <div className="space-y-2">
                    <Label htmlFor="generation-prompt">Prompt</Label>
                    <Textarea
                        id="generation-prompt"
                        name="prompt"
                        value={config?.prompt || ""}
                        onChange={handleConfigChange}
                        rows={6}
                    />
                </div>
            )}
            {node.kind === "action" && (
                <div className="space-y-2">
                    <Label htmlFor="action-code">Code</Label>
                    <Textarea
                        id="action-code"
                        name="code"
                        value={config?.code || ""}
                        onChange={handleConfigChange}
                        rows={10}
                    />
                </div>
            )}
            {node.kind === "table" && (
                <div className="space-y-2">
                    <Label htmlFor="table-name">Table Name</Label>
                    <Input
                        id="table-name"
                        name="name"
                        value={config?.name || ""}
                        onChange={handleConfigChange}
                    />
                </div>
            )}
            {node.kind === "output-context" && (
                <div className="space-y-2">
                    <Label htmlFor="output-context-key">Output Key</Label>
                    <Input
                        id="output-context-key"
                        name="key"
                        value={config?.key || ""}
                        onChange={handleConfigChange}
                    />
                </div>
            )}
        </div>
    );
}
