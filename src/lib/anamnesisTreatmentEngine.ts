/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnamnesisData, UserProfile } from '../types';
import { THERAPEUTIC_DISCLAIMER } from './anamnesisResponse';

export interface TreatmentRecommendation {
  category: 'saude_fisica' | 'prosperidade' | 'liberacao_emocional' | 'relacionamentos' | 'limpeza_espiritual' | 'outro';
  categoryLabel: string;
  treatmentTitle: string;
  recommendedDurationDays: 7 | 21;
  recommendedFrequency: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena';
  frequencyLabel: string;
  primaryChakraFocus: string;
  chakraColor: string;
  severityLevel: 'moderado' | 'alto' | 'urgente';
  summaryDiagnosis: string;
  therapeuticRationale: string;
  keyPainsDetected: string[];
  recommendedPlanType: 'tratamento_individual_21d' | 'tratamento_individual_7d' | 'plano_trimestral' | 'plano_anual';
  planName: string;
  planPriceFormatted: string;
  prescribedReikis: {
    name: string;
    focus: string;
    description: string;
    badge: string;
  }[];
  complementaryPractices: {
    title: string;
    description: string;
    badge: string;
  }[];
  customDecree: string;
  whatsappMessage: string;
  whatsappUrl: string;
  recommendedFloral?: string;
  recommendedAromatherapy?: string;
  therapeuticDisclaimer: string;
}

