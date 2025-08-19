// components/SettingsPanel.jsx
'use client';

import React from 'react';
import Card from './ui/Card';
import { useTab } from '../app/context/TabContext';

const settings = [
    { name: 'profile', title: 'Profile', description: 'Manage your public profile and account details.', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        )},
    { name: 'security', title: 'Security', description: 'Change your password and enable 2FA.', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        )},
    { name: 'notifications', title: 'Notifications', description: 'Configure how you receive alerts.', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        )},
    { name: 'knowledge', title: 'Knowledge', description: 'Manage your connected knowledge sources and run queries.', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10H16a2 2 0 0 1 2 2v3.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 4 15.5V12a2 2 0 0 1 2-2h1.5"/><path d="M14 10V6a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v4"/><path d="M8 8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/></svg>
        )},
    { name: 'integrations', title: 'Integrations', description: 'Connect to third-party services to enhance your experience.', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a4 4 0 0 0 4-4v-3h-10v3a4 4 0 0 0 4 4z" /><path d="M9 11v-4a3 3 0 0 1 6 0v4" /></svg>
        )},
];

export default function SettingsPanel() {
    const { setActiveTab } = useTab();

    return (
        <Card title="Settings" description="Manage your application settings.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {settings.map((setting) => (
                    <div
                        key={setting.name}
                        // Change active tab to a nested path
                        onClick={() => setActiveTab(`settings/${setting.name}`)}
                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex flex-col space-y-2"
                    >
                        <div className="text-gray-500 dark:text-gray-400 mb-2">{setting.icon}</div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{setting.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}