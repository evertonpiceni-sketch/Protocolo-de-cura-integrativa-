/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Sparkles, AlertTriangle, ShieldCheck, Droplets, Flame,
  Heart, Sun, Moon, CheckCircle2, Copy, Share2, Search,
  Info, Leaf, Feather, Award, Compass
} from 'lucide-react';

export interface HerbalBath {
  id: string;
  name: string;
  popularName: string;
  category: 'Coronário & Paz Mental' | 'Limpeza & Descarrego' | 'Abertura & Prosperidade' | 'Amor & Harmonização' | 'Acalento & Sono';
  applicationRule: 'CABECALHO_E_CORPO' | 'DO_PESCOCO_PARA_BAIXO';
  purpose: string;
  herbs: string[];
  preparation: string;
  bestDayOrTime: string;
  associatedChakra: string;
  affirmation: string;
  color: string;
  badge: string;
}

export const SACRED_HERBAL_BATHS: HerbalBath[] = [
  {
    id: 'banho-boldo',
    name: 'Banho Sagrado de Boldo',
    popularName: 'Tapete de Oxalá / Erva de Jesus',
    category: 'Coronário & Paz Mental',
    applicationRule: 'CABECALHO_E_CORPO',
    purpose: 'Limpeza profunda dos pensamentos acelerados, alívio de peso na mente, insônia espiritual, desanuviamento da aura e restauração da paz divina interior.',
    herbs: ['7 a 9 folhas de Boldo fresco'],
    preparation: 'Em uma bacia ou jarro com 1,5L de água mineral ou morna, macere as folhas de boldo com as próprias mãos até a água ficar verdeada. Deixe descansar por 15 minutos. Após o seu banho de higiene normal, despeje este banho calmamente DA CABEÇA AOS PÉS, mentalizando muita paz, pureza e calma mental.',
    bestDayOrTime: 'Sexta-feira ou Domingo, preferencialmente antes de dormir',
    associatedChakra: 'Chakra Coronário (Topo da Cabeça)',
    affirmation: 'Minha mente está em profunda paz. Minha coroa se conecta à luz pura e divina.',
    color: 'from-amber-500/20 via-slate-900 to-indigo-950/40 border-amber-400/40 text-amber-300',
    badge: '⭐ ÚNICO PERMITIDO DA CABEÇA AOS PÉS'
  },
  {
    id: 'banho-alecrim',
    name: 'Banho Solar de Alecrim',
    popularName: 'Erva da Alegria, Coragem e Vitalidade',
    category: 'Abertura & Prosperidade',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Afasta o desânimo, a apatia e o cansaço crônico; atrai alegria de viver, clareza mental, coragem para novos projetos e prosperidade financeira.',
    herbs: ['2 ramos de Alecrim fresco ou 2 colheres de sopa de alecrim seco'],
    preparation: 'Ferva 1,5L de água, desligue o fogo e adicione o alecrim. Tampe e deixe abafado por 15 minutos. Coe e espere amornar. Após o banho higiênico, despeje ESTRITAMENTE DO PESCOÇO PARA BAIXO, visualizando uma luz dourada-amarelada recarregando sua vitalidade.',
    bestDayOrTime: 'Domingo de manhã ou Terça-feira durante o dia',
    associatedChakra: 'Chakra do Plexo Solar (Estômago/Digestivo)',
    affirmation: 'Sou luz, força e vitalidade. Meus caminhos se abrem para a alegria e prosperidade.',
    color: 'from-yellow-500/20 via-slate-900 to-amber-950/40 border-yellow-400/40 text-yellow-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-manjericao',
    name: 'Banho de Manjericão Harmonizador',
    popularName: 'Erva da Harmonia, Paz e Amor Puro',
    category: 'Amor & Harmonização',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Harmoniza relações familiares e amorosas, dissipa irritabilidade, alivia mágoas e equilibra as frequências do campo cardíaco.',
    herbs: ['1 punhado generoso de Manjericão fresco (folhas e galhos)'],
    preparation: 'Macere as folhas verdes de manjericão em 1,5L de água morna com as mãos, emanando pensamentos de reconciliação e ternura. Coe e jogue DO PESCOÇO PARA BAIXO após o banho comum, sentindo uma doce sensação de leveza no peito.',
    bestDayOrTime: 'Quarta-feira ou Sexta-feira ao entardecer',
    associatedChakra: 'Chakra Cardíaco (Centro do Peito)',
    affirmation: 'O amor divino flui em mim e através de mim. Eu vivo em paz e perfeita harmonia.',
    color: 'from-emerald-500/20 via-slate-900 to-teal-950/40 border-emerald-400/40 text-emerald-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-camomila',
    name: 'Banho Doce de Camomila & Melissa',
    popularName: 'Acalento Materno & Sono dos Anjos',
    category: 'Acalento & Sono',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Acalma crises agudas de ansiedade, alivia o estresse diário, ampara corações angustiados e promove sono profundo e restaurador.',
    herbs: ['3 colheres de flores de Camomila', '1 punhado de folhas de Melissa (Erva-Cidreira)'],
    preparation: 'Faça uma infusão das ervas em 1,5L de água fervente. Deixe abafar por 20 minutos e coe. Deixe amornar até uma temperatura agradável. Despeje DO PESCOÇO PARA BAIXO antes de deitar.',
    bestDayOrTime: 'À noite, 30 minutos antes de dormir',
    associatedChakra: 'Chakra Cardíaco e Chakra Sacral',
    affirmation: 'Eu descanso seguro(a) no colo do Universo. Todo medo se dissolve em paz.',
    color: 'from-amber-400/20 via-slate-900 to-orange-950/40 border-amber-300/40 text-amber-200',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-arruda-guine',
    name: 'Banho de Arruda & Guiné',
    popularName: 'Corte de Demandas & Blindagem Energética',
    category: 'Limpeza & Descarrego',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Descarrego de energias pesadas, corte de inveja, quebra de miasmas espirituais e afastamento de influências negativas acumuladas.',
    herbs: ['1 pequeno ramo de Arruda', '1 pequeno ramo de Guiné'],
    preparation: 'Macere suavemente as folhas em água morna ou faça infusão rápida. JAMAIS UTILIZE NA CABEÇA! Despeje ESTRITAMENTE DO PESCOÇO PARA BAIXO após o banho de higiene, com a intenção firme de deixar toda carga densa escorrer pelo ralo.',
    bestDayOrTime: 'Segunda-feira à noite ou Quinta-feira',
    associatedChakra: 'Chakra Básico (Raiz) e Chakra Esplênico',
    affirmation: 'Nenhuma energia densa permanece no meu campo. Sou blindado(a) na luz.',
    color: 'from-indigo-500/20 via-slate-900 to-purple-950/40 border-indigo-400/40 text-indigo-300',
    badge: '🚫 JAMAIS NA CABEÇA • DO PESCOÇO P/ BAIXO'
  },
  {
    id: 'banho-alfazema',
    name: 'Banho de Alfazema (Lavanda)',
    popularName: 'Equilíbrio Astral & Proteção Angélica',
    category: 'Amor & Harmonização',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Elevação da vibração, purificação suave da aura, reconexão com anjos de guarda e harmonização de ambientes e pensamentos.',
    herbs: ['2 colheres de flores de Alfazema / Lavanda ou folhas frescas'],
    preparation: 'Coloque as flores em infusão em 1,5L de água quente por 15 minutos. Coe e use morno. Despeje suavemente DO PESCOÇO PARA BAIXO, sentindo o perfume acalmar cada célula.',
    bestDayOrTime: 'Sexta-feira à noite ou Sábado',
    associatedChakra: 'Chakra Frontal (Terceiro Olho) e Cardíaco',
    affirmation: 'Meu campo energético irradia pureza, serenidade e acolhimento angelical.',
    color: 'from-purple-500/20 via-slate-900 to-indigo-950/40 border-purple-400/40 text-purple-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-louro-canela',
    name: 'Banho de Louro com Canela & Cravos',
    popularName: 'Magnetismo, Brilho Pessoal & Atração de Sucesso',
    category: 'Abertura & Prosperidade',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Atrai novas oportunidades de trabalho, sucesso em negócios, autoconfiança, magnetismo pessoal e prosperidade material.',
    herbs: ['7 folhas de Louro seco', '1 pau de Canela', '7 cravos-da-índia'],
    preparation: 'Ferva os ingredientes em 1,5L de água por 5 minutos para extrair os óleos essenciais. Desligue, deixe amornar e coe. Despeje DO PESCOÇO PARA BAIXO antes de compromissos importantes ou nas manhãs de lua crescente/cheia.',
    bestDayOrTime: 'Quinta-feira ou Domingo pela manhã',
    associatedChakra: 'Chakra do Plexo Solar e Chakra Básico',
    affirmation: 'Sou merecedor(a) da abundância infinita. O sucesso e as bênçãos chegam até mim.',
    color: 'from-amber-600/20 via-slate-900 to-yellow-950/40 border-amber-500/40 text-amber-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-rosa-branca',
    name: 'Banho de Pétalas de Rosa Branca',
    popularName: 'Conforto na Alma & Conexão Cósmica',
    category: 'Coronário & Paz Mental',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Cura de traumas profundos, suavização de angústias antigas, acolhimento espiritual e reconexão com mestres da luz.',
    herbs: ['Pétalas de 1 ou 2 Rosas Brancas frescas'],
    preparation: 'Despetale a rosa em água morna com muita delicadeza. Macere as pétalas suavemente para liberar a essência. Coe e despeje DO PESCOÇO PARA BAIXO em estado de recolhimento e oração.',
    bestDayOrTime: 'Sábado ou Domingo ao nascer do sol ou à noite',
    associatedChakra: 'Chakra Cardíaco e Coroa',
    affirmation: 'Minha alma é suave, pura e acolhida no amor infinito do Criador.',
    color: 'from-slate-200/20 via-slate-900 to-indigo-950/40 border-slate-300/40 text-slate-100',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-hortela',
    name: 'Banho Refrescante de Hortelã',
    popularName: 'Desbloqueio da Fala, Foco & Renascimento',
    category: 'Abertura & Prosperidade',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Desbloqueia a expressão verbal, alivia a sensação de cansaço mental e traz clareza para tomadas de decisão importantes.',
    herbs: ['1 punhado de folhas de Hortelã fresca'],
    preparation: 'Macere as folhas em água fresca ou morna. Despeje DO PESCOÇO PARA BAIXO pela manhã para começar o dia com vigor e mente desperta.',
    bestDayOrTime: 'Segunda-feira pela manhã para abrir a semana',
    associatedChakra: 'Chakra Laríngeo (Garganta)',
    affirmation: 'Comunico minha verdade com clareza, firmeza e amor. Minha mente é cristalina.',
    color: 'from-teal-500/20 via-slate-900 to-emerald-950/40 border-teal-400/40 text-teal-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-7-ervas-sagrado',
    name: 'Banho Sagrado das 7 Ervas de Purificação Total',
    popularName: 'Descarrego Mestre dos 7 Centros Energéticos',
    category: 'Limpeza & Descarrego',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Limpeza profunda e desobstrução de miasmas kármicos acumulados, corte de olho gordo e restauração do equilíbrio vibracional.',
    herbs: ['Arruda', 'Guiné', 'Alecrim', 'Espada de São Jorge (cortada em 7 pedaços)', 'Manjericão', 'Alfazema', 'Eucalipto'],
    preparation: 'Coloque as 7 ervas em infusão em 2 litros de água fervente por 20 minutos com a panela tampada. Coe e deixe amornar. JAMAIS JOGUE NA CABEÇA! Após seu banho higiênico, despeje ESTRITAMENTE DO PESCOÇO PARA BAIXO, mentalizando que toda densidade e nó energético é desatado e escorre pelo ralo.',
    bestDayOrTime: 'Segunda-feira ou Sexta-feira ao entardecer',
    associatedChakra: 'Alinhamento dos 7 Chakras',
    affirmation: 'Sete forças de luz limpam, purificam e blindam todo o meu ser. Estou renovado(a).',
    color: 'from-emerald-600/20 via-slate-900 to-indigo-950/40 border-emerald-500/40 text-emerald-300',
    badge: '🚫 JAMAIS NA CABEÇA • DO PESCOÇO P/ BAIXO'
  },
  {
    id: 'banho-anis-canela',
    name: 'Banho de Anis-Estrelado com Canela & Mel',
    popularName: 'Despertar da Intuição Cósmica & Magnetismo Dourado',
    category: 'Abertura & Prosperidade',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Ativação do poder intuitivo, clareza em sonhos, magnetismo pessoal para atração de novas parcerias e expansão da prosperidade financeira.',
    herbs: ['7 estrelas de Anis-Estrelado', '1 canela em pau', '1 colher de chá de mel puro ou pétalas amarelas'],
    preparation: 'Ferva o anis-estrelado e a canela por 5 minutos em 1,5L de água. Desligue, acrescente o mel, mexa em sentido horário emanando gratidão. Coe após amornar. Despeje DO PESCOÇO PARA BAIXO.',
    bestDayOrTime: 'Quinta-feira ou Domingo em fase de Lua Nova ou Crescente',
    associatedChakra: 'Chakra Frontal e Chakra do Plexo Solar',
    affirmation: 'Minha intuição é um farol divino. Eu atraio abundância, brilho e vitórias.',
    color: 'from-amber-500/20 via-slate-900 to-yellow-950/40 border-amber-400/40 text-amber-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-eucalipto-salvia',
    name: 'Banho de Eucalipto & Sálvia Branca',
    popularName: 'Desanuviamento Áurico & Renascimento Respiratório',
    category: 'Limpeza & Descarrego',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Desintoxicação energética de ambientes carregados, eliminação da sensação de cansaço nos ombros e renovação do ar e da aura.',
    herbs: ['5 a 7 folhas de Eucalipto fresco', '1 punhado de folhas de Sálvia'],
    preparation: 'Faça uma infusão das folhas em água bem quente e deixe abafar até ficar morno. Coe e despeje DO PESCOÇO PARA BAIXO, respirando profundamente o aroma medicinal.',
    bestDayOrTime: 'Terça-feira ou Quarta-feira',
    associatedChakra: 'Chakra Laríngeo e Cardíaco',
    affirmation: 'Respiro a pureza divina. Toda sobrecarga se dissolve em ar puro e renovação.',
    color: 'from-teal-600/20 via-slate-900 to-slate-950 border-teal-500/40 text-teal-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-rosas-hibisco',
    name: 'Banho de Rosas Vermelhas com Flor de Hibisco',
    popularName: 'Autoestima Radiante, Poder Pessoal & Amor-Próprio',
    category: 'Amor & Harmonização',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Cura de sentimentos de rejeição ou baixa autoestima, resgate do poder de sedução saudável, entusiasmo e paixão pela vida.',
    herbs: ['Pétalas de 2 Rosas Vermelhas frescas', '2 colheres de flores secas de Hibisco'],
    preparation: 'Ferva 1,5L de água, desligue o fogo e adicione as pétalas de rosa e o hibisco. Tampe por 15 minutos até a água ganhar tom avermelhado. Coe, espere amornar e despeje DO PESCOÇO PARA BAIXO.',
    bestDayOrTime: 'Sexta-feira (Dia de Vênus / Afrodite)',
    associatedChakra: 'Chakra Sacral (Umbilical) e Cardíaco',
    affirmation: 'Eu me amo, me honro e me respeito. Minha presença é magnética, bela e cheia de vida.',
    color: 'from-rose-600/20 via-slate-900 to-pink-950/40 border-rose-500/40 text-rose-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-capim-santo-louro',
    name: 'Banho de Capim-Santo (Cidreira) com Louro',
    popularName: 'Tranquilidade Mental & Vitória Conquistada',
    category: 'Acalento & Sono',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Cessa o turbilhão de pensamentos repetitivos, traz calma imediata e atrai sensação de alívio e triunfo sobre dificuldades.',
    herbs: ['1 punhado de folhas de Capim-Santo frescas ou secas', '5 folhas de Louro'],
    preparation: 'Ferva a água com o louro por 3 minutos, desligue o fogo e adicione o capim-santo. Deixe abafado por 15 minutos. Coe e despeje DO PESCOÇO PARA BAIXO à noite.',
    bestDayOrTime: 'Domingo à noite ou Quinta-feira',
    associatedChakra: 'Chakra Plexo Solar e Cardíaco',
    affirmation: 'Minha mente repousa em serenidade. Confio no triunfo da minha caminhada.',
    color: 'from-lime-500/20 via-slate-900 to-emerald-950/40 border-lime-400/40 text-lime-300',
    badge: '🌿 DO PESCOÇO PARA BAIXO'
  }
];

