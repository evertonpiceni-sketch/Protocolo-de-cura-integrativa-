import React from 'react';
import { reintegrationPresenceWeights } from '../lib/reintegrationVisualTiming';
import { getVisualDiaInstrucao } from '../data/visualMap21Dias';
import NeutralBodyLightProgress from './NeutralBodyLightProgress';

/**
 * Silhueta corporal neutra aprovada para a Reintegração nas quatro atmosferas.
 * O tema altera apenas as cores e a paisagem de fundo; não há variantes por gênero,
 * chakras, mandalas ou retorno à arte corporal legada.
 */
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

interface ReintegrationPresenceVisualProps {
  day?: number;
  elapsedSeconds: number;
  active?: boolean;
}

export default function ReintegrationPresenceVisual({
  day = 1,
  elapsedSeconds,
  active = false
}: ReintegrationPresenceVisualProps) {
  const weights = reintegrationPresenceWeights(elapsedSeconds);
  const instruction = getVisualDiaInstrucao(day);
  const points = regions[day] || [[50,92]];
  const stageProgress = weights.reduce((total, weight, index) => total + weight * index * 25, 0);
  const neutralProgress = 20 + stageProgress * 0.8;
  const focusPosition = day === 1
    ? 8 + stageProgress * 0.84
    : (points[points.length - 1]?.[1] ?? 50);

  return (
    <NeutralBodyLightProgress
      variant="canvas"
      showLabel={false}
      progress={neutralProgress}
      active={active}
      focusPosition={focusPosition}
      focusLabel={instruction.regiaoCorporal}
      labelTitle="Movimento da luz"
      movementDescription={instruction.movimentoLuz}
      showRoots={day === 1}
      className="reintegration-neutral-body-visual"
    />
  );
}
