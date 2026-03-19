export interface ScoreBreakdown {
  clarity: number;
  impact: number;
  skills: number;
  formatting: number;
}

export interface ResumeAnalysis {
  score: number;
  scoreBreakdown: ScoreBreakdown;
  summary: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  technicalSkills: string[];
  softSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  strengths: string[];
  matchPercentage: number | null;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface AnalysisJobStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  step: string;
  result?: ResumeAnalysis;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}
