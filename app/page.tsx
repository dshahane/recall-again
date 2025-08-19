// app/page.jsx
'use client';

import { useTab } from './context/TabContext';
import ChatPanel from '../components/ChatPanel';
import SettingsRouter from '../components/SettingsRouter';
import AgentsRouter from "@/components/AgentsRouter";

export default function Page() {
    // @ts-ignore
    const { activeTab } = useTab();

    if (activeTab.startsWith('settings/')) {
        return <SettingsRouter />;
    }

    switch (activeTab) {
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