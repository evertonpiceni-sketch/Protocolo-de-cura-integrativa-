# Auditoria RUN 179 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho

## Resultado executivo

A revisão encontrou uma inconsistência nos testes de regressão, não nas superfícies visuais aprovadas: um teste antigo ainda exigia opacidade de 26% no mobile, enquanto a decisão posterior RUN 175 e a cascata CSS atual fixam o logo em 30% também no mobile. Isso faria a suíte falhar quando executada. A expectativa antiga foi alinhada à decisão vigente. Nenhum redesign ou alteração de comportamento visual foi introduzido.

## Corrigido

1. **Teste de logo desatualizado:** em `tests/natural-sereno-logo-audit.test.ts`, as duas verificações mobile foram alinhadas de 26% para 30%:
   - assinatura do cartão de acolhimento;
   - assinatura da tela de carregamento.
2. **Comentário de CSS desatualizado:** em `src/natural-sereno-approved-overrides.css`, a observação que dizia “30% desktop e 26% mobile” agora registra “30% em desktop e mobile”.

A regra efetiva já estava correta: 30% em ambos os tamanhos. Não alterei a opacidade aplicada em produção, apenas o teste contraditório e o comentário histórico.

## Preservado e reauditoriado

- **Seletor:** `LayoutChoiceModal` começa com `selectedLayout = null`; a confirmação é obrigatória; o tema só é persistido/aplicado após escolha explícita.
- **Quatro prévias:** Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno mantêm referências/paletas próprias. O teste `natural-sereno-run179-style-preview-isolation.test.ts` está presente no HEAD e foi revisado estaticamente.
- **Prancha Estilo 1:** o projeto usa `docs/visual-qa/natural-sereno/reference.jpg` em `object-contain`, sem recorte. A busca de arquivos encontrou e permitiu inspecionar a prancha Library `Painel UX_UI Natural Sereno.png`, visualmente correspondente ao card Estilo 1; o identificador exato `file_00000000317c820ebaad657dc3680de5` não foi retornado nesta busca. A prancha histórica permanece subordinada às decisões posteriores: sem grandes chapas verdes, sem chakras e sem logo dominante.
- **Identidade vigente:** creme/marfim, café/marrom e dourado refinado; sálvia apenas em pequenos acentos; fotografias realistas e regras responsivas preservadas.
- **Logo:** assinatura a 30%, transparente e sem moldura/disco; regra da Reintegração cobre tela principal, sessão em andamento e modais/roteiro.
- **Reintegração:** corpo neutro, percurso de luz, raízes do Dia 1, animações e player preservados.
- **Voz/áudio:** Marianne `mJqP14JQFEK0PojR5lfV`; rota neural autenticada e política de áudio/Solfeggio conferidas no código. Homologação auditiva real não foi possível.
- **Diário/Anamnese:** sincronização e proteção por conta preservadas; consentimento de áudio não é concedido pelo salvamento da Anamnese.
- **Estilos 2, 3 e 4:** sem alterações de produção nesta rodada.

## Reauditoria estática

**13/13 verificações de fonte passaram**, incluindo:
- ausência das expectativas antigas de 26%;
- 30% nas verificações mobile;
- comentário CSS alinhado;
- assinatura da Reintegração a 30%;
- quatro estilos presentes e sem pré-seleção;
- confirmação explícita antes de aplicar o tema;
- ordem da camada final Natural Sereno;
- ID da voz Marianne e teste de isolamento das prévias.

Essas verificações são inspeções estáticas via conteúdo versionado. A suíte Node, TypeScript, lint e build **não foram executados**.

## Estado GitHub / infraestrutura

- HEAD antes do commit deste relatório: `751814a6dca163f310b59d53fe8e36d2598d9e06`.
- Comparação com `main`: **354 commits à frente e 12 atrás**.
- PR #79: aberta, em rascunho, `mergeable=false`, 168 arquivos alterados.
- Check combinado do HEAD: Vercel `failure` (`build-rate-limit`).
- GitHub Actions: nenhuma execução associada ao HEAD consultado.
- Não foi possível confirmar Preview READY nesta rodada.

### Pagamentos

O código de checkout e validação server-side foi preservado. O último inventário de variáveis registrado na RUN 178 apontava `INFINITEPAY_API_KEY` ausente, `INFINITEPAY_HANDLE` somente em Production e sem `PUBLIC_APP_URL` de Preview para esta branch. Esse inventário não foi reconsultado nesta rodada; sandbox e webhook permanecem sem homologação. Nenhuma cobrança foi realizada.

## Pendências

1. Recuperar o Preview e o provisionamento Vercel.
2. Executar a suíte Node, TypeScript, lint e build.
3. Fazer QA visual renderizado página a página em desktop e mobile.
4. Ouvir Marianne e validar Solfeggio, player e transições.
5. Reconsultar as variáveis Preview e homologar InfinitePay em sandbox, inclusive webhook.
6. Reconciliar seletivamente os 12 commits divergentes da `main`, sem merge/rebase automático e sem recuperar itens rejeitados.

**Decisão:** manter o Natural Sereno visualmente congelado. A única correção desta rodada foi alinhar o teste legado à opacidade de logo já aprovada; nenhuma superfície aprovada foi redesenhada.
