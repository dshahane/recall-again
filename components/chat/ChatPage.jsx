import {useState} from "react";
import ChatBox from "../chat/ChatBox";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Pills from "../ui/Pills";
import IconButton from "../ui/IconButton";

export default function ChatPage({ onSendMessage, messages, isLoading, availableAgents, activeAgents, onToggleAgent }) {
    const [input, setInput] = useState('');
    const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Chat</h2>
            <ChatBox messages={messages} isLoading={isLoading} />

            {/* Agent and Suggested Questions Section */}
            <div className="py-2">
                <div className="flex items-center space-x-2 mb-4">
                    <IconButton
                        onClick={() => setIsAgentPanelOpen(!isAgentPanelOpen)}
                        className="border border-gray-300 dark:border-gray-700"
                    >
                        <span className="text-gray-600 dark:text-gray-400 text-xl">&#x1F47B;</span>
                    </IconButton>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {activeAgents.length > 0 ? `Agent(s) active: ${activeAgents.join(', ')}` : 'Invite an agent'}
                    </p>
                </div>
                {isAgentPanelOpen && (
                    <Pills
                        items={availableAgents.map(agent => ({
                            label: `${agent.name} ${activeAgents.includes(agent.name) ? '✓' : ''}`,
                            value: agent.name,
                            icon: agent.icon
                        }))}
                        onClick={onToggleAgent}
                        type="agent"
                    />
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex space-x-2 w-full">
                <Input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <Button type="submit" className="bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors" disabled={isLoading}>
                    Send
                </Button>
            </form>
        </div>
    );
};