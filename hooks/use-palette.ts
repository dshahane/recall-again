import React, { useEffect, useState, useMemo } from 'react';
import { NODE_METADATA } from '@/components/models/workflow/node-config-types';
import { NodeKind } from '@/components/models/workflow/types';

export interface PaletteItem {
    label: string;
    kind: NodeKind;
    icon: React.ReactElement | null;
}

interface PaletteCategory {
    label: string;
    description: string;
    items: PaletteItem[];
}

export function usePalette(mode: 'standalone' | 'embedded') {
    const [paletteData, setPaletteData] = useState<PaletteCategory[] | null>(null);

    useEffect(() => {
        const loadPalette = async () => {
            const data = mode === 'standalone'
                ? (await import('@/data/standalone-palette.json')).default
                : (await import('@/data/embedded-palette.json')).default;
            setPaletteData(data as PaletteCategory[]);
        };
        loadPalette();
    }, [mode]);

    const paletteWithIcons = useMemo(() => {
        if (!paletteData) return [];
        return paletteData.map(category => ({
            ...category,
            items: category.items.map(item => {
                const iconComponent = NODE_METADATA[item.kind]?.icon;
                return {
                    ...item,
                    // If iconComponent exists, create the element; otherwise, the whole expression is null
                    icon: iconComponent && React.createElement(iconComponent, { className: "w-4 h-4" })
                };
            })
        }));
    }, [paletteData]);

    return paletteWithIcons;
}