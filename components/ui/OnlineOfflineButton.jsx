import React from 'react';
import Button from '../ui/Button';

// A reusable component for the online/offline action button
export default function OnlineOfflineButton({ isOnline, onClick }) {
    // Determine the button's appearance based on the `isOnline` boolean
    const buttonText = isOnline ? 'Go Offline' : 'Go Online';
    const buttonColor = isOnline ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700';

    return (
        <button
            // Use 'abstract' variant for a minimal, unstyled button

            onClick={onClick}
            className={`transition-colors ${buttonColor}`}
        >
            {isOnline ? (
                // Render the complete SVG for 'Go Offline'
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0" />
                </svg>
            ) : (
                // Render the complete SVG for 'Go Online'
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0" />
                </svg>
            )}
        </button>
    );
}
