
import React, { useState, useEffect } from 'react';
import { JobAutomation } from '../types';
import { Play, Pause, CheckCircle, Mail, FileText, Loader2, Send, Eye, X } from 'lucide-react';
import { generateJobApplication } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const [isAutomating, setIsAutomating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobAutomation[]>([
    { id: '1', role: 'Frontend Intern', company: 'TechStart Inc.', status: 'Scanning', matchScore: 92 },
    { id: '2', role: 'React Developer', company: 'BuildFast', status: 'Scanning', matchScore: 88 },
    { id: '3', role: 'Jr. Software Engineer', company: 'InnovateCorp', status: 'Scanning', matchScore: 75 },
  ]);
  
  const [selectedJob, setSelectedJob] = useState<JobAutomation | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const processJobs = async () => {
       if (!isAutomating || !user) return;

       // Find first job that isn't Applied
       const jobIndex = jobs.findIndex(j => j.status !== 'Applied');
       if (jobIndex === -1) {
           setIsAutomating(false);
           setLogs(prev => ["All jobs applied!", ...prev]);
           return;
       }

       const job = jobs[jobIndex];
       
       // State Machine
       if (job.status === 'Scanning') {
           setLogs(prev => [`Scanning job: ${job.role} at ${job.company}...`, ...prev]);
           await new Promise(r => setTimeout(r, 1500));
           
           setJobs(prev => {
               const newJobs = [...prev];
               newJobs[jobIndex].status = 'Tailoring Resume';
               return newJobs;
           });
       } 
       else if (job.status === 'Tailoring Resume') {
           setLogs(prev => [`AI tailoring resume for ${job.company}...`, ...prev]);
           // Simulate processing time
           await new Promise(r => setTimeout(r, 1500));
           
           setJobs(prev => {
               const newJobs = [...prev];
               newJobs[jobIndex].status = 'Genering Cover Letter';
               return newJobs;
           });
       }
       else if (job.status === 'Genering Cover Letter') {
           setLogs(prev => [`Generating custom cover letter for ${job.role}...`, ...prev]);
           
           // Real AI Call
           const aiResult = await generateJobApplication(user, job.role, job.company);
           
           setJobs(prev => {
               const newJobs = [...prev];
               newJobs[jobIndex].status = 'Emailing';
               if (aiResult) {
                  newJobs[jobIndex].coverLetter = aiResult.coverLetter;
                  newJobs[jobIndex].tailoredSummary = aiResult.tailoredSummary;
               }
               return newJobs;
           });
       }
       else if (job.status === 'Emailing') {
           setLogs(prev => [`Sending application to ${job.company} HR...`, ...prev]);
           await new Promise(r => setTimeout(r, 1000));
           
           setJobs(prev => {
               const newJobs = [...prev];
               newJobs[jobIndex].status = 'Applied';
               return newJobs;
           });
           setLogs(prev => [`Successfully applied to ${job.company}!`, ...prev]);
       }

       // Loop
       timeout = setTimeout(processJobs, 1000);
    };

    if (isAutomating) {
        processJobs();
    }

    return () => clearTimeout(timeout);
  }, [isAutomating, jobs, user]);

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
                            {job.coverLetter && (
                                <button 
                                  onClick={() => setSelectedJob(job)}
                                  className="text-slate-400 hover:text-white"
                                  title="View Generated Application"
                                >
                                    <Eye size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col font-mono text-sm">
          <div className="border-b border-slate-800 pb-2 mb-2 font-bold text-slate-400 flex justify-between">
              <span>LIVE LOGS</span>
              {isAutomating && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 opacity-80 custom-scrollbar">
              {logs.map((log, i) => (
                  <div key={i} className="text-emerald-500/80">
                      <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                      {log}
                  </div>
              ))}
              {!isAutomating && logs.length === 0 && <div className="text-slate-600 italic">Waiting to start...</div>}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>EMAILS SENT</span>
                  <span className="text-white font-bold text-lg">{jobs.filter(j => j.status === 'Applied').length}</span>
              </div>
          </div>
      </div>

      {/* Generated Content Modal */}
      {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-white">Application: {selectedJob.role}</h3>
                      <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                      <div className="mb-6">
                          <h4 className="text-indigo-400 font-semibold mb-2">Tailored Resume Summary</h4>
                          <div className="bg-slate-800 p-3 rounded-lg text-sm text-slate-300 italic">
                              "{selectedJob.tailoredSummary}"
                          </div>
                      </div>
                      <div>
                          <h4 className="text-emerald-400 font-semibold mb-2">Generated Cover Letter</h4>
                          <div className="bg-white text-slate-900 p-6 rounded-lg text-sm whitespace-pre-wrap font-serif leading-relaxed">
                              {selectedJob.coverLetter}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Jobs;
