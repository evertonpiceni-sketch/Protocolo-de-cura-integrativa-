import React, { useMemo, useState } from 'react';
import { ARRIVAL_OPTIONS, ArrivalState, SOUNDSCAPES, SoundscapeId } from '../lib/wellnessExperience';

type Props = { name?: string; onComplete: (state: ArrivalState, soundscape: SoundscapeId) => void };

export default function RefinedWelcomeExperience({ name, onComplete }: Props) {
  const [step, setStep] = useState<'welcome' | 'arrival' | 'response' | 'sound'>('welcome');
  const [arrival, setArrival] = useState<ArrivalState | null>(null);
  const selected = useMemo(() => ARRIVAL_OPTIONS.find(o => o.id === arrival), [arrival]);

  const chooseArrival = (id: ArrivalState) => { setArrival(id); setStep('response'); };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f6f1e7] via-[#edf1e7] to-[#dfe8dd] text-[#18352b] px-5 py-8 flex items-center justify-center">
      <section className="w-full max-w-md rounded-[2rem] bg-white/80 backdrop-blur shadow-xl border border-white/70 p-7">
        {step === 'welcome' && <>
          <p className="text-xs tracking-[0.22em] uppercase text-[#6b755f]">Um lugar para voltar para si</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight">Que bom que você se ouviu e está aqui.</h1>
          <p className="mt-4 text-base leading-relaxed text-[#506057]">Este é um espaço para você cuidar de si, no seu tempo.</p>
          <button className="mt-8 w-full rounded-full bg-[#214d3b] text-white py-3.5 font-medium focus:outline-none focus-visible:ring-4 ring-[#d4b66b]/50" onClick={() => setStep('arrival')}>Entrar</button>
        </>}

        {step === 'arrival' && <>
          <p className="text-sm text-[#68756d]">{name ? `${name}, este momento é seu.` : 'Este momento é seu.'}</p>
          <h1 className="mt-2 text-2xl font-semibold">Como você chega até aqui hoje?</h1>
          <div className="mt-6 grid gap-3">
            {ARRIVAL_OPTIONS.map(option => <button key={option.id} onClick={() => chooseArrival(option.id)} className="text-left rounded-2xl border border-[#d8dfd5] bg-[#fbfcf8] px-4 py-3.5 hover:bg-[#f0f4eb] focus:outline-none focus-visible:ring-4 ring-[#d4b66b]/50">{option.label}</button>)}
          </div>
        </>}

        {step === 'response' && selected && <>
          <p className="text-xs tracking-[0.22em] uppercase text-[#8a7441]">Acolhimento</p>
          <h1 className="mt-4 text-2xl font-semibold">Você pode ficar aqui por alguns minutos.</h1>
          <p className="mt-4 leading-relaxed text-[#506057]">{selected.response}</p>
          <button className="mt-8 w-full rounded-full bg-[#214d3b] text-white py-3.5 font-medium focus:outline-none focus-visible:ring-4 ring-[#d4b66b]/50" onClick={() => setStep('sound')}>Continuar</button>
        </>}

        {step === 'sound' && arrival && <>
          <p className="text-xs tracking-[0.22em] uppercase text-[#8a7441]">Paisagem sonora</p>
          <h1 className="mt-4 text-2xl font-semibold">Como você gostaria de viver este momento?</h1>
          <div className="mt-6 grid gap-3">
            {SOUNDSCAPES.map(sound => <button key={sound.id} onClick={() => onComplete(arrival, sound.id as SoundscapeId)} className="text-left rounded-2xl border border-[#d8dfd5] bg-[#fbfcf8] px-4 py-3.5 hover:bg-[#f0f4eb] focus:outline-none focus-visible:ring-4 ring-[#d4b66b]/50">{sound.label}</button>)}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#718078]">Nada começa a tocar sem a sua escolha. Você pode alterar ou desligar o som a qualquer momento.</p>
        </>}
      </section>
    </main>
  );
}
