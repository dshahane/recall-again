import { Card } from '@/components//ui/card';
import { Button } from '@/components//ui/button';

const integrations = [
    {
        name: 'Slack Integration',
        description: 'Connect to your Slack workspace to receive alerts and manage agents directly.',
        imageUrl: 'https://placehold.co/60x60/4A154B/FFFFFF?text=SL',
        status: 'Disconnected'
    },
    {
        name: 'GitHub',
        description: 'Connect to your GitHub repositories for code-related tasks.',
        imageUrl: 'https://placehold.co/60x60/181717/FFFFFF?text=GH',
        status: 'Connected'
    }
];

export default function IntegrationsSettings() {
    return (
        <Card title="Integrations" description="Connect to third-party services to enhance your experience.">
            <div className="space-y-4 mt-4">
                {integrations.map((integration, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src={integration.imageUrl} alt={integration.name} className="h-10 w-10 rounded-full" />
                            <div className="flex flex-col">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{integration.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{integration.description}</p>
                            </div>
                        </div>
                        <Button variant={integration.status === 'Connected' ? 'success' : 'outline'} className="px-4 py-1.5 text-xs font-semibold rounded-full">
                            {integration.status === 'Connected' ? 'Connected' : 'Connect'}
                        </Button>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab('settings')}>Back</Button>
            </div>
        </Card>
    );
}