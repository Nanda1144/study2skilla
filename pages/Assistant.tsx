import React, { useState, useRef, useEffect } from 'react';
import { chatWithMentor } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Sparkles } from 'lucide-react';

const Assistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: '1',
        role: 'model',
        text: 'Hello! I am your AI Career Mentor. I can help you find resources, choose a domain, or understand what companies are looking for. How can I help you today?',
        timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: input,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        // Format history for Gemini API
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const result = await chatWithMentor(history, userMsg.text);
        
        let fullResponse = "";
        const botMsgId = (Date.now() + 1).toString();
        
        // Optimistically add bot message
        setMessages(prev => [...prev, {
            id: botMsgId,
            role: 'model',
            text: '',
            timestamp: new Date()
        }]);

        for await (const chunk of result) {
            const chunkText = chunk.text || ""; 
            fullResponse += chunkText;
            setMessages(prev => prev.map(msg => 
                msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
            ));
        }

    } catch (error) {
        console.error("Chat error", error);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: "I'm having trouble connecting to the career database right now. Please try again.",
            timestamp: new Date()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
             <Sparkles size={20} className="text-white" />
        </div>
        <div>
            <h3 className="font-bold text-white">AI Career Mentor</h3>
            <p className="text-xs text-slate-400">Always online • Specialized in Engineering</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500 ml-2' : 'bg-slate-700 mr-2'}`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            </div>
        ))}
        {isLoading && messages[messages.length - 1].role === 'user' && (
             <div className="flex justify-start">
                 <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 ml-10">
                     <div className="flex space-x-1">
                         <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                         <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                         <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                     </div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about roadmaps, companies, or skills..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500 text-white resize-none h-14"
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 disabled:opacity-50 disabled:bg-transparent disabled:text-slate-600 transition"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;