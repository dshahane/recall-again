import React, { useState } from 'react';
import AssetList from './AssetList';
import AssetDetails from './AssetDetails';
import ImportModal from './ImportModal';
import { DataRepository } from '@/app/types/app';

// Define the props interface for the AssetManager
interface AssetManagerProps {
  dataAssets: DataRepository[];
  onImportAsset: (assetData: DataRepository) => Promise<boolean>;
  onUpdateAsset: (assetData: DataRepository) => Promise<boolean>;
  onDeleteAsset: (assetId: string) => Promise<boolean>;
  onSelectAsset: (assetId: string) => Promise<boolean>;
}

const AssetManager: React.FC<AssetManagerProps> = ({
  dataAssets,
  onImportAsset,
  onUpdateAsset,
  onDeleteAsset,
  onSelectAsset
}) => {
  // State to manage the search query for filtering assets
  const [searchQuery, setSearchQuery] = useState('');
  // State to hold the currently selected asset for the details view
  const [selectedAsset, setSelectedAsset] = useState<DataRepository | null>(null);
  // State to control the visibility of the import/edit modal
  const [showModal, setShowModal] = useState(false);
  // State to hold the asset currently being edited (null for new imports)
  const [editingAsset, setEditingAsset] = useState<DataRepository | null>(null);
 
  // Handlers for modal and actions
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAsset(null); // Reset the editing asset when the modal closes
  };

  const handleShowImportModal = () => {
    setEditingAsset(null); // Ensure no editing asset is set for a new import
    setShowModal(true);
  };

  const handleEditAsset = (asset: DataRepository) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleSelectAsset = async (asset: DataRepository) => {
    console.log("ASM", asset);
    setSelectedAsset(asset);
  }

  const handleDeleteAsset = async (asset: DataRepository) => {
    // Note: A real app would use a custom confirmation modal, not window.confirm
    if (window.confirm(`Are you sure you want to delete the asset "${asset.name}"?`)) {
      const success = await onDeleteAsset(asset.id);
      if (success && selectedAsset && selectedAsset.id === asset.id) {
        setSelectedAsset(null); // Deselect the asset if it was the one deleted
      }
    }
  };

  const handleSaveAsset = async (assetData: DataRepository) => {
    let success = false;
    // Check if we are editing an existing asset or creating a new one
    if (editingAsset) {
      success = await onUpdateAsset({ ...editingAsset, ...assetData });
    } else {
      success = await onImportAsset(assetData);
    }

    if (success) {
      handleCloseModal();
    }
  };

  return (
    <div className="flex-1 flex p-6 space-x-6 overflow-hidden">
      {/* Asset List Section */}
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
      {/* Asset Details Section */}
      <div className="w-full lg:w-2/3 min-h-[500px]">
        <AssetDetails asset={selectedAsset} />
      </div>
      {/* Import/Edit Modal */}
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
