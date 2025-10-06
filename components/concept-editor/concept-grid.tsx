import {ConceptCard} from "@/components/concept-editor/concept-card";
import { Card } from "../ui/card";
import {Plus} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Input} from "@/components/ui/input";
import {ConceptGridProps} from "@/components/concept-editor/proptypes";
import {schemaNamespaces} from "@/components/concept-editor/types";

export const ConceptGrid: React.FC<ConceptGridProps> = ({ concepts, searchTerm, setSearchTerm, filterSource, setFilterSource, startNewConcept, onDelete, onEdit }) => {
    return (
        <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl mb-10 text-left">Concept Editor</h1>

            <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
                <Input
                    type="text"
                    placeholder="Search concepts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-6 py-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <Select value={filterSource} onValueChange={setFilterSource}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                        {schemaNamespaces.map((source) => (
                            <SelectItem key={source} value={source}>
                                {source === "All" ? "All Sources" : source}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filterSource}
                    onValueChange={setFilterSource}
                >
                    <SelectContent>
                        <SelectItem value="All">All Sources</SelectItem>
                        <SelectItem value="schema.org">schema.org</SelectItem>
                        <SelectItem value="DBpedia">DBpedia</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                <Card
                    className="flex flex-col items-center justify-center p-8 h-[300px] rounded-3xl bg-white dark:bg-gray-800 shadow-md transition-shadow duration-300 hover:shadow-xl
                   border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400
                   cursor-pointer"
                    onClick={startNewConcept}
                >
                    {/* HERE IS THE CHANGE: increased from h-10 w-10 to h-20 w-20 */}
                    <Plus className="h-20 w-20 text-gray-400 dark:text-gray-500" />

                    <p className="mt-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">Add new concept</p>
                </Card>

                {concepts.map((concept) => (
                    <ConceptCard
                        key={concept.id}
                        concept={concept}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};