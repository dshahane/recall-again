// All the code is now combined into a single, self-contained file.
// All necessary imports are placed at the top of this file.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/**
 * A reusable button component for the horizontal tab bar.
 */
const TabButton = ({ id, activeTab, setActiveTab, children }) => {
    const isActive = id === activeTab;
    return (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        ${isActive
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            {children}
        </button>
    );
};

/**
 * Generic card component for displaying content blocks.
 */
const Card = ({ title, icon, children }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
                {icon && (
                    <div className="flex-shrink-0 p-2 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

/**
 * Custom hook to fetch data from the FastAPI backend service.
 */
const useDataService = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the FastAPI server running on port 8000
                const response = await fetch('http://localhost:8000/api/v1/ingestion/data');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

const DashboardPage = ({ pipelines }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Ingestion Status" icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                )}>
                    {pipelines.map((p, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <div className="flex-1">
                                <span className="font-medium text-gray-700">{p.name}</span>
                                <p className="text-sm text-gray-500">Last Run: {p.lastRun}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                p.status === 'Succeeded' ? 'bg-green-100 text-green-800' :
                                    p.status === 'Running' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                {p.status}
              </span>
                        </div>
                    ))}
                </Card>
                <Card title="Data Volume" icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v12a2.25 2.25 0 0 0 2.25 2.25h1.5m3.75-18v.75m0 12h-1m2.25-4.5h.75" />
                    </svg>
                )}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <div className="text-3xl font-bold text-gray-900 flex-shrink-0">
                            1.2M
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Total Records Ingested</p>
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <span>BMEcat: 15,432</span>
                                <span>Reviews: 8,760</span>
                                <span>Clickstream: 213,214</span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card title="System Health" icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9h-9Zm0 0a9 9 0 0 1-9-9h9Zm0 0a9 9 0 0 0-9-9h9Z" />
                    </svg>
                )}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Apache Jena</span>
                                <span className="bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full text-xs">Online</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                                <span>ClickHouse</span>
                                <span className="bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full text-xs">Online</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                                <span>Elasticsearch</span>
                                <span className="bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full text-xs">Online</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const IngestionPage = () => {
    const IngestionSource = ({ title, description, buttonText }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-500 text-sm mt-1">{description}</p>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md">
                {buttonText}
            </button>
        </div>
    );

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Ingestion</h2>
            <div className="space-y-6">
                <IngestionSource title="BMEcat Catalog" description="Upload new product catalogs in BMEcat XML format." buttonText="Upload BMEcat" />
                <IngestionSource title="Reviews Data" description="Ingest customer reviews from a public dataset (e.g., CSV)." buttonText="Import Reviews" />
                <IngestionSource title="Clickstream Data" description="Connect to a data stream for user interaction logs." buttonText="Connect Stream" />
            </div>
        </div>
    );
};

const schemaIcons = {
    'schema.org/Product': (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.264.077c.603.036 1.15.32 1.518.796l4.049 5.864a1.8 1.8 0 0 1-.322 2.454l-1.264.077c-.603.036-1.15-.32-1.518-.796l-4.049-5.864a1.8 1.8 0 0 1 .322-2.454ZM12 4.5a1.5 1.5 0 0 1-1.5 1.5H9.75V4.5a1.5 1.5 0 0 1 1.5-1.5h1.5Zm-1.5 1.5H9.75V4.5a1.5 1.5 0 0 1 1.5-1.5h1.5Zm-1.5 1.5H9.75v1.5H12v-1.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5h.75m-7.5-1.5h.75" />
        </svg>
    ),
    'schema.org/Offer': (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a6 6 0 0 1 6-6h12.75a2.25 2.25 0 0 0 0-4.5H8.25a6 6 0 0 1-6-6v4.5m18 0a6 6 0 0 1-6 6H2.25a2.25 2.25 0 0 0 0 4.5H15.75a6 6 0 0 1 6-6v-4.5Z" />
        </svg>
    ),
    'schema.org/Review': (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3.75-.75a.75.75 0 1 0-.75.75.75.75 0 0 0 .75-.75ZM.75 18.75a.75.75 0 1 0-.75-.75.75.75 0 0 0 .75.75Zm.75-10.5h19.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9h-9Zm0 0a9 9 0 0 1-9-9h9Zm0 0a9 9 0 0 0-9-9h9Z" />
        </svg>
    ),
    'schema.org/AggregateRating': (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5V12h9m-9 9a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        </svg>
    ),
    'schema.org/ViewAction': (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.183.179.62.179 1.258 0 1.878A10.686 10.686 0 0 1 12 18c-4.638 0-8.575-3.01-9.963-7.182Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    ),
    'schema.org/SearchAction': (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    ),
};

