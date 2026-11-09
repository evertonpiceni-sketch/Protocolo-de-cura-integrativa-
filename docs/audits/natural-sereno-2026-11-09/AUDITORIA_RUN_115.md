# Auditoria RUN 115 — Estilo 1: Natural Sereno

Data: 09/11/2026  
Branch de trabalho: `fix/natural-sereno-mainline-run111-2026-11-09`  
PR: #79  
HEAD de código/testes desta rodada: `e33f0995fe6dc9b70b79411a0a4fea3cd7bce0db`  
Base `main) consultada: `2d632fd8b274b80057e2e63616767d6fad92111e`

## Referência e precedência

A cópia versionada `docs/visual-qa/natural-sereno/reference.jpg` foi aberta e inspecionada. A prancha orienta composição e atmosfera, mas seus antigos blocos verdes/dourados saturados e tratamentos de logo não prevalecem sobre as decisões posteriores: creme/marfim, café/marrom, dourado refinado, sálvia apenas como acento e assinatura oficial transparente.

A busca na Biblioteca por `1001196520.png` e pelo ID `file_00000000317c820ebaad657dc3680de5` não recuperou o original nesta rodada. A referência versionada existente no repositório foi preservada; nenhuma imagem semelhante foi promovida como substituta.

## Corrigido

### 1. Expiração de acesso — proteção de pagamento/jornada

A rotina da Home verificava apenas a existência de `subscriptionPlan` e ignorava `subscriptionExpiresAt`. Além disso, o listener de clique podia considerar uma jornada explícita ativa antes de validar o acesso, permitindo que uma assinatura expirada continuasse passando pelo fluxo da Home.

Correções:
- A expiração é carregada tanto do cache local quanto de `/api/auth/me`.
- `hasCommercialAccess` rejeita datas expiradas ou inválidas.
- A regra existente de concessões administrativas/legadas sem data explícita foi preservada.
- A regra existente do plano `teste_vip_7d` não foi reinterpretada.
- A escolha de protocolo revalida o acesso no momento de salvar.
- O listener verifica acesso antes de liberar uma jornada já selecionada.
- A Home agenda uma atualização quando a expiração é alcançada; planos longos são rechecados em intervalos limitados.

### 2. Enquadramento das paisagens — desktop e mobile

Os assets de vale e cachoeira são verticais. O uso de `cover` em superfícies horizontais podia cortar o nascer do sol na prévia/Home e deslocar a cachoeira para fora do recorte do player desktop.

Correções:
- Card do seletor: vale em `center 35%`.
- Hero da Home: desktop em `center 35%`; mobile em `center 38%`.
- Player com cachoeira: desktop em `center 16%`; mobile preservado em `center 52%`.

As imagens originais e a estrutura responsiva foram preservadas; apenas o ponto focal foi ajustado.

### 3. Testes de regressão adicionados

- `tests/natural-sereno-entitlement-expiry.test.ts`: 6 verificações de expiração, concessão legada, regra VIP7, persistência e bloqueio de bypass.
- `tests/natural-sereno-landscape-framing.test.ts`: 3 verificações de enquadramento, referência e assets.
- `tests/natural-sereno-visual-guardrails.test.ts`: 4 verificações de paleta, ausência de tokens legados, botões premium e superfícies claras.

Total: 13 novos casos de teste. A execução oficial destes novos casos ainda está pendente.

## Preservado

- Paleta Natural Sereno: `#FAF7F2`, `#F5EFE5`, `#2A2421`, `#6B625B`, `#C89D52`, `#E2B96B`, `#A87E37`, `#6F7B55`.
- Folhas-base/mobile do Estilo 1 sem os tokens antigos `#063020`, `#e6c66e` e `#297241`.
- CTAs `.ns-gold` com raio de 18px, gradiente dourado refinado e texto café; controles circulares de reprodução e trilhos de sliders permanecem circulares por função.
- Logo oficial com wrapper transparente, 30% desktop e 26% mobile.
- Seletor sem estilo pré-selecionado, confirmação explícita e quatro opções oficiais. A prancha continua identificada como referência subordinada às decisões posteriores.
- Voz neural oficial Marianne nos fluxos do Natural Sereno; sem fallback silencioso para SpeechSynthesis.
- Solfeggio vinculado ao início real da narração e interrompido na pausa nos fluxos auditados.
- Diário, sincronização por conta, fila de gravação e invalidação entre abas.
- Player com cachoeira real, corpo/progresso neutro, seis etapas e respiração 4–3–5.
- InfinitePay, catálogo, cupons e regras de confirmação server-side sem alteração comercial nesta rodada. O bloqueio de operações fora de produção permanece até sandbox.
- Estilos 2, 3 e 4 sem redesenho ou alteração de paleta.

## Validação e limites

- Último GitHub Actions concluído antes desta rodada: run `42576036429`, no HEAD anterior `e686975768b8e13d4d50a31293f1106b0d96a694`; seus resultados não cobrem os novos commits/testes desta RUN 115.
- Não há execução GitHub Actions associada ao novo HEAD consultado até este registro.
- Check Vercel do novo HEAD: `failure / build-rate-limit`. Sem preview READY; não foi possível fazer homologação renderizada/pixel-a-pixel.
- A escuta real de Marianne, Solfeggio, ambiência, pausa/retomada e a homologação InfinitePay sandbox/webhook continuam pendentes.
- A inspeção visual desta rodada foi estática e baseada nos assets/código versionados; os novos pontos focais precisam ser confirmados em preview navegável antes de homologar.

## Integração

Comparação com a `main`: branch com 57 commits à frente e 7 atrás. Os commits posteriores da `main` incluem alterações compartilhadas em `App.tsx` e testes, além de decisões recentes de outros estilos. Não fazer merge automático: reconciliar essas alterações sem perder as decisões da Elegância Profunda, Essência Luminosa ou Místico Moderno.

**Estado:** PR #79 permanece aberta/em rascunho. Sem merge, publicação em produção ou cobrança real.
