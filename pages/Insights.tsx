import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { getMarketInsights } from '../services/geminiService';
import { IndustryTrend } from '../types';
import { Loader2, TrendingUp, Briefcase, ExternalLink, Globe } from 'lucide-react';

const Insights: React.FC = () => {
  const [domain, setDomain] = useState('Full Stack Development');
  const [data, setData] = useState<IndustryTrend[]>([]);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getMarketInsights(domain);
    // Ensure we are setting an array
    setData(Array.isArray(result.trends) ? result.trends : []);
    setSources(result.sources || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
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
            <p className="text-slate-500">Scanning job markets & tech blogs via Google Search...</p>
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
                                    {data?.map((entry, index) => (
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
                        {data?.map((item, idx) => (
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

            {/* Grounding Sources */}
            {sources && sources.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-300">
                        <Globe size={18} className="mr-2 text-blue-400"/> Sources Verified by Google Search
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sources.map((source, i) => (
                            <a 
                                key={i} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition group"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-300 truncate group-hover:text-indigo-400">{source.title}</p>
                                    <p className="text-xs text-slate-500 truncate">{source.uri}</p>
                                </div>
                                <ExternalLink size={14} className="text-slate-600 group-hover:text-indigo-500 ml-2" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default Insights;