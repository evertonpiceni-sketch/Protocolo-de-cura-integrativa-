import React from 'react';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw, RotateCw,
  Volume2, VolumeX, BookOpen
} from 'lucide-react';

interface MinimalPlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevStage: () => void;
  onNextStage: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  currentTime: number;
  duration: number;
  onSeekTo: (seconds: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenScriptDrawer: () => void;
  hasPrevStage: boolean;
  hasNextStage: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const MinimalPlayerControls: React.FC<MinimalPlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onPrevStage,
  onNextStage,
  onSeekBackward,
  onSeekForward,
  currentTime,
  duration,
  onSeekTo,
  isMuted,
  onToggleMute,
  onOpenScriptDrawer,
  hasPrevStage,
  hasNextStage
}) => {
  const safeDuration = duration > 0 ? duration : 60;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / safeDuration) * 100));

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeekTo(ratio * safeDuration);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-6 pt-2 select-none">
      {/* Progress Bar & Timestamps */}
      <div className="space-y-1.5 mb-4">
        <div
          onClick={handleProgressBarClick}
          className="relative w-full h-2 rounded-full bg-[#0d281e] cursor-pointer group py-1 -my-1"
        >
          <div className="w-full h-1.5 rounded-full bg-[#0a261c] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c5a059] to-[#e6ca65] rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Thumb marker on hover */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#f4f1ea] border-2 border-[#d4af37] shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#8ca89a] px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Main Control Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Secondary: Script Drawer */}
        <button
          onClick={onOpenScriptDrawer}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif text-[#8ca89a] hover:text-[#f4f1ea] hover:bg-[#8ca89a]/10 border border-transparent hover:border-[#8ca89a]/20 transition-all"
          title="Ler roteiro completo"
        >
          <BookOpen size={16} className="text-[#d4af37]" />
          <span className="hidden sm:inline">Roteiro</span>
        </button>

        {/* Center Primary Playback Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Previous Stage */}
          <button
            onClick={onPrevStage}
            disabled={!hasPrevStage}
            className="p-2.5 rounded-xl text-[#8ca89a] hover:text-[#f4f1ea] disabled:opacity-30 disabled:hover:text-[#8ca89a] hover:bg-[#8ca89a]/10 transition-colors"
            title="Etapa anterior"
          >
            <SkipBack size={18} />
          </button>

          {/* Seek -15s */}
          <button
            onClick={onSeekBackward}
            className="p-2 rounded-xl text-[#8ca89a] hover:text-[#f4f1ea] hover:bg-[#8ca89a]/10 transition-colors flex items-center justify-center relative"
            title="Voltar 15 segundos"
          >
            <RotateCcw size={17} />
            <span className="absolute -bottom-1.5 text-[8px] font-mono font-bold text-[#d4af37]">15</span>
          </button>

          {/* Big Play / Pause */}
          <button
            onClick={onTogglePlay}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#c5a059] via-[#d4af37] to-[#e6ca65] text-[#061410] flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all duration-200"
            title={isPlaying ? "Pausar sessão" : "Iniciar sessão"}
          >
            {isPlaying ? (
              <Pause size={22} className="fill-[#061410]" />
            ) : (
              <Play size={22} className="fill-[#061410] ml-0.5" />
            )}
          </button>

          {/* Seek +15s */}
          <button
            onClick={onSeekForward}
            className="p-2 rounded-xl text-[#8ca89a] hover:text-[#f4f1ea] hover:bg-[#8ca89a]/10 transition-colors flex items-center justify-center relative"
            title="Avançar 15 segundos"
          >
            <RotateCw size={17} />
            <span className="absolute -bottom-1.5 text-[8px] font-mono font-bold text-[#d4af37]">15</span>
          </button>

          {/* Next Stage */}
          <button
            onClick={onNextStage}
            disabled={!hasNextStage}
            className="p-2.5 rounded-xl text-[#8ca89a] hover:text-[#f4f1ea] disabled:opacity-30 disabled:hover:text-[#8ca89a] hover:bg-[#8ca89a]/10 transition-colors"
            title="Próxima etapa"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Right Secondary: Mute / Sound Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-2.5 rounded-xl transition-colors ${
            isMuted
              ? 'text-rose-400 bg-rose-500/10'
              : 'text-[#8ca89a] hover:text-[#f4f1ea] hover:bg-[#8ca89a]/10'
          }`}
          title={isMuted ? "Ativar som" : "Silenciar voz"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
};
