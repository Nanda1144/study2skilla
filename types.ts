
export interface RoadmapItem {
  semester: number;
  focus: string;
  skills: string[];
  projects: string[];
  resources: string[];
}

export interface RoadmapData {
  domain: string;
  roadmap: RoadmapItem[];
}

export interface ResumeAnalysis {
  score: number;
  matchedDomain: string;
  missingSkills: string[];
  strengths: string[];
  improvementPlan: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface InterviewFeedback {
  score: number;
  feedback: string;
  betterAnswer: string;
}

export enum InterviewType {
  TECHNICAL = 'Technical',
  BEHAVIORAL = 'Behavioral',
  SKEPTICAL_CTO = 'Skeptical CTO', // Special hard mode
}

export interface IndustryTrend {
  name: string;
  demand: number; // 0-100
  growth: number; // percentage
}

export interface InsightsResponse {
  trends: IndustryTrend[];
  sources: { title: string; uri: string }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  dateEarned: string;
}

export interface UserGamification {
  xp: number;
  level: number;
  badges: Badge[];
  streakDays: number;
  studyHoursTotal: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  university: string;
  year: string;
  domain: string;
  skills: string[];
  bio: string;
  email: string;
  role?: 'student' | 'admin' | 'guest';
  status?: 'active' | 'disabled';
  gamification: UserGamification; // Added gamification stats
  contactMethod?: 'email' | 'phone';
  phone?: string;
  avatarUrl?: string; // Added for profile picture
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  imageUrl: string;
}

export interface JobAutomation {
  id: string;
  role: string;
  company: string;
  status: 'Scanning' | 'Tailoring Resume' | 'Genering Cover Letter' | 'Emailing' | 'Applied';
  matchScore: number;
  coverLetter?: string; // Added to store AI generated cover letter
  tailoredSummary?: string; // Added to store AI tailored resume summary
  feedbackRating?: number; // 1-5 stars
  feedbackComment?: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  type: 'Free' | 'Paid';
  platform: 'YouTube' | 'Coursera' | 'Udemy' | 'EdX' | 'Official Docs';
  url: string;
  thumbnail?: string;
  rating?: number;
  duration?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  growth: number;
  domainDistribution: { name: string; value: number }[];
}

export interface ResumeVersion {
  id: string;
  timestamp: string;
  name: string;
  content: string;
}
