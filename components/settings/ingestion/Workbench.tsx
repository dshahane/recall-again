import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// ---- Schema Icons ----
const schemaIcons = {
    "schema.org/Product": (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.264.077c.603.036 1.15.32 1.518.796l4.049 5.864a1.8 1.8 0 0 1-.322 2.454l-1.264.077c-.603.036-1.15-.32-1.518-.796l-4.049-5.864a1.8 1.8 0 0 1 .322-2.454ZM12 4.5a1.5 1.5 0 0 1-1.5 1.5H9.75V4.5a1.5 1.5 0 0 1 1.5-1.5h1.5Zm-1.5 1.5H9.75V4.5a1.5 1.5 0 0 1 1.5-1.5h1.5Zm-1.5 1.5H9.75v1.5H12v-1.5Z"/>
        </svg>
    ),
    "schema.org/Offer": (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a6 6 0 0 1 6-6h12.75a2.25 2.25 0 0 0 0-4.5H8.25a6 6 0 0 1-6-6v4.5m18 0a6 6 0 0 1-6 6H2.25a2.25 2.25 0 0 0 0 4.5H15.75a6 6 0 0 1 6-6v-4.5Z"/>
        </svg>
    ),
};

// ---- Mock Mappings ----
const mockMappings = {
    "schema.org/Product": {
        source: "BMEcat",
        mappings: [
            { source: "Title", target: "name" },
            { source: "SKU", target: "sku" },
            { source: "Description", target: "description" },
        ],
    },
    "schema.org/Offer": {
        source: "BMEcat",
        mappings: [
            { source: "Price", target: "price" },
            { source: "Currency", target: "priceCurrency" },
            { source: "Availability", target: "availability" },
        ],
    },
};

// ---- Custom Hook for Backend Data ----
const useDataService = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/v1/ingestion/data");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                setData(json);
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, loading, error };
};

// ---- Mapping SVG ----
const MappingSVG = ({ selectedSchemaType, mappings }: any) => {
    const [svgPaths, setSvgPaths] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const calculatePath = useCallback((sourceId: string, targetId: string) => {
        const sourceEl = document.getElementById(sourceId);
        const targetEl = document.getElementById(targetId);
        const containerEl = containerRef.current;
        if (!sourceEl || !targetEl || !containerEl) return "";

        const s = sourceEl.getBoundingClientRect();
        const t = targetEl.getBoundingClientRect();
        const c = containerEl.getBoundingClientRect();

        const x1 = s.right - c.left;
        const y1 = s.top - c.top + s.height / 2;
        const x2 = t.left - c.left;
        const y2 = t.top - c.top + t.height / 2;
        const dx = Math.max(0, x2 - x1);
        const cx1 = x1 + dx * 0.5;
        const cx2 = x2 - dx * 0.5;
        return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
    }, []);

    const drawPaths = useCallback(() => {
        if (!Array.isArray(mappings)) {
            setSvgPaths([]);
            return;
        }
        const paths = mappings.map((m, i) => calculatePath(`source-${i}`, `target-${i}`));
        setSvgPaths(paths);
    }, [mappings, calculatePath]);

    useEffect(() => {
        drawPaths();
        window.addEventListener("resize", drawPaths);
        return () => window.removeEventListener("resize", drawPaths);
    }, [drawPaths]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none">
            <svg className="w-full h-full">
                {svgPaths.map((path, i) => (
                    <path key={i} d={path} stroke="#818cf8" strokeWidth={2} fill="none" />
                ))}
            </svg>
        </div>
    );
};

// ---- Pages ----
const DashboardPage = ({ pipelines }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pipelines.map((p: any, idx: number) => (
            <div key={idx} className="bg-gray-800 text-gray-200 p-4 rounded-lg">
                <div className="font-semibold text-lg">{p.name}</div>
                <div>Last Run: {p.lastRun}</div>
                <div
                    className={`inline-block px-2 py-1 mt-2 rounded-full text-xs font-semibold ${
                        p.status === "Succeeded"
                            ? "bg-green-600 text-green-100"
                            : p.status === "Running"
                                ? "bg-yellow-600 text-yellow-100"
                                : "bg-red-600 text-red-100"
                    }`}
                >
                    {p.status}
                </div>
            </div>
        ))}
    </div>
);

