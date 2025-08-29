import {useState, createContext, useContext, ReactNode} from 'react';
import React from 'react';
import {Concept, ConceptContextType} from "@/components/concept-editor/proptypes";


// 1. Create a Context.
// This context will hold our state and state-updating function.
const ConceptContext = createContext<ConceptContextType | null>(null);

// 2. Create a custom hook to encapsulate the state logic.
const useConceptState = () => {
    const [concept, setConcept] = useState<Concept>({
        id: crypto.randomUUID(),
        name: 'Initial Concept Name',
        description: 'This is the initial description.',
        source: 'Default Source',
        published: false,
        related: [],
        fields: [],
    });

    // Correctly typed with Partial<Concept> to allow for partial updates.
    const updateConcept = (updatedData: Partial<Concept>) => {
        setConcept(prevConcept => ({
            ...prevConcept,
            ...updatedData,
        }));
    };

    return { concept, updateConcept };
};

// 3. Create a Provider component.
interface ConceptProviderProps {
    children: ReactNode;
}

export const ConceptProvider = ({ children }: ConceptProviderProps) => {
    const value = useConceptState();
    return (
        <ConceptContext.Provider value={value}>
            {children}
        </ConceptContext.Provider>
    );
};

// 4. Custom hook to use the context.
export const useConcept = () => {
    const context = useContext(ConceptContext);
    if (!context) {
        throw new Error('useConcept must be used within a ConceptProvider');
    }
    return context;
};
