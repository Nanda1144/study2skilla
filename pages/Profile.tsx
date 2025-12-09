import React from 'react';
import { UserProfile } from '../types';
import { User, Shield, Award, BookOpen, Clock } from 'lucide-react';

const Profile: React.FC = () => {
  // Mock data - in a real app this comes from DB
  const profile: UserProfile = {
    name: "Alex Johnson",
    university: "Tech State University",
    year: "3rd Year",
    domain: "Full Stack Development",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    bio: "Passionate about building scalable web applications and solving real-world problems through code.",
    email: "alex.j@example.university.edu"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white">
                AJ
            </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-slate-400">{profile.university} • {profile.year}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30">
                    {profile.domain}
                </span>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-300 rounded-full text-sm border border-amber-500/20 flex items-center">
                    <Shield size={12} className="mr-1" /> Blockchain Verified
                </span>
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Edit Profile
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Public View
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Section */}
          <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Award size={20} className="mr-2 text-indigo-400"/> Skill Progress
                  </h3>
                  <div className="space-y-4">
                      {profile.skills.map((skill, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="text-slate-300">{skill}</span>
                                  <span className="text-slate-500">Level {Math.floor(Math.random() * 5) + 3}</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div className="bg-indigo-500 h-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                   <h3 className="text-lg font-bold mb-4 flex items-center">
                      <BookOpen size={20} className="mr-2 text-emerald-400"/> Current Roadmap Status
                  </h3>
                  <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <div>
                          <p className="text-sm text-slate-500">Semester 5 Focus</p>
                          <p className="font-semibold text-white">Advanced Backend & Microservices</p>
                      </div>
                      <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-400">72%</p>
                          <p className="text-xs text-slate-500">Completed</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Stats / Bio */}
          <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">About Me</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                      {profile.bio}
                  </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Clock size={20} className="mr-2 text-amber-400"/> Activity
                  </h3>
                  <ul className="space-y-3">
                      <li className="text-sm text-slate-400 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                          Completed "React Patterns"
                      </li>
                       <li className="text-sm text-slate-400 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                          Updated Resume
                      </li>
                       <li className="text-sm text-slate-400 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                          Applied to 3 Internships
                      </li>
                  </ul>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Profile;