'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import {
    ArrowLeft,
    ChevronRight,
    ExternalLink,
    Pencil,
    Plus,
    Trash,
    X,
    BookType,
    Database,
    Globe,
    Hash,
    ToggleRight,
    Calendar,
    Clock,
    Type
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// --- (TYPES and MOCK DATA remain the same, so they are omitted for brevity) ---
// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type FieldType =
    | 'https://schema.org/Text'
    | 'https://schema.org/URL'
    | 'https://schema.org/Number'
    | 'https://schema.org/Boolean'
    | 'https://schema.org/Date'
    | 'https://schema.org/Time'
    | 'select'
    | string; // Allow for other schema.org types

interface Field {
    id: string;
    name: string;
    type: FieldType;
    required: boolean;
    options?: string[];
}

type Schema = Record<string, Field[]>;

interface SchemaOrgConcept {
    description: string;
    fields: Field[];
    subclasses?: string[];
}

type SchemaOrgConcepts = Record<string, SchemaOrgConcept>;

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const INITIAL_SCHEMA: Schema = {
    Article: [
        { id: nanoid(), name: 'title', type: 'https://schema.org/Text', required: true },
        { id: nanoid(), name: 'description', type: 'https://schema.org/Text', required: false },
        { id: nanoid(), name: 'slug', type: 'https://schema.org/URL', required: true },
        { id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true },
    ],
    Author: [
        { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
        { id: nanoid(), name: 'email', type: 'https://schema.org/Text', required: true },
        { id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true },
    ],
    Category: [
        { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
        { id: nanoid(), name: 'slug', type: 'https://schema.org/URL', required: true },
        { id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true },
    ],
};

const SCHEMA_ORG_CONCEPTS: SchemaOrgConcepts = {
    'CreativeWork': {
        description: 'The most generic kind of creative work, including books, music, etc.',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
            { id: nanoid(), name: 'author', type: 'https://schema.org/Person', required: false },
        ],
        subclasses: ['Article', 'Book', 'Movie'],
    },
    'Product': {
        description: 'Any offered product or service.',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
            { id: nanoid(), name: 'sku', type: 'https://schema.org/Text', required: false },
            { id: nanoid(), name: 'brand', type: 'https://schema.org/Brand', required: false },
            { id: nanoid(), name: 'offers', type: 'https://schema.org/Offer', required: false },
        ],
    },
    'Person': {
        description: 'A person (alive, dead, undead, or fictional).',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
            { id: nanoid(), name: 'email', type: 'https://schema.org/Text', required: false },
        ],
    },
    'Brand': {
        description: 'A brand which can be used to disambiguate products or services.',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
        ]
    },
    'Offer': {
        description: 'An offer to transfer some rights to an item or to provide a service.',
        fields: [
            { id: nanoid(), name: 'price', type: 'https://schema.org/Number', required: true },
            { id: nanoid(), name: 'priceCurrency', type: 'https://schema.org/Text', required: true },
        ]
    },
    'Article': {
        description: 'An article, such as a news article or piece of investigative report.',
        fields: [
            { id: nanoid(), name: 'headline', type: 'https://schema.org/Text', required: true },
        ]
    },
    'Author': {
        description: 'A person who created a work.',
        fields: [
            { id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true },
        ]
    },
};

const PRIMITIVE_SCHEMA_TYPES: FieldType[] = [
    'https://schema.org/Text',
    'https://schema.org/URL',
    'https://schema.org/Number',
    'https://schema.org/Boolean',
    'https://schema.org/Date',
    'https://schema.org/Time',
    'select',
];

