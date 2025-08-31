import {WizardGuideProps} from "@/components/concept-editor/proptypes";
import {FileText, GitFork, ListChecks, Wand2} from "lucide-react";
import {cn} from "@/lib/utils";

export const WizardGuide: React.FC<WizardGuideProps> = ({ step, newConcept }) => {
    const steps = [
        { name: 'Basic Details', icon: <FileText className="w-5 h-5" /> },
        { name: 'Edit Fields', icon: <ListChecks className="w-5 h-5" /> },
        { name: 'Discover Mappings', icon: <Wand2 className="w-5 h-5" /> },
        { name: 'Schema Mapper', icon: <GitFork className="w-5 h-5" /> }
    ];

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
            {/*
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mr-4 mb-4 md:mb-0">
                Create new {newConcept.name || 'Concept'}
            </h2>*/}
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
                {steps.map((s, index) => (
                    <div key={index} className={cn(
                        "flex items-center gap-2 text-sm font-medium",
                        step > index + 1 ? "text-green-500" : "text-gray-400 dark:text-gray-500",
                        step === index + 1 && "text-indigo-600 dark:text-indigo-400 font-bold"
                    )}>
                        <div className={cn(
                            "p-2 rounded-full",
                            step > index + 1 ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300",
                            step === index + 1 && "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
                        )}>
                            {s.icon}
                        </div>
                        <span>{s.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};