'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatPage from '@/components/chat/ChatPage';
import { Badge } from '@/components/ui/badge';

const ChatPanel = () => {
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

    const handleSendMessage = (prompt) => {
        setMessages(prev => [...prev, { role: 'user', content: prompt }]);
        // mock response logic here...
    };

    const handleToggleAgent = (agentName) => {
        setActiveAgents(prev =>
            prev.includes(agentName) ? prev.filter(a => a !== agentName) : [...prev, agentName]
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Card className="h-[80vh] flex flex-col">
                <CardHeader>
                    <h1 className="text-2xl font-bold">AI Chat</h1>
                </CardHeader>

                <CardContent className="flex-1">
                    <Tabs defaultValue="home" className="h-full flex flex-col">
                        <TabsList className="grid grid-cols-2 w-full mb-4">
                            <TabsTrigger value="home">Home</TabsTrigger>
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                        </TabsList>

                        {/* Home Tab */}
                        <TabsContent value="home" className="flex flex-col items-center justify-center flex-1 text-center">
                            <p className="text-muted-foreground mb-6">
                                Choose a question or start chatting with AI agents.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {popularQuestions.map((q, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => handleSendMessage(q.value)}
                                    >
                                        {q.label}
                                    </Badge>
                                ))}
                            </div>
                            <Button
                                onClick={() => document.querySelector('[data-state="active"][value="chat"]')?.click()}
                                className="mt-6"
                            >
                                Start a new chat
                            </Button>
                        </TabsContent>

                        {/* Chat Tab */}
                        <TabsContent value="chat" className="flex flex-col flex-1">
                            <ScrollArea className="flex-1 rounded-md border p-4 mb-4">
                                <ChatPage
                                    onSendMessage={handleSendMessage}
                                    messages={messages}
                                    isLoading={isLoading}
                                    availableAgents={availableAgents}
                                    activeAgents={activeAgents}
                                    onToggleAgent={handleToggleAgent}
                                />
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="text-sm text-muted-foreground">
                    Powered by shadcn/ui + Tailwind
                </CardFooter>
            </Card>
        </div>
    );
};

export default ChatPanel;
