# Auditoria RUN 170 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`

## Corrigido

- A tela de carregamento ainda recebia um fundo fotográfico escurecido por uma camada marrom antiga em `natural-sereno.css`, embora o JSX já declarasse fundo creme e texto café.
- Foi acrescentado um override final, restrito a `:root[data-layout="natural-sereno"] #auth-loading-view`: fotografia realista `presenca.webp` sob véu creme/marfim, texto café, apoio secundário em marrom suave e barra de progresso dourada refinada.
- A correção não altera o fluxo de autenticação, a duração do carregamento, o conteúdo, o logo ou os demais estilos.
- Adicionado `tests/natural-sereno-run170-loading-surface.test.ts` para proteger o fundo, a fotografia, a leitura e a ordem da cascata CSS.

## Preservado e conferido

- Card do seletor: a prancha oficial `1001196520.png` permanece vinculada ao derivado versionado `docs/visual-qa/natural-sereno/reference.jpg`, exibida sem recorte como referência; a prévia principal mostra a identidade vigente com paisagem realista.
- Seletor dos quatro estilos: inicia sem opção marcada; confirmação é obrigatória; `data-layout` só é aplicado após confirmação.
- Natural Sereno: creme/marfim, café/marrom, dourado refinado e verde apenas em acentos naturais.
- Reintegração: superfícies estáticas e sessão imersiva têm overrides claros finais; corpo neutro e movimento da luz preservados.
- Logo da Reintegração: assinatura com opacidade de 30% nos estados principal, imersivo e modais; Pausa Consciente e Ainda Há Algo em Mim já incluem a marca aprovada no rodapé.
- Voz: Marianne `mJqP14JQFEK0PojR5lfV`; endpoints de narração autenticados, cache privado e sem fallback robótico na Reintegração.
- Solfeggio: a política de áudio cede à narração e retoma conforme o estado da sessão.
- Diário: sincronização de perfil/progresso e preservação de campos opcionais conferidas no código.
- Pagamentos: checkout e confirmação continuam protegidos por autenticação, chave obrigatória, ambiente de produção e validação server-side.
- Estilos 2, 3 e 4: nenhum arquivo de tema desses estilos foi alterado nesta rodada.

## Pendente

- Não há deployment Preview para o HEAD auditado; a consulta por branch/SHA retornou zero deployments.
- Check Vercel do HEAD: `failure`, com `build-rate-limit`.
- GitHub Actions: nenhuma execução associada ao HEAD.
- A suíte Node/TypeScript, typecheck e build não foram executados nesta rodada; o novo teste foi adicionado, não declarado aprovado.
- QA visual renderizado em todas as páginas, desktop e mobile, e escuta real da Marianne/Solfeggio permanecem pendentes.
- InfinitePay sandbox/webhook e reconciliação seletiva dos 12 commits divergentes da `main` permanecem pendentes.

## Estado da branch observado antes desta intervenção

- HEAD auditado: `4eaec64c3495f5eceb2ccbf06790fc591fc7741b`.
- Comparação com `main`: 296 commits à frente e 12 atrás.
- PR #79: aberta, em rascunho, `mergeable=false`.
- Nenhum merge, deploy de produção ou pagamento real foi realizado.

## Commits desta rodada

- CSS de carregamento: `26abaffa656bf4d5afb7a48dc400a9695f6511c6`.
- Teste de regressão: `657be9bae3034edb89271f36403c9d1c5e3818d6`.
