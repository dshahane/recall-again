import React, { useState, ReactNode } from 'react';
import { Button } from './button';

// Defines the shape of the data for each tab.
interface TabConfig {
  id: string;
  label: string;
  count?: number;
  content: ReactNode;
  createButtonText: string;
  onCreateNew: () => void;
  // Optional for conditional styling
  colorClass?: string;
}

interface TabbedContainerProps {
  tabs: TabConfig[];
  initialActiveTabId?: string;
}

const TabbedContainer: React.FC<TabbedContainerProps> = ({ tabs, initialActiveTabId }) => {
  const [activeTabId, setActiveTabId] = useState<string>(initialActiveTabId || tabs[0]?.id);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  if (!activeTab) {
    return <div className="p-4 text-red-500">Error: Active tab not found.</div>;
  }

  // Determine button color based on active tab's colorClass
  const createButtonColor = activeTab.colorClass || 'bg-indigo-600 hover:bg-indigo-700';

  return (
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
              <button
                  key={tab.id}
                  className={`py-2 px-4 text-lg font-medium ${
                      activeTabId === tab.id
                          ? `border-b-2 ${tab.colorClass ? `border-${tab.colorClass.split('-')[1]}-600 text-${tab.colorClass.split('-')[1]}-600` : 'border-indigo-600 text-indigo-600'}`
                          : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label} {tab.count !== undefined && `(${tab.count})`}
              </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Configured {activeTab.label}</h3>
          <Button
              onClick={activeTab.onCreateNew}
              className={`${createButtonColor} text-white`}
          >
            <i className="fa-solid fa-plus mr-2"></i> {activeTab.createButtonText}
          </Button>
        </div>

        {activeTab.content}
      </div>
  );
};

export default TabbedContainer;