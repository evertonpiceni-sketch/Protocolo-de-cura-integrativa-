# Auditoria RUN 148 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código/teste auditado:** `dbf414a2ca0c2de67d59ebe322f3a514847d11bc`  
**PR:** #79 — aberta, draft, `mergeable=false`

## Corrigido

A varredura das folhas CSS não encontrou declarações ativas com os tokens antigos nas 12 camadas específicas do Natural Sereno. Porém, a inspeção dos estilos injetados em tempo de execução revelou um ponto que a suíte não cobria:

- `src/lib/naturalSerenoHomeApprovedModel.ts`, regra `.ep-home-moment-card`: a borda usava `rgba(182,139,54,.26)`, um dourado antigo fora dos tokens finais aprovados.
- Substituído por `rgba(200,157,82,.26)`, mantendo a mesma espessura, transparência e geometria do cartão.
- A alteração é restrita ao estilo dinâmico da Home; não muda conteúdo, layout, navegação ou comportamento.

## Proteção adicionada

- `tests/natural-sereno-approved-gold-palette.test.ts`: incluída uma verificação específica do bloco `style.textContent` de `naturalSerenoHomeApprovedModel.ts`.
- O teste exige o dourado aprovado e reprova o retorno de `rgba(182,139,54)`.
- A verificação cobre agora uma fonte de CSS dinâmico que não era abrangida pela varredura das folhas estáticas.

## Reauditoria após a intervenção

- O modelo dinâmico da Home contém agora `rgba(200,157,82,.26)` e não contém o valor antigo.
- `naturalSerenoHomeJourneyStateFix.ts` continua usando `#A87E37` nas três legendas corrigidas e não reintroduz os antigos dourados.
- A ordem de `src/main.tsx` mantém `natural-sereno-approved-overrides.css` depois das camadas anteriores do Estilo 1; as camadas posteriores dos Estilos 2 e 3 são escopadas aos respectivos temas.
- `App.tsx`: `layoutConfirmedThisSession` inicia em `false`; o atributo `data-layout` só é aplicado após confirmação; o modal é exibido antes da aplicação e também pode ser reaberto.
- `LayoutChoiceModal.tsx`: quatro opções disponíveis, nenhuma pré-selecionada, CTA desabilitado até a escolha e confirmação explícita antes de persistir.
- Arcanjo no Natural Sereno usa `NeutralBodyLightProgress`; os painéis compartilhados são convertidos para creme/marfim e café pelos overrides específicos. O corpo com chakras não foi reintroduzido.
- As referências antigas `#B88736`, `#8F631E`, `#f0d989` e `#e5c66f` que permanecem no JSX/CSS são usadas como classes-alvo para neutralização, ou em estilos globais/escopos de outros temas; não são valores de declaração ativa nas 12 folhas específicas do Natural Sereno.
- A prancha continua na prévia composta por meio de `docs/visual-qa/natural-sereno/reference.jpg`, com `object-contain`; não foi possível repetir nesta rodada uma comparação pixel a pixel com o PNG original.

## Preservado

- Paleta creme/marfim `#FAF7F2` / `#F5EFE5`, café `#2A2421`, texto secundário `#6B625B`, dourados `#E2B96B` / `#C89D52` / `#A87E37` e sálvia apenas como acento.
- Paisagens realistas e enquadramentos responsivos; logo oficial sutil/transparente.
- Seletor explícito dos quatro estilos.
- Marianne/ElevenLabs, política de Solfeggio, Diário, player, animações e corpo neutro.
- Proteções server-side da InfinitePay, API Key obrigatória, pagamento único e locks compartilhados.
- Estilos 2, 3 e 4 sem alteração nesta rodada.

## Validação e pendências

- Os arquivos alterados foram relidos após as gravações; o teste novo está no repositório, mas ainda não foi executado no HEAD atual.
- A última execução Security Audit retornada é a run **42677230012**, concluída com sucesso no commit `4e17fff292adee4a2a23b7f086a7ae6a8a4715da`; ela antecede os commits desta rodada e não valida o HEAD atual.
- O status combinado do HEAD atual mostra o check Vercel em falha com destino `upgradeToPro=build-rate-limit`; não há Preview READY disponível.
- QA visual renderizado página a página em desktop/mobile, escuta real de Marianne/Solfeggio/ambiência, Diário ponta a ponta e InfinitePay sandbox continuam pendentes.
- A branch permanece divergente: **186 commits à frente e 12 atrás de `main`** antes deste commit documental. A reconciliação dos 12 commits deve ser seletiva; não foi feito merge ou rebase automático.

## Segurança da entrega

Nenhum merge, publicação em produção ou pagamento real foi realizado.
