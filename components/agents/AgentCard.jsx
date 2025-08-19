import React from 'react';

const getStatus = (status) => {
    if (status === 'online') {
        return { text: 'Online', color: 'text-green-500' };
    } else {
        return { text: 'Offline', color: 'text-gray-400' };
    }
};

export default function AgentCard({ title, description, imageUrl, status }) {
    const cardStatus = getStatus(status);
    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="flex-shrink-0 mr-4">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
            </div>
            <div className="flex-grow">
                <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
                {status && (
                    <div className={`flex items-center text-xs mt-2 font-medium ${cardStatus.color}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="12"/>
                        </svg>
                        <span>{cardStatus.text}</span>
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                {status === 'online' ? (
                    <button className="text-red-500 hover:text-red-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                            <line x1="12" y1="2" x2="12" y2="12" />
                        </svg>
                    </button>
                ) : (
                    <button className="text-green-500 hover:text-green-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                            <line x1="12" y1="2" x2="12" y2="12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}