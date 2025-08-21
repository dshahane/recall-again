import React from 'react';
import Button from './Button'; // Assuming you have a reusable Button component

/**
 * A reusable modal component for user confirmations.
 * @param {object} props - The component's props.
 * @param {string} props.message - The confirmation message to display.
 * @param {function} props.onConfirm - The function to call when the user confirms.
 * @param {function} props.onCancel - The function to call when the user cancels.
 */
export default function ConfirmationModal({ message, onConfirm, onCancel }) {
    // A simple overlay with a semi-transparent background
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
                {/* Modal content */}
                <p className="text-gray-700 text-lg text-center mb-6">{message}</p>

                {/* Buttons for user actions */}
                <div className="flex justify-end space-x-4">
                    <Button onClick={onCancel} variant="secondary">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="danger">
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
}
