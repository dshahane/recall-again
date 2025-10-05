import React from 'react';
import {Search, PlusCircle, Trash2, Edit} from 'lucide-react';
import { DataRepository } from '@/app/types/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components//ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components//ui/card';
import EditCellButton from "@/components/ui/EditCellButton";
import DeleteCellButton from "@/components/ui/DeleteCellButton";

// Define props interface for AssetList component
interface AssetListProps {
  dataAssets: DataRepository[];
  searchQuery: string;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectAsset: (asset: DataRepository) => void;
  onShowImportModal: () => void;
  onEditAsset: (asset: DataRepository) => void;
  onDeleteAsset: (asset: DataRepository) => void;
  selectedAsset?: DataRepository | null;
}

const AssetList: React.FC<AssetListProps> = ({
  dataAssets,
  searchQuery,
  onSearchQueryChange,
  onSelectAsset,
  onShowImportModal,
  onEditAsset,
  onDeleteAsset,
  selectedAsset,
}) => {
  // Filter assets based on the search query
  const filteredAssets = dataAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
      <div className="flex justify-center items-center h-screen bg-gray-900 p-4">
        <Card className="w-full max-w-2xl h-full flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl font-bold">Data Assets</CardTitle>
              <Button onClick={onShowImportModal} className="flex items-center space-x-2">
                <PlusCircle size={16} />
                <span>New Asset</span>
              </Button>
            </div>
            <CardDescription>
              List of your current data assets. Use the search bar to find a specific asset.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 p-6 space-y-4">
            <Input
                value={searchQuery}
                onChange={onSearchQueryChange}
                placeholder="Search assets..."
                className="w-full"
            />

            <div className="flex-1 overflow-y-auto">
              {filteredAssets.length > 0 ? (
                  <ul className="space-y-3">
                    {filteredAssets.map(asset => (
                        <li
                            key={asset.id}
                            onClick={() => onSelectAsset(asset)}
                            className={`
                      flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors border-l-4
                      ${
                                selectedAsset?.id === asset.id
                                    ? 'bg-blue-50 border-blue-600 shadow-sm'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                            }
                    `}
                        >
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">{asset.name}</h3>
                            <p className="text-xs text-gray-500 truncate">{asset.source}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditAsset(asset);
                                }}
                                className="p-1 h-auto w-auto text-gray-400 hover:text-blue-500"
                                aria-label={`Edit ${asset.name}`}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteAsset(asset);
                                }}
                                className="p-1 h-auto w-auto text-gray-400 hover:text-red-500"
                                aria-label={`Delete ${asset.name}`}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </li>
                    ))}
                  </ul>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <p>No assets found.</p>
                    <p>Try a different search or add a new asset.</p>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default AssetList;
