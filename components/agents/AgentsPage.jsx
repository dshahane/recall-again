import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import AddAgentForm from './AddAgentForm';
import AgentCard from './AgentCard';

const agentData = [
    {
        id: 1,
        name: 'Sales Agent',
        description: 'Specialized in lead generation and customer outreach. Optimizes sales funnels.',
        status: 'online',
        imageUrl: 'https://placehold.co/60x60/34D399/FFFFFF?text=SA',
    },
    {
        id: 2,
        name: 'Support Bot',
        description: 'Provides 24/7 customer support and handles common queries. Reduces ticket load.',
        status: 'online',
        imageUrl: 'https://placehold.co/60x60/60A5FA/FFFFFF?text=SB',
    },
    {
        id: 3,
        name: 'Marketing Bot',
        description: 'Creates and schedules social media posts, analyzes engagement metrics.',
        status: 'offline',
        imageUrl: 'https://placehold.co/60x60/FCD34D/FFFFFF?text=MB',
    },
    {
        id: 4,
        name: 'Data Scraper',
        description: 'Collects and processes data from various web sources for market analysis.',
        status: 'online',
        imageUrl: 'https://placehold.co/60x60/F87171/FFFFFF?text=DS',
    },
];

export default function AgentsPage({ setActiveTab }) {
    const [isAddingAgent, setIsAddingAgent] = useState(false);

    if (isAddingAgent) {
        return <AddAgentForm onCancel={() => setIsAddingAgent(false)} setActiveTab={setActiveTab} />;
    }

    return (
        <Card title="Agents" description="Manage your AI and human agents.">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsAddingAgent(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5L12 19" /><path d="M5 12L19 12" />
                    </svg>
                    <span className="ml-2">Add Agent</span>
                </Button>
            </div>
            <div className="space-y-4">
                {agentData.map((agent) => (
                    <AgentCard
                        key={agent.id}
                        title={agent.name}
                        description={agent.description}
                        imageUrl={agent.imageUrl}
                        status={agent.status}
                    />
                ))}
            </div>
        </Card>
    );
}