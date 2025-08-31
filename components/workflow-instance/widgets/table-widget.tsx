import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableWidgetProps {
    data: {
        headers: string[];
        rows: string[][];
    };
}

export const TableWidget: React.FC<TableWidgetProps> = ({ data }) => {
    if (!data || !data.headers || !data.rows) {
        return <div className="p-4 text-gray-500">No table data available.</div>;
    }

    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    {data.headers.map((header, index) => (
                        <TableHead key={index} className="bg-gray-100 font-semibold">{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};