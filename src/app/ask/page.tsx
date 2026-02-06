'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';

export default function AskPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hello! I am your EcoGenAI Analyst. Ask me anything about your project metrics or carbon footprint.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg }),
      });
      const json = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: json.reply }]);
    } catch (error) {
       console.error(error);
       setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error retrieving that information.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col max-w-5xl mx-auto relative">
      {/* Page Header */}
      <div className="mb-8 mt-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl font-bold text-eco-green mb-2">Project RAG Chat</h1>
        <p className="text-gray-400 flex items-center gap-2">
           <Bot size={16} className="text-eco-green" /> 
           Query your ESG data using natural language.
        </p>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-[#0b0c0d]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.05)] relative group">
        {/* Ambient Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-emerald-500 blur-[120px] opacity-60" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-eco-green/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
          {messages.map((m, i) => (
             <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    m.role === 'assistant' 
                    ? 'bg-gradient-to-br from-eco-green to-teal-600 text-navy-900' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                }`}>
                   {m.role === 'assistant' ? <Bot size={20} /> : <UserIcon size={20} />}
                </div>
                
                <div className={`max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-sm ${
                   m.role === 'user' 
                     ? 'bg-white/10 text-white rounded-tr-none border border-white/5' 
                     : 'bg-black/20 text-gray-200 border border-white/5 rounded-tl-none'
                }`}>
                   {m.content}
                </div>
             </div>
          ))}
          {loading && (
             <div className="flex gap-4 animate-pulse">
               <div className="w-10 h-10 rounded-2xl bg-navy-800 border border-white/5 text-eco-green flex items-center justify-center shrink-0">
                  <Bot size={20} />
               </div>
               <div className="bg-navy-800/50 border border-white/5 px-6 py-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-eco-green/50 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-eco-green/50 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-eco-green/50 rounded-full animate-bounce delay-200"></span>
                  </div>
               </div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-navy-900/50 border-t border-white/5 backdrop-blur-md relative z-20">
           <form onSubmit={handleSend} className="relative group">
             <div className="absolute inset-0 bg-eco-green/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <input
               type="text"
               disabled={loading}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Example: Which project has the highest carbon footprint?"
               className="w-full bg-navy-950/50 text-white rounded-2xl pl-6 pr-14 py-4 border border-white/10 focus:outline-none focus:border-eco-green/50 focus:ring-1 focus:ring-eco-green/50 transition-all shadow-inner placeholder:text-gray-600 relative z-10"
             />
             <button 
               type="submit" 
               disabled={!input.trim() || loading}
               className="absolute right-3 top-3 p-2 bg-eco-green text-navy-900 rounded-xl hover:bg-eco-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-eco-green/20 hover:shadow-eco-green/40 hover:scale-105 active:scale-95 z-20"
             >
               <Send size={20} />
             </button>
           </form>
           <div className="text-center mt-3">
              <span className="text-[10px] text-gray-600 uppercase tracking-widest">AI Analyst • RAG Enabled</span>
           </div>
        </div>
      </div>
    </div>
  );
}
