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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in duration-500">
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Form */}
        <div className="bg-navy-800 border border-navy-700 p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors w-fit">
            <Link href="/dashboard" className="flex items-center gap-2">
               <ArrowLeft size={16} /> Back
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Connect Project</h1>
          <p className="text-gray-400 mb-8 text-sm">Integrate usage metrics from your AI providers securely.</p>

          <form onSubmit={handleConnect} className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
               <input 
                 required
                 type="text" 
                 placeholder="e.g. My Chatbot Production"
                 value={projectName}
                 onChange={e => setProjectName(e.target.value)}
                 className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-white focus:border-eco-green outline-none transition-all"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
               <div className="grid grid-cols-2 gap-4">
                 <button type="button" onClick={() => setProvider('groq')}
                   className={`p-3 rounded-lg border text-center transition-all ${provider === 'groq' ? 'bg-eco-green/10 border-eco-green text-eco-green font-bold' : 'border-navy-600 text-gray-400 hover:bg-navy-700'}`}>
                   Groq
                 </button>
                 <button type="button" onClick={() => setProvider('openai')}
                   className={`p-3 rounded-lg border text-center transition-all ${provider === 'openai' ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold' : 'border-navy-600 text-gray-400 hover:bg-navy-700'}`}>
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
                 className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-white focus:border-eco-green outline-none transition-all"
               />
               <p className="text-xs text-gray-500 mt-2">
                 We only use this to fetch usage metrics. We never access prompts.
               </p>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Import Usage History</label>
                <select 
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-white focus:border-eco-green outline-none transition-all"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 3 Months</option>
                </select>
             </div>

             {error && (
               <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
                 <AlertTriangle size={16} /> {error}
               </div>
             )}

             {success && (
               <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-2">
                 <CheckCircle2 size={16} /> Connected Successfully! Redirecting...
               </div>
             )}

             <button 
               type="submit" 
               disabled={loading || success}
               className="w-full bg-eco-green text-navy-900 font-bold py-3 rounded-lg hover:bg-eco-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
             >
               {loading ? <Loader2 className="animate-spin" size={20} /> : 'Connect Project'}
             </button>
          </form>
        </div>

        {/* Right: Security Info */}
        <div className="flex flex-col justify-center space-y-6">
           <div className="bg-navy-800/50 p-6 rounded-2xl border border-navy-700">
              <div className="w-12 h-12 bg-eco-green/10 rounded-full flex items-center justify-center mb-4">
                 <ShieldCheck className="text-eco-green" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Enterprise Security First</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                 Your keys are encrypted at rest. This connection is strictly <strong>read-only</strong> for usage metadata.
              </p>
           </div>

           <div className="bg-navy-800/50 p-6 rounded-2xl border border-navy-700">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <CheckCircle2 className="text-blue-400" size={18} /> What We Access
               </h3>
               <ul className="space-y-3 text-sm text-gray-400">
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Token Usage Counts</li>
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Request Volume logs</li>
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Model Names (co2 calculation)</li>
               </ul>
           </div>

           <div className="bg-navy-800/50 p-6 rounded-2xl border border-navy-700">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <AlertTriangle className="text-red-400" size={18} /> What We NEVER Access
               </h3>
               <ul className="space-y-3 text-sm text-gray-400">
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Prompt Inputs</li>
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Model Outputs / Completions</li>
                 <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Customer PII Data</li>
               </ul>
           </div>
        </div>

      </div>
    </div>
  );
}