const IngestionPage = () => {
    const IngestionSource = ({ title, description, buttonText }: any) => (
        <div className="bg-gray-800 text-gray-200 p-4 rounded-lg">
            <div className="font-semibold text-lg">{title}</div>
            <div className="mt-1 text-gray-400">{description}</div>
            <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                {buttonText}
            </button>
        </div>
    );
    return (
        <div className="space-y-6">
            <IngestionSource
                title="BMEcat Catalog"
                description="Upload new product catalogs in BMEcat XML format."
                buttonText="Upload BMEcat"
            />
            <IngestionSource
                title="Reviews Data"
                description="Ingest customer reviews from CSV datasets."
                buttonText="Import Reviews"
            />
        </div>
    );
};

const SchemaPage = ({ schema }: any) => {
    const [selectedSchema, setSelectedSchema] = useState<any>(null);

    return (
        <div className="space-y-6 relative">
            {!selectedSchema && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schema.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            className="flex items-center space-x-2 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                            onClick={() => setSelectedSchema(item)}
                        >
                            {schemaIcons[item.type]}
                            <span>{item.type}</span>
                        </div>
                    ))}
                </div>
            )}

            {selectedSchema && (
                <div className="flex relative gap-4">
                    <div className="w-1/2 p-2">
                        <div className="font-semibold mb-2">Source Attributes ({mockMappings[selectedSchema.type].source})</div>
                        <div className="space-y-2">
                            {mockMappings[selectedSchema.type].mappings.map((m: any, i: number) => (
                                <div key={i} id={`source-${i}`} className="bg-indigo-700 text-indigo-100 p-2 rounded">
                                    {m.source}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2 p-2">
                        <div className="font-semibold mb-2">Target Properties</div>
                        <div className="space-y-2">
                            {mockMappings[selectedSchema.type].mappings.map((m: any, i: number) => (
                                <div key={i} id={`target-${i}`} className="bg-gray-700 text-gray-200 p-2 rounded">
                                    {m.target}
                                </div>
                            ))}
                        </div>
                    </div>
                    <MappingSVG selectedSchemaType={selectedSchema.type} mappings={mockMappings[selectedSchema.type].mappings} />
                    <button
                        onClick={() => setSelectedSchema(null)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

const AnalyticsPage = ({ analyticsData }: any) => {
    const COLORS = ["#818cf8", "#22c55e", "#facc15", "#f97316"];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 text-gray-200 p-4 rounded-lg">
                <div className="font-semibold mb-2">Ingestion Trends</div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.ingestionTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Items_Ingested" fill="#818cf8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-gray-800 text-gray-200 p-4 rounded-lg">
                <div className="font-semibold mb-2">Top Failure Reasons</div>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={analyticsData.failureReasons}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {analyticsData.failureReasons.map((entry: any, i: number) => (
                                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// ---- Main Workbench ----
const Workbench = () => {
    const { data, loading, error } = useDataService();
    const [activeTab, setActiveTab] = useState("dashboard");

    if (loading) return <div className="p-6 text-center text-gray-400">Loading...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error connecting backend</div>;

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardPage pipelines={data.pipelines} />;
            case "ingestion":
                return <IngestionPage />;
            case "schema":
                return <SchemaPage schema={data.schema} />;
            case "analytics":
                return <AnalyticsPage analyticsData={data.analytics} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-gray-200">
            <div className="flex space-x-4 mb-6">
                {["dashboard", "ingestion", "schema", "analytics"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded ${
                            activeTab === tab
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
            {renderContent()}
        </div>
    );
};

export default Workbench;
