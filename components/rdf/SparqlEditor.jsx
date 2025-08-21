import React, { useState } from 'react';
import Button from "@/components/ui/Button";

// The main application component
export default function App() {
    const [query, setQuery] = useState(
        `PREFIX dbo: <http://dbpedia.org/ontology/>
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
LIMIT 1`
    );
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // The public SPARQL endpoint to query
    const endpoint = 'https://dbpedia.org/sparql';

    // Function to handle the SPARQL query submission
    const handleQuery = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        const encodedQuery = encodeURIComponent(query);
        const url = `${endpoint}?query=${encodedQuery}&format=json`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/sparql-results+json'
                }
            });

            if (!response.ok) {
                // If the server returns a non-OK response, throw an error with the status
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error("Failed to fetch SPARQL results:", err);
            setError(`Failed to fetch results: ${err.message}. Please check your query or network connection.`);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to render the results table
    const renderResultsTable = () => {
        if (!results || !results.results || results.results.bindings.length === 0) {
            return <div className="text-center text-gray-500">No results found.</div>;
        }

        const bindings = results.results.bindings;
        const variables = results.head.vars;

        return (
            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {variables.map(variable => (
                            <th key={variable} className="px-4 py-3 font-semibold text-sm">
                                {variable}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {bindings.map((binding, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
                            {variables.map(variable => (
                                <td key={`${rowIndex}-${variable}`} className="px-4 py-3 text-sm text-gray-800">
                                    {binding[variable] ? (
                                        <div className="line-clamp-2">
                                            {binding[variable].value}
                                        </div>
                                    ) : (
                                        '-'
                                    )}
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
        <div className="font-sans antialiased  text-gray-200 bg-gray-800 p-6 min-h-screen flex flex-col items-center">
            {/* Main container styled like a dashboard card */}
            <div className="w-full max-w-4xl rounded-lg border border-gray-300 dark:border-gray-700 p-4">
                {/* Header with Run Query button, separated by a border */}
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
                    <label className="text-xl ">Enter your SPARQL query</label>
                    <Button
                        onClick={handleQuery}
                        disabled={loading}>
                        {loading ? 'Running Query...' : 'Run Query'}
                    </Button>
                </div>

                {/* Query Editor Section */}

                <textarea
                    id="sparql-query"
                    className="w-full h-48 p-4 text-sm font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="PREFIX..."
                />


                {/* Results Section */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4 text-left">Query Results</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm mb-4">
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    )}
                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                    {!loading && !error && renderResultsTable()}
                </div>
            </div>
        </div>
    );
}
