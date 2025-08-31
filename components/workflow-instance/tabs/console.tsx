'use client';

import React, { useState, useRef, useEffect } from 'react';

/**
 * Renders a basic, interactive JavaScript console.
 */
export function ConsoleTab() {
    const [history, setHistory] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const historyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (command: string) => {
        if (!command.trim()) return;

        let output = '';
        let isError = false;

        try {
            // Use a function to wrap eval for proper scope and to prevent direct access to this component's state.
            // We are using `eval` for a simple in-browser console demonstration.
            const result = new Function(`return ${command}`)();
            output = `=> ${JSON.stringify(result, null, 2)}`;
        } catch (e: any) {
            output = `Error: ${e.message}`;
            isError = true;
        }

        setHistory((prevHistory) => [
            ...prevHistory,
            `> ${command}`,
            output,
        ]);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommand(inputValue);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-200 rounded-md font-mono text-sm p-2">
            <div ref={historyRef} className="flex-1 overflow-y-auto p-2">
                {history.map((line, index) => (
                    <div key={index} className={line.startsWith('Error:') ? 'text-red-400' : ''}>
                        {line}
                    </div>
                ))}
            </div>
            <div className="flex mt-2 p-2 border-t border-gray-700">
                <span className="text-green-400 mr-2">&gt;</span>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-gray-200"
                    autoFocus
                />
            </div>
        </div>
    );
}
