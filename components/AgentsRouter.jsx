// components/SettingsRouter.jsx
'use client';

import React from 'react';
import { useTab } from '../app/context/TabContext';
import AgentsPanel from './AgentsPanel';
import AddAgentForm from "./agents/AddAgentForm";
import AgentsPage from "./agents/AgentsPage";

export default function AgentsRouter() {
    const { activeTab } = useTab();

    switch (activeTab) {
        case 'agents/page':
            return <AgentsPage />;
        case 'agents/add':
            return <AddAgentForm />;
        default:
            return <AgentsPanel />;
    }
}