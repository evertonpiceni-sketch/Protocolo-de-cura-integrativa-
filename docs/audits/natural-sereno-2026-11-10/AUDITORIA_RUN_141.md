# Auditoria RUN 141 — Estilo 1: Natural Sereno

**Data:** 10/11/2026 — 02:38 (America/Sao_Paulo)  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código/teste antes deste relatório:** `fee751d7aee64383bbb3a383cfedd661438859ee`  
**Main verificada:** `783aacc8210d92f35037a0d06309806b89a96973`  
**PR:** #79, aberta em rascunho.

## Corrigido nesta rodada

A inspeção da Home encontrou quatro ocorrências do ocre legado `#8F631E` em pequenos textos de acento do modelo DOM/CSS executado em runtime:

- legenda da Anamnese;
- rótulo do dia atual;
- legenda da afirmação do dia;
- texto de fechamento da Home.

As quatro ocorrências foram substituídas por `#A87E37`, dourado escuro refinado já pertencente à paleta aprovada. Nenhuma estrutura, conteúdo, callback, navegação ou regra de progresso foi alterada.

Arquivos:
- `src/lib/naturalSerenoHomeApprovedModel.ts`
- `tests/natural-sereno-visual-guardrails.test.ts`

Foi acrescentado teste de regressão que proíbe `#8F631E` no modelo da Home e confirma os quatro pontos de acento refinado.

## Reauditoria após a intervenção

Verificações estáticas no HEAD atualizado:

- `naturalSerenoHomeApprovedModel.ts`: **0** ocorrências de `#8F631E`; **4** ocorrências de `#A87E37`.
- Teste de regressão presente e ligado ao modelo real da Home.
- A folha `natural-sereno-home-surface-audit.css` mantém enquadramentos específicos: desktop em 52% e mobile em 54%.
- A folha de superfície da Home continua importada antes de `natural-sereno-approved-overrides.css`; a camada aprovada final mantém precedência.
- As 14 regras da folha de superfície verificadas estão escopadas ao Natural Sereno.
- O seletor continua com `selectedLayout = null`, confirmação desabilitada até escolha e aplicação do tema condicionada a `layoutConfirmedThisSession`.
- No player principal, Natural Sereno usa `NeutralBodyLightProgress`; `SacredEnergyCanvas` permanece no ramo dos outros estilos.
- No Arcanjo, Natural Sereno exige ID neural explícito; a falha da voz não aciona a fala nativa. O Solfeggio é interrompido durante a narração.
- A sincronização do Diário permanece vinculada à identidade da conta.
- InfinitePay permanece server-side, exige `INFINITEPAY_API_KEY`, usa `single_payment: true` e mantém o bloqueio de pagamentos reais fora de Production enquanto a homologação não estiver concluída.

## Preservado

- Prancha oficial `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` como referência do card, subordinada às decisões posteriores. O card continua usando a derivação JPEG versionada em `object-contain`; não foi alegada equivalência pixel a pixel.
- Creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento.
- Fotografias realistas e regras de enquadramento responsivo.
- Logo oficial discreto/transparente como assinatura.
- Seletor explícito dos quatro estilos.
- Corpo neutro, movimento de luz, respiração aprovada, player, voz neural, Solfeggio e Diário.
- Estilos 2, 3 e 4, seus componentes, conteúdo e folhas CSS.
- Preços, cupons e regras comerciais; nenhuma chamada de checkout ou cobrança foi realizada.

## Pendente / bloqueios

- **CI:** a consulta de workflows para o HEAD `fee751d` retornou lista vazia. O status combinado disponível contém somente o check Vercel em falha. O teste novo está versionado, mas ainda não foi executado em Actions.
- **Vercel:** check em falha, sem Preview READY. Não há ambiente renderizado para homologar todas as páginas em desktop e celular; a inspeção visual por screenshot permanece pendente.
- **Áudio real:** falta ouvir Marianne, ambiência e frequências Solfeggio em dispositivo, incluindo pausa, retomada, conclusão e falha de rede.
- **Diário:** falta homologação ponta a ponta com persistência real por conta.
- **InfinitePay:** falta sandbox de checkout, confirmação, webhook e recuperação de pedido.
- **Integração:** branch divergida em relação à main verificada — 166 commits à frente e 12 atrás. A reconciliação deve ser seletiva, preservando as correções de Natural Sereno e os avanços aprovados dos Estilos 2/3 e da camada financeira. Não fazer merge, rebase ou substituição integral cega.

**Sem merge, sem publicação em Production e sem cobrança real.**
