import React from 'react';
import { ArrowRight, Headphones, Square } from 'lucide-react';
import { APPROVED_LOGO_DATA_URI, APPROVED_LOGO_ALT } from './ApprovedBrand';
type Props = { isSpeaking: boolean; onToggleWelcome: () => void; onEnterJourney: () => void };
export default function EssenciaLuminosaWelcome({ isSpeaking, onToggleWelcome, onEnterJourney }: Props) {
  return <section className="el-welcome" aria-labelledby="el-welcome-title">
    <div className="el-welcome-foliage" aria-hidden="true" />
    <header className="el-welcome-intro"><img src={APPROVED_LOGO_DATA_URI} alt={APPROVED_LOGO_ALT} className="el-welcome-logo" /><p className="el-welcome-eyebrow">Antes de começar</p><h1 id="el-welcome-title">Um acolhimento para você</h1><p>Ouça este momento de chegada antes de entrar no seu espaço de cuidado.</p></header>
    <div className="el-welcome-audio"><Headphones size={24} strokeWidth={1.3} aria-hidden="true" /><p>Um acolhimento para você</p><button type="button" onClick={onToggleWelcome} aria-pressed={isSpeaking}>{isSpeaking ? <Square size={19} aria-hidden="true" /> : <Headphones size={21} aria-hidden="true" />}<span>{isSpeaking ? 'Interromper acolhimento' : 'Ouvir acolhimento'}</span></button></div>
    <footer className="el-welcome-footer"><p>Cuidar de si também<br />é um ato de amor.</p><button type="button" onClick={onEnterJourney}>Entrar na minha jornada <ArrowRight size={20} aria-hidden="true" /></button></footer>
  </section>;
}
