import {SchemaTreeViewProps} from "@/components/concept-editor/proptypes";
import {useState} from "react";
import {mockSchemaTreeData} from "@/components/concept-editor/types";
import {cn} from "@/lib/utils";
import {ChevronRight, GitBranchPlus} from "lucide-react";

export const SchemaTreeView: React.FC<SchemaTreeViewProps> = ({ source, selectedConcept, newConcept, onSelectConcept }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (name: string) => {
        setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const treeData = mockSchemaTreeData[source] || []; // FIXME

    return (
        <div className="mt-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 max-h-[250px] overflow-y-auto">
            {treeData.length > 0 ? (
                treeData.map((concept, index) => (
                    <div key={index} className="space-y-1">
                        <div
                            className={cn(
                                "flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors",
                                selectedConcept === concept.name && "bg-indigo-100 dark:bg-indigo-900",
                                concept.derived.length > 0 && "hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                            onClick={() => concept.derived.length > 0 ? toggleExpand(concept.name) : onSelectConcept(concept.name, newConcept)}
                        >
                            <ChevronRight className={cn("h-4 w-4 transform transition-transform", expanded[concept.name] && "rotate-90")} />
                            <div onClick={() => onSelectConcept(concept.name, newConcept )} className="flex-1">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{concept.name}</span>
                            </div>
                        </div>
                        {expanded[concept.name] && (
                            <ul className="pl-6 space-y-1">
                                {concept.derived.map((derivedConcept, dIndex) => (
                                    <li
                                        key={dIndex}
                                        className={cn(
                                            "p-2 rounded-lg cursor-pointer transition-colors",
                                            selectedConcept === derivedConcept.name ? "bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 font-medium" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                        )}
                                        onClick={() => onSelectConcept(derivedConcept.name, newConcept)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <GitBranchPlus className="w-4 h-4 text-gray-500" />
                                            <span>{derivedConcept.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-sm text-center text-gray-400">No concepts found for {source} schema.</p>
            )}
        </div>
    );
};