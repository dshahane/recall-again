// hooks/useAssets.ts
'use client';

import { useState, useEffect } from 'react';
import { DataRepository } from '@/app/types/app';

export function useAssets(initialData?: DataRepository[]) {
    const [dataAssets, setDataAssets] = useState<DataRepository[]>(initialData || []);
    const [selectedAsset, setSelectedAsset] = useState<DataRepository | null>(null);

    // Mock backend: simulate async delay
    const simulateApi = <T extends any>(result: T, delay = 500) =>
        new Promise<T>((resolve) => setTimeout(() => resolve(result), delay));

    const importAsset = async (asset: DataRepository) => {
        const newAsset = { ...asset, id: Date.now().toString() };
        setDataAssets((prev) => [...prev, newAsset]);
        return simulateApi(true);
    };

    const updateAsset = async (asset: DataRepository) => {
        setDataAssets((prev) => prev.map(a => a.id === asset.id ? asset : a));
        return simulateApi(true);
    };

    const deleteAsset = async (assetId: string) => {
        setDataAssets((prev) => prev.filter(a => a.id !== assetId));
        if (selectedAsset?.id === assetId) setSelectedAsset(null);
        return simulateApi(true);
    };

    const selectAsset = async (assetId: string) => {
        const asset = dataAssets.find(a => a.id === assetId) || null;
        setSelectedAsset(asset);
        return simulateApi(true);
    };

    return {
        dataAssets,
        selectedAsset,
        importAsset,
        updateAsset,
        deleteAsset,
        selectAsset,
    };
}
