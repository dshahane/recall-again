import { useState, useRef, useCallback, MouseEvent } from "react";
import { Vec2, PortName } from "@/components/models/workflow/types";

export const useConnection = (canvasRef: React.RefObject<HTMLDivElement | null>) => {
    const connectingFrom = useRef<{ nodeId: string; port: PortName } | null>(null);
    const [connectingTo, setConnectingTo] = useState<Vec2 | null>(null);

    const onPortMouseDown = useCallback((nodeId: string, port: PortName, e: MouseEvent) => {
        e.stopPropagation();
        connectingFrom.current = { nodeId, port };
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            setConnectingTo({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    }, [canvasRef]);

    const onCanvasMouseMove = useCallback((e: MouseEvent) => {
        if (connectingFrom.current) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                setConnectingTo({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
        }
    }, [canvasRef]);

    // This is the function you need to return
    const onCanvasMouseUp = useCallback(() => {
        if (connectingFrom.current) {
            connectingFrom.current = null;
            setConnectingTo(null);
        }
    }, []);

    return {
        connectingFrom: connectingFrom.current,
        connectingTo,
        onPortMouseDown,
        onCanvasMouseMove,
        onCanvasMouseUp,
        resetConnection: onCanvasMouseUp // You can still use an alias here if you want
    };
};