interface HerbalBathsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export default function HerbalBathsModal({ isOpen, onClose, userName }: HerbalBathsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeBathId, setActiveBathId] = useState<string>('banho-boldo');

  if (!isOpen) return null;

  const categories = ['Todos', 'Coronário & Paz Mental', 'Limpeza & Descarrego', 'Abertura & Prosperidade', 'Amor & Harmonização', 'Acalento & Sono'];

  const filteredBaths = SACRED_HERBAL_BATHS.filter(bath => {
    const matchesCategory = selectedCategory === 'Todos' || bath.category === selectedCategory;
    const matchesSearch = bath.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bath.popularName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bath.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bath.herbs.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeBath = SACRED_HERBAL_BATHS.find(b => b.id === activeBathId) || SACRED_HERBAL_BATHS[0];

  const handleCopyRecipe = (bath: HerbalBath) => {
    const text = `🌿 GUIA DE BANHO SAGRADO: ${bath.name.toUpperCase()} (${bath.popularName})
📍 Regra de Aplicação: ${bath.applicationRule === 'CABECALHO_E_CORPO' ? '✨ DA CABEÇA AOS PÉS (Exceção Sagrada)' : '⚠️ ESTRITAMENTE DO PESCOÇO PARA BAIXO (Nunca na cabeça)'}
🎯 Para que serve: ${bath.purpose}
🍃 Ingredientes: ${bath.herbs.join(', ')}
🥣 Modo de Preparo: ${bath.preparation}
⏰ Melhor Momento: ${bath.bestDayOrTime}
💎 Afirmação de Poder: "${bath.affirmation}"
✨ Protocolo de Cura Integrada — Éverton Piceni`;

    navigator.clipboard.writeText(text);
    setCopiedId(bath.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleShareWhatsApp = (bath: HerbalBath) => {
    const text = encodeURIComponent(`🌿 *Banho Sagrado: ${bath.name}* (${bath.popularName})
*Regra:* ${bath.applicationRule === 'CABECALHO_E_CORPO' ? '✨ *DA CABEÇA AOS PÉS*' : '⚠️ *DO PESCOÇO PARA BAIXO*'}
*Para que serve:* ${bath.purpose}
*Preparo:* ${bath.preparation}
*Afirmação:* "${bath.affirmation}"
_Protocolo de Cura Integrada_`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in" id="herbal-baths-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative my-auto"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/30">
              <Leaf size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Sabedoria Ancestral & Fitoterapia Sagrada
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-slate-100 mt-0.5">
                Guia Sagrado de Banhos de Ervas & Limpeza Energética
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
            id="btn-close-herbal-baths"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

          {/* CRITICAL SACRED WARNING BANNER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border-2 border-amber-500/50 shadow-xl space-y-2.5 relative overflow-hidden" id="sacred-bath-golden-rule">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
                  <span>REGRA DE OURO DOS BANHOS ENERGÉTICOS</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  <strong className="text-amber-300">NENHUM BANHO DE ERVAS DEVE SER TOMADO DA CABEÇA AOS PÉS, A NÃO SER O BANHO DE BOLDO.</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-1">
                    <span className="text-amber-300 font-bold flex items-center gap-1.5 font-mono text-[11px]">
                      <Sparkles size={13} className="text-amber-400" />
                      BANHO DE BOLDO (Exceção Única)
                    </span>
                    <p className="text-slate-300 leading-snug text-[11px]">
                      É a <strong>única erva permitida da cabeça aos pés</strong> (no Chakra Coronário). Ele acalma os pensamentos, limpa miasmas mentais e reconecta com a paz de Oxalá / Jesus sem agredir seu portal superior.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-1">
                    <span className="text-indigo-300 font-bold flex items-center gap-1.5 font-mono text-[11px]">
                      <ShieldCheck size={13} className="text-indigo-400" />
                      TODOS OS DEMAIS BANHOS
                    </span>
                    <p className="text-slate-300 leading-snug text-[11px]">
                      Alecrim, Arruda, Manjericão, Camomila, Alfazema, Louro, etc. devem ser tomados <strong>SEMPRE DO PESCOÇO / OMBROS PARA BAIXO</strong> para não desalinhar a frequência do Chakra Coronário.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-amber-300/80 flex items-center gap-1.5">
                  <Info size={13} className="shrink-0 text-amber-400" />
                  <span>
                    <strong>Sobre o Sal Grosso:</strong> Não recomendamos o uso de sal grosso no protocolo diário, pois ele remove todas as energias (inclusive as boas) e resseca a aura. Prefira sempre as ervas sagradas que limpam e restauram a luz divina.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar erva, finalidade (ex: boldo, sono, prosperidade, descarrego)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm shadow-emerald-600/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Baths List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBaths.map(bath => {
              const isBoldo = bath.id === 'banho-boldo';
              const isCopied = copiedId === bath.id;

              return (
                <div
                  key={bath.id}
                  className={`p-4 sm:p-5 rounded-2xl border bg-gradient-to-br transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg ${
                    isBoldo
                      ? 'from-amber-950/30 via-slate-900 to-indigo-950/40 border-amber-500/50 ring-1 ring-amber-500/20'
                      : 'from-slate-950/80 via-slate-900 to-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isBoldo 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {bath.badge}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {bath.category}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                        {bath.name}
                        {isBoldo && <Sparkles size={16} className="text-amber-400" />}
                      </h3>
                      <p className="text-xs text-amber-300/90 font-mono font-medium">
                        {bath.popularName}
                      </p>
                    </div>

                    {/* Purpose */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block flex items-center gap-1">
                        <Heart size={11} />
                        Para que serve:
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {bath.purpose}
                      </p>
                    </div>

                    {/* Herbs & Application Rule */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start gap-1.5 text-slate-300">
                        <strong className="text-slate-400 font-mono text-[11px] shrink-0">🍃 Ervas:</strong>
                        <span>{bath.herbs.join(', ')}</span>
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-300">
                        <strong className="text-slate-400 font-mono text-[11px] shrink-0">📍 Aplicação:</strong>
                        <span className={isBoldo ? 'text-amber-300 font-bold' : 'text-indigo-300 font-semibold'}>
                          {isBoldo ? '✨ Da cabeça aos pés' : '🌿 Estritamente do pescoço para baixo'}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-300">
                        <strong className="text-slate-400 font-mono text-[11px] shrink-0">⏰ Momento:</strong>
                        <span className="text-slate-400">{bath.bestDayOrTime}</span>
                      </div>
                    </div>

                    {/* Preparation */}
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850/80 space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                        🥣 Modo de Preparo & Intenção:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {bath.preparation}
                      </p>
                    </div>

                    {/* Affirmation */}
                    <div className="p-2.5 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-xs">
                      <span className="text-[9px] font-mono uppercase text-amber-400 font-bold block">
                        💎 Afirmação Durante o Banho:
                      </span>
                      <p className="text-amber-200/90 italic text-[11px] font-serif mt-0.5">
                        "{bath.affirmation}"
                      </p>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => handleCopyRecipe(bath)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-400" />
                          <span className="text-emerald-300">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copiar Receita</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(bath)}
                      className="py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      title="Compartilhar no WhatsApp"
                    >
                      <Share2 size={13} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick FAQ / Harmonização */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
            <h4 className="text-slate-200 font-bold flex items-center gap-1.5 font-mono text-xs">
              <Info size={14} className="text-indigo-400" />
              Dúvidas Frequentes sobre os Banhos de Ervas:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed text-[11px]">
              <li><strong>Posso tomar mais de um banho por semana?</strong> Sim, recomendamos intercalar banhos de limpeza suave (boldo, manjericão) com banhos de elevação (alecrim, camomila) com intervalo de 2 a 3 dias.</li>
              <li><strong>O que fazer com as folhas coadas?</strong> Devolva à natureza (em um jardim, vaso ou pé de árvore) agradecendo pelo elemento vegetal. Evite jogar no lixo comum quando possível.</li>
              <li><strong>Sempre tomar o banho higiênico antes?</strong> Sim! Primeiro limpe o corpo físico com sabonete e água corrente. Depois, desligue o chuveiro e despeje o banho de ervas com tranquilidade e presença.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-400 font-mono text-center sm:text-left">
            ✨ Protocolo de Cura Integrada • Fitoterapia Energética por Éverton Piceni
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer transition"
          >
            Entendido, Fechar Guia
          </button>
        </div>
      </motion.div>
    </div>
  );
}
