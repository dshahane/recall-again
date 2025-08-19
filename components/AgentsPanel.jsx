import AgentsPage from './agents/AgentsPage';
import SettingsPanel from './SettingsPanel';
import ProfileSettings from './settings/ProfileSettings';
import SecuritySettings from './settings/SecuritySettings';
import NotificationsSettings from './settings/NotificationsSettings';
import KnowledgeDashboard from './settings/KnowledgeDashboard';
import AddKnowledgeForm from './settings/AddKnowledgeForm';
import IntegrationsSettings from './settings/IntegrationsSettings';
import {useTab} from "@/app/context/TabContext";

export default function AgentsPanel() {
    const { activeTab } = useTab();
    switch (activeTab) {
        case 'agents':
            return <AgentsPage />;
        case 'settings':
            return <SettingsPanel  />;
        case 'profile':
            return <ProfileSettings  />;
        case 'security':
            return <SecuritySettings  />;
        case 'notifications':
            return <NotificationsSettings  />;
        case 'knowledge':
            return <KnowledgeDashboard  />;
        case 'add-knowledge':
            return <AddKnowledgeForm  />;
        case 'integrations':
            return <IntegrationsSettings  />;
        default:
            return <AgentsPage />;
    }
}
