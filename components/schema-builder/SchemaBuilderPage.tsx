// /components/schema-builder/SchemaBuilderPage.tsx

'use client';

import * as React from 'react';
import {useState} from 'react';
import {TooltipProvider} from '@/components/ui/tooltip';

import {Field, Schema} from './types';
import {INITIAL_SCHEMA} from './data';

import {CollectionsSidebar} from './CollectionsSidebar';
import {SchemaView} from './tabs/SchemaView';
import {FieldModal} from './modals/FieldModal';
import {AddCollectionModal} from './modals/AddCollectionModal';
import {CreateSchemaOrgModal} from './modals/CreateSchemaOrgModal';
import {TabbedView} from './tabs/TabbedView';

default function SchemaBuilderPage() {
    const [schema, setSchema] = useState<Schema>(INITIAL_SCHEMA);
    const [selectedContentType, setSelectedContentType] = useState<string | null>('Article');

    // Modal states
    const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
    const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState(false);
    const [isSchemaOrgModalOpen, setIsSchemaOrgModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<Field | null>(null);

    const currentFields = selectedContentType ? schema[selectedContentType] : [];

    const handleAddField = (newField: Field) => {
        if (!selectedContentType) return;
        setSchema(prev => ({
            ...prev,
            [selectedContentType]: [...prev[selectedContentType], newField],
        }));
    };

    const handleUpdateField = (updatedField: Field) => {
        if (!selectedContentType) return;
        setSchema(prev => ({
            ...prev,
            [selectedContentType]: prev[selectedContentType].map(f => f.id === updatedField.id ? updatedField : f),
        }));
    };

    const handleDeleteField = (fieldId: string) => {
        if (!selectedContentType) return;
        setSchema(prev => ({
            ...prev,
            [selectedContentType]: prev[selectedContentType].filter(f => f.id !== fieldId),
        }));
    };

    const handleAddCollectionType = (name: string, fields: Field[]) => {
        if (schema[name]) {
            console.error(`Collection type "${name}" already exists.`);
            return;
        }
        setSchema(prev => ({...prev, [name]: fields}));
        setSelectedContentType(name);
    };

    const handleDeleteCollection = (collectionName: string) => {
        if (window.confirm(`Are you sure you want to delete the "${collectionName}" collection?`)) {
            if (selectedContentType === collectionName) {
                setSelectedContentType(null);
            }
            setSchema(prev => {
                const newSchema = {...prev};
                delete newSchema[collectionName];
                return newSchema;
            });
        }
    };

    const handleOpenEditModal = (field: Field) => {
        setEditingField(field);
        setIsFieldModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingField(null);
        setIsFieldModalOpen(true);
    }

    return (
        <TooltipProvider>
            <div className="flex h-full bg-background text-foreground">
                <CollectionsSidebar
                    schema={schema}
                    selectedContentType={selectedContentType}
                    onSelectContentType={setSelectedContentType}
                    onOpenAddCollectionModal={() => setIsAddCollectionModalOpen(true)}
                    onOpenAddSchemaOrgModal={() => setIsSchemaOrgModalOpen(true)}
                    onDeleteCollection={handleDeleteCollection}
                />
                <main className="flex-1 p-8 overflow-auto">
                    <TabbedView
                        selectedContentType={selectedContentType}
                        onOpenAddModal={handleOpenAddModal}
                        onOpenEditModal={handleOpenEditModal}
                        onDeleteField={handleDeleteField}
                        fields={currentFields}
                    />
                </main>

                {/* --- Modals --- */}
                <FieldModal
                    isOpen={isFieldModalOpen}
                    onOpenChange={setIsFieldModalOpen}
                    onSave={editingField ? handleUpdateField : handleAddField}
                    existingField={editingField}
                />
                <AddCollectionModal
                    isOpen={isAddCollectionModalOpen}
                    onOpenChange={setIsAddCollectionModalOpen}
                    onAddCollection={handleAddCollectionType}
                />
                <CreateSchemaOrgModal
                    isOpen={isSchemaOrgModalOpen}
                    onOpenChange={setIsSchemaOrgModalOpen}
                    onAddCollection={handleAddCollectionType}
                />

            </div>
        </TooltipProvider>
    );
}