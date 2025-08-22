import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import Label from '../ui/Label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useTab } from "@/app/context/TabContext";

// The unified AgentForm component handles both add and edit modes
export default function AgentForm({ agent, onCancel, onCreate, onSave, setActiveTab }) {
    // Initialize state with agent data if it exists, otherwise use empty strings
    const [agentName, setAgentName] = useState(agent?.name || '');
    const [agentPersona, setAgentPersona] = useState(agent?.persona || '');
    const [agentDescription, setAgentDescription] = useState(agent?.description || '');
    const [isLoading, setIsLoading] = useState(false);
    const [knowledgeSources, setKnowledgeSources] = useState([]);

    // This hook ensures the form updates if the user selects a different agent to edit
    // without the component unmounting and re-mounting.
    useEffect(() => {
        //setAgentName(agent?.name || '');
        if (agent?.name) {
            console.log("Setting agent name", agent?.name);
            setAgentName(agent.name);
        }
        setAgentDescription(agent?.description || '');
        setAgentPersona(agent?.persona || '');
    }, [agent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const agentData = {
            name: agentName,
            description: agentDescription,
            persona: agentPersona,
            // These fields are required by FastAPI but are hardcoded for now
            status: agent?.status || 'online',
            imageUrl: agent?.imageUrl || 'https://placehold.co/60x60/34D399/FFFFFF?text=NA',
        };

        try {
            if (agent) {
                // If an agent exists, call the onSave (update) function
                await onSave(agent.id, agentData);
            } else {
                // Otherwise, call the onCreate (create) function
                await onCreate(agentData);
            }
            onCancel(); // Close the form on success
        } catch (err) {
            console.error('Failed to submit agent:', err);
            setIsLoading(false);
        }
    };


    const formTitle = agent ? `Editing ${agent.name}` : "Add New Agent";
    const buttonText = agent ? 'Save Changes' : 'Create Agent';

    return (
        <Card title={formTitle} description="Manage the agent's persona and details.">
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                        id="agent-name"
                        type="text"
                        placeholder="e.g., Sales Expert"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="agent-persona">Persona</Label>
                    <Input
                        id="agent-persona"
                        type="text"
                        placeholder="e.g., Enthusiastic, knowledgeable"
                        value={agentPersona}
                        onChange={(e) => setAgentPersona(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="agent-description">Description</Label>
                    <textarea
                        id="agent-description"
                        rows="4"
                        className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Briefly describe the agent's purpose."
                        value={agentDescription}
                        onChange={(e) => setAgentDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Knowledge Sources</Label>
                        <Button type="button" onClick={() => setActiveTab('settings/knowledge')}>
                            Knowledge
                        </Button>
                    </div>
                    <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4">
                        {knowledgeSources.length > 0 ? (
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                {/* ... table content from your original code */}
                            </table>
                        ) : (
                            <p className="text-sm text-center text-gray-400">No knowledge sources added yet.</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : buttonText}
                    </Button>
                </div>
            </form>
        </Card>
    );
}