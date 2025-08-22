import React from 'react';
import { useState, useEffect } from 'react';
import { Card } from '@/components//ui/card';
import { Button } from '@/components//ui/button';
import AssetList from "@/components/settings/dataplane/AssetList";

export default function IngestionSettings() {
    const [dataAssets, setDataAssets] = useState([]);
    // Optional: fetch data from an API
    useEffect(() => {
        // Example: fetchData().then(data => setDataAssets(data));
    }, []);
    return (
        <Card title="Ingestions" description="Ingest RDF, XML, tabular, and unstructred data.">
            <div className="space-y-4 mt-4">
                <AssetList dataAssets={dataAssets}/>
            </div>
            <div className="flex justify-end mt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab('settings')}>Back</Button>
            </div>
        </Card>
    );
}