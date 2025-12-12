
import React, { useEffect, useState } from 'react';
import { getLeaderboardData } from '../services/storage';
import { UserProfile } from '../types';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
        const data = await getLeaderboardData();
        setLeaderboard(data);
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown size={24} className="text-amber-400 fill-amber-400" />;
      case 1: return <Medal size={24} className="text-slate-300 fill-slate-300" />;
      case 2: return <Medal size={24} className="text-amber-700 fill-amber-700" />;
      default: return <span className="font-bold text-slate-500 w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Global Leaderboard</h2>
        <p className="text-slate-400">Compete with engineers worldwide. Earn XP by learning and building.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {leaderboard.slice(0, 3).map((u, i) => (
             <div key={u.id} className={`relative flex flex-col items-center p-6 rounded-2xl border ${i === 0 ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-500/50 transform md:-translate-y-4' : 'bg-slate-900 border-slate-800'}`}>
                 {i === 0 && <div className="absolute -top-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-amber-500/20">TOP STUDENT</div>}
                 <div className="mb-4">
                     <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${
                         i === 0 ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 
                         i === 1 ? 'border-slate-300 text-slate-300 bg-slate-300/10' : 
                         'border-amber-700 text-amber-700 bg-amber-700/10'
                     }`}>
                         {u.name.charAt(0)}
                     </div>
                 </div>
                 <h3 className="text-xl font-bold text-white">{u.name}</h3>
                 <p className="text-sm text-slate-400 mb-2">{u.domain}</p>
                 <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-full">
                     <span className="text-xs font-bold text-indigo-400">Lvl {u.gamification?.level || 1}</span>
                     <span className="text-slate-600">|</span>
                     <span className="text-xs font-bold text-emerald-400">{u.gamification?.xp || 0} XP</span>
                 </div>
             </div>
          ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center">
            <Trophy className="text-indigo-400 mr-2" size={20} />
            <h3 className="font-bold text-white">Rankings</h3>
        </div>
        <div className="divide-y divide-slate-800">
            {leaderboard.map((u, index) => (
                <div key={u.id} className={`flex items-center justify-between p-4 hover:bg-slate-800/50 transition ${user?.email === u.email ? 'bg-indigo-900/20 border-l-4 border-indigo-500' : ''}`}>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 flex justify-center">
                            {getRankIcon(index)}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                            {u.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className={`font-bold ${user?.email === u.email ? 'text-indigo-400' : 'text-white'}`}>
                                {u.name} {user?.email === u.email && '(You)'}
                            </h4>
                            <p className="text-xs text-slate-500">{u.university}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-500">Streak</p>
                            <p className="font-bold text-white">{u.gamification?.streakDays || 0} 🔥</p>
                        </div>
                        <div className="text-right w-24">
                            <p className="text-xs text-slate-500">Total XP</p>
                            <p className="font-bold text-emerald-400">{u.gamification?.xp || 0}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
