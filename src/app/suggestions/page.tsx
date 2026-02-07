'use client';

import { useState, useMemo } from 'react';
import { MODEL_ENERGY_ESTIMATES, REGIONS } from '@/utils/constants';
import { Plus, Sparkles, Leaf, Zap } from 'lucide-react';
import PromptOptimizer from '@/components/PromptOptimizer';
import ScenarioBuilder from '@/components/ScenarioBuilder';
import CarbonMeter from '@/components/CarbonMeter';

interface Scenario {
  id: string;
  model: string;
  region: string;
  requestsPerDay: number;
  isExpanded?: boolean;
}

export default function SuggestionsPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'A', model: 'GPT-4', region: 'us-east-1', requestsPerDay: 1000, isExpanded: true }
  ]);

  const updateScenario = (updated: Scenario) => {
    setScenarios(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const toggleScenario = (id: string) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, isExpanded: !s.isExpanded } : s));
  };

  const addScenario = () => {
    if (scenarios.length < 2) {
      setScenarios([...scenarios, { 
        id: 'B', 
        model: 'LLaMA3_small', 
        region: 'eu-north-1', 
        requestsPerDay: 1000,
        isExpanded: false // Start collapsed
      }]);
    }
  };

  const removeScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  // ... (metrics calculation remains same)
  const calculateMetrics = (s: Scenario) => {
     const modelData = MODEL_ENERGY_ESTIMATES[s.model];
     const regionData = REGIONS.find(r => r.id === s.region);
     
     if (!modelData || !regionData) return { annualCO2: 0, score: 0 };

     const dailyEnergy_kWh = s.requestsPerDay * modelData.energyPerResponse_kWh;
     const dailyCO2_g = dailyEnergy_kWh * regionData.carbonIntensity;
     const annualCO2_kg = (dailyCO2_g * 365) / 1000;

     // Normalize score (0-100)
     const score = Math.min(100, (annualCO2_kg / 1000) * 100);

     return { annualCO2: annualCO2_kg, score };
  };

  const metricsA = calculateMetrics(scenarios[0]);
  const metricsB = scenarios.length > 1 ? calculateMetrics(scenarios[1]) : null;

  // Calculate Delta if B exists
  const delta = metricsB ? ((metricsB.annualCO2 - metricsA.annualCO2) / metricsA.annualCO2) * 100 : undefined;

  // ... (insights generation remains same)
  const insights = useMemo(() => {
    const s = scenarios[0];
    const tips = [];
    
    // Region Tip
    const currentRegion = REGIONS.find(r => r.id === s.region);
    if (currentRegion && currentRegion.carbonIntensity > 200) {
       const bestRegion = REGIONS.reduce((prev, curr) => prev.carbonIntensity < curr.carbonIntensity ? prev : curr);
       tips.push({
         type: 'critical',
         title: 'High Carbon Intensity Region',
         text: `Your selected region (${currentRegion.name}) has high carbon intensity (${currentRegion.carbonIntensity}g). Switching to ${bestRegion.name} could reduce emissions by ${Math.round((1 - bestRegion.carbonIntensity/currentRegion.carbonIntensity)*100)}%.`
       });
    }

    // Model Tip
    if (s.model.includes('GPT-4') && s.requestsPerDay > 5000) {
       tips.push({
         type: 'warning',
         title: 'Heavy Model for High Traffic',
         text: "Using GPT-4 for high-volume traffic is energy efficient. Consider a hybrid approach: use LLaMA3-Small for simple queries to cut energy by ~90%."
       });
    }

    // General Tip
    if (s.requestsPerDay > 10000) {
      tips.push({
        type: 'info',
        title: 'Batch Processing Recommended',
        text: "At this scale, running non-urgent inference jobs during 'green energy windows' (usually night time) can significantly lower net carbon footprint."
      });
    }

    return tips;
  }, [scenarios]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="mt-8 mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">PlayGround</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
           Design your AI architecture visually. Compare models, regions, and traffic loads to see real-time carbon impact.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-emerald-500 blur-[200px] opacity-20" />
        </div>
         {/* Left Side: Scenario Builders + Insights */}
         <div className="flex-1 w-full space-y-8">
            
            {/* Scenarios Flex Container (Variable Widths) */}
            <div className="flex flex-col lg:flex-row gap-6">
               {scenarios.map((scenario, index) => (
                 <div 
                   key={scenario.id} 
                   className={`transition-all duration-500 ease-in-out ${
                     scenario.isExpanded ? 'flex-[3]' : 'flex-[0.5] min-w-[60px] lg:max-w-[80px]'
                   }`}
                 >
                    <ScenarioBuilder 
                      data={scenario} 
                      onChange={updateScenario} 
                      onRemove={index > 0 ? () => removeScenario(scenario.id) : undefined}
                      isComparison={index > 0}
                      isExpanded={scenario.isExpanded}
                      onToggle={() => toggleScenario(scenario.id)}
                    />
                 </div>
               ))}

               {/* Add Comparison Button */}
               {scenarios.length < 2 && (
                 <button 
                   onClick={addScenario}
                   className="flex-1 min-h-[300px] border-2 border-dashed border-white/10 rounded-3xl hover:border-white/30 hover:bg-white/5 transition-all group flex flex-col items-center justify-center p-8"
                 >
                    <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform mb-3">
                       <Plus className="text-gray-400 group-hover:text-white" size={32} />
                    </div>
                    <span className="text-lg font-medium text-gray-500 group-hover:text-gray-300">Add Comparison Scenario</span>
                 </button>
               )}
            </div>

            {/* AI Insights Section (Below Blocks) */}
            <div className="bg-[#0b0c0d]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                  <Sparkles className="text-purple-400" /> 
                  AI Sustainability Insights
                </h3>

                <div className="grid gap-4">
                  {insights.length > 0 ? insights.map((insight, i) => (
                    <div key={i} className={`p-4 rounded-2xl border flex gap-4 ${
                      insight.type === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                      insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
                    }`}>
                       <div className={`mt-1 bg-black/20 p-2 rounded-lg h-fit ${
                          insight.type === 'critical' ? 'text-red-400' :
                          insight.type === 'warning' ? 'text-amber-400' :
                          'text-blue-400'
                       }`}>
                          {insight.type === 'critical' && <Leaf size={20} />}
                          {insight.type === 'warning' && <Zap size={20} />}
                          {insight.type === 'info' && <Sparkles size={20} />}
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-200 text-sm mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-400 leading-relaxed">{insight.text}</p>
                       </div>
                    </div>
                  )) : (
                    <div className="text-gray-500 italic text-center py-4">Configuration looks optimal! No critical improvements found.</div>
                  )}
                </div>
            </div>

         </div>

         {/* Right Side: Sticky Carbon Meter */}
         <div className="xl:w-96 w-full flex-shrink-0 xl:sticky xl:top-8 space-y-6">
            
            {/* Meter A */}
            <CarbonMeter 
               value={metricsA.score} 
               rawCo2={metricsA.annualCO2} 
               label="Scenario A"
            />

            {/* Meter B (if comparing) */}
            {metricsB && (
               <div className="relative">
                  <div className="absolute inset-x-0 -top-4 flex justify-center z-10">
                     <span className="bg-navy-900 text-gray-500 text-xs px-2 py-1 rounded border border-white/10 uppercase font-bold shadow-lg">VS</span>
                  </div>
                  <CarbonMeter 
                    value={metricsB.score} 
                    rawCo2={metricsB.annualCO2} 
                    label="Scenario B"
                    delta={delta}
                  />
               </div>
            )}

         </div>

      </div>

      <div className="border-t border-navy-700/50 pt-8 mt-12">
          <PromptOptimizer />
      </div>

    </div>
  );
}

