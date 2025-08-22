import React, { useState, useEffect } from 'react';
import { DataIngestionProps, IngestionProcess } from '@/app/types/app';

const DataIngestion: React.FC<DataIngestionProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [path, setPath] = useState('');
  const [type, setType] = useState('');

  // Effect to populate form fields when editing an existing item, or reset for new item
  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPath(initialData.path);
      setType(initialData.type);
    } else if (isOpen && !initialData) {
      // Reset form when opening for new creation
      setName('');
      setDescription('');
      setPath('');
      setType('');
    }
  }, [isOpen, initialData]); // Re-run when modal opens or initialData changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (name && path && type) {
      const newIngestion: IngestionProcess = {
        id: initialData?.id || Date.now().toString(), // Use existing ID if editing, otherwise generate new unique ID
        name,
        description,
        path,
        type,
      };
      onSave(newIngestion); // Call the onSave prop with the new/updated ingestion data
      onClose(); // Close the modal after successful submission
    } else {
      // In a real application, you'd display a user-friendly error message in the UI
      console.error('Please fill in all required fields: Name, Path, Type.');
    }
  };

  // If the modal is not open, render nothing
  if (!isOpen) return null;

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal content area */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative">
        {/* Modal Header and Close Button */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {initialData ? 'Edit Data Ingestion' : 'Configure New Data Ingestion'}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close modal"
        >
          <i className="fa-solid fa-times text-gray-600 text-xl"></i>
        </button>

        {/* Ingestion Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ingestion-name" className="block text-gray-700 text-sm font-bold mb-2">
              Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ingestion-name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-sm"
              placeholder="e.g., 'Product Catalog Sync'"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="ingestion-description" className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              id="ingestion-description"
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-sm resize-y"
              placeholder="Briefly describe the purpose of this ingestion."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label htmlFor="ingestion-path" className="block text-gray-700 text-sm font-bold mb-2">
              Path (File or URL): <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ingestion-path"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-sm"
              placeholder="e.g., 'https://example.com/data.json' or 'products.csv'"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="ingestion-type" className="block text-gray-700 text-sm font-bold mb-2">
              Type: <span className="text-red-500">*</span>
            </label>
            <select
              id="ingestion-type"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-sm bg-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="Catalog">Catalog</option>
              <option value="Review">Review</option>
              <option value="Sales">Sales</option>
              <option value="CustomerData">Customer Data</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <i className="fa-solid fa-save mr-2"></i> {initialData ? 'Save Changes' : 'Configure Ingestion'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataIngestion;
