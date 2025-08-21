// app/page.jsx
'use client';

import { useTab } from './context/TabContext';
import ChatPanel from '../components/ChatPanel';
import SettingsRouter from '../components/SettingsRouter';
import AgentsRouter from "@/components/AgentsRouter";
import KnowledgeRouter from "@/components/KnowledgeRouter";

export default function Page() {
    // @ts-ignore
    const { activeTab } = useTab();

    if (activeTab.startsWith('settings/')) {
        return <SettingsRouter />;
    }
    else if (activeTab.startsWith('agents/')) {
        return <AgentsRouter />;
    }

    switch (activeTab) {
        case 'knowledge':
            return <KnowledgeRouter/>;
        case 'agents':
            return <AgentsRouter />;
        case 'chat':
            return <ChatPanel />;
        case 'settings':
            return <SettingsRouter />;
        default:
            return <AgentsRouter />;
    }
}