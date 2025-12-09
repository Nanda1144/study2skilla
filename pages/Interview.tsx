import React, { useState, useEffect } from 'react';
import { generateInterviewQuestion, getInterviewFeedback } from '../services/geminiService';
import { InterviewFeedback, InterviewType } from '../types';
import { Mic, Send, Play, RefreshCw, Award, Bot, Loader2 } from 'lucide-react';

const Interview: React.FC = () => {
  const [mode, setMode] = useState<InterviewType>(InterviewType.TECHNICAL);
  const [domain, setDomain] = useState('Frontend Development');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);

  const startNewQuestion = async () => {
    setLoadingQuestion(true);
    setFeedback(null);
    setAnswer('');
    const q = await generateInterviewQuestion(domain, mode);
    setQuestion(q);
    setLoadingQuestion(false);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setAnalyzing(true);
    const fb = await getInterviewFeedback(question, answer, mode);
    setFeedback(fb);
    setAnalyzing(false);
  };

  useEffect(() => {
    startNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Mock Interview</h2>
          <p className="text-slate-400">Practice makes perfect. Get instant feedback on your answers.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
           {(Object.values(InterviewType) as string[]).map((t) => (
             <button
               key={t}
               onClick={() => {
                   setMode(t as InterviewType);
                   setTimeout(startNewQuestion, 100);
               }}
               className={`px-3 py-1.5 text-sm rounded-md transition ${mode === t ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Question Section */}
        <div className={`p-8 ${mode === InterviewType.SKEPTICAL_CTO ? 'bg-slate-950 border-b border-red-900/30' : 'bg-slate-800/50 border-b border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${mode === InterviewType.SKEPTICAL_CTO ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
              {mode === InterviewType.SKEPTICAL_CTO ? 'Hard Mode: Skeptical CTO' : 'AI Interviewer'}
            </span>
            <button onClick={startNewQuestion} className="text-slate-400 hover:text-white transition" title="New Question">
              <RefreshCw size={18} className={loadingQuestion ? "animate-spin" : ""} />
            </button>
          </div>
          
          {loadingQuestion ? (
            <div className="h-16 flex items-center">
                <span className="text-slate-400 animate-pulse">Generative AI is thinking of a question...</span>
            </div>
          ) : (
            <h3 className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed">"{question}"</h3>
          )}
        </div>

        {/* Answer Section */}
        <div className="flex-1 p-6 flex flex-col space-y-4">
          {!feedback ? (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <div className="flex justify-between items-center">
                 <button className="text-slate-500 hover:text-slate-300 flex items-center text-sm">
                    <Mic size={16} className="mr-2" /> Dictate Answer (Coming Soon)
                 </button>
                 <button 
                   onClick={handleSubmit} 
                   disabled={analyzing || !answer.trim()}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center transition disabled:opacity-50"
                 >
                   {analyzing ? <Loader2 className="animate-spin mr-2" size={18}/> : <Send size={18} className="mr-2"/>}
                   Submit Answer
                 </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in space-y-6">
              {/* Score Header */}
              <div className="flex items-center space-x-4">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 ${
                     feedback.score >= 80 ? 'border-emerald-500 text-emerald-400' : 
                     feedback.score >= 60 ? 'border-amber-500 text-amber-400' : 'border-rose-500 text-rose-400'
                 }`}>
                   {feedback.score}
                 </div>
                 <div>
                    <h4 className="font-bold text-white text-lg">Feedback Analysis</h4>
                    <p className="text-slate-400 text-sm">Here is how you performed.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h5 className="text-rose-400 font-semibold mb-2 flex items-center"><Bot size={16} className="mr-2"/> Critiques</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">{feedback.feedback}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h5 className="text-emerald-400 font-semibold mb-2 flex items-center"><Award size={16} className="mr-2"/> Better Answer</h5>
                    <p className="text-slate-300 text-sm leading-relaxed italic">"{feedback.betterAnswer}"</p>
                </div>
              </div>

              <button 
                onClick={startNewQuestion}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition font-medium"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;