'use client';

import * as React from 'react';
import {useState} from 'react';
import {nanoid} from 'nanoid';
import {Button} from '@/components/ui/button'
import {ArrowLeft, ChevronRight, ExternalLink, Pencil, Plus, Trash, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const INITIAL_SCHEMA = {
    Article: [{id: nanoid(), name: 'title', type: 'https://schema.org/Text', required: true}, {
        id: nanoid(),
        name: 'description',
        type: 'https://schema.org/Text',
        required: false
    }, {id: nanoid(), name: 'slug', type: 'https://schema.org/URL', required: true}, {
        id: nanoid(),
        name: 'status',
        type: 'select',
        options: ['Draft', 'Published'],
        required: true
    },],
    Author: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
        id: nanoid(),
        name: 'email',
        type: 'https://schema.org/Text',
        required: true
    }, {id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true},],
    Category: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
        id: nanoid(),
        name: 'slug',
        type: 'https://schema.org/URL',
        required: true
    }, {id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true},],
    User: [{id: nanoid(), name: 'username', type: 'https://schema.org/Text', required: true}, {
        id: nanoid(),
        name: 'role',
        type: 'https://schema.org/Text',
        required: false
    }, {id: nanoid(), name: 'status', type: 'select', options: ['Draft', 'Published'], required: true},],
};

// Mock schemas for schema.org concepts with a hierarchical structure
const SCHEMA_ORG_CONCEPTS = {
    'https://schema.org/Product': {
        description: 'Any offered product or service.',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'description',
            type: 'https://schema.org/Text',
            required: false
        }, {id: nanoid(), name: 'sku', type: 'https://schema.org/Text', required: false}, {
            id: nanoid(),
            name: 'brand',
            type: 'https://schema.org/Brand',
            required: false
        }, {id: nanoid(), name: 'offers', type: 'https://schema.org/Offer', required: false},],
        subclasses: ['https://schema.org/Vehicle', 'https://schema.org/SoftwareApplication', 'https://schema.org/Service',]
    }, 'https://schema.org/Vehicle': {
        description: 'A vehicle is a device that is used to transport people or goods.',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'vehicleModel',
            type: 'https://schema.org/Text',
            required: false
        }, {id: nanoid(), name: 'fuelType', type: 'https://schema.org/Text', required: false},]
    }, 'https://schema.org/SoftwareApplication': {
        description: 'A software application.',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'operatingSystem',
            type: 'https://schema.org/Text',
            required: false
        }, {id: nanoid(), name: 'applicationCategory', type: 'https://schema.org/Text', required: false},]
    }, 'https://schema.org/Service': {
        description: 'A service offered by an organization, person, or service provider.',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'provider',
            type: 'https://schema.org/Person',
            required: false
        },]
    }, 'https://schema.org/Offer': {
        description: 'An offer to sell a product, or to provide a service.',
        fields: [{id: nanoid(), name: 'price', type: 'https://schema.org/Number', required: true}, {
            id: nanoid(),
            name: 'priceCurrency',
            type: 'https://schema.org/Text',
            required: true
        }, {id: nanoid(), name: 'url', type: 'https://schema.org/URL', required: true},]
    }, 'https://schema.org/CreativeWork': {
        description: 'The most generic kind of creative work, including books, music, films, photographs, software, etc.',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'author',
            type: 'https://schema.org/Person',
            required: false
        },],
        subclasses: ['https://schema.org/Book', 'https://schema.org/Movie']
    }, 'https://schema.org/Book': {
        description: 'A book.',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'isbn',
            type: 'https://schema.org/Text',
            required: false
        }, {id: nanoid(), name: 'bookFormat', type: 'https://schema.org/Text', required: false},]
    }, 'https://schema.org/Movie': {
        description: 'A movie.',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'director',
            type: 'https://schema.org/Person',
            required: false
        }, {id: nanoid(), name: 'actor', type: 'https://schema.org/Person', required: false},]
    }, 'https://schema.org/Brand': {
        description: 'A brand is a name, term, design, symbol, or other feature that distinguishes a good or service from those of other sellers.',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'slogan',
            type: 'https://schema.org/Text',
            required: false
        },]
    }, 'https://schema.org/Person': {
        description: 'A person (alive, dead, undead, or fictional).',
        fields: [{id: nanoid(), name: 'name', type: 'https://schema.org/Text', required: true}, {
            id: nanoid(),
            name: 'email',
            type: 'https://schema.org/Text',
            required: false
        },]
    },
};

