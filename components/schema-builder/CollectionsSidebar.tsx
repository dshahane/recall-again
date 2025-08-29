// /components/schema-builder/CollectionsSidebar.tsx

import * as React from 'react';
import { Plus, Trash, Database } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Schema } from './types';
import { SCHEMA_ORG_CONCEPTS } from './data';

interface CollectionsSidebarProps {
    schema: Schema;
    selectedContentType: string | null;
    onSelectContentType: (type: string) => void;
    onOpenAddCollectionModal: () => void;
    onOpenAddSchemaOrgModal: () => void;
    onDeleteCollection: (name: string) => void;
}

export const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
                                                                   schema,
                                                                   selectedContentType,
                                                                   onSelectContentType,
                                                                   onOpenAddCollectionModal,
                                                                   onOpenAddSchemaOrgModal,
                                                                   onDeleteCollection,
                                                               }) => {
    const collectionKeys = Object.keys(schema);
    // A collection is considered from schema.org if its name matches a known concept
    const schemaOrgCollections = collectionKeys.filter(key => key in SCHEMA_ORG_CONCEPTS);
    const otherCollections = collectionKeys.filter(key => !(key in SCHEMA_ORG_CONCEPTS));

    const renderCollectionLink = (type: string) => (
        <a
            key={type}
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onSelectContentType(type);
            }}
            className={cn(
                buttonVariants({ variant: 'ghost' }),
                'justify-start w-full group',
                selectedContentType === type && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
            )}
        >
            <Database className="w-4 h-4 mr-2" />
            <span className="flex-1 truncate">{type}</span>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 data-[state=selected]:opacity-100"
                        data-state={selectedContentType === type ? 'selected' : 'unselected'}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDeleteCollection(type);
                        }}
                    >
                        <Trash className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Delete {type}</p>
                </TooltipContent>
            </Tooltip>
        </a>
    );

    return (
        <aside className="w-72 flex-shrink-0 border-r bg-background p-4 flex flex-col space-y-4">
            <nav className="flex flex-col space-y-4">
                <div>
                    <div className="flex justify-between items-center px-2 mb-1">
                        <h3 className="text-sm font-semibold text-muted-foreground">Other Collections</h3>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onOpenAddCollectionModal}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right"><p>Create New Collection</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex flex-col space-y-1">
                        {otherCollections.length > 0
                            ? otherCollections.map(renderCollectionLink)
                            : <p className="px-2 text-xs text-muted-foreground">No custom collections yet.</p>}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center px-2 mb-1">
                        <h3 className="text-sm font-semibold text-muted-foreground">Schema.org Collections</h3>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onOpenAddSchemaOrgModal}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right"><p>Create from Schema.org</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex flex-col space-y-1">
                        {schemaOrgCollections.length > 0
                            ? schemaOrgCollections.map(renderCollectionLink)
                            : <p className="px-2 text-xs text-muted-foreground">No schema.org collections yet.</p>}
                    </div>
                </div>
            </nav>
        </aside>
    );
};