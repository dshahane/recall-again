// File: components/workflow/Palette.tsx
'use client'

import React, {DragEvent} from 'react';
import {WorkflowIcon} from 'lucide-react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from '@/components/ui/accordion';
import {PaletteItem} from './palette-utils';
import {cn} from '@/lib/utils';


interface PaletteProps {
    paletteData: any[]; // Accepts palette data as a prop
}

/**
 * The Palette component provides a draggable list of node types.
 * @param props - The component props.
 * @returns A React component for the node palette.
 */
export default function Palette({paletteData }: PaletteProps) {
    return (
        <div className="w-80 flex-shrink-0 p-4 border-r border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <WorkflowIcon className="w-5 h-5" /> Node Palette
            </h2>
            <Accordion type="single" collapsible defaultValue="Triggers">
                {paletteData.map((group) => (
                    <AccordionItem key={group.label} value={group.label}>
                        <AccordionTrigger className="text-sm font-medium">{group.label}</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">{group.description}</p>
                            <div className="grid grid-cols-2 gap-2">
                                {group.items.map((paletteNode: PaletteItem) => (
                                    <div
                                        key={paletteNode.id}
                                        draggable
                                        onDragStart={(e: DragEvent<HTMLDivElement>) => {
                                            // KEY CHANGE: Use e.dataTransfer.setData to pass the data
                                            e.dataTransfer.setData(
                                                "application/json",
                                                JSON.stringify({ kind: paletteNode.kind, label: paletteNode.label })
                                            );
                                            e.dataTransfer.effectAllowed = "move";
                                        }}
                                        // KEY CHANGE: onDragEnd is no longer necessary
                                        className={cn(
                                            "p-3 rounded-lg border border-gray-200 dark:border-zinc-800",
                                            "bg-white/70 dark:bg-zinc-800/70 shadow-sm",
                                            "flex flex-col items-center justify-center gap-1",
                                            "text-sm cursor-grab active:cursor-grabbing",
                                            "transition-all duration-150 ease-in-out",
                                            "hover:shadow-md hover:bg-white dark:hover:bg-zinc-800"
                                        )}
                                    >
                                        <span className="mb-1 h-5 w-5 text-gray-500 dark:text-zinc-400">{paletteNode.icon}</span>
                                        <span className="font-medium text-center text-gray-500">{paletteNode.label}</span>
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