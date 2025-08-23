'use client';
import {ScrollArea} from "../ui/scroll-area";

export const ModelActions = () => {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <ScrollArea className="flex-1 p-6">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b dark:border-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Model Actions</h1>
                        <p className="text-sm text-muted-foreground mt-1">Workflow that define actions which are manifested in skills..</p>
                    </div>
                </header>
            </ScrollArea>
        </div>
    );
}