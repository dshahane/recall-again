import {WizardStep1Props} from "@/components/concept-editor/proptypes";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {SchemaTreeView} from "@/components/concept-editor/schema-tree-view";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import {mockFieldsForConcept, schemaNamespaces} from "@/components/concept-editor/types";
import {useConcept} from "@/components/concept-editor/concept-context";
import {useState} from "react";

export const WizardStep1: React.FC<WizardStep1Props> = ({ onNext }) => {
    const {concept, updateConcept } = useConcept();
    const [selectedSource, setSelectedSource] = useState(concept.source || 'schema.org');


    const handleSelectSchema = (source: string) => {
        setSelectedSource(source);
        updateConcept({ source });
    };

    const handleSelectConcept = (parentName:string, derivedName:string) => {
        const fullUrl = `http://${selectedSource}/${parentName}/${derivedName}`; // FIXME
        const fields = mockFieldsForConcept(fullUrl);
        updateConcept({ name: derivedName, source: fullUrl, fields });
    };

    return (
        <div className="grid gap-6">
            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Step 1: Basic Details</h3>
            <div className="grid gap-3">
                <Label htmlFor="concept-source" className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Schema</Label>
                <Select value={selectedSource || 'schema.org'} onValueChange={handleSelectSchema}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                        {schemaNamespaces.map((source) => (
                            <SelectItem key={source} value={source}>
                                {source}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="concept-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Concept Name</Label>
                <Input
                    id="concept-name"
                    value={concept.name || ''}
                    onChange={(e) => updateConcept({ name: e.target.value })}
                    className="rounded-lg p-2 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
            </div>
            {concept.source && (
                <div className="grid gap-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Derived Concepts</Label>
                    <SchemaTreeView
                        source={concept.source}
                        selectedConcept={concept.name || ''}
                        onSelectConcept={handleSelectConcept}
                    />
                </div>
            )}
            <div className="grid gap-3">
                <Label htmlFor="concept-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Description</Label>
                <Textarea
                    id="concept-description"
                    value={concept.description || ''}
                    onChange={(e) => updateConcept({ description: e.target.value })}
                    placeholder="Enter a detailed description of your concept..."
                    className="rounded-lg p-3 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
            </div>
            <div className="flex justify-end">
                <Button onClick={onNext} disabled={!concept.name || !concept.source} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-6 py-3 transition-colors duration-300">
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};