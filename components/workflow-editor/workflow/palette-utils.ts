import { v4 as uuidv4 } from 'uuid';
import {ReactElement} from "react";

export interface PaletteItem {
    id: string, // Added by usePalette hook to use as a key in Palette component
    label: string;
    kind: string;
    icon: ReactElement | null;
}

export interface PaletteCategory {
    label: string;
    description: string;
    items: PaletteItem[];
}

export const processPaletteData = (data: PaletteCategory[]) => {
    return data.map(category => ({
        ...category,
        items: category.items.map(item => ({
            ...item,
            id: uuidv4() // Assign a unique ID to each item
        }))
    }));
};