'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkflowEditorProps {
  onBack: () => void;
}

/**
 * A placeholder component for the workflow editor.
 * It will contain a visual editor for creating and modifying workflows.
 */
const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 text-gray-800 h-screen">
      <div className="bg-white p-10 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Workflow Editor</h2>
        <p className="text-gray-600 mb-6">
          A visual editor for building your workflow will be built here.
          For now, this is a placeholder to show the dynamic routing.
        </p>
        <Button onClick={onBack} className="flex items-center mx-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back
        </Button>
      </div>
    </div>
  );
};

export default WorkflowEditor;
