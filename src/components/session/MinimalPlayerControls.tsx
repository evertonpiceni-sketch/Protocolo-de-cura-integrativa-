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
  const canSeek = Number.isFinite(duration) && duration > 0;
  const safeDuration = canSeek ? duration : 0;



  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-6 pt-2 select-none">
      {/* Progress Bar & Timestamps */}
      <div className="space-y-1.5 mb-4">
        <input
          type="range"
          aria-label="Posição do áudio"
          min={0}
          max={safeDuration || 1}
          step={0.1}
          value={canSeek ? Math.min(safeDuration, Math.max(0, currentTime)) : 0}
          disabled={!canSeek}
          onChange={event => onSeekTo(Number(event.target.value))}
          className="w-full h-6 accent-[#B88736] disabled:cursor-default"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5248] px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Main Control Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Secondary: Script Drawer */}
        <button
          onClick={onOpenScriptDrawer}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif text-[#5C5248] hover:text-[#2A2420] hover:bg-[#E5DAC6]/40 border border-transparent hover:border-[#E5DAC6] transition-all"
          title="Ler roteiro completo"
        >
          <BookOpen size={16} className="text-[#8F631E]" />
          <span className="hidden sm:inline">Roteiro</span>
        </button>

        {/* Center Primary Playback Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Previous Stage */}
          <button
            onClick={onPrevStage}
            disabled={!hasPrevStage}
            className="p-2.5 rounded-xl text-[#5C5248] hover:text-[#2A2420] disabled:opacity-30 disabled:hover:text-[#5C5248] hover:bg-[#E5DAC6]/40 transition-colors"
            title="Etapa anterior"
          >
            <SkipBack size={18} />
          </button>

          {/* Seek -15s */}
          <button
            onClick={onSeekBackward}
            disabled={!canSeek}
            className="p-2 rounded-xl text-[#5C5248] hover:text-[#2A2420] hover:bg-[#E5DAC6]/40 transition-colors flex items-center justify-center relative"
            title="Voltar 15 segundos"
          >
            <RotateCcw size={17} />
            <span className="absolute -bottom-1.5 text-[8px] font-mono font-bold text-[#8F631E]">15</span>
          </button>

          {/* Big Play / Pause */}
          <button
            onClick={onTogglePlay}
            className="ns-play-toggle w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#B88736] via-[#D4AF37] to-[#C5A059] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(184,135,54,0.3)] hover:shadow-[0_6px_25px_rgba(184,135,54,0.45)] hover:scale-105 active:scale-95 transition-all duration-200"
            title={isPlaying ? "Pausar sessão" : "Iniciar sessão"}
          >
            {isPlaying ? (
              <Pause size={22} className="fill-white" />
            ) : (
              <Play size={22} className="fill-white ml-0.5" />
            )}
          </button>

          {/* Seek +15s */}
          <button
            onClick={onSeekForward}
            disabled={!canSeek}
            className="p-2 rounded-xl text-[#5C5248] hover:text-[#2A2420] hover:bg-[#E5DAC6]/40 transition-colors flex items-center justify-center relative"
            title="Avançar 15 segundos"
          >
            <RotateCw size={17} />
            <span className="absolute -bottom-1.5 text-[8px] font-mono font-bold text-[#8F631E]">15</span>
          </button>

          {/* Next Stage */}
          <button
            onClick={onNextStage}
            disabled={!hasNextStage}
            className="p-2.5 rounded-xl text-[#5C5248] hover:text-[#2A2420] disabled:opacity-30 disabled:hover:text-[#5C5248] hover:bg-[#E5DAC6]/40 transition-colors"
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
              ? 'text-rose-500 bg-rose-50'
              : 'text-[#5C5248] hover:text-[#2A2420] hover:bg-[#E5DAC6]/40'
          }`}
          title={isMuted ? "Ativar som" : "Silenciar voz"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
};
