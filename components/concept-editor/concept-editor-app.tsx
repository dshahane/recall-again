import {useMemo, useState} from "react";
import { Concept } from "@/components/concept-editor/proptypes";
// import {initialConcepts} from "@/components/concept-editor/types";
import { useFetchConcepts } from '@/hooks/use-concepts';
import {toast, Toaster} from "sonner";
import {NewConceptWizard} from "@/components/concept-editor/new-concept-wizard";
import {ConceptGrid} from "@/components/concept-editor/concept-grid";
import { v4 as uuidv4 } from "uuid";
import {ConceptProvider, useConceptContext} from "@/components/concept-editor/concept-context";

export default function ConceptEditorApp() {
    //const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);
    const { concepts, isLoading, error, setConcepts, api } = useFetchConcepts();
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [newConcept, setNewConcept] = useState<Partial<Concept>>({
        id: '',
        name: '',
        description: '',
        source: 'schema.org',
        published: false,
        related: [],
        fields: [],
        schemaJson: {},
    });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterSource, setFilterSource] = useState<string>('All');

    const filteredConcepts = useMemo(() => {
        return concepts.filter(concept => {
            const matchesSearch = concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                concept.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterSource === 'All' || concept.source === filterSource;
            return matchesSearch && matchesFilter;
        });
    }, [concepts, searchTerm, filterSource]);    // 2. Handle the different states

    const [isActionLoading, setIsActionLoading] = useState(false);

    if (isLoading || isActionLoading) {
        return <p>Loading concepts... ⏳</p>;
    }

    const startNewConcept = () => {
        setNewConcept({
            id: uuidv4(),
            name: '',
            description: '',
            source: 'schema.org',
            published: false,
            related: [],
            fields: [],
            schemaJson: {},
        });
        setIsCreating(true);
    };

    const handleAccept = async () => {
        if (!newConcept.name || !newConcept.id) {
            toast.error("Concept data is incomplete. Please fill out all required fields.");
            return;
        }

        const conceptToSave = newConcept as Concept;
        const payload = {
            schema_json: conceptToSave.schemaJson
        };

        try {
            if (isEditing) {
                // 1. **UPDATE (Edit) Logic**
                // Correct API Call: Use PUT to /concepts/{name} with schema-only body
                await api.put(`/concepts/${conceptToSave.name}`, payload);

                // Update the local state with the modified concept summary
                setConcepts(prevConcepts =>
                    prevConcepts.map(c => c.id === conceptToSave.id ? c : c)
                );
                toast.success(`Concept '${conceptToSave.name}' updated successfully!`);
                setIsEditing(false);

            } else if (isCreating) {
                // 2. **CREATE (New) Logic**
                // API Call: POST to /concepts/{name} with schema-only body
                await api.post(`/concepts/${conceptToSave.name}`, payload);

                // Update the local state by adding the new concept
                setConcepts(prevConcepts => [...prevConcepts, conceptToSave]);
                toast.success(`Concept '${conceptToSave.name}' created successfully!`);
                setIsCreating(false);
            }

        } catch (error) {
            console.error("Save failed:", error);
            toast.error(`Failed to save concept: ${isEditing ? 'update' : 'creation'} failed.`);
        }

        // Reset state after successful save
        setNewConcept({ /* ... reset values ... */ });
    };

    const handleCancel = () => {
        setIsCreating(false);
        setIsEditing(false);
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
            schemaJson: {},
        });
    };

    const handleDelete = async (id: string) => {
        const originalConcepts = concepts; // Store current list in case API fails
        setConcepts(prevConcepts => prevConcepts.filter(c => c.id !== id));
        toast.success("Concept deleted successfully (Awaiting server confirmation).");

        try {
            // NOTE: The backend DELETE expects /concepts/{concept_name}. We MUST find the name first.
            const conceptToDelete = originalConcepts.find(c => c.id === id);
            if (!conceptToDelete) throw new Error("Concept details missing for deletion.");

            await api.delete(`/concepts/${conceptToDelete.name}`);

            // If the API call succeeds, the local state is already updated.
            toast.success("Concept permanently removed.");

        } catch (error) {
            // 2. Error Handling: Revert the UI if the API call fails
            setConcepts(originalConcepts);
            console.error("Failed to delete concept:", error);
            toast.error("Failed to delete concept. Please try again.");
        }
    };

    const handleEdit = async (conceptSummary: Concept) => {
        // Step 1: Fetch the complete schema using the concept ID
        setIsActionLoading(true);

        try {
            // API Call: GET /concepts/{id}
            // Use the base URL implicitly handled by 'api' or use fetch directly with full path
            const response = await api.get(`/concepts/${conceptSummary.id}`);

            // The response is the full ConceptDetails object, including schema_json
            const conceptDetails = await response.data;

            // Step 2: Merge the summary data with the fetched schema data
            const fullConceptData = {
                ...conceptSummary, // Contains id, name, source
                // CRITICAL: The API response nests the schema under 'schema_json'
                // We map it to 'schemaJson' for our internal state property
                schemaJson: conceptDetails.schema_json,
                // You might also need to parse the schema to populate 'fields'
                // if 'fields' is a specialized format for your wizard component.
                // fields: parseSchemaForWizard(conceptDetails.schema_json)
            };

            setNewConcept(fullConceptData);
            setIsEditing(true);

        } catch (error) {
            console.error("Error fetching concept for edit:", error);
            toast.error("Could not load concept schema for editing.");
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <>
            {(isCreating || isEditing) ? (
                <ConceptProvider>
                    <NewConceptWizard
                        onCancel={handleCancel}
                        onAccept={handleAccept}
                        newConcept={newConcept}
                        setNewConcept={setNewConcept}
                    />
                </ConceptProvider>
            ) : (
                <div>
                    <p> Loaded {concepts.length} concepts</p>
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
                </div>

            )}
            <Toaster />
        </>
    );
}