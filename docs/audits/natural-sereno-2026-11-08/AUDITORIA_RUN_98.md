# Auditoria RUN 98 — Estilo 1: Natural Sereno

**Data:** 08/11/2026  
**Base integrada:** `main` em `2e1f7aa78171e6faf8404d569316f86cb7e30fe2`  
**PR ativa:** #74 — Natural Sereno, em rascunho para homologação.

## Corrigido

- Home runtime: retiradas as superfícies verde-floresta, o amarelo antigo e o CTA verde em pílula; base creme/marfim, texto café e dourado refinado.
- CSS de origem: CTA principal com raio de 18px, dourado de duas paradas e texto café.
- Home responsiva: fotografia realista preservada com altura e enquadramento específicos para desktop e mobile.
- Modais e superfícies mobile: creme, marfim, café e dourado refinado; verde-sálvia limitado a acentos semânticos.
- Seletor: escolha inicial nula e confirmação obrigatória. CTA neutro e Natural Sereno com 18px; acabamento dos outros estilos preservado.
- Logo do acolhimento: regra específica de opacidade total neutralizada; 30% no desktop e 26% até 640px, sem filtro ou blend escuro.

## Preservado

- Escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno. Preferência salva não aplica tema sem confirmação na sessão.
- Pranchas, paisagens, assets, conteúdo e layouts aprovados. Nenhum arquivo visual dos Estilos 2, 3 ou 4 foi substituído.
- Estado neutro de pré-cadastro em `src/index.css` e atualizações recentes de documentação dos Estilos 2 e 3 na main.
- Diário: callback grava progresso e perfil por `saveProgress` e `saveProfile`.
- Voz neural: IDs ElevenLabs válidos preservados; no Natural Sereno não há fallback silencioso para SpeechSynthesis.
- Solfeggio: frequências exatas 396, 417, 432, 528, 639, 741, 852 e 963 Hz; sem interferência durante prévia neural.
- Player, seis etapas, animações e respiração 4–3–5.
- InfinitePay: endpoint público, handle/URL, escolha server-side de benefício Semestral/Anual, verificação de valor e deduplicação de transação. O código vigente não exige `INFINITEPAY_API_KEY`.

## Integração e reauditoria

- A main avançou dois commits documentais desde a integração anterior. A árvore atual da main foi mantida como primeiro pai; as correções do Natural Sereno foram reaplicadas somente nos arquivos do Estilo 1.
- `LayoutChoiceModal.tsx` preserva a versão atual da main e acrescenta apenas o raio de 18px ao CTA neutro/Natural Sereno.
- `src/index.css` foi mantido integralmente da main; nenhuma camada global antiga de cadastro foi recuperada.
- Seis folhas CSS e o modelo runtime do Natural Sereno foram examinados estaticamente. Valores legados permanecem em seletores de compatibilidade que recebem neutralização escopada; não foram promovidos como cores visuais.
- Security Audit #1904 do head integrado anterior concluiu com sucesso. A nova execução após esta atualização confirma o head final.
- Nenhum checkout ou pagamento foi iniciado.

## Pendente

1. Preview Vercel READY e capturas renderizadas página a página em desktop e mobile; o check atual acusa limite diário de deployments (`api-deployments-free-per-day`).
2. Escuta real da voz salva e teste de narração/Solfeggio/ambiência em navegador autenticado.
3. Checkout, confirmação e webhook em sandbox; nenhuma cobrança real foi feita.
4. Confirmar byte a byte se `docs/visual-qa/natural-sereno/reference.jpg` corresponde ao upload original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A referência versionada foi preservada, sem substituição por imagem inferida.

**Sem merge na main e sem publicação em produção.**
