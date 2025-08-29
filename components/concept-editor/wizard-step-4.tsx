import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {WizardStep4Props} from "@/components/concept-editor/proptypes";
import {useConcept} from "@/components/concept-editor/concept-context";

export const WizardStep4: React.FC<WizardStep4Props> = ({ onAccept, onBack }) => {
    // FIXME
    const inferredSchema = {
        name: 'Inferred Schema',
        fields: ['firstName', 'lastName', 'birthDate', 'city'],
    };
    const {concept, updateConcept } = useConcept();

    return (
        <div className="grid gap-6">
            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Step 4: Schema Mapper</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Drag and drop fields to create mappings between the inferred schema and your new concept.</p>
            <div className="flex flex-col md:flex-row gap-6">
                <Card className="w-full md:w-1/2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-inner">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">{inferredSchema.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ul className="list-none space-y-2">
                            {inferredSchema.fields.map((field, index) => (
                                <li key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-100">{field}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="w-full md:w-1/2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-inner">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">{concept.name} Concept</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ul className="list-none space-y-2">
                            {concept.fields?.map((field, index) => (
                                <li key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-100">{field.name}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={onBack} className="rounded-full px-6 py-3 transition-colors duration-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={onAccept} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-6 py-3 transition-colors duration-300">Accept</Button>
            </div>
        </div>
    );
};
