import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    Package,
    TrendingUp,
    Banknote,
    Scale,
    Star,
    SearchCheck,
    Rocket,
    Award,
    Dumbbell,
    Palette,
    FileText,
    Heart,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- Mock Data and Utilities to make the code self-contained ---

/**
 * A mock custom hook that simulates fetching and managing data from an API.
 * It provides a simple in-memory CRUD (Create, Read, Update, Delete)
 * implementation to make the component runnable.
 * @param resourceName The name of the resource (e.g., 'agents').
 */
const useResource = (resourceName) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate an API call with a delay
        const fetchData = async () => {
            try {
                // Mock initial data with specialized agent properties for sellers,
                // now including usage and accuracy metrics with time-based data for charts.
                const mockData = [
                    {
                        id: 'agent-1',
                        name: 'Inventory Manager',
                        developer: 'DataFlow Solutions',
                        description: 'Tracks real-time inventory levels and predicts stock needs.',
                        icon: 'Package',
                        specialty: ['Inventory', 'Logistics'],
                        usage: {
                            label: 'Daily Active Users',
                            data: [{ day: 'Mon', value: 1200 }, { day: 'Tue', value: 1350 }, { day: 'Wed', value: 1280 }, { day: 'Thu', value: 1400 }, { day: 'Fri', value: 1450 }]
                        },
                        accuracy: { value: 98, label: '98% Prediction Accuracy' }
                    },
                    {
                        id: 'agent-2',
                        name: 'Market Competitor',
                        developer: 'Insight Engines Inc.',
                        description: 'Analyzes competitor pricing, strategies, and market share.',
                        icon: 'TrendingUp',
                        specialty: ['Competitors', 'Market Analysis'],
                        usage: {
                            label: 'Weekly Usage',
                            data: [{ week: 'Wk1', value: 500 }, { week: 'Wk2', value: 520 }, { week: 'Wk3', value: 510 }, { week: 'Wk4', value: 550 }, { week: 'Wk5', value: 540 }]
                        },
                        accuracy: { value: 95, label: '95% Data Freshness' }
                    },
                    {
                        id: 'agent-3',
                        name: 'Cash Flow Forecaster',
                        developer: 'FinTech Dynamics',
                        description: 'Predicts future cash flow and identifies financial risks.',
                        icon: 'Banknote',
                        specialty: ['Cash Flow', 'Finance'],
                        usage: {
                            label: 'Monthly Projections',
                            data: [{ month: 'Jan', value: 10000 }, { month: 'Feb', value: 10500 }, { month: 'Mar', value: 10200 }, { month: 'Apr', value: 11000 }]
                        },
                        accuracy: { value: 99, label: '99% Forecast Reliability' }
                    },
                    {
                        id: 'agent-4',
                        name: 'Tariff Impact Analyst',
                        developer: 'Global Trade Insights',
                        description: 'Calculates the impact of new tariffs on your product costs and pricing.',
                        icon: 'Scale',
                        specialty: ['Tariffs', 'Compliance'],
                        usage: {
                            label: 'Quarterly Reports',
                            data: [{ q: 'Q1', value: 800 }, { q: 'Q2', value: 820 }, { q: 'Q3', value: 790 }, { q: 'Q4', value: 850 }]
                        },
                        accuracy: { value: 97, label: '97% Calculation Accuracy' }
                    },
                    {
                        id: 'agent-5',
                        name: 'Customer Review Monitor',
                        developer: 'Feedback First',
                        description: 'Monitors and summarizes customer reviews from multiple platforms.',
                        icon: 'Star',
                        specialty: ['Reviews', 'Customer Service'],
                        usage: {
                            label: 'Weekly Mentions',
                            data: [{ day: 'Mon', value: 2500 }, { day: 'Tue', value: 2600 }, { day: 'Wed', value: 2450 }, { day: 'Thu', value: 2700 }, { day: 'Fri', value: 2650 }]
                        },
                        accuracy: { value: 96, label: '96% Sentiment Analysis' }
                    },
                    {
                        id: 'agent-6',
                        name: 'Top Query Tracker',
                        developer: 'Search Metrics Co.',
                        description: 'Identifies the most searched keywords and phrases for your products.',
                        icon: 'SearchCheck',
                        specialty: ['Queries', 'SEO'],
                        usage: {
                            label: 'Hourly Queries',
                            data: [{ hour: '9am', value: 1000000 }, { hour: '10am', value: 1100000 }, { hour: '11am', value: 950000 }, { hour: '12pm', value: 1200000 }]
                        },
                        accuracy: { value: 94, label: '94% Keyword Relevance' }
                    },
                    {
                        id: 'agent-7',
                        name: 'Campaign Optimizer',
                        developer: 'AdBoost AI',
                        description: 'Automates and optimizes ad campaigns for maximum ROI.',
                        icon: 'Rocket',
                        specialty: ['Campaigns', 'Marketing'],
                        usage: {
                            label: 'Daily Campaigns',
                            data: [{ day: 'Mon', value: 100 }, { day: 'Tue', value: 105 }, { day: 'Wed', value: 98 }, { day: 'Thu', value: 110 }]
                        },
                        accuracy: { value: 98, label: '98% ROI Prediction' }
                    },
                    {
                        id: 'agent-8',
                        name: 'Rank Tracking Agent',
                        developer: 'Position Pro',
                        description: 'Keeps an eye on your product rankings across various e-commerce sites.',
                        icon: 'Award',
                        specialty: ['Rank Tracking', 'SEO'],
                        usage: {
                            label: 'Real-time Updates',
                            data: [{ time: '1pm', value: 500 }, { time: '2pm', value: 510 }, { time: '3pm', value: 505 }]
                        },
                        accuracy: { value: 99, label: '99% Ranking Accuracy' }
                    },
                ];
                await new Promise(resolve => setTimeout(resolve, 1000));
                setData(mockData);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [resourceName]);

    return { data, isLoading, error };
};

