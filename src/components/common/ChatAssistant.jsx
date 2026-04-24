import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_QUESTIONS = [
    "Where is my order?",
    "How to pay with Wallet?",
    "Do you have a Return Policy?",
    "Is shipping free?",
    "How to use UPI?"
];

// Simple rule-based bot logic
const getBotResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('order') || lowerQuery.includes('track')) {
        return "You can track your order in the **'Orders'** page (coming soon). For now, you will receive SMS updates!";
    }
    if (lowerQuery.includes('wallet') || lowerQuery.includes('money')) {
        return "The **Capstone Wallet** is the fastest way to pay! It comes pre-loaded with ₹5,000 for testing.";
    }
    if (lowerQuery.includes('upi') || lowerQuery.includes('qr')) {
        return "You can scan the QR code with any UPI app, or use the **'Link Bank'** feature to pay directly from your account.";
    }
    if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
        return "We offer a **7-day easy return policy** for all products. Money is refunded to your Capstone Wallet instantly.";
    }
    if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery')) {
        return "Standard shipping is **Free** on orders above ₹500. Express delivery (10 mins) is available in select cities.";
    }
    if (lowerQuery.includes('direction') || lowerQuery.includes('map')) {
        return "You can get **Real-Time Directions** to any vendor by clicking the 'Get Directions' button on the Map map popup.";
    }
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return "Hello there! 👋 How can I assist you with your shopping today?";
    }

    return "I'm still learning! You can ask me about Orders, Payments, Returns, or Directions. 🤖";
};

export const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your Capstone Assistant. How can I help you today? 👋", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = async (text) => {
        const query = text || inputText;
        if (!query.trim()) return;

        // Add User Message
        const userMsg = { id: Date.now(), text: query, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI Delay
        setTimeout(() => {
            const botResponse = getBotResponse(query);
            const botMsg = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000 + Math.random() * 500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <div className="fixed bottom-6 left-6 z-[9999]">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-0 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-800"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                            >
                                <Sparkles className="h-6 w-6" />
                            </motion.div>
                            <span className="sr-only">Chat Support</span>
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 left-6 z-[9999] w-[350px] md:w-[380px] h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Capstone Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] opacity-90">Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 h-8 w-8" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-gray-800 border shadow-sm rounded-bl-none'
                                            }`}
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-gray-800 border shadow-sm rounded-2xl rounded-bl-none p-3 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions (Only show if few messages) */}
                        {messages.length < 4 && (
                            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                                {SUGGESTED_QUESTIONS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSendMessage(q)}
                                        className="whitespace-nowrap text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full border transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-gray-900 border-t flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-gray-50 dark:bg-gray-800 border-none focus-visible:ring-1"
                            />
                            <Button
                                onClick={() => handleSendMessage()}
                                size="icon"
                                disabled={!inputText.trim() || isTyping}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
