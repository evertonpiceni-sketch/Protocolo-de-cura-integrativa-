import React from 'react';
import { getVisualDiaInstrucao } from '../data/visualMap21Dias';

export function reintegrationPresencePhase(seconds: number) {
  return seconds < 240 ? 0 : seconds < 360 ? 1 : seconds < 900 ? 2 : seconds < 1260 ? 3 : 4;
}
/** Use the five human figures from the approved artwork, with the audio clock
 * selecting their state. No repeated loop or reconstructed logo/body. */
// Coordinates refer to the unchanged human model in the approved artwork.
// These localized reveals are the fallback while each official MP4 is unavailable.
const regions: Record<number, [number, number][]> = {
  2: [[50,12],[50,24],[50,36],[50,49],[50,65],[50,84]],
  3: [[50,84],[50,70],[50,59],[50,49]],
  4: [[50,33]], 5: [[50,33],[50,49],[16,60],[84,60]],
  6: [[50,49],[30,38],[70,38],[25,66],[75,66]],
  7: [[50,14],[50,33]], 8: [[31,27],[69,27],[50,45],[50,69],[50,86]],
  9: [[50,49],[35,67],[65,67],[35,84],[65,84]],
  10: [[50,33]], 11: [[50,22],[50,28],[50,33]],
  12: [[50,12],[50,33],[50,49],[50,67],[50,84]],
  13: [[50,16],[35,26],[65,26]],
  14: [[50,33],[28,43],[72,43],[16,60],[84,60]],
  15: [[35,84],[65,84],[50,49],[16,60],[84,60]],
  16: [[50,16],[35,84],[65,84],[50,92]],
  17: [[32,27],[68,27],[24,43],[76,43],[40,51],[60,51],[37,68],[63,68],[35,84],[65,84]],
  18: [[35,84],[65,84],[50,49]],
  19: [[50,33],[50,49],[24,43],[76,43],[37,68],[63,68]],
  20: [[16,60],[84,60],[35,84],[65,84],[50,14],[50,33],[50,49]],
  21: [[50,14],[50,33],[50,49],[50,67],[50,84]],
};
export default function ReintegrationPresenceVisual({ day = 1, elapsedSeconds }: { day?: number; elapsedSeconds: number }) {
  const phase = reintegrationPresencePhase(elapsedSeconds);
  const instruction = getVisualDiaInstrucao(day);
  const progress = Math.max(0, Math.min(1, (elapsedSeconds - 360) / 540));
  const points = regions[day] || regions[2];
  const revealed = progress * points.length;
  const masks = points.map(([x,y], index) => {
    const amount = Math.max(0, Math.min(1, revealed - index));
    return `radial-gradient(ellipse ${10 + amount * 8}% ${5 + amount * 5}% at ${x}% ${y}%, rgba(0,0,0,${amount}) 0%, transparent 100%)`;
  }).join(',');
  return <div className="reintegration-presence-visual" data-day={day} data-visual-fallback="approved-human" role="img" aria-label={`Dia ${day}: ${instruction.titulo}. ${instruction.movimentoLuz}`}>
    {day === 1 ? [0, 1, 2, 3, 4].map(index => <div key={index} className="reintegration-presence-frame" style={{ backgroundPosition: `${index * 25}% 48%`, opacity: phase === index ? 1 : 0, filter: index === 0 ? 'brightness(.3)' : undefined }} />) : <>
      <div className="reintegration-presence-frame" style={{backgroundPosition:'0% 48%', filter:'brightness(.3)'}} />
      <div className="reintegration-presence-frame" style={{backgroundPosition:'100% 48%', maskImage:masks, WebkitMaskImage:masks, opacity:progress > 0 ? 1 : 0}} />
    </>}
  </div>;
}
