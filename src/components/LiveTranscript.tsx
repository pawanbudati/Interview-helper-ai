import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Trash2,
  Radio,
  Share2
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface LiveTranscriptProps {
  transcript: string;
  isListening: boolean;
  isProcessing: boolean;
  audioLevel: number;
  sourceType: 'mic' | 'system';
  onToggleMic: () => void;
  onToggleSystemAudio: () => void;
  onManualQuestionSubmit: (q: string) => void;
  onClearTranscript: () => void;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  transcript,
  isListening,
  isProcessing,
  audioLevel,
  sourceType,
  onToggleMic,
  onToggleSystemAudio,
  onManualQuestionSubmit,
  onClearTranscript
}) => {
  const [manualInput, setManualInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && manualInput.trim()) {
      onManualQuestionSubmit(manualInput.trim());
      setManualInput('');
    }
  };

  const handleTriggerCurrent = () => {
    if (transcript.trim()) {
      onManualQuestionSubmit(transcript.trim());
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-950/40 border-b border-slate-800/80">
      {/* Audio Sources & Visualizer Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Mic Toggle Button */}
          <button
            onClick={onToggleMic}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              isListening && sourceType === 'mic'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            {isListening && sourceType === 'mic' ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>Mic</span>
          </button>

          {/* System Meeting Audio Loopback */}
          <button
            onClick={onToggleSystemAudio}
            title="Capture meeting loopback audio (Zoom / Teams / Meet)"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              isListening && sourceType === 'system'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Meeting Audio</span>
          </button>
        </div>

        {/* Visualizer Status */}
        <AudioVisualizer
          isListening={isListening}
          audioLevel={audioLevel}
          isProcessing={isProcessing}
          sourceType={sourceType}
        />
      </div>

      {/* Live Detected Question Banner */}
      <div className="relative rounded-lg bg-slate-900/90 border border-slate-800 p-2.5 min-h-[46px] flex flex-col justify-center">
        {transcript ? (
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1 mb-0.5">
                <Radio className="w-3 h-3 animate-pulse" /> Live Speech
              </span>
              <p className="text-xs text-slate-200 font-medium leading-relaxed select-text">
                "{transcript}"
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleTriggerCurrent}
                disabled={isProcessing}
                className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold shadow transition flex items-center gap-1"
                title="Generate Answer Now"
              >
                <span>Answer</span>
              </button>
              <button
                onClick={onClearTranscript}
                className="p-1 text-slate-500 hover:text-slate-300 transition"
                title="Clear"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="italic flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-slate-600" />
              Listening for interviewer's question...
            </span>
          </div>
        )}
      </div>

      {/* Manual Question Input (Chat/LeetCode paste) */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          placeholder="Or paste question from Zoom/Meet chat..."
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition"
        />
        <button
          onClick={() => {
            if (manualInput.trim()) {
              onManualQuestionSubmit(manualInput.trim());
              setManualInput('');
            }
          }}
          disabled={!manualInput.trim() || isProcessing}
          className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition flex items-center gap-1"
          title="Submit question"
        >
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
