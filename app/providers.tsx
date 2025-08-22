// app/providers.jsx
'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { TabProvider } from './context/TabContext';

// @ts-ignore
export default function Providers({ children }) {
    const [theme, setTheme] = useState('light');
    const [isCollapsed, setIsCollapsed] = useState(false); // Make sure this line is present and correct

    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark bg-gray-950 text-white' : 'bg-gray-100 text-gray-900';
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <TabProvider>
            <div className="flex min-h-screen font-sans antialiased">
                <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed} // Make sure this prop is being passed down
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
                <div className="flex-grow p-6 sm:p-8">
                    <main className="max-w-4xl mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </TabProvider>
    );
}

