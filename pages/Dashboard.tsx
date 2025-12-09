import React from 'react';
import { BookOpen, Target, Award, Clock, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Alex!</h2>
          <p className="text-indigo-100 max-w-xl">
            You're on track with your Full Stack Development journey. You've completed 65% of your Semester 5 goals. 
            Company demand for React & Node.js is up 12% this week.
          </p>
          <div className="mt-6 flex space-x-3">
             <NavLink to="/roadmap" className="bg-white text-indigo-700 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-lg">
               Continue Roadmap
             </NavLink>
             <NavLink to="/interview" className="bg-indigo-800/50 backdrop-blur text-white border border-indigo-400/30 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition">
               Practice Interview
             </NavLink>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Target className="text-blue-400" />, label: 'Current Focus', value: 'System Design', sub: 'Semester 5' },
          { icon: <BookOpen className="text-emerald-400" />, label: 'Skills Mastered', value: '14 / 22', sub: 'On Track' },
          { icon: <Clock className="text-amber-400" />, label: 'Study Hours', value: '32h', sub: 'This Week' },
          { icon: <Award className="text-purple-400" />, label: 'Resume Score', value: '72/100', sub: 'Needs Improvement' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{stat.sub}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100">{stat.value}</h3>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Actions */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
          <div className="space-y-3">
            {[
              { title: 'Complete "Advanced React Patterns"', type: 'Course', time: '2h remaining', priority: 'High', color: 'text-rose-400' },
              { title: 'Mock Interview: Data Structures', type: 'Practice', time: '30m', priority: 'Medium', color: 'text-amber-400' },
              { title: 'Update Resume with "GraphQL" Project', type: 'Profile', time: '15m', priority: 'Low', color: 'text-blue-400' },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-800 hover:border-slate-700 transition group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <h4 className="font-medium text-slate-200 group-hover:text-white">{task.title}</h4>
                    <p className="text-xs text-slate-500">{task.type} • {task.time}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-600 group-hover:text-indigo-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Skill Gap Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Docker & Kubernetes</span>
                <span className="text-rose-400 font-medium">Critical Gap</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full">
                <div className="bg-rose-500 h-2 rounded-full w-[20%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">System Design</span>
                <span className="text-amber-400 font-medium">Learning</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full">
                <div className="bg-amber-500 h-2 rounded-full w-[45%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Advanced React</span>
                <span className="text-emerald-400 font-medium">Proficient</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full">
                <div className="bg-emerald-500 h-2 rounded-full w-[85%]"></div>
              </div>
            </div>
            <button className="w-full mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-medium text-center">
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;