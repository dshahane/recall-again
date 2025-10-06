import React from "react";

export interface Field {
    name: string;
    type: string | number | boolean;
    description?: string;
}

export interface Concept {
    id: string;
    name: string;
    description: string;
    source: string;
    published: boolean;
    related: string[];
    fields?: Field[];
    schemaJson?: object;
}

export interface ConceptContextType {
    concept: Concept;
    updateConcept: (updatedData: Partial<Concept>) => void;
}

// Filename: src/types/props.ts
export interface ConceptCardProps {
    concept: Concept;
    onEdit: (concept: Concept) => void;
    onDelete: (id: string) => void;
}

export interface WizardGuideProps {
    step: number;
    newConcept: Partial<Concept>;
}

export interface SchemaTreeViewProps {
    source: string;
    selectedConcept: string;
    newConcept: string;
    onSelectConcept: (parent: string, derived: string) => void;
}

export interface WizardStep1Props {
    onNext: () => void,
    concept?: Concept,
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export interface WizardStep2Props {
    onNext: (updatedConcept: Partial<Concept>) => void,
    onBack: () => void,
    concept?: Concept,
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export interface WizardStep3Props {
    onNext: () => void;
    onBack: () => void;
    onInfer: () => void;
    loading: boolean;
    progress: number;
    inferredMappings: string[];
}

export interface WizardStep4Props {
    onAccept: () => void;
    onBack: () => void;
}

export interface NewConceptWizardProps {
    onCancel: () => void;
    onAccept: () => void;
    newConcept: Partial<Concept>;
    setNewConcept: React.Dispatch<React.SetStateAction<Partial<Concept>>>;
}

export interface ConceptGridProps {
    concepts: Concept[];
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filterSource: string;
    setFilterSource: React.Dispatch<React.SetStateAction<string>>;
    startNewConcept: () => void;
    onDelete: (id: string) => void;
    onEdit: (concept: Concept) => void;
}