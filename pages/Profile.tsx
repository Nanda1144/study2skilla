
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Award, BookOpen, Clock, Save, Check, Trophy, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSaveBio = () => {
    if (!user) return;
    setIsSaving(true);
    
    // Create new user object
    const updatedUser = { ...user, bio };
    updateUser(updatedUser);
    
    // Simulate slight delay for effect
    setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  if (!user) {
    return <div className="text-center p-10 text-slate-400">Loading profile...</div>;
  }

  // Potential Badges (Mock)
  const allBadges = [
    { id: '1', name: 'Newbie', description: 'Joined the platform', icon: '🌱' },
    { id: '2', name: 'Code Warrior', description: 'Completed 10 study hours', icon: '⚔️' },
    { id: '3', name: 'Bug Hunter', description: 'Fixed 5 projects', icon: '🐞' },
    { id: '4', name: 'Night Owl', description: 'Studied after midnight', icon: '🦉' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white">
                {user.name.charAt(0)}
            </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-slate-400">{user.university} • {user.year}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30">
                    {user.domain}
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">
                    Level {user.gamification?.level || 1}
                </span>
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Edit Details
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Public View
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress & Badges */}
          <div className="md:col-span-2 space-y-6">
              
              {/* Trophy Case */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Trophy size={20} className="mr-2 text-amber-400"/> Trophy Case
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {allBadges.map(badge => {
                          const isUnlocked = user.gamification?.badges?.find(b => b.name === badge.name);
                          return (
                            <div key={badge.id} className={`p-4 rounded-xl border flex flex-col items-center text-center ${isUnlocked ? 'bg-slate-800 border-slate-700' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                                <div className="text-3xl mb-2">{isUnlocked ? badge.icon : <Lock size={24} className="text-slate-600"/>}</div>
                                <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                                <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
                            </div>
                          )
                      })}
                  </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Award size={20} className="mr-2 text-indigo-400"/> Skill Progress
                  </h3>
                  <div className="space-y-4">
                      {user.skills.length > 0 ? user.skills.map((skill, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="text-slate-300">{skill}</span>
                                  <span className="text-slate-500">Level {Math.floor(Math.random() * 5) + 3}</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div className="bg-indigo-500 h-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                              </div>
                          </div>
                      )) : (
                          <p className="text-slate-500 text-sm">No skills listed yet. Complete roadmap items to add skills.</p>
                      )}
                  </div>
              </div>
          </div>

          {/* Bio & Stats */}
          <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">About Me</h3>
                      <button 
                        onClick={handleSaveBio}
                        disabled={isSaving || bio === user.bio}
                        className={`flex items-center text-xs px-3 py-1.5 rounded-lg transition ${
                            saveSuccess 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-800'
                        }`}
                      >
                        {saveSuccess ? <Check size={14} className="mr-1"/> : <Save size={14} className="mr-1"/>}
                        {saveSuccess ? 'Saved' : isSaving ? 'Saving...' : 'Save'}
                      </button>
                  </div>
                  <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 text-sm focus:outline-none focus:border-indigo-500 min-h-[140px] resize-none leading-relaxed"
                      placeholder="Tell us about your career goals and interests..."
                  />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Clock size={20} className="mr-2 text-amber-400"/> Activity Stats
                  </h3>
                  <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Total XP</span>
                          <span className="text-white font-bold">{user.gamification?.xp || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Study Hours</span>
                          <span className="text-white font-bold">{user.gamification?.studyHoursTotal || 0}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Current Streak</span>
                          <span className="text-emerald-400 font-bold">{user.gamification?.streakDays || 0} days</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Profile;
