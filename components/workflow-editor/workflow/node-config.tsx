'use client'

import React, {useCallback, useState} from 'react';
import {AnyNode, NodeKind} from './types';
import {getNodeMetadata} from './node-config-types';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import AutoForm from '@/components/ui/auto-form';
import {getNodeSchema,} from '@/data/node-schemas';
import { z } from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

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
    // The useState here will also be reset correctly because the entire
    // NodeConfig component will be re-mounted when the key changes.
    const [name, setName] = useState(node.name);

    // Get the schema for the current node kind.
    // @ts-ignore Ignore error until all node types are covered with a schema.
    const schema = getNodeSchema(node.kind);
    if (!schema) {
        return (
            <div className="text-center text-gray-400 dark:text-zinc-500 text-sm py-8">
                No configuration for this node type.
            </div>
        );
    }
    //console.log('Using schema for node kind:', node.kind, 'Schema:', JSON.stringify(schema, null, 2));
    // Handle changes to the node's display name
    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        onNameChange(node.id, newName);
    }, [onNameChange, node.id]);

    const nodeMetadata = getNodeMetadata(node.kind as NodeKind);
    const NodeIcon = nodeMetadata.icon;

    return (
        <Card
            className="w-full flex flex-col h-full overflow-hidden"
        >
            <CardHeader className="flex flex-row items-center gap-2">
                {NodeIcon && <NodeIcon className="h-5 w-5 text-primary" />}
                <div className="grid gap-1">
                    <CardTitle className="text-xl">{node.name}</CardTitle>
                    <CardDescription>
                        Configure the settings for this node.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 overflow-y-auto pb-4">
                <div className="grid gap-2">
                    <Label htmlFor="node-name">Name</Label>
                    <Input
                        id="node-name"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter a descriptive name for the node"
                    />
                </div>

                <AutoForm
                    // This is the crucial change!
                    key={node.id}
                    formSchema={schema}
                    values={node.config}
                    onValuesChange={(updatedValues) => {
                        onChange(node.id, updatedValues);
                    }}
                    // The fieldConfig prop can be used to override the default behavior,
                    // but the AutoForm component will use the Zod description by default.
                    fieldConfig={{}}
                />
            </CardContent>
        </Card>
    );
}
