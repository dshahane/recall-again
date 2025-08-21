// components/ui/SidebarButton.jsx
import React from 'react';
import Button from './Button';

export default function SidebarButton({ active, isCollapsed, children, ...props }) {
    return (
        <Button
            variant = 'outline'
            className={`
                flex items-center rounded-lg font-medium transition-colors p-3
                ${isCollapsed ? 'justify-center' : ''}
                ${
                active
                    ? 'bg-blue-400 text-black dark:bg-blue-600'
                    : 'text-gray-800 dark:text-gray-600'
            }
            `}
            {...props}
        >
            {children}
        </Button>
    );
}