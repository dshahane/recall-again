'use client'

import React, { useState } from 'react';
import { ChevronDown, Workflow } from 'lucide-react';
import { PALETTE_DATA, PaletteNode, NodeKind } from './types';

const Palette = ({ setDraggedNode, isTriggerNode }: {
    setDraggedNode: (node: PaletteNode | null) => void;
    isTriggerNode: (kind: NodeKind) => boolean;
}) => {
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    // Fix TS7006 by explicitly typing the parameters
    const handleDragStart = (e: React.DragEvent, node: PaletteNode) => {
        setDraggedNode(node);
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', node.kind);
    };

    // Fix TS7006 by explicitly typing the parameter
    const handleAccordionToggle = (title: string) => {
        setActiveAccordion(activeAccordion === title ? null : title);
    };

    return (
        <div className="w-64 flex-shrink-0 border-r border-zinc-800 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
                <Workflow className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Node Palette</h2>
            </div>
            {PALETTE_DATA.map((category) => (
                <div key={category.title} className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <button
                        onClick={() => handleAccordionToggle(category.title)}
                        className="w-full flex justify-between items-center p-3 text-sm font-medium hover:bg-zinc-800/50 transition-colors rounded-t-xl"
                    >
                        <span>{category.title}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === category.title ? 'rotate-180' : ''}`} />
                    </button>
                    {activeAccordion === category.title && (
                        <div className="p-2 border-t border-zinc-800">
                            <div className="grid grid-cols-2 gap-2">
                                {category.nodes.map((node) => (
                                    <div
                                        key={node.kind}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, node)}
                                        className="group relative flex flex-col items-center justify-center p-2 text-center text-xs rounded-lg border border-zinc-700 bg-zinc-800/50 cursor-grab hover:bg-zinc-700/50 transition-colors"
                                    >
                                        <span>{node.icon}</span>
                                        {node.label}
                                        <div className="absolute top-1/2 left-[calc(100%+8px)] -translate-y-1/2 w-48 rounded-lg bg-zinc-700 text-zinc-50 p-3 text-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                                            {node.tip}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Palette;