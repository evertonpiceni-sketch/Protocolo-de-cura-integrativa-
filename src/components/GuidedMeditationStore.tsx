import React from 'react';
import { COMMERCIAL_PRINCIPLE, GUIDED_MEDITATIONS } from '../lib/wellnessExperience';

type Props = { ownedIds?: string[]; onPreview?: (id: string) => void; onBuy?: (id: string) => void; onPlay?: (id: string) => void };

export default function GuidedMeditationStore({ ownedIds = [], onPreview, onBuy, onPlay }: Props) {
  return <section aria-labelledby="guided-meditations-title" className="rounded-[2rem] bg-[#f7f2e8] p-5 sm:p-7 text-[#18352b]">
    <p className="text-xs tracking-[0.2em] uppercase text-[#8a7441]">Meditações guiadas</p>
    <h2 id="guided-meditations-title" className="mt-2 text-2xl font-semibold">Escolha um momento para você</h2>
    <p className="mt-2 text-sm text-[#5c6962]">Práticas essenciais continuam gratuitas. Estas experiências premium têm prévia e, após a compra, ficam permanentemente na sua biblioteca.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {GUIDED_MEDITATIONS.map(item => {
        const owned = ownedIds.includes(item.id);
        return <article key={item.id} className="rounded-3xl bg-white/90 border border-[#e0ded3] p-5 shadow-sm">
          <p className="text-xs text-[#718078]">{item.durationMinutes} min</p>
          <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#5c6962]">{item.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {owned ? <button onClick={() => onPlay?.(item.id)} className="rounded-full bg-[#214d3b] px-4 py-2 text-sm text-white focus:outline-none focus-visible:ring-4 ring-[#d4b66b]/50">Ouvir</button> : <>
              <button onClick={() => onPreview?.(item.id)} className="rounded-full border border-[#214d3b] px-4 py-2 text-sm focus:outline-none focus-visible:ring-4 ring-[#d4b66b]/50">Ouvir prévia</button>
              <button onClick={() => onBuy?.(item.id)} className="rounded-full bg-[#214d3b] px-4 py-2 text-sm text-white focus:outline-none focus-visible:ring-4 ring-[#d4b66b]/50">R$ {item.priceBRL.toFixed(2).replace('.', ',')}</button>
            </>}
          </div>
          {!owned && <p className="mt-3 text-xs text-[#718078]">Compra única · acesso permanente</p>}
        </article>;
      })}
    </div>
    <p className="mt-6 text-xs italic leading-relaxed text-[#68756d]">{COMMERCIAL_PRINCIPLE}</p>
  </section>;
}
