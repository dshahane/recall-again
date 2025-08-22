import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import AgentForm from './AgentForm'; // Import the unified form
import AgentCard from './AgentCard';
import useResource from '../../hooks/useResource';
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function AgentsPage() {
    const [agentToEdit, setAgentToEdit] = useState(null);
    const [isAddingAgent, setIsAddingAgent] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [resourceToDeleteId, setResourceToDeleteId] = useState(null);

    const { data: agents, isLoading, error, createResource, updateResource, deleteResource }
        = useResource('agents');

    // These handlers manage the state for rendering the form
    const handleAdd = () => {
        setIsAddingAgent(true);
        setAgentToEdit(null);
    };

    const handleEdit = (agent) => {
        setIsAddingAgent(false);
        setAgentToEdit(agent);
    };

    const handleCancel = () => {
        setIsAddingAgent(false);
        setAgentToEdit(null);
    };

    const handleDeleteClick = (id) => {
        setResourceToDeleteId(id);
        setShowConfirmModal(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setResourceToDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        if (resourceToDeleteId) {
            try {
                await deleteResource(resourceToDeleteId);
                console.log('Resource deleted successfully.');
            } catch (err) {
                console.error('Failed to delete resource:', err);
            }
        }
        // Close the modal and reset the state
        setShowConfirmModal(false);
        setResourceToDeleteId(null);
    };

    // --- Conditional Rendering ---
    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Loading agents...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Failed to fetch agents. Please try again.</div>;
    }

    // Render the form if we are in 'add' mode (agentToEdit is null)
    // or 'edit' mode (agentToEdit is an object)
    if (isAddingAgent || agentToEdit) {
        return (
            <AgentForm
                agent={agentToEdit} // This will be null for 'add' mode
                onCancel={handleCancel}
                onCreate={createResource}
                onSave={updateResource}
            />
        );
    }

    // Default view: list of agents
    return (
        <Card title="Agents" description="Manage your AI and human agents.">
            <div className="flex justify-end mb-4">
                <Button onClick={handleAdd}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5L12 19" /><path d="M5 12L19 12" />
                    </svg>
                    <span className="ml-2">Add Agent</span>
                </Button>
            </div>
            <div className="space-y-4">
                {agents.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No agents found. Add a new agent to get started.</div>
                ) : (
                    agents.map((agent) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            onEdit={handleEdit}
                            showConfirmModal={showConfirmModal}
                            onDelete={handleConfirmDelete}
                            onCancelDelete={handleCancelDelete}
                        />
                    ))
                )}
            </div>
        </Card>
    );
}