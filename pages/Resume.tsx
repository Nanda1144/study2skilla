import React, { useState } from 'react';
import { analyzeResume, generateResumeContent } from '../services/geminiService';
import { ResumeAnalysis, UserProfile } from '../types';
import { getCurrentUser } from '../services/storage';
import { FileText, Loader2, Check, AlertTriangle, TrendingUp, Upload, PenTool, Download, Sparkles, Copy, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resume: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'build'>('analyze');
  const currentUser = getCurrentUser();
  
  // Analyze State
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  // Builder State
  const [generatedResume, setGeneratedResume] = useState('');
  const [building, setBuilding] = useState(false);

  // Fallback profile if user hasn't filled details fully (for demo)
  const [profile] = useState<UserProfile>(currentUser || {
    name: "Alex Johnson",
    university: "State Tech University",
    year: "3rd Year",
    domain: "Full Stack Development",
    skills: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    bio: "Passionate developer looking for internships.",
    email: "alex@example.com",
    gamification: {
      xp: 0,
      level: 1,
      badges: [],
      streakDays: 0,
      studyHoursTotal: 0
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          const result = reader.result as string;
          // Remove Data URL prefix
          const base64 = result.split(',')[1];
          resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    let result = null;

    if (file) {
      const base64 = await fileToBase64(file);
      result = await analyzeResume(base64, true, file.type);
    } else if (text.length > 50) {
      result = await analyzeResume(text, false);
    }

    setAnalysis(result);
    setLoading(false);
  };

  const handleBuild = async () => {
    setBuilding(true);
    const content = await generateResumeContent(profile);
    setGeneratedResume(content);
    setBuilding(false);
  };

  const handleDownload = () => {
    if (!generatedResume) return;
    
    // Create a Blob containing the text
    const element = document.createElement("a");
    const file = new Blob([generatedResume], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${profile.name.replace(/\s+/g, '_')}_Resume.md`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);

    // Show feedback
    alert("Resume downloaded as a Markdown file!\n\nYou can now open this file in any text editor to customize, add personal details, or tweak the formatting exactly how you like it.");
  };

  const handleCopyToClipboard = () => {
    if (!generatedResume) return;
    navigator.clipboard.writeText(generatedResume);
    alert("Resume content copied to clipboard!");
  };

  const handleShareResume = () => {
     if (!generatedResume) return;
     // Simulate unique link generation
     const uniqueId = Math.random().toString(36).substring(7);
     const shareUrl = `${window.location.origin}/#/shared-resume/${uniqueId}`;
     navigator.clipboard.writeText(shareUrl);
     alert(`Public sharing link created and copied to clipboard!\n\nLink: ${shareUrl}\n\n(Note: In this demo version, this link simulates the action.)`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500';
    if (score >= 50) return 'text-amber-500 border-amber-500';
    return 'text-rose-500 border-rose-500';
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('analyze')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${activeTab === 'analyze' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          <Upload size={18} className="mr-2" /> Analyze Existing
        </button>
        <button 
          onClick={() => setActiveTab('build')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${activeTab === 'build' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          <PenTool size={18} className="mr-2" /> AI Resume Builder
        </button>
      </div>

      {activeTab === 'analyze' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
          {/* Input Section */}
          <div className="flex flex-col h-full space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center flex-1 border-dashed relative">
                <input 
                  type="file" 
                  accept=".pdf,image/png,image/jpeg" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="text-center">
                    <FileText size={48} className="text-indigo-500 mx-auto mb-2" />
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-slate-500 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload size={48} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-300 font-medium">Drag & Drop Resume (PDF, PNG, JPG)</p>
                    <p className="text-slate-500 text-sm mt-1">or click to browse</p>
                  </div>
                )}
            </div>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-950 text-slate-500">OR PASTE TEXT</span>
                </div>
            </div>

            <textarea
                className="h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Paste raw resume text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!!file}
            />

            <button
              onClick={handleAnalyze}
              disabled={loading || (!text && !file)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center"
            >
              {loading ? <><Loader2 className="animate-spin mr-2" size={20} /> AI Analyzing...</> : 'Analyze Resume'}
            </button>

            <Link to="/jobs" className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-300 py-3 rounded-xl font-medium transition flex items-center justify-center border border-slate-700">
               <Sparkles size={16} className="mr-2" /> 
               Already have a resume? Use Auto-Apply Agent
            </Link>
          </div>

          {/* Results Section */}
          <div className="h-full overflow-y-auto custom-scrollbar bg-slate-900/30 rounded-xl border border-slate-800 p-4">
            {!analysis && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <FileText size={48} className="mb-4 opacity-50" />
                <p>Upload a resume to see AI insights</p>
              </div>
            )}

            {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                     <Loader2 className="animate-spin text-indigo-500" size={40}/>
                     <p className="text-slate-400">Extracting skills & matching domain...</p>
                </div>
            )}

            {analysis && (
              <div className="space-y-6 animate-fade-in pb-10">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wide font-semibold mb-1">Matched Domain</p>
                    <h3 className="text-xl font-bold text-white">{analysis.matchedDomain}</h3>
                  </div>
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${getScoreColor(analysis.score)}`}>
                    <span className="text-2xl font-bold">{analysis.score}</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-emerald-900/30 rounded-xl p-6">
                  <h4 className="flex items-center text-emerald-400 font-semibold mb-3">
                    <Check size={18} className="mr-2" /> Strengths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.strengths?.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full border border-emerald-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-rose-900/30 rounded-xl p-6">
                  <h4 className="flex items-center text-rose-400 font-semibold mb-3">
                    <AlertTriangle size={18} className="mr-2" /> Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills?.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-400 text-sm rounded-full border border-rose-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h4 className="flex items-center text-indigo-400 font-semibold mb-4">
                    <TrendingUp size={18} className="mr-2" /> AI Improvement Plan
                  </h4>
                  <ul className="space-y-3">
                    {analysis.improvementPlan?.map((step, i) => (
                      <li key={i} className="flex items-start text-slate-300 text-sm bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                        <span className="bg-indigo-900 text-indigo-300 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mr-3 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'build' && (
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
             <div className="w-full md:w-1/3 space-y-4 overflow-y-auto pr-2">
                 <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-lg mb-4">Profile Data Source</h3>
                    <p className="text-sm text-slate-400 mb-4">AI uses your profile details to construct a tailored resume.</p>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span className="text-slate-500">Name</span>
                            <span className="text-white">{profile.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span className="text-slate-500">Domain</span>
                            <span className="text-white">{profile.domain}</span>
                        </div>
                         <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span className="text-slate-500">Skills</span>
                            <span className="text-white">{profile.skills.length} listed</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleBuild} 
                        disabled={building}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center transition"
                    >
                        {building ? <Loader2 className="animate-spin mr-2" /> : <Sparkles size={18} className="mr-2" />}
                        Generate Resume
                    </button>
                 </div>
             </div>
             
             <div className="flex-1 bg-white text-slate-900 rounded-xl p-8 overflow-y-auto shadow-xl font-serif relative">
                {generatedResume ? (
                    <div className="prose max-w-none pb-16">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{generatedResume}</pre>
                        
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 w-full justify-center">
                            <button 
                                onClick={handleDownload}
                                className="bg-slate-900 text-white px-5 py-3 rounded-full flex items-center hover:bg-slate-800 shadow-xl transition transform hover:scale-105 text-sm"
                            >
                                <Download size={16} className="mr-2"/> Download File
                            </button>
                            
                            <button 
                                onClick={handleCopyToClipboard}
                                className="bg-indigo-600 text-white px-5 py-3 rounded-full flex items-center hover:bg-indigo-700 shadow-xl transition transform hover:scale-105 text-sm"
                            >
                                <Copy size={16} className="mr-2"/> Copy Text
                            </button>

                            <button 
                                onClick={handleShareResume}
                                className="bg-emerald-600 text-white px-5 py-3 rounded-full flex items-center hover:bg-emerald-700 shadow-xl transition transform hover:scale-105 text-sm"
                            >
                                <Share2 size={16} className="mr-2"/> Share Link
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <FileText size={48} className="mb-4 opacity-30" />
                        <p>Click "Generate Resume" to create a professional CV</p>
                    </div>
                )}
             </div>
          </div>
      )}
    </div>
  );
};

export default Resume;