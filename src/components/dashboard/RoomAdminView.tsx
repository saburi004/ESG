'use client';

import { useEffect, useState } from 'react';
import { Users, LayoutGrid, Leaf, Zap, Database } from 'lucide-react';

export default function RoomAdminView({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/room-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading Room Analytics...</div>;

  if (!stats) return <div className="p-8 text-center text-red-400">Failed to load stats.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="bg-navy-800/50 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 tracking-wider uppercase">
               Organization Room
             </span>
             <span className="text-gray-500 font-mono text-sm">ID: {stats.room.roomId}</span>
           </div>
           <h2 className="text-2xl font-bold text-eco-green">Admin Overview</h2>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="text-right">
                <div className="text-3xl font-bold text-white leading-none">{stats.room.totalUsers}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Members</div>
            </div>
            <div className="h-10 w-[1px] bg-white/10"></div>
            <div className="text-right">
                <div className="text-3xl font-bold text-white leading-none">{stats.room.totalProjects}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Projects</div>
            </div>
        </div>
      </div>

      {/* Aggregated Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-navy-800/60 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Leaf className="w-24 h-24 text-emerald-400" />
              </div>
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">Total Carbon Emission</h3>
              <div className="text-4xl font-bold text-emerald-400">{Math.round(stats.aggregated.carbonEmission)} <span className="text-lg text-emerald-400/50 font-normal">gCO2</span></div>
          </div>

          <div className="bg-navy-800/60 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-24 h-24 text-amber-400" />
              </div>
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">Total AI Usage</h3>
              <div className="text-4xl font-bold text-amber-400">
                {(stats.aggregated.aiUsage / 1000).toFixed(1)} <span className="text-lg text-amber-400/50 font-normal">k Tokens</span>
              </div>
          </div>
          
           <div className="bg-navy-800/60 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Database className="w-24 h-24 text-blue-400" />
              </div>
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">Active Projects</h3>
              <div className="text-4xl font-bold text-blue-400">
                 {stats.room.totalProjects} <span className="text-lg text-blue-400/50 font-normal">Connectors</span>
              </div>
          </div>
      </div>

      {/* Member List */}
      <div className="bg-navy-800/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
         <div className="p-6 border-b border-white/5">
             <h3 className="text-lg font-bold text-eco-green flex items-center gap-2">
                 <Users className="text-emerald-500" size={20} /> Room Members
             </h3>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left">
                 <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                     <tr>
                         <th className="p-4">Name</th>
                         <th className="p-4">Email</th>
                         <th className="p-4">Role</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                     {stats.members.map((member: any) => (
                         <tr key={member._id} className="hover:bg-white/5 transition-colors">
                             <td className="p-4 font-medium text-white">{member.name}</td>
                             <td className="p-4 text-gray-400">{member.email}</td>
                             <td className="p-4">
                                {member.role === 'ADMIN' ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Admin
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-300 border border-white/10">
                                        Member
                                    </span>
                                )}
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>

    </div>
  );
}
