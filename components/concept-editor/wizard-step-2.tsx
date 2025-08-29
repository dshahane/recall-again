import {Field, WizardStep2Props} from "@/components/concept-editor/proptypes";
import { useState } from "react";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {ChevronLeft, ChevronRight, Plus, Tag, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {mockFieldsForConcept, primitiveConceptTyps, schemaNamespaces} from "@/components/concept-editor/types";
import {useConcept} from "@/components/concept-editor/concept-context";

export const WizardStep2: React.FC<WizardStep2Props> = ({ onNext, onBack }) => {
    const {concept, updateConcept } = useConcept();
    const mockFields = mockFieldsForConcept(`http://${concept.source}/${concept.name}`); //FIXME
    const [fields, setFields] = useState<Field[]>(mockFields);
    const [newFieldName, setNewFieldName] = useState<string>('');
    const [newFieldType, setNewFieldType] = useState<string>('Text');
    const [newFieldDescription, setNewFieldDescription] = useState<string>('');

    const addField = () => {
        if (newFieldName) {
            setFields([...fields, { name: newFieldName, type: newFieldType, description: newFieldDescription }]);
            setNewFieldName('');
            setNewFieldType('Text');
            setNewFieldDescription('');
        }
    };

    const removeField = (fieldName: string) => {
        setFields(fields.filter(f => f.name !== fieldName));
    };

    return (
        <div className="grid gap-6">
            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Step 2: Edit Fields</h3>
            <div className="grid gap-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fields</Label>
                <div className="flex flex-col gap-2 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 max-h-[300px] overflow-y-auto shadow-inner">
                    {fields.map((field, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                                <Badge className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {field.type}
                                </Badge>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">{field.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 sm:ml-4">{field.name}</span>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 transition-colors duration-200 mt-2 sm:mt-0 sm:ml-auto" onClick={() => removeField(field.name)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-sm text-center text-gray-400 py-4">No fields defined. Add some below!</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                    placeholder="New field name"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="flex-1 rounded-lg p-2 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
                <Select value={newFieldType} onValueChange={setNewFieldType}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                        {primitiveConceptTyps.map((source) => (
                            <SelectItem key={source} value={source}>
                                {source}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

            </div>
            <div className="flex gap-3">
                <Textarea
                    placeholder="One-line field description"
                    value={newFieldDescription}
                    onChange={(e) => setNewFieldDescription(e.target.value)}
                    className="rounded-lg p-2 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
            </div>
            <Button onClick={addField} disabled={!newFieldName} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
                <Plus className="w-4 h-4 mr-2" /> Add Field
            </Button>

            <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={onBack} className="rounded-full px-6 py-3 transition-colors duration-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={() => onNext({ ...concept, fields })} disabled={!concept.fields || concept.fields.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-6 py-3 transition-colors duration-300">
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};