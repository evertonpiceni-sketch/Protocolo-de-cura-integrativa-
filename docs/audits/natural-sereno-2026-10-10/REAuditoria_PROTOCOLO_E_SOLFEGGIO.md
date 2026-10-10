# Natural Sereno — reaudit do Protocolo 21 Dias e prática Miguel/Rafael/Violeta

Data: 2026-10-10

Escopo desta rodada: somente Estilo 1 — Natural Sereno. Estilos 2, 3 e 4 permanecem fora da execução.

## Protocolo de 21 Dias

### 1. Contador da voz do navegador

**Estado: corrigido tecnicamente; escuta humana em dispositivo real ainda necessária.**

A API Web Speech moderna informa `SpeechSynthesisEvent.elapsedTime` em segundos; implementações antigas usaram milissegundos. O utilitário `normalizeSpeechElapsedTime` agora aceita os dois formatos sem transformar segundos modernos em milissegundos nem exibir valores absurdos como `436:24`.

Como `MeditationSession` ainda mantém o contrato legado de fallback quando `duration === 0`, `audioIntegrityPatch.ts` normaliza o valor na borda de áudio e preserva o contrato interno atual. O objetivo é evitar regressão visual enquanto o player é auditado.

### 2. Barra de duração desconhecida

**Estado: corrigido.**

`MinimalPlayerControls` não inventa mais 60 segundos. Quando não existe duração real:

- exibe `--:--`;
- usa progresso indeterminado;
- bloqueia seek e saltos de 15 segundos;
- não apresenta percentual falso.

Quando há `HTMLAudioElement.duration` válido, a barra usa a duração real.

### 3. Respiração

**Estado: corrigido em código e interface.**

Cadência atual:

- inspirar: 4 s;
- sustentar: 3 s;
- expirar: 5 s.

O texto visual informa explicitamente `Sustente por 3 segundos`, e a transição visual usa 3 segundos na fase de retenção.

### 4. Narração por dia

**Estado: parcial — não declarar concluído.**

Os 21 dias possuem títulos distintos. O player injeta título, descrição, foco e reflexão específicos do dia em cada uma das seis etapas. Portanto, a narração não é mais literalmente idêntica entre os dias.

Entretanto, a espinha dorsal continua sendo as mesmas seis etapas canônicas. Se o critério de aceite exigir 21 roteiros integralmente distintos, ainda falta localizar/confirmar uma fonte canônica aprovada para esses 21 roteiros. Não criar textos substitutos por interpretação.

### 5. Voz masculina no fallback

**Estado: parcial — permanece bloqueador de aceite físico.**

O caminho principal autenticado resolve o alias masculino para `ELEVENLABS_MALE_VOICE_ID` ou para a voz masculina de fallback configurada no servidor. No fallback nativo, o Natural Sereno procura vozes portuguesas reconhecidamente masculinas antes da seleção genérica.

Nenhum navegador garante que o sistema operacional exponha uma voz masculina nativa. Portanto, não é correto declarar garantia universal sem reprodução nos dispositivos-alvo ou sem um arquivo/serviço masculino próprio para fallback. Esta pendência permanece aberta.

### 6. Correspondência da animação

**Estado: parcial.**

O canvas está ligado ao relógio do áudio e mantém mapeamento semântico por etapa:

- Abertura → dourado/centro;
- Aterramento → raízes;
- Vitalidade → Kundalini/canal;
- Transmutação → safira/Chama Violeta;
- Bálsamo → coração/Raio de São Rafael;
- Selamento → geometria/Ganesha.

A respiração visual também acompanha 4–3–5. Isso comprova correspondência em nível de etapa, mas não sincronização frase a frase. Não declarar sincronismo narrativo integral sem marcações/cues temporais do roteiro.

## São Miguel + Chama Violeta + Raio de Ouro/Verde de São Rafael

**Estado: reconectado.**

`ArcanjoProtocolView` usa o conjunto aprovado `DISTANCE_TREATMENT_SCRIPT` nas seções:

1. Introdução;
2. São Miguel;
3. Chama Violeta;
4. São Rafael;
5. Ancoramento.

A tela e a narração apontam para a mesma fonte textual aprovada.

## Solfeggio

**Estado: corrigido para frequência-base exata no áudio Web.**

Foi criado `solfeggioTone.ts`, que gera uma senoide cuja frequência-base é exatamente o número selecionado (396, 417, 432, 528, 639, 741, 852 ou 963 Hz). `audioIntegrityPatch.ts` intercepta os presets `xxxhz` do engine existente e usa essa fonte exata, em vez de depender apenas de sub-harmônicos/melodias do sintetizador anterior.

Isso preserva os controles atuais e evita que a interface apenas mostre um número em Hz sem reproduzi-lo.

## Validação automática

No commit de fechamento técnico desta rodada, o Security Audit passou em:

- `npm audit`;
- TypeScript;
- testes de regressão;
- build;
- entrypoints Vercel/Express;
- padrões de segredos;
- JWT fail-closed;
- impossibilidade de cadastro público como Admin;
- impossibilidade de bypass do Admin pelo cliente;
- smoke test de saúde/cadastro;
- endpoints de pagamento fail-closed.

## Pendências que impedem congelar o Estilo 1

1. reprodução integral humana do Protocolo de 21 Dias, especialmente fallback nativo;
2. comprovação da voz masculina nos dispositivos-alvo, ou fallback masculino próprio independente das vozes do sistema;
3. decisão/fonte canônica para saber se o aceite exige 21 roteiros integralmente diferentes, e não somente seis etapas canônicas contextualizadas por dia;
4. sincronismo visual frase a frase, caso esse seja o critério final — hoje está comprovado por etapa e relógio;
5. vídeos/arts de movimento aprovados dos Dias 2–21 da Reintegração continuam ausentes em `public/videos`; não gerar substitutos;
6. comparação visual final do Natural Sereno com a prancha congelada antes de avançar ao Estilo 2.

**Parecer:** o Estilo 1 avançou e os erros de contador, duração falsa, cadência e Solfeggio foram tratados. Ainda não congelar nem iniciar Estilos 2–4.
