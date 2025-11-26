import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: "Hi! I'm your AI learning assistant. Ask me anything about Science or Math, and I'll help you understand it better! 🚀"
        }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            text: input
        };

        const aiResponse = {
            id: messages.length + 2,
            type: 'ai',
            text: "I'm a demo AI assistant. In the full version, I would provide detailed explanations, generate practice questions, and help you understand complex topics!"
        };

        setMessages([...messages, userMessage, aiResponse]);
        setInput('');
    };

    const suggestedQuestions = [
        "Explain chemical reactions",
        "Help me with quadratic equations",
        "What is photosynthesis?",
        "Generate a practice quiz"
    ];

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">AI Assistant</h1>
                        <p className="text-slate-600">Your personal learning companion</p>
                    </div>
                </div>
            </motion.div>

            {/* Chat Container */}
            <div className="flex-grow bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'ai'
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}>
                                {message.type === 'ai' ? <Bot size={18} /> : <User size={18} />}
                            </div>
                            <div className={`max-w-[70%] p-4 rounded-2xl ${message.type === 'ai'
                                    ? 'bg-slate-50 text-slate-900'
                                    : 'bg-primary-500 text-white'
                                }`}>
                                <p className="text-sm leading-relaxed">{message.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Suggested Questions */}
                {messages.length === 1 && (
                    <div className="px-6 pb-4">
                        <p className="text-xs text-slate-500 mb-2">Suggested questions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInput(question)}
                                    className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="border-t border-slate-100 p-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything..."
                            className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleSend}
                            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2 font-medium"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
