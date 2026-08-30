import React, { useState, useMemo } from 'react';
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

interface DayData {
  dia: string;
  dayNum: number;
  humor: number; // 1 a 10
  consistencia: number; // 0 a 100%
  praticaFeita: boolean;
  nota: string;
}

// Dados mockados representando uma jornada realista de 21 dias de cura
const mock21DaysData: DayData[] = [
  { dia: 'Dia 1', dayNum: 1, humor: 3, consistencia: 40, praticaFeita: true, nota: 'Início desafiador, ansiedade alta' },
  { dia: 'Dia 2', dayNum: 2, humor: 4, consistencia: 60, praticaFeita: true, nota: 'Pequena melhora após a prática' },
  { dia: 'Dia 3', dayNum: 3, humor: 3, consistencia: 50, praticaFeita: false, nota: 'Dia cansativo' },
  { dia: 'Dia 4', dayNum: 4, humor: 5, consistencia: 70, praticaFeita: true, nota: 'Sensação de alívio leve' },
  { dia: 'Dia 5', dayNum: 5, humor: 6, consistencia: 80, praticaFeita: true, nota: 'Boa conexão nas atividades' },
  { dia: 'Dia 6', dayNum: 6, humor: 4, consistencia: 60, praticaFeita: true, nota: 'Oscilação normal no processo' },
  { dia: 'Dia 7', dayNum: 7, humor: 6, consistencia: 85, praticaFeita: true, nota: 'Fechamento da 1ª semana' },
  { dia: 'Dia 8', dayNum: 8, humor: 7, consistencia: 90, praticaFeita: true, nota: 'Mais clareza mental' },
  { dia: 'Dia 9', dayNum: 9, humor: 5, consistencia: 75, praticaFeita: false, nota: 'Resistência interna percebida' },
  { dia: 'Dia 10', dayNum: 10, humor: 7, consistencia: 85, praticaFeita: true, nota: 'Retomada com foco' },
  { dia: 'Dia 11', dayNum: 11, humor: 8, consistencia: 90, praticaFeita: true, nota: 'Sentimento de paz sustentável' },
  { dia: 'Dia 12', dayNum: 12, humor: 6, consistencia: 80, praticaFeita: true, nota: 'Processando emoções antigas' },
  { dia: 'Dia 13', dayNum: 13, humor: 8, consistencia: 95, praticaFeita: true, nota: 'Energia renovada' },
  { dia: 'Dia 14', dayNum: 14, humor: 8, consistencia: 100, praticaFeita: true, nota: 'Marco de 14 dias concluído' },
  { dia: 'Dia 15', dayNum: 15, humor: 7, consistencia: 85, praticaFeita: true, nota: 'Estabilidade mantida' },
  { dia: 'Dia 16', dayNum: 16, humor: 9, consistencia: 95, praticaFeita: true, nota: 'Dia de profunda gratidão' },
  { dia: 'Dia 17', dayNum: 17, humor: 8, consistencia: 90, praticaFeita: true, nota: 'Foco e presença' },
  { dia: 'Dia 18', dayNum: 18, humor: 9, consistencia: 100, praticaFeita: true, nota: 'Sensação de transformação' },
  { dia: 'Dia 19', dayNum: 19, humor: 8, consistencia: 90, praticaFeita: true, nota: 'Hábito integrado' },
  { dia: 'Dia 20', dayNum: 20, humor: 9, consistencia: 95, praticaFeita: true, nota: 'Confiança na nova rotina' },
  { dia: 'Dia 21', dayNum: 21, humor: 10, consistencia: 100, praticaFeita: true, nota: 'Jornada de 21 dias finalizada com sucesso!' },
];

import { DayProgress } from '../types';

export default function DashboardCura({ onClose, progress }: { onClose: () => void, progress: DayProgress[] }) {
  const [rangeFilter, setRangeFilter] = useState<'all' | '7' | '14'>('all');

  
  const realData = useMemo(() => {
    // Generate 21 days array
    const data: DayData[] = [];
    for (let i = 1; i <= 21; i++) {
      const dayProg = progress.find(d => d.dayNumber === i);
      const humorVal = dayProg ? (dayProg.mood || 0) * 2 : 0; // Convert 1-5 scale to 1-10
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
    if (rangeFilter === '7') return realData.slice(14, 21);
    if (rangeFilter === '14') return realData.slice(7, 21);
    return realData;
  }, [rangeFilter, realData]);


  // Cálculos de KPI
  const avgHumor = (
    filteredData.reduce((acc, curr) => acc + curr.humor, 0) / filteredData.length
  ).toFixed(1);

  const avgConsistencia = Math.round(
    filteredData.reduce((acc, curr) => acc + curr.consistencia, 0) / filteredData.length
  );

  const totalPraticas = filteredData.filter((d) => d.praticaFeita).length;

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-50 overflow-y-auto" style={{ fontFamily: 'sans-serif', color: '#1E293B' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#0F172A' }}>
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
                Últimos 14 Dias
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
                Últimos 7 Dias
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-bold transition-colors"
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
              ↑ Evolução gradual
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
              {Math.round((totalPraticas / filteredData.length) * 100)}% de conclusão
            </span>
          </div>
        </div>

        {/* Gráfico Principal */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: 0, marginBottom: '20px', color: '#334155' }}>
            Evolução Combinada: Humor vs Consistência
          </h2>

          <div style={{ width: '100%', height: '380px' }}>
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
                            Humor: <strong>{data.humor} / 10</strong>
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
          </div>
        </div>

      </div>
    </div>
  );
}
