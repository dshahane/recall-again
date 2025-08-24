// File: components/workflow/Palette.tsx
'use client';

import { FC, useState } from 'react';
import { Palette, ChevronDown, ChevronRight } from 'lucide-react';
import { PALETTE_DATA, NodeKind, nodeIcon } from './types';

interface PaletteProps {
    setDraggedNode: React.Dispatch<any>;
    isTriggerNode: (kind: NodeKind) => boolean;
}

const PaletteComponent: FC<PaletteProps> = ({ setDraggedNode, isTriggerNode }) => {
    // State now holds a single string for the currently expanded group
    const [expandedGroup, setExpandedGroup] = useState<string | null>(PALETTE_DATA[0]?.label || null);

    const toggleGroup = (label: string) => {
        // If the clicked group is already open, close it. Otherwise, open it.
        setExpandedGroup(expandedGroup === label ? null : label);
    };

    return (
        <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 overflow-y-auto">
            <h2 className="flex items-center gap-2 text-sm font-semibold mb-4 text-zinc-950 dark:text-zinc-50">
                <Palette className="w-4 h-4" />
                Node Palette
            </h2>
            <div className="space-y-4">
                {PALETTE_DATA.map((group, index) => {
                    const isExpanded = expandedGroup === group.label;
                    return (
                        <div key={index}>
                            <h3
                                onClick={() => toggleGroup(group.label)}
                                className="flex items-center justify-between cursor-pointer text-xs font-medium text-gray-500 dark:text-zinc-600 mb-2 transition-colors hover:text-gray-700 dark:hover:text-zinc-400"
                            >
                                {group.label}
                                <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                                    <ChevronRight className="w-3 h-3" />
                                </span>
                            </h3>
                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="grid grid-cols-2 gap-2">
                                    {group.items.map(item => (
                                        <div
                                            key={item.kind}
                                            draggable
                                            onDragStart={(e) => {
                                                setDraggedNode(item);
                                                if (isTriggerNode(item.kind)) {
                                                    e.dataTransfer.effectAllowed = "copy";
                                                } else {
                                                    e.dataTransfer.effectAllowed = "move";
                                                }
                                            }}
                                            onDragEnd={() => setDraggedNode(null)}
                                            className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg flex flex-col items-center cursor-grab active:cursor-grabbing transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-800"
                                        >
                                            <span className="mb-1 text-gray-600 dark:text-zinc-300">
                                                {nodeIcon(item.kind)}
                                            </span>
                                            <span className="text-xs font-medium text-center text-zinc-900 dark:text-zinc-50">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaletteComponent;