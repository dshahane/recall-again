import Card from '../ui/Card';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Switch from '../ui/Switch';
import Separator from '../ui/Separator';

export default function SecuritySettings({ setActiveTab }) {
    return (
        <Card
            title="Security"
            description="Manage your account security settings."
        >
            <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Enable 2FA for an extra layer of security.</span>
                    </div>
                    <Switch id="two-factor" />
                </div>
                <Separator />
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-1">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">Change Password</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Update your password regularly to keep your account secure.</span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Current Password</Label>
                        <Input id="password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => setActiveTab('settings')}>Back</Button>
                        <Button className="w-fit">Change Password</Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}