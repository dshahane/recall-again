// File: components/workflow/node-config.tsx
'use client'

import React, {useCallback, useState} from 'react';
import {AnyNode, NodeKind} from './types';
import {getNodeMetadata} from './node-config-types';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import AutoForm from '@/components/ui/auto-form';
import { nodeSchemas } from '@/data/node-schemas';
import { z } from 'zod';

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
    const [name, setName] = useState(node.name);

    // Get the schema for the current node kind.
    // The conditional check is safe here because all hooks are called before this.
    // @ts-ignore Ignore error until all node types are covered with a schema.
    /*
    const schema = nodeSchemas[node.kind];
    if (!schema) {
        return (
            <div className="text-center text-gray-400 dark:text-zinc-500 text-sm py-8">
                No configuration for this node type.
            </div>
        );
    }*/

    // Handle changes to the node's display name
    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        onNameChange(node.id, newName);
    }, [onNameChange, node.id]);

    const nodeMetadata = getNodeMetadata(node.kind as NodeKind);
    const NodeIcon = nodeMetadata.icon;

    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-inner bg-gray-200/50 dark:bg-zinc-800/50">
            <h3 className="font-bold text-lg flex items-center gap-2">
                {NodeIcon && <NodeIcon className="h-5 w-5 text-gray-500 dark:text-zinc-400" />}
                {node.name}
            </h3>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configuration</h3>
                {/*
                <AutoForm
                    schema={schema}
                    values={node.config}
                    onValuesChange={(updatedValues) => {
                        onChange(node.id, updatedValues);
                    }}
                />
                */}
            </div>
            <div className="space-y-4 mt-4">
                <h3 className="text-lg font-semibold">Node Details</h3>
                <div className="grid gap-2">
                    <Label htmlFor="node-name">Name</Label>
                    <Input id="node-name" value={name} onChange={handleNameChange} />
                </div>
            </div>
        </div>
    );
}
