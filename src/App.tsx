import { useState, useEffect, useRef } from 'react';
import type {
  CandidateProfile,
  TargetJob,
  AISettings,
  InterviewMode,
  GeneratedAnswer
} from './types';
import {
  storageService,
  defaultProfile,
  defaultTargetJob,
  defaultAISettings,
  defaultUIPrefs,
  type UIPrefs
} from './services/storageService';
import { SpeechService } from './services/speechService';
import { streamAnswerFromAI } from './services/aiService';
import { HUDHeader } from './components/HUDHeader';
import { QuickPromptsBar } from './components/QuickPromptsBar';
import { LiveTranscript } from './components/LiveTranscript';
import { AnswerDisplay } from './components/AnswerDisplay';
import { CandidateProfileModal } from './components/CandidateProfileModal';
import { MockInterviewModal } from './components/MockInterviewModal';

export const App: React.FC = () => {
  // Candidate Context State
  const [profile, setProfile] = useState<CandidateProfile>(defaultProfile);
  const [targetJob, setTargetJob] = useState<TargetJob>(defaultTargetJob);
  const [aiSettings, setAISettings] = useState<AISettings>(defaultAISettings);
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('behavioral');
  const [uiPrefs, setUIPrefs] = useState<UIPrefs>(defaultUIPrefs);

  // Audio & Transcription State
  const [isListening, setIsListening] = useState(false);
  const [sourceType, setSourceType] = useState<'mic' | 'system'>('mic');
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Answer State
  const [currentAnswer, setCurrentAnswer] = useState<GeneratedAnswer | null>(null);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState(false);

  // Speech service reference
  const speechServiceRef = useRef<SpeechService | null>(null);

  // Load saved preferences on mount
  useEffect(() => {
    setProfile(storageService.getProfile());
    setTargetJob(storageService.getTargetJob());
    setAISettings(storageService.getAISettings());
    setInterviewMode(storageService.getInterviewMode());
    setUIPrefs(storageService.getUIPrefs());
  }, []);

  // Initialize Speech Service
  useEffect(() => {
    const service = new SpeechService({
      onTranscriptChange: (text, isFinal) => {
        setCurrentTranscript(text);
        if (isFinal && text.trim().length > 15 && uiPrefs.autoGenerateOnSilence) {
          handleGenerateAnswer(text.trim());
        }
      },
      onAudioLevelChange: (level) => {
        setAudioLevel(level);
      },
      onError: (err) => {
        console.warn('Speech Error:', err);
      },
      onStatusChange: (status) => {
        setIsListening(status === 'listening');
      }
    });

    speechServiceRef.current = service;

    // Listen to global shortcuts in Electron
    if (window.electronAPI) {
      const cleanup = window.electronAPI.onGlobalShortcut((action) => {
        if (action === 'toggle-mute') {
          handleToggleMic();
        } else if (action === 'trigger-answer') {
          if (currentTranscript.trim()) {
            handleGenerateAnswer(currentTranscript.trim());
          }
        }
      });
      return () => {
        cleanup();
        service.stop();
      };
    }

    return () => {
      service.stop();
    };
  }, [uiPrefs.autoGenerateOnSilence, currentTranscript]);

  // Audio toggles
  const handleToggleMic = async () => {
    if (!speechServiceRef.current) return;
    if (isListening && sourceType === 'mic') {
      speechServiceRef.current.stop();
      setIsListening(false);
    } else {
      speechServiceRef.current.stop();
      setSourceType('mic');
      const success = await speechServiceRef.current.startMicrophone();
      setIsListening(success);
    }
  };

  const handleToggleSystemAudio = async () => {
    if (!speechServiceRef.current) return;
    if (isListening && sourceType === 'system') {
      speechServiceRef.current.stop();
      setIsListening(false);
    } else {
      speechServiceRef.current.stop();
      setSourceType('system');
      const success = await speechServiceRef.current.startSystemAudioLoopback();
      setIsListening(success);
    }
  };

  // Generate answer from question
  const handleGenerateAnswer = async (questionText: string, modifier?: string) => {
    if (!questionText.trim()) return;
    setIsProcessing(true);

    const fullQuestion = modifier ? `${questionText} [MODIFIER: ${modifier}]` : questionText;

    try {
      const answer = await streamAnswerFromAI(
        fullQuestion,
        profile,
        targetJob,
        interviewMode,
        aiSettings,
        (partial) => {
          setCurrentAnswer((prev) => ({
            id: prev?.id || `ans-${Date.now()}`,
            question: questionText,
            quickHook: partial.quickHook || prev?.quickHook || '',
            bulletPoints: partial.bulletPoints || prev?.bulletPoints || [],
            codeSnippet: partial.codeSnippet || prev?.codeSnippet,
            followUps: partial.followUps || prev?.followUps,
            createdAt: Date.now()
          }));
        }
      );
      setCurrentAnswer(answer);
    } catch (err) {
      console.error('Failed to generate answer:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // UI Preference handlers
  const handleModeChange = (mode: InterviewMode) => {
    setInterviewMode(mode);
    storageService.saveInterviewMode(mode);
  };

  const handleOpacityChange = (val: number) => {
    const updated = { ...uiPrefs, opacity: val };
    setUIPrefs(updated);
    storageService.saveUIPrefs(updated);
  };

  const handleFontSizeChange = (size: 'sm' | 'md' | 'lg') => {
    const updated = { ...uiPrefs, fontSize: size };
    setUIPrefs(updated);
    storageService.saveUIPrefs(updated);
  };

  const handleToggleAlwaysOnTop = async () => {
    if (window.electronAPI) {
      const newState = await window.electronAPI.toggleAlwaysOnTop();
      const updated = { ...uiPrefs, alwaysOnTop: newState };
      setUIPrefs(updated);
      storageService.saveUIPrefs(updated);
    } else {
      const updated = { ...uiPrefs, alwaysOnTop: !uiPrefs.alwaysOnTop };
      setUIPrefs(updated);
      storageService.saveUIPrefs(updated);
    }
  };

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden font-sans select-none transition-opacity duration-150"
      style={{
        backgroundColor: `rgba(10, 15, 26, ${uiPrefs.opacity})`
      }}
    >
      <div className="flex-1 flex flex-col border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* HUD Top Bar */}
        <HUDHeader
          interviewMode={interviewMode}
          onModeChange={handleModeChange}
          opacity={uiPrefs.opacity}
          onOpacityChange={handleOpacityChange}
          fontSize={uiPrefs.fontSize}
          onFontSizeChange={handleFontSizeChange}
          alwaysOnTop={uiPrefs.alwaysOnTop}
          onToggleAlwaysOnTop={handleToggleAlwaysOnTop}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenMockInterview={() => setIsMockInterviewOpen(true)}
        />

        {/* Quick Test Presets Bar */}
        <QuickPromptsBar
          mode={interviewMode}
          onSelectPrompt={(prompt) => {
            setCurrentTranscript(prompt);
            handleGenerateAnswer(prompt);
          }}
          disabled={isProcessing}
        />

        {/* Live Audio & Transcript Section */}
        <LiveTranscript
          transcript={currentTranscript}
          isListening={isListening}
          isProcessing={isProcessing}
          audioLevel={audioLevel}
          sourceType={sourceType}
          onToggleMic={handleToggleMic}
          onToggleSystemAudio={handleToggleSystemAudio}
          onManualQuestionSubmit={(q) => {
            setCurrentTranscript(q);
            handleGenerateAnswer(q);
          }}
          onClearTranscript={() => setCurrentTranscript('')}
        />

        {/* Real-time Teleprompter Answer Display */}
        <AnswerDisplay
          answer={currentAnswer}
          isProcessing={isProcessing}
          fontSize={uiPrefs.fontSize}
          onRefineAnswer={(modifier) => {
            if (currentAnswer) {
              handleGenerateAnswer(currentAnswer.question, modifier);
            }
          }}
        />
      </div>

      {/* Candidate Profile & Settings Modal */}
      <CandidateProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        targetJob={targetJob}
        aiSettings={aiSettings}
        onSaveProfile={(p) => {
          setProfile(p);
          storageService.saveProfile(p);
        }}
        onSaveTargetJob={(j) => {
          setTargetJob(j);
          storageService.saveTargetJob(j);
        }}
        onSaveAISettings={(s) => {
          setAISettings(s);
          storageService.saveAISettings(s);
        }}
      />

      {/* Mock Interview Practice Modal */}
      <MockInterviewModal
        isOpen={isMockInterviewOpen}
        onClose={() => setIsMockInterviewOpen(false)}
        profile={profile}
        targetJob={targetJob}
        aiSettings={aiSettings}
      />
    </div>
  );
};

export default App;
