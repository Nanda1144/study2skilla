
import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-900/50 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        
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
