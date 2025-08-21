// components/ui/IconButton.jsx
import React from 'react';
import SidebarButton from "@/components/ui/SidebarButton";

export default function IconButton({ children, ...props }) {
    return (
        <SidebarButton
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            {...props}
        >
            {children}
        </SidebarButton>
    );
}