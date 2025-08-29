// /components/schema-builder/types.ts
import {BookType, Calendar, Clock, Database, Globe, Hash, ToggleRight, Type} from 'lucide-react';


export type FieldType =
    | 'https://schema.org/Text'
    | 'https://schema.org/URL'
    | 'https://schema.org/Number'
    | 'https://schema.org/Boolean'
    | 'https://schema.org/Date'
    | 'https://schema.org/Time'
    | 'select'
    | string;

export interface Field {
    id: string;
    name: string;
    type: FieldType;
    required: boolean;
    options?: string[];
}

export type Schema = Record<string, Field[]>;

export interface SchemaOrgConcept {
    description: string;
    fields: Field[];
    subclasses?: string[];
}

export type SchemaOrgConcepts = Record<string, SchemaOrgConcept>;

export const getFieldTypeIcon = (type: FieldType) => {
    const iconProps = { className: "w-4 h-4 mr-2 text-muted-foreground" };
    if (type.startsWith('https://schema.org/')) {
        const schemaName = type.split('/').pop()?.toLowerCase();
        switch (schemaName) {
            case 'text': return <Type {...iconProps} />;
            case 'url': return <Globe {...iconProps} />;
            case 'number': return <Hash {...iconProps} />;
            case 'boolean': return <ToggleRight {...iconProps} />;
            case 'date': return <Calendar {...iconProps} />;
            case 'time': return <Clock {...iconProps} />;
            default: return <BookType {...iconProps} />;
        }
    }
    return <Database {...iconProps} />;
};