const getFieldTypeIcon = (type: FieldType) => {
    const iconProps = { className: "w-4 h-4 mr-2 text-muted-foreground" };
    if (type.startsWith('https://schema.org/')) {
        const schemaName = type.split('/').pop()?.toLowerCase();
        switch (schemaName) {
            case 'text': return <Type {...iconProps} />;
            case 'url': return <Globe {...iconProps} />;
            case 'number': return <Hash {...iconProps} />;
            case 'boolean': return <ToggleRight {...iconProps} />;
            case 'date': return <Calendar {...iconProps} />;
            case 'time': return <Clock {...iconProps} />;
            default: return <BookType {...iconProps} />;
        }
    }
    return <Database {...iconProps} />;
};
// ----------------------------------------------------------------------
// SIDEBAR COMPONENT
// ----------------------------------------------------------------------

interface CollectionsSidebarProps {
    schema: Schema;
    selectedContentType: string | null;
    onSelectContentType: (type: string) => void;
    onOpenAddCollectionModal: () => void;
    onOpenAddSchemaOrgModal: () => void;
    onDeleteCollection: (name: string) => void;
}

const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
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


// ----------------------------------------------------------------------
// FIELD MODAL (ADD/EDIT)
// ----------------------------------------------------------------------

interface FieldModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (field: Field) => void;
    existingField?: Field | null;
}

