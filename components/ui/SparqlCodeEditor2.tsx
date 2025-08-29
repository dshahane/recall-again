'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
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

// This is a self-contained Monaco Editor component that loads scripts directly
const MonacoEditor = ({ value, onChange, language }: { value: string; onChange: (value: string) => void; language: string; }) => {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // This is the function that registers the SPARQL language service
    const defineSparqlLanguage = (monaco: any) => {
        // Register the language
        monaco.languages.register({ id: 'sparql' });

        // Register a tokens provider for the language (syntax highlighting)
        monaco.languages.setMonarchTokensProvider('sparql', {
            defaultToken: 'invalid',
            keywords: [
                'SELECT', 'WHERE', 'FILTER', 'PREFIX', 'LIMIT', 'OFFSET', 'ORDER', 'BY',
                'ASC', 'DESC', 'GRAPH', 'CONSTRUCT', 'ASK', 'DESCRIBE', 'UNION', 'OPTIONAL',
                'FROM', 'NAMED', 'AS', 'SERVICE', 'BIND', 'GROUP', 'HAVING', 'COUNT', 'SUM',
                'MIN', 'MAX', 'AVG', 'SAMPLE', 'GROUP_CONCAT', 'STRAFTER', 'STRBEFORE',
                'STRSTARTS', 'STRENDS', 'CONTAINS', 'REGEX', 'LANG', 'DATATYPE', 'ISLITERAL',
                'ISURI', 'ISBLANK', 'BOUND'
            ],
            typeKeywords: [
                'rdf', 'rdfs', 'owl', 'xsd'
            ],
            operators: ['!', '&&', '||', '<', '>', '<=', '>=', '=', '!=', '+', '-', '*', '/'],
            escapes: /\\(?:[tbnrf\\'"()&]|x[0-9A-Fa-f]{1,2}|u[0-9A-Fa-f]{4})/,
            tokenizer: {
                root: [
                    // Identifiers and keywords
                    [/[a-zA-Z_$][\w$]*/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@typeKeywords': 'typeKeyword',
                            '@default': 'identifier'
                        }
                    }],
                    // URIs
                    [/<[^>]*>/, 'string.uri'],
                    // Prefixed names
                    [/[\w]+\:[\w]+/, 'string.prefixed'],
                    // Variables
                    [/\?[\w$]+/, 'variable'],
                    [/\$[\w$]+/, 'variable'],
                    // Whitespace
                    [/\s+/, 'white'],
                    // Numbers
                    [/(\d*\.)?\d+([eE][+-]?\d+)?/, 'number'],
                    // Strings
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/"/, { token: 'string.quote', bracket: '@open', next: '@string_double' }],
                    [/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],
                    // Operators
                    [/[+\-*/=<>!&|]/, 'operator'],
                    // Brackets and punctuation
                    [/[{}()\[\]]/, '@brackets'],
                    // Comments
                    [/#.*$/, 'comment'],
                ],
                string_double: [
                    [/[^"\\]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ],
                string_single: [
                    [/[^'\\]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ]
            }
        });

        // Register a completion item provider for the language
        monaco.languages.registerCompletionItemProvider('sparql', {
            provideCompletionItems: (model: any, position: any) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                const suggestions = [
                    {
                        label: 'SELECT',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'SELECT',
                        range: range,
                        detail: 'Selects variables from a query'
                    },
                    {
                        label: 'WHERE',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'WHERE {\n\t\n}',
                        range: range,
                        detail: 'Defines the query pattern',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: 'PREFIX',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'PREFIX ${1:pfx}: <${2:http://example.com/}>',
                        range: range,
                        detail: 'Defines a prefix for URIs',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: 'FILTER',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'FILTER (${1:condition})',
                        range: range,
                        detail: 'Filters query results',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: 'LIMIT',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'LIMIT ${1:10}',
                        range: range,
                        detail: 'Limits the number of results',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: 'dbo:',
                        kind: monaco.languages.CompletionItemKind.Reference,
                        insertText: 'dbo:',
                        range: range,
                        detail: 'DBpedia Ontology'
                    },
                    {
                        label: 'dbr:',
                        kind: monaco.languages.CompletionItemKind.Reference,
                        insertText: 'dbr:',
                        range: range,
                        detail: 'DBpedia Resource'
                    },
                ];
                return { suggestions: suggestions };
            }
        });
    };

    // Load the Monaco Editor script from a CDN
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs/loader.js';
        script.onload = () => {
            (window as any).require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs' } });
            (window as any).require(['vs/editor/editor.main'], () => {
                monacoRef.current = (window as any).monaco;
                defineSparqlLanguage(monacoRef.current);
                setIsLoaded(true);
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Create the editor instance after the script is loaded
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

    return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
};


export default function SparqlCodeEditor() {
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
                    <h2 className="text-2xl font-bold tracking-tight">Enter your query here.</h2>
                </div>
                <div className="w-full bg-black text-green-400 font-mono text-sm overflow-hidden border border-gray-700">
                    <MonacoEditor
                        value={query}
                        onChange={setQuery}
                        language="sparql"
                    />
                </div>

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
