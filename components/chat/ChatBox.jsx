import {useEffect, useRef} from "react";
import CardCarousel from "@/components/ui/CardCarousel";

/**
 * Displays the chat history, including user messages and AI responses (text or card carousel).
 * @param {Array<Object>} messages - The array of message objects.
 * @param {boolean} isLoading - A boolean to show a loading indicator.
 */
export default function ChatBox({ messages, isLoading }) {
    const messagesEndRef = useRef(null);

    // Scroll to the bottom of the chat when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="flex-grow overflow-y-auto mb-4 p-4 space-y-6">
            {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">Start a new chat...</div>
            )}
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    {msg.role === 'user' ? (
                        <div className="bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl p-3 max-w-lg shadow-md break-words">
                            {msg.content}
                        </div>
                    ) : (
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-t-2xl rounded-br-2xl p-3 max-w-2xl shadow-md">
                            {msg.type === 'text' && (
                                <p className="prose dark:prose-invert leading-relaxed break-words">{msg.content}</p>
                            )}
                            {msg.type === 'cards' && (
                                <CardCarousel cards={msg.cards} />
                            )}
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-t-2xl rounded-br-2xl p-3 max-w-lg shadow-md">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};