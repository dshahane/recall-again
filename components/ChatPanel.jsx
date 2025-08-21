'use client';

import React, { useState, useEffect, useRef } from 'react';
import {useTab} from "@/app/context/TabContext";
import AgentsPage from './agents/AgentsPage';
import Button from '../components/ui/Button';
import Pills from '../components/ui/Pills';
import ChatPage from '../components/chat/ChatPage';

const ChatPanel = () => {
    const [view, setView] = useState('home');
    const [messages, setMessages] = useState([]);
    const [activeAgents, setActiveAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const availableAgents = [
        { name: 'Academic', icon: '🎓' },
        { name: 'Code', icon: '💻' },
        { name: 'Writer', icon: '✍️' },
        { name: 'Creative', icon: '🎨' },
    ];

    const popularQuestions = [
        { label: 'What is a neural network?', value: 'What is a neural network?' },
        { label: 'How does photosynthesis work?', value: 'How does photosynthesis work?' },
        { label: 'Write a python function to sort an array.', value: 'Write a python function to sort an array.' },
        { label: 'Summarize the plot of Dune.', value: 'Summarize the plot of Dune.' },
    ];

    // Dummy API call to simulate AI response
    const generateResponse = async (prompt, agents) => {
        setIsLoading(true);
        // Using a mock delay to simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const chatHistory = [{
                role: "user",
                parts: [{ text: `User prompt: ${prompt}. Active agents: ${agents.join(', ')}. Generate a response.` }]
            }];

            const payload = { contents: chatHistory };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            // Mock logic to return a carousel for specific prompts or agents
            if (prompt.toLowerCase().includes('recommend') || agents.includes('Creative')) {
                // Simulate a structured, card-based response
                const structuredPayload = {
                    ...payload,
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    "title": { "type": "STRING" },
                                    "content": { "type": "STRING" },
                                    "url": { "type": "STRING" }
                                }
                            }
                        }
                    }
                };
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(structuredPayload)
                });
                const result = await response.json();
                const jsonContent = result?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (jsonContent) {
                    const cards = JSON.parse(jsonContent);
                    setMessages(prev => [
                        ...prev,
                        { role: 'model', type: 'cards', cards: cards }
                    ]);
                } else {
                    setMessages(prev => [
                        ...prev,
                        { role: 'model', type: 'text', content: 'Sorry, I could not generate a structured response.' }
                    ]);
                }
            } else {
                // Simulate a regular text response
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    setMessages(prev => [
                        ...prev,
                        { role: 'model', type: 'text', content: text }
                    ]);
                } else {
                    setMessages(prev => [
                        ...prev,
                        { role: 'model', type: 'text', content: 'Sorry, an error occurred while generating the response.' }
                    ]);
                }
            }
        } catch (error) {
            console.error('Error generating response:', error);
            setMessages(prev => [
                ...prev,
                { role: 'model', type: 'text', content: 'An unexpected error occurred. Please try again.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (prompt) => {
        setMessages(prev => [...prev, { role: 'user', content: prompt }]);
        generateResponse(prompt, activeAgents);
    };

    const handleToggleAgent = (agentName) => {
        setActiveAgents(prev => {
            if (prev.includes(agentName)) {
                return prev.filter(a => a !== agentName);
            } else {
                return [...prev, agentName];
            }
        });
    };

    const handleSelectQuestion = (question) => {
        handleSendMessage(question);
    };

    // The router logic using a simple state variable
    const renderView = () => {
        switch (view) {
            case 'home':
                return (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                            Ask anything!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-lg">
                            Get started with one of these popular questions or start a new chat below.
                        </p>
                        <Pills
                            items={popularQuestions}
                            onClick={handleSelectQuestion}
                            type="question"
                        />
                        <Button
                            onClick={() => setView('chat')}
                            className="bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors mt-4"
                        >
                            Start a new chat
                        </Button>
                    </div>
                );
            case 'chat':
                return (
                    <ChatPage
                        onSendMessage={handleSendMessage}
                        messages={messages}
                        isLoading={isLoading}
                        availableAgents={availableAgents}
                        activeAgents={activeAgents}
                        onToggleAgent={handleToggleAgent}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="font-sans antialiased text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen flex items-center justify-center p-4">
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
            <div className="w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-950 rounded-lg shadow-xl">
                {renderView()}
            </div>
        </div>
    );
};

export default ChatPanel;