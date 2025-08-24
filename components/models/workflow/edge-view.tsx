// File: components/workflow/EdgeView.tsx
'use client'

import React, { FC } from 'react';
import { Vec2, NodeKind } from './types';

// A simple helper to generate the SVG path
const getPath = (from: Vec2, to: Vec2) => {
    // Corrected logic for a smooth, curving path
    const cp1x = from.x + (to.x - from.x) / 2;
    const cp1y = from.y;
    const cp2x = from.x + (to.x - from.x) / 2;
    const cp2y = to.y;

    return `M${from.x} ${from.y} C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
};

const EdgeView: FC<{ from: Vec2; to: Vec2; fromKind: NodeKind }> = ({ from, to }) => {
    const path = getPath(from, to);

    return (
        <path
            d={path}
            fill="none"
            // 🎯 Fix: Use inline styles to force visibility
            style={{
                stroke: '#d4d4d8', // A guaranteed visible color (zinc-400 equivalent)
                strokeWidth: 2.5,
                transition: 'stroke 100ms ease-in-out',
            }}
            markerEnd="url(#arrow)"
        />
    );
};

export default EdgeView;