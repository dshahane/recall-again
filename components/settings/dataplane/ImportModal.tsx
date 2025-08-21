import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
// Import the new components from the Basic library
import { Card, Input, Label, CancelButton, SubmitButton, TagPills, JsonEditor } from '../common/Basic';
import { DataRepository } from '../../types/app';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: DataRepository) => void;
  initialData?: DataRepository | null;
}

// Predefined tags for the pills
const PREDEFINED_TAGS = ['finance', 'marketing', 'sales', 'engineering', 'public', 'private'];

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  // State to manage form data, now initialized with initialData
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'table',
    source: initialData?.source || '',
    owner: initialData?.owner || '',
    tags: initialData?.tags?.join(', ') || '',
    purpose: initialData?.purpose || '',
    configuration: initialData?.configuration ? JSON.stringify(initialData.configuration, null, 2) : '',
  });

  // Reset form data when the modal is opened with new initialData
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        type: initialData?.type || 'table',
        source: initialData?.source || '',
        owner: initialData?.owner || '',
        tags: initialData?.tags?.join(', ') || '',
        purpose: initialData?.purpose || '',
        configuration: initialData?.configuration ? JSON.stringify(initialData.configuration, null, 2) : '',
      });
      // Reset errors and validation state when modal opens
      setErrors({ name: '', type: '', source: '', configuration: '' });
      setIsConfigurationValid(true);
    }
  }, [isOpen, initialData]);

  // State to handle form validation errors
  const [errors, setErrors] = useState({
    name: '',
    type: '',
    source: '',
    configuration: '',
  });

  // State to track if the configuration JSON is valid
  const [isConfigurationValid, setIsConfigurationValid] = useState(true);

  // Update form data on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation for the configuration JSON
    if (name === 'configuration') {
      try {
        JSON.parse(value);
        setIsConfigurationValid(true);
      } catch (e) {
        setIsConfigurationValid(false);
      }
    }
  };

  // Handles adding/removing tags from the predefined pills
  const handleTagClick = (tag: string) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    
    if (currentTags.includes(tag)) {
      const newTags = currentTags.filter(t => t !== tag);
      setFormData({ ...formData, tags: newTags.join(', ') });
    } else {
      const newTags = [...currentTags, tag];
      setFormData({ ...formData, tags: newTags.join(', ') });
    }
  };

  // Handle form submission and validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors = { name: '', type: '', source: '', configuration: '' };
    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = 'Asset Name is required.';
      hasError = true;
    }
    if (!formData.type.trim()) {
      newErrors.type = 'Asset Type is required.';
      hasError = true;
    }
    if (!formData.source.trim()) {
      newErrors.source = 'Source is required.';
      hasError = true;
    }

    if (formData.configuration.trim()) {
      try {
        JSON.parse(formData.configuration);
        newErrors.configuration = '';
      } catch (e) {
        newErrors.configuration = 'Invalid JSON format.';
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    const savedAsset = {
      name: formData.name,
      type: formData.type,
      source: formData.source,
      owner: formData.owner || 'Unknown',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      lastUpdated: new Date().toISOString().split('T')[0],
      description: 'A newly imported data asset without a detailed description.',
      purpose: formData.purpose,
      configuration: JSON.parse(formData.configuration || '{}'),
    };
    
    onSave(savedAsset);
  };

  if (!isOpen) return null;

  const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm">
      <Card className="w-full max-w-lg relative"> {/* Add 'relative' to position the close button */}
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {initialData ? 'Edit Data Asset' : 'Import New Data Asset'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Asset Name Field */}
          <div className="mb-4">
            <Label htmlFor="name">Asset Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., user_profiles_table"
              className={`${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Asset Type Field */}
          <div className="mb-4">
            <Label htmlFor="type">Asset Type <span className="text-red-500">*</span></Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.type ? 'border-red-500' : ''}`}
            >
              <option value="table">Table</option>
              <option value="dashboard">Dashboard</option>
              <option value="dataset">Dataset</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
          </div>

          {/* Source Field */}
          <div className="mb-4">
            <Label htmlFor="source">Source <span className="text-red-500">*</span></Label>
            <Input
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="e.g., BigQuery, S3, PostgreSQL"
              className={`${errors.source ? 'border-red-500' : ''}`}
            />
            {errors.source && <p className="mt-1 text-sm text-red-500">{errors.source}</p>}
          </div>

          {/* Owner Field */}
          <div className="mb-4">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="e.g., Jane Doe"
            />
          </div>

          {/* Purpose Field */}
          <div className="mb-4">
            <Label htmlFor="purpose">Purpose</Label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the purpose of this data asset."
            />
          </div>

          {/* Tags Field with Pill Buttons (using new component) */}
          <div className="mb-4">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., sales, finance, report"
            />
            <TagPills
              predefinedTags={PREDEFINED_TAGS}
              currentTags={currentTags}
              onTagClick={handleTagClick}
            />
          </div>

          {/* Configuration Field with JSON Editor (using new component) */}
          <div className="mb-6">
            <Label htmlFor="configuration">Configuration (JSON)</Label>
            <JsonEditor
              id="configuration"
              name="configuration"
              value={formData.configuration}
              onChange={handleChange}
              placeholder={`{\n  "key": "value"\n}`}
              isValid={isConfigurationValid && !errors.configuration}
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end space-x-3">
            <CancelButton
              type="button"
              onClick={onClose}
            >
              Cancel
            </CancelButton>
            <SubmitButton
              type="submit"
            >
              {initialData ? 'Save Changes' : 'Import'}
            </SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ImportModal;
