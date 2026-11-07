import React from 'react';
import { CHAKRA_DAILY_VISUALS } from '../lib/wellnessExperience';

type Props = { day: number; completed?: boolean; imageSrc: string };

export default function ChakraDailyMandala({ day, completed = false, imageSrc }: Props) {
  const chakra = CHAKRA_DAILY_VISUALS.find(item => item.day === day);
  if (!chakra) return null;

  return <figure className="text-center" aria-label={`Dia ${day}: ${chakra.name}, ${chakra.label}`}>
    <style>{`@keyframes chakra-spin{to{transform:rotate(360deg)}}.chakra-spin{animation:chakra-spin 28s linear infinite}@media (prefers-reduced-motion: reduce){.chakra-spin{animation:none!important}}`}</style>
    <div className={`mx-auto aspect-square w-full max-w-[280px] rounded-full p-3 bg-black/5 ${completed ? 'shadow-xl' : 'opacity-90'}`}>
      <img src={imageSrc} alt={`Mandala tradicional de ${chakra.name} — ${chakra.label}`} className="chakra-spin h-full w-full rounded-full object-contain" />
    </div>
    <figcaption className="mt-3">
      <span className="block text-xs uppercase tracking-[0.18em]">Dia {day}</span>
      <strong className="block text-lg">{chakra.name}</strong>
      <span className="text-sm opacity-70">{chakra.label}</span>
    </figcaption>
  </figure>;
}
