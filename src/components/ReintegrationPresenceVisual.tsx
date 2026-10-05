import React from 'react';

export function reintegrationPresencePhase(seconds: number) {
  return seconds < 240 ? 0 : seconds < 360 ? 1 : seconds < 900 ? 2 : seconds < 1260 ? 3 : 4;
}
/** Use the five human figures from the approved artwork, with the audio clock
 * selecting their state. No repeated loop or reconstructed logo/body. */
export default function ReintegrationPresenceVisual({ elapsedSeconds }: { elapsedSeconds: number }) {
  const phase = reintegrationPresencePhase(elapsedSeconds);
  return <div className="reintegration-presence-visual" role="img" aria-label={['Presença inicial', 'A luz chega', 'A energia desce pelo corpo', 'Enraizamento nos pés e no solo', 'Integração'][phase]}>
    {[0, 1, 2, 3, 4].map(index => <div key={index} className="reintegration-presence-frame" style={{ backgroundPosition: `${index * 25}% 48%`, opacity: phase === index ? 1 : 0 }} />)}
  </div>;
}
