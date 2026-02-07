'use client';

import { MODEL_ENERGY_ESTIMATES, REGIONS } from '@/utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Globe, Cpu, X, ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface ScenarioData {
  id: string;
  model: string;
  region: string;
  requestsPerDay: number;
  isExpanded?: boolean;
}

interface ScenarioBuilderProps {
  data: ScenarioData;
  onChange: (newData: ScenarioData) => void;
  onRemove?: () => void;
  isComparison?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function ScenarioBuilder({ 
  data, 
  onChange, 
  onRemove, 
  isComparison,
  isExpanded = true,
  onToggle
}: ScenarioBuilderProps) {
  
  const handleUpdate = (field: keyof ScenarioData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const models = Object.keys(MODEL_ENERGY_ESTIMATES);
  const currentRegion = REGIONS.find(r => r.id === data.region);

  return (
    <div 
      className={`
        relative bg-[#0b0c0d]/80 backdrop-blur-xl border border-white/5 rounded-3xl transition-all duration-500 overflow-hidden h-full
        ${isComparison ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-eco-green'}
        ${!isExpanded ? 'bg-white/5 hover:bg-white/10 cursor-pointer flex flex-col items-center justify-center p-2' : 'p-6'}
      `}
      onClick={!isExpanded && onToggle ? onToggle : undefined}
    >
      
      {!isExpanded ? (
        // Collapsed Vertical State
        <div className="h-full flex flex-col items-center justify-center gap-6 min-h-[300px]">
           <button 
                onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
                className="p-3 bg-white/10 text-white rounded-full hover:bg-eco-green hover:text-navy-950 transition-all shadow-lg group-hover:scale-110"
                title="Expand Scenario"
              >
                <Plus size={24} />
           </button>
           
           {/* Vertical Text Container */}
           <div className="flex flex-col items-center gap-2 flex-1 justify-center">
              <div className="-rotate-90 whitespace-nowrap text-gray-400 font-bold tracking-widest uppercase text-xs origin-center translate-y-8">
                  {isComparison ? 'Scenario B' : 'Scenario A'}
              </div>
              <div className="-rotate-90 whitespace-nowrap text-gray-600 text-[10px] mt-12 origin-center translate-y-8">
                  {data.model.replace('_', ' ')}
              </div>
           </div>
        </div>
      ) : (
        // Expanded State
        <>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <span className={`w-3 h-3 rounded-full ${isComparison ? 'bg-purple-500' : 'bg-eco-green'}`}></span>
              {isComparison ? 'Scenario B' : 'Scenario A'}
          </h3>
          
          <div className="flex items-center gap-2">
              {onToggle && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggle(); }}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <ChevronDown size={18} />
                </button>
              )}
              {onRemove && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              )}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Model Selection - Cards */}
          <div className="mb-6">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-3">Select Model</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {models.map(model => (
                <button
                  key={model}
                  onClick={() => handleUpdate('model', model)}
                  className={`
                    relative p-3 rounded-xl border text-left transition-all group overflow-hidden
                    ${data.model === model 
                      ? 'bg-eco-green/10 border-eco-green text-white shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                      : 'bg-navy-900/50 border-white/5 text-gray-400 hover:border-white/20 hover:bg-navy-800'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu size={16} className={data.model === model ? 'text-eco-green' : 'text-gray-500'} />
                    <span className="font-semibold text-sm truncate w-full">{model}</span>
                  </div>
                  <div className="text-[10px] opacity-60">
                    {MODEL_ENERGY_ESTIMATES[model].energyPerResponse_kWh.toFixed(5)} kWh/req
                  </div>
                  
                  {/* Selection Indicator */}
                  {data.model === model && (
                    <motion.div 
                      layoutId={`indicator-${data.id}`}
                      className="absolute inset-0 border-2 border-eco-green rounded-xl pointer-events-none"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Region Selection - Pills */}
          <div className="mb-6">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-3">Select Region</label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(region => (
                <button
                  key={region.id}
                  onClick={() => handleUpdate('region', region.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all
                    ${data.region === region.id
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                      : 'bg-navy-900/50 border-white/5 text-gray-400 hover:border-white/20'}
                  `}
                >
                  <Globe size={14} />
                  {region.name}
                  <span className={`
                    px-1.5 py-0.5 rounded text-[10px] ml-1
                    ${region.carbonIntensity < 100 ? 'bg-green-500/20 text-green-400' : 
                      region.carbonIntensity < 400 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-400'}
                  `}>
                    {region.carbonIntensity}g
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Traffic Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-xs uppercase tracking-wider">Traffic Load</label>
              <span className="text-eco-green font-mono font-bold">{data.requestsPerDay.toLocaleString()} req/day</span>
            </div>
            <input 
              type="range"
              min="100"
              max="50000"
              step="100"
              value={data.requestsPerDay}
              onChange={(e) => handleUpdate('requestsPerDay', parseInt(e.target.value))}
              className="w-full h-2 bg-navy-900 rounded-lg appearance-none cursor-pointer accent-eco-green hover:accent-eco-light"
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>Low (100)</span>
                <span>Enterprise (50k)</span>
            </div>
          </div>
        </motion.div>
        </>
      )}

    </div>
  );
}
