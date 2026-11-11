import React from 'react';

interface NeutralBodyLightProgressProps {
  progress: number | null;
  active: boolean;
  focusPosition: number;
  focusLabel: string;
  className?: string;
  variant?: 'card' | 'canvas';
  showLabel?: boolean;
  labelTitle?: string;
  lightColor?: string;
  lightSoft?: string;
  movementDescription?: string;
  breathePhase?: 'inhale' | 'hold' | 'exhale';
  showRoots?: boolean;
}

/**
 * Silhueta corporal neutra com um único percurso de luz.
 * A região do dia é indicada sem chakras, mandalas ou marcadores coloridos.
 */
export default function NeutralBodyLightProgress({
  progress,
  active,
  focusPosition,
  focusLabel,
  className = '',
  variant = 'card',
  showLabel = true,
  labelTitle = 'Região do dia',
  lightColor = 'var(--layout-gold-light, #E2B96B)',
  lightSoft = 'var(--layout-gold-soft, rgba(200,157,82,.16))',
  movementDescription,
  breathePhase,
  showRoots = false
}: NeutralBodyLightProgressProps) {
  const illumination = progress === null
    ? (active ? 0.22 : 0.08)
    : Math.max(0.08, Math.min(1, progress / 100));
  const strokeOffset = 100 - Math.round(illumination * 100);
  const regionY = 10 + Math.max(0, Math.min(100, focusPosition));
  const gradientId = React.useId().replace(/:/g, '');
  const isCanvas = variant === 'canvas';
  const breatheScale = breathePhase === 'inhale' ? 1.012 : breathePhase === 'exhale' ? 0.988 : 1;
  const ariaMovement = movementDescription ? ` Movimento visual: ${movementDescription}` : '';

  return (
    <div
      className={`ep-neutral-body-progress relative mx-auto flex aspect-[4/5] w-full max-w-[430px] flex-col items-center justify-between overflow-hidden rounded-[28px] border p-5 shadow-[0_16px_42px_rgba(67,52,39,.08)] ${isCanvas ? 'ep-neutral-body-progress--canvas' : ''} ${className}`}
      style={{
        background: isCanvas ? 'transparent' : 'var(--layout-card, #FFFDF8)',
        borderColor: isCanvas ? 'transparent' : 'var(--layout-border, #E8E0D5)',
        color: 'var(--layout-text, #2A2421)',
        boxShadow: isCanvas ? 'none' : undefined,
        padding: isCanvas ? 0 : undefined
      }}
      role="img"
      aria-label={`Silhueta corporal neutra. ${labelTitle}: ${focusLabel}.${ariaMovement}`}
    >
      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
        <svg viewBox="0 0 100 120" className="ep-neutral-body-progress__svg h-full max-h-[390px] w-auto max-w-full" aria-hidden="true">
          <defs>
            <linearGradient id={`${gradientId}-light`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lightColor} />
              <stop offset="100%" stopColor="var(--layout-gold, #C89D52)" />
            </linearGradient>
            <radialGradient id={`${gradientId}-glow`}>
              <stop offset="0%" stopColor={lightSoft} stopOpacity=".72" />
              <stop offset="100%" stopColor={lightSoft} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${gradientId}-integration`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lightSoft} stopOpacity=".06" />
              <stop offset="100%" stopColor={lightSoft} stopOpacity=".42" />
            </linearGradient>
          </defs>

          <g
            className="ep-neutral-body-progress__breath"
            style={{
              transform: `scale(${breatheScale})`,
              transformOrigin: '50% 50%',
              transition: breathePhase === 'inhale'
                ? 'transform 4s ease-in-out'
                : breathePhase === 'exhale'
                  ? 'transform 5s ease-in-out'
                  : 'transform 3s ease-in-out'
            }}
          >
            <path
              d="M50 8 C43 8 39 14 39 21 C39 27 43 32 50 32 C57 32 61 27 61 21 C61 14 57 8 50 8 Z M42 35 C37 35 34 39 32 45 L25 61 C24 64 26 67 29 68 C32 69 34 67 35 64 L41 50 L41 69 L38 98 C37 102 40 105 44 105 L47 105 L50 78 L53 105 L56 105 C60 105 63 102 62 98 L59 69 L59 50 L65 64 C66 67 68 69 71 68 C74 67 76 64 75 61 L68 45 C66 39 63 35 58 35 Z"
              fill="var(--layout-card-subtle, #F5EFE5)"
              fillOpacity={0.48 + illumination * 0.3}
              stroke="var(--layout-gold, #C89D52)"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />

            <path
              d="M50 13 C49 27 51 39 50 52 C49 68 51 84 50 108"
              fill="none"
              stroke={`url(#${gradientId}-light)`}
              strokeWidth="3"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={strokeOffset}
              className="ep-neutral-body-progress__light-path"
              opacity={0.25 + illumination * 0.75}
            />

            {showRoots && (
              <g
                className="ep-neutral-body-progress__roots"
                opacity={Math.max(0, Math.min(1, (illumination - 0.72) / 0.28))}
              >
                <path
                  d="M50 104 C49 109 45 113 40 118 M50 104 C51 109 55 113 60 118"
                  fill="none"
                  stroke={`url(#${gradientId}-light)`}
                  strokeWidth="1.45"
                  strokeLinecap="round"
                />
                <path
                  d="M44 113 C39 113 36 115 33 118 M56 113 C61 113 64 115 67 118"
                  fill="none"
                  stroke={`url(#${gradientId}-light)`}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </g>
            )}

            <ellipse
              cx="50"
              cy={regionY}
              rx="13"
              ry="8"
              fill={`url(#${gradientId}-glow)`}
              opacity={0.18 + illumination * 0.72}
              className={active ? 'ep-neutral-body-progress__glow' : ''}
            />
            <circle
              cx="50"
              cy={regionY}
              r="2.1"
              fill="var(--layout-gold-dark, #A87E37)"
              opacity={0.35 + illumination * 0.65}
            />
            <path
              d="M50 13 C49 27 51 39 50 52 C49 68 51 84 50 108"
              fill="none"
              stroke={`url(#${gradientId}-integration)`}
              strokeWidth="8"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={strokeOffset}
              opacity={illumination >= 0.98 ? 0.8 : 0.12}
              className="ep-neutral-body-progress__light-path"
            />
          </g>
        </svg>
      </div>

      {showLabel && (
        <div className="relative z-10 w-full border-t pt-3 text-center" style={{ borderColor: 'var(--layout-border, #E8E0D5)' }}>
          <span className="block text-[10px] font-semibold uppercase tracking-[.18em]" style={{ color: 'var(--layout-gold-dark, #A87E37)' }}>
            {labelTitle}
          </span>
          <span className="mt-1 block text-sm font-medium" style={{ color: 'var(--layout-text, #2A2421)' }}>
            {focusLabel}
          </span>
        </div>
      )}
    </div>
  );
}