const FieldModal: React.FC<FieldModalProps> = ({ isOpen, onOpenChange, onSave, existingField }) => {
    const isEditing = !!existingField;
    const [name, setName] = useState('');
    const [type, setType] = useState<FieldType>(PRIMITIVE_SCHEMA_TYPES[0]);
    const [required, setRequired] = useState(false);

    React.useEffect(() => {
        if (isOpen && existingField) {
            setName(existingField.name);
            setType(existingField.type);
            setRequired(existingField.required);
        } else if (!isOpen) {
            // Reset form on close
            setName('');
            setType(PRIMITIVE_SCHEMA_TYPES[0]);
            setRequired(false);
        }
    }, [isOpen, existingField]);

    const handleSubmit = () => {
        if (!name || !type) return;
        onSave({
            id: existingField?.id || nanoid(),
            name,
            type,
            required,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? `Edit Field: ${existingField.name}` : 'Add New Field'}</DialogTitle>
                    <DialogDescription>
                        Configure the properties for this field in your collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={type} onValueChange={(value: FieldType) => setType(value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                {PRIMITIVE_SCHEMA_TYPES.map(t => (
                                    <SelectItem key={t} value={t}>{t.split('/').pop()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2 justify-end col-start-2 col-span-3">
                        <Checkbox id="required" checked={required} onCheckedChange={checked => setRequired(!!checked)} />
                        <Label htmlFor="required" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Required Field
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        {isEditing ? 'Save Changes' : 'Add Field'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// ----------------------------------------------------------------------
// ADD COLLECTION MODAL
// ----------------------------------------------------------------------

interface AddCollectionModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAddCollection: (name: string, fields: Field[]) => void;
}

const AddCollectionModal: React.FC<AddCollectionModalProps> = ({ isOpen, onOpenChange, onAddCollection }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onAddCollection(name.trim(), []);
            onOpenChange(false);
            setName('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                    <DialogDescription>
                        Give your new collection type a name. You can add fields later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="collectionName" className="text-right">Name</Label>
                        <Input id="collectionName" value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="e.g., Blog Posts"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// --- (CreateSchemaOrgModal and SchemaNode remain the same) ---
// ----------------------------------------------------------------------
// SCHEMA.ORG MODAL
// ----------------------------------------------------------------------

interface CreateSchemaOrgModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAddCollection: (name: string, fields: Field[]) => void;
}

const CreateSchemaOrgModal: React.FC<CreateSchemaOrgModalProps> = ({ isOpen, onOpenChange, onAddCollection }) => {
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

// ----------------------------------------------------------------------
// MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function SchemaBuilderPage() {
    const [schema, setSchema] = useState<Schema>(INITIAL_SCHEMA);
    const [selectedContentType, setSelectedContentType] = useState<string | null>('Article');

    // Modal states
    const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
    const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState(false);
    const [isSchemaOrgModalOpen, setIsSchemaOrgModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<Field | null>(null);

    const currentFields = selectedContentType ? schema[selectedContentType] : [];

    const handleAddField = (newField: Field) => {
        if (!selectedContentType) return;
        setSchema(prev => ({
            ...prev,
            [selectedContentType]: [...prev[selectedContentType], newField],
        }));
    };

    const handleUpdateField = (updatedField: Field) => {
        if (!selectedContentType) return;
        setSchema(prev => ({
            ...prev,
            [selectedContentType]: prev[selectedContentType].map(f => f.id === updatedField.id ? updatedField : f),
        }));
    };

    const handleDeleteField = (fieldId: string) => {
        if (!selectedContentType) return;
        setSchema(prev => ({
            ...prev,
            [selectedContentType]: prev[selectedContentType].filter(f => f.id !== fieldId),
        }));
    };

    const handleAddCollectionType = (name: string, fields: Field[]) => {
        if (schema[name]) {
            console.error(`Collection type "${name}" already exists.`);
            return;
        }
        setSchema(prev => ({ ...prev, [name]: fields }));
        setSelectedContentType(name);
    };

    const handleDeleteCollection = (collectionName: string) => {
        if (window.confirm(`Are you sure you want to delete the "${collectionName}" collection?`)) {
            if (selectedContentType === collectionName) {
                setSelectedContentType(null);
            }
            setSchema(prev => {
                const newSchema = { ...prev };
                delete newSchema[collectionName];
                return newSchema;
            });
        }
    };

    const handleOpenEditModal = (field: Field) => {
        setEditingField(field);
        setIsFieldModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingField(null);
        setIsFieldModalOpen(true);
    }

    return (
        <TooltipProvider>
            <div className="flex h-full bg-background text-foreground">
                <CollectionsSidebar
                    schema={schema}
                    selectedContentType={selectedContentType}
                    onSelectContentType={setSelectedContentType}
                    onOpenAddCollectionModal={() => setIsAddCollectionModalOpen(true)}
                    onOpenAddSchemaOrgModal={() => setIsSchemaOrgModalOpen(true)}
                    onDeleteCollection={handleDeleteCollection}
                />
                <main className="flex-1 p-8 overflow-auto">
                    {selectedContentType ? (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>{selectedContentType}</CardTitle>
                                        <CardDescription>
                                            Define the fields for the {selectedContentType} collection type.
                                        </CardDescription>
                                    </div>
                                    <Button onClick={handleOpenAddModal}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Field
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">Field Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Required</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentFields.map((field) => (
                                            <TableRow key={field.id}>
                                                <TableCell className="font-medium">{field.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        {getFieldTypeIcon(field.type)}
                                                        <Badge variant="secondary">{field.type.split('/').pop()}</Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {field.required ? (
                                                        <Badge variant="default">Required</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Optional</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(field)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Edit Field</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteField(field.id)}>
                                                                <Trash className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Delete Field</TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {currentFields.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>This collection has no fields yet.</p>
                                        <Button variant="link" onClick={handleOpenAddModal}>Add the first field</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-medium text-foreground">Select a collection</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Choose a collection from the sidebar to view its schema.</p>
                            </div>
                        </div>
                    )}
                </main>

                {/* --- Modals --- */}
                <FieldModal
                    isOpen={isFieldModalOpen}
                    onOpenChange={setIsFieldModalOpen}
                    onSave={editingField ? handleUpdateField : handleAddField}
                    existingField={editingField}
                />
                <AddCollectionModal
                    isOpen={isAddCollectionModalOpen}
                    onOpenChange={setIsAddCollectionModalOpen}
                    onAddCollection={handleAddCollectionType}
                />
                <CreateSchemaOrgModal
                    isOpen={isSchemaOrgModalOpen}
                    onOpenChange={setIsSchemaOrgModalOpen}
                    onAddCollection={handleAddCollectionType}
                />

            </div>
        </TooltipProvider>
    );
}