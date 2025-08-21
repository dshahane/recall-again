// components/SettingsRouter.jsx
'use client';

import React from 'react';
import { useTab } from '@/app/context/TabContext';
import SettingsPanel from './SettingsPanel';
import ProfileSettings from './settings/ProfileSettings'; // You'll need to create these
import SecuritySettings from './settings/SecuritySettings';
import NotificationsSettings from './settings/NotificationsSettings';
import KnowledgeDashboard from './knowledge/KnowledgeDashboard';
import IntegrationsSettings from './settings/IntegrationsSettings';
import IngestionSettings from "@/components/settings/IngestionSettings";
import Workbench from "@/components/settings/ingestion/Workbench";

export default function SettingsRouter() {
    const { activeTab } = useTab();

    switch (activeTab) {
        case 'settings/profile':
            return <ProfileSettings />;
        case 'settings/security':
            return <SecuritySettings />;
        case 'settings/notifications':
            return <NotificationsSettings />;
        case 'settings/knowledge':
            return <KnowledgeDashboard />;
        case 'settings/integrations':
            return <IntegrationsSettings />;
        case 'settings/ingestion':
            return <IngestionSettings />;
        case 'settings/metadata':
            return <Workbench />;
        default:
            return <SettingsPanel />; // Fallback to the main settings cards
    }
}