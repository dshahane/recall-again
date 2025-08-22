import { useState } from "react";
import ChatBox from "../chat/ChatBox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Pills from "../ui/Pills";
import IconButton from "../ui/IconButton";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../ui/card";

export default function ChatPage({
                                     onSendMessage,
                                     messages,
                                     isLoading,
                                     availableAgents,
                                     activeAgents,
                                     onToggleAgent,
                                 }) {
    const [input, setInput] = useState("");
    const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput("");
        }
    };

    return (
        <Card className="flex flex-col h-full w-full">
            <CardHeader>
                <CardTitle>Chat</CardTitle>
                <CardDescription>
                    Converse with agents and manage active participants.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto rounded-md border border-muted p-2">
                    <ChatBox messages={messages} isLoading={isLoading} />
                </div>

                {/* Agents + Suggested Questions */}
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <IconButton
                            onClick={() => setIsAgentPanelOpen(!isAgentPanelOpen)}
                            className="border border-muted"
                        >
                            <span className="text-xl">👻</span>
                        </IconButton>
                        <p className="text-sm text-muted-foreground">
                            {activeAgents.length > 0
                                ? `Agent(s) active: ${activeAgents.join(", ")}`
                                : "Invite an agent"}
                        </p>
                    </div>
                    {isAgentPanelOpen && (
                        <Pills
                            items={availableAgents.map((agent) => ({
                                label: `${agent.name} ${
                                    activeAgents.includes(agent.name) ? "✓" : ""
                                }`,
                                value: agent.name,
                                icon: agent.icon,
                            }))}
                            onClick={onToggleAgent}
                            type="agent"
                        />
                    )}
                </div>
            </CardContent>

            <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                        Send
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
