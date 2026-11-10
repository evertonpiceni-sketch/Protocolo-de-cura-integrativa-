# Auditoria RUN 143 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**Commit da correção de código:** `06ada083fc835f158dd8b6b6937fc656f6867adc`  
**Commit do teste de regressão:** `185406018134840460c5f31094e28025c9947d56`

## Corrigido nesta rodada

### Herança de ocre na Home por CSS dinâmico

A varredura encontrou três declarações antigas `#8F631E` em `src/lib/naturalSerenoHomeJourneyStateFix.ts`:

- legenda de `.ep-home-protocol-choice small`;
- legenda interna de `.ep-home-protocol-choice button span`;
- `.ep-home-recommended-label`.

Esse arquivo injeta um bloco de estilos com `document.head.appendChild(style)` durante `applyFlowState()`. Como a folha dinâmica entra depois das folhas CSS estáticas, os três tokens antigos podiam prevalecer sobre a camada final de overrides.

As três ocorrências foram substituídas por `#A87E37`, dourado escuro refinado aprovado. Nenhuma estrutura, texto, estado, callback, navegação ou regra de acesso foi alterada.

## Proteção contra regressão

Criado `tests/natural-sereno-home-flow-palette.test.ts`. O teste verifica:

- presença das três legendas dinâmicas;
- exatamente três declarações `color: #A87E37` no bloco;
- ausência de `#8F631E`, `#B88736` e `#D4AF37` nesse bloco;
- permanência da injeção dinâmica e do fluxo que aplica os estilos.

O teste entra no comando existente `npm test` por meio do padrão `tests/*.test.ts`. **Ainda não foi executado**, pois não há execução GitHub Actions associada ao novo HEAD.

## Reauditoria após a intervenção

A leitura posterior dos dois arquivos confirmou:

- zero ocorrências de `#8F631E` no patch dinâmico da Home;
- três ocorrências de `#A87E37` nos três pontos corrigidos;
- o teste cobre os três seletores e os tokens legados;
- o seletor inicial continua sem estilo aplicado: `layoutConfirmedThisSession` inicia falso, `selectedLayout` inicia `null`, e a confirmação permanece obrigatória;
- a referência do card continua ligada a `docs/visual-qa/natural-sereno/reference.jpg` com `object-contain`; o asset permanece no repositório. O PNG original não foi reaberto independentemente nesta rodada, portanto não foi feita comparação pixel a pixel;
- as paisagens, o corpo neutro, a assinatura discreta do logo e as correções anteriores do player/Arcanjo permanecem sem alteração.

## Preservado

- Paleta creme/marfim, café/marrom, dourado refinado e verde-sálvia somente como acento.
- Fotografia realista e enquadramentos responsivos existentes.
- Logo oficial sutil/transparente.
- Seletor explícito e prévias dos quatro estilos.
- Corpo neutro, movimento da luz, player, animações e respiração aprovados.
- Voz neural ElevenLabs, bloqueio de fallback robótico silencioso no Natural Sereno e política de Solfeggio.
- Diário e sincronização vinculada à conta.
- Regras, preços, cupons e proteções server-side da InfinitePay.
- Estilos 2, 3 e 4 sem alterações visuais.

## Pendente

1. **CI:** nenhuma execução de workflow foi retornada para o commit de teste. TypeScript, testes e build não foram declarados aprovados.
2. **Vercel:** o status do novo HEAD informa `Deployment rate limited — retry in 24 hours`. Não há Preview READY.
3. Homologação visual renderizada de todas as páginas em desktop e celular; as capturas existentes no repositório são históricas e não comprovam o HEAD atual.
4. Escuta em dispositivo da voz escolhida, ambiência e Solfeggio, incluindo pausa, retomada e conclusão.
5. Diário ponta a ponta com persistência real por conta.
6. InfinitePay sandbox: checkout, confirmação, webhook e recuperação de pedido.
7. Reconciliação seletiva dos 12 commits posteriores da `main`; não fazer merge/rebase cego nem substituir arquivos integralmente.

**Divergência verificada antes do commit documental:** 173 commits à frente / 12 atrás da `main`.  
**Sem merge, sem publicação em Production e sem cobrança real.**
