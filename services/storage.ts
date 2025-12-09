import { UserProfile } from '../types';

const USERS_KEY = 'careerforge_users';
const CURRENT_USER_KEY = 'careerforge_session';

// Helper to get all users from "DB"
const getStoredUsers = (): UserProfile[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Register a new user
export const registerUser = (profile: UserProfile, password: string): UserProfile => {
  const users = getStoredUsers();
  if (users.find(u => u.email === profile.email)) {
    throw new Error("User already exists");
  }
  
  // In a real app, we'd hash the password. Here we simulate storage.
  const newUser = { ...profile, id: Date.now().toString() };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Initialize empty user-specific data if needed
  localStorage.setItem(`data_${newUser.id}_roadmap`, JSON.stringify(null));
  
  return newUser;
};

// Login user
export const loginUser = (email: string, password: string): UserProfile => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  
  // Mock password check (accepts any password for existing email in this demo, or we could store passwords)
  if (!user) {
    throw new Error("Invalid credentials");
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
