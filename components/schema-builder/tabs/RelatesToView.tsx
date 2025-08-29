import * as React from 'react';
import {Database, Pencil, Plus, Trash} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {Field, getFieldTypeIcon} from '../types';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ViewProps} from "@/components/schema-builder/tabs/view_props";


export const RelatesToView: React.FC<ViewProps> = ({
                                                    selectedContentType,
                                                    fields,
                                                    onOpenAddModal,
                                                    onOpenEditModal,
                                                    onDeleteField,
                                                }) => {
    return (
            <Card>
                <CardHeader>
                    <CardTitle>Relates To</CardTitle>
                    <CardDescription>
                        Visualize relationships between collections.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground p-8">
                        <p>This tab will show how the current collection relates to others in your schema.</p>
                        <p>Functionality for this section is not yet implemented.</p>
                    </div>
                </CardContent>
            </Card>
    );
};