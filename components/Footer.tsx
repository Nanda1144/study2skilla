import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the AI Roadmap generation work?",
      a: "We utilize Google's advanced Gemini 3 Pro model to analyze current industry standards, university curriculums, and your specific domain choice to construct a personalized, semester-by-semester learning path."
    },
    {
      q: "Is the Resume analysis automated?",
      a: "Yes. Our Resume & AI Builder uses Gemini 2.5 Flash to parse your resume text or PDF, compare it against millions of job descriptions for your target role, and provide instant, actionable feedback."
    },
    {
      q: "Are the courses listed free?",
      a: "We curate a mix of high-quality Free (YouTube, OpenCourseWare) and Paid (Udemy, Coursera) resources. You can filter by 'Free' in the Courses tab to see only no-cost options."
    }
  ];

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-900/50 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Q&A Section */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-900 transition"
                >
                  <span className="font-medium text-slate-200">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} className="text-indigo-400"/> : <ChevronDown size={16} className="text-slate-500"/>}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 bg-slate-900/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center md:text-left">
           {/* Brand */}
           <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                  study2skills
                </span>
              </div>
              <p className="text-slate-500 text-sm">
                Bridging the gap between academic theory and industry reality for engineering students worldwide.
              </p>
           </div>

           {/* Credits */}
           <div className="space-y-2">
              <h4 className="font-bold text-white mb-2">Powered By</h4>
              <div className="flex flex-col space-y-2 text-sm text-slate-400 items-center md:items-start">
                  <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="flex items-center hover:text-indigo-400 transition">
                      <Sparkles size={14} className="mr-2 text-indigo-500"/> Google AI Studio
                  </a>
                  <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noreferrer" className="flex items-center hover:text-indigo-400 transition">
                      <Sparkles size={14} className="mr-2 text-blue-500"/> Gemini 3 Pro & 2.5 Flash
                  </a>
                  <span className="flex items-center">
                      <ExternalLink size={14} className="mr-2"/> React & Tailwind CSS
                  </span>
              </div>
           </div>

           {/* Legal */}
           <div className="space-y-2">
              <h4 className="font-bold text-white mb-2">Resources</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Community Guidelines</a></li>
              </ul>
           </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
           <p>&copy; {new Date().getFullYear()} study2skills. All rights reserved.</p>
           <p className="mt-1 text-xs text-slate-600">
               Disclaimer: AI generated content may vary. Always verify critical career information.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;