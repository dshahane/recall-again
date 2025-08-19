import Card from '../ui/Card';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function ProfileSettings({ setActiveTab }) {
    return (
        <Card
            title="Profile"
            description="This is how others will see you on the site. You can also manage your email settings."
        >
            <form className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('settings')}>Back</Button>
                    <Button type="submit">Update Profile</Button>
                </div>
            </form>
        </Card>
    );
}