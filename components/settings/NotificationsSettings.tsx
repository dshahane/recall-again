import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function NotificationsSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Configure your email and in-app notification preferences.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="email-notif" className="text-sm">
                            Email Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Receive email alerts for important updates.
                        </p>
                    </div>
                    <Switch id="email-notif" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="app-notif" className="text-sm">
                            In-App Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Get pop-up notifications inside the application.
                        </p>
                    </div>
                    <Switch id="app-notif" />
                </div>
            </CardContent>
        </Card>
    );
}
