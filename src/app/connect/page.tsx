'use client';

import { useState } from 'react';
import { Construction, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ConnectPage() {
  const router = useRouter();
  const [provider, setProvider] = useState('groq');
  const [apiKey, setApiKey] = useState('');
  const [projectName, setProjectName] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/connect/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey, projectName, dateRange }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Verification failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[85vh] px-4 animate-in fade-in duration-700 relative overflow-hidden">
      
      {/* Page Header */}
      <div className="text-center mb-12 mt-12 relative z-10">
         <div className="inline-flex items-center justify-center p-3 bg-eco-green/10 rounded-full mb-4 border border-eco-green/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="text-eco-green" size={32} />
         </div>
         <h1 className="text-4xl font-bold text-eco-green mb-2 tracking-tight">Connect Your Data Source</h1>
         <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Securely integrate your LLM provider to start tracking real-time carbon metrics.
         </p>
      </div>
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-emerald-500 blur-[200px] opacity-50" />
        </div>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* Left: Form */}
        <div className="bg-[#0b0c0d]/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.05)] transition-shadow duration-500 group relative">
          {/* Subtle Border Glow */}
          <div className="absolute inset-0 rounded-3xl border border-white/5 group-hover:border-eco-green/20 transition-colors pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors w-fit">
            <Link href="/dashboard" className="flex items-center gap-2 hover:-translate-x-1 transition-transform">
               <ArrowLeft size={16} /> <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Configuration</h2>
          <p className="text-gray-400 mb-8 text-sm">Enter your project details below.</p>

          <form onSubmit={handleConnect} className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
               <input 
                 required
                 type="text" 
                 placeholder="e.g. My Chatbot Production"
                 value={projectName}
                 onChange={e => setProjectName(e.target.value)}
                 className="w-full bg-navy-950/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:border-eco-green focus:ring-1 focus:ring-eco-green/50 outline-none transition-all backdrop-blur-sm"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
               <div className="grid grid-cols-2 gap-4">
                 <button type="button" onClick={() => setProvider('groq')}
                   className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${
                       provider === 'groq' 
                       ? 'bg-eco-green/10 border-eco-green text-eco-green font-bold shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                       : 'bg-navy-950/30 border-white/5 text-gray-400 hover:bg-white/5'
                   }`}>
                   Groq
                 </button>
                 <button type="button" onClick={() => setProvider('openai')}
                   className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${
                       provider === 'openai' 
                       ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                       : 'bg-navy-950/30 border-white/5 text-gray-400 hover:bg-white/5'
                   }`}>
                   OpenAI
                 </button>
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">API Key (Read-Only)</label>
               <input 
                 required
                 type="password" 
                 placeholder="sk-..."
                 value={apiKey}
                 onChange={e => setApiKey(e.target.value)}
                 className="w-full bg-navy-950/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:border-eco-green focus:ring-1 focus:ring-eco-green/50 outline-none transition-all backdrop-blur-sm font-mono"
               />
               <p className="text-xs text-eco-green/70 mt-3 flex items-center gap-1.5">
                 <ShieldCheck size={12} /> We encrypt your key and only fetch usage logs.
               </p>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Import Usage History</label>
                <div className="relative">
                    <select 
                      value={dateRange}
                      onChange={e => setDateRange(e.target.value)}
                      className="w-full bg-navy-950/50 border border-white/10 rounded-xl p-4 text-white focus:border-eco-green focus:ring-1 focus:ring-eco-green/50 outline-none transition-all appearance-none cursor-pointer hover:bg-navy-900/50"
                    >
                        <option value="7d" className="bg-navy-900">Last 7 Days</option>
                        <option value="30d" className="bg-navy-900">Last 30 Days</option>
                        <option value="90d" className="bg-navy-900">Last 3 Months</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ArrowLeft size={16} className="-rotate-90" />
                    </div>
                </div>
             </div>

             {error && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                 <AlertTriangle size={18} className="shrink-0" /> {error}
               </div>
             )}

             {success && (
               <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                 <CheckCircle2 size={18} className="shrink-0" /> Connection Successful! Redirecting...
               </div>
             )}

             <button 
               type="submit" 
               disabled={loading || success}
               className="w-full bg-gradient-to-r from-eco-green to-teal-500 text-navy-900 font-bold py-4 rounded-xl hover:shadow-[0_4px_30px_rgba(0,255,136,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
             >
               {loading ? <Loader2 className="animate-spin" size={20} /> : 'Connect Project'}
             </button>
          </form>
        </div>

        {/* Right: Security Info */}
        <div className="flex flex-col justify-center space-y-6">
           <div className="bg-[#0b0c0d]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:bg-[#0b0c0d]/90 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-eco-green/20 to-teal-500/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5">
                 <ShieldCheck className="text-eco-green" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Enterprise-Grade Security</h3>
              <p className="text-gray-400 leading-relaxed">
                 Your security is our priority. Keys are encrypted at rest using AES-256. 
                 We strictly establish a <strong>read-only</strong> connection for usage metadata only.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-[#0b0c0d]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 hover:bg-[#0b0c0d]/60 transition-colors">
                   <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                     <CheckCircle2 className="text-blue-400" size={16} /> Accessible Data
                   </h3>
                   <ul className="space-y-3 text-sm text-gray-400">
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-eco-green rounded-full shadow-[0_0_5px_#10b981]"></span> Token Counts</li>
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-eco-green rounded-full shadow-[0_0_5px_#10b981]"></span> Request Logs</li>
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-eco-green rounded-full shadow-[0_0_5px_#10b981]"></span> Model Metadata</li>
                   </ul>
               </div>

               <div className="bg-[#0b0c0d]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 hover:bg-[#0b0c0d]/60 transition-colors">
                   <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                     <AlertTriangle className="text-red-400" size={16} /> Restricted Data
                   </h3>
                   <ul className="space-y-3 text-sm text-gray-400">
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444]"></span> Prompt Text</li>
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444]"></span> Model Outputs</li>
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444]"></span> Customer PII</li>
                   </ul>
               </div>
           </div>
           
           {/* Ambient Decoration */}
           <div className="p-8 rounded-3xl bg-gradient-to-br from-eco-green/5 to-transparent border border-white/5 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-eco-green/10 rounded-full blur-3xl"></div>
                <h4 className="font-bold text-white mb-2 relative z-10">Why Connect?</h4>
                <p className="text-sm text-gray-400 relative z-10">
                    Unlock specific carbon insights per project. Compare efficiency across models and track your sustainability goals in real-time.
                </p>
           </div>
        </div>

      </div>
    </div>
  );
}
