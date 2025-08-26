// File: src/hooks/usePalette.ts
import React, { useEffect, useState, useMemo } from 'react';
import { PlaySquare, FileText, Bot, Rocket, Wand, MessageSquare, Table, LayoutDashboard, Database, Repeat, Split, Code, Timer, GitBranch, Lightbulb, AlarmClock, Columns4 } from 'lucide-react';
import { NodeKind } from '@/components/models/workflow/types';

interface PaletteItem {
    label: string;
    kind: NodeKind;
}

interface PaletteCategory {
    label: string;
    description: string;
    items: PaletteItem[];
}

// Map NodeKind to the correct icon component
const icons = {
    'query': PlaySquare,
    'document': FileText,
    'session': MessageSquare,
    'timer': AlarmClock,
    'llm': Bot,
    'classifier': Bot,
    'regressor': Bot,
    'ranker': Bot,
    'intent-detection': Lightbulb,
    'transformation': Wand,
    'context': Database,
    'table': Table,
    'api': Rocket,
    'table-out': Table,
    'visualization': LayoutDashboard,
    'context-out': Database,
    'loop': Repeat,
    'condition': Split,
    'trycatch': GitBranch,
    'delay': Timer,
    'variables': Code,
    'text-generation': Bot, // Example
    'bmecat': Columns4,
    'cif': Columns4,
    'cxml': Columns4,
    'reviews': Columns4,
    'sql': Columns4,
    'sparql': Columns4,
    'sheet': Columns4
};

export function usePalette(mode: 'standalone' | 'embedded') {
    const [paletteData, setPaletteData] = useState<PaletteCategory[] | null>(null);

    useEffect(() => {
        const loadPalette = async () => {
            const data = mode === 'standalone'
                ? (await import('@/data/standalone-palette.json')).default
                : (await import('@/data/embedded-palette.json')).default;
            // @ts-ignore
            setPaletteData(data);
        };
        loadPalette();
    }, [mode]);

    const paletteWithIcons = useMemo(() => {
        if (!paletteData) return [];
        return paletteData.map(category => ({
            ...category,
            items: category.items.map(item => ({
                ...item,
                icon: icons[item.kind] ? React.createElement(icons[item.kind], { className: "w-4 h-4" }) : null
            }))
        }));
    }, [paletteData]);

    return paletteWithIcons;
}