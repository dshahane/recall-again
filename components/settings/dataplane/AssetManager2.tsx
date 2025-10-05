'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// This is the main component that manages all state and handles the overall layout.
export default function AssetManager2() {
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [dataAssets, setDataAssets] = useState([
        { id: '1', name: 'Sales Data Q1 2024', source: 'Snowflake', format: 'csv', size: '10MB', topics: ['Sales', 'Financials', 'Q1'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '2', name: 'Website Traffic 2023', source: 'Google Analytics', format: 'json', size: '25MB', topics: ['Marketing', 'Analytics', 'Website'], content: `{\n  "id": "2",\n  "name": "Website Traffic 2023",\n  "details": {\n    "source": "Google Analytics",\n    "format": "json",\n    "size": "25MB",\n    "topics": ["Marketing", "Analytics", "Website"]\n  }\n}` },
        { id: '3', name: 'Customer Demographics', source: 'Internal CRM', format: 'xlsx', size: '5MB', topics: ['Customers', 'Demographics'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '4', 'name': 'Product Inventory Report', source: 'Shopify API', format: 'json', size: '12MB', topics: ['Inventory', 'Products'], content: `{\n  "id": "4",\n  "name": "Product Inventory Report",\n  "details": {\n    "source": "Shopify API",\n    "format": "json",\n    "size": "12MB",\n    "topics": ["Inventory", "Products"]\n  }\n}` },
        { id: '5', name: 'Marketing Campaign Performance', source: 'Google Ads', format: 'csv', size: '8MB', topics: ['Marketing', 'Ads'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '6', name: 'Social Media Engagement', source: 'Meta', format: 'json', size: '30MB', topics: ['Social Media', 'Engagement'], content: `{\n  "id": "6",\n  "name": "Social Media Engagement",\n  "details": {\n    "source": "Meta",\n    "format": "json",\n    "size": "30MB",\n    "topics": ["Social Media", "Engagement"]\n  }\n}` },
        { id: '7', name: 'Financial Projections 2025', source: 'Salesforce', format: 'xlsx', size: '6MB', topics: ['Financials', 'Planning', 'Projections'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '8', name: 'Historical Stock Prices', source: 'Bloomberg', format: 'csv', size: '50MB', topics: ['Stocks', 'Financials'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '9', name: 'Employee Directory', source: 'Internal HR', format: 'json', size: '3MB', topics: ['HR', 'Employees'], content: `{\n  "id": "9",\n  "name": "Employee Directory",\n  "details": {\n    "source": "Internal HR",\n    "format": "json",\n    "size": "3MB",\n    "topics": ["HR", "Employees"]\n  }\n}` },
        { id: '10', name: 'Server Logs 2024-03', source: 'AWS S3', format: 'json', size: '100MB', topics: ['IT', 'Logs'], content: `{\n  "id": "10",\n  "name": "Server Logs 2024-03",\n  "details": {\n    "source": "AWS S3",\n    "format": "json",\n    "size": "100MB",\n    "topics": ["IT", "Logs"]\n  }\n}` },
        { id: '11', name: 'Quarterly Financials', source: 'ERP System', format: 'xlsx', size: '15MB', topics: ['Financials', 'Quarterly'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '12', name: 'Website Traffic 2024', source: 'Google Analytics', format: 'json', size: '28MB', topics: ['Website', 'Analytics'], content: `{\n  "id": "12",\n  "name": "Website Traffic 2024",\n  "details": {\n    "source": "Google Analytics",\n    "format": "json",\n    "size": "28MB",\n    "topics": ["Website", "Analytics"]\n  }\n}` },
        { id: '13', name: 'Social Media Mentions', source: 'Twitter API', format: 'json', size: '55MB', topics: ['Social Media', 'Trends'], content: `{\n  "id": "13",\n  "name": "Social Media Mentions",\n  "details": {\n    "source": "Twitter API",\n    "format": "json",\n    "size": "55MB",\n    "topics": ["Social Media", "Trends"]\n  }\n}` },
        { id: '14', name: 'Customer Feedback Surveys', source: 'Typeform', format: 'csv', size: '7MB', topics: ['Customers', 'Feedback'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '15', name: 'Support Ticket History', source: 'Zendesk', format: 'json', size: '42MB', topics: ['Support', 'Tickets'], content: `{\n  "id": "15",\n  "name": "Support Ticket History",\n  "details": {\n    "source": "Zendesk",\n    "format": "json",\n    "size": "42MB",\n    "topics": ["Support", "Tickets"]\n  }\n}` },
        { id: '16', name: 'Email Campaign Results', source: 'Mailchimp', format: 'csv', size: '11MB', topics: ['Marketing', 'Email'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '17', name: 'Supplier Information', source: 'Procurement System', format: 'xlsx', size: '9MB', topics: ['Suppliers', 'Procurement'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '18', name: 'Manufacturing Data', source: 'IoT Sensors', format: 'json', size: '200MB', topics: ['Manufacturing', 'IoT'], content: `{\n  "id": "18",\n  "name": "Manufacturing Data",\n  "details": {\n    "source": "IoT Sensors",\n    "format": "json",\n    "size": "200MB",\n    "topics": ["Manufacturing", "IoT"]\n  }\n}` },
        { id: '19', name: 'Retail Sales Data', source: 'Point-of-Sale', format: 'csv', size: '88MB', topics: ['Retail', 'Sales'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '20', name: 'Logistics and Shipping', source: 'FedEx API', format: 'json', size: '19MB', topics: ['Logistics', 'Shipping'], content: `{\n  "id": "20",\n  "name": "Logistics and Shipping",\n  "details": {\n    "source": "FedEx API",\n    "format": "json",\n    "size": "19MB",\n    "topics": ["Logistics", "Shipping"]\n  }\n}` },
        { id: '21', name: 'Web Analytics Report', source: 'Adobe Analytics', format: 'xlsx', size: '22MB', topics: ['Analytics', 'Website'], content: `Header 1,Header 2,Header 3\n"Row 1, Cell 1","Row 1, Cell 2","Row 1, Cell 3"\n"Row 2, Cell 1","Row 2, Cell 2","Row 2, Cell 3"` },
        { id: '22', name: 'Company Policy Manual', source: 'Internal Docs', format: 'pdf', size: '1MB', topics: ['HR', 'Policy'], content: 'This is a mock PDF content.' },
        { id: '23', name: 'Software Architecture', source: 'Development', format: 'xml', size: '3MB', topics: ['IT', 'Architecture'], content: `<asset id="23">\n  <name>Software Architecture</name>\n  <details>\n    <source>Development</source>\n    <format>xml</format>\n    <size>3MB</size>\n  </details>\n</asset>` },
    ]);

    const handleSelectAsset = (asset) => {
        setSelectedAsset(asset);
    };

    const handleShowImportModal = () => {
        setEditingAsset(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveAsset = async (newAssetData) => {
        const newId = Date.now().toString();
        if (newAssetData.url) {
            try {
                const response = await fetch(newAssetData.url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const content = await response.text();
                const urlParts = newAssetData.url.split('.');
                const format = urlParts[urlParts.length - 1];

                setDataAssets([...dataAssets, {
                    id: newId,
                    name: newAssetData.name || urlParts[urlParts.length - 2],
                    source: newAssetData.source,
                    format,
                    size: `${(content.length / 1024).toFixed(2)} KB`,
                    topics: ['Dynamic', 'Import'],
                    content
                }]);
            } catch (error) {
                console.error("Failed to download content:", error);
            }
        } else {
            setDataAssets([...dataAssets, { ...newAssetData, id: newId, content: '' }]);
        }
        handleCloseModal();
    };

    const handleEditAsset = (asset) => {
        setEditingAsset(asset);
        setShowModal(true);
    };

    const handleDeleteAsset = (e, assetId) => {
        e.stopPropagation();
        const updatedAssets = dataAssets.filter(asset => asset.id !== assetId);
        setDataAssets(updatedAssets);
        if (selectedAsset && selectedAsset.id === assetId) {
            setSelectedAsset(null);
        }
    };

    const filteredAssets = useMemo(() => {
        return dataAssets.filter(asset =>
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.source.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [dataAssets, searchQuery]);

    // Nested Component for the Asset List
    const AssetList = ({ dataAssets, searchQuery, onSearchQueryChange, onSelectAsset, onShowImportModal, onEditAsset, onDeleteAsset, selectedAsset }) => (
        <div className="flex-1 min-w-0 flex flex-col shadow-lg bg-white rounded-lg">
            <div className="border-b p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Data Assets</h2>
                    <Button onClick={onShowImportModal} className="flex items-center space-x-2">
                        <PlusCircle size={16} />
                        <span>New Asset</span>
                    </Button>
                </div>
                <p className="text-gray-700 text-sm">
                    List of your current data assets. Select one to view its details.
                </p>
            </div>
            <div className="flex flex-col flex-1 space-y-4 p-6">
                <Input
                    value={searchQuery}
                    onChange={onSearchQueryChange}
                    placeholder="Search assets..."
                    className="w-full"
                />
                <div className="flex-1 overflow-y-auto max-h-[80vh]">
                    {dataAssets.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {dataAssets.map(asset => (
                                <tr
                                    key={asset.id}
                                    onClick={() => onSelectAsset(asset)}
                                    className={`
                      cursor-pointer transition-colors border-l-4
                      ${
                                        selectedAsset?.id === asset.id
                                            ? 'bg-blue-50 border-blue-600 shadow-sm'
                                            : 'hover:bg-gray-50 border-white'
                                    }
                    `}
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{asset.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{asset.source}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); onEditAsset(asset); }}
                                                className="p-1 h-auto w-auto text-gray-600 hover:text-blue-500"
                                                aria-label={`Edit ${asset.name}`}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => onDeleteAsset(e, asset.id)}
                                                className="p-1 h-auto w-auto text-gray-600 hover:text-red-500"
                                                aria-label={`Delete ${asset.name}`}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
                            <p>No assets found.</p>
                            <p>Try a different search or add a new asset.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Nested Component for Asset Details
    const AssetDetails = ({ asset }) => {
        const [activeTab, setActiveTab] = useState('overview');

        const renderContent = () => {
            if (!asset) return null;

            if (activeTab === 'overview') {
                return (
                    <div className="space-y-6 text-sm text-gray-800">
                        <div>
                            <h4 className="font-semibold text-gray-900">Source:</h4>
                            <p className="pl-4">{asset.source}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Format:</h4>
                            <p className="pl-4">{asset.format}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Size:</h4>
                            <p className="pl-4">{asset.size}</p>
                        </div>
                        {asset.topics && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Topics:</h4>
                                <div className="flex flex-wrap gap-2 pl-4">
                                    {asset.topics.map((topic, index) => (
                                        <span key={index} className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{topic}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            } else if (activeTab === 'content') {
                switch (asset.format) {
                    case 'csv':
                    case 'xlsx':
                        try {
                            const rows = asset.content.split('\n').map(row => row.split(','));
                            return (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            {rows[0].map((header, index) => (
                                                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header.replace(/"/g, '')}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {rows.slice(1).map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell.replace(/"/g, '')}</td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        } catch (e) {
                            return <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-red-500">Error parsing CSV/XLSX content.</pre>;
                        }
                    case 'json':
                        try {
                            return (
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-800">
                  <code className="language-json">{JSON.stringify(JSON.parse(asset.content), null, 2)}</code>
                </pre>
                            );
                        } catch (e) {
                            return <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-red-500">Error parsing JSON content.</pre>;
                        }
                    case 'xml':
                        return (
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-800">
                <code className="language-xml">{asset.content}</code>
              </pre>
                        );
                    case 'pdf':
                        return (
                            <div className="flex items-center justify-center h-full text-center text-gray-500 p-6 border border-dashed rounded-lg bg-gray-50">
                                <p>PDF Viewer Placeholder. A viewer would be embedded here.</p>
                            </div>
                        );
                    default:
                        return (
                            <div className="flex items-center justify-center h-full text-center text-gray-400">
                                <p>No preview available for this file type.</p>
                            </div>
                        );
                }
            }
        };

        return (
            <Card className="flex-1 flex flex-col min-w-0 shadow-lg h-full">
                <CardHeader className="border-b mb-4">
                    <CardTitle className="text-2xl font-bold">{asset?.name || 'Select an Asset'}</CardTitle>
                    <CardDescription className="text-gray-700">{asset ? 'Details of the selected asset.' : 'Click on an asset from the list to view its details here.'}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 p-6">
                    {asset ? (
                        <>
                            <div className="flex space-x-2 border-b mb-4">
                                <Button variant="ghost" className={`rounded-b-none ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('overview')}>Overview</Button>
                                <Button variant="ghost" className={`rounded-b-none ${activeTab === 'content' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('content')}>Content</Button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {renderContent()}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-gray-400">
                            <p>No asset selected.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    // Nested Component for the Import Modal
    const ImportModal = ({ isOpen, onClose, onSave, initialData }) => {
        const [name, setName] = useState(initialData?.name || "");
        const [source, setSource] = useState(initialData?.source || "");
        const [url, setUrl] = useState("");
        const [loading, setLoading] = useState(false);
        const [progress, setProgress] = useState(0);

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!name || !source) return;

            if (url) {
                setLoading(true);
                // Simulate progress for demonstration as fetch doesn't have a built-in progress event.
                // A real implementation would use a different library or method to get progress.
                const interval = setInterval(() => {
                    setProgress(prev => Math.min(prev + 10, 100));
                }, 200);

                try {
                    await onSave({ name, source, url });
                    clearInterval(interval);
                    setLoading(false);
                    setProgress(100);
                    onClose();
                } catch (error) {
                    clearInterval(interval);
                    setLoading(false);
                    setProgress(0);
                    console.error("Download failed:", error);
                    // A more robust app would show a user-facing error message here.
                }
            } else {
                onSave({ name, source });
                onClose();
            }
        };

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{initialData ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
                        <DialogDescription className="text-gray-700">
                            {initialData ? 'Update the details of the data asset.' : 'Fill out the details or provide a URL to import a new data asset.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="asset-name" className="text-right">Name</Label>
                            <Input
                                id="asset-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., Q2 Sales Report"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="asset-source" className="text-right">Source</Label>
                            <Input
                                id="asset-source"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., Snowflake, API, CSV"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="asset-url" className="text-right">URL</Label>
                            <Input
                                id="asset-url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., https://example.com/data.json"
                            />
                        </div>
                        {loading && (
                            <div className="grid gap-2">
                                <Label>Downloading...</Label>
                                <Progress value={progress} className="w-full" />
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {initialData ? 'Save Changes' : (loading ? 'Importing...' : 'Import Asset')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-500 p-6">
            <div className="flex w-full max-w-6xl h-full space-x-6">

                {/* The main layout using the nested components */}
                <AssetList
                    dataAssets={filteredAssets}
                    searchQuery={searchQuery}
                    onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
                    onSelectAsset={handleSelectAsset}
                    onShowImportModal={handleShowImportModal}
                    onEditAsset={handleEditAsset}
                    onDeleteAsset={handleDeleteAsset}
                    selectedAsset={selectedAsset}
                />

                <div className="flex-1 min-h-[500px]">
                    <AssetDetails asset={selectedAsset} />
                </div>

                <ImportModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    onSave={handleSaveAsset}
                    initialData={editingAsset}
                />

            </div>
        </div>
    );
}
