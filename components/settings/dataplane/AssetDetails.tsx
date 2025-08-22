import React from 'react';
import { Card } from '@/components/ui/card';
import { DataRepository } from '@/app/types/app';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../common/Basic'; // Correctly importing from the 'Basic' components

interface AssetDetailsProps {
  asset: DataRepository | null;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ asset }) => {
  // Render a placeholder when no asset is selected
  if (!asset) {
    return (
      <Card className="flex flex-col items-center justify-center w-full min-h-[500px] p-6 text-center text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 mb-4 text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
        </svg>
        <h3 className="text-xl font-semibold">Select an Asset to View Details</h3>
        <p className="mt-2">Click on an asset from the list on the left to see its metadata and columns.</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full min-h-[500px] p-6 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{asset.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Source: {asset.source}</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {asset.type}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Metadata</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li><strong className="text-gray-800">Owner:</strong> {asset.owner}</li>
          <li><strong className="text-gray-800">Last Updated:</strong> {asset.lastUpdated}</li>
          <li>
            <strong className="text-gray-800">Tags:</strong>
            <div className="flex flex-wrap mt-1">
              {asset.tags.map((tag, index) => (
                <span
                  key={index}
                  className="mr-2 mb-2 px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </li>
          <li><strong className="text-gray-800">Purpose:</strong> {asset.purpose || 'N/A'}</li>
        </ul>
      </div>

      {asset.description && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{asset.description}</p>
        </div>
      )}

      {/* Conditionally render Columns section only if asset.columns is a valid array */}
      {Array.isArray(asset.columns) && asset.columns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Columns</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asset.columns.map((column, index) => (
                <TableRow 
                  key={index} 
                  // Add an onClick handler to the table row
                  onClick={() => console.log('Clicked on column:', column.name)}
                >
                  <TableCell className="font-medium">{column.name}</TableCell>
                  <TableCell>{column.type}</TableCell>
                  <TableCell>{column.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default AssetDetails;
