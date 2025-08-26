import { Vec2 } from '@/app/types/app';

// Use an enum for the different port configurations
export enum PortConfig {
    IN = 'IN',
    IN_AND_OUT = 'IN_AND_OUT',
    OUT = 'OUT',
    TRY_CATCH = 'TRY_CATCH',
}

// A utility function to generate port positions based on the enum
export const getPortPositions = (w: number, h: number, config: PortConfig): Record<string, Vec2> => {
    switch (config) {
        case PortConfig.IN:
            return { 'in': { x: 0, y: h / 2 } };
        case PortConfig.IN_AND_OUT:
            return { 'in': { x: 0, y: h / 2 }, 'out': { x: w, y: h / 2 } };
        case PortConfig.OUT:
            return { 'out': { x: w, y: h / 2 } };
        case PortConfig.TRY_CATCH:
            return { 'in': { x: 0, y: h / 2 }, 'try': { x: w, y: h / 3 }, 'catch': { x: w, y: h / 3 * 2 } };
        default:
            return {};
    }
};