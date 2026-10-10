/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Activity, CheckCircle2, Crown } from 'lucide-react';

interface ChakrasGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProModal?: () => void;
}

interface ChakraInfo {
  id: string;
  number: number;
  sanskritName: string;
  name: string;
  color: string;
  colorSoft: string;
  location: string;
  element: string;
  bijaMantra: string;
  solfeggioFreq: string;
  symbolizes: string;
  inBalance: string;
  whenBlocked: string;
  protocolAction: string;
  affirmation: string;
}

export const CHAKRAS_DATA: ChakraInfo[] = [
  {
    id: 'muladhara', number: 1, sanskritName: 'Muladhara', name: 'Chakra Básico (Raiz)',
    color: '#b94343', colorSoft: '#f8e6e3', location: 'Base da coluna e períneo', element: 'Terra', bijaMantra: 'LAM', solfeggioFreq: '396 Hz',
    symbolizes: 'Na tradição dos chakras, representa segurança, pertencimento, estabilidade e relação com a vida material.',
    inBalance: 'É tradicionalmente associado a presença, firmeza, confiança e sensação de enraizamento.',
    whenBlocked: 'Na tradição energética, pode ser associado a insegurança, medo, instabilidade ou dificuldade de se sentir presente e enraizado.',
    protocolAction: 'Aterramento e Raízes Sagradas: visualização de raízes de luz em direção à Terra, com intenção de presença e estabilidade.',
    affirmation: 'Eu estou presente, seguro e ancorado no agora.'
  },
  {
    id: 'svadhisthana', number: 2, sanskritName: 'Svadhisthana', name: 'Chakra Sacral',
    color: '#d97706', colorSoft: '#fff1dd', location: 'Baixo ventre', element: 'Água', bijaMantra: 'VAM', solfeggioFreq: '417 Hz',
    symbolizes: 'Na tradição dos chakras, representa criatividade, prazer, emoções, vínculos e capacidade de fluir com mudanças.',
    inBalance: 'É tradicionalmente associado a fluidez emocional, criatividade, prazer consciente e flexibilidade.',
    whenBlocked: 'Na tradição energética, pode ser associado a culpa, rigidez emocional, apego ou dificuldade de expressão criativa.',
    protocolAction: 'Purificação das Águas: prática simbólica de desapego e abertura para criatividade e movimento interior.',
    affirmation: 'Eu permito que a vida flua através de mim com criatividade e suavidade.'
  },
  {
    id: 'manipura', number: 3, sanskritName: 'Manipura', name: 'Chakra do Plexo Solar',
    color: '#b98a16', colorSoft: '#fff8d9', location: 'Região do plexo solar', element: 'Fogo', bijaMantra: 'RAM', solfeggioFreq: '528 Hz',
    symbolizes: 'Na tradição dos chakras, representa poder pessoal, decisão, autoconfiança e capacidade de agir.',
    inBalance: 'É tradicionalmente associado a determinação, autoestima, autonomia e limites conscientes.',
    whenBlocked: 'Na tradição energética, pode ser associado a baixa confiança, indecisão, raiva contida ou autocobrança.',
    protocolAction: 'Fogo da Transmutação: visualização de calor interior como símbolo de coragem, vitalidade e ação consciente.',
    affirmation: 'Eu honro meu poder pessoal com sabedoria e dignidade.'
  },
  {
    id: 'anahata', number: 4, sanskritName: 'Anahata', name: 'Chakra Cardíaco',
    color: '#3f8f64', colorSoft: '#e6f4ea', location: 'Centro do peito', element: 'Ar', bijaMantra: 'YAM', solfeggioFreq: '639 Hz',
    symbolizes: 'Na tradição dos chakras, representa amor, compaixão, perdão, acolhimento e conexão afetiva.',
    inBalance: 'É tradicionalmente associado a empatia, autoaceitação, generosidade e abertura emocional.',
    whenBlocked: 'Na tradição energética, pode ser associado a mágoa, rancor, dificuldade de receber afeto ou fechamento emocional.',
    protocolAction: 'Bálsamo do Amor: expansão simbólica de luz rosa e verde como convite a acolhimento, ternura e perdão.',
    affirmation: 'Eu me acolho com amor e abro espaço para relações mais conscientes.'
  },
  {
    id: 'vishuddha', number: 5, sanskritName: 'Vishuddha', name: 'Chakra Laríngeo',
    color: '#3c8ba4', colorSoft: '#e7f5f8', location: 'Garganta', element: 'Éter / Espaço', bijaMantra: 'HAM', solfeggioFreq: '741 Hz',
    symbolizes: 'Na tradição dos chakras, representa comunicação, autenticidade, escuta e expressão da verdade interior.',
    inBalance: 'É tradicionalmente associado a expressão clara, escuta presente e comunicação coerente com seus limites.',
    whenBlocked: 'Na tradição energética, pode ser associado a autocensura, medo de falar, dificuldade de escuta ou de dizer o que sente.',
    protocolAction: 'Decretos e mantras: uso consciente da palavra como instrumento de intenção, expressão e presença.',
    affirmation: 'Minha voz expressa minha verdade com respeito e clareza.'
  },
  {
    id: 'ajna', number: 6, sanskritName: 'Ajna', name: 'Chakra Frontal (Terceiro Olho)',
    color: '#5d60a8', colorSoft: '#ececf8', location: 'Entre as sobrancelhas', element: 'Luz', bijaMantra: 'OM', solfeggioFreq: '852 Hz',
    symbolizes: 'Na tradição dos chakras, representa intuição, discernimento, imaginação e clareza de percepção.',
    inBalance: 'É tradicionalmente associado a foco, discernimento, contemplação e confiança na própria percepção.',
    whenBlocked: 'Na tradição energética, pode ser associado a excesso de pensamentos, rigidez de percepção ou dificuldade de confiar na intuição.',
    protocolAction: 'Clareza Interior: pontos de luz dourada e azul simbolizam foco, organização e silêncio mental.',
    affirmation: 'Eu observo com clareza e confio no meu discernimento.'
  },
  {
    id: 'sahasrara', number: 7, sanskritName: 'Sahasrara', name: 'Chakra Coronário',
    color: '#8b62aa', colorSoft: '#f1e9f6', location: 'Topo da cabeça', element: 'Consciência', bijaMantra: 'AUM / Silêncio', solfeggioFreq: '963 Hz',
    symbolizes: 'Na tradição dos chakras, representa espiritualidade, contemplação, unidade e relação com o transcendente.',
    inBalance: 'É tradicionalmente associado a sentido, serenidade, conexão espiritual e visão mais ampla da própria caminhada.',
    whenBlocked: 'Na tradição energética, pode ser associado a sensação de desconexão, vazio de sentido ou rigidez espiritual.',
    protocolAction: 'Cascata de Luz Dourada: visualização simbólica de integração, gratidão e encerramento da jornada.',
    affirmation: 'Eu acolho a conexão espiritual com presença, liberdade e paz.'
  }
];