const mockMappings = {
    'schema.org/Product': {
        source: 'BMEcat',
        mappings: [
            { source: 'Title', target: 'name' },
            { source: 'SKU', target: 'sku' },
            { source: 'Description', target: 'description' },
        ],
    },
    'schema.org/Offer': {
        source: 'BMEcat',
        mappings: [
            { source: 'Price', target: 'price' },
            { source: 'Currency', target: 'priceCurrency' },
            { source: 'Availability', target: 'availability' },
        ],
    },
    'schema.org/Review': {
        source: 'Reviews Dataset',
        mappings: [
            { source: 'ReviewText', target: 'reviewBody' },
            { source: 'AuthorName', target: 'author' },
            { source: 'Date', target: 'dateCreated' },
        ],
    },
    'schema.org/AggregateRating': {
        source: 'Reviews Dataset',
        mappings: [
            { source: 'AverageRating', target: 'ratingValue' },
            { source: 'RatingCount', target: 'ratingCount' },
        ],
    },
    'schema.org/ViewAction': {
        source: 'Clickstream Data',
        mappings: [
            { source: 'EventTimestamp', target: 'startTime' },
            { source: 'UserID', target: 'agent' },
            { source: 'ViewedItem', target: 'object' },
        ],
    },
    'schema.org/SearchAction': {
        source: 'Query Data',
        mappings: [
            { source: 'SearchTerm', target: 'query' },
            { source: 'Timestamp', target: 'startTime' },
        ],
    },
};

const MappingSVG = ({ selectedSchemaType, mappings }) => {
    const [svgPaths, setSvgPaths] = useState([]);
    const containerRef = useRef(null);

    const calculatePath = useCallback((sourceId, targetId) => {
        const sourceEl = document.getElementById(sourceId);
        const targetEl = document.getElementById(targetId);
        const containerEl = containerRef.current;

        if (!sourceEl || !targetEl || !containerEl) {
            return '';
        }

        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();

        // Calculate relative coordinates to the SVG container
        const x1 = sourceRect.right - containerRect.left;
        const y1 = sourceRect.top - containerRect.top + sourceRect.height / 2;
        const x2 = targetRect.left - containerRect.left;
        const y2 = targetRect.top - containerRect.top + targetRect.height / 2;

        const curveFactor = 0.5; // Controls the curve of the line
        const dx = Math.max(0, x2 - x1);
        const controlX1 = x1 + dx * curveFactor;
        const controlX2 = x2 - dx * curveFactor;

        // Create a smooth, curved path using a cubic Bezier curve
        return `M ${x1} ${y1} C ${controlX1} ${y1}, ${controlX2} ${y2}, ${x2} ${y2}`;
    }, []);

    const drawPaths = useCallback(() => {
        // Add a safety check to ensure mappings is a valid array
        if (!Array.isArray(mappings)) {
            setSvgPaths([]);
            return;
        }
        const paths = mappings.map((mapping, index) => {
            const sourceId = `source-${index}`;
            const targetId = `target-${index}`;
            return calculatePath(sourceId, targetId);
        });
        setSvgPaths(paths);
    }, [mappings, calculatePath]);

    useEffect(() => {
        // Initial draw
        drawPaths();
        // Re-draw on window resize to keep lines connected
        window.addEventListener('resize', drawPaths);
        return () => {
            window.removeEventListener('resize', drawPaths);
        };
    }, [drawPaths, selectedSchemaType]); // Re-run effect when a new schema is selected

    return (
        <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none">
            <svg className="w-full h-full">
                {svgPaths.map((path, index) => (
                    <path
                        key={index}
                        d={path}
                        stroke="#6366f1"
                        strokeWidth="2"
                        fill="none"
                        className="transition-all duration-300"
                    />
                ))}
            </svg>
        </div>
    );
};

