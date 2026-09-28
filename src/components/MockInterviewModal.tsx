import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  RotateCcw,
  Mic,
  MicOff,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { CandidateProfile, TargetJob, AISettings } from '../types';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  targetJob: TargetJob;
  aiSettings: AISettings;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  profile,
  targetJob
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    betterAnswer: string;
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Pre-generated mock questions based on the candidate profile and role
  const mockQuestions = [
    {
      id: 'mq-1',
      question: `As a ${profile.currentRole}, tell me about a time you optimized a slow system or resolved high API latency.`,
      category: 'Technical Architecture'
    },
    {
      id: 'mq-2',
      question: `Describe a situation where engineering priorities conflicted with product deadlines. How did you negotiate?`,
      category: 'Behavioral & Leadership'
    },
    {
      id: 'mq-3',
      question: `Why are you specifically interested in joining ${targetJob.companyName} for this ${targetJob.jobTitle} position?`,
      category: 'Culture & Motivation'
    }
  ];

  if (!isOpen) return null;

  const currentQ = mockQuestions[currentQuestionIndex];

  const handleEvaluate = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      setFeedback({
        score: 8.5,
        strengths: [
          'Directly stated the situation and quantifiable metric improvements.',
          'Highlighted ownership and clear engineering decision making.',
          'Confident tone and aligned with senior level expectations.'
        ],
        improvements: [
          'Consider mentioning how you monitored performance regressions afterwards.',
          'Quantify the business impact (e.g. cloud cost savings or user retention).'
        ],
        betterAnswer: `When our p99 API latency jumped under 1.5M DAU load, I profiled our database query bottlenecks. I introduced Redis multi-tier caching and converted batch endpoints to async message queues, ultimately reducing latency by 45% with 0 downtime.`
      });
      setIsEvaluating(false);
    }, 1200);
  };

  const handleNext = () => {
    setFeedback(null);
    setUserAnswer('');
    setCurrentQuestionIndex((prev) => (prev + 1) % mockQuestions.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-slate-100">
                Mock Interview Practice Room
              </h2>
              <p className="text-[10px] text-slate-400">
                Rehearse live questions and get instant AI scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Area */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/60">
              Question {currentQuestionIndex + 1} of {mockQuestions.length} • {currentQ.category}
            </span>
            <button
              onClick={handleNext}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <span>Skip</span> <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-100 leading-relaxed">
              "{currentQ.question}"
            </h3>
          </div>

          {/* User Answer Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-300">Your Response:</label>
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 transition ${
                  isRecording
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isRecording ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                <span>{isRecording ? 'Recording Speech...' : 'Practice with Voice'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Speak or type your answer here using the STAR method..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div className="p-3 rounded-lg bg-slate-950 border border-purple-500/30 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> AI Score: {feedback.score} / 10
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Strong Delivery</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Strengths:</span>
                <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-0.5 mt-0.5">
                  {feedback.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Next Level Tips:</span>
                <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-0.5 mt-0.5">
                  {feedback.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-1 border-t border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Model Answer:</span>
                <p className="text-[11px] text-slate-300 italic mt-0.5 bg-slate-900/60 p-2 rounded">
                  "{feedback.betterAnswer}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => {
              setUserAnswer('');
              setFeedback(null);
            }}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2">
            {!feedback ? (
              <button
                onClick={handleEvaluate}
                disabled={!userAnswer.trim() || isEvaluating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isEvaluating ? 'Evaluating...' : 'Score Answer'}</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
