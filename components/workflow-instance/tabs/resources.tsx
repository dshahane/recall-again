'use client';

import React, { useState, DragEvent } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, FileTextIcon, ImageIcon, XIcon } from "lucide-react";

interface FileEntry {
    id: number;
    name: string;
    type: string;
    url: string;
}

/**
 * Renders the Resources tab for managing files.
 */
export function ResourcesTab() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const newFiles = Array.from(e.dataTransfer.files).map((file, index) => ({
            id: files.length + index,
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
        }));
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map((file, index) => ({
                id: files.length + index,
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file),
            }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const removeFile = (fileId: number) => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
        if (selectedFile && selectedFile.id === fileId) {
            setSelectedFile(null);
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) {
            return <ImageIcon className="text-blue-500" />;
        }
        if (fileType.startsWith('text/') || fileType.includes('json')) {
            return <FileTextIcon className="text-green-500" />;
        }
        return <FileIcon className="text-gray-500" />;
    };

    const renderFileViewer = () => {
        if (!selectedFile) {
            return (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Select a file from the list to view its content.</p>
                </div>
            );
        }

        if (selectedFile.type.startsWith('image/')) {
            return (
                <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    className="max-w-full max-h-full object-contain"
                />
            );
        }

        // For text-based files, read content and display
        return (
            <div className="p-4 bg-gray-100 rounded-md overflow-y-auto">
                <h4 className="text-lg font-bold mb-2">{selectedFile.name}</h4>
                <p className="text-sm font-mono whitespace-pre-wrap">
                    {`File content will be displayed here for text, JSON, and other text-based files.`}
                </p>
            </div>
        );
    };

    return (
        <div className="flex h-full p-4 space-x-4 bg-white rounded-md">
            <div className="w-1/3 flex flex-col space-y-4">
                {/* File Drop/Choose Area */}
                <div
                    className={`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors
            ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          `}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <p className="text-gray-500 text-sm mb-2">Drag & drop files here</p>
                    <p className="text-gray-500 text-sm mb-2">or</p>
                    <Button variant="outline" asChild>
                        <label>
                            Choose a file
                            <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                        </label>
                    </Button>
                </div>

                {/* File List */}
                <h4 className="font-bold text-gray-800">Added Files</h4>
                <ScrollArea className="flex-1 border border-gray-200 rounded-md">
                    <ul className="space-y-2 p-2">
                        {files.map(file => (
                            <li
                                key={file.id}
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                  ${selectedFile?.id === file.id ? 'bg-blue-100' : 'hover:bg-gray-100'}
                `}
                                onClick={() => setSelectedFile(file)}
                            >
                                <div className="flex items-center space-x-2 truncate">
                                    {getFileIcon(file.type)}
                                    <span className="truncate text-sm">{file.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}>
                                    <XIcon className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>

            {/* File Viewer */}
            <div className="w-2/3 border border-gray-200 rounded-lg flex items-center justify-center p-4 bg-gray-50">
                {renderFileViewer()}
            </div>
        </div>
    );
}