const SchemaPage = ({ schema }) => {
    const [selectedSchema, setSelectedSchema] = useState(null);

    const renderSchemaList = () => (
        <Card title="Defined Schema.org Types">
            <ul className="divide-y divide-gray-200">
                {schema.map((item, index) => (
                    <li
                        key={index}
                        className={`py-3 flex items-center justify-between cursor-pointer rounded-lg px-2 -mx-2 transition-colors duration-200
              ${selectedSchema && selectedSchema.type !== item.type ? 'opacity-50' : ''}
              ${selectedSchema && selectedSchema.type === item.type ? 'bg-indigo-50 text-indigo-800' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedSchema(item)}
                    >
                        <div className="flex items-center space-x-3">
                            <span className={`flex-shrink-0 ${selectedSchema ? 'w-5' : 'w-5'}`}>{schemaIcons[item.type]}</span>
                            <span className={`font-semibold text-gray-800 transition-opacity duration-200 ${selectedSchema ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                {item.type}
              </span>
                        </div>
                        <span className={`bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-4 transition-opacity duration-200 ${selectedSchema ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              Mapped from: {item.mappedFrom}
            </span>
                    </li>
                ))}
            </ul>
        </Card>
    );

    const renderMappingEditor = () => (
        <Card title={`Mapping: ${selectedSchema.type}`}>
            <button onClick={() => setSelectedSchema(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="flex h-full w-full relative">
                <div className="w-1/2 p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-4">Source Attributes ({mockMappings[selectedSchema.type].source})</h4>
                    <div className="space-y-4">
                        {mockMappings[selectedSchema.type].mappings.map((mapping, index) => (
                            <div
                                key={index}
                                id={`source-${index}`}
                                className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-indigo-800 font-medium text-sm"
                            >
                                {mapping.source}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-4">Target Properties (schema.org)</h4>
                    <div className="space-y-4">
                        {mockMappings[selectedSchema.type].mappings.map((mapping, index) => (
                            <div
                                key={index}
                                id={`target-${index}`}
                                className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-800 font-medium text-sm"
                            >
                                {mapping.target}
                            </div>
                        ))}
                    </div>
                </div>
                {/* SVG overlay for drawing connections */}
                <MappingSVG selectedSchemaType={selectedSchema.type} mappings={mockMappings[selectedSchema.type].mappings} />
            </div>
        </Card>
    );
};

const AnalyticsPage = ({ analyticsData }) => {
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Ingestion Trends (Weekly)">
                    <p className="text-sm text-gray-500 mb-4">Daily volume of items ingested over the past week.</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={analyticsData.ingestionTrends}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Items_Ingested" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Top Failure Reasons">
                    <p className="text-sm text-gray-500 mb-4">Distribution of common failure reasons for ingestion jobs.</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analyticsData.failureReasons}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {analyticsData.failureReasons.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};


const Workbench = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { data, loading, error } = useDataService();

    const renderContent = () => {
        if (loading) {
            return <div className="p-6 text-center text-gray-500">Loading...</div>;
        }
        if (error) {
            // Show a more helpful message if the fetch fails
            return <div className="p-6 text-center text-red-500">Error: Could not connect to the backend server. Please make sure the FastAPI app is running on port 8000.</div>;
        }

        switch (activeTab) {
            case 'dashboard':
                return <DashboardPage pipelines={data.pipelines} />;
            case 'ingestion':
                return <IngestionPage />;
            case 'schema':
                return <SchemaPage schema={data.schema} />;
            case 'analytics':
                return <AnalyticsPage analyticsData={data.analytics} />;
            default:
                return <DashboardPage pipelines={data.pipelines} />;
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 p-4">
                <h1 className="text-2xl font-bold text-gray-800">Catalog Flow</h1>
            </header>
            <nav className="bg-white border-b border-gray-200 sticky top-16 z-10">
                <div className="flex justify-start px-4">
                    <TabButton id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab}>Dashboard</TabButton>
                    <TabButton id="ingestion" activeTab={activeTab} setActiveTab={setActiveTab}>Ingestion</TabButton>
                    <TabButton id="schema" activeTab={activeTab} setActiveTab={setActiveTab}>Schema Viewer</TabButton>
                    <TabButton id="analytics" activeTab={activeTab} setActiveTab={setActiveTab}>Analytics</TabButton>
                </div>
            </nav>
            <main className="p-6 flex-1">
                {renderContent()}
            </main>
        </div>
    );
};


export default Workbench;
