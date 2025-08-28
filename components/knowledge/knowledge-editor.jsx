import React, { useState, useEffect, useRef } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';

// For the purposes of this demo, we'll manually load the monaco-editor-react via CDN
// In a real project, you would install this via npm/yarn.
// This script is required for the Editor component to work.
const loadMonacoReactScript = () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@monaco-editor/react@4.7.0/dist/index.min.js';
    document.head.appendChild(script);
};

// We only need to load the script once.
loadMonacoReactScript();

const KnowledgeEditor = () => {
    // State to manage the active editor panel ('pyscript' or 'sparql')
    const [activeTab, setActiveTab] = useState('pyscript');

    // State to hold the content of each editor
    const [pyscriptCode, setPyscriptCode] = useState(`# Welcome to the PyScript editor!
# This is a sample Python script.
def hello_world():
    print("Hello, World!")
    
hello_world()`);
    const [sparqlCode, setSparqlCode] = useState(`# Welcome to the SPARQL editor!
# Use this editor to write SPARQL queries.
PREFIX ex: <http://example.org/ontology/>

SELECT ?resource ?name
WHERE {
  ?resource a ex:MyClass ;
            ex:name ?name .
}`);

    // Get the monaco instance using the useMonaco hook
    const monaco = useMonaco();
    const pyscriptEditorRef = useRef(null);
    const sparqlEditorRef = useRef(null);

    // This effect runs when the monaco object is ready and the component mounts.
    useEffect(() => {
        if (monaco) {
            // Define the custom SPARQL language for Monaco
            monaco.languages.register({ id: 'sparql' });
            monaco.languages.setMonarchTokensProvider('sparql', {
                keywords: [
                    'SELECT', 'CONSTRUCT', 'ASK', 'DESCRIBE', 'FROM', 'WHERE', 'OPTIONAL', 'UNION',
                    'FILTER', 'BIND', 'ORDER', 'BY', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'DISTINCT',
                    'REDUCED', 'AS', 'PREFIX'
                ],
                operators: [
                    '=', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '&&', '||', '!',
                ],
                tokenizer: {
                    root: [
                        [/[a-zA-Z_$][\w$]*/, {
                            cases: {
                                '@keywords': 'keyword',
                                '@default': 'identifier'
                            }
                        }],
                        [/@operators/, 'operator'],
                        [/@\w+/, 'metatag'],
                        [/\d+/, 'number'],
                        [/"[^"]*"/, 'string'],
                        [/'[^']*'/, 'string'],
                        [/\/\/.*/, 'comment'],
                    ]
                }
            });
        }
    }, [monaco]);

    // Function to handle tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Handler for PyScript editor changes
    const handlePyscriptChange = (value) => {
        setPyscriptCode(value);
    };

    // Handler for SPARQL editor changes
    const handleSparqlChange = (value) => {
        setSparqlCode(value);
    };

    // Handler for when the PyScript editor is mounted
    const handlePyscriptEditorDidMount = (editor) => {
        pyscriptEditorRef.current = editor;
    };

    // Handler for when the SPARQL editor is mounted
    const handleSparqlEditorDidMount = (editor) => {
        sparqlEditorRef.current = editor;
    };

    // Placeholder functions for button actions
    const runCode = () => {
        const code = pyscriptEditorRef.current?.getValue();
        console.log("Running PyScript code:", code);
        alert("Simulating PyScript code run. Check the console for the code.");
    };

    const runSparql = () => {
        const query = sparqlEditorRef.current?.getValue();
        console.log("Running SPARQL query:", query);
        alert("Simulating SPARQL query run. Check the console for the query.");
    };

    const save = () => alert("Simulating save action.");
    const load = () => alert("Simulating load action.");
    const debug = () => alert("Simulating debug action.");

    // JSX structure for the entire application
    return (
        <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">

            {/* Left Sidebar (Workspace) */}
            <div className="w-72 bg-white border-r border-gray-200 p-4 flex flex-col space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Workspace</h1>

                {/* Resource List Section */}
                <div className="flex-1 overflow-y-auto space-y-4">
                    <h2 className="text-lg font-medium text-gray-600">RDF Collections</h2>
                    <div className="bg-white rounded-md border border-gray-200 shadow-sm p-2">
                        <ul className="space-y-1 text-sm">
                            <li className="p-2 cursor-pointer rounded-md hover:bg-gray-100 transition-colors">collection-1.rdf</li>
                            <li className="p-2 cursor-pointer rounded-md hover:bg-gray-100 transition-colors">collection-2.rdf</li>
                        </ul>
                    </div>
                    <h2 className="text-lg font-medium text-gray-600 pt-2">Tools</h2>
                    <div className="bg-white rounded-md border border-gray-200 shadow-sm p-2">
                        <ul className="space-y-1 text-sm">
                            <li
                                id="pyscript-tool"
                                onClick={() => handleTabChange('pyscript')}
                                className={`p-2 cursor-pointer rounded-md transition-colors ${activeTab === 'pyscript' ? 'bg-indigo-50 font-medium text-indigo-700' : 'hover:bg-gray-100'}`}
                            >
                                pyscript editor
                            </li>
                            <li
                                id="sparql-tool"
                                onClick={() => handleTabChange('sparql')}
                                className={`p-2 cursor-pointer rounded-md transition-colors ${activeTab === 'sparql' ? 'bg-indigo-50 font-medium text-indigo-700' : 'hover:bg-gray-100'}`}
                            >
                                sparql editor
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between space-x-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">Add Resource</button>
                    <button className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm">Delete</button>
                </div>
            </div>

            {/* Right Main Editor Area */}
            <div className="flex-1 flex flex-col p-6 space-y-6">
                {/* Tabbed Interface for Editors */}
                <div className="flex space-x-2 border-b-2 border-gray-200">
                    <button
                        onClick={() => handleTabChange('pyscript')}
                        className={`py-2 px-4 rounded-t-lg font-medium text-sm transition-colors ${activeTab === 'pyscript' ? 'bg-white text-indigo-700 border-x border-t border-gray-200 -mb-[2px] shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                        pyscript editor
                    </button>
                    <button
                        onClick={() => handleTabChange('sparql')}
                        className={`py-2 px-4 rounded-t-lg font-medium text-sm transition-colors ${activeTab === 'sparql' ? 'bg-white text-indigo-700 border-x border-t border-gray-200 -mb-[2px] shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                        sparql editor
                    </button>
                </div>

                {/* Editor Panels */}
                <div className="flex-1 relative">
                    {/* PyScript Editor Panel */}
                    <div id="pyscript-panel" className={`absolute inset-0 flex flex-col space-y-4 transition-opacity duration-300 ${activeTab === 'pyscript' ? '' : 'hidden'}`}>
                        <Editor
                            height="100%"
                            language="python"
                            value={pyscriptCode}
                            onChange={handlePyscriptChange}
                            onMount={handlePyscriptEditorDidMount}
                            options={{ minimap: { enabled: false } }}
                        />
                        <div className="flex space-x-2">
                            <button onClick={runCode} className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">Run</button>
                            <button onClick={save} className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm">Save</button>
                            <button onClick={load} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">Load</button>
                            <button onClick={debug} className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm">Debug</button>
                        </div>
                        {/* PyScript Output Container */}
                        <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto text-sm font-mono h-32 shadow-sm">
                            <p>Output will appear here...</p>
                        </div>
                    </div>

                    {/* SPARQL Editor Panel */}
                    <div id="sparql-panel" className={`absolute inset-0 flex flex-col space-y-4 transition-opacity duration-300 ${activeTab === 'sparql' ? '' : 'hidden'}`}>
                        <Editor
                            height="100%"
                            language="sparql"
                            value={sparqlCode}
                            onChange={handleSparqlChange}
                            onMount={handleSparqlEditorDidMount}
                            options={{ minimap: { enabled: false } }}
                        />
                        <div className="flex space-x-2">
                            <button onClick={runSparql} className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">Run</button>
                            <button onClick={save} className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm">Save</button>
                            <button onClick={load} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">Load</button>
                            <button onClick={debug} className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm">Debug</button>
                        </div>
                        {/* SPARQL Output Container */}
                        <div className="bg-gray-900 text-blue-400 p-4 rounded-md overflow-auto text-sm font-mono h-32 shadow-sm">
                            <p>Output will appear here...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeEditor;
