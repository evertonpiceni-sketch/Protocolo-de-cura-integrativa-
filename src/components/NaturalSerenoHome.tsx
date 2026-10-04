import React, { useState } from 'react';
import {
  ArrowLeft, Award, AudioLines, BookOpen, ChevronRight, Flower2,
  GraduationCap, Headphones, Heart, Home, Leaf, LogOut, Menu, MessageCircle,
  Pause, Play, Sliders, Sparkles, Sun, UserRound, Users, Waves, CalendarDays, Citrus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TransformationHomeProps } from './TransformationHome';
import type { TreatmentRecommendation } from '../lib/anamnesisTreatmentEngine';
import { DAILY_INSIGHTS } from '../types';
import { APPROVED_LOGO_DATA_URI } from './ApprovedBrand';

type View = 'home' | 'menu' | 'journey' | 'library' | 'tools' | 'profile' | 'result' | 'community';
type Props = TransformationHomeProps & {
  firstName: string;
  journeyEntered: boolean;
  isSpeaking: boolean;
  onToggleWelcome: () => void;
  onSpeakResult: () => void;
  onEnterJourney: () => void;
  recommendation: TreatmentRecommendation | null;
};
type Row = { key?: string; title: string; copy: string; icon: LucideIcon; action: () => void };

function CareRow({ title, copy, icon: Icon, action }: Row) {
  return <button className="ns-row" onClick={action}>
    <span className="ns-row-icon"><Icon size={22} strokeWidth={1.5} /></span>
    <span className="ns-row-copy"><strong>{title}</strong><small>{copy}</small></span>
    <ChevronRight size={18} aria-hidden="true" />
  </button>;
}

