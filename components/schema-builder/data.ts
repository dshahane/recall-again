// /components/schema-builder/data.ts

import { nanoid } from 'nanoid';
import { Schema, SchemaOrgConcepts, FieldType } from './types';

export const INITIAL_SCHEMA: Schema = {
    Article: [
        { id: nanoid(), name: 'title', type: 'https://schema.org/Text', required: true },
        { id: nanoid(), name: 'description', type: 'https://schema.org/Text', required: false },
        { id: nanoid(), name: 'slug', type: 'https://schema.org/URL', required: true },
        { id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true },
    ],
    Author: [
        { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
        { id: nanoid(), name: 'email', type: 'https://schema.org/Text', required: true },
        { id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true },
    ],
    Category: [
        { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
        { id: nanoid(), name: 'slug', type: 'https://schema.org/URL', required: true },
        { id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true },
    ],
};

export const SCHEMA_ORG_CONCEPTS: SchemaOrgConcepts = {
    'CreativeWork': {
        description: 'The most generic kind of creative work, including books, music, etc.',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
            { id: nanoid(), name: 'author', type: 'https://schema.org/Person', required: false },
        ],
        subclasses: ['Article', 'Book', 'Movie'],
    },
    'Product': {
        description: 'Any offered product or service.',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
            { id: nanoid(), name: 'sku', type: 'https://schema.org/Text', required: false },
            { id: nanoid(), name: 'brand', type: 'https://schema.org/Brand', required: false },
            { id: nanoid(), name: 'offers', type: 'https://schema.org/Offer', required: false },
        ],
    },
    'Person': {
        description: 'A person (alive, dead, undead, or fictional).',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
            { id: nanoid(), name: 'email', type: 'https://schema.org/Text', required: false },
        ],
    },
    'Brand': {
        description: 'A brand which can be used to disambiguate products or services.',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
        ]
    },
    'Offer': {
        description: 'An offer to transfer some rights to an item or to provide a service.',
        fields: [
            { id: nanoid(), name: 'price', type: 'https://schema.org/Number', required: true },
            { id: nanoid(), name: 'priceCurrency', type: 'https://schema.org/Text', required: true },
        ]
    },
    'Article': {
        description: 'An article, such as a news article or piece of investigative report.',
        fields: [
            { id: nanoid(), name: 'headline', type: 'https://schema.org/Text', required: true },
        ]
    },
    'Author': {
        description: 'A person who created a work.',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
        ]
    },
};

export const PRIMITIVE_SCHEMA_TYPES: FieldType[] = [
    'https://schema.org/Text',
    'https://schema.org/URL',
    'https://schema.org/Number',
    'https://schema.org/Boolean',
    'https://schema.org/Date',
    'https://schema.org/Time',
    'select',
];