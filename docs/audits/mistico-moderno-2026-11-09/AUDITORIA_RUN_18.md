# Auditoria Estilo 4 — Místico Moderno — Run 18

**Data:** 09/11/2026  
**Base reconciliada:** `main` — `41724715950186ba1715b61e1e921a2dcd30a7d6`  
**Branch:** `fix/mistico-moderno-run15-mainline-2026-11-09`  
**Escopo:** reconciliar a auditoria com a `main` atual e corrigir apenas o seletor/acessibilidade visual. Sem merge em `main` e sem publicação.

## Corrigido

- Reconciliada a branch com a `main` atual. Os cinco commits posteriores à base anterior eram atualizações de proveniência/fotografia do Estilo 2; foram preservados, sem substituir a imagem aprovada nem alterar a paleta do Estilo 2.
- A prancha original `1001196522.png` foi localizada e conferida: **1536 × 1152 px, proporção 4:3**. O card do Místico Moderno agora mantém a mesma proporção, usa `object-contain` e não recorta a referência.
- CTA do Místico Moderno com raio retangular premium (`rounded-2xl`); os outros três estilos mantêm o tratamento anterior.
- Adicionada regra de movimento reduzido limitada a `data-layout="mistico-moderno"`, cobrindo animações e transições CSS, inclusive o pulso do palco do Arcanjo.
- Regressões acrescentadas para proporção 4:3, CTA e `prefers-reduced-motion`.

## Varredura estrutural

- **25 folhas CSS** do Místico Moderno importadas em `src/main.tsx`.
- **474 seletores** conferidos; todos contêm o escopo `data-layout="mistico-moderno"` (incluindo seletores `html[data-layout]` e `:root[data-layout]`).
- A prancha orienta a identidade visual, não substitui decisões posteriores: a jornada aprovada de **21 dias** foi preservada; não foi reintroduzida a indicação antiga de 12 dias que aparece na prancha.
- O logo permanece como assinatura discreta (30% desktop / 26% mobile), subordinado à composição.

## Preservado

- Estilos 1, 2 e 3; seus temas e componentes aprovados.
- Conteúdos, jornada de 21 dias, corpo neutro e fluxo de escolha explícita.
- Voz neural salva, bloqueio de fallback do dispositivo, sincronização do Solfeggio, player e Diário fechado por padrão.
- InfinitePay, preços, cupons, checkout, webhook e validação server-side; nenhum arquivo de pagamento foi alterado.

## Pendente

1. **Fotografia própria do Místico Moderno:** o repositório contém a prancha composta e a imagem do modelo de chakras, mas não um conjunto independente de fotografias de natureza aprovado para as telas. O fundo permanece noturno em gradientes; não reutilizei imagens da Reintegração, Natural Sereno ou Elegância Profunda.
2. **Homologação visual renderizada:** 12 superfícies em desktop e mobile, incluindo imagens, alinhamento, nitidez, botões e animações. O check Vercel do head anterior continua bloqueado por `build-rate-limit`; não forcei deployment.
3. **Homologação auditiva real:** voz neural salva no perfil, início/pausa/retomada/encerramento do player e Solfeggio em navegador/dispositivo.
4. **Pagamento:** checkout e webhook InfinitePay em sandbox. Nenhuma cobrança real foi feita.

**Estado:** PR permanece em rascunho; não mesclar nem publicar antes da homologação visual, auditiva e financeira.
