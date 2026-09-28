import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  HelpCircle,
  RefreshCw,
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';
import type { GeneratedAnswer } from '../types';

interface AnswerDisplayProps {
  answer: GeneratedAnswer | null;
  isProcessing: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  onRefineAnswer: (promptModifier: string) => void;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({
  answer,
  isProcessing,
  fontSize,
  onRefineAnswer
}) => {
  const [copied, setCopied] = useState(false);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'sm':
        return {
          hook: 'text-xs',
          bullet: 'text-[11px] leading-relaxed',
          code: 'text-[10px]',
          title: 'text-[10px]'
        };
      case 'lg':
        return {
          hook: 'text-base',
          bullet: 'text-sm leading-relaxed',
          code: 'text-xs',
          title: 'text-xs'
        };
      case 'md':
      default:
        return {
          hook: 'text-sm',
          bullet: 'text-xs leading-relaxed',
          code: 'text-[11px]',
          title: 'text-[11px]'
        };
    }
  };

  const fonts = getFontSizeClasses();

  const handleCopy = () => {
    if (!answer) return;
    const textToCopy = `QUESTION: ${answer.question}
OPENER: ${answer.quickHook}

KEY TALKING POINTS:
${answer.bulletPoints.map((b) => `• ${b}`).join('\n')}

${answer.codeSnippet ? `\nCODE / SPEC:\n${answer.codeSnippet}` : ''}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isProcessing && !answer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-12 h-12 flex items-center justify-center mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <p className="text-sm font-medium text-slate-200">Formulating optimal answer...</p>
        <p className="text-xs text-slate-500 mt-1">Cross-referencing resume metrics & job role</p>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
          <Zap className="w-5 h-5 text-slate-500" />
        </div>
        <h4 className="text-xs font-semibold text-slate-300">Ready for Interview Questions</h4>
        <p className="text-[11px] text-slate-500 max-w-[280px] mt-1">
          Turn on your Mic or Meeting Audio to capture questions, or paste a question above to get immediate talking points.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Scrollable Answer View */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 select-text">
        {/* Question Header */}
        <div className="pb-1 border-b border-slate-800/60 flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Question
            </span>
            <h3 className="text-xs font-semibold text-slate-200">
              {answer.question}
            </h3>
          </div>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Copy Answer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 1. Quick Hook (Opening sentence to speak immediately) */}
        <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className={`${fonts.title} uppercase font-bold tracking-wider text-emerald-400`}>
              Say This First (Opener)
            </span>
          </div>
          <p className={`${fonts.hook} text-emerald-100 font-medium leading-relaxed`}>
            "{answer.quickHook}"
          </p>
        </div>

        {/* 2. Structured Talking Points */}
        <div className="space-y-1.5">
          <span className={`${fonts.title} uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1`}>
            <Layers className="w-3 h-3 text-cyan-400" /> Key Talking Points & Metrics
          </span>
          <div className="space-y-2">
            {answer.bulletPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80"
              >
                <div className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div
                  className={`${fonts.bullet} text-slate-200 flex-1`}
                  dangerouslySetInnerHTML={{
                    __html: point
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Code Snippet or System Architecture (if any) */}
        {answer.codeSnippet && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`${fonts.title} uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1`}>
                <Code2 className="w-3 h-3 text-amber-400" /> Technical Implementation
              </span>
            </div>
            <pre className={`p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-cyan-300 ${fonts.code} overflow-x-auto whitespace-pre leading-relaxed`}>
              <code>{answer.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* 4. Follow-up Traps Anticipation */}
        {answer.followUps && answer.followUps.length > 0 && (
          <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 space-y-1.5">
            <span className={`${fonts.title} uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1`}>
              <HelpCircle className="w-3 h-3 text-purple-400" /> Anticipated Follow-Ups
            </span>
            <ul className="space-y-1">
              {answer.followUps.map((fu, idx) => (
                <li
                  key={idx}
                  onClick={() => onRefineAnswer(fu.replace(/^"|"$/g, ''))}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 cursor-pointer transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                  <span className="italic">{fu}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quick Action Modifiers Bar */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-1 overflow-x-auto select-none">
        <button
          onClick={() => onRefineAnswer('Give a concise 30-second summary version')}
          className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap"
        >
          ⏱️ 30s Version
        </button>
        <button
          onClick={() => onRefineAnswer('Deepen the technical details and metrics')}
          className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap"
        >
          🔍 More Details
        </button>
        <button
          onClick={() => onRefineAnswer('Provide full working code solution')}
          className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap"
        >
          💻 Code Solution
        </button>
        <button
          onClick={() => onRefineAnswer('Regenerate fresh alternative approach')}
          className="text-[10px] p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
          title="Regenerate"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
