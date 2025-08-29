import {useMemo, useState} from "react";
import {Concept} from "@/components/concept-editor/proptypes";
import {initialConcepts} from "@/components/concept-editor/types";
import {toast, Toaster} from "sonner";
import {NewConceptWizard} from "@/components/concept-editor/new-concept-wizard";
import {ConceptGrid} from "@/components/concept-editor/concept-grid";
import { v4 as uuidv4 } from "uuid";
import {ConceptProvider, useConcept} from "@/components/concept-editor/concept-context";

export default function ConceptEditorApp() {
    const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [newConcept, setNewConcept] = useState<Partial<Concept>>({
        id: '',
        name: '',
        description: '',
        source: 'schema.org',
        published: false,
        related: [],
        fields: [],
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterSource, setFilterSource] = useState<string>('All');

    const filteredConcepts = useMemo(() => {
        return concepts.filter(concept => {
            const matchesSearch = concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                concept.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterSource === 'All' || concept.source === filterSource;
            return matchesSearch && matchesFilter;
        });
    }, [concepts, searchTerm, filterSource]);

    const startNewConcept = () => {
        setNewConcept({
            id: uuidv4(),
            name: '',
            description: '',
            source: 'schema.org',
            published: false,
            related: [],
            fields: [],
        });
        setIsCreating(true);
    };

    const handleAccept = () => {
        if (newConcept.name && newConcept.id) {
            setConcepts(prevConcepts => [...prevConcepts, newConcept as Concept]);
            setIsCreating(false);
            toast.success(`Concept '${newConcept.name}' created successfully!`);
        } else {
            toast.error("Concept data is incomplete. Please fill out all required fields.");
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        toast.warning("Concept creation cancelled.");
        // Reset state
        setNewConcept({
            id: '',
            name: '',
            description: '',
            source: 'schema.org',
            published: false,
            related: [],
            fields: [],
        });
    };

    const handleDelete = (id: string) => {
        setConcepts(prevConcepts => prevConcepts.filter(c => c.id !== id));
        toast.success("Concept deleted.");
    };

    const handleEdit = (concept: Concept) => {
        toast.warning(`Editing is not yet implemented for concept '${concept.name}'.`);
    };

    return (
        <>
            {isCreating ? (
                <ConceptProvider>
                    <NewConceptWizard
                        onCancel={handleCancel}
                        onAccept={handleAccept}
                        newConcept={newConcept}
                        setNewConcept={setNewConcept}
                    />
                </ConceptProvider>
            ) : (
                <ConceptGrid
                    concepts={filteredConcepts}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterSource={filterSource}
                    setFilterSource={setFilterSource}
                    startNewConcept={startNewConcept}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
            <Toaster />
        </>
    );
}