import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { ElevenLabsClient } from "elevenlabs";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

let elevenlabsClientInstance: ElevenLabsClient | null = null;
let aiClientInstance: GoogleGenAI | null = null;

function getElevenLabs(): ElevenLabsClient | null {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "SUA_CHAVE_ELEVENLABS") {
    return null;
  }
  if (!elevenlabsClientInstance) {
    elevenlabsClientInstance = new ElevenLabsClient({ apiKey });
  }
  return elevenlabsClientInstance;
}

function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "SUA_CHAVE_GEMINI") {
    return null;
  }
  if (!aiClientInstance) {
    aiClientInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClientInstance;
}

// In-memory cache for audio buffers to avoid duplicate API calls
const audioCache = new Map<string, { buffer: Buffer; contentType: string }>();

/**
 * Injects therapeutic breathing pauses into meditation text
 */
function prepareTherapeuticSSML(text: string): string {
  let processed = text;

  // Substitute common meditation respiratory cues with breathing pauses
  processed = processed.replace(/Respire fundo\.\.\./gi, 'Respire fundo... <break time="2s"/>');
  processed = processed.replace(/Solte o ar devagar/gi, 'Solte o ar devagar <break time="2.5s"/>');
  processed = processed.replace(/solte devagar pela boca/gi, 'solte devagar pela boca <break time="2.5s"/>');
  processed = processed.replace(/Feche os olhos\.\.\./gi, 'Feche os olhos... <break time="1.5s"/>');
  processed = processed.replace(/Puxe o ar calmamente pelo nariz\.\.\./gi, 'Puxe o ar calmamente pelo nariz... <break time="2s"/>');
  processed = processed.replace(/Sinto muito\./gi, 'Sinto muito... <break time="1.5s"/>');
  processed = processed.replace(/Me perdoe\./gi, 'Me perdoe... <break time="1.5s"/>');
  processed = processed.replace(/Eu te amo\./gi, 'Eu te amo... <break time="1.5s"/>');
  processed = processed.replace(/Sou grato\./gi, 'Sou grato... <break time="2s"/>');
  processed = processed.replace(/Gratidão\./gi, 'Gratidão. <break time="2s"/>');

  return processed;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      elevenlabsConfigured: !!process.env.ELEVENLABS_API_KEY,
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // Anamnese Schema definition for Gemini Structured Outputs
  const anamneseResponseSchema = {
    type: Type.OBJECT,
    properties: {
      paciente_nome: { type: Type.STRING },
      padrao_emocional_detectado: { type: Type.STRING },
      ciclo_recomendado: { type: Type.STRING },
      justificativa_terapeutica: { type: Type.STRING },
      receita_integrativa: {
        type: Type.OBJECT,
        properties: {
          floral_bach: { type: Type.STRING },
          floral_instrucao: { type: Type.STRING },
          aromaterapia_oleo: { type: Type.STRING },
          aromaterapia_instrucao: { type: Type.STRING }
        },
        required: ["floral_bach", "floral_instrucao", "aromaterapia_oleo", "aromaterapia_instrucao"]
      },
      matriz_vibracional_audio: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            tempo: { type: Type.STRING },
            simbolo: { type: Type.STRING },
            acao_sutil: { type: Type.STRING }
          },
          required: ["tempo", "simbolo", "acao_sutil"]
        }
      },
      nota_terapeutica_disclaimer: { type: Type.STRING },
      status_servidor: { type: Type.STRING }
    },
    required: [
      "paciente_nome",
      "padrao_emocional_detectado",
      "ciclo_recomendado",
      "justificativa_terapeutica",
      "receita_integrativa",
      "matriz_vibracional_audio",
      "nota_terapeutica_disclaimer",
      "status_servidor"
    ]
  };

  const SYSTEM_INSTRUCTION_ANAMNESE = `Você é o núcleo operacional e o motor de inteligência artificial e engenharia sutil do aplicativo "Protocolo de Cura Integrada de 21 Dias", canalizado por Éverton Rodrigo Piceni. Sua função é processar anamneses de pacientes, diagnosticar o padrão emocional atual, recomendar a linha de áudio ideal (7 ou 21 dias), prescrever de forma terapêutica complementar um Floral de Bach e um Óleo Essencial (Aromaterapia), gerenciar o Diário de Sensações e simular os disparos automáticos de e-mails, WhatsApp e notificações remotas.

REGRAS DE CONDUÇÃO DOS CICLOS E ÁUDIOS:
- Trilha Emergencial (7 Dias): Foco em vitalidade rápida, queima de exaustão (Burnout) a 528Hz.
- Trilha de Ressignificação (21 Dias): Foco em reprogramação profunda, traumas de infância, TEPT e ressignificação a 432Hz.

DIRETRIZES DE RECEITUÁRIO INTEGRATIVO:
Cruze as queixas do usuário e recomende EXATAMENTE uma combinação com base nos padrões abaixo:
- Ansiedade/Agitação/TDAH ➔ Floral: Impatiens (Paciência) | Aromaterapia: Óleo Essencial de Lavanda (Calmante do sistema nervoso).
- Esgotamento/Burnout/Exaustão ➔ Floral: Olive (Recuperação de energia vital) | Aromaterapia: Óleo Essencial de Alecrim (Foco e revigorante).
- Tristeza Profunda/Depressão/Abandono ➔ Floral: Mustard ou Willow (Acolhimento da alma) | Aromaterapia: Óleo Essencial de Bergamota (Elevação do humor).
- Instabilidade/Bipolaridade/Borderline ➔ Floral: Scleranthus (Equilíbrio e oscilações) | Aromaterapia: Óleo Essencial de Gerânio (Estabilidade emocional).

MATRIZ VIBRACIONAL DE SÍMBOLOS E TIMESTAMPS:
Se ciclo_recomendado for 7 Dias (528Hz):
- 00:00 - 01:30 | Hon-Sha-Ze-Sho-Nen | Abertura do Portal Assíncrono.
- 01:30 - 03:30 | Sei-He-Ki + Cho-Ku-Rei | Benzi Reiki e Aterramento.
- 03:30 - 05:30 | Cho-Ku-Rei | Reiki Usui, Kundalini e Sistema Nervoso.
- 05:30 - 08:30 | Zonar + Halu (Karuna Ki) | Cirurgia Psíquica e Trauma.
- 08:30 - 11:00 | Sei-He-Ki (Rosa) | Raio Rosa e Amor Incondicional.
- 11:00 - Fim   | Cho-Ku-Rei de Ouro | Selamento com Ganesha.

Se ciclo_recomendado for 21 Dias (432Hz):
- 00:00 - 02:00 | Hon-Sha-Ze-Sho-Nen | Abertura do Portal.
- 02:00 - 05:00 | Sei-He-Ki + Cho-Ku-Rei | Benzi Reiki e Aterramento.
- 05:00 - 08:30 | Cho-Ku-Rei | Reiki Usui, Kundalini e Sistema Nervoso.
- 08:30 - 14:00 | Zonar + Halu (Karuna Ki) | Sustentação Ampliada para Traumas e TEPT (Memória Celular).
- 14:00 - 18:30 | Sei-He-Ki (Rosa) | Raio Rosa e Amor Incondicional.
- 18:30 - Fim   | Cho-Ku-Rei de Ouro | Selamento com Ganesha.

DIRETRIZ DA CHAMA VIOLETA:
Acolha o relato com empatia terapêutica profunda, posicionando o usuário de volta ao seu trono de poder pessoal. O status_servidor DEVE ser sempre exatamente 'purificado_chama_violeta'.

MEDICAL DISCLAIMER OBRIGATÓRIO:
"Nota Terapêutica: O Protocolo de Cura Integrada e as sugestões de Florais de Bach e Óleos Essenciais atuam como práticas integrativas e tratamentos complementares. Eles não substituem, sob nenhuma hipótese, o diagnóstico, tratamento ou acompanhamento médico, psiquiátrico ou psicológico tradicional. Mantenha seus tratamentos de saúde ativos."

MONETIZAÇÃO E PAYWALL:
Se o parâmetro usuario_premium for recebido como false:
Gere o diagnóstico emocional básico, MAS oculte a prescrição do floral e da aromaterapia, colocando a seguinte trava no lugar:
"Para liberar a sua receita personalizada de Florais e Aromaterapia que vai atuar diretamente na raiz desse sintoma, além de destravar os 21 dias do protocolo com todas as frequências do Karuna Ki e Imara Reiki, faça o upgrade para a jornada completa na tela inicial."`;

  // Handler for Anamnese processing
  const handleProcessAnamnese = async (req: express.Request, res: express.Response) => {
    try {
      const {
        nome = "Consulente",
        queixas_principais = [],
        relato_livre = "",
        nivel_estresse = 7,
        qualidade_sono = "regular",
        sintomas_fisicos = [],
        estados_emocionais = [],
        chakras_desalinhados = [],
        usuario_premium = false
      } = req.body;

      const isPremium = usuario_premium === true || usuario_premium === "true";
      const complaintsStr = Array.isArray(queixas_principais) ? queixas_principais.join(", ") : String(queixas_principais);
      const emotionalStr = Array.isArray(estados_emocionais) ? estados_emocionais.join(", ") : String(estados_emocionais);
      const physicalStr = Array.isArray(sintomas_fisicos) ? sintomas_fisicos.join(", ") : String(sintomas_fisicos);

      const geminiClient = getGemini();

      if (geminiClient) {
        const userPrompt = `DADOS DA ANAMNESE:
Paciente: ${nome}
Queixas Principais: ${complaintsStr}
Relato Aberto do Paciente: "${relato_livre}"
Nível de Estresse (0-10): ${nivel_estresse}
Qualidade do Sono: ${qualidade_sono}
Sintomas Físicos Declarados: ${physicalStr}
Estados Emocionais: ${emotionalStr}
Chakras que sente bloqueados: ${Array.isArray(chakras_desalinhados) ? chakras_desalinhados.join(", ") : ""}
usuario_premium: ${isPremium}

Processe a anamnese segundo todas as suas instruções sistêmicas e retorne o JSON estruturado.`;

        const response = await geminiClient.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION_ANAMNESE,
            responseMimeType: "application/json",
            responseSchema: anamneseResponseSchema,
            temperature: 0.3
          }
        });

        const rawText = response.text || "";
        const parsed = JSON.parse(rawText);

        // Security check for paywall enforcement
        if (!isPremium) {
          const lockMessage = "Para liberar a sua receita personalizada de Florais e Aromaterapia que vai atuar diretamente na raiz desse sintoma, além de destravar os 21 dias do protocolo com todas as frequências do Karuna Ki e Imara Reiki, faça o upgrade para a jornada completa na tela inicial.";
          parsed.receita_integrativa = {
            floral_bach: "🔒 Bloqueado (Disponível no Plano Completo)",
            floral_instrucao: lockMessage,
            aromaterapia_oleo: "🔒 Bloqueado (Disponível no Plano Completo)",
            aromaterapia_instrucao: lockMessage
          };
        }

        return res.json(parsed);
      }

      // DETERMINISTIC FALLBACK (quando chave Gemini não estiver setada no .env)
      const allText = `${complaintsStr} ${emotionalStr} ${physicalStr} ${relato_livre}`.toLowerCase();
      
      let padrao = "Ansiedade / Agitação Mental e Sobrecarga do Sistema Nervoso";
      let floral = "Impatiens (Paciência)";
      let floralInstrucao = "Tomar 4 gotas sublinguais 4 vezes ao dia para desacelerar o ritmo interno e restaurar a paciência mental.";
      let aroma = "Óleo Essencial de Lavanda (Calmante do sistema nervoso)";
      let aromaInstrucao = "Inalar 2 gotas na palma das mãos em concha ou usar 4 gotas no difusor ultrassônico antes de deitar.";
      let ciclo = "Trilha 2: Ciclo de Ressignificação (21 Dias) - 432Hz";
      let justificativa = `Identificamos uma sobrecarga nos centros superiores com necessidade de aterramento e pacificação do sistema nervoso simpático.`;

      if (allText.includes("esgotamento") || allText.includes("burnout") || allText.includes("cansaço") || nivel_estresse >= 9) {
        padrao = "Esgotamento Extremo, Fadiga Biológica e Burnout";
        floral = "Olive (Recuperação de energia vital)";
        floralInstrucao = "Tomar 4 gotas sublinguais 4 vezes ao dia para restaurar o tônus vital e o ânimo do corpo físico.";
        aroma = "Óleo Essencial de Alecrim (Foco e revigorante)";
        aromaInstrucao = "Pingar 1 gota no colar aromático pela manhã ou inalar para clareza mental e ativação do chakra frontal.";
        ciclo = "Trilha 1: Ciclo Emergencial (7 Dias) - 528Hz";
        justificativa = `O campo bioenergético apresenta queima de reservas vitais. A frequência emergencial de 528Hz atua na reestruturação celular imediata.`;
      } else if (allText.includes("tristeza") || allText.includes("depressão") || allText.includes("abandono") || allText.includes("mág") || allText.includes("vazio")) {
        padrao = "Tristeza Profunda, Memórias Celulares de Dor e Bloqueio Cardíaco";
        floral = "Mustard ou Willow (Acolhimento da alma)";
        floralInstrucao = "Tomar 4 gotas sublinguais 4 vezes ao dia para dissipar a névoa escura e acolher a alma.";
        aroma = "Óleo Essencial de Bergamota (Elevação do humor)";
        aromaInstrucao = "Inalar pela manhã para dissolver a amargura e estimular a produção sutil de alegria e ânimo.";
        ciclo = "Trilha 2: Ciclo de Ressignificação (21 Dias) - 432Hz";
        justificativa = `Tratamento voltado à transmutação de memórias profundas na camada inconsciente, restaurando a autoaceitação e o amor no Raio Rosa.`;
      } else if (allText.includes("bipolar") || allText.includes("borderline") || allText.includes("oscil") || allText.includes("instab")) {
        padrao = "Instabilidade Emocional e Oscilação de Humor";
        floral = "Scleranthus (Equilíbrio e oscilações)";
        floralInstrucao = "Tomar 4 gotas sublinguais 4 vezes ao dia para ancorar a estabilidade entre os polos emocionais.";
        aroma = "Óleo Essencial de Gerânio (Estabilidade emocional)";
        aromaInstrucao = "Massagear 1 gota diluída em óleo vegetal sobre o chakra cardíaco para sustentação afetiva e centramento.";
        ciclo = "Trilha 2: Ciclo de Ressignificação (21 Dias) - 432Hz";
        justificativa = `Foco em equilíbrio dos hemisférios cerebrais, drenagem do excesso de impulsividade e blindagem com a luz azul-safira.`;
      }

      const lockMessage = "Para liberar a sua receita personalizada de Florais e Aromaterapia que vai atuar diretamente na raiz desse sintoma, além de destravar os 21 dias do protocolo com todas as frequências do Karuna Ki e Imara Reiki, faça o upgrade para a jornada completa na tela inicial.";

      const fallbackPayload = {
        paciente_nome: nome,
        padrao_emocional_detectado: padrao,
        ciclo_recomendado: ciclo,
        justificativa_terapeutica: justificativa,
        receita_integrativa: isPremium ? {
          floral_bach: floral,
          floral_instrucao: floralInstrucao,
          aromaterapia_oleo: aroma,
          aromaterapia_instrucao: aromaInstrucao
        } : {
          floral_bach: "🔒 Bloqueado (Disponível no Plano Completo)",
          floral_instrucao: lockMessage,
          aromaterapia_oleo: "🔒 Bloqueado (Disponível no Plano Completo)",
          aromaterapia_instrucao: lockMessage
        },
        matriz_vibracional_audio: ciclo.includes("7 Dias") ? [
          { tempo: "00:00 - 01:30", simbolo: "Hon-Sha-Ze-Sho-Nen", acao_sutil: "Abertura do Portal Assíncrono" },
          { tempo: "01:30 - 03:30", simbolo: "Sei-He-Ki + Cho-Ku-Rei", acao_sutil: "Benzi Reiki e Aterramento" },
          { tempo: "03:30 - 05:30", simbolo: "Cho-Ku-Rei", acao_sutil: "Reiki Usui, Kundalini e Sistema Nervoso" },
          { tempo: "05:30 - 08:30", simbolo: "Zonar + Halu (Karuna Ki)", acao_sutil: "Cirurgia Psíquica e Trauma" },
          { tempo: "08:30 - 11:00", simbolo: "Sei-He-Ki (Rosa)", acao_sutil: "Raio Rosa e Amor Incondicional" },
          { tempo: "11:00 - Fim", simbolo: "Cho-Ku-Rei de Ouro", acao_sutil: "Selamento com Ganesha" }
        ] : [
          { tempo: "00:00 - 02:00", simbolo: "Hon-Sha-Ze-Sho-Nen", acao_sutil: "Abertura do Portal" },
          { tempo: "02:00 - 05:00", simbolo: "Sei-He-Ki + Cho-Ku-Rei", acao_sutil: "Benzi Reiki e Aterramento" },
          { tempo: "05:00 - 08:30", simbolo: "Cho-Ku-Rei", acao_sutil: "Reiki Usui, Kundalini e Sistema Nervoso" },
          { tempo: "08:30 - 14:00", simbolo: "Zonar + Halu (Karuna Ki)", acao_sutil: "Sustentação Ampliada para Traumas e TEPT" },
          { tempo: "14:00 - 18:30", simbolo: "Sei-He-Ki (Rosa)", acao_sutil: "Raio Rosa e Amor Incondicional" },
          { tempo: "18:30 - Fim", simbolo: "Cho-Ku-Rei de Ouro", acao_sutil: "Selamento com Ganesha" }
        ],
        nota_terapeutica_disclaimer: "Nota Terapêutica: O Protocolo de Cura Integrada e as sugestões de Florais de Bach e Óleos Essenciais atuam como práticas integrativas e tratamentos complementares. Eles não substituem, sob nenhuma hipótese, o diagnóstico, tratamento ou acompanhamento médico, psiquiátrico ou psicológico tradicional. Mantenha seus tratamentos de saúde ativos.",
        status_servidor: "purificado_chama_violeta"
      };

      return res.json(fallbackPayload);
    } catch (err: any) {
      console.error("Erro ao processar anamnese com IA:", err);
      return res.status(500).json({ error: "Falha no processamento da anamnese." });
    }
  };

  app.post("/api/anamnese", handleProcessAnamnese);
  app.post("/api/anamnesis", handleProcessAnamnese);

  // Communications Endpoint (WhatsApp, Email, Push for Day 8, Day 15, Day 21)
  app.post("/api/communications/trigger", (req, res) => {
    const { dayNumber, userName = "Consulente", phone = "" } = req.body;

    let subject = "";
    let message = "";
    let pushTitle = "";
    let pushBody = "";

    if (dayNumber === 8) {
      pushTitle = "💜 Dia 8: Entrada no Karuna Ki";
      pushBody = `${userName}, receba este abraço cósmico na transmutação profunda de memórias celulares.`;
      subject = "🌟 Dia 8 do Protocolo: Um Abraço de Transmutação e Força no Karuna Ki";
      message = `Olá ${userName},\n\nHoje você inicia o 8º Dia da sua Jornada! Esta etapa ativa os símbolos sagrados do Karuna Ki (Zonar e Halu), permitindo que feridas celulares e dores antigas sejam dissolvidas na Chama Violeta.\n\nVocê não está sozinho. Respire fundo, celebre sua constância e continue firme no seu trono de poder pessoal.\n\nCom amor e bênçãos,\nÉverton Rodrigo Piceni`;
    } else if (dayNumber === 15) {
      pushTitle = "🌸 Dia 15: O Raio Rosa e o Amor Incondicional";
      pushBody = `${userName}, você alcançou o balsamo do coração. Permita-se ser amado e acolhido.`;
      subject = "💖 Dia 15 do Protocolo: O Bálsamo Sagrado do Raio Rosa";
      message = `Querido(a) ${userName},\n\nParabéns por chegar ao 15º Dia! Você acaba de ancorar na fase do Raio Rosa e no amor incondicional da egrégora crística e dos mestres ascensos.\n\nDeixe o passado ir embora com ternura. Seu coração está sendo restaurado e preenchido de paz verdadeira.\n\nCom luz e acolhimento,\nÉverton Rodrigo Piceni`;
    } else if (dayNumber === 21) {
      pushTitle = "👑 Você assumiu o seu Trono!";
      pushBody = `Parabéns pela conclusão dos 21 Dias do seu Protocolo de Cura Integrada!`;
      subject = "👑 21º Dia: Você assumiu o seu Trono - Protocolo Concluído com Sucesso!";
      message = `👑 Você assumiu o seu Trono: Parabéns pela conclusão do seu Protocolo de Cura Integrada!\n\nQuerido(a) ${userName},\n\nHoje é o ápice da sua jornada de 21 Dias. Com a benção e o empoderamento de Ganesha, esse tratamento está totalmente selado e blindado no seu DNA cósmico.\n\nTodas as frequências, desprogramações celulares e ativações espirituais foram integradas com perfeição. Você é livre para ser feliz. Você é cura. Você é amor. Você está em paz.\n\nCom profunda gratidão,\nÉverton Rodrigo Piceni`;
    } else {
      pushTitle = `✨ Lembrete Diário: Dia ${dayNumber}`;
      pushBody = `${userName}, seu momento sagrado de alinhamento vibracional está pronto hoje.`;
      subject = `✨ Dia ${dayNumber} do Protocolo de Cura Integrada`;
      message = `Olá ${userName},\n\nSeu momento de autocuidado, paz e meditação do Dia ${dayNumber} espera por você. Reserve alguns minutos para alinhar sua energia e silenciar a mente.\n\nCom carinho,\nÉverton Rodrigo Piceni`;
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = cleanPhone ? `https://wa.me/55${cleanPhone.startsWith("55") ? cleanPhone.slice(2) : cleanPhone}?text=${encodedMsg}` : `https://wa.me/?text=${encodedMsg}`;

    return res.json({
      status: "success",
      dayNumber,
      userName,
      pushNotification: {
        title: pushTitle,
        body: pushBody
      },
      email: {
        subject,
        body: message
      },
      whatsapp: {
        phone: cleanPhone,
        message,
        url: whatsappUrl
      }
    });
  });

  // ElevenLabs Status Endpoint
  app.get("/api/elevenlabs/status", (_req, res) => {
    const hasKey = !!process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== "SUA_CHAVE_ELEVENLABS";
    res.json({
      configured: hasKey,
      defaultVoice: process.env.ELEVENLABS_VOICE_ID || "Marcus",
      model: "eleven_multilingual_v2",
      stability: 0.45,
      similarityBoost: 0.75
    });
  });

  // ElevenLabs Voices list
  app.get("/api/elevenlabs/voices", async (_req, res) => {
    const client = getElevenLabs();
    
    // Curated list of high-quality therapeutic voices for Portuguese/Multilingual
    const defaultCuratedVoices = [
      {
        voice_id: "Marcus",
        name: "Marcus (Éverton Piceni Style)",
        category: "cloned/curated",
        description: "Voz masculina profunda, acolhedora, serena e terapêutica. Ideal para o Protocolo de 21 Dias.",
        preview_url: ""
      },
      {
        voice_id: "Rachel",
        name: "Rachel (Acolhimento & Paz)",
        category: "premade",
        description: "Voz feminina suave, doce e maternal. Excelente para a fase do Raio Rosa e meditação.",
        preview_url: ""
      },
      {
        voice_id: "George",
        name: "George (Frequência Harmônica)",
        category: "premade",
        description: "Voz madura e tranquilizadora, ótima para decretos de firmeza e quebra de laços.",
        preview_url: ""
      },
      {
        voice_id: "Charlotte",
        name: "Charlotte (Serenidade)",
        category: "premade",
        description: "Tom suave, meditativo e pausado para relaxamento profundo e insônia.",
        preview_url: ""
      }
    ];

    if (!client) {
      return res.json({
        voices: defaultCuratedVoices,
        isCustomApiKey: false
      });
    }

    try {
      const response = await client.voices.getAll();
      const apiVoices = (response.voices || []).map((v: any) => ({
        voice_id: v.voice_id,
        name: v.name,
        category: v.category || "custom",
        description: v.description || (v.labels ? Object.values(v.labels).join(", ") : "Voz ElevenLabs"),
        preview_url: v.preview_url || ""
      }));

      // Merge curated with user's custom voices
      const allVoices = [...defaultCuratedVoices];
      apiVoices.forEach((av: any) => {
        if (!allVoices.some(v => v.voice_id === av.voice_id)) {
          allVoices.push(av);
        }
      });

      return res.json({
        voices: allVoices,
        isCustomApiKey: true
      });
    } catch (err: any) {
      console.warn("ElevenLabs voices fetch warning:", err?.message || err);
      return res.json({
        voices: defaultCuratedVoices,
        isCustomApiKey: true,
        warning: "Usando lista padrão de vozes terapêuticas."
      });
    }
  });

  // ElevenLabs Text-to-Speech Generation Endpoint
  app.post("/api/elevenlabs/tts", async (req, res) => {
    try {
      const {
        text,
        voiceId = process.env.ELEVENLABS_VOICE_ID || "Marcus",
        stability = 0.45, // 45% stability as recommended for empathetic, expressive therapeutic tone
        similarityBoost = 0.75,
        style = 0.15,
        useSpeakerBoost = true,
        enableBreathingPauses = true,
        cacheKey
      } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Texto para sintetizar é obrigatório." });
      }

      // Check cache if cacheKey or text signature exists
      const effectiveCacheKey = cacheKey || `${voiceId}_${stability}_${text.slice(0, 100)}_${text.length}`;
      if (audioCache.has(effectiveCacheKey)) {
        const cached = audioCache.get(effectiveCacheKey)!;
        res.setHeader("Content-Type", cached.contentType);
        res.setHeader("X-Audio-Cache", "HIT");
        return res.send(cached.buffer);
      }

      const client = getElevenLabs();
      if (!client) {
        // Return 503 with fallback indicator so client smoothly switches to Web Speech API
        return res.status(503).json({
          error: "ELEVENLABS_API_KEY não configurada no servidor.",
          fallbackToNativeTTS: true,
          message: "Configure sua ELEVENLABS_API_KEY no painel de Segredos para ativar as vozes ultra-realistas com inteligência artificial."
        });
      }

      const formattedText = enableBreathingPauses ? prepareTherapeuticSSML(text) : text;

      // Map friendly or gender strings to actual high-fidelity ElevenLabs voice IDs
      let resolvedVoiceId = voiceId;
      if (voiceId === 'masculina' || voiceId === 'male' || voiceId === 'everton' || voiceId === 'Marcus') {
        resolvedVoiceId = process.env.ELEVENLABS_VOICE_ID || "Marcus";
      } else if (voiceId === 'feminina' || voiceId === 'female' || voiceId === 'sofia' || voiceId === 'Rachel') {
        resolvedVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel - natural, soothing female voice
      }

      console.log(`🔊 [ElevenLabs] Sintetizando voz (${resolvedVoiceId}) com estabilidade ${Math.round(stability * 100)}% e pausas terapêuticas...`);

      const audioStream = await client.generate({
        voice: resolvedVoiceId,
        model_id: "eleven_multilingual_v2", // Multilingual model with native high-fidelity Brazilian Portuguese
        text: formattedText,
        voice_settings: {
          stability: Number(stability),
          similarity_boost: Number(similarityBoost),
          style: Number(style),
          use_speaker_boost: useSpeakerBoost
        }
      });

      // Collect audio stream chunks into a complete MP3 buffer
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream as any) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const audioBuffer = Buffer.concat(chunks);

      // Store in memory cache (up to 50 audio files)
      if (audioCache.size > 50) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey) audioCache.delete(firstKey);
      }
      audioCache.set(effectiveCacheKey, { buffer: audioBuffer, contentType: "audio/mpeg" });

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", audioBuffer.length);
      res.setHeader("X-Audio-Cache", "MISS");
      return res.send(audioBuffer);
    } catch (error: any) {
      console.error("Erro na geração de áudio ElevenLabs:", error);
      return res.status(500).json({
        error: error.message || "Falha ao sintetizar áudio na ElevenLabs.",
        fallbackToNativeTTS: true
      });
    }
  });

  // Vite middleware for dev / static for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Servidor do Protocolo de Cura Integrada rodando em http://localhost:${PORT}`);
  });
}

startServer();
