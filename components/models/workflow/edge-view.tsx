// File: components/workflow/EdgeView.tsx
'use client'

import React from 'react';
import { Vec2, } from '@/app/types/app';
import { defaultBezierPoints } from './workflow-utils';
import { cn } from '@/lib/utils';

interface EdgeViewProps {
    from: Vec2;
    to: Vec2;
    c1?: Vec2;
    c2?: Vec2;
    selected: boolean;
    onSelect: (e: React.MouseEvent) => void;
    onDragControlPoint: (controlPoint: 'c1' | 'c2', e: React.MouseEvent) => void;
}

export default function EdgeView({ from, to, c1, c2, selected, onSelect, onDragControlPoint }: EdgeViewProps) {
    const { c1: defaultC1, c2: defaultC2 } = defaultBezierPoints(from, to);

    // Use the provided control points or fall back to defaults
    const curveC1 = c1 || defaultC1;
    const curveC2 = c2 || defaultC2;

    const d = `M${from.x},${from.y} C${curveC1.x},${curveC1.y} ${curveC2.x},${curveC2.y} ${to.x},${to.y}`;

    return (
        <g>
            {/* Invisible path for easier selection/interaction */}
            <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth="10"
                className="cursor-pointer"
                onClick={onSelect}
            />
            {/* Visible path for the edge */}
            <path
                d={d}
                fill="none"
                strokeWidth="2"
                className={cn(
                    "transition-all duration-150 ease-in-out",
                    selected ? "stroke-blue-500" : "stroke-gray-400 dark:stroke-zinc-600"
                )}
                strokeDasharray={selected ? "4,4" : "none"}
                markerEnd="url(#arrowhead)"
                style={{ pointerEvents: 'none' }}
            />
            {/* Control points for editing the curve */}
            {selected && (
                <>
                    <circle
                        cx={curveC1.x}
                        cy={curveC1.y}
                        r="5"
                        className="fill-blue-500 cursor-move"
                        onMouseDown={(e) => onDragControlPoint('c1', e)}
                    />
                    <circle
                        cx={curveC2.x}
                        cy={curveC2.y}
                        r="5"
                        className="fill-blue-500 cursor-move"
                        onMouseDown={(e) => onDragControlPoint('c2', e)}
                    />
                </>
            )}
            {/* Arrowhead marker definition */}
            <defs>
                <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
                </marker>
            </defs>
        </g>
    );
}