/** Natural Sereno owns presentation only. All care actions use the existing callbacks. */
export default function NaturalSerenoHome(props: Props) {
  const [view, setView] = useState<View>('home');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [communityTab, setCommunityTab] = useState('Recentes');
  const completed = props.progress.filter(item => item.completed).length;
  const total = Math.max(props.progress.length, 21);
  const percentage = Math.min(100, Math.round(completed / total * 100));
  const insight = DAILY_INSIGHTS[Math.max(0, Math.min(DAILY_INSIGHTS.length - 1, props.currentDay - 1))];
  const recommendation = props.recommendation;
  const changeView = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const tools: Row[] = [
    { title: 'Mapa Astral', copy: 'Um olhar simbólico para sua jornada', icon: Sun, action: props.onOpenAstral },
    { title: 'Numerologia', copy: 'Ciclos, essência e caminhos', icon: Flower2, action: props.onOpenNumerology },
    { title: 'Banhos e Aromas', copy: 'Natureza como parte do cuidado', icon: Leaf, action: props.onOpenBaths },
    { title: 'Guia dos 7 Chakras', copy: 'Conheça seus centros de energia', icon: Sparkles, action: props.onOpenChakras },
    { title: 'Perguntas sistêmicas', copy: 'Outros caminhos da sua jornada', icon: Users, action: props.onOpenSystemic },
    { title: 'Ho’oponopono', copy: 'Outros caminhos da sua jornada', icon: Heart, action: props.onOpenHooponopono },
  ];
  const library: (Row & { category: string; image: string })[] = [
    { title: 'Cursos e conteúdos', copy: 'Biblioteca de apoio', icon: GraduationCap, action: props.onOpenCourses, category: 'Cursos', image: '/brand/natural-sereno/reiki.webp' },
    { title: 'Guia dos 7 Chakras', copy: 'Conheça seus centros de energia', icon: Sparkles, action: props.onOpenChakras, category: 'Práticas', image: '/brand/natural-sereno/presenca.webp' },
    { title: 'Banhos e Aromas', copy: 'Natureza como parte do cuidado', icon: Leaf, action: props.onOpenBaths, category: 'Práticas', image: '/brand/natural-sereno/aromas.webp' },
    { title: 'Ho’oponopono', copy: 'Outros caminhos da sua jornada', icon: Heart, action: props.onOpenHooponopono, category: 'Práticas', image: '/brand/natural-sereno/reiki.webp' },
    { title: 'Numerologia', copy: 'Ciclos, essência e caminhos', icon: Flower2, action: props.onOpenNumerology, category: 'Autoconhecimento', image: '/brand/natural-sereno/cachoeira.webp' },
    { title: 'Mapa Astral', copy: 'Um olhar simbólico para sua jornada', icon: Sun, action: props.onOpenAstral, category: 'Autoconhecimento', image: '/brand/natural-sereno/vale-amanhecer.webp' },
  ];
  const menu: Row[] = [
    { title: '21 Dias para Voltar para Mim', copy: 'Reintegração da Vida', icon: Leaf, action: props.onOpenPersonalJourney },
    { title: 'Anamnese / Teste', copy: 'Olhar meu momento', icon: Waves, action: props.onOpenAnamnesis },
    { title: 'Biblioteca Integrativa', copy: 'Cursos, práticas e materiais', icon: BookOpen, action: () => changeView('library') },
    { title: 'Ferramentas de Apoio', copy: 'Natureza como parte do cuidado', icon: Flower2, action: () => changeView('tools') },
    { title: 'Minha Comunidade', copy: 'Compartilhe e evolua', icon: Users, action: () => changeView('community') },
    { title: 'Meu Perfil', copy: 'Acompanhe seu progresso', icon: UserRound, action: () => changeView('profile') },
  ];

  if (!props.journeyEntered) {
    return <div className="ns-app ns-welcome" data-ns-screen="welcome">
      <div className="ns-welcome-content">
        <img className="ns-welcome-brand" src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni" />
        <h1>Um acolhimento para você</h1>
        <p>Ouça este momento de chegada antes de entrar no seu espaço de cuidado.</p>
        <div className="ns-welcome-audio">
        <img className="ns-audio-wave" src="/brand/natural-sereno/onda-acolhimento.webp" alt="" />
        <button className="ns-welcome-play" onClick={props.onToggleWelcome} aria-label={props.isSpeaking ? 'Pausar acolhimento' : 'Ouvir acolhimento'}>
          {props.isSpeaking ? <Pause size={34} /> : <Play size={34} fill="currentColor" />}
        </button>
        </div>
        <p className="ns-welcome-status" aria-live="polite">{props.isSpeaking ? 'Pausar acolhimento' : 'Ouvir acolhimento'}</p>
        <button className="ns-gold" onClick={props.onEnterJourney}>Entrar na minha jornada <ChevronRight size={19} /></button>
        <p className="ns-signature">Cuidar de si também é um ato de amor.</p>
      </div>
    </div>;
  }

  const headings: Record<View, [string, string]> = {
    home: ['', ''], menu: ['Seu Protocolo', 'Um lugar para voltar para si.'],
    journey: ['Sua Jornada', 'Protocolo da Transformação'],
    library: ['Biblioteca Integrativa', 'Conhecimento que transforma'],
    tools: ['Ferramentas de Apoio', 'Recursos para o seu dia a dia'],
    profile: ['Meu Perfil', 'Acompanhe seu progresso'],
    result: ['Seu Resultado', recommendation?.categoryLabel || 'Olhar meu momento'],
    community: ['Juntos somos mais fortes', 'Um espaço seguro para trocar experiências'],
  };

  return <div className="ns-app" data-ns-screen={view}>
    {view !== 'home' && <header className="ns-page-heading">
      <button onClick={() => changeView('home')} aria-label="Voltar ao início"><ArrowLeft size={20} /></button>
      <h1>{headings[view][0]}</h1><p>{headings[view][1]}</p>
    </header>}

    {view === 'home' && <>
      <section className="ns-home-scene">
        <button className="ns-home-menu" onClick={() => changeView('menu')} aria-label="Abrir menu principal"><Menu size={22} /></button>
        <div className="ns-greeting"><h1>Olá, {props.firstName}.</h1><p>Que bom que você voltou para si.</p><p>Respire. Você não precisa fazer tudo hoje. Escolha apenas o cuidado que combina com o seu momento.</p></div>
        <div className="ns-home-message"><p>Um novo capítulo<br />pode começar hoje.</p><span>Respire. Acolha. Transforme.<br />Você consegue.</span></div>
        <button className="ns-gold" onClick={() => changeView('journey')}>Começar minha jornada <ChevronRight size={19} /></button>
      </section>
      <div className="ns-home-content">
        <button className="ns-current-day ns-row" onClick={() => props.onStartSession(props.currentDay)}>
          <img src="/brand/natural-sereno/cachoeira.webp" alt="" />
          <span className="ns-row-copy"><small>Dia {props.currentDay}</small><strong>{insight?.title}</strong></span><Play size={19} />
        </button>
        {!props.anamnesis ? <section className="ns-editorial-card">
          <small>Primeiro, vamos ouvir você</small><h2>Como você está de verdade?</h2>
          <p>Responda à anamnese para receber seu resultado, frequência, chakra em foco, floral, aroma e protocolo recomendado.</p>
          <button className="ns-gold" onClick={props.onOpenAnamnesis}>Começar minha anamnese <ChevronRight size={18} /></button>
        </section> : recommendation && <CareRow title={recommendation.categoryLabel} copy="Seu resultado personalizado" icon={Heart} action={() => changeView('result')} />}
        <section className="ns-editorial-card ns-insight"><small>Afirmação do dia</small><h2>{insight?.title}</h2><p>{insight?.description}</p><blockquote>{insight?.focus}</blockquote></section>
        <section className="ns-editorial-card"><h2>Você já fez muito por você.</h2><p>Agora, é a sua vez.</p></section>
        <CareRow title="Menu" copy="Outros caminhos da sua jornada" icon={Menu} action={() => changeView('menu')} />
      </div>
    </>}

    {view === 'menu' && <section className="ns-list">{menu.map(row => <CareRow key={row.title} {...row} />)}<p className="ns-signature">Cuidar de si também é um ato de amor.</p></section>}

    {view === 'journey' && <section className="ns-list ns-journey">
      <div className="ns-journey-intro"><p>Primeiro escolha a experiência. O aceite aparece dentro da jornada escolhida, antes do início da prática.</p></div>
      {DAILY_INSIGHTS.map(entry => {
        const done = props.progress.some(item => item.dayNumber === entry.day && item.completed);
        return <button key={entry.day} className="ns-row ns-day" aria-label={`Abrir dia ${entry.day}: ${entry.title}`} onClick={() => props.onStartSession(entry.day)}>
          <span className="ns-day-number">{entry.day}</span>
          <img src={`/brand/natural-sereno/${['presenca', 'vale-amanhecer', 'cachoeira', 'reiki', 'acolhimento'][(entry.day - 1) % 5]}.webp`} alt="" loading="lazy" />
          <span className="ns-row-copy"><strong>{entry.title}</strong><small>{done ? 'Concluído' : entry.day === props.currentDay ? 'Seu momento' : entry.focus}</small></span><ChevronRight size={17} />
        </button>;
      })}
      <CareRow title="21 Dias para Voltar para Mim" copy="Reintegração da Vida" icon={Leaf} action={props.onOpenPersonalJourney} />
      <CareRow title="Proteção e Presença" copy="Jornada de São Miguel" icon={Sparkles} action={props.onOpenArcanjo} />
    </section>}

    {view === 'library' && <section className="ns-list">
      <label className="ns-search"><BookOpen size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar um curso, prática ou tema…" aria-label="Buscar na biblioteca" /></label>
      <div className="ns-filter" aria-label="Categorias da biblioteca">{['Todos', 'Cursos', 'Práticas', 'Autoconhecimento'].map(label => <button key={label} aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}</div>
      {library.filter(row => (category === 'Todos' || row.category === category) && `${row.title} ${row.copy}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))).map(row => <button key={row.title} className="ns-row ns-library-row" onClick={row.action}><img src={row.image} alt="" /><span className="ns-row-copy"><strong>{row.title}</strong><small>{row.copy}</small></span><ChevronRight size={17} /></button>)}
      {!library.some(row => (category === 'Todos' || row.category === category) && `${row.title} ${row.copy}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))) && <p role="status" className="ns-empty">Nenhum conteúdo encontrado.</p>}
      <p className="ns-signature">Cuidar de si também é um ato de amor.</p>
    </section>}

    {view === 'tools' && <section className="ns-list ns-tools">{tools.map(row => <CareRow key={row.title} {...row} />)}<p className="ns-signature">Cuidar de si também é um ato de amor.</p></section>}

    {view === 'community' && <section className="ns-list ns-community">
      <div className="ns-filter" aria-label="Publicações da comunidade">{['Recentes', 'Mais Ativos'].map(label => <button key={label} aria-pressed={communityTab === label} onClick={() => setCommunityTab(label)}>{label}</button>)}</div>
      <div className="ns-community-empty" role="status"><Users size={38} strokeWidth={1.2} aria-hidden="true" /><h2>Entre Nós</h2><p>Ainda não há publicações para exibir.</p><p>Aqui, a experiência pode ser compartilhada. A identidade não precisa ser.</p></div>
      <CareRow title="Fale conosco" copy="Um lugar para voltar para si" icon={MessageCircle} action={props.onOpenContact} />
    </section>}

    {view === 'profile' && <section className="ns-list ns-profile">
      <div className="ns-profile-identity"><UserRound size={42} strokeWidth={1.2} aria-hidden="true" /><h2>{props.userName}</h2></div>
      <section className="ns-profile-progress"><div><Leaf size={22} /><h3>Meu Progresso</h3><span>{completed} de {total} dias</span></div><progress value={completed} max={total} aria-label="Dias concluídos" /><small>{percentage}%</small></section>
      <CareRow title="Meu Diário" copy="Registrar percepções" icon={BookOpen} action={props.onOpenJournal} />
      <CareRow title="Meus Protocolos" copy="Prática guiada do seu ciclo atual" icon={Leaf} action={() => changeView('journey')} />
      <CareRow title="Como estou?" copy="Olhar meu momento" icon={Waves} action={props.onOpenAnamnesis} />
      <CareRow title="Conquistas e marcos" copy="Outros caminhos da sua jornada" icon={Award} action={props.onOpenAchievements} />
      <CareRow title="Configurações" copy="Ajustes da Prática" icon={Sliders} action={props.onOpenSettings} />
      <CareRow title="Fale conosco" copy="Biblioteca de apoio" icon={MessageCircle} action={props.onOpenContact} />
      {props.onLogout && <CareRow title="Sair" copy="Encerrar sessão" icon={LogOut} action={props.onLogout} />}
      <p className="ns-signature">Cuidar de si também é um ato de amor.</p>
    </section>}

    {view === 'result' && recommendation && <section className="ns-list ns-result">
      <Flower2 size={43} strokeWidth={1} aria-hidden="true" />
      <p>{recommendation.summaryDiagnosis}</p>
      {([
        ['Frequência Solfeggio', recommendation.frequencyLabel, AudioLines],
        ['Chakra em foco', recommendation.primaryChakraFocus, Sun],
        ['Floral recomendado', recommendation.recommendedFloral || props.anamnesis?.recommendedFloral || 'Definido conforme sua anamnese', Flower2],
        ['Aromaterapia recomendada', recommendation.recommendedAromatherapy || props.anamnesis?.recommendedAromatherapy || 'Definida conforme sua anamnese', Citrus],
        ['Protocolo indicado', recommendation.treatmentTitle, BookOpen],
        ['Duração sugerida', `${recommendation.recommendedDurationDays} dias`, CalendarDays],
      ] as [string, string, LucideIcon][]).map(([label, value, Icon]) => <div key={label} className="ns-result-item"><span className="ns-result-symbol"><Icon size={25} strokeWidth={1.4} /></span><div><small>{label}</small><strong>{value}</strong></div></div>)}
      <button className="ns-gold" onClick={props.onSpeakResult}><Headphones size={19} />Ouvir meu resultado</button>
      <button className="ns-secondary" onClick={props.onOpenAnamnesis}>Ver ou refazer minha anamnese <ChevronRight size={18} /></button>
    </section>}

    <nav className="ns-dock" aria-label="Navegação principal">
      {([
        ['home', Home, 'Início'], ['journey', Leaf, 'Jornada'], ['library', BookOpen, 'Biblioteca'], ['community', Users, 'Comunidade'],
      ] as [View, LucideIcon, string][]).map(([destination, Icon, label]) => <button key={destination} onClick={() => changeView(destination)} aria-current={view === destination ? 'page' : undefined}><Icon size={22} strokeWidth={1.5} /><span>{label}</span></button>)}
    </nav>
  </div>;
}
