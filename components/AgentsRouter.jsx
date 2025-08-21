'use client';

import React from 'react';
import { useTab } from '../app/context/TabContext';
import AgentsPanel from './AgentsPanel';
import AgentsPage from "./agents/AgentsPage";

export default function AgentsRouter() {
    const { activeTab } = useTab();

    switch (activeTab) {
        // The AgentsPage now manages all agent-related views (list, add, and edit).
        case 'agents/page':
            return <AgentsPage />;
        default:
            return <AgentsPanel />;
    }
}