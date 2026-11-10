# Auditoria RUN 145 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**HEAD auditado antes da intervenção:** `2c463190188a976f3c21d9f5e0506c34d2847de4`

## Corrigido

A varredura encontrou uma herança relevante na tela de acolhimento:

- **Desktop:** ainda usava a fotografia da cachoeira com véu café escuro e texto claro. Isso contrariava a base creme/marfim aprovada e não correspondia ao tratamento claro já aplicado no mobile.
- **Paisagem:** desktop agora usa `/brand/natural-sereno/acolhimento.webp`, enquadrada em `center 42%`; o mobile mantém a mesma paisagem com enquadramento `center 46%`.
- **Leitura:** títulos em café `#2A2421`, texto secundário em `#6B625B` e véu creme translúcido.
- **Botão de áudio:** fundo marfim, dourado `#A87E37` e sombra discreta; removido o brilho amarelo forte.
- **Ferramentas:** ícone que ainda usava `#a4833e` passou ao dourado aprovado `#A87E37`.
- **Progresso do perfil:** trilha antiga `#e6ddbc` alinhada ao marfim `#E8E0D5`.
- **Estados hover:** `#E8C47D` substituído por `#E2B96B` nos dois arquivos finais do Natural Sereno.

As mudanças estão restritas ao Estilo 1. Não alterei conteúdo, jornada, handlers, áudio, dados, preços, cupons ou regras financeiras.

## Preservado

- Prancha oficial no card do seletor, com decisões posteriores prevalecendo. Chakras, corpo antigo e grandes superfícies verdes da prancha não foram reintroduzidos.
- Seletor dos quatro estilos sem pré-seleção; escolha e confirmação explícitas antes de aplicar `data-layout`.
- Home com natureza realista, cards claros, tipografia café e botões dourados.
- Paisagens do player e corpo neutro com percurso de luz.
- Logo oficial discreto/transparente como assinatura.
- Marianne/ElevenLabs, bloqueio de fallback robótico no Natural Sereno e política de Solfeggio.
- Diário, sincronização vinculada à conta, animações e respiração aprovadas.
- InfinitePay e suas proteções server-side.
- Estilos 2, 3 e 4 sem alterações visuais.

## Reauditoria estática

- O teste `tests/natural-sereno-welcome-surface.test.ts` cobre acolhimento desktop/mobile, contraste, botão, ícones de Ferramentas e tokens de hover.
- Os blocos CSS continuam escopados por `:root[data-layout="natural-sereno"]`.
- A releitura confirmou a remoção do véu escuro e do brilho amarelo forte no acolhimento.
- **O teste ainda não foi executado localmente nem em CI.** A conferência estática não equivale a build ou homologação renderizada.

## Pendente

1. GitHub Actions: verificar execução completa para o novo HEAD; não declarar teste/TypeScript/build aprovados sem resultado.
2. Vercel: o deployment anterior `dpl_HnxxPeBPpxaHwtYgx3Q2smz5Qtvp` terminou em `ERROR / BUILD_FAILED — Resource provisioning failed`, sem eventos de build disponíveis.
3. Preview READY e inspeção renderizada de todas as páginas em desktop e mobile.
4. Escuta em dispositivo de Marianne, ambiência e Solfeggio; testar pausa, retomada, conclusão e falha.
5. Diário ponta a ponta com persistência por conta.
6. InfinitePay sandbox: checkout, confirmação, webhook e recuperação de pedido.
7. Reconciliação seletiva dos 12 commits posteriores da `main`; não fazer merge/rebase cego.

**Divergência antes desta intervenção:** 175 commits à frente / 12 atrás da `main`.  
**Sem merge, sem publicação em Production e sem cobrança real.**
