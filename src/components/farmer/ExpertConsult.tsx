import React, { useState } from 'react';
import { MessageSquare, Send, User as UserIcon, Bot, Image as ImageIcon, Paperclip, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Language, translations } from '../../types';
import { getExpertAdvice } from '../../services/geminiService';

interface ExpertConsultProps {
  user: User;
  lang: Language;
}

export default function ExpertConsult({ user, lang }: ExpertConsultProps) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', text: "Hello! I'm your agricultural expert assistant. How can I help you with your farm today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const advice = await getExpertAdvice(input, messages);
      setMessages(prev => [...prev, { role: 'assistant', text: advice }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having trouble connecting to the expert network. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-200px)] flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
                <Bot className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">Agri-Expert AI</h3>
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Always Online</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Verified Expert</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/30">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-white text-emerald-600 border border-stone-100'
                }`}>
                  {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-5 rounded-3xl shadow-sm text-sm font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-stone-700 border border-stone-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-stone-100 shadow-sm flex gap-2">
                <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t border-stone-100">
          <div className="relative group">
            <input
              type="text"
              placeholder="Ask about crop health, fertilizers, or market trends..."
              className="w-full pl-6 pr-32 py-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button type="button" className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Best fertilizer for Rice?", "Pest control for Tomato?", "Current market trends?"].map((suggestion, i) => (
              <button 
                key={i}
                type="button"
                onClick={() => setInput(suggestion)}
                className="px-4 py-2 bg-stone-50 border border-stone-100 rounded-full text-xs font-bold text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
