import React from 'react';
import {
  Settings,
  Pin,
  Minimize2,
  X,
  Sparkles,
  GraduationCap,
  Eye,
  Type
} from 'lucide-react';
import type { InterviewMode } from '../types';

interface HUDHeaderProps {
  interviewMode: InterviewMode;
  onModeChange: (mode: InterviewMode) => void;
  opacity: number;
  onOpacityChange: (val: number) => void;
  fontSize: 'sm' | 'md' | 'lg';
  onFontSizeChange: (size: 'sm' | 'md' | 'lg') => void;
  alwaysOnTop: boolean;
  onToggleAlwaysOnTop: () => void;
  onOpenProfile: () => void;
  onOpenMockInterview: () => void;
}

export const HUDHeader: React.FC<HUDHeaderProps> = ({
  interviewMode,
  onModeChange,
  opacity,
  onOpacityChange,
  fontSize,
  onFontSizeChange,
  alwaysOnTop,
  onToggleAlwaysOnTop,
  onOpenProfile,
  onOpenMockInterview
}) => {
  const isElectron = Boolean(window.electronAPI);

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  return (
    <header className="draggable-region flex flex-col gap-2 p-3 border-b border-slate-700/60 bg-slate-950/70 select-none">
      {/* Top Bar with Title & Window Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold tracking-wide text-xs text-slate-100 flex items-center gap-1.5">
            PARAKEET <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">COPILOT</span>
          </span>
        </div>

        {/* Action icons */}
        <div className="non-draggable flex items-center gap-1">
          {/* Mock Interview Practice */}
          <button
            onClick={onOpenMockInterview}
            title="Mock Interview Practice Mode"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
          >
            <GraduationCap className="w-3.5 h-3.5" />
          </button>

          {/* Profile & Settings */}
          <button
            onClick={onOpenProfile}
            title="Candidate Profile & Settings"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Always-on-top toggle */}
          <button
            onClick={onToggleAlwaysOnTop}
            title={alwaysOnTop ? 'Always on Top: ON' : 'Always on Top: OFF'}
            className={`p-1.5 rounded-md transition ${
              alwaysOnTop ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          {/* Electron Window Controls */}
          {isElectron && (
            <>
              <button
                onClick={handleMinimize}
                title="Minimize"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClose}
                title="Close"
                className="p-1.5 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mode Selector and Quick Tweaks */}
      <div className="non-draggable flex items-center justify-between gap-1 pt-1">
        {/* Mode pills */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
          {(['behavioral', 'system-design', 'coding', 'general'] as InterviewMode[]).map((mode) => {
            const active = interviewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => onModeChange(mode)}
                className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-md transition ${
                  active
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {mode === 'system-design' ? 'Sys Design' : mode}
              </button>
            );
          })}
        </div>

        {/* Quick HUD controls: Font Size & Opacity Slider */}
        <div className="flex items-center gap-2">
          {/* Font Size */}
          <div className="flex items-center gap-0.5 bg-slate-900/80 px-1 py-0.5 rounded border border-slate-800">
            <Type className="w-2.5 h-2.5 text-slate-500 mr-0.5" />
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button
                key={s}
                onClick={() => onFontSizeChange(s)}
                className={`text-[10px] px-1 rounded uppercase ${
                  fontSize === s ? 'text-cyan-400 font-bold bg-cyan-950/60' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Opacity slider */}
          <div className="flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800" title={`Overlay Opacity: ${Math.round(opacity * 100)}%`}>
            <Eye className="w-2.5 h-2.5 text-slate-500" />
            <input
              type="range"
              min="0.35"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-12 h-1 accent-cyan-400 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
