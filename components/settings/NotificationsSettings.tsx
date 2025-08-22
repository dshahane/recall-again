import { Card } from '@/components//ui/card';
import { Label } from '@/components//ui/label';
import { Button } from '@/components//ui/button';
import Switch from '@/components//ui/Switch';
import { Separator } from '@/components//ui/separator';

export default function NotificationsSettings() {
    return (
        <Card
            title="Notifications"
            description="Configure your email and in-app notification preferences."
        >
            <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="email-notif" className="text-sm">Email Notifications</Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive email alerts for important updates.</p>
                    </div>
                    <Switch id="email-notif" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="app-notif" className="text-sm">In-App Notifications</Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get pop-up notifications inside the application.</p>
                    </div>
                    <Switch id="app-notif" />
                </div>
                <div className="flex justify-end">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('settings')}>Back</Button>
                </div>
            </div>
        </Card>
    );
}