import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { getMarketInsights } from '../services/geminiService';
import { IndustryTrend } from '../types';
import { Loader2, TrendingUp, Briefcase } from 'lucide-react';

const Insights: React.FC = () => {
  const [domain, setDomain] = useState('Full Stack Development');
  const [data, setData] = useState<IndustryTrend[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getMarketInsights(domain);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2">Market Insights</h2>
        <p className="text-slate-400">Real-time AI analysis of skill demand and industry growth.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input 
            type="text" 
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-white"
            placeholder="Enter Industry Domain..."
        />
        <button 
            onClick={fetchData} 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
            Analyze Market
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
            <p className="text-slate-500">Scanning job markets & tech blogs...</p>
        </div>
      ) : (
        <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-6 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-indigo-400"/> Top 5 In-Demand Skills
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false}/>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    cursor={{fill: '#334155', opacity: 0.4}}
                                />
                                <Bar dataKey="demand" radius={[0, 4, 4, 0]} barSize={20}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                     <h3 className="text-lg font-semibold mb-6 flex items-center">
                        <Briefcase size={20} className="mr-2 text-emerald-400"/> YoY Growth Projections
                    </h3>
                    <div className="space-y-4">
                        {data.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-slate-300 font-medium">{item.name}</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-slate-800 h-2 rounded-full mr-3 overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500" 
                                            style={{ width: `${Math.min(item.growth * 2, 100)}%` }} // Scaling for visual
                                        ></div>
                                    </div>
                                    <span className="text-emerald-400 font-mono text-sm">+{item.growth}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Static Insights Component for MVP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-6 rounded-xl">
                     <p className="text-slate-500 text-xs uppercase font-bold mb-2">Highest Paying Role</p>
                     <h4 className="text-xl font-bold text-white">Solutions Architect</h4>
                     <p className="text-emerald-400 mt-2 text-sm">Avg. $145k/yr</p>
                 </div>
                 <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-6 rounded-xl">
                     <p className="text-slate-500 text-xs uppercase font-bold mb-2">Emerging Sector</p>
                     <h4 className="text-xl font-bold text-white">Edge AI</h4>
                     <p className="text-indigo-400 mt-2 text-sm">Hardware + ML</p>
                 </div>
                 <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-6 rounded-xl">
                     <p className="text-slate-500 text-xs uppercase font-bold mb-2">Recruiter Activity</p>
                     <h4 className="text-xl font-bold text-white">Very High</h4>
                     <p className="text-amber-400 mt-2 text-sm">Q3 Hiring Surge</p>
                 </div>
            </div>
        </>
      )}
    </div>
  );
};

export default Insights;