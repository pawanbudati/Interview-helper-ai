import type { CandidateProfile, TargetJob, AISettings, InterviewMode } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'parakeet_profile',
  TARGET_JOB: 'parakeet_target_job',
  AI_SETTINGS: 'parakeet_ai_settings',
  UI_PREFS: 'parakeet_ui_prefs',
  INTERVIEW_MODE: 'parakeet_interview_mode'
};

export const defaultProfile: CandidateProfile = {
  name: 'Alex Morgan',
  currentRole: 'Senior Full Stack & AI Engineer',
  experienceYears: '6',
  skills: 'React, TypeScript, Node.js, Python, FastAPI, PostgreSQL, Redis, System Design, Docker, AWS, LLM Engineering',
  resumeText: `Alex Morgan - Senior Full Stack & AI Engineer
Experience:
- Senior Software Engineer at TechCorp (2022 - Present):
  * Architected and scaled real-time distributed microservices serving 1.5M daily active users with 99.98% uptime.
  * Reduced API p99 latency by 45% by introducing Redis multi-tier caching and asynchronous worker queues.
  * Led migration of monolithic backend to event-driven architecture using Kafka and AWS ECS.
  * Integrated LLM-powered conversational search that boosted user engagement by 32%.
- Software Engineer at DataFlow Systems (2019 - 2022):
  * Built high-throughput data ingestion pipelines handling 50k events/sec in Go and Python.
  * Developed frontend dashboards using React, TypeScript, and WebSockets for live telemetry.
  * Mentored 4 junior engineers and implemented strict CI/CD pipelines reducing deployment incidents by 60%.
Education: B.S. in Computer Science`
};

export const defaultTargetJob: TargetJob = {
  companyName: 'Stripe / Meta / High-Growth Startup',
  jobTitle: 'Senior Software Engineer - Platform & AI',
  jobDescription: `Looking for an experienced Senior Engineer to build scalable infrastructure, real-time collaboration features, and AI agent systems.
Requirements:
- 5+ years building distributed backend services and responsive frontend applications.
- Strong proficiency in modern web stacks (TypeScript/Node, Python, Go).
- Proven track record with system architecture, performance optimization, and asynchronous processing.
- Excellent communication skills and ability to lead cross-functional initiatives.`,
  interviewStage: 'technical'
};

const envGeminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const envGroqKey = (import.meta as any).env?.VITE_GROQ_API_KEY || '';
const envOpenAIKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';

export const defaultAISettings: AISettings = {
  provider: envGeminiKey ? 'gemini' : 'demo',
  geminiKey: envGeminiKey,
  groqKey: envGroqKey,
  openaiKey: envOpenAIKey,
  deepgramKey: '',
  modelName: 'gemini-2.5-flash',
  responseLength: 'concise',
  customInstructions: 'Keep answers direct, actionable, and structured with bullet points. Always emphasize metrics and personal ownership.'
};

export interface UIPrefs {
  opacity: number; // 0.3 - 1.0
  fontSize: 'sm' | 'md' | 'lg';
  alwaysOnTop: boolean;
  soundEnabled: boolean;
  autoGenerateOnSilence: boolean;
}

export const defaultUIPrefs: UIPrefs = {
  opacity: 0.95,
  fontSize: 'md',
  alwaysOnTop: true,
  soundEnabled: true,
  autoGenerateOnSilence: true
};

export const storageService = {
  getProfile: (): CandidateProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...defaultProfile, ...JSON.parse(data) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },
  saveProfile: (profile: CandidateProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getTargetJob: (): TargetJob => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TARGET_JOB);
      return data ? { ...defaultTargetJob, ...JSON.parse(data) } : defaultTargetJob;
    } catch {
      return defaultTargetJob;
    }
  },
  saveTargetJob: (job: TargetJob) => {
    localStorage.setItem(STORAGE_KEYS.TARGET_JOB, JSON.stringify(job));
  },

  getAISettings: (): AISettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_SETTINGS);
      return data ? { ...defaultAISettings, ...JSON.parse(data) } : defaultAISettings;
    } catch {
      return defaultAISettings;
    }
  },
  saveAISettings: (settings: AISettings) => {
    localStorage.setItem(STORAGE_KEYS.AI_SETTINGS, JSON.stringify(settings));
  },

  getUIPrefs: (): UIPrefs => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UI_PREFS);
      return data ? { ...defaultUIPrefs, ...JSON.parse(data) } : defaultUIPrefs;
    } catch {
      return defaultUIPrefs;
    }
  },
  saveUIPrefs: (prefs: UIPrefs) => {
    localStorage.setItem(STORAGE_KEYS.UI_PREFS, JSON.stringify(prefs));
  },

  getInterviewMode: (): InterviewMode => {
    return (localStorage.getItem(STORAGE_KEYS.INTERVIEW_MODE) as InterviewMode) || 'behavioral';
  },
  saveInterviewMode: (mode: InterviewMode) => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_MODE, mode);
  }
};
