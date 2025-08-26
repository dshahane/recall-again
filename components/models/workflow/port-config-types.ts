import { Vec2 } from '@/app/types/app';

// Use an enum for the different port configurations
export enum PortConfig {
    IN = 'IN',
    IN_AND_OUT = 'IN_AND_OUT',
    OUT = 'OUT',
    TRY_CATCH = 'TRY_CATCH',
}

export enum PortNames {
    PIN = 'in',
    POUT = 'out',
    PTRY = 'try',
    PCATCH = 'catch',
    // Add more
};

// A utility function to generate port positions based on the enum
export const getPortPositions = (w: number, h: number, config: PortConfig): Record<string, Vec2> => {
    let result: Record<string, Vec2>;

    switch (config) {
        case PortConfig.IN:
            result = { [PortNames.PIN]: { x: 0, y: h / 2 } };
            break;
        case PortConfig.IN_AND_OUT:
            result = { [PortNames.PIN]: { x: 0, y: h / 2 }, [PortNames.POUT]: { x: w, y: h / 2 } };
            break;
        case PortConfig.OUT:
            result = { [PortNames.POUT]: { x: w, y: h / 2 } };
            break;
        case PortConfig.TRY_CATCH:
            result = { [PortNames.PIN]: { x: 0, y: h / 2 }, [PortNames.PTRY]: { x: w, y: h / 3 }, [PortNames.PCATCH]: { x: w, y: h / 3 * 2 } };
            break;
        default:
            result = {};
            break;
    }
    return result;
};
