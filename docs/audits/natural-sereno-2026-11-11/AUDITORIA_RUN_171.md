# Auditoria RUN 171 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`

## Corrigido

- A varredura da Reintegração encontrou um resíduo no contêiner externo dos 21 dias: `PersonalJourney21` ainda declarava `bg-[#F8F4EC]`, enquanto os conteúdos internos já utilizavam `#FAF7F2`.
- Foi acrescentado override final e estritamente escopado a `:root[data-layout="natural-sereno"] [data-ep-reintegration="true"].ep-reintegration-shell`, com fundo `#FAF7F2` e texto `#2A2421`.
- Nenhum conteúdo, roteiro, áudio, temporização, progresso, animação ou comportamento de navegação foi alterado.
- Adicionado teste de regressão para o canvas do shell e isolamento dos estilos.

## Preservado e conferido no código

- Seletor React dos quatro estilos: inicia sem seleção; confirmação é obrigatória; o tema só é aplicado após confirmação explícita.
- A prancha de Natural Sereno segue vinculada à referência versionada `docs/visual-qa/natural-sereno/reference.jpg`, identificada no código com o arquivo original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A prancha é referência histórica; as decisões posteriores de paleta, corpo neutro e logo sutil prevalecem.
- Home e acolhimento: fotografia realista e tratamentos responsivos permanecem; nenhuma imagem foi substituída nesta rodada.
- Reintegração: CTA, navegação, modais, player, progresso, corpo neutro e movimento da luz mantidos; logo oficial permanece como assinatura de baixa opacidade.
- Voz: endpoint da Reintegração fixa Marianne `mJqP14JQFEK0PojR5lfV`, exige sessão autenticada, restringe os trechos autorizados e não oferece fallback robótico.
- Solfeggio: política de não sobreposição à narração preservada.
- Diário e pagamentos: código existente preservado; checkout continua com autenticação, API Key obrigatória, ambiente de produção e validação server-side.
- Estilos 2, 3 e 4: nenhum arquivo de tema desses estilos foi alterado.

## Pendente

- Execução do teste RUN 171, suíte Node/TypeScript, typecheck e build: não executados nesta intervenção.
- Homologação renderizada de todas as páginas em desktop e mobile: pendente.
- Escuta real de Marianne e Solfeggio, testes ponta a ponta do Diário e Reintegração: pendentes.
- InfinitePay sandbox/webhook: pendente de credenciais e URL de Preview.
- Reconciliação seletiva dos 12 commits divergentes da `main`: pendente; nenhum merge/rebase foi realizado.

## Commits desta rodada

- CSS do shell: `4d3d92416675f117b863b4e9802eb4137d553723`.
- Teste de regressão: `b773e3ab1af8ac809b35745b837c544cf36f232a`.

Nenhum merge, deployment de produção ou pagamento real foi realizado.
