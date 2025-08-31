'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';

interface ChatWidgetProps {
  data: any;
}

/**
 * Renders a chat interface widget.
 */
export function ChatWidget({ data }: ChatWidgetProps) {
  const [messages, setMessages] = useState<any[]>(data.messages);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { type: 'user', text: input }]);
      setInput('Hello Sir!');
      // TODO: Simulate a response from the API
    }
  };

  return (
    <Card className="w-full p-4 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Chat Interface</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] flex flex-col justify-end">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((msg: any, index: number) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-2 rounded-lg ${
                    msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex mt-4 p-0">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} className="ml-2">
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
