/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X, Sparkles, AlertTriangle, ShieldCheck,
  Heart, CheckCircle2, Copy, Share2, Search,
  Info, Leaf
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
    purpose: 'Na tradição deste acervo, é associado a limpeza simbólica dos pensamentos, serenidade, recolhimento e conexão com a paz de Oxalá / Jesus.',
    herbs: ['7 a 9 folhas de Boldo fresco'],
    preparation: 'Em uma bacia ou jarro com 1,5L de água morna, macere as folhas com as mãos e deixe descansar por 15 minutos. Após o banho de higiene, a tradição deste acervo permite aplicação da cabeça aos pés. Evite olhos, rosto, mucosas e pele lesionada; interrompa se houver irritação.',
    bestDayOrTime: 'Sexta-feira ou Domingo, preferencialmente antes de dormir',
    associatedChakra: 'Chakra Coronário (Topo da Cabeça)',
    affirmation: 'Minha mente encontra espaço para paz. Minha coroa se conecta simbolicamente à luz divina.',
    color: 'from-amber-500/20 via-[#FBF8F2] to-[#F5EFE4] border-amber-400/40 text-amber-800',
    badge: 'EXCEÇÃO DA TRADIÇÃO DESTE ACERVO'
  },
  {
    id: 'banho-alecrim',
    name: 'Banho Solar de Alecrim',
    popularName: 'Erva da Alegria, Coragem e Vitalidade',
    category: 'Abertura & Prosperidade',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição energética, é associado a disposição, clareza, coragem, intenção de novos projetos e prosperidade.',
    herbs: ['2 ramos de Alecrim fresco ou 2 colheres de sopa de alecrim seco'],
    preparation: 'Ferva 1,5L de água, desligue o fogo e adicione o alecrim. Tampe por 15 minutos, coe e espere amornar. Após o banho higiênico, aplique do pescoço para baixo, visualizando uma luz dourada ligada à vitalidade.',
    bestDayOrTime: 'Domingo de manhã ou Terça-feira durante o dia',
    associatedChakra: 'Chakra do Plexo Solar',
    affirmation: 'Sou luz, força e vitalidade. Caminho com coragem e abertura para novas possibilidades.',
    color: 'from-yellow-500/20 via-[#FBF8F2] to-amber-50 border-yellow-400/40 text-yellow-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-manjericao',
    name: 'Banho de Manjericão Harmonizador',
    popularName: 'Erva da Harmonia, Paz e Amor Puro',
    category: 'Amor & Harmonização',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição energética, é associado a reconciliação, ternura, leveza emocional e intenção de harmonia nos vínculos.',
    herbs: ['1 punhado generoso de Manjericão fresco (folhas e galhos)'],
    preparation: 'Macere as folhas em 1,5L de água morna, cultivando pensamentos de reconciliação e ternura. Coe e aplique do pescoço para baixo após o banho comum.',
    bestDayOrTime: 'Quarta-feira ou Sexta-feira ao entardecer',
    associatedChakra: 'Chakra Cardíaco (Centro do Peito)',
    affirmation: 'O amor divino flui em mim e através de mim. Eu cultivo paz e harmonia.',
    color: 'from-emerald-500/20 via-[#FBF8F2] to-emerald-50 border-emerald-400/40 text-emerald-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-camomila',
    name: 'Banho Doce de Camomila & Melissa',
    popularName: 'Acalento Materno & Preparação para o Descanso',
    category: 'Acalento & Sono',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição do acervo, é usado como ritual de desaceleração, acolhimento e preparação para um momento de repouso.',
    herbs: ['3 colheres de flores de Camomila', '1 punhado de folhas de Melissa (Erva-Cidreira)'],
    preparation: 'Faça uma infusão das ervas em 1,5L de água quente. Deixe abafar por 20 minutos, coe e aguarde até ficar em temperatura confortável. Aplique do pescoço para baixo antes de deitar.',
    bestDayOrTime: 'À noite, como ritual de preparação para o descanso',
    associatedChakra: 'Chakra Cardíaco e Chakra Sacral',
    affirmation: 'Eu me permito repousar em segurança e acolhimento. Respiro e abro espaço para a paz.',
    color: 'from-amber-400/20 via-[#FBF8F2] to-orange-50 border-amber-300/40 text-amber-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-arruda-guine',
    name: 'Banho de Arruda & Guiné',
    popularName: 'Corte de Demandas & Proteção Energética',
    category: 'Limpeza & Descarrego',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na linguagem tradicional do ritual, é associado a descarrego, proteção, corte simbólico de influências percebidas como pesadas e fortalecimento de limites.',
    herbs: ['1 pequeno ramo de Arruda', '1 pequeno ramo de Guiné'],
    preparation: 'Macere suavemente as folhas em água morna ou faça infusão breve. Uso externo e somente do pescoço para baixo. Evite rosto, mucosas, pele lesionada e interrompa se houver ardor ou irritação.',
    bestDayOrTime: 'Segunda-feira à noite ou Quinta-feira',
    associatedChakra: 'Chakra Básico (Raiz) e Chakra Esplênico',
    affirmation: 'Cultivo limites firmes e imagino meu campo protegido pela luz.',
    color: 'from-[#B88736]/10 via-[#FBF8F2] to-[#F5EFE4] border-[#B88736]/30 text-[#8F631E]',
    badge: 'USO EXTERNO • DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-alfazema',
    name: 'Banho de Alfazema (Lavanda)',
    popularName: 'Equilíbrio Astral & Proteção Angélica',
    category: 'Amor & Harmonização',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição energética, é associado a serenidade, purificação simbólica da aura, oração e harmonização do ambiente interno.',
    herbs: ['2 colheres de flores de Alfazema / Lavanda ou folhas frescas'],
    preparation: 'Coloque as flores em infusão em 1,5L de água quente por 15 minutos. Coe, deixe amornar e aplique do pescoço para baixo, usando o aroma como elemento contemplativo.',
    bestDayOrTime: 'Sexta-feira à noite ou Sábado',
    associatedChakra: 'Chakra Frontal e Cardíaco',
    affirmation: 'Meu campo simbólico irradia serenidade, acolhimento e presença.',
    color: 'from-[#B88736]/10 via-[#FBF8F2] to-[#F5EFE4] border-[#B88736]/30 text-[#8F631E]',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-louro-canela',
    name: 'Banho de Louro com Canela & Cravos',
    popularName: 'Magnetismo, Brilho Pessoal & Intenção de Prosperidade',
    category: 'Abertura & Prosperidade',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição, é associado a intenção de prosperidade, confiança, presença e abertura para oportunidades.',
    herbs: ['7 folhas de Louro seco', '1 pau de Canela', '7 cravos-da-índia'],
    preparation: 'Ferva os ingredientes em 1,5L de água por 5 minutos. Desligue, deixe amornar e coe. Aplique do pescoço para baixo. Canela e cravo podem sensibilizar algumas peles; interrompa se houver desconforto.',
    bestDayOrTime: 'Quinta-feira ou Domingo pela manhã',
    associatedChakra: 'Chakra do Plexo Solar e Chakra Básico',
    affirmation: 'Eu reconheço meu merecimento e caminho com presença diante das oportunidades.',
    color: 'from-amber-600/20 via-[#FBF8F2] to-yellow-50 border-amber-500/40 text-amber-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-rosa-branca',
    name: 'Banho de Pétalas de Rosa Branca',
    popularName: 'Conforto na Alma & Conexão Cósmica',
    category: 'Coronário & Paz Mental',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição espiritual, é associado a acolhimento, suavidade, oração e contemplação de experiências emocionais antigas.',
    herbs: ['Pétalas de 1 ou 2 Rosas Brancas frescas'],
    preparation: 'Despetale a rosa em água morna com delicadeza. Macere suavemente, coe e aplique do pescoço para baixo em estado de recolhimento e oração.',
    bestDayOrTime: 'Sábado ou Domingo ao nascer do sol ou à noite',
    associatedChakra: 'Chakra Cardíaco e Coroa',
    affirmation: 'Minha alma encontra suavidade e acolhimento no amor do Criador.',
    color: 'from-slate-100 via-[#FBF8F2] to-[#F5EFE4] border-slate-300/40 text-[#2A2420]',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-hortela',
    name: 'Banho Refrescante de Hortelã',
    popularName: 'Expressão, Foco & Renovação',
    category: 'Abertura & Prosperidade',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição do acervo, é associado a clareza, intenção de expressão, frescor e disposição para escolhas conscientes.',
    herbs: ['1 punhado de folhas de Hortelã fresca'],
    preparation: 'Macere as folhas em água fresca ou morna. Aplique do pescoço para baixo pela manhã, com intenção de presença e clareza.',
    bestDayOrTime: 'Segunda-feira pela manhã para abrir a semana',
    associatedChakra: 'Chakra Laríngeo (Garganta)',
    affirmation: 'Comunico minha verdade com clareza, firmeza e amor.',
    color: 'from-teal-500/15 via-[#FBF8F2] to-emerald-50 border-teal-400/30 text-teal-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-7-ervas-sagrado',
    name: 'Banho Sagrado das 7 Ervas',
    popularName: 'Ritual Tradicional dos 7 Centros Energéticos',
    category: 'Limpeza & Descarrego',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição energética do acervo, representa uma prática intensa de descarrego simbólico, proteção e intenção de reequilíbrio.',
    herbs: ['Arruda', 'Guiné', 'Alecrim', 'Espada de São Jorge (cortada em 7 pedaços)', 'Manjericão', 'Alfazema', 'Eucalipto'],
    preparation: 'Faça a infusão das ervas em 2 litros de água quente, deixe abafado, coe e aguarde amornar. Uso externo, do pescoço para baixo. Esta combinação inclui plantas potencialmente irritantes; evite pele lesionada, olhos e mucosas e interrompa diante de qualquer reação.',
    bestDayOrTime: 'Segunda-feira ou Sexta-feira ao entardecer',
    associatedChakra: 'Referência simbólica aos 7 Chakras',
    affirmation: 'Imagino sete forças de luz envolvendo meu ser em proteção e renovação.',
    color: 'from-emerald-600/15 via-[#FBF8F2] to-[#F5EFE4] border-emerald-500/30 text-emerald-800',
    badge: 'USO EXTERNO • DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-anis-canela',
    name: 'Banho de Anis-Estrelado com Canela & Mel',
    popularName: 'Intuição & Magnetismo Dourado',
    category: 'Abertura & Prosperidade',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição, é associado a contemplação da intuição, magnetismo pessoal e intenção de prosperidade.',
    herbs: ['7 estrelas de Anis-Estrelado', '1 canela em pau', '1 colher de chá de mel puro ou pétalas amarelas'],
    preparation: 'Ferva o anis-estrelado e a canela por 5 minutos em 1,5L de água. Desligue, acrescente o mel, misture e aguarde amornar. Coe e aplique do pescoço para baixo. Interrompa se houver irritação.',
    bestDayOrTime: 'Quinta-feira ou Domingo em fase de Lua Nova ou Crescente',
    associatedChakra: 'Chakra Frontal e Chakra do Plexo Solar',
    affirmation: 'Minha intuição é um farol simbólico. Caminho com abertura e gratidão.',
    color: 'from-amber-500/20 via-[#FBF8F2] to-yellow-50 border-amber-400/40 text-amber-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-eucalipto-salvia',
    name: 'Banho de Eucalipto & Sálvia',
    popularName: 'Renovação Áurica & Frescor',
    category: 'Limpeza & Descarrego',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição energética, é associado a sensação simbólica de renovação, descarrego e abertura para uma atmosfera mais leve.',
    herbs: ['5 a 7 folhas de Eucalipto fresco', '1 punhado de folhas de Sálvia'],
    preparation: 'Faça uma infusão das folhas em água quente e deixe abafar até ficar morna. Coe e aplique do pescoço para baixo. Use apenas externamente e evite contato com olhos e mucosas.',
    bestDayOrTime: 'Terça-feira ou Quarta-feira',
    associatedChakra: 'Chakra Laríngeo e Cardíaco',
    affirmation: 'Respiro com presença e imagino meu campo se tornando mais leve e renovado.',
    color: 'from-teal-600/15 via-[#FBF8F2] to-[#F5EFE4] border-teal-500/30 text-teal-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-rosas-hibisco',
    name: 'Banho de Rosas Vermelhas com Flor de Hibisco',
    popularName: 'Autoestima, Presença & Amor-Próprio',
    category: 'Amor & Harmonização',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição simbólica, é associado a amor-próprio, presença, confiança e acolhimento de sentimentos de rejeição.',
    herbs: ['Pétalas de 2 Rosas Vermelhas frescas', '2 colheres de flores secas de Hibisco'],
    preparation: 'Ferva 1,5L de água, desligue e adicione as pétalas e o hibisco. Tampe por 15 minutos, coe, deixe amornar e aplique do pescoço para baixo.',
    bestDayOrTime: 'Sexta-feira (associação tradicional a Vênus / Afrodite)',
    associatedChakra: 'Chakra Sacral e Cardíaco',
    affirmation: 'Eu me amo, me honro e me respeito. Minha presença tem valor.',
    color: 'from-rose-500/15 via-[#FBF8F2] to-pink-50 border-rose-400/30 text-rose-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  },
  {
    id: 'banho-capim-santo-louro',
    name: 'Banho de Capim-Santo (Cidreira) com Louro',
    popularName: 'Tranquilidade & Intenção de Vitória',
    category: 'Acalento & Sono',
    applicationRule: 'DO_PESCOCO_PARA_BAIXO',
    purpose: 'Na tradição, é associado a desaceleração, serenidade e intenção de confiança diante das dificuldades.',
    herbs: ['1 punhado de folhas de Capim-Santo frescas ou secas', '5 folhas de Louro'],
    preparation: 'Ferva a água com o louro por 3 minutos, desligue e adicione o capim-santo. Deixe abafado por 15 minutos, coe, espere amornar e aplique do pescoço para baixo.',
    bestDayOrTime: 'Domingo à noite ou Quinta-feira',
    associatedChakra: 'Chakra Plexo Solar e Cardíaco',
    affirmation: 'Minha mente encontra serenidade. Confio no meu caminho.',
    color: 'from-lime-500/15 via-[#FBF8F2] to-emerald-50 border-lime-400/30 text-lime-800',
    badge: 'DO PESCOÇO PARA BAIXO'
  }
];

