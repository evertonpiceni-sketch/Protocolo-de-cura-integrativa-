import React, { useState, useMemo, useEffect } from 'react';
import { DayProgress } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MessageSquare, Send, Activity, Info, Calendar } from 'lucide-react';

interface DayData {
  dia: string;
  dayNum: number;
  humor: number; // 1 a 10
  consistencia: number; // 0 a 100%
  praticaFeita: boolean;
  nota: string;
}

interface UserComment {
  id: string;
  text: string;
  date: string;
}

export default function DashboardCura({ onClose, progress }: { onClose: () => void, progress: DayProgress[] }) {
  const [rangeFilter, setRangeFilter] = useState<'all' | '7' | '14'>('all');
  const [comments, setComments] = useState<UserComment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Load comments
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cura_integrada_comments_v1');
      if (saved) {
        setComments(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Save comments
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry: UserComment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const updated = [newEntry, ...comments];
    setComments(updated);
    setNewComment('');
    localStorage.setItem('cura_integrada_comments_v1', JSON.stringify(updated));
  };

  const realData = useMemo(() => {
    if (!progress || progress.length === 0) return [];
    
    // Generate 21 days array
    const data: DayData[] = [];
    for (let i = 1; i <= 21; i++) {
      const dayProg = progress.find(d => d.dayNumber === i);
      const humorVal = dayProg && dayProg.completed ? (dayProg.mood || 5) * 2 : 0; // Convert 1-5 scale to 1-10
      const consistenciaVal = dayProg?.completed ? 100 : 0;
      
      data.push({
        dia: `Dia ${i}`,
        dayNum: i,
        humor: humorVal,
        consistencia: consistenciaVal,
        praticaFeita: !!dayProg?.completed,
        nota: dayProg?.journalText || (dayProg?.completed ? 'Prática finalizada' : 'Pendente')
      });
    }
    
    // Calculate cumulative consistency
    let completedCount = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].praticaFeita) completedCount++;
      data[i].consistencia = Math.round((completedCount / (i + 1)) * 100);
    }
    
    return data;
  }, [progress]);

  const filteredData = useMemo(() => {
    if (!realData || realData.length === 0) return [];
    if (rangeFilter === '7') return realData.slice(14, 21);
    if (rangeFilter === '14') return realData.slice(7, 21);
    return realData;
  }, [rangeFilter, realData]);

  // Cálculos de KPI (Protected against division by zero)
  const avgHumor = filteredData.length > 0
    ? (filteredData.reduce((acc, curr) => acc + curr.humor, 0) / filteredData.length).toFixed(1)
    : "0.0";

  const avgConsistencia = filteredData.length > 0
    ? Math.round(filteredData.reduce((acc, curr) => acc + curr.consistencia, 0) / filteredData.length)
    : 0;

  const totalPraticas = filteredData.filter((d) => d.praticaFeita).length;
  
  const completionRate = filteredData.length > 0
    ? Math.round((totalPraticas / filteredData.length) * 100)
    : 0;

  const hasAnyData = totalPraticas > 0;

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-50 overflow-y-auto" style={{ fontFamily: 'sans-serif', color: '#1E293B' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity className="text-indigo-500" />
              Jornada de Cura & Hábito — 21 Dias
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '14px' }}>
              Acompanhamento analítico de humor e constância diária
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: '4px', background: '#E2E8F0', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => setRangeFilter('all')}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: rangeFilter === 'all' ? '#FFFFFF' : 'transparent',
                  color: rangeFilter === 'all' ? '#0F172A' : '#64748B',
                }}
              >
                21 Dias
              </button>
              <button
                onClick={() => setRangeFilter('14')}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: rangeFilter === '14' ? '#FFFFFF' : 'transparent',
                  color: rangeFilter === '14' ? '#0F172A' : '#64748B',
                }}
              >
                14 Dias
              </button>
              <button
                onClick={() => setRangeFilter('7')}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: rangeFilter === '7' ? '#FFFFFF' : 'transparent',
                  color: rangeFilter === '7' ? '#0F172A' : '#64748B',
                }}
              >
                7 Dias
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Cards de Métricas (KPIs) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Média do Humor</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8B5CF6', marginTop: '4px' }}>
              {avgHumor} <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 'normal' }}>/ 10</span>
            </div>
            <span style={{ fontSize: '12px', color: '#10B981', marginTop: '4px', display: 'block' }}>
              Nível base das práticas
            </span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Consistência Média</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0EA5E9', marginTop: '4px' }}>
              {avgConsistencia}%
            </div>
            <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Nível de adesão às práticas
            </span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Práticas Concluídas</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981', marginTop: '4px' }}>
              {totalPraticas} <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 'normal' }}>/ {filteredData.length} dias</span>
            </div>
            <span style={{ fontSize: '12px', color: '#10B981', marginTop: '4px', display: 'block' }}>
              {completionRate}% de conclusão no período
            </span>
          </div>
        </div>

        {/* Mapa de Calor (Heatmap) */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: 0, marginBottom: '20px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar className="text-emerald-500" size={18} />
            Mapa de Calor: Bem-Estar e Humor (21 Dias)
          </h2>
          
          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            {Array.from({ length: 21 }, (_, i) => i + 1).map(dayNum => {
              const dayProg = progress.find(p => p.dayNumber === dayNum);
              const isCompleted = dayProg?.completed;
              const mood = dayProg?.mood || dayProg?.afterFeeling?.mood;
              
              let bgColor = '#F1F5F9'; // slate-100 (pending)
              let tooltipText = `Dia ${dayNum}: Pendente`;
              
              if (isCompleted) {
                if (!mood) {
                   bgColor = '#CBD5E1'; // slate-300
                   tooltipText = `Dia ${dayNum}: Concluído (Sem registro de humor)`;
                } else {
                   if (mood === 1) bgColor = '#F43F5E';
                   else if (mood === 2) bgColor = '#F97316';
                   else if (mood === 3) bgColor = '#FBBF24';
                   else if (mood === 4) bgColor = '#34D399';
                   else if (mood === 5) bgColor = '#10B981';
                   else bgColor = '#10B981';
                   
                   tooltipText = `Dia ${dayNum}: Bem-estar ${mood}/5`;
                }
              }
              
              return (
                <div 
                  key={dayNum}
                  title={tooltipText}
                  className="relative group cursor-pointer transition-transform hover:scale-110 flex items-center justify-center font-mono text-[10px] sm:text-xs text-slate-400 font-bold"
                  style={{
                    width: 'clamp(32px, 5vw, 44px)',
                    height: 'clamp(32px, 5vw, 44px)',
                    backgroundColor: bgColor,
                    borderRadius: '8px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    color: isCompleted && mood ? '#FFFFFF' : '#94A3B8'
                  }}
                >
                  {dayNum}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                    {tooltipText}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200"></div> Pendente</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#F43F5E'}}></div> Muito Ruim</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#F97316'}}></div> Ruim</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#FBBF24'}}></div> Neutro</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#34D399'}}></div> Bom</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#10B981'}}></div> Excelente</div>
          </div>
        </div>

        {/* Gráfico Principal */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: 0, marginBottom: '20px', color: '#334155' }}>
            Evolução Combinada: Humor vs Consistência
          </h2>

          <div style={{ width: '100%', height: '380px', position: 'relative' }}>
            {!hasAnyData ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <Info className="text-slate-400 mb-2" size={32} />
                <p className="text-slate-500 font-medium">Aguardando dados da jornada</p>
                <p className="text-slate-400 text-sm mt-1">Conclua pelo menos uma prática para visualizar o gráfico de evolução.</p>
              </div>
            ) : (
              <ResponsiveContainer>
                <ComposedChart data={filteredData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="humorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

                  <XAxis
                    dataKey="dia"
                    tickLine={false}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />

                  {/* Eixo Esquerdo: Nível do Humor (1-10) */}
                  <YAxis
                    yAxisId="left"
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#8B5CF6', fontSize: 12 }}
                    unit=" pts"
                  />

                  {/* Eixo Direito: Consistência (%) */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#0EA5E9', fontSize: 12 }}
                    unit="%"
                  />

                  <Tooltip
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as DayData;
                        return (
                          <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '12px', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#F8FAFC' }}>{label}</p>
                            <p style={{ margin: '2px 0', color: '#DDD6FE' }}>
                              Humor Registrado: <strong>{data.humor > 0 ? data.humor : '-'} / 10</strong>
                            </p>
                            <p style={{ margin: '2px 0', color: '#BAE6FD' }}>
                              Consistência: <strong>{data.consistencia}%</strong>
                            </p>
                            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#94A3B8', borderTop: '1px solid #334155', paddingTop: '6px' }}>
                              Nota: {data.nota}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '16px', fontSize: '13px' }}
                  />

                  {/* Área para Humor (Eixo Esquerdo) */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="humor"
                    name="Nível de Humor (1-10)"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#humorGrad)"
                  />

                  {/* Linha para Consistência (Eixo Direito) */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="consistencia"
                    name="Consistência (%)"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#0EA5E9' }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Módulo de Comentários / Avaliação */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: 0, marginBottom: '20px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare className="text-emerald-500" />
            Comentários e Feedbacks
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Como está sendo a sua experiência no aplicativo e no site? Deixe sua sugestão ou depoimento sobre o seu protocolo de cura.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário sobre a plataforma..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20 shrink-0"
            >
              <Send size={16} />
              Enviar Depoimento
            </button>
          </div>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 text-sm">Seja o primeiro a deixar um comentário sobre a plataforma! ✨</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    U
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-700 text-sm">Usuário da Plataforma</span>
                      <span className="text-xs text-slate-400 font-mono">{comment.date}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
