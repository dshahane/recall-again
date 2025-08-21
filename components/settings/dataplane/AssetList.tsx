import React from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { DataRepository } from '@/app/types/app';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Card from '../../ui/Card';
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

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <Card title={"Data Assets"} description={"List of Data Assets"}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Data Assets</h2>
        <Button onClick={onShowImportModal} className="flex items-center space-x-2">
          <PlusCircle size={16} />
          <span>New Asset</span>
        </Button>
      </div>

      <Input
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search assets..." type={undefined} id={undefined}      />

      <div className="flex-1 overflow-y-auto">
        {filteredAssets.length > 0 ? (
          <ul className="space-y-2">
            {filteredAssets.map(asset => (
              <li
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                  selectedAsset && selectedAsset.id === asset.id
                    ? 'bg-blue-100 border-blue-500 border-l-4'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 border-l-4'
                }`}
              >
                <div>
                  <h3 className="text-sm font-semibold">{asset.name}</h3>
                  <p className="text-xs text-gray-500">{asset.source}</p>
                </div>
                <div className="flex space-x-2">
                  <EditCellButton
                    onClick={(e: { stopPropagation: () => void; }) => {
                      e.stopPropagation();
                      onEditAsset(asset);
                    }}
                    className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                    aria-label={`Edit ${asset.name}`}
                  >
                  </EditCellButton>
                  <DeleteCellButton
                    onClick={(e: { stopPropagation: () => void; }) => {
                      e.stopPropagation();
                      onDeleteAsset(asset);
                    }}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label={`Delete ${asset.name}`}
                  >
                  </DeleteCellButton>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 mt-4">No assets found.</div>
        )}
      </div>
    </Card>
  );
};

export default AssetList;
