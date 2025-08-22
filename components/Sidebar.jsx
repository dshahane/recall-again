'use client';

import React from 'react';
import { useTab } from '@/app/context/TabContext';
import SidebarButton from './ui/SidebarButton';
import IconButton from './ui/IconButton';

// SVG Icons as constants
const trlIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
);

const moonIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 0 0 9 9 9 9 0 0 1-9 9A9 9 0 0 1 3 12a9 9 0 0 0 9-9z" />
    </svg>
);

const sunIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
);

const collapseIconLeft = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6-6-6" />
    </svg>
);

const collapseIconRight = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

const mainTabs = [
    {
        name: 'knowledge',
        label: 'Knowledge',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17a2 2 0 0 0 2-2.5v-2a2 2 0 0 0-2-2.5h-1a2 2 0 0 1-2-2.5V7a2 2 0 0 1 2-2.5h1a2 2 0 0 0 2-2.5M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/>
            </svg>
        ),
    },
    {
        name: 'agents',
        label: 'Agents',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zM8 21v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1zM17.68 18a6 6 0 0 0 2.22-3.66M6.1 18a6 6 0 0 1-2.22-3.66" />
            </svg>
        ),
    },
    {
        name: 'chat',
        label: 'Chat',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
];

const settingsTab = {
    name: 'settings',
    label: 'Settings',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.39a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.74v.44a2 2 0 0 1-1 1.74l-.15.07a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2-1.74h.44a2 2 0 0 0 2 2v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.44a2 2 0 0 1 1-1.74l.15-.07a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 1.74v-.44a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
        </svg>
    ),
};

export default function Sidebar({ isCollapsed, setIsCollapsed, theme, toggleTheme }) {
    const { activeTab, setActiveTab } = useTab();

    const toggleCollapse = () => setIsCollapsed(prev => !prev);

    return (
        <div className={`bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex-shrink-0 flex flex-col h-screen ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Top Section */}
            <div className="flex items-center justify-between p-4 flex-shrink-0">
                {!isCollapsed && (
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        {trlIcon}
                        <span className="ml-2">TRL</span>
                    </h2>
                )}
                <div className="flex items-center space-x-2">
                    {/* Theme Button */}
                    <IconButton onClick={toggleTheme}>
                        {theme === 'dark' ? moonIcon : sunIcon}
                    </IconButton>
                    {/* Collapse Button */}
                    <IconButton onClick={toggleCollapse}>
                        {isCollapsed ? collapseIconRight : collapseIconLeft}
                    </IconButton>
                </div>
            </div>

            {/* Main Navigation (Scrollable) */}
            <div className="flex flex-col flex-grow p-4 space-y-2 overflow-y-auto">
                {mainTabs.map((tab) => (
                    <SidebarButton
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        active={activeTab.startsWith(tab.name)}
                        isCollapsed={isCollapsed}
                    >
                        {tab.icon}
                        {!isCollapsed && <span className="ml-4">{tab.label}</span>}
                    </SidebarButton>
                ))}
            </div>

            {/* Settings at the bottom (Fixed) */}
            <div className="p-4 flex flex-col space-y-2 flex-shrink-0">
                <SidebarButton
                    onClick={() => setActiveTab(settingsTab.name)}
                    active={activeTab.startsWith(settingsTab.name)}
                    isCollapsed={isCollapsed}
                >
                    {settingsTab.icon}
                    {!isCollapsed && <span className="ml-4">{settingsTab.label}</span>}
                </SidebarButton>
            </div>
        </div>
    );
}