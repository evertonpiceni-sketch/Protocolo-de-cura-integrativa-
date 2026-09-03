export const THERAPEUTIC_DISCLAIMER = "Nota Terapêutica: O Protocolo de Cura Integrada e as sugestões de Florais de Bach e Óleos Essenciais atuam como práticas integrativas e tratamentos complementares. Eles não substituem, sob nenhuma hipótese, o diagnóstico, tratamento ou acompanhamento médico, psiquiátrico ou psicológico tradicional. Mantenha seus tratamentos de saúde ativos.";

export const PAYWALL_MESSAGE = "Para liberar a sua receita personalizada de Florais e Aromaterapia que vai atuar diretamente na raiz desse sintoma, além de destravar os 21 dias do protocolo com todas as frequências do Karuna Ki e Imara Reiki, faça o upgrade para a jornada completa na tela inicial.";

export interface AnamnesisRequest {
  nome: string;
  queixas_principais: string[];
  relato_livre: string;
  nivel_estresse: number;
  qualidade_sono: string;
  sintomas_fisicos: string[];
  estados_emocionais: string[];
  chakras_desalinhados: string[];
  usuario_premium: boolean;
}

export interface AnamnesisResponse {
  paciente_nome: string;
  padrao_emocional_detectado: string;
  ciclo_recomendado: string;
  justificativa_terapeutica: string;
  receita_integrativa: {
    floral_bach: string;
    floral_instrucao: string;
    aromaterapia_oleo: string;
    aromaterapia_instrucao: string;
  };
  matriz_vibracional_audio: Array<{
    tempo: string;
    simbolo: string;
    acao_sutil: string;
  }>;
  nota_terapeutica_disclaimer: string;
  status_servidor: "purificado_chama_violeta";
}

const MAX_SHORT_TEXT = 200;
const MAX_REPORT_TEXT = 5_000;
const MAX_LIST_ITEMS = 30;

function cleanText(value: unknown, fallback = "", maxLength = MAX_SHORT_TEXT): string {
  if (typeof value !== "string" && typeof value !== "number") return fallback;
  const text = String(value).replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  return text.slice(0, maxLength) || fallback;
}

function cleanList(value: unknown): string[] {
  const source = Array.isArray(value) ? value : value == null ? [] : [value];
  return source
    .slice(0, MAX_LIST_ITEMS)
    .map((item) => cleanText(item))
    .filter(Boolean);
}

export function parseAnamnesisRequest(value: unknown): AnamnesisRequest {
  const body = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const rawStress = Number(body.nivel_estresse);

  return {
    nome: cleanText(body.nome, "Consulente"),
    queixas_principais: cleanList(body.queixas_principais),
    relato_livre: cleanText(body.relato_livre, "", MAX_REPORT_TEXT),
    nivel_estresse: Number.isFinite(rawStress) ? Math.min(10, Math.max(0, rawStress)) : 7,
    qualidade_sono: cleanText(body.qualidade_sono, "regular"),
    sintomas_fisicos: cleanList(body.sintomas_fisicos),
    estados_emocionais: cleanList(body.estados_emocionais),
    chakras_desalinhados: cleanList(body.chakras_desalinhados),
    usuario_premium: body.usuario_premium === true || body.usuario_premium === "true",
  };
}

function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const SEVEN_DAY_MATRIX: AnamnesisResponse["matriz_vibracional_audio"] = [
  { tempo: "00:00 - 01:30", simbolo: "Hon-Sha-Ze-Sho-Nen", acao_sutil: "Abertura do Portal Assíncrono" },
  { tempo: "01:30 - 03:30", simbolo: "Sei-He-Ki + Cho-Ku-Rei", acao_sutil: "Benzi Reiki e Aterramento" },
  { tempo: "03:30 - 05:30", simbolo: "Cho-Ku-Rei", acao_sutil: "Reiki Usui, Kundalini e Sistema Nervoso" },
  { tempo: "05:30 - 08:30", simbolo: "Zonar + Halu (Karuna Ki)", acao_sutil: "Cirurgia Psíquica e Trauma" },
  { tempo: "08:30 - 11:00", simbolo: "Sei-He-Ki (Rosa)", acao_sutil: "Raio Rosa e Amor Incondicional" },
  { tempo: "11:00 - Fim", simbolo: "Cho-Ku-Rei de Ouro", acao_sutil: "Selamento com Ganesha" },
];

const TWENTY_ONE_DAY_MATRIX: AnamnesisResponse["matriz_vibracional_audio"] = [
  { tempo: "00:00 - 02:00", simbolo: "Hon-Sha-Ze-Sho-Nen", acao_sutil: "Abertura do Portal" },
  { tempo: "02:00 - 05:00", simbolo: "Sei-He-Ki + Cho-Ku-Rei", acao_sutil: "Benzi Reiki e Aterramento" },
  { tempo: "05:00 - 08:30", simbolo: "Cho-Ku-Rei", acao_sutil: "Reiki Usui, Kundalini e Sistema Nervoso" },
  { tempo: "08:30 - 14:00", simbolo: "Zonar + Halu (Karuna Ki)", acao_sutil: "Sustentação Ampliada para Traumas e TEPT" },
  { tempo: "14:00 - 18:30", simbolo: "Sei-He-Ki (Rosa)", acao_sutil: "Raio Rosa e Amor Incondicional" },
  { tempo: "18:30 - Fim", simbolo: "Cho-Ku-Rei de Ouro", acao_sutil: "Selamento com Ganesha" },
];

