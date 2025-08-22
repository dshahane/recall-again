'use client';
import React, { useState } from 'react';
import AssetList from './AssetList';
import AssetDetails from './AssetDetails';
import ImportModal from './ImportModal';
import { useAssets } from '@/hooks/use-assets';

const AssetManager: React.FC = () => {
  const {
    dataAssets,
    selectedAsset,
    importAsset,
    updateAsset,
    deleteAsset,
    selectAsset
  } = useAssets();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAsset(null);
  };

  const handleShowImportModal = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  const handleEditAsset = (asset: any) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleSelectAsset = (asset: any) => selectAsset(asset.id);

  const handleDeleteAsset = (asset: any) => deleteAsset(asset.id);

  const handleSaveAsset = async (assetData: any) => {
    if (editingAsset) {
      await updateAsset({ ...editingAsset, ...assetData });
    } else {
      await importAsset(assetData);
    }
    handleCloseModal();
  };

  return (
      <div className="flex-1 flex p-6 space-x-6 overflow-hidden">
        <AssetList
            dataAssets={dataAssets}
            searchQuery={searchQuery}
            onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
            onSelectAsset={handleSelectAsset}
            onShowImportModal={handleShowImportModal}
            onEditAsset={handleEditAsset}
            onDeleteAsset={handleDeleteAsset}
            selectedAsset={selectedAsset}
        />
        <div className="w-full lg:w-2/3 min-h-[500px]">
          <AssetDetails asset={selectedAsset} />
        </div>
        <ImportModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSave={handleSaveAsset}
            initialData={editingAsset}
        />
      </div>
  );
};

export default AssetManager;
