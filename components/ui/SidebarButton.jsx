// components/ui/SidebarButton.jsx
import React from 'react';
import Button from './Button';

export default function SidebarButton({ active, isCollapsed, children, ...props }) {
    return (
        <Button
            className={`
                flex items-center rounded-lg font-medium transition-colors p-3
                ${isCollapsed ? 'justify-center' : ''}
                ${
                active
                    ? 'bg-blue-600 text-white dark:bg-blue-700'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
            }
            `}
            {...props}
        >
            {children}
        </Button>
    );
}