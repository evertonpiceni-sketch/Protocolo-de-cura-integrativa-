# Auditoria RUN 98 — Estilo 1: Natural Sereno

**Data:** 08/11/2026  
**Base atual:** `main` em `20cfa05f3af48c617ac112303fc122f70b185c43`  
**Integração:** PR #73, head anterior `292677f3688c3a80cec3227dd2ef5be9194cd67a`; merge-base anterior `8c8c9867aa38244b5ef6cb992edc8501c52bb841`.

## Corrigido

- Home runtime: removidos fundos verde-floresta, amarelo antigo e CTA verde em pílula; superfície creme/marfim, texto café e dourado refinado.
- CSS de origem: CTA principal passa a raio de 18px, dourado de duas paradas e texto café.
- Home responsiva: preservada a fotografia realista do vale, com enquadramento e altura adaptáveis para desktop e mobile.
- Modais e superfícies mobile: paleta de leitura alinhada a creme, marfim, café, dourado refinado e verde-sálvia apenas como acento.
- Seletor: escolha inicial nula, confirmação obrigatória; CTA neutro e Natural Sereno com 18px, sem alterar o acabamento dos Estilos 2, 3 e 4.
- Logo do acolhimento: regra legada de opacidade total neutralizada; assinatura em 30% no desktop e 26% até 640px, sem filtro ou blend escuro.

## Preservado

- A escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno; preferência salva não autoriza aplicação automática na sessão.
- Paisagens e assets existentes, conteúdo, Diário e sincronização por `saveProgress`/`saveProfile`.
- Voz neural: IDs ElevenLabs válidos salvos são preservados; caminhos Natural Sereno não usam SpeechSynthesis como fallback silencioso.
- Solfeggio: frequências exatas 396, 417, 432, 528, 639, 741, 852 e 963 Hz; troca/interferência bloqueada durante prévia neural.
- Player, seis etapas, animações e respiração 4–3–5.
- Fluxo InfinitePay, preços, cupons, escolha server-side de benefício Semestral/Anual, verificação do valor e deduplicação de transação.
- Atualizações posteriores já existentes na main para Elegância Profunda e Essência Luminosa. Nenhum arquivo visual dos Estilos 2, 3 ou 4 foi substituído.

## Integração e reauditoria

- A main avançou nove commits desde a base antiga da PR #73. A integração preservou a árvore atual da main como primeiro pai e o head anterior da PR como segundo pai.
- As mudanças de Estilo 2/3 na main foram mantidas; não foram transplantadas versões antigas dessas telas.
- CI anterior do head da PR #73: Security Audit #1883 concluído com sucesso. A CI do commit integrado precisa confirmar novamente o conjunto completo.
- A implementação atual de pagamento usa o endpoint público de checkout, `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` (com defaults); não exige `INFINITEPAY_API_KEY`. Não foi iniciado checkout nem cobrança.
- A inspeção do código confirma que o Diário chama os callbacks que persistem progresso e perfil; voz neural, Solfeggio e temporização do player mantêm os guardrails citados.

## Pendente

1. Preview Vercel READY: o último deployment foi recusado pelo limite diário de 100 deployments (`api-deployments-free-per-day`).
2. Capturas renderizadas página a página em desktop e mobile; a varredura desta rodada é estática.
3. Escuta real da voz salva e teste de transições narração/Solfeggio/ambiência em navegador autenticado.
4. Checkout, confirmação e webhook em sandbox; nenhuma cobrança real foi feita.
5. Confirmar byte a byte se a prancha versionada `docs/visual-qa/natural-sereno/reference.jpg` corresponde ao upload original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A referência existente foi preservada, sem substituição por imagem inferida.

**Sem merge na main e sem publicação em produção.**
