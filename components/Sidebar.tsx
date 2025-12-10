
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, FileText, Mic, MessageSquare, TrendingUp, X, UserCircle, Briefcase, Users, BookOpen, LogOut, Trophy, LogIn, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isGuest = user?.role === 'guest';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    logout();
    navigate('/auth');
  }

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
    { to: '/profile', icon: <UserCircle size={20} />, label: 'My Profile' },
    { to: '/roadmap', icon: <Map size={20} />, label: 'Roadmap' },
    { to: '/courses', icon: <BookOpen size={20} />, label: 'Courses & Resources' },
    { to: '/jobs', icon: <Briefcase size={20} />, label: 'Auto-Apply Hub' },
    { to: '/resume', icon: <FileText size={20} />, label: 'Resume & AI Builder' },
    { to: '/mentors', icon: <Users size={20} />, label: 'Mentors' },
    { to: '/interview', icon: <Mic size={20} />, label: 'Mock Interview' },
    { to: '/insights', icon: <TrendingUp size={20} />, label: 'Market Insights' },
    { to: '/mentor', icon: <MessageSquare size={20} />, label: 'AI Assistant' },
  ];

  // Calculate progress to next level
  const xpForCurrentLevel = (user?.gamification?.level || 1) ** 2 * 50;
  const xpForNextLevel = ((user?.gamification?.level || 1) + 1) ** 2 * 50;
  const progressPercent = user ? Math.min(100, Math.max(0, ((user.gamification.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100)) : 0;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggle}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              study2skills
            </span>
          </div>
          <button onClick={toggle} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => window.innerWidth < 768 && toggle()}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              {link.icon}
              <span className="font-medium text-sm">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Gamification Status */}
        {!isGuest && user && (
            <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-slate-400">Level {user.gamification?.level || 1}</span>
                    <span className="text-xs text-indigo-400">{user.gamification?.xp || 0} XP</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>
        )}

        {isGuest && (
             <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800">
                 <p className="text-xs text-slate-500 mb-2">Guest Mode</p>
                 <button 
                   onClick={handleLogin}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-bold"
                 >
                    Create Account
                 </button>
             </div>
        )}

        <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-2">
          {/* Theme Toggle (Replaces Settings) */}
          <button 
            onClick={toggleTheme}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium text-sm">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {!isGuest ? (
            <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 w-full transition-colors"
            >
                <LogOut size={20} />
                <span className="font-medium text-sm">Sign Out</span>
            </button>
          ) : (
             <button 
                onClick={handleLogin}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 w-full transition-colors"
             >
                <LogIn size={20} />
                <span className="font-medium text-sm">Login / Sign Up</span>
             </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