interface HerbalBathsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export default function HerbalBathsModal({ isOpen, onClose }: HerbalBathsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState('');

  if (!isOpen) return null;

  const categories = ['Todos', 'Coronário & Paz Mental', 'Limpeza & Descarrego', 'Abertura & Prosperidade', 'Amor & Harmonização', 'Acalento & Sono'];
  const query = searchTerm.trim().toLowerCase();
  const filteredBaths = SACRED_HERBAL_BATHS.filter(bath => {
    const matchesCategory = selectedCategory === 'Todos' || bath.category === selectedCategory;
    const matchesSearch = !query || bath.name.toLowerCase().includes(query) || bath.popularName.toLowerCase().includes(query) || bath.purpose.toLowerCase().includes(query) || bath.herbs.some(herb => herb.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const safetyNote = 'Uso externo e ritual. Algumas plantas podem irritar ou sensibilizar a pele. Evite olhos, mucosas e pele lesionada. Não ingerir. Em caso de alergia conhecida, gestação, amamentação, uso em crianças ou condição de pele, procure orientação profissional antes de usar. Interrompa diante de qualquer reação.';

  const handleCopyRecipe = async (bath: HerbalBath) => {
    const text = `GUIA DE BANHO: ${bath.name.toUpperCase()} (${bath.popularName})\nRegra de aplicação: ${bath.applicationRule === 'CABECALHO_E_CORPO' ? 'CABEÇA AOS PÉS — exceção da tradição deste acervo; evite rosto, olhos e mucosas' : 'DO PESCOÇO PARA BAIXO'}\nUso tradicional/simbólico: ${bath.purpose}\nIngredientes: ${bath.herbs.join(', ')}\nModo de preparo: ${bath.preparation}\nMomento sugerido na tradição: ${bath.bestDayOrTime}\nAfirmação: "${bath.affirmation}"\nSegurança: ${safetyNote}\nProtocolo da Transformação — Éverton Piceni`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyError('');
      setCopiedId(bath.id);
      setTimeout(() => setCopiedId(null), 3000);
    } catch {
      setCopyError('Não foi possível copiar automaticamente. Selecione o texto manualmente ou use o compartilhamento.');
    }
  };

  const handleShareWhatsApp = (bath: HerbalBath) => {
    const text = encodeURIComponent(`*Banho: ${bath.name}* (${bath.popularName})\n*Aplicação:* ${bath.applicationRule === 'CABECALHO_E_CORPO' ? 'cabeça aos pés conforme a tradição deste acervo; evitar olhos e mucosas' : 'do pescoço para baixo'}\n*Uso tradicional/simbólico:* ${bath.purpose}\n*Preparo:* ${bath.preparation}\n*Afirmação:* "${bath.affirmation}"\n*Segurança:* ${safetyNote}\n_Protocolo da Transformação_`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto overscroll-contain" id="herbal-baths-modal" role="dialog" aria-modal="true" aria-label="Guia de banhos de ervas">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="bg-[#FBF8F2] border border-[#E5DAC6] rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[calc(100dvh-1rem)] sm:max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl relative my-auto">
        <div className="p-5 sm:p-6 border-b border-[#E5DAC6] bg-gradient-to-r from-emerald-50 via-[#FBF8F2] to-[#F5EFE4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5 min-w-0"><div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0"><Leaf size={22} /></div><div className="min-w-0"><span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Sabedoria Tradicional & Ervas</span><h2 className="text-lg sm:text-xl font-display font-bold text-[#2A2420] mt-0.5">Guia de Banhos de Ervas & Práticas Energéticas</h2></div></div>
          <button type="button" onClick={onClose} aria-label="Fechar guia de banhos" className="w-11 h-11 rounded-xl bg-[#F5EFE4] hover:bg-[#EFE4D3] text-[#5C5248] hover:text-[#2A2420] border border-[#E5DAC6] transition cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"><X size={18} /></button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-5 flex-1 custom-scrollbar">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3" role="note" aria-label="Cuidados de segurança">
            <div className="flex items-start gap-3"><AlertTriangle size={20} className="text-amber-800 shrink-0 mt-0.5" /><div><h3 className="text-sm font-bold text-amber-900">Tradição e segurança precisam caminhar juntas</h3><p className="mt-1 text-xs leading-relaxed text-[#5C5248]">{safetyNote}</p></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-amber-200"><span className="font-bold text-amber-900 flex items-center gap-1.5"><Sparkles size={13} /> Boldo no acervo</span><p className="mt-1 text-[#5C5248]">A tradição registrada neste acervo trata o boldo como exceção para aplicação também no topo da cabeça. Isso é uma referência ritual, não uma declaração universal de segurança.</p></div>
              <div className="p-3 rounded-xl bg-white border border-[#E5DAC6]"><span className="font-bold text-[#8F631E] flex items-center gap-1.5"><ShieldCheck size={13} /> Demais preparos</span><p className="mt-1 text-[#5C5248]">Neste guia, os demais banhos são apresentados para uso externo do pescoço para baixo, sempre respeitando sensibilidade individual.</p></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85786C]" /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} aria-label="Buscar banho por erva ou finalidade tradicional" placeholder="Buscar erva, intenção ou tema..." className="w-full bg-white border border-[#E5DAC6] rounded-xl pl-9 pr-4 py-3 text-xs text-[#2A2420] placeholder:text-[#85786C] focus:outline-none focus:border-[#B88736]" /></div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Filtrar banhos por categoria">{categories.map(category => <button key={category} type="button" aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)} className={`min-h-11 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 ${selectedCategory === category ? 'bg-[#073b2b] border-[#073b2b] text-white' : 'bg-white border-[#E5DAC6] text-[#5C5248] hover:border-[#B88736]/40'}`}>{category}</button>)}</div>
          </div>

          {copyError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{copyError}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBaths.map(bath => {
              const isBoldo = bath.id === 'banho-boldo';
              const isCopied = copiedId === bath.id;
              return (
                <article key={bath.id} className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-sm ${isBoldo ? 'bg-amber-50 border-amber-300' : 'bg-white border-[#E5DAC6]'}`}>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2"><span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isBoldo ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-[#B88736]/10 text-[#8F631E] border-[#B88736]/25'}`}>{bath.badge}</span><span className="text-[11px] text-[#5C5248] font-mono">{bath.category}</span></div>
                    <div><h3 className="text-base sm:text-lg font-bold text-[#2A2420] flex items-center gap-2">{bath.name}{isBoldo && <Sparkles size={16} className="text-[#B88736]" />}</h3><p className="text-xs text-[#8F631E] font-mono font-medium">{bath.popularName}</p></div>
                    <div className="p-3 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] space-y-1"><span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block flex items-center gap-1"><Heart size={11} /> Uso na tradição desta prática</span><p className="text-xs text-[#2A2420] leading-relaxed">{bath.purpose}</p></div>
                    <div className="space-y-1.5 text-xs text-[#5C5248]"><p><strong className="font-mono text-[11px]">Ervas:</strong> {bath.herbs.join(', ')}</p><p><strong className="font-mono text-[11px]">Aplicação:</strong> <span className={isBoldo ? 'text-amber-900 font-bold' : 'text-[#8F631E] font-semibold'}>{isBoldo ? 'Conforme exceção ritual descrita neste acervo' : 'Do pescoço para baixo'}</span></p><p><strong className="font-mono text-[11px]">Momento tradicional:</strong> {bath.bestDayOrTime}</p></div>
                    <div className="p-3 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] space-y-1"><span className="text-[10px] font-mono uppercase text-[#8F631E] font-bold block">Modo de preparo & intenção</span><p className="text-[#5C5248] text-[11px] leading-relaxed">{bath.preparation}</p></div>
                    <div className="p-2.5 rounded-xl bg-white border border-dashed border-[#E5DAC6]"><span className="text-[9px] font-mono uppercase text-[#8F631E] font-bold block">Afirmação</span><p className="text-[#5C5248] italic text-[11px] font-serif mt-0.5">“{bath.affirmation}”</p></div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E5DAC6]">
                    <button type="button" onClick={() => handleCopyRecipe(bath)} className="flex-1 min-h-11 py-2 rounded-xl bg-[#F5EFE4] hover:bg-[#EFE4D3] text-[#2A2420] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-[#E5DAC6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30">{isCopied ? <><CheckCircle2 size={13} className="text-emerald-700" /><span className="text-emerald-700" role="status" aria-live="polite">Copiado</span></> : <><Copy size={13} /><span>Copiar orientação</span></>}</button>
                    <button type="button" onClick={() => handleShareWhatsApp(bath)} className="min-h-11 py-2 px-3 rounded-xl bg-white hover:bg-[#F5EFE4] text-[#5C5248] border border-[#E5DAC6] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30" aria-label={`Compartilhar ${bath.name} no WhatsApp`}><Share2 size={13} /><span className="hidden sm:inline">WhatsApp</span></button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredBaths.length === 0 && <div className="rounded-2xl border border-[#E5DAC6] bg-white p-6 text-center text-sm text-[#5C5248]" role="status">Nenhum banho encontrado para essa busca.</div>}

          <div className="p-4 rounded-2xl bg-white border border-[#E5DAC6] space-y-2 text-xs text-[#5C5248]"><h4 className="text-[#2A2420] font-bold flex items-center gap-1.5 font-mono text-xs"><Info size={14} className="text-[#B88736]" /> Orientações gerais</h4><ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed"><li>Evite combinar várias misturas intensas no mesmo dia; dê espaço para observar como sua pele e seu corpo respondem.</li><li>Descarte ou devolva os resíduos vegetais de maneira adequada, respeitando o ambiente.</li><li>Esses banhos são práticas culturais/espirituais de uso externo e não substituem tratamento de saúde.</li></ul></div>
        </div>

        <div className="p-4 border-t border-[#E5DAC6] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0"><p className="text-[11px] text-[#5C5248] font-mono text-center sm:text-left">Protocolo da Transformação • Banhos e práticas tradicionais com ervas</p><button type="button" onClick={onClose} className="w-full sm:w-auto min-h-11 px-6 py-2.5 rounded-xl bg-[#B88736] hover:bg-[#8F631E] text-white font-bold text-xs shadow-md cursor-pointer transition">Fechar guia</button></div>
      </motion.div>
    </div>
  );
}
