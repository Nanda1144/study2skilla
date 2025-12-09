import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, XCircle, Zap, Shield, Target, Users } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              CareerForge AI
            </span>
          </div>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition"
          >
            Login / Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Your AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Engineering Career Path</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Stop guessing what to learn. Get a personalized 4-year roadmap, AI resume analysis, and automated job applications tailored to your dream domain.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button 
               onClick={() => navigate('/auth')}
               className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition flex items-center justify-center"
             >
               Start Your Journey <ArrowRight className="ml-2" />
             </button>
             <button className="bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-700 transition">
               View Demo
             </button>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why CareerForge AI?</h2>
            <p className="text-slate-400">We bridge the gap between academic curriculum and industry demands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Target className="text-indigo-400" size={32}/>, title: "Precision Roadmaps", desc: "Forget generic advice. Get semester-wise plans with specific projects and skills for your chosen domain." },
              { icon: <Zap className="text-amber-400" size={32}/>, title: "Auto-Apply Agent", desc: "Our AI scans job boards, tailors your resume, and applies for you while you sleep." },
              { icon: <Shield className="text-emerald-400" size={32}/>, title: "Secure Data", desc: "Your progress and profile are isolated in a private secure database. Your career is yours alone." },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition">
                <div className="bg-slate-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">How We Compare</h2>
           <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
             <div className="grid grid-cols-4 bg-slate-950 p-6 border-b border-slate-800 font-bold text-slate-400 uppercase text-xs tracking-wider">
               <div className="col-span-1">Feature</div>
               <div className="col-span-1 text-center">Traditional College</div>
               <div className="col-span-1 text-center">Online Course Sites</div>
               <div className="col-span-1 text-center text-indigo-400">CareerForge AI</div>
             </div>
             {[
               { name: "Curriculum Updates", college: "Every 4 Years", course: "Varies", us: "Real-time (AI)" },
               { name: "Personalization", college: "None", course: "Low", us: "100% Tailored" },
               { name: "Job Application", college: "Manual", course: "Manual", us: "Automated Agent" },
               { name: "Mentorship", college: "Limited", course: "None", us: "24/7 AI Mentor" },
               { name: "Cost", college: "$$$$", course: "$$", us: "Free / Affordable" },
             ].map((row, i) => (
               <div key={i} className="grid grid-cols-4 p-6 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition">
                 <div className="col-span-1 font-medium text-white">{row.name}</div>
                 <div className="col-span-1 text-center text-slate-400 text-sm flex justify-center items-center">
                    {row.college.includes('$') || row.college === 'None' || row.college === 'Manual' ? <span className="text-slate-500">{row.college}</span> : row.college}
                 </div>
                 <div className="col-span-1 text-center text-slate-400 text-sm flex justify-center items-center">
                    {row.course}
                 </div>
                 <div className="col-span-1 text-center font-bold text-indigo-400 text-sm flex justify-center items-center">
                    {row.us === 'Real-time (AI)' || row.us === '100% Tailored' ? <CheckCircle size={16} className="mr-2 text-indigo-500"/> : null}
                    {row.us}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500">© 2024 CareerForge AI. Empowering the next generation of engineers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;