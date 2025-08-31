import React, {useMemo} from 'react';
import {getNodeMetadata} from '@/components/workflow-editor/workflow/node-config-types';
// Import the data files directly
import {PALETTE_DATA as PALETTE_DATA_STANDALONE} from '@/data/standalone-palette';
import {PALETTE_DATA as PALETTE_DATA_EMBEDDED} from '@/data/embedded-palette';

import {processPaletteData} from '@/components/workflow-editor/workflow/palette-utils';
import {NodeKind} from "@/components/workflow-editor/workflow/types";

export function usePalette(mode: 'standalone' | 'embedded') {
    const rawPaletteData = mode === 'standalone' ? PALETTE_DATA_STANDALONE : PALETTE_DATA_EMBEDDED;

    const paletteWithIcons = useMemo(() => {
        // Process the data to add unique IDs
        const dataWithIds = processPaletteData(rawPaletteData);

        return dataWithIds.map(category => ({
            ...category,
            items: category.items.map(item => {
                const iconComponent = getNodeMetadata(item.kind as NodeKind)?.icon;
                return {
                    ...item,
                    icon: iconComponent && React.createElement(iconComponent, { className: "w-4 h-4" })
                };
            })
        }));
    }, [rawPaletteData]); // Re-run if the raw data changes (e.g., mode changes)

    return paletteWithIcons;
}