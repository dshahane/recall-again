// ./hooks/useDataAssets.js
import { useState, useEffect } from 'react';
import { fetchAndEnrichAssets, createAsset, updateAsset, deleteAsset } from '../../components/dataplane/AssetAPIClient';

const useDataAssets = () => {
  const [dataAssets, setDataAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch and enrich assets
  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const assets = await fetchAndEnrichAssets();
      setDataAssets(assets);
      setError(null);
    } catch (err) {
      console.error('Error fetching data assets:', err);
      setError(err.message || 'Failed to fetch data assets.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for creating a new asset
  const handleCreateAsset = async (assetData) => {
    try {
      await createAsset(assetData);
      fetchAssets(); // Refresh the list after creation
      return true;
    } catch (err) {
      console.error('Error creating asset:', err);
      setError('Failed to create asset.');
      return false;
    }
  };

  // Handler for updating an existing asset
  const handleUpdateAsset = async (assetData) => {
    try {
      await updateAsset(assetData);
      fetchAssets(); // Refresh the list after update
      return true;
    } catch (err) {
      console.error('Error updating asset:', err);
      setError('Failed to update asset.');
      return false;
    }
  };

  // Handler for deleting an asset
  const handleDeleteAsset = async (assetId) => {
    try {
      await deleteAsset(assetId);
      fetchAssets(); // Refresh the list after deletion
      return true;
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError('Failed to delete asset.');
      return false;
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    dataAssets,
    isLoading,
    error,
    handleCreateAsset,
    handleUpdateAsset,
    handleDeleteAsset,
  };
};

export default useDataAssets;
