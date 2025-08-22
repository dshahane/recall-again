'use client';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import {TabProvider} from "@/app/context/TabContext";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

// @ts-ignore
export default function RootLayout({ children }) {
    const [ isCollapsed, setIsCollapsed ] = useState( false);
    const [ theme, toggleTheme ] = useState( null);

    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TabProvider>
                <div className="flex min-h-screen font-sans antialiased">
                    {/*
                    <Sidebar
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed} // Make sure this prop is being passed down
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />*/}
                    <div className="flex-grow p-6 sm:p-8">
                        <main className="max-w-4xl mx-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </TabProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}

