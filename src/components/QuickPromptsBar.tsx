import { Sparkles } from 'lucide-react';
import type { InterviewMode } from '../types';

interface QuickPromptsBarProps {
  mode: InterviewMode;
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const QuickPromptsBar: React.FC<QuickPromptsBarProps> = ({
  mode,
  onSelectPrompt,
  disabled
}) => {
  const getSampleQuestions = () => {
    switch (mode) {
      case 'behavioral':
        return [
          'Tell me about a time you faced a critical production incident and handled it.',
          'Describe a situation where you had a sharp disagreement with a team member.',
          'Can you walk me through your most impactful engineering project?'
        ];
      case 'system-design':
        return [
          'How would you design a scalable real-time notification service (like Uber/Twitter)?',
          'Design an idempotent distributed rate-limiter handling 100k requests/sec.',
          'How do you handle cache invalidation and database replication lag?'
        ];
      case 'coding':
        return [
          'How would you detect and break a cycle in a singly linked list in O(1) space?',
          'Given an array of integers, find two numbers that sum up to target in O(N).',
          'Design an LRU cache with O(1) get and put operations.'
        ];
      case 'general':
      default:
        return [
          'Walk me through your background and why you are interested in this role.',
          'What are your greatest technical strengths and what is an area of growth?',
          'Where do you see yourself technically in the next 2-3 years?'
        ];
    }
  };

  const questions = getSampleQuestions();

  return (
    <div className="px-3 py-1.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto select-none">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
        <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> Presets:
      </span>
      {questions.map((q, idx) => (
        <button
          key={idx}
          disabled={disabled}
          onClick={() => onSelectPrompt(q)}
          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-slate-700 whitespace-nowrap transition disabled:opacity-40"
          title={q}
        >
          {q.length > 38 ? `${q.slice(0, 36)}...` : q}
        </button>
      ))}
    </div>
  );
};
