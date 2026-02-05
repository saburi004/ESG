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
    <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Project RAG Chat</h1>
        <p className="text-gray-400">Query your ESG data using natural language.</p>
      </div>

      <div className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-navy-600">
          {messages.map((m, i) => (
             <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-eco-green text-navy-900 border border-eco-green' : 'bg-blue-600 text-white'}`}>
                   {m.role === 'assistant' ? <Bot size={18} /> : <UserIcon size={18} />}
                </div>
                
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                   m.role === 'user' 
                     ? 'bg-navy-700 text-white rounded-tr-none' 
                     : 'bg-navy-900 text-gray-300 border border-navy-700 rounded-tl-none'
                }`}>
                   {m.content}
                </div>
             </div>
          ))}
          {loading && (
             <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-eco-green text-navy-900 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot size={18} />
               </div>
               <div className="bg-navy-900 border border-navy-700 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                  </div>
               </div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-navy-900 border-t border-navy-700">
           <form onSubmit={handleSend} className="relative">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Example: Which project has the highest carbon footprint?"
               className="w-full bg-navy-800 text-white rounded-xl pl-4 pr-12 py-4 border border-navy-600 focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all shadow-inner"
             />
             <button 
               type="submit" 
               disabled={!input.trim() || loading}
               className="absolute right-2 top-2 p-2 bg-eco-green text-navy-900 rounded-lg hover:bg-eco-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <Send size={20} />
             </button>
           </form>
        </div>
      </div>
    </div>
  );
}