const PRIMITIVE_SCHEMA_TYPES = ['https://schema.org/Text', 'https://schema.org/Number', 'https://schema.org/URL', 'https://schema.org/Boolean', 'https://schema.org/Date', 'https://schema.org/Time',];

const CollectionsSidebar = ({
                                selectedContentType,
                                onSelectContentType,
                                onOpenAddCollectionModal,
                                onOpenAddSchemaOrgModal,
                                schema
                            }) => {
    const collectionTypes = Object.keys(schema);

    return (<nav
            className="w-64 flex-shrink-0 bg-gray-900 text-gray-100 border-r border-gray-700 p-4 min-h-screen flex flex-col">
            <h2 className="text-xl font-bold mb-4">Schema</h2>
            <div className="border-t border-gray-700 my-4"></div>
            <ol className="space-y-4 flex-grow">
                <li>
                    <div className="font-semibold text-gray-400 mb-2">Collection Types</div>
                    <ul className="space-y-1">
                        {collectionTypes.map((type) => (<li key={type}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onSelectContentType(type);
                                    }}
                                    className={`flex items-center p-2 rounded-md transition-colors ${selectedContentType === type ? 'bg-blue-600 text-white font-medium hover:bg-blue-700' : 'hover:bg-gray-700'}`}
                                >
                                    <div className="truncate">{type}</div>
                                </a>
                            </li>))}
                    </ul>
                </li>
            </ol>
            <div className="mt-auto pt-4 border-t border-gray-700 space-y-2">
                <Button
                    onClick={onOpenAddCollectionModal}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2"/>
                    Create new collection type
                </Button>
                <Button
                    onClick={onOpenAddSchemaOrgModal}
                    className="w-full bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
                >
                    <Plus className="w-4 h-4 mr-2"/>
                    Create from schema.org
                </Button>
            </div>
        </nav>);
}

