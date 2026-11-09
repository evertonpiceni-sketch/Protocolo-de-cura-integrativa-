# Auditoria RUN 129 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de partida:** `93a71129223ec60ee7f685a8c27b64cc1ceefa79`  
**HEAD final de código:** `9ec163af904fff29e430836d07d9e4ef2ff62369`

## Achado e correção

A revisão dos componentes compartilhados encontrou classes antigas de dourado/âmbar ainda renderizadas em ações de Anamnese, Perguntas Sistêmicas, Diário e Ho'oponopono. O modal de oração de São Miguel também conservava acentos azuis `#315C85`. As folhas de refinamento já neutralizavam parte dessas classes, mas não todos os botões sólidos e estados ativos.

Corrigido na camada final `src/natural-sereno-approved-overrides.css`, sempre sob `data-layout="natural-sereno"`:

- Botões sólidos com `bg-[#B88736]` passam ao gradiente dourado aprovado `#E2B96B → #C89D52`, texto café e borda `#A87E37`.
- Textos `#B88736` e `#8F631E` passam a `#A87E37`.
- Fundos/bordas antigos são harmonizados com creme/marfim e dourado refinado.
- Estados âmbar/púrpura são neutralizados; estados semânticos de conclusão permanecem em sálvia discreta.
- O azul `#315C85` do modal de oração é substituído por dourado suave.
- O controle de 639 Hz da Anamnese recebe acabamento premium de 18px.

Atualizei o teste da política Solfeggio para verificar o override do botão de 639 Hz e acrescentei `tests/natural-sereno-modal-palette-guard.test.ts` para proteger os cinco modais.

## Preservado

- Handlers, conteúdo, seleção de frequência e fluxo de narração/Solfeggio.
- Creme/marfim, café/marrom, dourado refinado e sálvia como acento.
- Paisagens realistas, enquadramento desktop/mobile e logo discreto.
- Seletor explícito dos quatro estilos.
- Diário, sincronização por conta, player, corpo neutro, animações e respiração 4–3–5.
- InfinitePay, preços, cupons e validação server-side; sandbox continua pendente e nenhuma cobrança foi realizada.
- Elegância Profunda, Essência Luminosa e Místico Moderno sem alterações de CSS ou comportamento.

## Reauditoria estática

- As 12 folhas CSS específicas do Natural Sereno continuam sem declarações ativas com os tokens legados pesquisados de verdão, amarelo saturado ou dourado antigo.
- Cinco componentes compartilhados foram verificados pelos seus contêineres estáveis: Anamnese, Perguntas Sistêmicas, Diário, Ho'oponopono e oração de São Miguel.
- O seletor continua sem pré-seleção e exige escolha/confirmação.
- Os testes existentes continuam cobrindo paisagens desktop/mobile e logo discreto (30% desktop / 26% mobile).

## Validação e limites

- O HEAD de partida `93a7112` não tinha execução GitHub Actions associada. A última CI confirmada desta branch permanece run `42677230012`, no commit anterior `4e17fff`, com 247/247 testes, npm audit sem vulnerabilidades, TypeScript e build aprovados.
- Esta nova correção e seus testes precisam de execução CI antes de serem declarados aprovados tecnicamente.
- Vercel continua com status `Deployment rate limited — retry in 24 hours`; não há preview READY. Não foi possível realizar homologação visual renderizada.
- PR #79 permanece divergente de `main` (93 commits à frente e 8 atrás na comparação anterior) e `mergeable=false`. Não fazer merge automático; preservar as alterações compartilhadas da Elegância Profunda.
- Pendentes: capturas renderizadas desktop/mobile, escuta real de Marianne/Solfeggio/ambiência, sandbox InfinitePay com checkout/confirmação/webhook e recuperação independente do PNG original `1001196520.png`.
- Sem merge, publicação em produção ou cobrança real.
