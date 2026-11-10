# Auditoria RUN 144 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**Base desta intervenção:** `54ef9c183465cd4046b6a6b3d10511d5c2ca0ab2`

## Corrigido

A varredura do fluxo interno da sessão encontrou heranças de paleta antiga que não estavam cobertas pelos overrides anteriores:

- **Portal de entrada:** brilho amarelo `#D4AF37`, acentos `#8F631E` e CTA com gradiente antigo/texto branco.
- **Check-in inicial/final:** opções selecionadas em marrom antigo com texto branco, títulos em ocre e CTA com gradiente anterior.
- **Roteiro secundário:** cartões ativos, marcador de etapa, selo “Em Execução”, destaque de mantra e botão de fechamento ainda usavam `#8F631E` / `#B88736`.
- **Player:** badge da etapa, botão “Roteiro”, marcadores de etapa e ícones/tempos de 15 segundos ainda herdavam o ocre antigo; o ícone do play mantinha preenchimento branco.
- **Estados de acesso/conclusão:** os ícones e o botão de retorno ainda usavam o marrom antigo.

As correções foram aplicadas em `src/natural-sereno-approved-overrides.css`, sempre sob `:root[data-layout="natural-sereno"]`. O drawer recebeu duas classes estruturais estáveis para evitar seletores frágeis. Os CTAs usam gradiente `#E2B96B → #C89D52`, texto café `#2A2421`, borda `#A87E37` e cantos de 18px. Badges e acentos usam dourado refinado, sem grandes superfícies verdes ou amarelas.

## Preservado

- Conteúdo, textos terapêuticos, ordem das etapas, check-ins, progresso e handlers.
- Narração neural, Marianne/ElevenLabs, política de Solfeggio, pausa/retomada e ambiência.
- Corpo neutro, movimento da luz, respiração e animações aprovadas.
- Paleta creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento.
- Paisagem realista, enquadramentos responsivos e logo oficial discreto/transparente.
- Seletor dos quatro estilos sem pré-seleção, exigindo escolha e confirmação explícitas.
- Diário e sincronização por conta; proteções e regras comerciais da InfinitePay.
- Estilos 2, 3 e 4 sem alterações visuais.

## Reauditoria estática

- O bloco novo contém apenas seletores iniciados por `:root[data-layout="natural-sereno"]`.
- O teste `tests/natural-sereno-session-subcomponents.test.ts` cobre portal, check-in, drawer, player, badge, estados de acesso e conclusão.
- A leitura posterior confirmou os ganchos estruturais do drawer e a presença dos seletores escopados.
- **O teste não foi executado localmente nem em CI nesta rodada.** A validação estática não equivale a build ou homologação renderizada.

## Pendente

1. GitHub Actions: não há execução PR-triggered retornada para o HEAD anterior; confirmar CI completa após esta intervenção.
2. Vercel: o status combinado do HEAD anterior está em falha, com destino indicando `build-rate-limit`; não foi criado deployment novo.
3. Preview READY e inspeção renderizada de todas as páginas em desktop e mobile.
4. Escuta em dispositivo de Marianne, ambiência e Solfeggio; testar pausa, retomada, conclusão e falha.
5. Diário ponta a ponta com persistência por conta.
6. InfinitePay sandbox: checkout, confirmação, webhook e recuperação de pedido.
7. Reconciliação seletiva dos 12 commits posteriores da `main`; não fazer merge/rebase cego.

**Divergência verificada antes desta intervenção:** 174 commits à frente / 12 atrás da `main`.  
**Sem merge, sem publicação em Production e sem cobrança real.**
