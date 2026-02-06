'use client';

import { useEffect, useState } from 'react';
import { UsageChart } from '@/components/charts/UsageChart';
import { ProjectChart } from '@/components/charts/ProjectChart';
import { RefreshCw, Play, Leaf, Zap, BarChart, ArrowRight } from 'lucide-react';
import { PROJECTS } from '@/utils/constants';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('');
  const [simulating, setSimulating] = useState(false);

  // Poll for data
  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        
        // Auto-select first project if none selected or current selection invalid
        if (json.availableProjects && json.availableProjects.length > 0) {
            if (!selectedProject || !json.availableProjects.includes(selectedProject)) {
                setSelectedProject(json.availableProjects[0]);
            }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5s poll
    return () => clearInterval(interval);
  }, []);

  // Automatic Traffic Simulation every 50 seconds
  useEffect(() => {
     const simInterval = setInterval(() => {
        runSimulation();
     }, 50000);
     return () => clearInterval(simInterval);
  }, []);

  const runSimulation = async () => {
    // block simulation if no projects
    if (!data?.availableProjects?.length && !data?.global?.requests) return;

    setSimulating(true);
    try {
      // Run Traffic Gen
      await fetch('/api/cron/traffic');
      
      // Also Sync Connected Projects
      await fetch('/api/connect/sync', { method: 'POST' });

      // Wait for DB/Redis to settle, then fetch fresh data
      setTimeout(() => {
        fetchData(); 
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
        // Stop spinning after a delay to ensure data load is visible
        setTimeout(() => setSimulating(false), 1500);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await fetch('/api/dashboard/download');
      
      if (!response.ok) {
          if (response.status === 403) alert("Access Denied: You are not authorized to download this report.");
          else if (response.status === 404) alert("No data available to download.");
          else alert("Failed to download report.");
          return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Get filename from header or default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `EcoGenAI_Report.csv`;
      if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) filename = match[1];
      }
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      console.error("Download failed:", e);
      alert("An error occurred while downloading the report.");
    }
  };

  const getProjectMetrics = (projectName: string) => {
    if (!data?.projects || !projectName) return { co2: 0, energy: 0, tokens: 0 };
    return data.projects[projectName] || { co2: 0, energy: 0, tokens: 0 };
  };

  const currentProjectMetrics = getProjectMetrics(selectedProject);
  const budget = 50; 
  // Ensure percentage is at least 0. If data is 0, it's 0.
  const usagePercent = Math.min((currentProjectMetrics.co2 / budget) * 100, 100);

  // Sustainability Score Logic
  const getScore = (co2: number) => {
    if (co2 < 200) return 'A';
    if (co2 < 500) return 'B';
    if (co2 < 800) return 'C';
    return 'D';
  };

  if (loading && !data) return <div className="text-gray-400 p-8 flex justify-center">Loading Dashboard...</div>;

  const projectOptions = data?.availableProjects || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 overflow-x-hidden max-w-full">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ESG Analytics Cockpit</h1>
          <p className="text-gray-400">Real-time monitoring of Generative AI Carbon Footprint</p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={runSimulation}
              disabled={simulating || (!data?.availableProjects?.length && !data?.global?.requests)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                 simulating || (!data?.availableProjects?.length && !data?.global?.requests)
                   ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                   : 'bg-eco-green text-navy-900 hover:bg-eco-light shadow-[0_0_15px_rgba(0,255,136,0.3)]'
              }`}
            >
              {simulating ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
              {simulating ? 'Simulating...' : 'Simulate Traffic'}
            </button>
        </div>
      </div>

      {/* Empty State */}
      {(!data?.availableProjects || data.availableProjects.length === 0) && (
          <div className="bg-navy-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm p-8 rounded-3xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 hover:shadow-[0_8px_40px_rgba(16,185,129,0.1)] transition-all">
             <div className="w-16 h-16 bg-eco-green/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-eco-green/20">
                 <Zap className="text-eco-green" size={32} />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Establish Connection</h2>
             <p className="text-gray-400 max-w-lg mb-6 leading-relaxed">
                Connect your LLM provider to start tracking. Your dashboard awaits.
             </p>
             <Link href="/connect" className="bg-eco-green text-navy-900 hover:bg-eco-light px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-eco-green/20 hover:shadow-eco-green/40 hover:scale-[1.02] flex items-center gap-2">
                 Connect Project <ArrowRight size={18} />
             </Link>
          </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { 
              title: "Total CO₂ Emissions", 
              value: `${data?.global.co2 ? Math.round(data.global.co2) : 0} g`, 
              icon: Leaf,
              color: "text-red-400" 
            },
            { 
              title: "Energy Consumed", 
              value: `${data?.global.energy ? parseFloat(data.global.energy).toFixed(4) : 0} kWh`, 
              icon: Zap,
              color: "text-amber-400" 
            },
            { 
              title: "Total Tokens", 
              value: `${data?.global.tokens ? (data.global.tokens / 1000).toFixed(1) : 0} k`, 
              icon: BarChart,
              color: "text-blue-400" 
            },
            { 
              title: "Total Requests", 
              value: data?.global.requests || 0, 
              icon: RefreshCw,
              color: "text-purple-400" 
            },
        ].map((card, i) => (
             <div key={i} className="bg-navy-800/60 backdrop-blur-md p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                   <card.icon size={64} className={card.color} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">{card.title}</h3>
                <div className={`text-3xl font-bold ${card.color} font-mono`}>{card.value}</div>
             </div>
        ))}
      </div>

       {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-navy-800/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/5 h-[400px] flex flex-col hover:shadow-md transition-shadow">
             <h3 className="text-lg font-bold text-white mb-4">Carbon Emission Trends</h3>
             <div className="flex-1 min-h-0">
               {data?.history && data.history.length > 0 ? (
                  <UsageChart data={data.history.filter((h: any) => h && h.ts)} />
               ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">No history data available for your projects.</div>
               )}
             </div>
          </div>
          
          {/* Bar Chart */}
          <div className="bg-navy-800/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/5 h-[400px] flex flex-col hover:shadow-md transition-shadow">
             <h3 className="text-lg font-bold text-white mb-4">Project Impact Analysis</h3>
             <div className="flex-1 min-h-0">
                <ProjectChart metrics={data?.projects || {}} />
             </div>
          </div>
       </div>
       
       {/* Carbon Accounting Engine */}
       <div className="bg-navy-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border-t-4 border-t-eco-green relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-eco-green/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
             <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <Leaf className="text-eco-green" /> Carbon Accounting Engine
                </h3>
                <p className="text-sm text-gray-400">Monitor budget compliance for GHG Protocol Scope 3</p>
             </div>
             
             <div className="flex items-center gap-2">
               <span className="text-gray-400 text-sm">Select Project:</span>
               
               {projectOptions.length > 0 ? (
                   <select 
                     value={selectedProject}
                     onChange={(e) => setSelectedProject(e.target.value)}
                     className="bg-navy-950/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm focus:border-eco-green focus:ring-1 focus:ring-eco-green outline-none min-w-[200px] backdrop-blur-md transition-all"
                   >
                     {projectOptions.map((p: string) => (
                       <option key={p} value={p} className="bg-black">{p}</option>
                     ))}
                   </select>
               ) : (
                    <span className="text-gray-500 text-sm italic">No Projects Connected</span>
               )}
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Progress Bar */}
             <div className="md:col-span-2 space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Monthly Carbon Budget ({budget}g)</span>
                    <span className={usagePercent > 80 ? "text-red-400" : "text-eco-green"}>
                      {usagePercent.toFixed(1)}% Used
                    </span>
                 </div>
                 {/* Fixed: Removed extra borders and ensured width is correct */}
                 <div className="w-full h-4 bg-navy-950/50 rounded-full overflow-hidden relative shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        usagePercent > 80 ? 'bg-red-500' : 'bg-eco-green'
                      }`}
                      style={{ width: `${Math.max(usagePercent, 2)}%` /* Min 2% visibility */ }}
                    />
                 </div>
                 <div className="flex justify-between text-xs text-gray-500">
                    <span>0g</span>
                    <span>{budget}g Limit</span>
                 </div>
             </div>

             {/* Score Card */}
             <div className="bg-navy-950/40 rounded-2xl p-6 flex items-center justify-between border border-white/5 shadow-inner">
                <div>
                   <div className="text-gray-400 text-sm">Sustainability Score</div>
                   <div className="text-xs text-gray-500">Based on recent activity</div>
                </div>
                <div className={`text-4xl font-bold ${
                  getScore(currentProjectMetrics.co2) === 'A' ? 'text-eco-green' : 
                  getScore(currentProjectMetrics.co2) === 'B' ? 'text-blue-400' :
                  'text-red-400'
                }`}>
                   {getScore(currentProjectMetrics.co2)}
                </div>
             </div>
          </div>
       </div>

       <div className="flex justify-center mt-8 pb-8">
          <button 
             onClick={handleDownloadReport}
             className="bg-navy-800/80 border border-white/10 hover:bg-eco-green hover:text-navy-900 hover:border-transparent text-white font-medium py-4 px-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_25px_rgba(0,255,136,0.2)] transition-all duration-300 flex items-center gap-3 group active:scale-[0.98]"
          >
             Download Full Regulatory Report (CSRD/ISO) 
             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
       </div>

    </div>
  );
}
