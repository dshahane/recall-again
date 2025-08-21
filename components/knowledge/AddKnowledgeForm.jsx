import { useState } from 'react';
import Card from '../ui/Card';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AddKnowledgeForm({ setActiveTab }) {
    const knowledgeTypes = [
        { value: 'rdf', label: 'RDF' },
        { value: 'json', label: 'JSON' },
        { value: 'tabular', label: 'Tabular' },
    ];

    const [knowledgeType, setKnowledgeType] = useState('rdf');

    return (
        <Card title="Add Knowledge Source" description="Configure a new knowledge source for your agents.">
            <form className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="source-name">Source Name</Label>
                    <Input id="source-name" type="text" placeholder="e.g., Company Wiki" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="source-description">Description</Label>
                    <textarea id="source-description" rows="3" className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Briefly describe the knowledge source."></textarea>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="source-type">Source Type</Label>
                    <div className="flex space-x-4">
                        {knowledgeTypes.map((type) => (
                            <div key={type.value} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={type.value}
                                    name="knowledgeType"
                                    value={type.value}
                                    checked={knowledgeType === type.value}
                                    onChange={(e) => setKnowledgeType(e.target.value)}
                                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <label htmlFor={type.value} className="text-sm font-medium text-gray-700 dark:text-gray-300">{type.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('knowledge')}>Cancel</Button>
                    <Button type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5L12 19" /><path d="M5 12L19 12" />
                        </svg>
                        <span className="ml-2">Create Source</span>
                    </Button>
                </div>
            </form>
        </Card>
    );
}