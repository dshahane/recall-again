'use client';
import React from 'react';
import {ViewProps} from "@/components/schema-builder/tabs/view_props";
import {Database} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {SchemaView} from "@/components/schema-builder/tabs/SchemaView";
import {RelatesToView} from "@/components/schema-builder/tabs/RelatesToView";
import {ConceptQueryView} from "@/components/schema-builder/tabs/ConceptQueryView";

export const TabbedView: React.FC<ViewProps> = (props) => {
    if (!props.selectedContentType) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <Database className="mx-auto h-12 w-12 text-muted-foreground"/>
                    <h3 className="mt-2 text-sm font-medium text-foreground">Select a collection</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Choose a collection from the sidebar to view its schema.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <Tabs defaultValue="schema" className="w-full h-full flex flex-col">
            <TabsList className="mb-4 self-start">
                <TabsTrigger value="schema">Schema View</TabsTrigger>
                <TabsTrigger value="relates">Relates To</TabsTrigger>
                <TabsTrigger value="sparql">SparQL</TabsTrigger>
            </TabsList>
            <TabsContent value="schema" className="flex-1 overflow-auto">
                <SchemaView {...props} />
            </TabsContent>
            <TabsContent value="relates" className="flex-1 overflow-auto">
                <RelatesToView {...props}/>
            </TabsContent>
            <TabsContent value="sparql" className="flex-1 overflow-auto">
                <ConceptQueryView {...props}/>
            </TabsContent>
        </Tabs>
    );
};