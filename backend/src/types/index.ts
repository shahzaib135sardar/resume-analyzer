import { Request } from 'express'

// Score breakdown — each section scored out of 25
export interface ScoreBreakdown {
  clarity:    number
  impact:     number
  skills:     number
  formatting: number
}

// Full resume analysis result from Gemini AI
export interface ResumeAnalysis {
  score:            number
  scoreBreakdown:   ScoreBreakdown
  summary:          string
  experienceLevel:  'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive'
  technicalSkills:  string[]
  softSkills:       string[]
  missingSkills:    string[]
  suggestions:      string[]
  strengths:        string[]
  matchPercentage:  number | null
  matchedKeywords:  string[]
  missingKeywords:  string[]
}

// Job status for async analysis polling
export interface AnalysisJobStatus {
  jobId:    string
  status:   'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  step:     string
  result?:  ResumeAnalysis
  error?:   string
}

// Authenticated user (stored in memory)
export interface AuthUser {
  id:           string
  email:        string
  name:         string
  passwordHash: string
  createdAt:    Date
}

// JWT token payload
export interface JwtPayload {
  userId: string
  email:  string
  iat?:   number
  exp?:   number
}

// Extend Express Request to include authenticated user
export interface RefreshTokenPayload {
  userId: string;
  email: string;
  tokenFamily: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser | undefined;
      id: string;
      validatedBody?: any;
    }
  }
}



