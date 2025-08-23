'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowUp, User, Bot, Circle, MessageSquareText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * A mock component for a card carousel to display AI-generated cards.
 * @param cards An array of card data to display.
 */
const CardCarousel = ({ cards }) => {
    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-md p-4 mt-2">
            <div className="flex w-max space-x-4">
                {cards?.map((card, index) => (
                    <Card key={index} className="inline-block w-[200px] overflow-hidden">
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-sm font-bold truncate">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <CardDescription className="line-clamp-3 text-xs">{card.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

/**
 * A mock component to display pill-shaped buttons for agent selection.
 * @param items The list of agent data.
 * @param onClick The handler for when an agent is clicked.
 * @param type The type of pills (e.g., 'agent').
 */
const Pills = ({ items, onClick, type }) => (
    <div className="flex flex-wrap gap-2 py-2">
        {items.map((item, index) => (
            <Button
                key={index}
                variant="outline"
                className={cn(
                    "rounded-full h-8 px-4",
                    item.selected && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => onClick(item.value)}
            >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
            </Button>
        ))}
    </div>
);

/**
 * The main chat app component.
 * This component handles all state, logic, and rendering for the chat interface,
 * including the home screen, agent selection, and chat messages.
 */
export default function ChatAppNew() {
    const [messages, setMessages] = useState([]);
    const [activeAgents, setActiveAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

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

    // Auto-scroll when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = (prompt) => {
        if (!prompt) return;

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: prompt }]);
        setIsLoading(true);

        // Simulate AI response after a delay
        setTimeout(() => {
            let botResponse = 'Hello! How can I assist you today?';
            let responseType = 'text';

            if (activeAgents.includes('Academic')) {
                botResponse = `Thinking from an academic perspective: ${prompt}.`;
            } else if (activeAgents.includes('Code')) {
                botResponse = `\`\`\`javascript\nconsole.log('Code response for: ${prompt}');\n\`\`\``;
            } else if (activeAgents.includes('Writer')) {
                botResponse = `A creative writing response to: "${prompt}". Let's explore this idea together.`;
            } else if (activeAgents.includes('Creative')) {
                botResponse = `Let's get creative! I've generated a few ideas for you.`;
                responseType = 'cards';
            } else {
                botResponse = `This is a standard response for: "${prompt}".`;
            }

            if (responseType === 'cards') {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    type: 'cards',
                    cards: [
                        { title: 'Idea 1', description: 'A fun and engaging concept.' },
                        { title: 'Idea 2', description: 'A more serious, thought-provoking idea.' },
                        { title: 'Idea 3', description: 'An unusual, out-of-the-box concept.' }
                    ]
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', type: 'text', content: botResponse }]);
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleToggleAgent = (agentName) => {
        setActiveAgents(prev =>
            prev.includes(agentName) ? prev.filter(a => a !== agentName) : [...prev, agentName]
        );
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            handleSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 h-[80vh] flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
                <h1 className="text-2xl font-bold">AI Chat</h1>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col pt-2">
                <Tabs defaultValue="home" className="h-full flex flex-col">
                    <TabsList className="grid grid-cols-2 w-full mb-4 h-8">
                        <TabsTrigger value="home" className="text-sm">Home</TabsTrigger>
                        <TabsTrigger value="chat" className="text-sm">Chat</TabsTrigger>
                    </TabsList>

                    {/* Home Tab */}
                    <TabsContent value="home" className="flex flex-col items-center justify-center flex-1 text-center h-full">
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <p className="text-muted-foreground mb-6">
                                Choose a question or start chatting with AI agents.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {popularQuestions.map((q, i) => (
                                    <Badge
                                        key={i}
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                                        onClick={() => {
                                            handleSendMessage(q.value);
                                            // Switch to chat tab
                                            document.querySelector('[data-state="active"][value="chat"]')
                                                ?.click();
                                        }}
                                    >
                                        {q.label}
                                    </Badge>
                                ))}
                            </div>
                            <Button
                                onClick={() => document.querySelector('[data-state="active"][value="chat"]')?.click()}
                                className="mt-6"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Start a new chat
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Chat Tab */}
                    <TabsContent value="chat" className="flex flex-col flex-1 h-full">
                        <Card className="flex flex-col h-full w-full">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle>Chat</CardTitle>
                                <CardDescription>
                                    Converse with agents and manage active participants.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col overflow-hidden p-4 pt-0">
                                <div className="flex-1 overflow-y-auto rounded-md border p-4 mb-4">
                                    {/* ChatBox Component */}
                                    <div className="flex-grow overflow-y-auto p-4 space-y-6">
                                        {messages.length === 0 ? (
                                            <div className="text-center text-sm text-muted-foreground py-10">
                                                Start a new chat...
                                            </div>
                                        ) : (
                                            messages.map((msg, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div className={cn(
                                                        "rounded-t-2xl px-4 py-2 max-w-lg shadow-sm text-sm leading-relaxed break-words",
                                                        msg.role === "user" ? "bg-primary text-primary-foreground rounded-bl-2xl" : "bg-muted text-foreground rounded-br-2xl"
                                                    )}>
                                                        {msg.type === "text" && <p className="prose dark:prose-invert text-sm break-words">{msg.content}</p>}
                                                        {msg.type === "cards" && <CardCarousel cards={msg.cards} />}
                                                    </div>
                                                </div>
                                            ))
                                        )}

                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-muted text-foreground rounded-t-2xl rounded-br-2xl px-4 py-2 max-w-xs shadow-sm">
                                                    <div className="flex space-x-2">
                                                        <Circle className="w-2 h-2 text-gray-500 rounded-full animate-bounce [animation-delay:0s]" fill="currentColor" />
                                                        <Circle className="w-2 h-2 text-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" fill="currentColor" />
                                                        <Circle className="w-2 h-2 text-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" fill="currentColor" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Agents + Suggested Questions */}
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="border border-muted"
                                            onClick={() => setIsAgentPanelOpen(!isAgentPanelOpen)}
                                        >
                                            <MessageSquareText className="h-4 w-4" />
                                        </Button>
                                        <p className="text-sm text-muted-foreground">
                                            {activeAgents.length > 0
                                                ? `Agent(s) active: ${activeAgents.join(", ")}`
                                                : "Invite an agent"}
                                        </p>
                                    </div>
                                    {isAgentPanelOpen && (
                                        <Pills
                                            items={availableAgents.map((agent) => ({
                                                label: `${agent.name}`,
                                                value: agent.name,
                                                icon: agent.icon,
                                                selected: activeAgents.includes(agent.name)
                                            }))}
                                            onClick={handleToggleAgent}
                                            type="agent"
                                        />
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex w-full space-x-2 p-4 pt-0">
                                <form onSubmit={handleFormSubmit} className="flex w-full space-x-2">
                                    <Input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <Button type="submit" disabled={isLoading} size="icon">
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </div>
    );
}
