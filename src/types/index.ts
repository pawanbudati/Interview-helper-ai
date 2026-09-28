export type InterviewMode = 'behavioral' | 'technical' | 'coding' | 'system-design' | 'general';

export type AIProvider = 'demo' | 'gemini' | 'groq' | 'openai';

export type ResponseLength = 'concise' | 'balanced' | 'detailed';

export interface CandidateProfile {
  name: string;
  currentRole: string;
  experienceYears: string;
  skills: string;
  resumeText: string;
}

export interface TargetJob {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  interviewStage: string;
}

export interface AISettings {
  provider: AIProvider;
  geminiKey: string;
  groqKey: string;
  openaiKey: string;
  deepgramKey: string;
  modelName: string;
  responseLength: ResponseLength;
  customInstructions: string;
}

export interface TranscriptionItem {
  id: string;
  speaker: 'interviewer' | 'candidate';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface GeneratedAnswer {
  id: string;
  question: string;
  quickHook: string; // 1-2 sentence immediate speaking line
  bulletPoints: string[];
  codeSnippet?: string;
  followUps?: string[];
  createdAt: number;
  isStreaming?: boolean;
}

export interface MockQuestion {
  id: string;
  question: string;
  category: string;
  feedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestedAnswer: string;
  };
}

export interface ElectronAPI {
  minimize: () => void;
  close: () => void;
  toggleAlwaysOnTop: (enable?: boolean) => Promise<boolean>;
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void;
  getDesktopSources: (options?: any) => Promise<Array<{ id: string; name: string; thumbnail: string }>>;
  isElectron: boolean;
  onGlobalShortcut: (callback: (action: string) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
