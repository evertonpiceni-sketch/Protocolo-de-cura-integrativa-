/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Play, Pause, RotateCcw, CheckCircle2, Copy, X, Info } from 'lucide-react';
import { audioEngine } from '../lib/audio';
import { UserProfile } from '../types';
import { getLocalDateString } from '../utils/date';

interface HooponoponoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userProfile?: UserProfile;
  onPracticeCountChange?: (count: number) => void;
}

const THEMES = [
  {
    id: 'geral',
    title: 'Reconciliação Geral',
    desc: 'Um momento de presença para observar memórias, conflitos e sentimentos que você deseja acolher.',
    focusPhrase: 'Eu sinto muito. Por favor, me perdoe. Eu te amo. Sou grato(a).'
  },
  {
    id: 'autoperdao',
    title: 'Autoperdão & Paz Interior',
    desc: 'Um convite a suavizar autocobrança, culpa e julgamentos sobre a própria história.',
    focusPhrase: 'Eu sinto muito por ter me cobrado tanto. Me perdoe. Eu me acolho com amor. Sou grato(a) pela minha caminhada.'
  },
  {
    id: 'prosperidade',
    title: 'Prosperidade & Relação com Recursos',
    desc: 'Uma reflexão sobre medos, crenças de escassez e a relação emocional com recursos e possibilidades.',
    focusPhrase: 'Memórias de escassez e medo: eu sinto muito. Me perdoe. Eu acolho novas possibilidades. Sou grato(a).'
  },
  {
    id: 'relacionamentos',
    title: 'Relacionamentos & Reconciliação',
    desc: 'Uma prática de presença diante de mágoas, ressentimentos e vínculos que ainda pedem compreensão.',
    focusPhrase: 'Diante deste vínculo, eu sinto muito. Me perdoe. Eu te amo. Sou grato(a) pelo que posso compreender e transformar em mim.'
  }
];

const MORRNAH_PRAYER = `Divino Criador, Pai, Mãe, Filho, todos em Um...

Se eu, minha família, meus parentes e ancestrais lhe ofendemos em pensamentos, palavras, atos ou ações, desde o início da nossa criação até o presente, nós pedimos o Seu perdão...

Deixe que isto se limpe, purifique, libere e corte todas as memórias, bloqueios, energias e vibrações negativas, e transmute essas energias indesejáveis em pura luz...

E assim está feito.

Sinto muito.
Me perdoe.
Eu te amo.
Sou grato.`;

const PHRASES = [
  { text: 'Sinto Muito', desc: 'Reconheço o que pede minha atenção e assumo presença diante desta experiência.', tone: '#B88736' },
  { text: 'Me Perdoe', desc: 'Abro espaço para perdão, responsabilidade e uma relação mais gentil comigo.', tone: '#5E7153' },
  { text: 'Eu Te Amo', desc: 'Levo compaixão para mim, para a situação e para os vínculos envolvidos.', tone: '#A66B70' },
  { text: 'Sou Grato(a)', desc: 'Reconheço o aprendizado possível e agradeço pelo momento de consciência.', tone: '#2D6A4F' }
];

