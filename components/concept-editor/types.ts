import {SelectItem} from "@/components/ui/select";
import {useState} from "react";
import {Concept, Field} from "@/components/concept-editor/proptypes";

export const initialConcepts = [
    {
        id: "mock-uuid-1",
        name: 'Event',
        description: 'A social or real-world happening, like a concert or conference.',
        source: 'schema.org',
        published: true,
        related: ['Place', 'Organization', 'Person'],
    },
    {
        id: "mock-uuid-2",
        name: 'Book',
        description: 'A written or published work.',
        source: 'schema.org',
        published: true,
        related: ['Author', 'Publisher'],
    },
    {
        id: "mock-uuid-3",
        name: 'Movie',
        description: 'A creative work, often with a director and cast.',
        source: 'schema.org',
        published: false,
        related: ['Director', 'Actor', 'Rating'],
    },
    {
        id: "mock-uuid-4",
        name: 'City',
        description: 'A major human settlement.',
        source: 'DBpedia',
        published: true,
        related: ['Country', 'Landmark'],
    },
];

export const mockSchemaTreeData: Record<string, { name: string; derived: { name: string }[] }[]> = {
    'schema.org': [
        { name: 'Thing', derived: [{ name: 'Place' }, { name: 'Event' }] },
        { name: 'CreativeWork', derived: [{ name: 'Book' }, { name: 'Movie' }] },
        { name: 'Product', derived: [{ name: 'Offer' }, { name: 'Review' }] }
    ],
    'DBpedia': [
        { name: 'Settlement', derived: [{ name: 'City' }, { name: 'Town' }] },
        { name: 'Person', derived: [{ name: 'Artist' }, { name: 'Scientist' }] }
    ],
    'Custom': []
};

export const schemaNamespaces = ["All", "schema.org", "DBpedia.org", "sap.com", "Custom"];
export const primitiveConceptTyps: string[] = ["Text", "Number", "URL", "Boolean"];

export const mockFieldsForConcept = (url: string) => {
    if (url.includes('schema.org')) {
        return [{ name: 'name', type: 'Text', description: '' }, { name: 'description', type: 'Text', description: '' }, { name: 'url', type: 'URL', description: '' }, { name: 'image', type: 'URL', description: '' }];
    }
    if (url.includes('sap.com/Products')) {
        return [{ name: 'productID', type: 'Number', description: '' }, { name: 'productName', type: 'Text', description: '' }, { name: 'materialGroup', type: 'Text', description: '' }, { name: 'availableStock', type: 'Number', description: '' }];
    }
    if (url.includes('sap.com/Offer')) {
        return [{ name: 'offerID', type: 'Number', description: '' }, { name: 'price', type: 'Number', description: '' }, { name: 'validFrom', type: 'Date', description: '' }, { name: 'validTo', type: 'Date', description: '' }];
    }
    if (url.includes('dbpedia.com')) {
        return [{ name: 'title', type: 'Text', description: '' }, { name: 'author', type: 'Text', description: '' }, { name: 'publicationDate', type: 'Date', description: '' }, { name: 'isbn', type: 'Number', description: '' }];
    }
    // Default fallback
    return [{ name: 'name', type: 'Text', description: '' }];
};