export function createDeterministicAnamnesisResponse(input: AnamnesisRequest): AnamnesisResponse {
  const allText = normalizeText([
    ...input.queixas_principais,
    ...input.estados_emocionais,
    ...input.sintomas_fisicos,
    input.relato_livre,
  ].join(" "));
  const hasAny = (terms: string[]) => terms.some((term) => allText.includes(normalizeText(term)));

  let padrao = "Ansiedade / Agitação Mental e Sobrecarga do Sistema Nervoso";
  let floral = "Impatiens (Paciência)";
  let floralInstrucao = "Tomar 4 gotas sublinguais 4 vezes ao dia para desacelerar o ritmo interno e restaurar a paciência mental.";
  let aroma = "Óleo Essencial de Lavanda (Calmante do sistema nervoso)";
  let aromaInstrucao = "Inalar 2 gotas na palma das mãos em concha ou usar 4 gotas no difusor ultrassônico antes de deitar.";
  let ciclo = "Trilha 2: Ciclo de Ressignificação (21 Dias) - 432Hz";
  let justificativa = "Identificamos uma sobrecarga nos centros superiores com necessidade de aterramento e pacificação do sistema nervoso simpático.";

  if (hasAny(["bipolar", "borderline", "oscilacao", "oscilacoes", "instabilidade emocional"])) {
    padrao = "Instabilidade Emocional e Oscilação de Humor";
    floral = "Scleranthus (Equilíbrio e oscilações)";
    floralInstrucao = "Tomar 4 gotas sublinguais 4 vezes ao dia para ancorar a estabilidade entre os polos emocionais.";
    aroma = "Óleo Essencial de Gerânio (Estabilidade emocional)";
    aromaInstrucao = "Massagear 1 gota diluída em óleo vegetal sobre o chakra cardíaco para sustentação afetiva e centramento.";
    justificativa = "Foco em equilíbrio dos hemisférios cerebrais, drenagem do excesso de impulsividade e blindagem com a luz azul-safira.";
  } else if (hasAny(["esgotamento", "burnout", "cansaco", "exaustao", "fadiga", "sem energia"]) || input.nivel_estresse >= 9) {
    padrao = "Esgotamento Extremo, Fadiga Biológica e Burnout";
    floral = "Olive (Recuperação de energia vital)";
    floralInstrucao = "Tomar 4 gotas sublinguais 4 vezes ao dia para restaurar o tônus vital e o ânimo do corpo físico.";
    aroma = "Óleo Essencial de Alecrim (Foco e revigorante)";
    aromaInstrucao = "Pingar 1 gota no colar aromático pela manhã ou inalar para clareza mental e ativação do chakra frontal.";
    ciclo = "Trilha 1: Ciclo Emergencial (7 Dias) - 528Hz";
    justificativa = "O campo bioenergético apresenta queima de reservas vitais. A frequência emergencial de 528Hz atua na reestruturação celular imediata.";
  } else if (hasAny(["tristeza", "depressao", "abandono", "magoa", "vazio"])) {
    padrao = "Tristeza Profunda, Memórias Celulares de Dor e Bloqueio Cardíaco";
    floral = "Mustard ou Willow (Acolhimento da alma)";
    floralInstrucao = "Tomar 4 gotas sublinguais 4 vezes ao dia para dissipar a névoa escura e acolher a alma.";
    aroma = "Óleo Essencial de Bergamota (Elevação do humor)";
    aromaInstrucao = "Inalar pela manhã para dissolver a amargura e estimular a produção sutil de alegria e ânimo.";
    justificativa = "Tratamento voltado à transmutação de memórias profundas na camada inconsciente, restaurando a autoaceitação e o amor no Raio Rosa.";
  }

  const receitaIntegrativa = input.usuario_premium ? {
    floral_bach: floral,
    floral_instrucao: floralInstrucao,
    aromaterapia_oleo: aroma,
    aromaterapia_instrucao: aromaInstrucao,
  } : {
    floral_bach: "🔒 Bloqueado (Disponível no Plano Completo)",
    floral_instrucao: PAYWALL_MESSAGE,
    aromaterapia_oleo: "🔒 Bloqueado (Disponível no Plano Completo)",
    aromaterapia_instrucao: PAYWALL_MESSAGE,
  };

  return {
    paciente_nome: input.nome,
    padrao_emocional_detectado: padrao,
    ciclo_recomendado: ciclo,
    justificativa_terapeutica: justificativa,
    receita_integrativa: receitaIntegrativa,
    matriz_vibracional_audio: ciclo.includes("7 Dias") ? SEVEN_DAY_MATRIX : TWENTY_ONE_DAY_MATRIX,
    nota_terapeutica_disclaimer: THERAPEUTIC_DISCLAIMER,
    status_servidor: "purificado_chama_violeta",
  };
}

/**
 * Keeps AI-generated narrative fields while enforcing all business and safety fields
 * from the deterministic response. Invalid provider payloads are rejected.
 */
export function mergeGeneratedAnamnesisResponse(
  generated: unknown,
  canonical: AnamnesisResponse,
): AnamnesisResponse {
  if (!generated || typeof generated !== "object" || Array.isArray(generated)) {
    throw new Error("Resposta estruturada do Gemini inválida.");
  }

  const payload = generated as Record<string, unknown>;
  if (typeof payload.padrao_emocional_detectado !== "string" || !payload.padrao_emocional_detectado.trim()
    || typeof payload.justificativa_terapeutica !== "string" || !payload.justificativa_terapeutica.trim()) {
    throw new Error("Resposta estruturada do Gemini incompleta.");
  }
  const pattern = cleanText(payload.padrao_emocional_detectado, canonical.padrao_emocional_detectado, 500);
  const rationale = cleanText(payload.justificativa_terapeutica, canonical.justificativa_terapeutica, 2_000);

  return {
    ...canonical,
    padrao_emocional_detectado: pattern,
    justificativa_terapeutica: rationale,
  };
}
