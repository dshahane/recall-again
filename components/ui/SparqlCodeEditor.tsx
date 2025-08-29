'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@//lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import MonacoEditor from 'react-monaco-editor';
import { Label } from 'recharts';
import {Separator} from "@radix-ui/react-menu";

// This is a self-contained mock for the Monaco Editor
const MonacoEditor2: React.FC<{ value: string; onChange: (value: string) => void; language: string; }> = ({ value, onChange, language }) => {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs/loader.js';
        script.onload = () => {
            (window as any).require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs' } });
            (window as any).require(['vs/editor/editor.main'], () => {
                monacoRef.current = (window as any).monaco;
                setIsLoaded(true);
            });
        };
        document.body.appendChild(script);
        return () => {
            // Cleanup the script tag on unmount
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (isLoaded && containerRef.current && monacoRef.current && !editorRef.current) {
            editorRef.current = monacoRef.current.editor.create(containerRef.current, {
                value,
                language,
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                lineNumbers: 'on',
            });
            editorRef.current.onDidChangeModelContent(() => {
                onChange(editorRef.current.getValue());
            });
        }
    }, [isLoaded, value, onChange, language]);

    return <div ref={containerRef} className="w-full h-[300px]" />;
};


export default function SparqlCodeEditor() {
    // State for the query, results, loading, and error
    const [query, setQuery] = useState(`PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?label ?abstract ?wikiPageID
WHERE {
  dbr:New_York_City rdfs:label ?label ;
                   dbo:abstract ?abstract ;
                   dbo:wikiPageID ?wikiPageID .
  FILTER (lang(?label) = "en") .
  FILTER (lang(?abstract) = "en") .
}
LIMIT 1`);

    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const endpoint = 'https://dbpedia.org/sparql';
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const openModal = (title: string, content: string) => {
        setModalTitle(title);
        setModalContent(content);
        setModalOpen(true);
    };

    // Handler for running the query
    const handleQuery = async () => {
        setLoading(true);
        setError(null);
        setResults(null);
        try {
            const res = await fetch(`${endpoint}?query=${encodeURIComponent(query)}&format=json`, {
                headers: {
                    'Accept': 'application/sparql-results+json',
                },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP error! Status: ${res.status}, Response: ${text}`);
            }
            const data = await res.json();
            setResults(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Renders the results table using Shadcn Table components
    const renderResultsTable = () => {
        if (!results?.results?.bindings?.length) {
            return (
                <div className="flex justify-center items-center py-10">
                    <p className="text-sm text-muted-foreground">
                        {results?.results?.bindings ? 'No results found.' : 'Your query results will appear here.'}
                    </p>
                </div>
            );
        }
        const bindings = results.results.bindings;
        const variables = results.head.vars;
        return (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full">
                <div className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-sm font-semibold text-primary">
                                        Query Results - Displaying {bindings.length} result(s)
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    {variables.map((v: string) => (
                                        <TableHead key={v} className="text-sm font-semibold text-primary">
                                            {v}
                                        </TableHead>
                                    ))}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bindings.map((row: any, i: number) => (
                                    <TableRow key={i}>
                                        {variables.map((v: string) => (
                                            <TableCell key={v} className="text-sm text-muted-foreground">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {row[v]?.value ?? '-'}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{row[v]?.value}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {row[v]?.datatype && <Badge variant="secondary" className="ml-2">{row[v]?.datatype.split('#').pop()}</Badge>}
                                                {row[v]?.lang && <Badge variant="outline" className="ml-2">{row[v]?.lang}</Badge>}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => openModal('Row Details', JSON.stringify(row, null, 2))}>
                                                Expand
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <TooltipProvider>
            <div className="flex w-full flex-col p-8">
                <div className="text-muted-foreground text-lg">
                    <h2 >Enter your query here.</h2>
                    <Separator className="my-4 text-sm font-semibold text-primary" />
                </div>
                <div className="w-full bg-black text-green-400 font-mono text-sm overflow-hidden border border-gray-700">
                    <MonacoEditor
                        width="800"
                        height="600"
                        language="sql"
                        theme="vs-dark"
                        value={query}
                        options={{
                            selectOnLineNumbers: true
                        }}
                        onChange={setQuery}
                    />
                    {/*<MonacoEditor value={query} onChange={setQuery} language="sparql" />*/}
                </div>

                {/* Actions and Status */}
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            {loading && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Running query...</span>
                                </div>
                            )}
                            {error && (
                                <div className="p-2 text-sm text-red-500 rounded-md">
                                    Error: {error}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" onClick={() => setQuery('')}>
                                        <RotateCcw className="h-4 w-4 mr-2" /> Clear
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Clear the editor</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={handleQuery} disabled={loading}>
                                        <Play className="h-4 w-4 mr-2" /> Run Query
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Execute the query</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="mt-4">
                        {renderResultsTable()}
                    </div>
                </div>
            </div>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{modalTitle}</DialogTitle>
                        <DialogDescription>
                            Full content of the selected row.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <pre className="text-sm whitespace-pre-wrap">{modalContent}</pre>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setModalOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
