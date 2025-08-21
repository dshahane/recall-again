'use client';

import React from 'react';
import { useTab } from '@/app/context/TabContext';
import KnowledgeDashboard from "./knowledge/KnowledgeDashboard";

export default function KnowledgeRouter() {
    const { activeTab } = useTab();

    switch (activeTab) {
        // The AgentsPage now manages all agent-related views (list, add, and edit).
        case 'knowledge/page':
            return <KnowledgeDashboard />;
        default:
            return <KnowledgeDashboard />;
    }
}