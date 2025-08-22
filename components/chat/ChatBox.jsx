"use client";

import { useEffect, useRef } from "react";
import CardCarousel from "@/components/ui/CardCarousel";

/**
 * ChatBox Component
 * Renders chat history with user + AI messages, including card carousels.
 */
export default function ChatBox({ messages, isLoading }) {
    const messagesEndRef = useRef(null);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="flex-grow overflow-y-auto mb-4 p-4 space-y-6">
            {/* Empty chat state */}
            {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                    Start a new chat...
                </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                    {msg.role === "user" ? (
                        <div className="bg-primary text-primary-foreground rounded-t-2xl rounded-bl-2xl px-4 py-2 max-w-lg shadow-sm text-sm leading-relaxed break-words">
                            {msg.content}
                        </div>
                    ) : (
                        <div className="bg-muted text-foreground rounded-t-2xl rounded-br-2xl px-4 py-2 max-w-2xl shadow-sm text-sm leading-relaxed">
                            {msg.type === "text" && (
                                <p className="prose dark:prose-invert text-sm break-words">
                                    {msg.content}
                                </p>
                            )}
                            {msg.type === "cards" && <CardCarousel cards={msg.cards} />}
                        </div>
                    )}
                </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-muted text-foreground rounded-t-2xl rounded-br-2xl px-4 py-2 max-w-xs shadow-sm">
                        <div className="flex space-x-2">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]" />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
