// /components/schema-builder/SchemaView.tsx

import * as React from 'react';
import {Database, Pencil, Plus, Trash} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {Field, getFieldTypeIcon} from '../types';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ViewProps} from "@/components/schema-builder/tabs/view_props";


export const SchemaView: React.FC<ViewProps> = ({
                                                          selectedContentType,
                                                          fields,
                                                          onOpenAddModal,
                                                          onOpenEditModal,
                                                          onDeleteField,
                                                      }) => {
    if (!selectedContentType) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">Select a collection</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Choose a collection from the sidebar to view its schema.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>{selectedContentType}</CardTitle>
                        <CardDescription>
                            Define the fields for the {selectedContentType} collection type.
                        </CardDescription>
                    </div>
                    <Button onClick={onOpenAddModal}>
                        <Plus className="w-4 h-4 mr-2" /> Add Field
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Field Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Required</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field) => (
                            <TableRow key={field.id}>
                                <TableCell className="font-medium">{field.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        {getFieldTypeIcon(field.type)}
                                        <Badge variant="secondary">{field.type.split('/').pop()}</Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {field.required ? (
                                        <Badge variant="default">Required</Badge>
                                    ) : (
                                        <Badge variant="outline">Optional</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => onOpenEditModal(field)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit Field</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => onDeleteField(field.id)}>
                                                <Trash className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete Field</TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {fields.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>This collection has no fields yet.</p>
                        <Button variant="link" onClick={onOpenAddModal}>Add the first field</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};