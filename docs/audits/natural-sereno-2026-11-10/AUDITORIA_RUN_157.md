# AUDITORIA RUN 157 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho; sem merge.

## Corrigido nesta rodada

1. **Controles de áudio no cabeçalho:** os botões de silenciar/ativar e de ajustes ainda herdavam fundo âmbar, borda ocre e ícones `#8F631E`. No Natural Sereno agora usam marfim, café e dourado refinado, com acabamento retangular premium.
2. **Acentos do cabeçalho:** referências antigas a `#8F631E` e `#B88736` nos ícones do cabeçalho passam a usar `#A87E37`.
3. **Diário:** o botão Exportar mantém texto café também no hover; elimina a alternância para branco que destoava da diretriz aprovada.

Todas as regras novas estão sob `:root[data-layout="natural-sereno"]`. Nenhuma regra foi aplicada aos Estilos 2, 3 ou 4.

## Preservado e reauditoria estática

- Seletor dos quatro estilos sem pré-seleção, com prévias e confirmação explícita antes de aplicar o tema.
- Prancha de referência Natural Sereno exibida na prévia sem recorte; as decisões posteriores de creme/marfim, café, dourado refinado, verde como acento, corpo neutro e logo discreto prevalecem sobre elementos antigos da prancha.
- Home ativa, paisagens responsivas, acolhimento, Reintegração, corpo neutro, movimento da luz e animações.
- Voz Marianne na rota da Reintegração (`mJqP14JQFEK0PojR5lfV`); fallback robótico permanece desativado no player.
- Política Solfeggio/narração, player e sincronização do Diário preservados.
- Arcanjo permanece com abertura explícita.
- InfinitePay mantém validação server-side e `single_payment: true`; nenhuma regra de preço ou cupom foi alterada.

Foi criado `tests/natural-sereno-run157-header-audio-controls.test.ts` com quatro verificações. O teste foi adicionado, mas não foi executado por runner nesta rodada.

## Pendências e bloqueios

- **CI:** nenhuma execução GitHub Actions associada ao HEAD anterior foi retornada; a nova execução ainda precisa ser verificada.
- **Vercel:** projeto `protocolodecuraintegrativa` reporta `live:false`. O deployment mais recente do branch Natural Sereno disponível é do commit `b7f0f62`, estado `ERROR`, `BUILD_FAILED — Resource provisioning failed`; eventos de build retornaram vazios. O HEAD atual não possui Preview READY.
- **QA visual:** inspeção renderizada página a página em desktop/mobile e comparação pixel a pixel aguardam Preview funcional.
- **Áudio:** escuta real da Marianne, ambiência e Solfeggio ainda pendente.
- **Diário:** teste ponta a ponta ainda pendente.
- **InfinitePay:** a lista de variáveis do projeto não contém `INFINITEPAY_API_KEY`; `INFINITEPAY_HANDLE` está apenas em Production e não há `PUBLIC_APP_URL` específica para esta branch. Checkout e webhook sandbox não podem ser homologados; nenhuma cobrança foi feita.
- **Rota dedicada de voz:** `/api/reintegration-tts` aceita somente trechos pré-aprovados e tem rate limit por IP, mas o handler é executado antes do middleware autenticado de `server.ts`. Mantive esse fluxo sem alteração nesta rodada para não quebrar o modo local/offline; a política de acesso precisa de revisão específica antes da publicação.
- **Mainline:** a branch continua divergente da `main`; não fazer merge/rebase automático dos 12 commits posteriores sem reconciliação seletiva.

Sem merge, sem publicação em Production e sem cobrança real.
