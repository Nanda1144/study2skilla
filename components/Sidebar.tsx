import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, FileText, Mic, MessageSquare, TrendingUp, Menu, X, UserCircle, Briefcase, Users, BookOpen, Settings, LogOut } from 'lucide-react';
import { logoutUser } from '../services/storage';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    onLogout();
    navigate('/');
  };

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
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
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              CareerForge
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

        <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-2">
          <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-colors">
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;