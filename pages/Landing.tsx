
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, Target, Users, Menu, X } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 sticky top-0 bg-slate-950/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              study2skills
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-300 hover:text-white transition">Features</button>
            <button onClick={() => scrollToSection('comparison')} className="text-sm font-medium text-slate-300 hover:text-white transition">Why Us</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium text-slate-300 hover:text-white transition">Success Stories</button>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition"
            >
              Login / Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 hover:text-white">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4">
             <div className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection('features')} className="text-left text-slate-300 hover:text-white">Features</button>
                <button onClick={() => scrollToSection('comparison')} className="text-left text-slate-300 hover:text-white">Why Us</button>
                <button onClick={() => scrollToSection('testimonials')} className="text-left text-slate-300 hover:text-white">Success Stories</button>
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-center"
                >
                  Login / Sign Up
                </button>
             </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 border border-indigo-500/30 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium">
             start your career now
          </div>
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
             <button onClick={() => scrollToSection('features')} className="bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-700 transition">
               View Features
             </button>
          </div>
          
          <div className="mt-12 flex justify-center gap-8 text-slate-500 grayscale opacity-70">
              {/* Mock Logos */}
              <span className="font-bold text-xl">Google</span>
              <span className="font-bold text-xl">Microsoft</span>
              <span className="font-bold text-xl">Amazon</span>
              <span className="font-bold text-xl">Netflix</span>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why study2skills?</h2>
            <p className="text-slate-400">We bridge the gap between academic curriculum and industry demands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Target className="text-indigo-400" size={32}/>, title: "Precision Roadmaps", desc: "Forget generic advice. Get semester-wise plans with specific projects and skills for your chosen domain." },
              { icon: <Zap className="text-amber-400" size={32}/>, title: "Auto-Apply Agent", desc: "Our AI scans job boards, tailors your resume, and applies for you while you sleep." },
              { icon: <Shield className="text-emerald-400" size={32}/>, title: "Mock Interviews", desc: "Practice with our AI interviewer that adapts to your responses and provides instant feedback." },
              { icon: <Users className="text-purple-400" size={32}/>, title: "Mentorship", desc: "Connect with industry veterans and alumni who have walked the path you are on." },
              { icon: <CheckCircle className="text-blue-400" size={32}/>, title: "Resume Builder", desc: "Upload your resume and get AI-driven scoring and improvement suggestions instantly." },
              { icon: <Zap className="text-rose-400" size={32}/>, title: "Market Insights", desc: "Real-time analysis of job market trends to keep your skills relevant." },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition hover:-translate-y-1">
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
      <section id="comparison" className="py-20">
        <div className="max-w-5xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">How We Compare</h2>
           <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
             <div className="grid grid-cols-4 bg-slate-950 p-6 border-b border-slate-800 font-bold text-slate-400 uppercase text-xs tracking-wider">
               <div className="col-span-1">Feature</div>
               <div className="col-span-1 text-center hidden md:block">Traditional College</div>
               <div className="col-span-1 text-center hidden md:block">Online Course Sites</div>
               <div className="col-span-1 text-center text-indigo-400">study2skills</div>
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
                 <div className="col-span-1 text-center text-slate-400 text-sm hidden md:flex justify-center items-center">
                    {row.college.includes('$') || row.college === 'None' || row.college === 'Manual' ? <span className="text-slate-500">{row.college}</span> : row.college}
                 </div>
                 <div className="col-span-1 text-center text-slate-400 text-sm hidden md:flex justify-center items-center">
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Student Success Stories</h2>
                <p className="text-slate-400">Join thousands of students landing their dream jobs.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: "Alex Johnson", role: "Software Engineer @ Google", quote: "The personalized roadmap was a game changer. It told me exactly what to focus on.", school: "State University" },
                    { name: "Priya Patel", role: "Frontend Dev @ Amazon", quote: "The Resume AI analysis helped me spot keywords I was missing. Got 3x more callbacks.", school: "Tech Institute" },
                    { name: "Michael Chen", role: "Data Scientist @ Netflix", quote: "I used the Auto-Apply agent to find my internship. It saved me hours every week.", school: "City College" }
                ].map((t, i) => (
                    <div key={i} className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 mr-3">
                                {t.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                <p className="text-xs text-indigo-400">{t.role}</p>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm italic">"{t.quote}"</p>
                    </div>
                ))}
             </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-indigo-950/20">
          <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to launch your career?</h2>
              <p className="text-slate-400 mb-8 text-lg">Join the platform that is revolutionizing engineering education.</p>
              <button 
               onClick={() => navigate('/auth')}
               className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30"
             >
               Create Free Account
             </button>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-slate-400 hover:text-white">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white">GitHub</a>
          </div>
          <p className="text-slate-500">© 2024 study2skills. Empowering the next generation of engineers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
