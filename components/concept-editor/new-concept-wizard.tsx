import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {WizardStep4} from "@/components/concept-editor/wizard-step-4";
import {WizardStep3} from "@/components/concept-editor/wizard-step-3";
import {WizardStep2} from "@/components/concept-editor/wizard-step-2";
import {WizardStep1} from "@/components/concept-editor/wizard-step-1";
import {WizardGuide} from "@/components/concept-editor/wizard-guide";
import {toast} from "sonner";
import {useState, useEffect} from "react";
import {NewConceptWizardProps} from "@/components/concept-editor/proptypes";
import {useConceptContext} from "@/components/concept-editor/concept-context";
import {Concept} from "./proptypes";

export const NewConceptWizard: React.FC<NewConceptWizardProps> = ({ newConcept, setNewConcept, onCancel, onAccept }) => {
    const [wizardStep, setWizardStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [inferredMappings, setInferredMappings] = useState<string[]>([]);

    // Get the Context state and setter
    const { concept, updateConcept } = useConceptContext();

    useEffect(() => {
        // We only synchronize the context when entering edit mode, which is when newConcept.id is present.
        if (newConcept && newConcept.id) {

            // CRITICAL FIX: Only update the context if the context's ID does NOT match the incoming prop's ID.
            if (concept.id !== newConcept.id) {
                // Push the initial data from the parent state (the prop) into the Context
                updateConcept(newConcept as Concept);

                // Set the step ONLY when new data is successfully loaded into the context.
                setWizardStep(1);
            }
        }
    }, [newConcept?.id, updateConcept, concept.id]);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // 1. Calculate the new data object based on the current context state (concept)
        // This is safe because 'concept' from context is guaranteed to be the latest value.
        const updatedData = {
            ...concept,
            [name]: value,
        };

        // 2. Update the Context directly with the new object.
        // This resolves the TypeScript error, as updateConcept now receives the object it expects.
        updateConcept(updatedData as Concept);

        // 3. Still update the parent state setter for consistency and eventual acceptance
        // We use the new object here, which is compatible with Partial<Concept>
        setNewConcept(updatedData);
    };

    const handleInferMappings = () => {
        setLoading(true);
        setProgress(0);
        setInferredMappings([]);
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            setProgress(currentProgress);
            if (currentProgress >= 100) {
                clearInterval(interval);
                setLoading(false);
                setInferredMappings(['InferredLocation', 'InferredTime', 'InferredParticipant']);
                toast.success('Mappings discovered successfully!');
            }
        }, 300);
    };

    // New Check: Determine if the context is fully synchronized with the incoming edit data.
    const isContextSynchronized = !newConcept.id || (newConcept.id && concept.id === newConcept.id);

    return (
        <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="w-full max-w-4xl">
                <h1 className="text-2xl mb-10 text-left">
                    {newConcept.id ? 'Edit Concept Wizard' : 'New Concept Wizard'}
                </h1>
                <WizardGuide step={wizardStep} newConcept={concept} />
                <Card className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                    {/* Only render the steps if the context is synchronized with the new/edit concept data */}
                    {isContextSynchronized ? (
                        <>
                            {wizardStep === 1 && (
                                <WizardStep1
                                    onNext={() => setWizardStep(2)}
                                    onInputChange={handleInputChange}
                                />
                            )}
                            {wizardStep === 2 && (
                                <WizardStep2
                                    onNext={(updatedConcept: Partial<Concept>) => {
                                        setWizardStep(3);
                                    }}
                                    onBack={() => setWizardStep(1)}
                                    onInputChange={handleInputChange}
                                />
                            )}
                            {/* ... (remaining steps) */}
                            {wizardStep === 3 && (
                                <WizardStep3
                                    onNext={() => setWizardStep(4)}
                                    onBack={() => setWizardStep(2)}
                                    onInfer={handleInferMappings}
                                    loading={loading}
                                    progress={progress}
                                    inferredMappings={inferredMappings}
                                />
                            )}
                            {wizardStep === 4 && (
                                <WizardStep4
                                    onAccept={onAccept}
                                    onBack={() => setWizardStep(3)}
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center p-12 text-gray-500 dark:text-gray-400">
                            Loading concept data...
                        </div>
                    )}
                </Card>
                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={onCancel} className="rounded-full px-6 py-3 transition-colors duration-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};
