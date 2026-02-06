'use client';

import { useState } from 'react';
import { Sparkles, ArrowDown, Zap, Target, Copy, Check } from 'lucide-react';
import TreeVisual from './TreeVisual';

export default function PromptOptimizer() {
  const [prompt, setPrompt] = useState('');
  const [budget, setBudget] = useState(100);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Heuristic optimization simulation
  const optimizePrompt = () => {
    setLoading(true);
    
    setTimeout(() => {
        // Semantic Compression Simulation
        const stopWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'very', 'really', 'extremely', 'just', 'that', 'which', 'who', 'whom'];
        
        const words = prompt.split(/\s+/);
        const filteredWords = words.filter(w => !stopWords.includes(w.toLowerCase().replace(/[^a-z]/g, '')));
        const optimizedText = filteredWords.join(' ');

        const originalTokens = Math.ceil(prompt.length / 4);
        const optimizedTokens = Math.ceil(optimizedText.length / 4);
        
        const estimatedOutputOriginal = originalTokens * 5; 
        const estimatedOutputOptimized = Math.min(budget, optimizedTokens * 5);

        // Calculate basic savings
        const promptSavings = originalTokens > 0 ? ((originalTokens - optimizedTokens) / originalTokens) * 100 : 0;
        
        // Composite metric for "Carbon Saved"
        const totalOriginal = originalTokens + estimatedOutputOriginal;
        const totalOptimized = optimizedTokens + estimatedOutputOptimized;
        const carbonSaved = ((totalOriginal - totalOptimized) / totalOriginal) * 100;

        const costSaved = carbonSaved + 5; // Markup for cost

        setResult({
            originalPrompt: prompt,
            optimizedPrompt: optimizedText,
            metrics: {
                promptTokens: { before: originalTokens, after: optimizedTokens },
                outputTokens: { before: estimatedOutputOriginal, after: estimatedOutputOptimized },
                costSaved: costSaved,
                carbonSaved: carbonSaved
            }
        });
        setLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    if (result?.optimizedPrompt) {
        navigator.clipboard.writeText(result.optimizedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
        <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* Main Optimizer Panel */}
            <div className="flex-1 w-full bg-navy-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] space-y-8 relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-eco-green/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-eco-green/10 transition-colors duration-1000" />

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-gradient-to-br from-eco-green to-teal-500 p-3 rounded-2xl shadow-lg shadow-eco-green/20">
                       <Zap className="text-navy-900" size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-white tracking-tight">Prompt Optimizer</h2>
                       <p className="text-gray-400 text-sm font-medium">Semantic Compression Engine</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className="space-y-4 relative z-10">
                   <div className="flex justify-between items-center text-sm">
                       <label className="text-gray-300 font-medium">Input Prompt</label>
                       <span className="text-gray-500 text-xs uppercase tracking-wide bg-navy-950/30 px-2 py-1 rounded-md">Step 1</span>
                   </div>
                   <textarea 
                      className="w-full h-32 bg-navy-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-eco-green focus:bg-navy-950/80 focus:ring-1 focus:ring-eco-green transition-all outline-none resize-none font-mono text-sm leading-relaxed backdrop-blur-md"
                      placeholder="Enter your system prompt or query here to analyze redundency..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                   />
                   
                   {/* Controls */}
                    <div className="pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-gray-300 text-sm font-medium">Target Output Budget</label>
                            <span className="bg-navy-950/50 text-eco-green font-mono text-sm px-3 py-1 rounded-lg border border-white/10 shadow-inner">
                                {budget} tokens
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="50" 
                            max="4000" 
                            step="50"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-eco-green hover:accent-eco-light transition-all"
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                     <button 
                      onClick={optimizePrompt}
                      disabled={loading || !prompt}
                      className={`relative group w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-3 overflow-hidden ${
                          !prompt 
                           ? 'bg-navy-800/50 text-gray-500 cursor-not-allowed border border-white/5'
                           : 'bg-gradient-to-r from-eco-green to-teal-400 text-navy-900 shadow-[0_4px_20px_rgba(0,255,136,0.3)] hover:shadow-[0_4px_30px_rgba(0,255,136,0.5)]'
                      }`}
                    >
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                      <span className="relative flex items-center gap-2">
                          {loading ? <Sparkles className="animate-spin" /> : <Target />}
                          {loading ? 'Optimizing...' : 'Run Optimization'}
                      </span>
                    </button>
                    {/* Arrow indicator for step 2 */}
                    {!result && !loading && (
                        <ArrowDown className="text-gray-600 animate-bounce mt-2" size={20} />
                    )}
                </div>
            </div>

            {/* Sticky Visual Panel (Right Side) */}
            <div className="xl:w-80 hidden xl:block flex-shrink-0">
                 <TreeVisual carbonSaved={result?.metrics?.carbonSaved || 0} />
            </div>
        </div>
        
        {/* Output Section - Now in a separate div below */}
        {result && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 relative z-10 border-t border-white/5 pt-8">
               <div className="flex justify-between items-end mb-4">
                   <div>
                       <div className="text-lg font-bold text-white">Optimized Output</div>
                       <div className="text-sm text-eco-green">Compressed & Budget Aligned</div>
                   </div>
                   <button 
                     onClick={handleCopy}
                     className="flex items-center gap-2 bg-navy-800/50 hover:bg-navy-700 text-white px-4 py-2 rounded-xl border border-white/10 transition-all hover:border-eco-green/50 text-sm font-medium hover:shadow-[0_0_15px_rgba(0,255,136,0.1)]"
                   >
                      {copied ? <Check size={16} className="text-eco-green"/> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy Result'}
                   </button>
               </div>
               
               <div className="bg-navy-950/40 border border-eco-green/20 rounded-2xl p-6 relative group mb-8 shadow-lg backdrop-blur-sm">
                   <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-eco-green to-transparent rounded-l-xl opacity-80 shadow-[0_0_10px_rgba(0,255,136,0.2)]" />
                   <div className="font-mono text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {result.optimizedPrompt}
                   </div>
               </div>

               {/* Quick Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-navy-800/40 rounded-2xl p-4 text-center border border-white/5 backdrop-blur-sm shadow-sm">
                       <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tokens Saved</div>
                       <div className="text-2xl font-bold text-white">
                           {result.metrics.promptTokens.before - result.metrics.promptTokens.after}
                       </div>
                   </div>
                   <div className="bg-navy-800/40 rounded-2xl p-4 text-center border border-white/5 backdrop-blur-sm shadow-sm">
                       <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Cost Efficiency</div>
                       <div className="text-2xl font-bold text-amber-400 drop-shadow-sm">
                           ~{result.metrics.costSaved.toFixed(0)}%
                       </div>
                   </div>
                   <div className="bg-gradient-to-br from-eco-green/10 to-teal-500/10 rounded-2xl p-4 flex flex-col items-center justify-center border border-eco-green/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,136,0.05)]">
                       <div className="text-xs text-eco-green uppercase font-bold tracking-wider mb-2">Total Carbon Reduction</div>
                       <div className="text-3xl font-bold text-eco-green drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                           {result.metrics.carbonSaved.toFixed(1)}%
                       </div>
                   </div>
               </div>
            </div>
        )}
    </div>
  );
}
