'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

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
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const endpoint = 'https://dbpedia.org/sparql';

    const MonacoEditor = ({ value, onChange, language }) => {
        const editorRef = useRef(null);
        const monacoRef = useRef(null);
        const containerRef = useRef(null);
        const [isLoaded, setIsLoaded] = useState(false);

        useEffect(() => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs/loader.js';
            script.onload = () => {
                window.require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs' } });
                window.require(['vs/editor/editor.main'], () => {
                    monacoRef.current = window.monaco;
                    setIsLoaded(true);
                });
            };
            document.body.appendChild(script);
            return () => document.body.removeChild(script);
        }, []);

        useEffect(() => {
            if (isLoaded && containerRef.current && monacoRef.current && !editorRef.current) {
                editorRef.current = monacoRef.current.editor.create(containerRef.current, {
                    value,
                    language,
                    theme: 'vs-light',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: 'Fira Code, monospace',
                });
                editorRef.current.onDidChangeModelContent(() => onChange(editorRef.current.getValue()));
            }
        }, [isLoaded, value, onChange, language]);

        return <div ref={containerRef} className="w-full h-96 bg-black text-green-400 rounded-b-lg" />;
    };

    const handleQuery = async () => {
        setLoading(true);
        setError(null);
        setResults(null);
        try {
            const res = await fetch(`${endpoint}?query=${encodeURIComponent(query)}&format=json`, {
                headers: { Accept: 'application/sparql-results+json' },
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderResultsTable = () => {
        if (!results?.results?.bindings?.length) {
            return <div className="text-center text-muted-foreground">No results found.</div>;
        }
        const bindings = results.results.bindings;
        const variables = results.head.vars;
        return (
            <div className="overflow-x-auto rounded-lg shadow-sm border border-muted">
                <table className="w-full text-left table-auto">
                    <thead className="bg-muted text-muted-foreground">
                    <tr>
                        {variables.map((v) => (
                            <th key={v} className="px-4 py-3 font-semibold text-sm">
                                {v}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {bindings.map((row, i) => (
                        <tr key={i} className="border-b border-muted hover:bg-muted/20">
                            {variables.map((v) => (
                                <td key={v} className="px-4 py-3 text-sm text-muted-foreground">
                                    {row[v]?.value ?? '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Terminal-style editor area */}
            <div className="w-full rounded-lg border border-muted bg-black font-mono text-sm overflow-hidden">
                {/* Fake terminal header */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-zinc-900 border-b border-zinc-800">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>

                {/* Monaco Editor */}
                <MonacoEditor value={query} onChange={setQuery} language="sparql" />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setQuery('')}>
                    Clear
                </Button>
                <Button onClick={handleQuery} disabled={loading}>
                    {loading ? 'Running Query...' : 'Run Query'}
                </Button>
            </div>

            {/* Results */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            {loading && <div className="flex justify-center py-10 animate-pulse text-blue-600">Loading...</div>}
            {!loading && !error && renderResultsTable()}
        </div>
    );
}
