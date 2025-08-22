import AgentsPage from './agents/AgentsPage';
import {useTab} from "@/app/context/TabContext";

export default function AgentsPanel() {
    return <AgentsPage />;
//     const { activeTab } = useTab();
//     switch (activeTab) {
//         case 'agents':
//             return <AgentsPage />;
//         default:
//             return <AgentsPage />;
//     }
 }
