import Card from '../ui/Card';
import Button from '../ui/Button';

const kpis = [
    { title: "Total Facts", value: "12,456", description: "Number of unique facts indexed." },
    { title: "Usage Rate", value: "89%", description: "Percentage of queries that use knowledge." },
    { title: "Avg. Freshness", value: "3 days", description: "Average age of the knowledge data." },
];

const knowledgeSources = [
    { name: "Internal Wiki", type: "RDF", status: "Active" },
    { name: "Marketing PDFs", type: "JSON", status: "Active" },
    { name: "Support Forum", type: "Tabular", status: "Active" },
];

export default function KnowledgeDashboard({ setActiveTab }) {
    return (
        <Card title="Knowledge Dashboard" description="Monitor and query your connected knowledge sources.">
            <div className="flex justify-end mt-4 mb-6">
                <Button onClick={() => setActiveTab('add-knowledge')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5L12 19" /><path d="M5 12L19 12" />
                    </svg>
                    <span className="ml-2">Add Knowledge</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {kpis.map((kpi, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</h4>
                        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{kpi.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{kpi.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Connected Sources</h3>
                <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">Source Name</th>
                            <th scope="col" className="p-4">Type</th>
                            <th scope="col" className="p-4">Status</th>
                            <th scope="col" className="p-4"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {knowledgeSources.map((source, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="p-4">{source.name}</td>
                                <td className="p-4">{source.type}</td>
                                <td className="p-4 text-green-500">{source.status}</td>
                                <td className="p-4 text-right">
                                    <button className="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">SPARQL Query Interface</h3>
                <textarea
                    rows="10"
                    className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    placeholder="PREFIX trl: <http://example.org/trl#>
SELECT ?fact ?value
WHERE {
  ?fact a trl:Metric ;
        trl:value ?value .
}
"
                ></textarea>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline">Clear</Button>
                    <Button>Run Query</Button>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab('settings')}>Back</Button>
            </div>
        </Card>
    );
}