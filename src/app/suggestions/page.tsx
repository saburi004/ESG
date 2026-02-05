'use client';

import { useState } from 'react';
import { MODEL_ENERGY_ESTIMATES, REGIONS } from '@/utils/constants';
import { Sparkles, ArrowRight, Zap, Leaf } from 'lucide-react';

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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Sustainability Optimizer</h1>
        <p className="text-gray-400">Get AI-driven recommendations to reduce your carbon footprint.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-navy-800 border border-navy-700 p-6 rounded-2xl h-fit">
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <Zap className="text-amber-400" /> Configuration
           </h3>
           
           <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm text-gray-400 mb-1">Model</label>
               <select 
                 className="w-full bg-navy-900 border border-navy-600 rounded-lg p-2 text-white"
                 value={formData.model}
                 onChange={e => setFormData({...formData, model: e.target.value})}
               >
                 {Object.keys(MODEL_ENERGY_ESTIMATES).map(m => <option key={m} value={m}>{m}</option>)}
               </select>
             </div>

             <div>
               <label className="block text-sm text-gray-400 mb-1">Region</label>
               <select 
                 className="w-full bg-navy-900 border border-navy-600 rounded-lg p-2 text-white"
                 value={formData.region}
                 onChange={e => setFormData({...formData, region: e.target.value})}
               >
                 {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
               </select>
             </div>

             <div>
               <label className="block text-sm text-gray-400 mb-1">Priority</label>
               <select 
                 className="w-full bg-navy-900 border border-navy-600 rounded-lg p-2 text-white"
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
                 className="w-full bg-navy-900 border border-navy-600 rounded-lg p-2 text-white"
                 value={formData.requestsPerDay}
                 onChange={e => setFormData({...formData, requestsPerDay: Number(e.target.value)})}
               />
             </div>

             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-eco-green text-navy-900 font-bold py-3 rounded-lg hover:bg-eco-light transition-all mt-4 flex justify-center items-center gap-2"
             >
               {loading ? <Sparkles className="animate-spin" /> : <Sparkles />} 
               {loading ? 'Analyzing...' : 'Generate Suggestions'}
             </button>
           </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
           {result ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-navy-800 border border-navy-700 p-6 rounded-2xl">
                    <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Estimated Annual Impact</h4>
                    <div className="text-4xl font-bold text-white flex items-end gap-2">
                       {result.estimated_annual_co2_kgs} <span className="text-lg text-gray-500 mb-1">kg CO₂</span>
                    </div>
                </div>

                <div className="space-y-4">
                  {result.suggestions?.map((s: any, i: number) => (
                    <div key={i} className="bg-navy-800 border border-eco-green/30 p-5 rounded-2xl shadow-[0_0_15px_rgba(0,255,136,0.05)] hover:border-eco-green transition-colors">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-eco-green text-lg">{s.title}</h4>
                          <span className="bg-eco-green/10 text-eco-green text-xs px-2 py-1 rounded-full border border-eco-green/20">
                            -{s.savings}
                          </span>
                       </div>
                       <p className="text-gray-300 text-sm mb-3">{s.description}</p>
                       {s.tradeoff && (
                         <div className="text-xs text-amber-500 flex items-center gap-1">
                           ⚠️ {s.tradeoff}
                         </div>
                       )}
                    </div>
                  ))}
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-navy-700 rounded-2xl p-12">
                <Leaf className="w-16 h-16 mb-4 opacity-20" />
                <p>Fill form to generate eco-report</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