const AddFieldModal = ({show, onClose, onAddField}) => {
    if (!show) {
        return null;
    }

    const [formState, setFormState] = useState({name: '', type: 'https://schema.org/Text', required: false});

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormState(prev => ({
            ...prev, [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.name || !formState.type) {
            console.error("Please fill out all required fields.");
            return;
        }
        const newField = {
            id: nanoid(), ...formState,
        };
        onAddField(newField);
        onClose();
    };

    const fieldTypes = ['https://schema.org/Text', 'https://schema.org/URL', 'https://schema.org/Number', 'https://schema.org/Boolean', 'https://schema.org/Date', 'https://schema.org/Time', 'select' // Special case for our app's UI
    ];

    return (<div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Field</h3>
                    <button onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-300"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Field Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="type"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Field Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formState.type}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {fieldTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="required"
                            name="required"
                            checked={formState.required}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="required"
                               className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Required Field
                        </label>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <Button onClick={onClose} type="button"
                                className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                            Add Field
                        </Button>
                    </div>
                </form>
            </div>
        </div>);

}

const EditFieldModal = ({show, onClose, field, onUpdateField}) => {

    if (!show || !field) {
        return null;
    }

    const [formState, setFormState] = useState({
        name: field.name, type: field.type, required: field.required,
    });

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormState(prev => ({
            ...prev, [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.name || !formState.type) {
            console.error("Please fill out all required fields.");
            return;
        }
        onUpdateField(field.id, formState);
        onClose();
    };

    const fieldTypes = ['https://schema.org/Text', 'https://schema.org/URL', 'https://schema.org/Number', 'https://schema.org/Boolean', 'https://schema.org/Date', 'https://schema.org/Time', 'select'];

    return (<div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Field: {field.name}</h3>
                    <button onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-300"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Field Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="type"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Field Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formState.type}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {fieldTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="required"
                            name="required"
                            checked={formState.required}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="required"
                               className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Required Field
                        </label>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <Button onClick={onClose} type="button"
                                className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>);

}

const AddCollectionTypeModal = ({show, onClose, onAddCollectionType}) => {

    if (!show) {
        return null;
    }

    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAddCollectionType(name.trim(), []);
            setName('');
            onClose();
        }
    };

    return (<div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Collection Type</h3>
                    <button onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-300"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="collectionName"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Collection Type Name
                        </label>
                        <input
                            type="text"
                            id="collectionName"
                            name="collectionName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <Button onClick={onClose} type="button"
                                className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </div>);

}

const CreateSchemaOrgCollectionModal = ({show, onClose, onAddSchemaOrgType}) => {

    if (!show) {
        return null;
    }

    const schemaUrls = Object.keys(SCHEMA_ORG_CONCEPTS);
    const [urlInput, setUrlInput] = useState('');
    const [selectedSchemaUrl, setSelectedSchemaUrl] = useState(schemaUrls[0]);
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [collectionName, setCollectionName] = useState(selectedSchemaUrl.split('/').pop());

    const selectedSchema = SCHEMA_ORG_CONCEPTS[selectedSchemaUrl];

    const handleSchemaSelect = (url) => {
        setSelectedSchemaUrl(url);
        setCollectionName(url.split('/').pop());
    };

    const handleToggleExpand = (url) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(url)) {
                newSet.delete(url);
            } else {
                newSet.add(url);
            }
            return newSet;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (collectionName.trim() && selectedSchema) {
            onAddSchemaOrgType(collectionName.trim(), selectedSchema.fields);
            onClose();
        }
    };

    const renderSchemaTree = (urls, parentUrl = null) => {
        return urls.map(url => {
            const schemaData = SCHEMA_ORG_CONCEPTS[url];
            if (!schemaData) return null;

            const isExpanded = expandedNodes.has(url);
            const hasSubclasses = schemaData.subclasses && schemaData.subclasses.length > 0;
            const schemaName = url.split('/').pop();

            return (<React.Fragment key={url}>
                    <li>
                        <div className="flex items-center">
                            {hasSubclasses ? (<button
                                    type="button"
                                    onClick={() => handleToggleExpand(url)}
                                    className={`transition-transform transform ${isExpanded ? 'rotate-90' : ''}`}
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-500"/>
                                </button>) : (<span className="w-4 h-4 inline-block"></span>)}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSchemaSelect(url);
                                }}
                                className={`block flex-1 p-2 rounded-md transition-colors ${selectedSchemaUrl === url ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                {schemaName}
                            </a>
                        </div>
                    </li>
                    {hasSubclasses && isExpanded && (<ul className="ml-4 list-none">
                            {renderSchemaTree(schemaData.subclasses, url)}
                        </ul>)}
                </React.Fragment>);
        });
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            const cleanUrl = urlInput.trim();
            if (SCHEMA_ORG_CONCEPTS[cleanUrl]) {
                setSelectedSchemaUrl(cleanUrl);
                setCollectionName(cleanUrl.split('/').pop());
            }
        }, 500); // Debounce to prevent rapid updates
        return () => clearTimeout(timer);
    }, [urlInput]);

    return (<div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create from schema.org</h3>
                    <button onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-300"/>
                    </button>
                </div>
                <div className="mb-4">
                    <label htmlFor="urlInput"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Enter a schema.org URL
                    </label>
                    <input
                        type="text"
                        id="urlInput"
                        name="urlInput"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., https://schema.org/Product"
                    />
                </div>
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Pane: Schema Tree */}
                    <div
                        className="flex-shrink-0 w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {renderSchemaTree(schemaUrls.filter(url => !Object.values(SCHEMA_ORG_CONCEPTS).some(s => s.subclasses && s.subclasses.includes(url))))}
                        </ul>
                    </div>
                    {/* Right Pane: Schema Details & Naming */}
                    <div className="flex-1 pl-4 overflow-y-auto">
                        {selectedSchema ? (<form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto">
                                    <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{selectedSchemaUrl.split('/').pop()}</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{selectedSchema.description}</p>
                                    <a href={selectedSchemaUrl} target="_blank" rel="noopener noreferrer"
                                       className="inline-flex items-center text-blue-500 hover:underline mb-4">
                                        View on schema.org
                                        <ExternalLink className="w-3 h-3 ml-1"/>
                                    </a>
                                    <h5 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">Properties:</h5>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                        {selectedSchema.fields.map(field => (
                                            <li key={field.id}>{field.name}: {field.type.split('/').pop()}</li>))}
                                    </ul>
                                </div>
                                {/* Naming Section */}
                                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <label htmlFor="newCollectionName"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Collection Type Name
                                    </label>
                                    <input
                                        type="text"
                                        id="newCollectionName"
                                        name="newCollectionName"
                                        value={collectionName}
                                        onChange={(e) => setCollectionName(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <Button onClick={onClose} type="button"
                                                className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            Cancel
                                        </Button>
                                        <Button type="submit"
                                                className="bg-green-600 text-white hover:bg-green-700">
                                            Create
                                        </Button>
                                    </div>
                                </div>
                            </form>) : (<div className="flex h-full items-center justify-center">
                                <p className="text-sm text-gray-500">Schema not found or not selected.</p>
                            </div>)}
                    </div>
                </div>
            </div>
        </div>);

}

const ElevateFieldModal = ({show, onClose, onElevate, schemaOrgUrl}) => {

    if (!show || !schemaOrgUrl) {
        return null;
    }

    const defaultName = schemaOrgUrl.split('/').pop();
    const [name, setName] = useState(defaultName);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onElevate(name.trim(), schemaOrgUrl);
            setName(defaultName); // Reset name for next time
            onClose();
        }
    };

    return (<div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Elevate to New Collection
                        Type</h3>
                    <button onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-300"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        A new collection type will be created from the concept: <code
                        className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded-sm">{schemaOrgUrl}</code>.
                    </p>
                    <div>
                        <label htmlFor="newCollectionName"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Collection Type Name
                        </label>
                        <input
                            type="text"
                            id="newCollectionName"
                            name="newCollectionName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <Button onClick={onClose} type="button"
                                className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                            Elevate
                        </Button>
                    </div>
                </form>
            </div>
        </div>);

}


const CollectionStructure = ({
                                 selectedContentType,
                                 schema,
                                 onAddField,
                                 onEditFieldRequest,
                                 onDeleteField,
                                 onElevateFieldRequest
                             }) => {

    const currentSchema = schema[selectedContentType] || [];

    const isSchemaOrgType = (type) => type.startsWith('https://schema.org/');
    const isPrimitiveType = (type) => PRIMITIVE_SCHEMA_TYPES.includes(type);

    return (<main className="flex-1 p-4 sm:p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Header Section */}
            <div className="py-4">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold">{selectedContentType}</h1>
                    <Button onClick={() => onAddField({id: nanoid()})}
                            className="bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2"/>
                        Add new field
                    </Button>
                </div>
                <p className="text-sm text-gray-500">Schema for {selectedContentType}</p>
            </div>

            {/* Schema Table Section */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-2/5">Name</TableHead>
                            <TableHead className="w-1/5">Type</TableHead>
                            <TableHead className="w-1/5">Required</TableHead>
                            <TableHead className="w-1/5 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentSchema.length > 0 ? (currentSchema.map((field) => (<TableRow key={field.id}>
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                        {field.name}
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-300">
                                        {isSchemaOrgType(field.type) ? (
                                            <a href={field.type} target="_blank" rel="noopener noreferrer"
                                               className="text-blue-500 hover:underline flex items-center">
                                                {field.type.split('/').pop()}
                                                <ExternalLink className="w-3 h-3 ml-1"/>
                                            </a>) : (field.type)}
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-300">
                                        {field.required ? 'Yes' : 'No'}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button onClick={() => onEditFieldRequest(field)}
                                                className="className=bg-transparent">
                                            <Pencil/>
                                        </Button>
                                        {isSchemaOrgType(field.type) && !isPrimitiveType(field.type) ? (<Button
                                                onClick={() => onElevateFieldRequest(field.type)}
                                                className="text-green-500 hover:text-green-600 dark:text-green-300 dark:hover:text-green-500"
                                            >
                                                <Plus/>
                                            </Button>) : null}
                                        <Button onClick={() => onDeleteField(field.id)}
                                                className="className=bg-transparent">
                                            <Trash/>
                                        </Button>
                                    </TableCell>
                                </TableRow>))) : (<TableRow>
                                <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                                    No fields defined. Add a new field to get started.
                                </TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        </main>);
}

const SchemaEditor = () => {
    const [selectedContentType, setSelectedContentType] = useState('Article');
    const [schema, setSchema] = useState(INITIAL_SCHEMA);
    const [showAddFieldModal, setShowAddFieldModal] = useState(false);
    const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
    const [showAddSchemaOrgModal, setShowAddSchemaOrgModal] = useState(false);
    const [showElevateFieldModal, setShowElevateFieldModal] = useState(false);
    const [elevateFieldUrl, setElevateFieldUrl] = useState('');
    const [showEditFieldModal, setShowEditFieldModal] = useState(false);
    const [editingField, setEditingField] = useState(null);

    // General function to add a collection type, used by multiple creation methods
    const handleAddCollectionType = (newTypeName, initialSchema = []) => {
        // Check if the collection type already exists
        if (!schema[newTypeName]) {
            setSchema(prevSchema => ({
                ...prevSchema, [newTypeName]: initialSchema,
            }));
        }
        setSelectedContentType(newTypeName);
    };

    const handleAddField = (newField) => {
        setSchema(prevSchema => {
            const updatedList = [...prevSchema[selectedContentType], newField];
            return {
                ...prevSchema, [selectedContentType]: updatedList,
            };
        });
        setShowAddFieldModal(false);
    };

    const handleEditFieldRequest = (field) => {
        setEditingField(field);
        setShowEditFieldModal(true);
    };

    const handleUpdateField = (fieldId, updatedField) => {
        setSchema(prevSchema => {
            const updatedList = prevSchema[selectedContentType].map(field => field.id === fieldId ? {...field, ...updatedField} : field);
            return {
                ...prevSchema, [selectedContentType]: updatedList,
            };
        });
        setShowEditFieldModal(false);
        setEditingField(null);
    };

    const handleDeleteField = (fieldId) => {
        setSchema(prevSchema => {
            const updatedList = prevSchema[selectedContentType].filter(field => field.id !== fieldId);
            return {
                ...prevSchema, [selectedContentType]: updatedList,
            };
        });
    };

    // Handles adding a new collection type from a schema.org concept
    const handleAddSchemaOrgType = (newTypeName, initialSchema) => {
        handleAddCollectionType(newTypeName, initialSchema);
    };

    // Triggers the modal to get a name for the new elevated collection type
    const handleElevateFieldRequest = (schemaOrgUrl) => {
        setElevateFieldUrl(schemaOrgUrl);
        setShowElevateFieldModal(true);
    };

    // Handles the "elevation" of a non-primitive field to a new collection type
    const handleElevateField = (newTypeName, schemaOrgUrl) => {
        const initialSchema = SCHEMA_ORG_CONCEPTS[schemaOrgUrl].fields || [];
        handleAddCollectionType(newTypeName, initialSchema);
    };

    return (<div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            <CollectionsSidebar
                selectedContentType={selectedContentType}
                onSelectContentType={setSelectedContentType}
                onOpenAddCollectionModal={() => setShowAddCollectionModal(true)}
                onOpenAddSchemaOrgModal={() => setShowAddSchemaOrgModal(true)}
                schema={schema} // Pass the entire schema to the sidebar
            />
            <CollectionStructure
                selectedContentType={selectedContentType}
                schema={schema}
                onAddField={() => setShowAddFieldModal(true)}
                onEditFieldRequest={handleEditFieldRequest}
                onDeleteField={handleDeleteField}
                onElevateFieldRequest={handleElevateFieldRequest}
            />
            <AddFieldModal
                show={showAddFieldModal}
                onClose={() => setShowAddFieldModal(false)}
                onAddField={handleAddField}
            />
            <EditFieldModal
                show={showEditFieldModal}
                onClose={() => setShowEditFieldModal(false)}
                field={editingField}
                onUpdateField={handleUpdateField}
            />
            <AddCollectionTypeModal
                show={showAddCollectionModal}
                onClose={() => setShowAddCollectionModal(false)}
                onAddCollectionType={handleAddCollectionType}
            />
            <CreateSchemaOrgCollectionModal
                show={showAddSchemaOrgModal}
                onClose={() => setShowAddSchemaOrgModal(false)}
                onAddSchemaOrgType={handleAddSchemaOrgType}
            />
            <ElevateFieldModal
                show={showElevateFieldModal}
                onClose={() => setShowElevateFieldModal(false)}
                onElevate={handleElevateField}
                schemaOrgUrl={elevateFieldUrl}
            />
        </div>);
};

export default SchemaEditor;
