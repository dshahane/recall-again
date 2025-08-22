import React from 'react';
import Button from '../ui/button';
import EditCellButton from "@/components/ui/EditCellButton";
import DeleteCellButton from "@/components/ui/DeleteCellButton";
import OnlineOfflineButton from "@/components/ui/OnlineOfflineButton";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const getStatus = (status) => {
    if (status === 'online') {
        return { text: 'Online', color: 'text-green-500' };
    } else {
        return { text: 'Offline', color: 'text-gray-400' };
    }
};

export default function AgentCard({ agent, onEdit, onDelete, onCancelDelete, showConfirmModal }) {
    const cardStatus = getStatus(agent.status);
    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="flex-shrink-0 mr-4">
                <img
                    src={agent.imageUrl}
                    alt={agent.title}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
            </div>
            <div className="flex-grow">
                <h3 className="text-base font-semibold text-gray-800">{agent.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
                {agent.status && (
                    <div className={`flex items-center text-xs mt-2 font-medium ${cardStatus.color}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="12"/>
                        </svg>
                        <span>{cardStatus.text}</span>
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                <OnlineOfflineButton onClick={() => {}} isOnline={agent.status === 'online'} />
                <EditCellButton onClick={() => onEdit(agent)} />
                <DeleteCellButton onClick={() => onDelete(agent.id)} />
            </div>
            {/* Conditionally render the ConfirmationModal */}
            {showConfirmModal && (
                <ConfirmationModal
                    message="Are you sure you want to delete this agent? This action cannot be undone."
                    onConfirm={onDelete}
                    onCancel={onCancelDelete}
                />
            )}
        </div>
    );
}