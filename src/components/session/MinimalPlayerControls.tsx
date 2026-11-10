import React from 'react';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw, RotateCw,
  Volume2, VolumeX, BookOpen
} from 'lucide-react';

interface MinimalPlayerControlsProps {
  isPlaying: boolean;
  isEssenciaLuminosa?: boolean;
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
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const MinimalPlayerControls: React.FC<MinimalPlayerControlsProps> = ({
  isPlaying,
  isEssenciaLuminosa = false,
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
  const hasKnownDuration = Number.isFinite(duration) && duration > 0;
  const safeCurrentTime = Number.isFinite(currentTime) && currentTime >= 0 ? currentTime : 0;
  const progressPercent = hasKnownDuration
    ? Math.min(100, Math.max(0, (safeCurrentTime / duration) * 100))
    : 0;
  const progressStartColor = isEssenciaLuminosa ? '#C6A46A' : '#B88736';
  const progressPeakColor = isEssenciaLuminosa ? '#A87E37' : '#D4AF37';

  const focusRingClass = isEssenciaLuminosa
    ? 'focus-visible:ring-[#C6A46A]/45'
    : 'focus-visible:ring-[#B88736]/35';
  const playButtonClass = isEssenciaLuminosa
    ? 'ns-play-toggle w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F7F3E8] via-[#C6A46A] to-[#A87E37] text-[#2A2420] flex items-center justify-center shadow-[0_4px_20px_rgba(112,91,58,0.12)] hover:shadow-[0_6px_25px_rgba(112,91,58,0.16)] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A46A]/45'
    : 'ns-play-toggle w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B88736] via-[#D4AF37] to-[#C5A059] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(184,135,54,0.3)] hover:shadow-[0_6px_25px_rgba(184,135,54,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/40';
  const mutedStateClass = isMuted
    ? isEssenciaLuminosa
      ? 'text-[#8F631E] bg-[#F7F3E8] border border-[#E5DAC6]'
      : 'text-rose-500 bg-rose-50'
    : 'text-[#5C5248] hover:text-[#2A2420] hover:bg-[#E5DAC6]/40';

  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-6 pt-2 select-none">
      <div className="space-y-1.5 mb-4">
        {hasKnownDuration ? (
          <input
            type="range"
            min={0}
            max={duration}
            step={0.25}
            value={Math.min(safeCurrentTime, duration)}
            onChange={event => onSeekTo(Number(event.target.value))}
            aria-label="Posição da narração"
            aria-valuetext={`${formatTime(safeCurrentTime)} de ${formatTime(duration)}`}
            className={`ep-protocol-progress block w-full h-8 cursor-pointer ${isEssenciaLuminosa ? 'accent-[#C6A46A]' : 'accent-[#B88736]'}`}
            style={{
              '--ep-progress': `${progressPercent}%`,
              background: `linear-gradient(90deg, ${progressStartColor} 0%, ${progressPeakColor} ${progressPercent}%, #E5DAC6 ${progressPercent}%, #E5DAC6 100%)`
            } as React.CSSProperties}
          />
        ) : (
          <div
            role="progressbar"
            aria-label="Duração da narração ainda não disponível"
            aria-valuetext="Duração ainda não disponível"
            className="relative h-2 w-full overflow-hidden rounded-full bg-[#E5DAC6]"
          >
            <div className={`absolute inset-y-0 left-0 w-1/3 animate-pulse motion-reduce:animate-none rounded-full bg-gradient-to-r ${isEssenciaLuminosa ? 'from-[#C6A46A]/15 via-[#A87E37]/40 to-[#C6A46A]/15' : 'from-[#B88736]/15 via-[#D4AF37]/55 to-[#B88736]/15'}`} />
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5248] px-0.5">
          <span>{formatTime(safeCurrentTime)}</span>
          <span>{hasKnownDuration ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onOpenScriptDrawer}
          className={`flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif text-[#5C5248] hover:text-[#2A2420] hover:bg-[#E5DAC6]/40 border border-transparent hover:border-[#E5DAC6] transition-all focus-visible:outline-none focus-visible:ring-2 ${focusRingClass}`}
          title="Ler roteiro completo"
          aria-label="Ler roteiro completo"
        >
          <BookOpen size={16} className={isEssenciaLuminosa ? 'text-[#A87E37]' : 'text-[#8F631E]'} />
          <span className="hidden sm:inline">Roteiro</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onPrevStage}
            disabled={!hasPrevStage}
            className={`min-h-11 min-w-11 rounded-xl text-[#5C5248] hover:text-[#2A2420] disabled:opacity-30 disabled:hover:text-[#5C5248] hover:bg-[#E5DAC6]/40 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 ${focusRingClass}`}
            title="Etapa anterior"
            aria-label="Etapa anterior"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={onSeekBackward}
            disabled={!hasKnownDuration}
            className={`min-h-11 min-w-11 rounded-xl text-[#5C5248] hover:text-[#2A2420] hover:bg-[#E5DAC6]/40 transition-colors flex items-center justify-center relative disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 ${focusRingClass}`}
            title={hasKnownDuration ? 'Voltar 15 segundos' : 'A duração ainda não está disponível'}
            aria-label="Voltar 15 segundos"
          >
            <RotateCcw size={17} />
            <span className="absolute bottom-0.5 text-[8px] font-mono font-bold text-[#8F631E]">15</span>
          </button>

          <button
            onClick={onTogglePlay}
            className={playButtonClass}
            title={isPlaying ? 'Pausar sessão' : 'Iniciar sessão'}
            aria-label={isPlaying ? 'Pausar sessão' : 'Iniciar sessão'}
          >
            {isPlaying ? (
              <Pause size={22} className={isEssenciaLuminosa ? 'fill-[#2A2420]' : 'fill-white'} />
            ) : (
              <Play size={22} className={`ml-0.5 ${isEssenciaLuminosa ? 'fill-[#2A2420]' : 'fill-white'}`} />
            )}
          </button>

          <button
            onClick={onSeekForward}
            disabled={!hasKnownDuration}
            className={`min-h-11 min-w-11 rounded-xl text-[#5C5248] hover:text-[#2A2420] hover:bg-[#E5DAC6]/40 transition-colors flex items-center justify-center relative disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 ${focusRingClass}`}
            title={hasKnownDuration ? 'Avançar 15 segundos' : 'A duração ainda não está disponível'}
            aria-label="Avançar 15 segundos"
          >
            <RotateCw size={17} />
            <span className="absolute bottom-0.5 text-[8px] font-mono font-bold text-[#8F631E]">15</span>
          </button>

          <button
            onClick={onNextStage}
            disabled={!hasNextStage}
            className={`min-h-11 min-w-11 rounded-xl text-[#5C5248] hover:text-[#2A2420] disabled:opacity-30 disabled:hover:text-[#5C5248] hover:bg-[#E5DAC6]/40 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 ${focusRingClass}`}
            title="Próxima etapa"
            aria-label="Próxima etapa"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <button
          onClick={onToggleMute}
          className={`min-h-11 min-w-11 rounded-xl transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 ${focusRingClass} ${mutedStateClass}`}
          title={isMuted ? 'Ativar som' : 'Silenciar voz'}
          aria-label={isMuted ? 'Ativar som' : 'Silenciar voz'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
};
