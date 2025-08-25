// File: components/workflow/EdgeView.tsx
'use client';

import { FC } from 'react';
import { Vec2 } from './types';

interface EdgeViewProps {
    from: Vec2;
    to: Vec2;
    c1: Vec2;
    c2: Vec2;
    selected: boolean;
    onSelect: (e: React.MouseEvent) => void;
    onDragControlPoint: (cPoint: 'c1' | 'c2', e: React.MouseEvent) => void;
}

const EdgeView: FC<EdgeViewProps> = ({ from, to, c1, c2, selected, onSelect, onDragControlPoint }) => {
    if (
        !from || !to || !c1 || !c2 ||
        typeof from.x !== 'number' || typeof from.y !== 'number' ||
        typeof to.x !== 'number' || typeof to.y !== 'number' ||
        typeof c1.x !== 'number' || typeof c1.y !== 'number' ||
        isNaN(from.x) || isNaN(from.y) ||
        isNaN(to.x) || isNaN(to.y) ||
        isNaN(c1.x) || isNaN(c1.y)
    ) {
        return null;
    }

    const pathData = `M${from.x} ${from.y} C${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;

    return (
        <g>
            {/* Invisible path for a larger click target */}
            <path
                d={pathData}
                stroke="transparent"
                strokeWidth="10"
                fill="none"
                onClick={onSelect} // onSelect is handled here
                onMouseDown={(e) => e.stopPropagation()} // Stop propagation to prevent canvas deselect
                style={{ cursor: 'pointer' }}
            />
            {/* Visible path */}
            <path
                d={pathData}
                stroke="#d4d4d8"
                strokeWidth="3"
                fill="none"
                className={`transition-all duration-300 ${selected ? 'stroke-purple-500' : ''}`}
                style={{ pointerEvents: 'none' }} // Ensure clicks go to the invisible path
            />
            {selected && (
                <>
                    <circle
                        cx={c1.x}
                        cy={c1.y}
                        r="6"
                        fill="#a855f7"
                        stroke="white"
                        strokeWidth="1.5"
                        className="cursor-grab"
                        onMouseDown={(e) => { e.stopPropagation(); onDragControlPoint('c1', e); }}
                    />
                    <circle
                        cx={c2.x}
                        cy={c2.y}
                        r="6"
                        fill="#a855f7"
                        stroke="white"
                        strokeWidth="1.5"
                        className="cursor-grab"
                        onMouseDown={(e) => { e.stopPropagation(); onDragControlPoint('c2', e); }}
                    />
                </>
            )}
        </g>
    );
};

export default EdgeView;