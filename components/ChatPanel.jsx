// components/ChatPanel.jsx
'use client';

import React from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

export default function ChatPanel() {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <div className="flex-grow overflow-y-auto mb-4">
                {/* Chat messages will be rendered here */}
                <p className="text-gray-500">Start a new chat...</p>
            </div>
            <form className="flex space-x-2">
                <Input type="text" placeholder="Type your message..." />
                <Button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                    Send
                </Button>
            </form>
        </div>
    );
}