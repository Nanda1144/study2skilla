
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Resume from './pages/Resume';
import Interview from './pages/Interview';
import Insights from './pages/Insights';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import Mentors from './pages/Mentors';
import Jobs from './pages/Jobs';
import Courses from './pages/Courses';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import { Menu } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-500">Loading...</div>;
  }

  // Not logged in routes
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Admin Routes
  if (user.role === 'admin') {
     return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
           <Sidebar 
             isOpen={isSidebarOpen} 
             toggle={() => setSidebarOpen(!isSidebarOpen)} 
           />
           <div className="flex-1 md:ml-64 p-8">
              <Routes>
                 <Route path="/admin" element={<AdminDashboard />} />
                 <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
           </div>
        </div>
     );
  }

  // Student Routes (Main App)
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Dashboard';
      case '/roadmap': return 'Learning Roadmap';
      case '/resume': return 'Resume AI';
      case '/courses': return 'Courses & Resources';
      case '/interview': return 'Mock Interview';
      case '/insights': return 'Market Insights';
      case '/mentor': return 'AI Assistant';
      case '/profile': return 'Student Profile';
      case '/mentors': return 'Mentorship';
      case '/jobs': return 'Auto-Apply Hub';
      case '/leaderboard': return 'Leaderboard';
      default: return 'study2skills';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar 
         isOpen={isSidebarOpen} 
         toggle={() => setSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center px-6 justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-white">{getPageTitle(location.pathname)}</h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.domain} • Lvl {user.gamification?.level || 1}</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-800 flex items-center justify-center text-sm font-bold">
                 {user.name.charAt(0)}
             </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/mentor" element={<Assistant />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Footer />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
