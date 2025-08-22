'use client'

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DataRepository } from '@/app/types/app';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: DataRepository) => void;
  initialData?: DataRepository | null;
}

// Predefined tags
const PREDEFINED_TAGS = ['finance', 'marketing', 'sales', 'engineering', 'public', 'private'];

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'table',
    source: initialData?.source || '',
    owner: initialData?.owner || '',
    tags: initialData?.tags?.join(', ') || '',
    purpose: initialData?.purpose || '',
    configuration: initialData?.configuration ? JSON.stringify(initialData.configuration, null, 2) : '',
  });

  const [errors, setErrors] = useState({
    name: '',
    type: '',
    source: '',
    configuration: '',
  });

  const [isConfigurationValid, setIsConfigurationValid] = useState(true);

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
      setErrors({ name: '', type: '', source: '', configuration: '' });
      setIsConfigurationValid(true);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'configuration') {
      try {
        JSON.parse(value);
        setIsConfigurationValid(true);
      } catch {
        setIsConfigurationValid(false);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (currentTags.includes(tag)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tag).join(', ') });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tag].join(', ') });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors = { name: '', type: '', source: '', configuration: '' };
    let hasError = false;

    if (!formData.name.trim()) { newErrors.name = 'Asset Name is required.'; hasError = true; }
    if (!formData.type.trim()) { newErrors.type = 'Asset Type is required.'; hasError = true; }
    if (!formData.source.trim()) { newErrors.source = 'Source is required.'; hasError = true; }

    if (formData.configuration.trim()) {
      try { JSON.parse(formData.configuration); }
      catch { newErrors.configuration = 'Invalid JSON format.'; hasError = true; }
    }

    setErrors(newErrors);
    if (hasError) return;

    const savedAsset: DataRepository = {
      name: formData.name,
      type: formData.type,
      source: formData.source,
      owner: formData.owner || 'Unknown',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      lastUpdated: new Date().toISOString().split('T')[0],
      description: 'A newly imported data asset without a detailed description.',
      purpose: formData.purpose,
      configuration: JSON.parse(formData.configuration || '{}'),
      id: '1010'
    };

    onSave(savedAsset);
  };

  if (!isOpen) return null;

  const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm">
        <Card className="w-full max-w-lg relative">
          {/* Close Button */}
          <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors"
          >
            <X size={20} />
          </button>

          <CardHeader>
            <CardTitle>{initialData ? 'Edit Data Asset' : 'Import New Data Asset'}</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Asset Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="type">Asset Type <span className="text-red-500">*</span></Label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.type ? 'border-red-500' : ''}`}
                >
                  <option value="table">Table</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="dataset">Dataset</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              {/* Source */}
              <div>
                <Label htmlFor="source">Source <span className="text-red-500">*</span></Label>
                <Input id="source" name="source" value={formData.source} onChange={handleChange} />
                {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source}</p>}
              </div>

              {/* Owner */}
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" name="owner" value={formData.owner} onChange={handleChange} />
              </div>

              {/* Purpose */}
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea id="purpose" name="purpose" rows={2} value={formData.purpose} onChange={handleChange} />
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {PREDEFINED_TAGS.map(tag => (
                      <Badge
                          key={tag}
                          variant={currentTags.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </Badge>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div>
                <Label htmlFor="configuration">Configuration (JSON)</Label>
                <Textarea
                    id="configuration"
                    name="configuration"
                    rows={6}
                    value={formData.configuration}
                    onChange={handleChange}
                    className={`${!isConfigurationValid || errors.configuration ? 'border-red-500' : ''}`}
                    placeholder={`{\n  "key": "value"\n}`}
                />
                {!isConfigurationValid && <p className="text-red-500 text-sm mt-1">Invalid JSON</p>}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{initialData ? 'Save Changes' : 'Import'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
};

export default ImportModal;
