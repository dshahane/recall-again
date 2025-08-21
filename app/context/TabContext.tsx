'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define the possible tab types
type TabName = 'agents' | 'ingestions' | 'ml-processes' | 'queries';

// 2. Define the shape of the context's value
interface TabContextType {
    activeTab: TabName;
    setActiveTab: (tab: TabName) => void;
}

// 3. Create the context with a default value.
//    Using 'null' and checking in the provider is a common pattern.
const TabContext = createContext<TabContextType | null>(null);

// 4. Define props for the provider component
interface TabProviderProps {
    children: ReactNode;
}

// 5. Create the provider component
export const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
    // You can set a default active tab here
    const [activeTab, setActiveTab] = useState<TabName>('agents');

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    );
};

// 6. Create a custom hook to use the context
export const useTab = () => {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error('useTab must be used within a TabProvider');
    }
    return context;
};