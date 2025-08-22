import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { DataRepository } from '@/app/types/app';

interface AssetDetailsProps {
    asset: DataRepository | null;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ asset }) => {
    if (!asset) {
        return (
            <Card className="flex flex-col items-center justify-center w-full min-h-[500px] p-6 text-center">
                <CardContent className="flex flex-col items-center justify-center space-y-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 text-muted-foreground"
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
                    <p className="text-sm text-muted-foreground">
                        Click on an asset from the list on the left to see its metadata and columns.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col w-full min-h-[500px] p-6 space-y-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold">{asset.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Source: {asset.source}</p>
                </div>
                <Badge variant="secondary">{asset.type}</Badge>
            </div>

            {/* Metadata */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Metadata</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                        <span className="font-medium text-foreground">Owner:</span> {asset.owner}
                    </li>
                    <li>
                        <span className="font-medium text-foreground">Last Updated:</span> {asset.lastUpdated}
                    </li>
                    <li>
                        <span className="font-medium text-foreground">Tags:</span>
                        <div className="flex flex-wrap mt-1 gap-2">
                            {asset.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </li>
                    <li>
                        <span className="font-medium text-foreground">Purpose:</span> {asset.purpose || 'N/A'}
                    </li>
                </ul>
            </div>

            {/* Description */}
            {asset.description && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{asset.description}</p>
                </div>
            )}

            {/* Columns */}
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
                                <TableRow key={index} onClick={() => console.log('Clicked:', column.name)}>
                                    <TableCell className="font-medium">{column.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs">
                                            {column.type}
                                        </Badge>
                                    </TableCell>
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
