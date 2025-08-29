import * as React from "react";
import {useMemo, useState} from "react";
import {nanoid} from "nanoid";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import {ChevronRight, ExternalLink} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Field, getFieldTypeIcon} from "@/components/schema-builder/types";
import {SCHEMA_ORG_CONCEPTS} from "@/components/schema-builder/data";

interface CreateSchemaOrgModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAddCollection: (name: string, fields: Field[]) => void;
}

export const CreateSchemaOrgModal: React.FC<CreateSchemaOrgModalProps> = ({ isOpen, onOpenChange, onAddCollection }) => {
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
    const [collectionName, setCollectionName] = useState('');

    const rootSchemas = useMemo(() =>
            Object.keys(SCHEMA_ORG_CONCEPTS).filter(url =>
                !Object.values(SCHEMA_ORG_CONCEPTS).some(s => s.subclasses?.includes(url))
            ),
        []);

    const handleSelectSchema = (url: string) => {
        setSelectedUrl(url);
        setCollectionName(url.split('/').pop() || '');
    };

    const handleSubmit = () => {
        if (collectionName.trim() && selectedUrl && SCHEMA_ORG_CONCEPTS[selectedUrl]) {
            const newFields = SCHEMA_ORG_CONCEPTS[selectedUrl].fields.map(f => ({ ...f, id: nanoid() }));
            onAddCollection(collectionName.trim(), newFields);
            onOpenChange(false);
        }
    };

    React.useEffect(() => {
        if (!isOpen) {
            setSelectedUrl(null);
            setCollectionName('');
        }
    }, [isOpen]);

    const renderSchemaTree = (urls: string[]) => (
        <ul className="space-y-1">
            {urls.map(url => <SchemaNode key={url} url={url} selectedUrl={selectedUrl} onSelect={handleSelectSchema} />)}
        </ul>
    );

    const selectedSchema = selectedUrl ? SCHEMA_ORG_CONCEPTS[selectedUrl] : null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Create from Schema.org</DialogTitle>
                    <DialogDescription>
                        Select a standard schema.org type to bootstrap your collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden p-6">
                    <div className="col-span-1 border-r pr-6">
                        <h4 className="text-sm font-semibold mb-2">Available Types</h4>
                        <ScrollArea className="h-full">
                            {renderSchemaTree(rootSchemas)}
                        </ScrollArea>
                    </div>
                    <div className="col-span-2 flex flex-col">
                        {selectedSchema && selectedUrl ? (
                            <>
                                <ScrollArea className="flex-1 pr-2">
                                    <h3 className="text-xl font-bold">{selectedUrl.split('/').pop()}</h3>
                                    <p className="text-muted-foreground mt-1 mb-4">{selectedSchema.description}</p>
                                    <a href={`https://schema.org/${selectedUrl}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto mb-4")}>
                                        View on schema.org <ExternalLink className="w-3 h-3 ml-1.5" />
                                    </a>
                                    <h4 className="font-semibold mb-2">Properties</h4>
                                    <div className="space-y-2">
                                        {selectedSchema.fields.map(field => (
                                            <div key={field.id} className="text-sm flex items-center p-2 bg-muted/50 rounded-md">
                                                {getFieldTypeIcon(field.type)}
                                                <span className="font-mono text-xs">{field.name}</span>
                                                <Badge variant="outline" className="ml-auto">{field.type.split('/').pop()}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="mt-auto pt-6 border-t">
                                    <Label htmlFor="newCollectionName" className="font-semibold">Collection Name</Label>
                                    <Input id="newCollectionName" value={collectionName} onChange={e => setCollectionName(e.target.value)} className="mt-2"/>
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-muted-foreground">Select a schema type to see details.</p>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter className="p-6 pt-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!selectedSchema}>Create Collection</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Sub-component for the schema tree
const SchemaNode: React.FC<{ url: string; selectedUrl: string | null; onSelect: (url: string) => void; }> = ({ url, selectedUrl, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const concept = SCHEMA_ORG_CONCEPTS[url];
    const hasSubclasses = (concept?.subclasses?.length || 0) > 0;

    return (
        <li>
            <div className="flex items-center group">
                {hasSubclasses ? (
                    <button onClick={() => setIsExpanded(!isExpanded)} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'w-6 h-6')}>
                        <ChevronRight className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')} />
                    </button>
                ) : (
                    <span className="w-6 h-6 inline-block" />
                )}
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onSelect(url); }}
                    className={cn(
                        'flex-1 text-sm p-1 rounded-md transition-colors',
                        selectedUrl === url ? 'bg-muted font-semibold' : 'hover:bg-muted/50'
                    )}
                >
                    {url.split('/').pop()}
                </a>
            </div>
            {hasSubclasses && isExpanded && (
                <ul className="pl-6 mt-1 space-y-1">
                    {concept.subclasses!.map(subUrl => (
                        <SchemaNode key={subUrl} url={subUrl} selectedUrl={selectedUrl} onSelect={onSelect} />
                    ))}
                </ul>
            )}
        </li>
    );
};
