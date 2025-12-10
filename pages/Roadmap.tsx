
import React, { useState, useEffect } from 'react';
import { generateRoadmap } from '../services/geminiService';
import { RoadmapData } from '../types';
import { Loader2, CheckCircle, Circle, Book, Code, Layers, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveUserData, getUserData } from '../services/storage';

const Roadmap: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoadmapData | null>(null);

  useEffect(() => {
    // Load saved roadmap on mount
    const saved = getUserData('roadmap');
    if (saved) {
      setData(saved);
      if (saved.domain) setDomain(saved.domain);
    }
  }, []);

  const handleGenerate = async () => {
    if (!domain.trim()) return;
    
    // Guest Check
    if (user?.role === 'guest') {
        if (window.confirm("This is a premium feature. Please sign up to generate personalized roadmaps.\n\nCreate an account now?")) {
            navigate('/auth');
        }
        return;
    }

    setLoading(true);
    const result = await generateRoadmap(domain);
    setData(result);
    if (result) {
      saveUserData('roadmap', result);
    }
    setLoading(false);
  };

  const predefinedDomains = [
    "Full Stack Web Development", "Machine Learning & AI", "DevOps & Cloud", 
    "Cybersecurity", "Blockchain Development", "Data Science"
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">AI Roadmap Generator</h2>
        <p className="text-slate-400">Generate a personalized 8-semester learning path tailored to your engineering goals.</p>
        {user?.role === 'guest' && (
            <div className="mt-4 bg-indigo-900/30 border border-indigo-500/30 p-3 rounded-lg flex items-center text-sm text-indigo-300">
                <Lock size={16} className="mr-2"/> Demo Mode: Sign up to generate custom roadmaps.
            </div>
        )}
      </div>

      {!data && !loading && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
          <h3 className="text-xl font-semibold mb-6">Choose your target domain</h3>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {predefinedDomains.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`px-4 py-2 rounded-full border transition ${
                  domain === d 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="max-w-md mx-auto flex gap-2">
            <input 
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Or type a custom domain (e.g., IoT, AR/VR)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 text-white"
            />
            <button 
              onClick={handleGenerate}
              disabled={!domain}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Generate
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
          <p className="text-lg text-slate-300">Constructing your 4-year path...</p>
          <p className="text-sm text-slate-500 mt-2">Analyzing industry trends and curriculum requirements.</p>
        </div>
      )}

      {data && (
        <div className="space-y-8 animate-fade-in">
           <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
             <div>
               <h3 className="text-xl font-bold text-white">{data.domain} Roadmap</h3>
               <p className="text-sm text-slate-400">8 Semesters • Customized by AI</p>
             </div>
             <div className="flex items-center space-x-4">
                 <span className="flex items-center text-xs text-emerald-400">
                    <Save size={14} className="mr-1"/> Auto-Saved
                 </span>
                 <button onClick={() => setData(null)} className="text-sm text-slate-400 hover:text-white underline">
                   Create New
                 </button>
             </div>
           </div>

           <div className="relative border-l-2 border-indigo-900/50 ml-4 md:ml-8 space-y-12 pb-12">
             {data.roadmap.map((sem, idx) => (
               <div key={idx} className="relative pl-8 md:pl-12">
                 {/* Timeline Dot */}
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                 </div>

                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/30 transition duration-300">
                   <div className="flex flex-wrap justify-between items-start mb-4">
                     <div>
                       <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 block">Semester {sem.semester}</span>
                       <h4 className="text-xl font-bold text-white">{sem.focus}</h4>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                       <div className="flex items-center text-slate-300 font-medium mb-2">
                         <Layers size={16} className="mr-2 text-blue-400" /> Key Skills
                       </div>
                       <ul className="space-y-1">
                         {sem.skills.map((skill, i) => (
                           <li key={i} className="text-sm text-slate-400 flex items-start">
                             <span className="mr-2 text-slate-600">•</span> {skill}
                           </li>
                         ))}
                       </ul>
                     </div>

                     <div className="space-y-2">
                       <div className="flex items-center text-slate-300 font-medium mb-2">
                         <Code size={16} className="mr-2 text-emerald-400" /> Projects
                       </div>
                       <ul className="space-y-1">
                         {sem.projects.map((proj, i) => (
                           <li key={i} className="text-sm text-slate-400 flex items-start">
                             <span className="mr-2 text-slate-600">•</span> {proj}
                           </li>
                         ))}
                       </ul>
                     </div>

                     <div className="space-y-2">
                        <div className="flex items-center text-slate-300 font-medium mb-2">
                         <Book size={16} className="mr-2 text-amber-400" /> Resources
                       </div>
                       <ul className="space-y-1">
                         {sem.resources.map((res, i) => (
                           <li key={i} className="text-sm text-slate-400 flex items-start">
                             <span className="mr-2 text-slate-600">•</span> {res}
                           </li>
                         ))}
                       </ul>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
