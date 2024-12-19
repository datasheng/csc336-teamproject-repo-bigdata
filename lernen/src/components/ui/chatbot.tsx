'use client'
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, Send, Bot, User, X, Minimize2 } from 'lucide-react';

interface Message {
    type: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatContext {
    recentMessages: string[];
    lastInteractionTime: number;
}

const systemContext = `You are an AI assistant for a learning management system called Lernen.
Your primary functions include:
- Helping students with course-related queries
- Providing study tips and learning strategies
- Explaining concepts from their courses
- Assisting with technical issues on the platform
- Offering academic guidance

Important: Always consider the user's recent messages for context. If they've shared preferences or information,
reference these in your responses to make the conversation more personal and contextual.

Before responding, review their last 3 messages (if available) to maintain conversation continuity.
Keep responses concise, friendly, and focused on education. If you don't have specific information
about a course or professor, you can provide general academic advice instead.`;

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatContext, setChatContext] = useState<ChatContext>({
        recentMessages: [],
        lastInteractionTime: Date.now()
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    // Update context whenever messages change
    useEffect(() => {
        const userMessages = messages
            .filter(msg => msg.type === 'user')
            .map(msg => msg.content)
            .slice(-3);  // Get last 3 messages

        setChatContext({
            recentMessages: userMessages,
            lastInteractionTime: Date.now()
        });
    }, [messages]);

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            type: 'user',
            content: inputMessage,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Build context-aware prompt
            let contextPrompt = systemContext;
            if (chatContext.recentMessages.length > 0) {
                contextPrompt += "\n\nRecent user messages for context:\n" +
                    chatContext.recentMessages.map((msg, i) => `${i + 1}. ${msg}`).join('\n') +
                    "\n\nNew message: " + inputMessage;
            } else {
                contextPrompt += "\n\nNew message: " + inputMessage;
            }

            const result = await model.generateContent(contextPrompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, {
                type: 'assistant',
                content: text,
                timestamp: Date.now()
            }]);
        } catch (error) {
            console.error('Error calling Gemini:', error);
            setMessages(prev => [...prev, {
                type: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const resetChat = () => {
        setIsOpen(false);
        setMessages([]);
        setChatContext({
            recentMessages: [],
            lastInteractionTime: Date.now()
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="flex flex-col w-[450px] h-[600px] bg-gray/80 backdrop-blur-md border border-gray-800 rounded-lg shadow-lg animate-in slide-in-from-bottom-3">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-blue-400" />
                            <span className="font-semibold text-blue-400">AI Assistant</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <Minimize2 className="h-4 w-4 text-gray-400" />
                            </button>
                            <button
                                onClick={resetChat}
                                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesEndRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-lg ${message.type === 'user'
                                        ? 'bg-blue-500/10 border border-blue-500/20'
                                        : 'bg-gray-800/50 border border-gray-700'
                                        }`}
                                >
                                    <p className="text-sm text-white">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center space-x-2 bg-gray-800/50 w-fit px-4 py-2 rounded-lg">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 bg-gray border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Type your message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-4 bg-blue-500 text-black rounded-full hover:bg-blue-400 transition-colors shadow-lg hover:scale-110 transform duration-200"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}
        </div>
    );
};

export default Chatbot;