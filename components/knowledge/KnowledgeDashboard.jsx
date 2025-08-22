'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EditCellButton from '@/components/ui/EditCellButton';
import DeleteCellButton from '@/components/ui/DeleteCellButton';
import SparqlCodeEditor from '@/components/ui/SparqlCodeEditor';

const kpis = [
    { title: 'Total Facts', value: '12,456', description: 'Number of unique facts indexed.' },
    { title: 'Usage Rate', value: '89%', description: 'Percentage of queries that use knowledge.' },
    { title: 'Avg. Freshness', value: '3 days', description: 'Average age of the knowledge data.' },
];

const knowledgeSources = [
    { name: 'Internal Wiki', type: 'RDF', status: 'Active' },
    { name: 'Marketing PDFs', type: 'JSON', status: 'Active' },
    { name: 'Support Forum', type: 'Tabular', status: 'Active' },
];

export default function KnowledgeDashboard() {
    return (
        <Card className="space-y-6">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <CardTitle>Knowledge Dashboard</CardTitle>
                    <CardDescription>Monitor and query your connected knowledge sources.</CardDescription>
                </div>
                <Button onClick={() => setActiveTab?.('add-knowledge')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5L12 19" />
                        <path d="M5 12L19 12" />
                    </svg>
                    <span className="ml-2">Add Knowledge</span>
                </Button>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {kpis.map((kpi, index) => (
                    <Card key={index} className="p-4 bg-muted rounded-lg border border-muted/50">
                        <h4 className="text-sm font-medium text-muted-foreground">{kpi.title}</h4>
                        <p className="text-3xl font-bold text-foreground mt-2">{kpi.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                    </Card>
                ))}
            </CardContent>

            <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Connected Sources</h3>
                <div className="rounded-lg border border-muted p-4">
                    <table className="w-full text-sm text-left text-muted-foreground">
                        <thead className="text-xs uppercase bg-muted text-muted-foreground">
                        <tr>
                            <th className="p-4">Source Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Status</th>
                            <th className="p-4"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {knowledgeSources.map((source, index) => (
                            <tr key={index} className="bg-background border-b border-muted">
                                <td className="p-4">{source.name}</td>
                                <td className="p-4">{source.type}</td>
                                <td className="p-4 text-green-500">{source.status}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center space-x-2">
                                        <EditCellButton onClick={() => {}} />
                                        <DeleteCellButton onClick={() => {}} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>

            <CardContent className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-foreground">SPARQL Query Interface</h3>

                    {/* Editor area */}
                    <div className="p-4 text-green-400">
                        <SparqlCodeEditor
                            className="w-full min-h-[240px] bg-transparent text-green-400 outline-none border-0 focus:ring-0"
                            placeholder={`PREFIX trl: <http://example.org/trl#>
SELECT ?fact ?value
WHERE {
  ?fact a trl:Metric ;
        trl:value ?value .
}`}
                        />
                    </div>

            </CardContent>


            <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={() => setActiveTab?.('settings')}>Back</Button>
            </CardFooter>
        </Card>
    );
}
