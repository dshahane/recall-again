import {WizardStep3Props} from "@/components/concept-editor/proptypes";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, Sparkles, Wand2} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@radix-ui/react-progress";

export const WizardStep3: React.FC<WizardStep3Props> = ({ onNext, onBack, onInfer, loading, progress, inferredMappings }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="grid gap-6">
            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Step 3: Discover Mappings</h3>
            <div className="grid gap-3">
                <Label htmlFor="example-file" className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Example File</Label>
                <Input id="example-file" type="file" onChange={handleFileChange} className="rounded-lg p-2 file:text-gray-700 file:font-medium dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 file:dark:text-gray-100" />
                <Button onClick={onInfer} disabled={!file || loading} className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-6 py-3 transition-colors duration-300">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Discover Mappings
                </Button>
            </div>
            {loading && (
                <div className="flex flex-col gap-2 mt-4">
                    <Progress
                        value={progress}
                        className="w-full h-2 rounded-full"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{progress}% Complete</span>
                </div>
            )}
            {inferredMappings.length > 0 && (
                <div className="grid gap-3 mt-4">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Inferred Concepts</Label>
                    <div className="flex flex-wrap gap-2">
                        {inferredMappings.map((mapping, index) => (
                            <Badge key={index} variant="default" className="flex items-center gap-1 rounded-full px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 font-semibold">
                                <Sparkles className="h-3 w-3" />
                                {mapping}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={onBack} className="rounded-full px-6 py-3 transition-colors duration-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={onNext} disabled={inferredMappings.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-6 py-3 transition-colors duration-300">
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};