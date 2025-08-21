import AgentsPage from './knowledge/KnowledgeDashboard';
import {useTab} from "@/app/context/TabContext";

export default function AgentsPanel() {
    const { activeTab } = useTab();
    switch (activeTab) {
        case 'knowledge':
            return <KnowledgeDashboard />;
        default:
            return <KnowledgeDashboard />;
    }
}