/** A mapping of icon names to their corresponding Lucide-React components. */
const iconMap = {
    Package,
    TrendingUp,
    Banknote,
    Scale,
    Star,
    SearchCheck,
    Rocket,
    Award,
    Dumbbell,
    Palette,
    FileText,
    Heart,
};

/**
 * Renders a single "Agent Card" for the grid layout.
 * @param agent The agent object to display.
 */
const AgentCard = ({ agent }) => {
    // Determine accuracy text color based on a threshold
    const getAccuracyColor = (value) => {
        if (value >= 95) return 'text-green-500';
        if (value >= 90) return 'text-yellow-500';
        return 'text-red-500';
    };

    const AgentIcon = iconMap[agent.icon] || Dumbbell;

    return (
        <Card className="flex flex-col p-4 transition-colors hover:bg-muted/50">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 relative">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-xl">
                        <AgentIcon className="h-6 w-6" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{agent.developer}</p>
                </div>
                <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{agent.description}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-4">
                {agent.specialty.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="px-2 py-0.5">{specialty}</Badge>
                ))}
            </div>
            <TooltipProvider>
                <div className="mt-4 flex flex-col space-y-3 text-sm">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300 w-16">Usage</span>
                                <div className="w-full h-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={agent.usage.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id={`colorUsage-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill={`url(#colorUsage-${agent.id})`} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>{agent.usage.label}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300 w-16">Accuracy</span>
                                <span className={`font-bold text-lg ${getAccuracyColor(agent.accuracy.value)}`}>
                                    {`${agent.accuracy.value}%`}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>{agent.accuracy.label}</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </Card>
    );
};

/**
 * A simple card with a plus button to create a new item.
 */
const CreateNewCard = () => (
    <Card className="flex flex-col items-center justify-center p-4 h-full text-center transition-colors hover:bg-muted/50 cursor-pointer border-dashed border-2">
        <Button variant="ghost" className="h-20 w-20 rounded-full text-gray-500 dark:text-gray-400">
            <Plus className="h-12 w-12" />
        </Button>
        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Create New Agent
        </p>
    </Card>
);

// --- Main App Component ---

/**
 * Main application component styled as a Shadcn UI dashboard, now
 * focused on a product marketplace with a simple grid layout.
 */
export default function AgentCatalog() {
    const { data: agents, isLoading, error } = useResource('agents');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.specialty.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center p-4">
                <p className="text-center text-gray-500 dark:text-gray-400">Loading Agents...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-screen items-center justify-center p-4">
                <p className="text-center text-red-500">Failed to load agents. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <ScrollArea className="flex-1 p-6">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b dark:border-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Agent Catalog</h1>
                        <p className="text-sm text-muted-foreground mt-1">Discover and manage specialized AI agents for your business.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search agents..."
                                className="pl-9 w-full sm:w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button className="w-full sm:w-auto hidden sm:flex">
                            <Plus className="h-4 w-4 mr-2" />
                            New Agent
                        </Button>
                    </div>
                </header>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">All Agents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <CreateNewCard />
                        {filteredAgents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
