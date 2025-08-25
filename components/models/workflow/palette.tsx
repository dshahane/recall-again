// File: components/workflow/Palette.tsx
'use client'

import React from 'react';
import { WorkflowIcon, ChevronDown, Rocket, FileText, MessageSquare, Monitor, Table, ImageIcon, SearchIcon, Cog } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

// Defines the properties for a draggable node type in the palette
interface NodePaletteItem {
    kind: string;
    label: string;
}

// Defines the props for the Palette component
interface PaletteProps {
    setDraggedNode: (node: NodePaletteItem | null) => void;
}

// List of all node types available in the palette, grouped by category
const nodeGroups = [
    {
        name: "Triggers",
        description: "Start a workflow with these nodes.",
        nodes: [
            { kind: "query", label: "Query", icon: SearchIcon },
            { kind: "document", label: "Document", icon: FileText },
            { kind: "session", label: "Session", icon: MessageSquare },
        ],
    },
    {
        name: "Generators",
        description: "Generate content from prompts.",
        nodes: [
            { kind: "text-generation", label: "Text Generation", icon: Rocket },
            { kind: "image-generation", label: "Image Generation", icon: ImageIcon },
        ],
    },
    {
        name: "Tools",
        description: "Run custom code or actions.",
        nodes: [
            { kind: "action", label: "Action", icon: Cog },
        ],
    },
    {
        name: "Sinks",
        description: "End a workflow with these nodes.",
        nodes: [
            { kind: "table", label: "Table", icon: Table },
            { kind: "output-context", label: "Output Context", icon: Monitor },
        ],
    },
];

/**
 * The Palette component provides a draggable list of node types.
 * @param props - The component props.
 * @returns A React component for the node palette.
 */
export default function Palette({ setDraggedNode }: PaletteProps) {
    return (
        <div className="w-80 flex-shrink-0 p-4 border-r border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <WorkflowIcon className="w-5 h-5" /> Node Palette
            </h2>
            <Accordion type="single" collapsible defaultValue="Triggers">
                {nodeGroups.map((group) => (
                    <AccordionItem key={group.name} value={group.name}>
                        <AccordionTrigger className="text-sm font-medium">{group.name}</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">{group.description}</p>
                            <div className="grid grid-cols-2 gap-2">
                                {group.nodes.map((node) => (
                                    <div
                                        key={node.kind}
                                        draggable
                                        onDragStart={(e) => {
                                            setDraggedNode({ kind: node.kind, label: node.label });
                                            e.dataTransfer.effectAllowed = "move";
                                        }}
                                        onDragEnd={() => setDraggedNode(null)}
                                        className={`
                                            p-3 rounded-lg border border-gray-200 dark:border-zinc-800
                                            bg-white/70 dark:bg-zinc-800/70 shadow-sm
                                            flex flex-col items-center justify-center gap-1
                                            text-sm cursor-grab active:cursor-grabbing
                                            transition-all duration-150 ease-in-out
                                            hover:shadow-md hover:bg-white dark:hover:bg-zinc-800
                                        `}
                                    >
                                        {node.icon && <node.icon className="h-5 w-5 text-gray-500 dark:text-zinc-400" />}
                                        <span className="font-medium text-center">{node.label}</span>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
