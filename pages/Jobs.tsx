import React, { useState, useEffect } from 'react';
import { JobAutomation } from '../types';
import { Play, Pause, CheckCircle, Mail, FileText, Loader2, Send } from 'lucide-react';

const Jobs: React.FC = () => {
  const [isAutomating, setIsAutomating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobAutomation[]>([
    { id: '1', role: 'Frontend Intern', company: 'TechStart Inc.', status: 'Scanning', matchScore: 92 },
    { id: '2', role: 'React Developer', company: 'BuildFast', status: 'Scanning', matchScore: 88 },
    { id: '3', role: 'Jr. Software Engineer', company: 'InnovateCorp', status: 'Scanning', matchScore: 75 },
  ]);

  useEffect(() => {
    let interval: any;
    if (isAutomating) {
      interval = setInterval(() => {
        setJobs(prev => prev.map(job => {
          if (job.status === 'Scanning') return { ...job, status: 'Tailoring Resume' };
          if (job.status === 'Tailoring Resume') return { ...job, status: 'Genering Cover Letter' };
          if (job.status === 'Genering Cover Letter') return { ...job, status: 'Emailing' };
          if (job.status === 'Emailing') return { ...job, status: 'Applied' };
          return job;
        }));
        
        const actions = ["Found new listing at startup...", "Analyzing keywords...", "Generating custom cover letter...", "Sending email to hr@company.com..."];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        setLogs(prev => [randomAction, ...prev].slice(0, 10));

      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutomating]);

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Applied': return 'text-emerald-400';
        case 'Emailing': return 'text-amber-400';
        default: return 'text-indigo-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-2 flex flex-col space-y-6">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-2">Auto-Apply Hub</h2>
            <p className="text-indigo-200 mb-6">AI autonomously scans job boards, tailors your resume, generates cover letters, and sends emails to recruiters.</p>
            
            <button 
                onClick={() => setIsAutomating(!isAutomating)}
                className={`flex items-center px-6 py-3 rounded-xl font-bold text-white transition shadow-lg ${isAutomating ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
                {isAutomating ? <><Pause className="mr-2" /> Pause Automation</> : <><Play className="mr-2" /> Start AI Agent</>}
            </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex-1">
            <div className="p-4 border-b border-slate-800 font-semibold text-slate-300">Target Queue</div>
            <div className="divide-y divide-slate-800">
                {jobs.map(job => (
                    <div key={job.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition">
                        <div>
                            <h4 className="font-bold text-white">{job.role}</h4>
                            <p className="text-sm text-slate-400">{job.company}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-end">
                                <span className={`text-sm font-medium ${getStatusColor(job.status)} flex items-center`}>
                                    {job.status === 'Applied' ? <CheckCircle size={14} className="mr-1"/> : <Loader2 size={14} className="mr-1 animate-spin"/>}
                                    {job.status}
                                </span>
                                <span className="text-xs text-slate-500">{job.matchScore}% Match</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col font-mono text-sm">
          <div className="border-b border-slate-800 pb-2 mb-2 font-bold text-slate-400 flex justify-between">
              <span>LIVE LOGS</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 opacity-80">
              {logs.map((log, i) => (
                  <div key={i} className="text-emerald-500/80">
                      <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                      {log}
                  </div>
              ))}
              {!isAutomating && <div className="text-slate-600 italic">Waiting to start...</div>}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>EMAILS SENT</span>
                  <span className="text-white font-bold text-lg">142</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>INTERVIEWS BOOKED</span>
                  <span className="text-white font-bold text-lg">3</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Jobs;