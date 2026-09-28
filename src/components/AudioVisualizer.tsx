import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface AudioVisualizerProps {
  isListening: boolean;
  audioLevel: number; // 0 - 100
  isProcessing: boolean;
  sourceType: 'mic' | 'system';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isListening,
  audioLevel,
  isProcessing,
  sourceType
}) => {
  // Generate 8 equalizer bars
  const bars = [0.3, 0.6, 0.9, 0.5, 0.8, 0.4, 0.7, 0.5];

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/50">
      <div className="flex items-center gap-1.5">
        {isListening ? (
          sourceType === 'system' ? (
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          ) : (
            <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          )
        ) : (
          <MicOff className="w-3.5 h-3.5 text-slate-500" />
        )}
        <span className="text-[11px] font-medium tracking-wide uppercase text-slate-300">
          {isProcessing ? 'Thinking...' : isListening ? (sourceType === 'system' ? 'Meeting Audio' : 'Mic Active') : 'Paused'}
        </span>
      </div>

      {/* Visualizer bars */}
      <div className="flex items-center gap-0.5 h-3.5 ml-1">
        {bars.map((weight, i) => {
          const heightPercent = isListening
            ? Math.max(15, Math.min(100, (audioLevel * weight * 1.5) + (Math.random() * 10)))
            : 15;
          return (
            <div
              key={i}
              className={`w-0.5 rounded-full transition-all duration-75 ${
                isProcessing
                  ? 'bg-amber-400 animate-pulse'
                  : isListening
                  ? sourceType === 'system'
                    ? 'bg-cyan-400'
                    : 'bg-emerald-400'
                  : 'bg-slate-600'
              }`}
              style={{ height: `${heightPercent}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};
