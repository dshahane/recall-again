import * as React from 'react';
import {ViewProps} from "@/components/schema-builder/tabs/view_props";
import SparqlCodeEditor2 from "@/components/ui/SparqlCodeEditor2";


export const ConceptQueryView: React.FC<ViewProps> = ({
                                                       selectedContentType,
                                                       fields,
                                                       onOpenAddModal,
                                                       onOpenEditModal,
                                                       onDeleteField,
                                                   }) => {
    return (
        /*
            <Card>
                <CardHeader>
                    <CardTitle>SPARQL Query</CardTitle>
                    <CardDescription>
                        Run a SPARQL Query
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground p-8">
                        <SparqlCodeEditor/>
                    </div>
                </CardContent>
            </Card>
        */
        <SparqlCodeEditor2/>
    );
};