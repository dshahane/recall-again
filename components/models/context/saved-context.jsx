'use client'

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const SavedContexts = ({ savedContexts, onEditContext, onDeleteContext, isConfirmOpen, setIsConfirmOpen, contextToDelete, confirmDelete }) => {
    return (
        <Card className="mt-4">
            <CardContent className="pt-4">
                <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                    <div className="grid gap-4">
                        {savedContexts.map(ctx => (
                            <Card key={ctx.id} className="relative p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                <CardHeader className="p-0 mb-2">
                                    <CardTitle className="text-xl">{ctx.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary">{ctx.type}</Badge>
                                        <Badge variant="outline">{ctx.scope}</Badge>
                                        {ctx.isActive && (
                                            <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-grow">
                                            <span className="text-sm text-gray-500">
                                                Tags: {ctx.tags.length > 0 ? ctx.tags.join(', ') : 'None'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditContext(ctx.id);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteContext(ctx.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {savedContexts.length === 0 && (
                            <div className="text-center text-gray-500 p-8">
                                No contexts saved yet. Create one to get started!
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected context.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

export default SavedContexts;
