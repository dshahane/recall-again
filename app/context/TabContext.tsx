'use client';

import { createContext, useContext, useState } from 'react';

// @ts-ignore
const TabContext = createContext();

// @ts-ignore
export const TabProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('agents');

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    );
};

export const useTab = () => useContext(TabContext);