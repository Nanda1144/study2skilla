
import { UserProfile, Badge, AdminStats, ResumeVersion } from '../types';

const USERS_KEY = 'study2skills_users';
const CURRENT_USER_KEY = 'study2skills_session';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get all users from "DB"
export const getStoredUsers = async (): Promise<UserProfile[]> => {
  await delay(200);
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Register a new user
export const registerUser = async (profile: UserProfile, password: string): Promise<UserProfile> => {
  await delay(500);
  const users = await getStoredUsers();
  if (users.find(u => u.email === profile.email)) {
    throw new Error("User already exists");
  }
  
  // Logic to automatically detect admin role based on email address
  const role: 'student' | 'admin' = profile.email.toLowerCase().includes('admin@') ? 'admin' : 'student';
  
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
export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  await delay(500);
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

  const users = await getStoredUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.status === 'disabled') {
    throw new Error("Account has been disabled by administrator.");
  }
  
  // Enforce admin role detection on login as well, in case manual edits or logic changes happened
  if (user.email.toLowerCase().includes('admin@') && user.role !== 'admin') {
      user.role = 'admin';
      // Persist the correction
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex !== -1) {
          users[userIndex] = user;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
  }
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

// Logout
export const logoutUser = async (): Promise<void> => {
  await delay(100);
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Get current session
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  await delay(100);
  const session = localStorage.getItem(CURRENT_USER_KEY);
  return session ? JSON.parse(session) : null;
};

// Update user profile
export const updateUserProfile = async (updatedProfile: UserProfile): Promise<UserProfile> => {
  await delay(300);
  const users = await getStoredUsers();
  const index = users.findIndex(u => u.email === updatedProfile.email);

  if (index !== -1) {
    users[index] = { ...users[index], ...updatedProfile };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Update current session
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedProfile));
  return updatedProfile;
};

// Admin: Toggle User Status
export const toggleUserStatus = async (email: string): Promise<void> => {
  await delay(200);
  const users = await getStoredUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    user.status = user.status === 'active' ? 'disabled' : 'active';
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

// Admin: Get Stats
export const getAdminStats = async (): Promise<AdminStats> => {
  await delay(200);
  const users = await getStoredUsers();
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
export const getLeaderboardData = async (): Promise<UserProfile[]> => {
  await delay(300);
  let users = await getStoredUsers();
  
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
export const addXP = async (user: UserProfile, amount: number): Promise<UserProfile> => {
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
  
  await updateUserProfile(updatedUser);
  return updatedUser;
};

// Save user specific data (Roadmap, etc)
export const saveUserData = async (key: string, data: any): Promise<void> => {
  await delay(100);
  const user = await getCurrentUser();
  if (!user || !user.id) return;
  localStorage.setItem(`data_${user.id}_${key}`, JSON.stringify(data));
};

// Get user specific data
export const getUserData = async (key: string): Promise<any> => {
  await delay(100);
  const user = await getCurrentUser();
  if (!user || !user.id) return null;
  const data = localStorage.getItem(`data_${user.id}_${key}`);
  return data ? JSON.parse(data) : null;
};

// --- Resume Versioning ---

export const saveResumeVersion = async (version: ResumeVersion): Promise<ResumeVersion[]> => {
  await delay(200);
  const user = await getCurrentUser();
  if (!user) return [];
  const key = `data_${user.id}_resume_versions`;
  const current = await getResumeVersions();
  const updated = [version, ...current]; // Newest first
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const getResumeVersions = async (): Promise<ResumeVersion[]> => {
  await delay(100);
  const user = await getCurrentUser();
  if (!user) return [];
  const key = `data_${user.id}_resume_versions`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const deleteResumeVersion = async (id: string): Promise<ResumeVersion[]> => {
  await delay(200);
  const versions = await getResumeVersions();
  const updated = versions.filter(v => v.id !== id);
  const user = await getCurrentUser();
  if (!user) return updated;
   const key = `data_${user.id}_resume_versions`;
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};
