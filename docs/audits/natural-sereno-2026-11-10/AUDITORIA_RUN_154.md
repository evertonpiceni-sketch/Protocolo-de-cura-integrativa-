# Auditoria RUN 154 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD auditado:** `27965d0fec236638ab029faebdbc0d7da34006f5`

## Corrigido

A varredura do caminho efetivamente montado pelo App encontrou duas superfícies que as auditorias anteriores não cobriam:

1. **Home ativa (`TransformationHome`)**
   - `.ep-home-hero`, `.ep-luxury-card` e `.ep-subcard` ainda herdavam os fundos verde-floresta globais de `src/index.css`.
   - O texto da afirmação do dia usava `#f2e7c6` sobre fundo marfim, com contraste insuficiente.
   - O acolhimento não usava a paisagem realista do Natural Sereno.
   - O logo aparecia dentro de disco/moldura branca.
   - CTAs herdavam o gradiente mais amarelo e texto verde global.
   
   **Correção:** camadas creme/marfim e café, paisagem `var(--ns-valley)` com enquadramento desktop/mobile, cartões claros, progresso bege/dourado, contraste da afirmação corrigido, CTAs `#E2B96B → #C89D52` com texto café e cantos de 18px. Logo sem disco/moldura, imagem a 30% de opacidade.

2. **Reintegração da Vida — 21 dias (`PersonalJourney21`)**
   - `.ep-reintegration-panel` e `.ep-reintegration-card` herdavam painéis verde-floresta globais.
   - A sessão imersiva usava azul-noturno para Natural Sereno, com textos claros e amarelo forte.
   - O contêiner da arte corporal herdava fundo verde escuro.
   - Alguns controles estavam em formato de pílula.
   
   **Correção:** painéis marfim, texto café, estados selecionados em dourado refinado, fundo do visual corporal marfim e sessão imersiva em creme com camada de leitura quente. A fotografia dinâmica de cada dia, o corpo neutro, as animações e o funcionamento do áudio foram preservados. Controles usam cantos de 14px e CTA de 18px.

Todas as regras novas estão limitadas a `:root[data-layout="natural-sereno"]`; a Reintegração também exige o contêiner `data-ep-reintegration`. Os estilos 2, 3 e 4 não recebem essas regras.

## Preservado

- Seletor explícito dos quatro estilos, sem pré-seleção e com confirmação obrigatória.
- Prancha oficial versionada `docs/visual-qa/natural-sereno/reference.jpg`; a inspeção anterior registrou correspondência visual com o PNG original. Não foi feita comparação pixel a pixel nesta rodada.
- Identidade Natural Sereno: creme/marfim, café/marrom, dourado refinado e verde-sálvia somente como acento.
- Logo oficial discreto/transparente.
- Conteúdos, roteiros, dias da Reintegração, corpo neutro, movimento da luz e animações.
- Voz neural/Marianne, política Solfeggio, Diário, player principal e abertura explícita do Arcanjo: nenhuma lógica alterada nesta rodada.
- Rotas, preços, cupons, locks e confirmação server-side da InfinitePay: nenhum código financeiro alterado.
- Estilos 2, 3 e 4 sem alteração de tema.

## Reauditoria estática

- 8 testes de regressão definidos em `tests/natural-sereno-active-home-reintegration.test.ts`.
- CSS: 403 pares de chaves e 587 pares de parênteses conferidos no arquivo final.
- Escopo RUN 154 confirmado exclusivo do Natural Sereno.
- Camada `natural-sereno-approved-overrides.css` continua depois das camadas antigas do Estilo 1.
- **Os testes ainda não foram executados pelo runner ou GitHub Actions.** A conferência estática não equivale a CI aprovada nem a QA renderizado.

## Pendente

- GitHub Actions: nenhuma execução PR-triggered associada ao HEAD `27965d0`.
- Vercel: check atual em falha `build-rate-limit`; sem Preview READY.
- Homologação renderizada página por página em desktop e mobile.
- Reprodução real da Marianne, ambiência e Solfeggio; teste ponta a ponta do Diário.
- InfinitePay sandbox, confirmação e webhook; nenhuma cobrança foi realizada e a configuração de credenciais não foi revalidada nesta rodada.
- Comparação automatizada de pixels com o PNG original.
- Reconciliação seletiva dos 12 commits posteriores da `main`; não fazer merge/rebase automático, pois há decisões aprovadas dos outros estilos e proteções que precisam ser preservadas.

## Segurança e publicação

PR #79 permanece aberta, em rascunho e não mergeable. A branch está 210 commits à frente e 12 atrás da `main`. Sem merge, sem publicação em Production e sem pagamento real.
