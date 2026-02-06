'use client';

import { Leaf, Award, Sprout, Trees } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TreeVisualProps {
  carbonSaved: number;
}

export default function TreeVisual({ carbonSaved }: TreeVisualProps) {
  const [growthState, setGrowthState] = useState(0);

  useEffect(() => {
    // Simple logic to determine "growth" stage based on savings
    if (carbonSaved > 50) setGrowthState(3);
    else if (carbonSaved > 20) setGrowthState(2);
    else if (carbonSaved > 0) setGrowthState(1);
    else setGrowthState(0);
  }, [carbonSaved]);

  return (
    <div className="sticky top-6 p-8 bg-navy-800/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-fit transition-all duration-700 hover:shadow-[0_12px_40px_rgba(0,255,136,0.1)]">
      <div className="absolute inset-0 bg-gradient-to-b from-eco-green/5 to-transparent rounded-3xl pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-6">
         <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-eco-green to-teal-400">
            Eco-Impact Tree
         </h3>

         {/* Tree Visualization Area */}
         <div className="relative h-64 w-full flex items-end justify-center">
            {/* Base/Ground */}
            <div className="absolute bottom-0 w-full h-1 bg-navy-700/50 rounded-full" />
            
            {/* Tree Stages - using generic icons for now, could be SVGs */}
            <div className={`transition-all duration-1000 transform ${growthState >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
               {growthState === 0 && (
                   <div className="flex flex-col items-center animate-pulse">
                       <Sprout size={48} className="text-gray-600 mb-1" />
                       <span className="text-xs text-gray-500">Seedling</span>
                   </div>
               )}
               {growthState === 1 && (
                   <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                       <Leaf size={64} className="text-eco-green/70 mb-1" />
                       <span className="text-xs text-eco-green">Sprouting</span>
                   </div>
               )}
               {growthState === 2 && (
                   <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                       <Trees size={96} className="text-eco-green mb-1" />
                       <span className="text-xs text-eco-green font-bold">Growing Strong</span>
                   </div>
               )}
               {growthState === 3 && (
                   <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700 relative">
                       <div className="absolute -top-8 animate-bounce">
                          <Award size={32} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"/>
                       </div>
                       <Trees size={128} className="text-eco-green drop-shadow-[0_0_15px_rgba(0,255,136,0.3)] mb-1" />
                       <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-eco-green font-bold">Mature Forest</span>
                   </div>
               )}
            </div>
         </div>

         {/* Stats */}
         <div className="bg-navy-950/40 rounded-2xl p-6 border border-white/5 backdrop-blur-sm shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20">
               <Leaf className="text-eco-green -rotate-12" size={32} />
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Carbon Reduction</div>
            <div className="text-3xl font-mono font-bold text-white group">
               {carbonSaved.toFixed(1)}<span className="text-eco-green text-sm ml-1">%</span>
            </div>
            {carbonSaved > 0 && (
                <p className="text-[10px] text-eco-green mt-2 flex items-center justify-center gap-1">
                   <Leaf size={10} /> Contribution to Net Zero
                </p>
            )}
         </div>
      </div>
    </div>
  );
}
