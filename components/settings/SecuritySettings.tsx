// ./components/settings/SecuritySettings.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SecuritySettings() {
    const form = useForm({
        defaultValues: {
            twoFactor: false,
            password: '',
            newPassword: '',
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="twoFactor"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <div className="flex flex-col space-y-1">
                                        <FormLabel>Two-Factor Authentication</FormLabel>
                                        <FormDescription>Enable 2FA for an extra layer of security.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Separator />
                        <div className="flex flex-col space-y-2">
                            <div className="flex flex-col space-y-1">
                                <h4 className="font-semibold">Change Password</h4>
                                <span className="text-sm text-muted-foreground">
                  Update your password regularly to keep your account secure.
                </span>
                            </div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {setActiveTab && (
                    <Button type="button" variant="outline" onClick={() => setActiveTab('settings')}>
                        Back
                    </Button>
                )}
                <Button type="submit">Change Password</Button>
            </CardFooter>
        </Card>
    );
}
