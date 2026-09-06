import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface OnboardingFlowProps { onComplete: () => void; }

const feelings = ['Bem', 'Cansado(a)', 'Ansioso(a)', 'Triste', 'Sobrecarregado(a)', 'Em um dia difícil', 'Outra forma de descrever'];
const intentions = ['Ter mais paz', 'Voltar a me sentir bem', 'Reconectar comigo', 'Encontrar um propósito', 'Melhorar meus relacionamentos', 'Cuidar da minha saúde', 'Redescobrir o que me faz feliz', 'Outra coisa'];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [feeling, setFeeling] = useState('');
  const [intention, setIntention] = useState('');
  const next = () => step < 6 ? setStep(s => s + 1) : onComplete();

  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#08271d] text-[#f7f1df]">
    <div className="min-h-full flex items-center justify-center p-5">
      <AnimatePresence mode="wait">
        <motion.main key={step} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}}
          className="w-full max-w-md rounded-[2rem] border border-[#c9a85a]/35 bg-[#0b3024]/95 p-7 shadow-2xl">
          <div className="mb-7 h-px w-16 bg-[#c9a85a]" />

          {step === 1 && <section className="space-y-6">
            <p className="text-xs uppercase tracking-[.28em] text-[#d5ba78]">Everton Piceni · Terapias Holísticas e Bem-Estar</p>
            <h1 className="font-display text-4xl leading-tight">Seu momento começa aqui.</h1>
            <p className="text-[#e8dfc9] leading-relaxed">Um espaço para respirar, acolher e voltar para si. Aqui, ninguém precisa estar bem para ser bem-vindo.</p>
            <button onClick={next} className="w-full rounded-full bg-[#d2ae5d] py-4 font-medium text-[#173023]">Começar <ArrowRight className="inline ml-2" size={18}/></button>
          </section>}

          {step === 2 && <section className="space-y-5">
            <p className="text-[#d5ba78]">Quem é Everton?</p>
            <h1 className="font-display text-3xl">Eu também estou voltando para mim.</h1>
            <div className="space-y-4 text-sm leading-relaxed text-[#eee6d4]">
              <p>Durante muito tempo, fui pilar para outras pessoas. Enquanto cuidava de tantos, muitas vezes deixei uma pessoa para depois: eu mesmo.</p>
              <p>Eu me perdi. Eu me quebrei. Conheci a vulnerabilidade, o julgamento e a solidão. E ainda estou caminhando — encontrando o meu caminho de volta para mim.</p>
              <p>Não estou aqui porque tenho todas as respostas. Estou aqui porque sei como é precisar de acolhimento e não encontrá-lo.</p>
              <p className="text-[#d5ba78]">Minha experiência não substitui profissionais de saúde. Ela me ensinou a não olhar para a dor de alguém de cima para baixo.</p>
            </div>
            <button onClick={next} className="w-full rounded-full border border-[#d2ae5d] py-4">Continuar</button>
          </section>}

          {step === 3 && <section className="space-y-6">
            <h1 className="font-display text-4xl">Agora é sobre você.</h1>
            <p className="leading-relaxed text-[#e8dfc9]">Talvez a minha história seja diferente da sua. Este espaço não existe para que você siga os meus passos. Existe para convidar você a olhar para os seus.</p>
            <p className="font-display text-2xl text-[#d5ba78]">Quando foi a última vez que você realmente se perguntou como está?</p>
            <button onClick={next} className="w-full rounded-full bg-[#d2ae5d] py-4 font-medium text-[#173023]">Quero olhar para mim</button>
          </section>}

          {step === 4 && <section className="space-y-5">
            <h1 className="font-display text-3xl text-[#e1c171]">Como você está, de verdade?</h1>
            <p className="text-sm text-[#e8dfc9]">Não existe resposta certa. Aqui você pode ser sincero.</p>
            <div className="grid gap-2">{feelings.map(x => <button key={x} onClick={()=>setFeeling(x)} className={`rounded-2xl border px-4 py-3 text-left ${feeling===x?'border-[#d2ae5d] bg-[#d2ae5d]/15':'border-white/10 bg-white/5'}`}>{x}</button>)}</div>
            <button disabled={!feeling} onClick={next} className="w-full rounded-full bg-[#d2ae5d] py-4 text-[#173023] disabled:opacity-40">Continuar</button>
          </section>}

          {step === 5 && <section className="space-y-5">
            <h1 className="font-display text-3xl">O que ainda importa para você?</h1>
            <p className="text-sm text-[#e8dfc9]">Você não precisa ter todas as respostas. Escolha o que mais ressoa com você hoje.</p>
            <div className="grid gap-2">{intentions.map(x => <button key={x} onClick={()=>setIntention(x)} className={`rounded-2xl border px-4 py-3 text-left ${intention===x?'border-[#d2ae5d] bg-[#d2ae5d]/15':'border-white/10 bg-white/5'}`}>{x}</button>)}</div>
            <button disabled={!intention} onClick={next} className="w-full rounded-full bg-[#d2ae5d] py-4 text-[#173023] disabled:opacity-40">Continuar</button>
          </section>}

          {step === 6 && <section className="space-y-6 text-center">
            <ShieldCheck className="mx-auto text-[#d5ba78]" size={38}/>
            <h1 className="font-display text-3xl">Você não precisa ter todas as respostas.</h1>
            <p className="leading-relaxed text-[#e8dfc9]">Talvez só precise começar voltando para você. Este é um espaço de cuidado integrativo, presença e autoconhecimento — não substitui atendimento médico, psicológico ou psiquiátrico quando necessário.</p>
            <p className="font-display text-2xl text-[#d5ba78]">Eu estou caminhando também.</p>
            <button onClick={next} className="w-full rounded-full bg-[#d2ae5d] py-4 font-medium text-[#173023]">Explorar o meu caminho</button>
            <p className="text-xs text-[#cbbf9f]">@terapiamorevida · Evoluir também é cuidar de si.</p>
          </section>}
        </motion.main>
      </AnimatePresence>
    </div>
  </div>;
}
