import React from 'react';

const mainTabs = [
    { name: 'agents', label: 'Agents', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zM8 21v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1zM17.68 18a6 6 0 0 0 2.22-3.66M6.1 18a6 6 0 0 1-2.22-3.66" />
            </svg>
        )},
    { name: 'settings', label: 'Settings', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.39a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.74v.44a2 2 0 0 1-1 1.74l-.15.07a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2-1.74h.44a2 2 0 0 0 2 2v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.44a2 2 0 0 1 1-1.74l.15-.07a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 1.74v-.44a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
            </svg>
        )},
];

export default function Navigation({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <nav className="flex space-x-2 mt-4 sm:mt-0">
            {mainTabs.map((tab) => (
                <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    // Use isCollapsed to apply different classes
                    className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors ${
                        activeTab.startsWith(tab.name)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
                    } ${isCollapsed ? 'w-12 h-12 justify-center' : ''}`}
                >
                    {tab.icon}
                    {/* Only show the label if the sidebar is not collapsed */}
                    {!isCollapsed && <span className="ml-2">{tab.label}</span>}
                </button>
            ))}
            {/* Add a button to toggle the sidebar state */}
            <button
                onClick={toggleCollapse}
                className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors text-gray-600 bg-gray-200 hover:bg-gray-300 ${isCollapsed ? 'w-12 h-12 justify-center' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {isCollapsed ? (
                        <path d="M15 18l-6-6 6-6" /> // Chevron pointing right
                    ) : (
                        <path d="M9 18l6-6-6-6" /> // Chevron pointing left
                    )}
                </svg>
                {!isCollapsed && <span className="ml-2">Collapse</span>}
            </button>
        </nav>
    );
}