export function evaluateBestTreatmentFromAnamnesis(
  anamnesis: AnamnesisData,
  userProfile?: UserProfile
): TreatmentRecommendation {
  const complaints = anamnesis.mainComplaints || [];
  const emotional = anamnesis.emotionalState || [];
  const physical = anamnesis.physicalSymptoms || [];
  const chakras = anamnesis.chakraImbalance || [];
  const stress = anamnesis.stressLevel || 5;
  const sleep = anamnesis.sleepQuality || 'regular';
  const userName = userProfile?.fullName || userProfile?.name || 'Consulente';

  // Calculate score by category
  let emotionalScore = 0;
  let physicalScore = 0;
  let prosperityScore = 0;
  let spiritualScore = 0;
  let relationshipScore = 0;
  let fearGuiltScore = 0;

  // Fear, Insecurity & Guilt specific evaluation (396Hz)
  if (complaints.includes('inseguranca_medo')) fearGuiltScore += 5;
  if (emotional.includes('Sentimento de culpa')) fearGuiltScore += 4;
  if (emotional.includes('Medo constante')) fearGuiltScore += 4;
  if (chakras.includes('basico')) fearGuiltScore += 3;

  // Emotional analysis
  if (complaints.includes('ansiedade')) emotionalScore += 4;
  if (complaints.includes('sobrecarga_estresse')) emotionalScore += 3;
  if (emotional.includes('Angústia no peito') || emotional.includes('Autocobrança excessiva')) emotionalScore += 3;
  if (stress >= 8) emotionalScore += 3;

  // Physical & Burnout analysis
  if (complaints.includes('dores_fisicas')) physicalScore += 4;
  if (complaints.includes('esgotamento')) physicalScore += 4;
  if (complaints.includes('insonia') || sleep === 'pessimo' || sleep === 'ruim') physicalScore += 3;
  if (physical.length >= 3) physicalScore += 3;

  // Prosperity & Finances analysis
  if (complaints.includes('bloqueio_prosperidade')) prosperityScore += 5;
  if (chakras.includes('basico') || chakras.includes('plexo')) prosperityScore += 2;
  if (anamnesis.primaryGoal.toLowerCase().includes('financeiro') || anamnesis.primaryGoal.toLowerCase().includes('prosperidade')) prosperityScore += 4;

  // Relationships & Past Hurts analysis
  if (complaints.includes('magoas_passado')) relationshipScore += 5;
  if (emotional.includes('Sensação de solidão')) relationshipScore += 3;
  if (chakras.includes('cardiaco') || chakras.includes('sacral')) relationshipScore += 2;

  // Spiritual / Existential analysis
  if (complaints.includes('vazio_existencial')) spiritualScore += 4;
  if (chakras.includes('coronario') || chakras.includes('frontal')) spiritualScore += 3;
  if (stress >= 7) spiritualScore += 1;

  // Determine winning category & frequency
  let category: TreatmentRecommendation['category'] = 'liberacao_emocional';
  let categoryLabel = 'Liberação Emocional & Ansiedade';
  let treatmentTitle = 'Tratamento de 21 Dias de Liberação Emocional & Paz Profunda';
  let recommendedFrequency: TreatmentRecommendation['recommendedFrequency'] = '528hz';
  let frequencyLabel = '528 Hz • Frequência do Milagre e Regeneração Cardíaca';
  let primaryChakraFocus = 'Cardíaco & Plexo Solar';
  let chakraColor = 'emerald';
  let recommendedDurationDays: 7 | 21 = 21;
  let summaryDiagnosis = 'Sobrecarga no campo emocional com retenção de estresse e necessidade de alinhamento neuroquântico.';
  let therapeuticRationale = 'O sistema nervoso e o campo cardíaco encontram-se em hipervigilância. A atuação diária com 528Hz aliada à reprogramação subconsciente de 21 dias dissolverá as couraças musculares e restabelecerá o eixo de serenidade inabalável.';

  const maxScore = Math.max(emotionalScore, physicalScore, prosperityScore, relationshipScore, spiritualScore, fearGuiltScore);

  if (maxScore === fearGuiltScore && fearGuiltScore > 0) {
    category = 'liberacao_emocional';
    categoryLabel = 'Libertação de Medos, Culpas & Ancoramento';
    treatmentTitle = 'Tratamento de 21 Dias de Libertação de Medo, Culpa & Segurança Interior';
    recommendedFrequency = '396hz';
    frequencyLabel = '396 Hz • Libertação de Medos, Culpas e Fortalecimento do Chakra Raiz';
    primaryChakraFocus = 'Chakra Básico (Muladhara) & Sacral';
    chakraColor = 'rose';
    summaryDiagnosis = 'Padrão subconsciente de hipervigilância, culpas arraigadas e sensação de vulnerabilidade ou insegurança.';
    therapeuticRationale = 'A frequência Solfeggio de 396Hz dissipa bloqueios ocultos de medo e culpa enraizados no chakra básico, ancorando você com estabilidade, confiança na vida e proteção profunda.';
  } else if (maxScore === physicalScore && physicalScore > 0) {
    category = 'saude_fisica';
    categoryLabel = 'Saúde Física, Vitalidade & Alívio de Dores';
    treatmentTitle = 'Tratamento de 21 Dias de Regeneração Celular & Vitalidade Orgânica';
    recommendedFrequency = '432hz';
    frequencyLabel = '432 Hz • Frequência Natural da Terra & Cura Biológica';
    primaryChakraFocus = 'Básico (Raiz) & Sacral';
    chakraColor = 'amber';
    summaryDiagnosis = 'Esgotamento somatizado no corpo físico com dores musculares e padrão de sono comprometido.';
    therapeuticRationale = 'As tensões acumuladas bloquearam o fluxo do prana nos meridianos físicos. A ressonância harmônica em 432Hz ancora as energias vitais na Terra, desinflamando tecidos e permitindo um sono restaurador.';
  } else if (maxScore === prosperityScore && prosperityScore > 0) {
    category = 'prosperidade';
    categoryLabel = 'Prosperidade, Destrave Financeiro & Abundância';
    treatmentTitle = 'Tratamento de 21 Dias de Destrave Financeiro & Consciência de Prosperidade';
    recommendedFrequency = '852hz';
    frequencyLabel = '852 Hz • Despertar da Intuição Superior & Magnetismo de Abundância';
    primaryChakraFocus = 'Plexo Solar & Básico';
    chakraColor = 'yellow';
    summaryDiagnosis = 'Bloqueio de merecimento e lealdade sistêmica a padrões de escassez ou esforço excessivo.';
    therapeuticRationale = 'A prosperidade é um fluxo que depende do assentimento à vida e da liberação de culpas inconscientes. Através deste tratamento específico de 21 dias, alinhamos seu campo magnético para atração de oportunidades e dissolução de travas financeiras.';
  } else if (maxScore === relationshipScore && relationshipScore > 0) {
    category = 'relacionamentos';
    categoryLabel = 'Cura dos Relacionamentos & Liberação de Mágoas';
    treatmentTitle = 'Tratamento de 21 Dias de Reconciliação Sistêmica & Cura do Cardíaco';
    recommendedFrequency = '639hz';
    frequencyLabel = '639 Hz • Harmonização de Conexões, Vínculos e Perdão Profundo';
    primaryChakraFocus = 'Cardíaco & Laríngeo';
    chakraColor = 'teal';
    summaryDiagnosis = 'Vínculos com mágoas pendentes, dificuldade em soltar o passado e fechar ciclos sistêmicos.';
    therapeuticRationale = 'Aplicando as Ordens do Amor de Bert Hellinger e a frequência 639Hz, curamos as rupturas do afeto, honramos os antepassados e libertamos você para se relacionar a partir da leveza e do amor maduro.';
  } else if (maxScore === spiritualScore && spiritualScore > 0) {
    category = 'limpeza_espiritual';
    categoryLabel = 'Limpeza Espiritual, Blindagem Áurica & Pineal';
    treatmentTitle = 'Tratamento de 21 Dias de Desobsessão, Blindagem & Conexão Divina';
    recommendedFrequency = '963hz';
    frequencyLabel = '963 Hz • Frequência de Deus & Ativação da Glândula Pineal';
    primaryChakraFocus = 'Coronário & Frontal';
    chakraColor = 'purple';
    summaryDiagnosis = 'Sensibilidade áurica aguçada com perda de energia vital por cordões energéticos e porosidade sutil.';
    therapeuticRationale = 'Este protocolo atua na selagem do duplo etérico, corte de amarras do passado e consagração do seu templo sob a proteção do Arcanjo Miguel e da Chama Violeta de Saint Germain.';
  }

  let recommendedFloral = 'Rescue Remedy (Para alívio imediato, ansiedade e equilíbrio emocional)';
  let recommendedAromatherapy = 'Óleo Essencial de Lavanda (Calmante, reduz estresse e melhora o sono)';

  // Diretrizes de Receituário Integrativo
  if (category === 'saude_fisica' || complaints.includes('cansaco_extremo') || complaints.includes('baixa_imunidade') || complaints.includes('dores_corpo')) {
    // Esgotamento/Burnout/Exaustão
    recommendedFloral = 'Olive (Recuperação de energia vital)';
    recommendedAromatherapy = 'Óleo Essencial de Alecrim (Foco e revigorante)';
  } else if (category === 'liberacao_emocional' && (emotional.includes('Angústia no peito') || emotional.includes('Apatia e falta de vontade'))) {
    // Tristeza Profunda/Depressão/Abandono
    recommendedFloral = 'Mustard ou Willow (Acolhimento da alma)';
    recommendedAromatherapy = 'Óleo Essencial de Bergamota (Elevação do humor)';
  } else if (category === 'relacionamentos' || complaints.includes('oscilacoes_humor') || emotional.includes('Irritação constante')) {
    // Instabilidade/Bipolaridade/Borderline
    recommendedFloral = 'Scleranthus (Equilíbrio e oscilações)';
    recommendedAromatherapy = 'Óleo Essencial de Gerânio (Estabilidade emocional)';
  } else if (category === 'liberacao_emocional' || complaints.includes('ansiedade_crise') || emotional.includes('Mente acelerada (não desliga)')) {
    // Ansiedade/Agitação/TDAH
    recommendedFloral = 'Impatiens (Paciência)';
    recommendedAromatherapy = 'Óleo Essencial de Lavanda (Calmante do sistema nervoso)';
  } else if (category === 'prosperidade') {
    recommendedFloral = 'Larch (Para autoconfiança e capacidade de realização)';
    recommendedAromatherapy = 'Óleo Essencial de Canela ou Bergamota (Atração de prosperidade e abundância)';
  } else if (category === 'limpeza_espiritual') {
    recommendedFloral = 'Walnut (Proteção contra influências externas e quebra de laços do passado)';
    recommendedAromatherapy = 'Óleo Essencial de Olíbano (Conexão espiritual profunda e proteção áurica)';
  }

  // Prescribed Reikis based on clinical analysis
  const prescribedReikis: TreatmentRecommendation['prescribedReikis'] = [];

  // Always include foundational Usui for general harmony
  prescribedReikis.push({
    name: 'Reiki Usui Tradicional',
    focus: 'Harmonização Bioenergética Integral',
    description: 'Canalização dos símbolos sagrados (Cho Ku Rei, Sei He Ki, Hon Sha Ze Sho Nen) para equilíbrio dos 7 chakras e relaxamento do sistema nervoso.',
    badge: 'Base de Cura'
  });

  // Category-specific Reikis
  if (category === 'saude_fisica' || fearGuiltScore > 0 || chakras.includes('basico')) {
    prescribedReikis.push({
      name: 'Reiki Kundalini',
      focus: 'Despertar da Força Vital & Aterramento',
      description: 'Ativação do canal principal Sushumna, desbloqueio da energia telúrica da Terra e vitalidade física duradoura.',
      badge: 'Força & Vitalidade'
    });
  }

  if (category === 'relacionamentos' || emotionalScore > 0 || emotional.includes('Angústia no peito')) {
    prescribedReikis.push({
      name: 'Reiki Chama Rosa Vibrante',
      focus: 'Cura do Cardíaco & Autoamor',
      description: 'Emissão da frequência do Raio Rosa do Amor Incondicional para acolhimento da criança interior, dissolução de mágoas e autoaceitação.',
      badge: 'Coração & Afeto'
    });
  }

  if (category === 'limpeza_espiritual' || stress >= 8 || complaints.includes('vazio_existencial')) {
    prescribedReikis.push({
      name: 'Violet Flame (Chama Violeta)',
      focus: 'Transmutação Cármica & Blindagem',
      description: 'Frequência do Mestre Saint Germain para transmutar energias densas, cortar cordões energéticos nocivos e purificar o duplo etérico.',
      badge: 'Transmutação Sagrada'
    });
  }

  if (complaints.includes('magoas_passado') || emotional.includes('Sentimento de culpa') || category === 'prosperidade') {
    prescribedReikis.push({
      name: 'Reiki Karuna Ki',
      focus: 'Compaixão Profunda & Cura Celular de Traumas',
      description: 'Trabalho de cura espiritual de memórias ancestrais, cura do Eu Sombra e liberação de votos de escassez e sofrimento.',
      badge: 'Compaixão & Karma'
    });
  }

  // Severity Level
  let severityLevel: TreatmentRecommendation['severityLevel'] = 'moderado';
  if (stress >= 8 || sleep === 'pessimo' || complaints.length >= 4) {
    severityLevel = 'urgente';
  } else if (stress >= 6 || complaints.length >= 2) {
    severityLevel = 'alto';
  }

  // Recommended Plan & Commercial Suggestion
  let recommendedPlanType: TreatmentRecommendation['recommendedPlanType'] = 'tratamento_individual_21d';
  let planName = 'Tratamento Individual Personalizado de 21 Dias';
  let planPriceFormatted = 'R$ 59,90';

  if (severityLevel === 'urgente' || complaints.length >= 4) {
    recommendedPlanType = 'plano_trimestral';
    planName = 'Acompanhamento Trimestral Completo (3 Meses)';
    planPriceFormatted = 'R$ 180,00';
  }

  // Complementary Practices
  const complementaryPractices = [
    {
      title: 'Oração de 21 Dias de São Miguel Arcanjo',
      description: 'Blindagem do campo áurico e corte de cordões energéticos todas as manhãs ou antes de dormir.',
      badge: 'Proteção & Limpeza'
    },
    {
      title: 'Banhos Sagrados de Ervas (Boldo, Alecrim ou Manjericão)',
      description: 'Regra de Ouro: Somente o banho de Boldo pode ser tomado da cabeça aos pés. Todos os outros banhos de ervas devem ser tomados ESTRITAMENTE do pescoço para baixo.',
      badge: 'Ervas & Purificação'
    },
    {
      title: 'Prática de Ho\'oponopono Quântico',
      description: 'Repetição consciente das 4 frases de cura focando no perdão do passado e autocompaixão.',
      badge: 'Transmutação'
    },
    {
      title: `Ressonância Solfeggio em ${recommendedFrequency.toUpperCase()}`,
      description: `Meditação diária com frequências Solfeggio alinhadas a ${recommendedFrequency.toUpperCase()} durante o ciclo.`,
      badge: 'Frequência Específica'
    },
    {
      title: 'Hidratação Solarizada & Aterramento',
      description: 'Caminhar descalço por 5 minutos e beber água com intenção de cura celular.',
      badge: 'Corpo Físico'
    }
  ];

  // Custom Decree
  const customDecree = `Eu, ${userName}, assumo o comando do meu campo vibracional. Aceito a cura de ${categoryLabel.toLowerCase()} e autorizo que todas as memórias de dor sejam transmutadas em pura Luz, Saúde e Prosperidade.`;

  // WhatsApp Message
  const waMsgText = `Olá Éverton, acabei de preencher minha Anamnese no app Protocolo de Cura Integrada!\n\n` +
    `👤 *Consulente:* ${userName}\n` +
    `🎯 *Queixas Principais:* ${complaints.map(c => c.replace('_', ' ')).join(', ')}\n` +
    `⚡ *Nível de Estresse:* ${stress}/10 | *Sono:* ${sleep}\n` +
    `🔮 *Diagnóstico do App:* ${summaryDiagnosis}\n` +
    `💎 *Tratamento Sugerido:* ${treatmentTitle} (${recommendedFrequency.toUpperCase()})\n` +
    `✨ *Reikis Prescritos:* ${prescribedReikis.map(r => r.name).join(', ')}\n\n` +
    `Gostaria de tirar dúvidas e dar início ao meu tratamento personalizado!\n\n` +
    `---\n` +
    `_${THERAPEUTIC_DISCLAIMER}_`;

  const waEncoded = encodeURIComponent(waMsgText);
  const whatsappUrl = `https://wa.me/5551982215296?text=${waEncoded}`;

  return {
    category,
    categoryLabel,
    treatmentTitle,
    recommendedDurationDays,
    recommendedFrequency,
    frequencyLabel,
    primaryChakraFocus,
    chakraColor,
    severityLevel,
    summaryDiagnosis,
    therapeuticRationale,
    keyPainsDetected: complaints.map(c => c.replace('_', ' ')),
    recommendedPlanType,
    planName,
    planPriceFormatted,
    prescribedReikis,
    complementaryPractices,
    customDecree,
    recommendedFloral,
    recommendedAromatherapy,
    therapeuticDisclaimer: THERAPEUTIC_DISCLAIMER,
    whatsappMessage: waMsgText,
    whatsappUrl
  };
}
