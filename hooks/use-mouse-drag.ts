// hooks/useMouseDrag.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { Vec2 } from '@/app/types/app';

export const useMouseDrag = (onDragEnd: (finalPos: Vec2) => void) => {
    const [isDragging, setIsDragging] = useState(false);
    const initialPosRef = useRef<Vec2 | null>(null);
    const dragStartMousePosRef = useRef<Vec2 | null>(null);
    const currentDraggedPosRef = useRef<Vec2 | null>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!initialPosRef.current || !dragStartMousePosRef.current) return;

        const dx = e.clientX - dragStartMousePosRef.current.x;
        const dy = e.clientY - dragStartMousePosRef.current.y;
        const newPos = {
            x: initialPosRef.current.x + dx,
            y: initialPosRef.current.y + dy
        };
        currentDraggedPosRef.current = newPos;
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        if (currentDraggedPosRef.current) {
            onDragEnd(currentDraggedPosRef.current);
        }
        initialPosRef.current = null;
        dragStartMousePosRef.current = null;
        currentDraggedPosRef.current = null;
    }, [onDragEnd]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleMouseDown = useCallback((e: React.MouseEvent, initialPos: Vec2) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        initialPosRef.current = initialPos;
        dragStartMousePosRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    return {
        handleMouseDown,
        currentDraggedPos: currentDraggedPosRef.current,
        isDragging
    };
};