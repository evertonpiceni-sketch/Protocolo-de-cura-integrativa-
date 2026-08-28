import { GoogleGenAI, Type } from '@google/genai';
import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";

// Inicialização das APIs usando variáveis de ambiente
const ai = new GoogleGenAI();
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// Schema JSON idêntico ao mestre aprovado
const anamneseSchema = {
    type: Type.OBJECT,
    properties: {
        paciente_nome: { type: Type.STRING },
        padrao_emocional_detectado: { type: Type.STRING },
        ciclo_recomendado: { type: Type.STRING },
        justificativa_terapeutica: { type: Type.STRING }, // Este texto irá virar áudio
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
                properties: { tempo: { type: Type.STRING }, simbolo: { type: Type.STRING }, acao_sutil: { type: Type.STRING } },
                required: ["tempo", "simbolo", "acao_sutil"]
            }
        },
        status_servidor: { type: Type.STRING }
    },
    required: ["paciente_nome", "padrao_emocional_detectado", "ciclo_recomendado", "justificativa_terapeutica", "receita_integrativa", "matriz_vibracional_audio", "status_servidor"]
};

// Função principal que une Inteligência Artificial e Voz Humana
export async function executarAtendimentoCompleto(nomePaciente, queixaTexto, statusPremium = true) {
    try {
        console.log(`🤖 1. Consultando Gemini Pro para ${nomePaciente}...`);
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: `Execute a anamnese. Paciente: ${nomePaciente}. Usuário Premium: ${statusPremium}. Relato: "${queixaTexto}"`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: anamneseSchema
            }
        });

        const dadosDiagnostico = JSON.parse(response.text);
        console.log("✅ Anamnese processada com sucesso.");

        // 2. Transforma o texto de acolhimento gerado pelo Gemini em áudio falado
        const textoParaAudio = dadosDiagnostico.justificativa_terapeutica;
        console.log("🔊 2. Enviando texto para a ElevenLabs gerar a voz ultra-realista...");

        const audioStream = await elevenlabs.generate({
            voice: process.env.ELEVENLABS_VOICE_ID || "Marcus", // Substitua pelo ID da sua voz clonada após o treinamento
            model_id: "eleven_multilingual_v2", // Modelo com suporte perfeito ao português
            text: textoParaAudio,
            voice_settings: {
                stability: 0.45, // Menor estabilidade traz oscilações e emoções naturais à voz
                similarity_boost: 0.75
            }
        });

        // Salva o arquivo final de áudio com o ID do usuário para o app buscar e tocar
        const nomeArquivoFinal = `audio_anamnese_${nomePaciente.replace(/\s+/g, '_')}.mp3`;
        const fileStream = fs.createWriteStream(nomeArquivoFinal);
        audioStream.pipe(fileStream);

        console.log(`🎉 Sucesso! Áudio terapêutico gerado e salvo como: ${nomeArquivoFinal}`);
        
        // Retorna o objeto completo para a interface do aplicativo exibir
        return {
            dados_telas: dadosDiagnostico,
            url_audio_reproducao: `./${nomeArquivoFinal}`
        };

    } catch (error) {
        console.error("❌ Falha no motor de atendimento do aplicativo:", error);
        throw error;
    }
}
