# Auditoria RUN 138 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79

## Achado e correção

A varredura página por página encontrou uma regressão residual no modal **Prática Individual**. Os overrides existentes já neutralizavam a maior parte dos estados esmeralda, mas ainda escapavam:

- badge de recomendação com âmbar saturado e texto slate;
- painel de orientação terapêutica em índigo;
- faixa escura slate sobre a fotografia;
- foco dos campos ainda esmeralda;
- sombra verde em estados de sucesso.

Foi adicionada uma camada final restrita a `:root[data-layout="natural-sereno"] #specific-treatment-modal` em `src/natural-sereno-approved-overrides.css`:
- badge em dourado refinado `#E2B96B → #C89D52`, texto café;
- painel índigo convertido em creme/marfim com borda dourada suave;
- faixa da fotografia suavizada para marfim;
- foco em dourado refinado;
- ícones de sucesso em sálvia discreto;
- sombras convertidas para marrom neutro.

Nenhum conteúdo, preço, cupom, estado, handler ou integração de pagamento foi alterado.

## Proteção

Foi acrescentado teste em `tests/natural-sereno-visual-guardrails.test.ts` cobrindo os oito tokens que poderiam reintroduzir âmbar, índigo, slate ou verde saturado no modal e confirmando o escopo exclusivo do Natural Sereno.

## Preservado

- Card e prancha JPEG versionada, sem recorte; o PNG original ainda não foi recuperado em bytes independentes.
- Seletor dos quatro estilos sem pré-seleção, com escolha e confirmação explícitas.
- Paleta creme/marfim, café/marrom, dourado refinado e sálvia como acento.
- Paisagens, corpo neutro, logo discreto/transparente, player e animações.
- Voz Marianne/ElevenLabs e política de não sobrepor Solfeggio à narração.
- Diário e sincronização de perfil/progresso no mesmo snapshot.
- Preços, cupons e regras InfinitePay; nenhum pagamento foi iniciado.
- Estilos 2, 3 e 4 sem alterações.

## Pendências e limites

- A nova alteração ainda não possui execução Actions associada ao HEAD; o teste foi registrado, não declarado aprovado.
- Vercel apresenta apenas status de falha por limite de deployments; não há preview READY para inspeção visual renderizada.
- Falta escuta real de Marianne, ambiência e Solfeggio em dispositivo.
- Falta homologação InfinitePay em sandbox, incluindo checkout, confirmação e webhook.
- A branch permanece divergida da main em 154 commits à frente e 12 atrás; não foi feita reconciliação cega porque há alterações compartilhadas dos Estilos 2/3 e mudanças de pagamento/diário que exigem merge por arquivo.

**Sem merge, publicação em produção ou cobrança real.**
