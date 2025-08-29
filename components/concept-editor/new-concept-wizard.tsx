import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {WizardStep4} from "@/components/concept-editor/wizard-step-4";
import {WizardStep3} from "@/components/concept-editor/wizard-step-3";
import {WizardStep2} from "@/components/concept-editor/wizard-step-2";
import {WizardStep1} from "@/components/concept-editor/wizard-step-1";
import {WizardGuide} from "@/components/concept-editor/wizard-guide";
import {toast} from "sonner";
import {useState} from "react";
import {NewConceptWizardProps} from "@/components/concept-editor/proptypes";
import {useConcept} from "@/components/concept-editor/concept-context";


export const NewConceptWizard: React.FC<NewConceptWizardProps> = ({ onCancel, onAccept }) => {
    const [wizardStep, setWizardStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [inferredMappings, setInferredMappings] = useState<string[]>([]);
    const {concept, updateConcept } = useConcept();

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

    return (
        <div className="flex flex-col items-center p-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="w-full max-w-4xl">
                <h1 className="text-2xl mb-10 text-left">New Concept Wizard</h1>
                <WizardGuide step={wizardStep} newConcept={concept} />
                <Card className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                    {wizardStep === 1 && (
                        <WizardStep1
                            onNext={() => setWizardStep(2)}
                        />
                    )}
                    {wizardStep === 2 && (
                        <WizardStep2
                            onNext={(updatedConcept) => {
                                setWizardStep(3);
                            }}
                            onBack={() => setWizardStep(1)}
                        />
                    )}
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