export default function HooponoponoModal({ isOpen, onClose, userName = 'Buscador de Luz', userProfile, onPracticeCountChange }: HooponoponoModalProps) {
  const [selectedTab, setSelectedTab] = useState<'oracao' | 'japamala' | 'chaves'>('oracao');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [targetCount, setTargetCount] = useState(108);
  const [count, setCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [prayedToday, setPrayedToday] = useState(() => {
    try { return localStorage.getItem(`cura_integrada_hooponopono_${getLocalDateString()}`) === 'true'; }
    catch { return false; }
  });

  useEffect(() => () => audioEngine.stopSpeech(), []);
  if (!isOpen) return null;

  const markDone = () => {
    if (prayedToday) return;
    setPrayedToday(true);
    onPracticeCountChange?.(Number(userProfile?.hooponoponoPracticedCount || 0) + 1);
    try { localStorage.setItem(`cura_integrada_hooponopono_${getLocalDateString()}`, 'true'); }
    catch (error) { console.warn('Não foi possível registrar a prática localmente.', error); }
  };

  const increment = () => {
    audioEngine.unlock();
    const next = Math.min(targetCount, count + 1);
    setCount(next);
    if (next >= targetCount) markDone();
  };

  const toggleAudio = () => {
    audioEngine.unlock();
    if (isPlayingAudio) {
      audioEngine.stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const text = selectedTab === 'oracao'
      ? MORRNAH_PRAYER
      : `${selectedTheme.title}. ${selectedTheme.desc}. ${selectedTheme.focusPhrase}`;
    setIsPlayingAudio(true);
    void audioEngine.speakWithElevenLabsOrFallback(
      text,
      userProfile?.voiceVolume ?? 0.9,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      undefined,
      undefined,
      {
        voiceId: userProfile?.voiceId || (userProfile?.preferredVoiceGender === 'feminina' ? 'Rachel' : 'Marcus'),
        rate: userProfile?.voiceRate ?? 0.82,
        pitch: userProfile?.voicePitch ?? 0.98,
        lang: 'pt-BR',
        userName
      }
    );
  };

  const copyPrayer = async () => {
    try {
      await navigator.clipboard.writeText(MORRNAH_PRAYER);
      setCopiedText(true);
      window.setTimeout(() => setCopiedText(false), 2500);
    } catch (error) {
      console.warn('Não foi possível copiar a oração.', error);
      setCopiedText(false);
    }
  };

  const close = () => {
    audioEngine.stopSpeech();
    setIsPlayingAudio(false);
    onClose();
  };

  const tabClass = (active: boolean) => `min-h-11 rounded-xl px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35 ${active ? 'bg-[#B88736] text-white shadow-sm' : 'text-[#5C5248] hover:bg-[#F5EFE4] hover:text-[#2A2420]'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto overscroll-contain bg-[#2A2420]/30 p-2 sm:p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="hooponopono-title">
      <motion.div initial={{ opacity: 0, scale: .96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} className="relative my-1 sm:my-4 w-full max-w-2xl max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl border border-[#E5DAC6] bg-[#FBF8F2] p-4 sm:p-7 shadow-2xl">
        <button type="button" onClick={close} aria-label="Fechar Ho’oponopono" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248] hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35">
          <X size={18} />
        </button>

        <header className="mx-auto max-w-lg space-y-2 pr-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B88736]/25 bg-[#B88736]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.17em] text-[#8F631E]">
            <Heart size={13} /> Ho’oponopono
          </div>
          <h2 id="hooponopono-title" className="font-display text-2xl font-semibold text-[#2A2420] md:text-3xl">Reconciliação, presença e gratidão</h2>
          <p className="text-xs leading-relaxed text-[#5C5248] md:text-sm">Prática inspirada na tradição havaiana contemporânea de reconciliação. Use como reflexão espiritual e de autocuidado.</p>
        </header>

        <div className="mt-5 grid grid-cols-3 gap-1.5 rounded-2xl border border-[#E5DAC6] bg-white/75 p-1" role="tablist" aria-label="Modos de prática">
          <button type="button" role="tab" aria-selected={selectedTab === 'oracao'} onClick={() => setSelectedTab('oracao')} className={tabClass(selectedTab === 'oracao')}>Oração</button>
          <button type="button" role="tab" aria-selected={selectedTab === 'japamala'} onClick={() => setSelectedTab('japamala')} className={tabClass(selectedTab === 'japamala')}>Repetições</button>
          <button type="button" role="tab" aria-selected={selectedTab === 'chaves'} onClick={() => setSelectedTab('chaves')} className={tabClass(selectedTab === 'chaves')}>4 Chaves</button>
        </div>

        {selectedTab === 'oracao' && (
          <section className="mt-5 space-y-4">
            <div className="whitespace-pre-line rounded-3xl border border-[#B88736]/20 bg-white/80 p-5 text-center font-serif text-xs italic leading-relaxed text-[#2A2420] shadow-sm sm:p-6 sm:text-sm">{MORRNAH_PRAYER}</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PHRASES.map(item => <div key={item.text} className="rounded-2xl border border-[#E5DAC6] bg-white/75 p-3 text-center"><strong className="block text-xs" style={{ color: item.tone }}>{item.text}</strong><span className="mt-1 block text-[10px] leading-tight text-[#5C5248]">{item.desc}</span></div>)}
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-between">
              <button type="button" onClick={toggleAudio} className="min-h-11 rounded-xl bg-[#B88736] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8F631E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35">{isPlayingAudio ? <Pause size={15} className="mr-2 inline" /> : <Play size={15} className="mr-2 inline" />}{isPlayingAudio ? 'Pausar áudio' : 'Ouvir oração'}</button>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copyPrayer} className="min-h-11 rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] px-3 py-2.5 text-xs font-semibold text-[#5C5248] hover:bg-[#EFE4D3]"><Copy size={14} className="mr-1.5 inline" />{copiedText ? 'Copiada' : 'Copiar texto'}</button>
                <button type="button" onClick={markDone} className={`min-h-11 rounded-xl border px-3 py-2.5 text-xs font-semibold ${prayedToday ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-[#E5DAC6] bg-white text-[#5C5248]'}`}><CheckCircle2 size={14} className="mr-1.5 inline" />{prayedToday ? 'Praticado hoje' : 'Marcar como feito'}</button>
              </div>
            </div>
          </section>
        )}

        {selectedTab === 'japamala' && (
          <section className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {THEMES.map(theme => <button key={theme.id} type="button" onClick={() => { setSelectedTheme(theme); setCount(0); }} aria-pressed={selectedTheme.id === theme.id} className={`min-h-20 rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 ${selectedTheme.id === theme.id ? 'border-[#B88736] bg-[#B88736]/8' : 'border-[#E5DAC6] bg-white/75 hover:bg-white'}`}><strong className="block text-xs text-[#2A2420]">{theme.title}</strong><span className="mt-1 block text-[11px] leading-relaxed text-[#5C5248]">{theme.desc}</span></button>)}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5DAC6] bg-white/75 p-3">
              <span className="text-xs text-[#5C5248]">Meta de repetições</span>
              <div className="flex gap-2">
                {[21, 108].map(value => <button key={value} type="button" onClick={() => { setTargetCount(value); setCount(0); }} aria-pressed={targetCount === value} className={`min-h-11 rounded-xl px-3 text-xs font-semibold ${targetCount === value ? 'bg-[#B88736] text-white' : 'border border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248]'}`}>{value}x</button>)}
              </div>
            </div>
            <div className="rounded-3xl border border-[#B88736]/25 bg-white/85 p-5 text-center shadow-sm">
              <div className="text-4xl font-bold text-[#8F631E]">{count}<span className="text-base font-normal text-[#85786C]"> / {targetCount}</span></div>
              <div className="mx-auto mt-3 h-2 max-w-sm overflow-hidden rounded-full bg-[#E5DAC6]"><div className="h-full rounded-full bg-[#B88736] transition-all" style={{ width: `${Math.min(100, (count / targetCount) * 100)}%` }} /></div>
              <motion.button whileTap={{ scale: .94 }} type="button" onClick={increment} disabled={count >= targetCount} className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#D6A756]/35 bg-gradient-to-br from-[#B88736] to-[#8F631E] text-white shadow-lg disabled:opacity-65 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B88736]/25"><Heart size={30} /><span className="sr-only">Registrar repetição</span></motion.button>
              <p className="mx-auto mt-4 max-w-lg rounded-2xl bg-[#FBF8F2] p-3 font-serif text-sm italic leading-relaxed text-[#5C5248]">“{selectedTheme.focusPhrase}”</p>
              <button type="button" onClick={() => setCount(0)} className="mt-4 min-h-11 px-3 text-xs text-[#5C5248] hover:text-[#2A2420]"><RotateCcw size={13} className="mr-1.5 inline" />Reiniciar contador</button>
            </div>
          </section>
        )}

        {selectedTab === 'chaves' && (
          <section className="mt-5 space-y-3">
            <div className="flex items-start gap-2 rounded-2xl border border-[#B88736]/20 bg-[#B88736]/7 p-4 text-xs leading-relaxed text-[#5C5248]"><Info size={16} className="mt-0.5 shrink-0 text-[#8F631E]" /><p>Nesta prática, autorresponsabilidade significa observar o que está ao seu alcance transformar em si. Não significa assumir culpa por acontecimentos, doenças, violências ou ações de outras pessoas.</p></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PHRASES.map((phrase, index) => <article key={phrase.text} className="rounded-2xl border border-[#E5DAC6] bg-white/80 p-4"><div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold" style={{ color: phrase.tone }}>{phrase.text}</h3><span className="font-mono text-[10px] text-[#85786C]">{String(index + 1).padStart(2, '0')}</span></div><p className="mt-2 text-xs leading-relaxed text-[#5C5248]">{phrase.desc}</p></article>)}
            </div>
          </section>
        )}

        <footer className="mt-5 border-t border-[#E5DAC6] pt-4 text-center text-[11px] leading-relaxed text-[#85786C]">Prática espiritual e reflexiva. Não substitui cuidados médicos, psicológicos, jurídicos ou sociais quando necessários.</footer>
      </motion.div>
    </div>
  );
}
