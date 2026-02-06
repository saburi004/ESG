'use client';

import { useState } from 'react';
import { MODEL_ENERGY_ESTIMATES, REGIONS } from '@/utils/constants';
import { Sparkles, ArrowRight, Zap, Leaf } from 'lucide-react';
import PromptOptimizer from '@/components/PromptOptimizer';
import TreeVisual from '@/components/TreeVisual';

export default function SuggestionsPage() {
  const [formData, setFormData] = useState({
    model: 'GPT-4',
    region: 'us-east-1',
    priority: 'Sustainability',
    requestsPerDay: 1000,
    gpu: 'A100',
  });
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mt-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Sustainability Optimizer</h1>
        <p className="text-gray-400">Get AI-driven recommendations to reduce your carbon footprint.</p>
      </div>

      {/* Top Section: Form + Sticky Tree */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
         <div className="flex-1 w-full bg-[#0b0c0d]/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl h-fit shadow-[0_4px_30px_rgba(0,0,0,0.2)] relative overflow-hidden">

           <div className="relative z-10">
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <div className="p-2 bg-amber-400/10 rounded-lg">
                <Zap className="text-amber-400" size={20} />
             </div>
             AI Config
           </h3>
           
           <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm text-gray-400 mb-1">Model</label>
               <select 
                 className="w-full bg-navy-950/50 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-eco-green focus:border-eco-green backdrop-blur-md transition-all outline-none"
                 value={formData.model}
                 onChange={e => setFormData({...formData, model: e.target.value})}
               >
                 {Object.keys(MODEL_ENERGY_ESTIMATES).map(m => <option key={m} value={m}>{m}</option>)}
               </select>
             </div>

             <div>
               <label className="block text-sm text-gray-400 mb-1">Region</label>
               <select 
                 className="w-full bg-navy-950/50 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-eco-green focus:border-eco-green backdrop-blur-md transition-all outline-none"
                 value={formData.region}
                 onChange={e => setFormData({...formData, region: e.target.value})}
               >
                 {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
               </select>
             </div>

             <div>
               <label className="block text-sm text-gray-400 mb-1">Priority</label>
               <select 
                 className="w-full bg-navy-950/50 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-eco-green focus:border-eco-green backdrop-blur-md transition-all outline-none"
                 value={formData.priority}
                 onChange={e => setFormData({...formData, priority: e.target.value})}
               >
                 <option>Sustainability</option>
                 <option>Cost</option>
                 <option>Performance</option>
               </select>
             </div>

             <div>
               <label className="block text-sm text-gray-400 mb-1">Avg Requests / Day</label>
               <input 
                 type="number" 
                 className="w-full bg-navy-950/50 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-eco-green focus:border-eco-green backdrop-blur-md transition-all outline-none"
                 value={formData.requestsPerDay}
                 onChange={e => setFormData({...formData, requestsPerDay: Number(e.target.value)})}
               />
             </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-eco-green/90 text-navy-950 font-bold py-4 rounded-xl hover:bg-eco-green transition-all mt-4 flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(0,255,136,0.2)] hover:shadow-[0_8px_30px_rgba(0,255,136,0.4)] hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? <Sparkles className="animate-spin" /> : <Sparkles />} 
                {loading ? 'Analyzing...' : 'Generate Suggestions'}
              </button>
           </form>
           </div>
         </div>

        {/* Right Side: Sticky Tree Visual */}
        <div className="xl:w-80 hidden xl:block flex-shrink-0">
            {/* Calculate total suggested savings (mock heuristic for tree growth) */}
            <TreeVisual carbonSaved={
                result 
                  ? (result.suggestions?.reduce((acc: number, s: any) => acc + parseInt(s.savings), 0) || 0) 
                  : 0
            } />
        </div>
      </div>

      {/* Results Section - Moved Below */}
      <div className="space-y-6">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                 <div className="bg-[#0b0c0d]/80 border border-white/5 p-8 rounded-3xl shadow-lg relative overflow-hidden group backdrop-blur-xl">

                     {/* Glossy gradient overlay */}
                     <div className="absolute inset-0 bg-gradient-to-r from-eco-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none relative z-10" />
                     
                     <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2 font-medium relative z-10">Estimated Annual Impact</h4>
                     <div className="text-5xl font-bold text-white flex items-end gap-2 tracking-tight relative z-10">
                        {result.estimated_annual_co2_kgs} <span className="text-lg text-gray-500 mb-2">kg CO₂</span>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {result.suggestions?.map((s: any, i: number) => (
                     <div key={i} className="bg-[#0b0c0d]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,255,136,0.08)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">

                        <div className="flex justify-between items-start mb-4 relative z-10">
                           <h4 className="font-bold text-eco-green text-lg group-hover:text-eco-light transition-colors">{s.title}</h4>
                           <span className="bg-eco-green/10 text-eco-green text-xs px-3 py-1 rounded-full border border-eco-green/10">
                             -{s.savings}
                           </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">{s.description}</p>
                        {s.tradeoff && (
                          <div className="text-xs text-amber-500/80 flex items-center gap-1 bg-amber-500/5 px-2 py-1 rounded-lg w-fit">
                            ⚠️ {s.tradeoff}
                          </div>
                        )}
                     </div>
                   ))}
                 </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-500 border border-dashed border-navy-700 rounded-3xl bg-navy-800/30">
                 <p className="text-lg font-medium">Ready to optimize?</p>
                 <p className="text-sm opacity-60">Complete the configuration above.</p>
              </div>
            )}
      </div>

      <div className="border-t border-navy-700/50 pt-8 mt-8">
          <PromptOptimizer />
      </div>
    </div>
  );
}
