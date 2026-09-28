import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  Key,
  Save,
  CheckCircle,
  Sparkles,
  Command
} from 'lucide-react';
import type { CandidateProfile, TargetJob, AISettings, AIProvider } from '../types';
import { defaultProfile, defaultTargetJob } from '../services/storageService';

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  targetJob: TargetJob;
  aiSettings: AISettings;
  onSaveProfile: (profile: CandidateProfile) => void;
  onSaveTargetJob: (job: TargetJob) => void;
  onSaveAISettings: (settings: AISettings) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  targetJob,
  aiSettings,
  onSaveProfile,
  onSaveTargetJob,
  onSaveAISettings
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'job' | 'ai' | 'shortcuts'>('profile');
  
  const [currentProfile, setCurrentProfile] = useState<CandidateProfile>(profile);
  const [currentJob, setCurrentJob] = useState<TargetJob>(targetJob);
  const [currentAISettings, setCurrentAISettings] = useState<AISettings>(aiSettings);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile(currentProfile);
    onSaveTargetJob(currentJob);
    onSaveAISettings(currentAISettings);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  const handleLoadSampleResume = () => {
    setCurrentProfile(defaultProfile);
  };

  const handleLoadSampleJob = () => {
    setCurrentJob(defaultTargetJob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-slate-100">
              Copilot Setup & Candidate Context
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-3 pt-2 gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition border-b-2 ${
              activeTab === 'profile'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Resume</span>
          </button>
          <button
            onClick={() => setActiveTab('job')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition border-b-2 ${
              activeTab === 'job'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Target Role</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition border-b-2 ${
              activeTab === 'ai'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>AI Keys</span>
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition border-b-2 ${
              activeTab === 'shortcuts'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Command className="w-3.5 h-3.5" />
            <span>Hotkeys</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. Resume / Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-[11px]">
                  All generated answers will cite your real experience, metrics, and technologies.
                </p>
                <button
                  type="button"
                  onClick={handleLoadSampleResume}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  Load Sample Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={currentProfile.name}
                    onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Current Title</label>
                  <input
                    type="text"
                    value={currentProfile.currentRole}
                    onChange={(e) => setCurrentProfile({ ...currentProfile, currentRole: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Key Tech Skills & Strengths</label>
                <input
                  type="text"
                  value={currentProfile.skills}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, skills: e.target.value })}
                  placeholder="React, TypeScript, Python, AWS, System Design, Docker..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Resume Highlights / Projects (Paste Text)
                </label>
                <textarea
                  rows={6}
                  value={currentProfile.resumeText}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, resumeText: e.target.value })}
                  placeholder="Paste your past roles, metrics (e.g. reduced latency by 40%), key projects..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* 2. Target Job Tab */}
          {activeTab === 'job' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-[11px]">
                  Provide target company context so answers align with their engineering culture.
                </p>
                <button
                  type="button"
                  onClick={handleLoadSampleJob}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  Load Sample Job
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Target Company</label>
                  <input
                    type="text"
                    value={currentJob.companyName}
                    onChange={(e) => setCurrentJob({ ...currentJob, companyName: e.target.value })}
                    placeholder="Stripe, Google, Uber..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Target Job Title</label>
                  <input
                    type="text"
                    value={currentJob.jobTitle}
                    onChange={(e) => setCurrentJob({ ...currentJob, jobTitle: e.target.value })}
                    placeholder="Senior Full Stack Engineer..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Job Description / Role Requirements
                </label>
                <textarea
                  rows={7}
                  value={currentJob.jobDescription}
                  onChange={(e) => setCurrentJob({ ...currentJob, jobDescription: e.target.value })}
                  placeholder="Paste the job posting, requirements, and responsibilities..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-[11px] focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* 3. AI Providers Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                  Select AI Generation Engine
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'demo', name: 'Offline Demo (Instant)', desc: 'Works with 0 API keys' },
                    { id: 'gemini', name: 'Google Gemini 2.5 Flash', desc: 'Fast, long context' },
                    { id: 'groq', name: 'Groq (Llama 3.3)', desc: 'Sub-second response' },
                    { id: 'openai', name: 'OpenAI (GPT-4o)', desc: 'High reasoning' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCurrentAISettings({ ...currentAISettings, provider: p.id as AIProvider })}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        currentAISettings.provider === p.id
                          ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-200">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Keys based on provider */}
              {currentAISettings.provider === 'gemini' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={currentAISettings.geminiKey}
                    onChange={(e) => setCurrentAISettings({ ...currentAISettings, geminiKey: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Get free key from Google AI Studio</p>
                </div>
              )}

              {currentAISettings.provider === 'groq' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Groq API Key
                  </label>
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={currentAISettings.groqKey}
                    onChange={(e) => setCurrentAISettings({ ...currentAISettings, groqKey: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Free fast inference at console.groq.com</p>
                </div>
              )}

              {currentAISettings.provider === 'openai' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={currentAISettings.openaiKey}
                    onChange={(e) => setCurrentAISettings({ ...currentAISettings, openaiKey: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Custom Style Prompt</label>
                <input
                  type="text"
                  placeholder="e.g. Always emphasize quantitative metrics and STAR method format."
                  value={currentAISettings.customInstructions}
                  onChange={(e) => setCurrentAISettings({ ...currentAISettings, customInstructions: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* 4. Hotkeys Cheatsheet Tab */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-2.5">
              <p className="text-slate-400 text-[11px] mb-3">
                Global hotkeys operate in the background even while Zoom, Teams, or LeetCode are in focus:
              </p>
              <div className="space-y-2">
                {[
                  { key: 'Ctrl + Shift + H', desc: 'Instant Stealth Mode: Hide or Show overlay immediately' },
                  { key: 'Ctrl + Shift + M', desc: 'Mute or Unmute listening' },
                  { key: 'Ctrl + Shift + Space', desc: 'Trigger instant answer generation' },
                  { key: 'Enter', desc: 'Submit manual question from input bar' },
                  { key: 'Opacity Slider', desc: 'Adjust background transparency from 35% to 100%' }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300 text-xs">{s.desc}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px] border border-slate-700">
                      {s.key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {savedNotice ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Context saved successfully!
              </span>
            ) : (
              'Changes are stored locally in your browser/app.'
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
