// components/ui/IconButton.jsx
import React from 'react';
import Button from './Button';

export default function IconButton({ children, ...props }) {
    return (
        <Button
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            {...props}
        >
            {children}
        </Button>
    );
}