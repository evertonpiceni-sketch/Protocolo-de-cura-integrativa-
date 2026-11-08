# Auditoria RUN 98 — Estilo 1: Natural Sereno

**Data:** 08/11/2026  
**Base integrada:** `main` em `c03942c9e0bb0f3bbda0e4315d01c4c3240e152c`  
**PR:** #73 — branch de auditoria Natural Sereno.

## Corrigido

- Home runtime: retiradas as superfícies verde-floresta, o amarelo antigo e o CTA verde em pílula; base creme/marfim, texto café e dourado refinado.
- CSS de origem: CTA principal com raio de 18px, dourado de duas paradas e texto café.
- Home responsiva: mantida a fotografia realista do vale, com altura e enquadramento específicos para desktop e mobile.
- Modais e superfícies mobile: creme, marfim, café e dourado refinado; verde-sálvia limitado a acentos semânticos.
- Seletor: escolha inicial nula e confirmação obrigatória. CTA neutro e Natural Sereno com 18px; o acabamento dos outros três estilos permanece próprio.
- Logo do acolhimento: corrigida a regra legada mais específica que forçava opacidade total; 30% no desktop e 26% até 640px, sem filtro ou blend escuro.

## Preservado

- A escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno. Preferência salva não aplica tema sem confirmação na sessão.
- Pranchas, paisagens, assets, conteúdo e layouts aprovados; nenhum arquivo visual dos Estilos 2, 3 ou 4 foi substituído.
- Atualizações posteriores da main para Essência Luminosa e Elegância Profunda, incluindo o estado neutro de pré-cadastro em `src/index.css`, ajustes de acessibilidade e testes de pré-seleção.
- Diário: o callback grava progresso e perfil por `saveProgress` e `saveProfile`.
- Voz neural: IDs ElevenLabs válidos salvos são preservados; no Natural Sereno não há fallback silencioso para SpeechSynthesis.
- Solfeggio: frequências exatas 396, 417, 432, 528, 639, 741, 852 e 963 Hz; não interfere durante prévia neural.
- Player, seis etapas, animações e respiração 4–3–5.
- InfinitePay: endpoint público de checkout, handle/URL, escolha de benefício Semestral/Anual validada no servidor, conferência do valor e deduplicação de transação. O código atual não exige `INFINITEPAY_API_KEY`.

## Integração e reauditoria

- A main avançou dois commits de documentação/testes do Estilo 3 desde a integração anterior. A árvore atual da main foi mantida como primeiro pai; as correções do Natural Sereno foram reaplicadas somente nos arquivos específicos do Estilo 1.
- `LayoutChoiceModal.tsx` preserva o comentário, as prévias e a lógica atuais da main, com a única alteração do raio de 18px no CTA neutro/Natural Sereno.
- `src/index.css` foi mantido integralmente da main atual; nenhuma versão global antiga de cadastro foi recuperada.
- Seis folhas CSS e o modelo runtime do Natural Sereno foram examinados estaticamente. Valores antigos ainda aparecem em seletores de compatibilidade para identificar classes compartilhadas, mas as regras escopadas os convertem para superfícies claras/douradas.
- CI #1883 do head anterior concluiu com sucesso. A CI do head integrado atual deve confirmar novamente testes, TypeScript e build.
- Nenhum checkout ou pagamento foi iniciado.

## Pendente

1. Preview Vercel READY: o último check foi recusado pelo limite diário de deployments (`api-deployments-free-per-day`).
2. Capturas renderizadas página a página em desktop e mobile; esta rodada concluiu varredura estática, não homologação visual no navegador.
3. Escuta real da voz salva e teste de narração/Solfeggio/ambiência em sessão autenticada.
4. Checkout, confirmação e webhook em sandbox; nenhuma cobrança real foi feita.
5. Confirmar byte a byte se `docs/visual-qa/natural-sereno/reference.jpg` corresponde ao upload original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A referência versionada foi preservada sem substituição por imagem inferida.

**Sem merge na main e sem publicação em produção.**
