import { useState } from 'react';
import Card from '../ui/Card';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AddAgentForm({ onCancel, setActiveTab }) {
    const [knowledgeSources, setKnowledgeSources] = useState([]);

    return (
        <Card title="Add New Agent" description="Create a new agent with a specific persona and knowledge.">
            <form className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input id="agent-name" type="text" placeholder="e.g., Sales Expert" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="agent-persona">Persona</Label>
                    <Input id="agent-persona" type="text" placeholder="e.g., Enthusiastic, knowledgeable" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="agent-description">Description</Label>
                    <textarea id="agent-description" rows="4" className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Briefly describe the agent's purpose."></textarea>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Knowledge Sources</Label>
                        <Button type="button" onClick={() => setActiveTab('add-knowledge')} className="px-3 py-1.5 text-xs">
                            Add Knowledge
                        </Button>
                    </div>
                    <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4">
                        {knowledgeSources.length > 0 ? (
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Source Name</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* Mock rows */}
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">Company Docs</td>
                                    <td className="px-6 py-4">URL</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-center text-gray-400">No knowledge sources added yet.</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Create Agent</Button>
                </div>
            </form>
        </Card>
    );
}