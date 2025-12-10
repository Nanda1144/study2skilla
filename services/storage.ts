
import { UserProfile, Badge, AdminStats } from '../types';

const USERS_KEY = 'study2skills_users';
const CURRENT_USER_KEY = 'study2skills_session';

// Helper to get all users from "DB"
export const getStoredUsers = (): UserProfile[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Register a new user
export const registerUser = (profile: UserProfile, password: string): UserProfile => {
  const users = getStoredUsers();
  if (users.find(u => u.email === profile.email)) {
    throw new Error("User already exists");
  }
  
  const role: 'student' | 'admin' = profile.email.includes('admin') ? 'admin' : 'student';
  
  // Initialize with Gamification defaults
  const newUser: UserProfile = { 
    ...profile, 
    id: Date.now().toString(),
    role: role,
    status: 'active',
    gamification: {
      xp: 0,
      level: 1,
      badges: [
        { id: '1', name: 'Newbie', description: 'Joined the platform', icon: '🌱', dateEarned: new Date().toISOString() }
      ],
      streakDays: 1,
      studyHoursTotal: 0
    }
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Initialize empty user-specific data if needed
  localStorage.setItem(`data_${newUser.id}_roadmap`, JSON.stringify(null));
  
  return newUser;
};

// Login user
export const loginUser = (email: string, password: string): UserProfile => {
  // Hardcoded Admin for Demo
  if (email === 'admin@study2skills.com' && password === 'admin123') {
    const adminUser: UserProfile = {
      id: 'admin_001',
      name: 'System Admin',
      email: email,
      role: 'admin',
      domain: 'Administration',
      university: 'N/A',
      year: 'N/A',
      skills: [],
      bio: 'Administrator',
      status: 'active',
      gamification: { xp: 99999, level: 99, badges: [], streakDays: 999, studyHoursTotal: 9999 }
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
    return adminUser;
  }

  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.status === 'disabled') {
    throw new Error("Account has been disabled by administrator.");
  }
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Get current session
export const getCurrentUser = (): UserProfile | null => {
  const session = localStorage.getItem(CURRENT_USER_KEY);
  return session ? JSON.parse(session) : null;
};

// Update user profile
export const updateUserProfile = (updatedProfile: UserProfile): void => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.email === updatedProfile.email);

  if (index !== -1) {
    users[index] = { ...users[index], ...updatedProfile };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Update current session
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedProfile));
};

// Admin: Toggle User Status
export const toggleUserStatus = (email: string) => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    user.status = user.status === 'active' ? 'disabled' : 'active';
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

// Admin: Get Stats
export const getAdminStats = (): AdminStats => {
  const users = getStoredUsers();
  const activeUsers = users.filter(u => u.status !== 'disabled').length;
  
  // Aggregate domains
  const domainMap: Record<string, number> = {};
  users.forEach(u => {
    domainMap[u.domain] = (domainMap[u.domain] || 0) + 1;
  });
  const domainDistribution = Object.keys(domainMap).map(key => ({ name: key, value: domainMap[key] }));

  return {
    totalUsers: users.length,
    activeUsers,
    growth: 12.5, // Mock growth
    domainDistribution
  };
};

// Gamification: Get Leaderboard
export const getLeaderboardData = (): UserProfile[] => {
  let users = getStoredUsers();
  
  // Mock data if strictly local empty db
  if (users.length < 5) {
     const mockUsers: UserProfile[] = [
         { id: 'm1', name: 'Jordan Lee', university: 'MIT', year: '4th', domain: 'AI/ML', email: 'j@test.com', skills: [], bio: '', status: 'active', gamification: { xp: 4500, level: 12, badges: [], streakDays: 45, studyHoursTotal: 120 } },
         { id: 'm2', name: 'Priya Patel', university: 'IIT Bombay', year: '3rd', domain: 'Full Stack', email: 'p@test.com', skills: [], bio: '', status: 'active', gamification: { xp: 3800, level: 10, badges: [], streakDays: 30, studyHoursTotal: 95 } },
         { id: 'm3', name: 'Carlos Gomez', university: 'Stanford', year: '2nd', domain: 'Blockchain', email: 'c@test.com', skills: [], bio: '', status: 'active', gamification: { xp: 3200, level: 8, badges: [], streakDays: 12, studyHoursTotal: 80 } },
         { id: 'm4', name: 'Sarah Kim', university: 'NYU', year: '1st', domain: 'Data Science', email: 's@test.com', skills: [], bio: '', status: 'active', gamification: { xp: 2100, level: 6, badges: [], streakDays: 5, studyHoursTotal: 40 } },
     ];
     users = [...users, ...mockUsers];
  }

  // Sort by XP descending
  return users.sort((a, b) => b.gamification.xp - a.gamification.xp);
};

// Gamification: Add XP Helper
export const addXP = (user: UserProfile, amount: number): UserProfile => {
  const newXP = user.gamification.xp + amount;
  // Simple Level Formula: Level = sqrt(XP / 100)
  const newLevel = Math.floor(Math.sqrt(newXP / 50)) + 1;
  
  const updatedUser = {
      ...user,
      gamification: {
          ...user.gamification,
          xp: newXP,
          level: newLevel
      }
  };
  
  updateUserProfile(updatedUser);
  return updatedUser;
};

// Save user specific data (Roadmap, etc)
export const saveUserData = (key: string, data: any) => {
  const user = getCurrentUser();
  if (!user || !user.id) return;
  localStorage.setItem(`data_${user.id}_${key}`, JSON.stringify(data));
};

// Get user specific data
export const getUserData = (key: string) => {
  const user = getCurrentUser();
  if (!user || !user.id) return null;
  const data = localStorage.getItem(`data_${user.id}_${key}`);
  return data ? JSON.parse(data) : null;
};