export function ChakrasGuideModal({ isOpen, onClose }: ChakrasGuideModalProps) {
  const [selectedChakraId, setSelectedChakraId] = useState('muladhara');
  if (!isOpen) return null;

  const current = CHAKRAS_DATA.find(chakra => chakra.id === selectedChakraId) || CHAKRAS_DATA[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto overscroll-contain"
      id="chakras-guide-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chakras-guide-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative my-1 sm:my-6 w-full max-w-4xl max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl border border-[#B88736]/30 bg-[#FBF8F2] p-4 sm:p-6 md:p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar guia dos chakras"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248] transition hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
        >
          <X size={18} />
        </button>

        <header className="mx-auto max-w-2xl space-y-2 pr-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B88736]/25 bg-[#B88736]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.18em] text-[#8F631E]">
            <Sparkles size={13} />
            Tradição energética dos 7 chakras
          </div>
          <h2 id="chakras-guide-title" className="font-display text-2xl font-semibold text-[#2A2420] md:text-3xl">Guia dos 7 Chakras</h2>
          <p className="text-xs leading-relaxed text-[#5C5248] md:text-sm">
            Referências simbólicas e tradicionais para estudo e reflexão. Não representam diagnóstico físico ou psicológico.
          </p>
        </header>

        <div className="mt-6 grid grid-cols-7 gap-2" role="tablist" aria-label="Selecionar chakra">
          {CHAKRAS_DATA.map(chakra => {
            const selected = chakra.id === current.id;
            return (
              <button
                key={chakra.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`${chakra.number}. ${chakra.name}`}
                onClick={() => setSelectedChakraId(chakra.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 ${selected ? 'shadow-sm' : 'bg-white/75 hover:bg-white'}`}
                style={{
                  borderColor: selected ? chakra.color : '#E5DAC6',
                  backgroundColor: selected ? chakra.colorSoft : undefined,
                  color: selected ? chakra.color : '#5C5248'
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: chakra.color }}>{chakra.number}</span>
                <span className="hidden sm:block">{chakra.sanskritName}</span>
              </button>
            );
          })}
        </div>

        <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#E5DAC6] bg-white/85 shadow-sm">
          <div className="p-5 sm:p-6" style={{ background: `linear-gradient(135deg, ${current.colorSoft}, rgba(255,255,255,.94))` }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[.18em]" style={{ color: current.color }}>{current.sanskritName}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-[#2A2420]">{current.name}</h3>
                <p className="mt-2 text-xs text-[#5C5248]">{current.location} • Elemento: {current.element}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:min-w-52">
                <div className="rounded-xl border border-white/80 bg-white/70 p-3 text-center">
                  <span className="block text-[9px] font-mono uppercase text-[#85786C]">Bija mantra</span>
                  <strong className="mt-1 block text-sm" style={{ color: current.color }}>{current.bijaMantra}</strong>
                </div>
                <div className="rounded-xl border border-white/80 bg-white/70 p-3 text-center">
                  <span className="block text-[9px] font-mono uppercase text-[#85786C]">Referência sonora</span>
                  <strong className="mt-1 block text-sm" style={{ color: current.color }}>{current.solfeggioFreq}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:p-6 md:grid-cols-2">
            <article className="rounded-2xl border border-[#E5DAC6] bg-[#FBF8F2] p-4">
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#8F631E]"><Sparkles size={13} />O que simboliza</span>
              <p className="mt-2 text-xs leading-relaxed text-[#5C5248]">{current.symbolizes}</p>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700"><CheckCircle2 size={13} />Quando percebido em equilíbrio</span>
              <p className="mt-2 text-xs leading-relaxed text-[#5C5248]">{current.inBalance}</p>
            </article>
            <article className="rounded-2xl border border-rose-200 bg-rose-50/65 p-4">
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.14em] text-rose-700"><Activity size={13} />Quando percebido em desequilíbrio</span>
              <p className="mt-2 text-xs leading-relaxed text-[#5C5248]">{current.whenBlocked}</p>
            </article>
            <article className="rounded-2xl border border-[#B88736]/25 bg-[#B88736]/7 p-4">
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#8F631E]"><Crown size={13} />Na jornada de 21 dias</span>
              <p className="mt-2 text-xs leading-relaxed text-[#5C5248]">{current.protocolAction}</p>
            </article>
          </div>

          <div className="mx-4 mb-4 rounded-2xl border border-[#B88736]/25 bg-[#F5EFE4] p-4 text-center sm:mx-6 sm:mb-6">
            <span className="block text-[10px] font-mono uppercase tracking-[.15em] text-[#8F631E]">Afirmação de presença</span>
            <p className="mt-2 font-display text-base italic leading-relaxed text-[#2A2420]">“{current.affirmation}”</p>
          </div>
        </section>

        <footer className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-[#E5DAC6] pt-4 sm:flex-row">
          <p className="max-w-xl text-center text-xs leading-relaxed text-[#5C5248] sm:text-left">
            As práticas energéticas são apresentadas como tradição espiritual e de autocuidado e não substituem cuidados médicos ou psicológicos.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 shrink-0 rounded-xl bg-[#B88736] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8F631E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
          >
            Fechar guia
          </button>
        </footer>
      </motion.div>
    </div>
  );
}

export default ChakrasGuideModal;
