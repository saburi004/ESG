'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Leaf, AlertTriangle, Zap } from 'lucide-react';

interface CarbonMeterProps {
  value: number; // 0 to 100 normalized score
  label: string;
  rawCo2: number; // yearly kg
  delta?: number; // percentage difference vs comparison
}

export default function CarbonMeter({ value, label, rawCo2, delta }: CarbonMeterProps) {
  // Clamp value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Calculate rotation: -90deg (0%) to 90deg (100%)
  const rotation = (normalizedValue / 100) * 180 - 90;

  // Determine color status
  let statusColor = "text-eco-green";
  let statusText = "Excellent";
  
  if (normalizedValue > 30) { statusColor = "text-yellow-400"; statusText = "Moderate"; }
  if (normalizedValue > 70) { statusColor = "text-red-500"; statusText = "High Impact"; }

  return (
    <div className="bg-[#0b0c0d]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-w-[300px]">
      
      {/* Title */}
      <h3 className="text-gray-400 uppercase tracking-widest text-xs font-semibold mb-4 text-center">
        Real-time Carbon Impact
      </h3>

      {/* Speedometer Gauge */}
      <div className="relative w-64 h-32 mb-4 overflow-hidden">
        {/* Background Arc */}
        <div className="absolute inset-x-0 top-0 h-64 rounded-full border-[20px] border-white/5 border-b-0 box-border" />
        
        {/* Colored Gradient Arc (using conic gradient masked) */}
        <div 
           className="absolute inset-x-0 top-0 h-64 rounded-full border-[20px] border-transparent border-t-0 border-l-0 border-r-0 box-border opacity-30"
           style={{
             background: `conic-gradient(from 180deg at 50% 100%, #22c55e 0deg, #eab308 90deg, #ef4444 180deg)`,
             maskImage: 'radial-gradient(farthest-side, transparent calc(100% - 20px), black calc(100% - 20px))',
             WebkitMaskImage: 'radial-gradient(farthest-side, transparent calc(100% - 20px), black calc(100% - 20px))'
           }}
        />

        {/* Needle */}
        <motion.div
           className="absolute left-1/2 bottom-0 w-1 h-32 bg-white origin-bottom z-10 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
           animate={{ rotate: rotation }}
           transition={{ type: "spring", stiffness: 60, damping: 15 }}
           style={{ transformOrigin: "bottom center", x: "-50%" }}
        >
          <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-white rounded-full shadow-lg" />
        </motion.div>
        
        {/* Central Hub */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-[#0b0c0d] rounded-full border-4 border-white/10 z-20" />
      </div>

      {/* Main Metric */}
      <div className="flex flex-col items-center z-10 -mt-6">
         <motion.div 
           className={cn("text-4xl font-bold font-mono tracking-tighter flex items-end gap-1", statusColor)}
           key={rawCo2}
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
         >
           {rawCo2.toFixed(1)} <span className="text-base text-gray-500 font-sans font-normal mb-1">kg/yr</span>
         </motion.div>

         <div className={cn("text-sm font-medium mt-1 flex items-center gap-1.5", statusColor)}>
            {statusText === "Excellent" && <Leaf size={14} />}
            {statusText === "Moderate" && <Zap size={14} />}
            {statusText === "High Impact" && <AlertTriangle size={14} />}
            {statusText}
         </div>
      </div>

      {/* Comparison Badge */}
      {delta !== undefined && (
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "mt-6 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2",
            delta <= 0 ? "bg-eco-green/10 text-eco-green" : "bg-red-500/10 text-red-400"
          )}
        >
           {delta <= 0 ? "Initial Value" : "Warning"}
           <span className="text-xs font-normal opacity-80">
             {delta <= 0 ? `Baseline` : `+${delta.toFixed(0)}% more carbon`}
             {delta < 0 && <span className="font-bold ml-1">{Math.abs(delta).toFixed(1)}% savings</span>}
           </span>
        </motion.div>
      )}

      {/* Legend / Tips */}
    

    </div>
  );
}
