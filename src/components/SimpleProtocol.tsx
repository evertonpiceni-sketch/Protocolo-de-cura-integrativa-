import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle2 } from 'lucide-react';

export default function SimpleProtocol({ onClose }: { onClose: () => void }) {
  const [audioUrl, setAudioUrl] = useState('');
  const [progress, setProgress] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const savedUrl = localStorage.getItem('reiki_audio_url');
    if (savedUrl) setAudioUrl(savedUrl);
    
    const savedProgress = localStorage.getItem('reiki_progress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {}
    }
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAudioUrl(url);
    localStorage.setItem('reiki_audio_url', url);
  };

  const toggleDay = (day: number) => {
    const newProgress = { ...progress, [day]: !progress[day] };
    setProgress(newProgress);
    localStorage.setItem('reiki_progress', JSON.stringify(newProgress));
  };

  const renderCycle = (title: string, subtitle: string, startDay: number, endDay: number) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#5b2c6f]">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {Array.from({ length: endDay - startDay + 1 }).map((_, i) => {
          const day = startDay + i;
          const isDone = progress[day];
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                isDone 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-[#5b2c6f]/5'
              }`}
            >
              <span className="text-xs font-medium mb-1">Dia {day}</span>
              <CheckCircle2 size={20} className={isDone ? 'text-emerald-500' : 'text-slate-300'} />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#f8f9fa] z-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-[#5b2c6f] hover:text-[#5b2c6f]/80 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para o App
        </button>

        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#5b2c6f] mb-2 tracking-tight">
            Protocolo de 21 Dias de Reiki Integrativo
          </h1>
          <h2 className="text-[#d4ac0d] font-medium text-lg">
            São Miguel, Chama Violeta e Raios de Ouro de São Rafael
          </h2>
        </header>

        <div className="bg-[#5b2c6f] rounded-2xl p-6 text-white shadow-lg shadow-[#5b2c6f]/20 mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Play size={18} className="text-[#d4ac0d]" />
            Áudio do Tratamento
          </h3>
          <input
            type="url"
            value={audioUrl}
            onChange={handleUrlChange}
            placeholder="Cole o link do MP3 do tratamento guiado aqui..."
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#d4ac0d] transition-colors mb-4"
          />
          {audioUrl && (
            <audio controls className="w-full h-12 rounded-lg bg-white/5" src={audioUrl}>
              Seu navegador não suporta o elemento de áudio.
            </audio>
          )}
        </div>

        {renderCycle('Ciclo 1: Dias 1 a 7', 'Proteção e Limpeza - São Miguel', 1, 7)}
        {renderCycle('Ciclo 2: Dias 8 a 14', 'Transmutação e Purificação - Chama Violeta', 8, 14)}
        {renderCycle('Ciclo 3: Dias 15 a 21', 'Regeneração e Cura - São Rafael', 15, 21)}
        
      </div>
    </div>
  );
}
