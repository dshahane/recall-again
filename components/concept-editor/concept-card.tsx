"use client"

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Library,} from "lucide-react"
import { cn } from "@/lib/utils"
import { ConceptCardProps } from "@/components/concept-editor/proptypes"
import {Separator} from "@/components/ui/separator";

export const ConceptCard: React.FC<ConceptCardProps> = ({ concept, onEdit, onDelete }) => {
    return (
        <Card>
            {/* Header actions */}
            <CardHeader className="flex flex-row items-center justify-end py-2 px-3 p-2">
                <div className="flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        onClick={() => onEdit(concept)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600"
                        onClick={() => onDelete(concept.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {/* Body */}
            <CardContent className="flex-1 px-2 py-2">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate p-2">
                    {concept.name}
                </CardTitle>
                <Separator/>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400 line-clamp-5 p-2">
                    {concept.description}
                </p>

                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Library className="h-3.5 w-3.5 text-gray-400" />
                        <span>{concept.source}</span>
                    </div>
                    {concept.related.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {concept.related.slice(0, 2).map((rel, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
                                >
                                    {rel}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter>
            <div className="flex justify-end px-4 pb-2">
                <Badge
                    className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-md",
                        concept.published
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    )}
                >
                    {concept.published ? "Published" : "Draft"}
                </Badge>
            </div>
            </CardFooter>
        </Card>
    )
}

