/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnamnesisData, UserProfile } from '../types';

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
  let categoryLabel = 'Acolhimento Emocional & Serenidade';
  let treatmentTitle = 'Jornada de 21 Dias de Acolhimento Emocional & Paz';
  let recommendedFrequency: TreatmentRecommendation['recommendedFrequency'] = '528hz';
  let frequencyLabel = '528 Hz • Prática sonora para presença e equilíbrio simbólico';
  let primaryChakraFocus = 'Cardíaco & Plexo Solar';
  let chakraColor = 'emerald';
  let recommendedDurationDays: 7 | 21 = 21;
  let summaryDiagnosis = 'O que você compartilhou aponta para um momento de sobrecarga emocional e necessidade de mais espaço, descanso e acolhimento.';
  let therapeuticRationale = 'A proposta é criar uma rotina breve de respiração, presença e escuta interna, usando a frequência sonora como apoio simbólico para desacelerar e observar o momento com mais gentileza.';

  const maxScore = Math.max(emotionalScore, physicalScore, prosperityScore, relationshipScore, spiritualScore, fearGuiltScore);

  if (maxScore === fearGuiltScore && fearGuiltScore > 0) {
    category = 'liberacao_emocional';
    categoryLabel = 'Medos, Culpa & Aterramento';
    treatmentTitle = 'Jornada de 21 Dias para Segurança Interior & Aterramento';
    recommendedFrequency = '396hz';
    frequencyLabel = '396 Hz • Prática sonora associada a aterramento e segurança interior';
    primaryChakraFocus = 'Chakra Básico (Muladhara) & Sacral';
    chakraColor = 'rose';
    summaryDiagnosis = 'Seu relato reúne medo, culpa ou insegurança que podem estar ocupando bastante espaço neste momento.';
    therapeuticRationale = 'Dentro da tradição usada no projeto, 396 Hz e práticas de aterramento são associados simbolicamente a segurança, presença e liberação de pesos emocionais. A proposta é usá-los como apoio contemplativo.';
  } else if (maxScore === physicalScore && physicalScore > 0) {
    category = 'saude_fisica';
    categoryLabel = 'Corpo, Descanso & Vitalidade';
    treatmentTitle = 'Jornada de 21 Dias de Presença Corporal & Vitalidade';
    recommendedFrequency = '432hz';
    frequencyLabel = '432 Hz • Prática sonora associada a aterramento e relaxamento';
    primaryChakraFocus = 'Básico (Raiz) & Sacral';
    chakraColor = 'amber';
    summaryDiagnosis = 'Seu relato sugere cansaço, desconfortos corporais ou sono pouco restaurador, pedindo mais atenção ao descanso e aos limites do corpo.';
    therapeuticRationale = 'A proposta combina percepção corporal, respiração e uma referência sonora de 432 Hz como apoio simbólico ao relaxamento, sem substituir avaliação ou cuidado profissional quando houver dor ou sintomas persistentes.';
  } else if (maxScore === prosperityScore && prosperityScore > 0) {
    category = 'prosperidade';
    categoryLabel = 'Prosperidade, Autoconfiança & Possibilidades';
    treatmentTitle = 'Jornada de 21 Dias de Autoconfiança & Relação com a Prosperidade';
    recommendedFrequency = '852hz';
    frequencyLabel = '852 Hz • Prática sonora associada a reflexão, intuição e propósito';
    primaryChakraFocus = 'Plexo Solar & Básico';
    chakraColor = 'yellow';
    summaryDiagnosis = 'Seu relato aponta para temas de merecimento, esforço, segurança material ou relação com possibilidades de crescimento.';
    therapeuticRationale = 'A proposta é observar crenças, escolhas e padrões relacionados a merecimento e segurança material, usando práticas simbólicas como apoio à clareza e à ação consciente — sem prometer resultados financeiros.';
  } else if (maxScore === relationshipScore && relationshipScore > 0) {
    category = 'relacionamentos';
    categoryLabel = 'Relacionamentos, Limites & Liberação de Mágoas';
    treatmentTitle = 'Jornada de 21 Dias de Reconciliação Interior & Relações';
    recommendedFrequency = '639hz';
    frequencyLabel = '639 Hz • Prática sonora associada a vínculos, diálogo e reconciliação';
    primaryChakraFocus = 'Cardíaco & Laríngeo';
    chakraColor = 'teal';
    summaryDiagnosis = 'Seu relato traz vínculos, mágoas ou ciclos passados que ainda parecem pedir elaboração e espaço interno.';
    therapeuticRationale = 'A proposta usa reflexões sistêmicas e 639 Hz como referências simbólicas para observar vínculos, limites, pertencimento e possibilidades de se relacionar com mais consciência.';
  } else if (maxScore === spiritualScore && spiritualScore > 0) {
    category = 'limpeza_espiritual';
    categoryLabel = 'Proteção Simbólica, Espiritualidade & Centramento';
    treatmentTitle = 'Jornada de 21 Dias de Proteção Simbólica & Conexão Espiritual';
    recommendedFrequency = '963hz';
    frequencyLabel = '963 Hz • Prática sonora associada a silêncio, contemplação e espiritualidade';
    primaryChakraFocus = 'Coronário & Frontal';
    chakraColor = 'purple';
    summaryDiagnosis = 'Seu relato sugere sensibilidade, cansaço ou necessidade de recolhimento e proteção simbólica no campo espiritual.';
    therapeuticRationale = 'A proposta utiliza imagens de proteção, São Miguel e Chama Violeta dentro de sua linguagem espiritual tradicional, como recursos simbólicos de centramento, intenção e encerramento de ciclos.';
  }

  let recommendedFloral = 'Rescue Remedy (referência tradicional para momentos de tensão emocional)';
  let recommendedAromatherapy = 'Óleo Essencial de Lavanda (aroma tradicionalmente associado a relaxamento e conforto)';

  // Diretrizes de Receituário Integrativo
  if (category === 'saude_fisica' || complaints.includes('cansaco_extremo') || complaints.includes('baixa_imunidade') || complaints.includes('dores_corpo')) {
    // Esgotamento/Burnout/Exaustão
    recommendedFloral = 'Olive (referência floral tradicional associada a cansaço e recomposição subjetiva)';
    recommendedAromatherapy = 'Óleo Essencial de Alecrim (aroma tradicionalmente associado a disposição e foco)';
  } else if (category === 'liberacao_emocional' && (emotional.includes('Angústia no peito') || emotional.includes('Apatia e falta de vontade'))) {
    // Tristeza Profunda/Depressão/Abandono
    recommendedFloral = 'Mustard ou Willow (referências florais tradicionalmente associadas a acolhimento emocional)';
    recommendedAromatherapy = 'Óleo Essencial de Bergamota (aroma tradicionalmente associado a leveza e bem-estar)';
  } else if (category === 'relacionamentos' || complaints.includes('oscilacoes_humor') || emotional.includes('Irritação constante')) {
    // Instabilidade/Bipolaridade/Borderline
    recommendedFloral = 'Scleranthus (referência floral tradicional associada a indecisão e busca de equilíbrio)';
    recommendedAromatherapy = 'Óleo Essencial de Gerânio (aroma tradicionalmente associado a conforto e equilíbrio subjetivo)';
  } else if (category === 'liberacao_emocional' || complaints.includes('ansiedade_crise') || emotional.includes('Mente acelerada (não desliga)')) {
    // Ansiedade/Agitação/TDAH
    recommendedFloral = 'Impatiens (referência floral tradicional associada a paciência e desaceleração)';
    recommendedAromatherapy = 'Óleo Essencial de Lavanda (aroma tradicionalmente associado a relaxamento)';
  } else if (category === 'prosperidade') {
    recommendedFloral = 'Larch (referência floral tradicional associada a autoconfiança)';
    recommendedAromatherapy = 'Óleo Essencial de Canela ou Bergamota (aromas usados simbolicamente em práticas ligadas a prosperidade)';
  } else if (category === 'limpeza_espiritual') {
    recommendedFloral = 'Walnut (referência floral tradicional associada a transições e proteção simbólica)';
    recommendedAromatherapy = 'Óleo Essencial de Olíbano (aroma tradicionalmente associado a contemplação e espiritualidade)';
  }

  // Prescribed Reikis based on clinical analysis
  const prescribedReikis: TreatmentRecommendation['prescribedReikis'] = [];

  // Always include foundational Usui for general harmony
  prescribedReikis.push({
    name: 'Reiki Usui Tradicional',
    focus: 'Harmonização Bioenergética Integral',
    description: 'Uso dos símbolos tradicionais Cho Ku Rei, Sei He Ki e Hon Sha Ze Sho Nen como apoio simbólico a presença, harmonização e prática contemplativa.',
    badge: 'Base do Sistema'
  });

  // Category-specific Reikis
  if (category === 'saude_fisica' || fearGuiltScore > 0 || chakras.includes('basico')) {
    prescribedReikis.push({
      name: 'Reiki Kundalini',
      focus: 'Despertar da Força Vital & Aterramento',
      description: 'Prática voltada simbolicamente a aterramento, percepção do eixo corporal e contato com a ideia de força vital.',
      badge: 'Força & Vitalidade'
    });
  }

  if (category === 'relacionamentos' || emotionalScore > 0 || emotional.includes('Angústia no peito')) {
    prescribedReikis.push({
      name: 'Reiki Chama Rosa Vibrante',
      focus: 'Acolhimento do Cardíaco & Autoamor',
      description: 'Prática com a linguagem simbólica do Raio Rosa para acolhimento, autocompaixão, elaboração de mágoas e autoaceitação.',
      badge: 'Coração & Afeto'
    });
  }

  if (category === 'limpeza_espiritual' || stress >= 8 || complaints.includes('vazio_existencial')) {
    prescribedReikis.push({
      name: 'Violet Flame (Chama Violeta)',
      focus: 'Transmutação Cármica & Blindagem',
      description: 'Uso simbólico da Chama Violeta para representar transformação, encerramento de vínculos percebidos como pesados e proteção espiritual.',
      badge: 'Transmutação Sagrada'
    });
  }

  if (complaints.includes('magoas_passado') || emotional.includes('Sentimento de culpa') || category === 'prosperidade') {
    prescribedReikis.push({
      name: 'Reiki Karuna Ki',
      focus: 'Compaixão Profunda & Memórias Emocionais',
      description: 'Prática contemplativa voltada a compaixão, memórias ancestrais, integração da sombra e revisão simbólica de padrões de escassez ou sofrimento.',
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
      description: 'Prática espiritual de proteção simbólica e intenção, pela manhã ou antes de dormir.',
      badge: 'Proteção & Limpeza'
    },
    {
      title: 'Banhos Sagrados de Ervas (Boldo, Alecrim ou Manjericão)',
      description: 'Regra de Ouro: Somente o banho de Boldo pode ser tomado da cabeça aos pés. Todos os outros banhos de ervas devem ser tomados ESTRITAMENTE do pescoço para baixo.',
      badge: 'Ervas & Purificação'
    },
    {
      title: 'Prática de Ho\'oponopono Quântico',
      description: 'Repetição consciente das quatro frases tradicionais com foco em perdão, responsabilidade e autocompaixão.',
      badge: 'Transmutação'
    },
    {
      title: `Ressonância Solfeggio em ${recommendedFrequency.toUpperCase()}`,
      description: `Meditação diária com frequências Solfeggio alinhadas a ${recommendedFrequency.toUpperCase()} durante o ciclo.`,
      badge: 'Frequência Específica'
    },
    {
      title: 'Hidratação Solarizada & Aterramento',
      description: 'Caminhar descalço por alguns minutos, quando for seguro, e beber água como gesto simples de presença e cuidado.',
      badge: 'Corpo Físico'
    }
  ];

  // Custom Decree
  const customDecree = `Eu, ${userName}, escolho estar presente no meu caminho. Acolho o tema de ${categoryLabel.toLowerCase()} com gentileza e permito que antigas dores ocupem menos espaço enquanto cultivo clareza, cuidado e novas possibilidades.`;

  // WhatsApp Message
  const waMsgText = `Olá Éverton, acabei de preencher meu Mapa do Momento no app Protocolo da Transformação!\n\n` +
    `Consulente: ${userName}\n` +
    `Temas principais: ${complaints.map(c => c.replace('_', ' ')).join(', ')}\n` +
    `Estresse percebido: ${stress}/10 | Sono: ${sleep}\n` +
    `Leitura do momento: ${summaryDiagnosis}\n` +
    `Caminho sugerido: ${treatmentTitle} (${recommendedFrequency.toUpperCase()})\n` +
    `Sistemas energéticos sugeridos: ${prescribedReikis.map(r => r.name).join(', ')}\n\n` +
    `Gostaria de conversar sobre estas sugestões e entender quais práticas fazem sentido para mim.\n\n` +
    `---\n` +
    `Nota de cuidado: estas sugestões são práticas integrativas e de bem-estar. Não substituem diagnóstico, tratamento ou acompanhamento médico, psicológico ou psiquiátrico.`;

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
    whatsappMessage: waMsgText,
    whatsappUrl
  };
}
