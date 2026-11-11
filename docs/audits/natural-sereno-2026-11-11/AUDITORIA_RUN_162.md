# Auditoria RUN 162 — Estilo 1: Natural Sereno
**Data:** 11/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`

## Corrigido

- A auditoria dos componentes efetivamente montados dentro da Reintegração encontrou dois modais compartilhados que ainda mantinham o canvas `#F8F4EC`, rótulos em ouro antigo `#B88736`, CTAs âmbar com texto branco e filtros de duração em formato de pílula.
- Foi acrescentada uma camada CSS restrita a `:root[data-layout="natural-sereno"]` e aos modais da Reintegração:
  - canvas `#FAF7F2` e texto café;
  - rótulos em dourado escuro `#8A642E`, com contraste adequado;
  - filtros e CTAs em dourado refinado `#E2B96B / #C89D52`, texto `#2A2421`;
  - controles com cantos de 12px e foco visível.
- O conteúdo, as perguntas, a ordem das práticas e as animações dos componentes não foram alterados.
- Adicionado teste de regressão para os dois modais e corrigida a verificação de escopo do teste para não usar expressão regular escapada incorretamente.

## Preservado e reauditado

- O seletor React dos quatro estilos permanece obrigatório e sem pré-seleção. Em `App.tsx`, o tema só é aplicado depois de `layoutConfirmedThisSession`; antes disso, `data-layout` é removido e a barra do navegador permanece neutra.
- Natural Sereno continua com creme/marfim, café, dourado refinado, natureza realista e verde apenas como acento.
- Home, paisagens, logo discreto, corpo neutro, movimento da luz, conteúdo público dos 21 dias e player foram preservados.
- Marianne permanece como voz oficial (`mJqP14JQFEK0PojR5lfV)); as duas rotas de narração consultadas exigem usuário autenticado. A reprodução real ainda não foi ouvida nesta rodada.
- A política de Solfeggio continua impedindo frequências tonais durante narração/preview neural; a sincronização do Diário e as proteções de pagamento foram preservadas.
- Nenhum arquivo de tema dos Estilos 2, 3 ou 4 foi alterado nesta rodada.

## Pendências e limites

- A busca da Library pelo ID exato `file_00000000317c820ebaad657dc3680de5` não retornou o arquivo. Foi encontrado e inspecionado um painel com título semelhante, mas ID diferente; ele não foi usado como substituto. A derivação `docs/visual-qa/natural-sereno/reference.jpg` continua referenciada no seletor. A comparação pixel a pixel com o arquivo original permanece pendente.
- Não há Preview para o HEAD atual. A última implantação consultada da branch, no commit `3594cd832c38f6783f48baf3d3e7fd100648703c`, terminou em `BUILD_FAILED — Resource provisioning failed`; os eventos de build vieram vazios. Não foi encontrada implantação para o HEAD atual.
- Não há execução GitHub Actions associada ao HEAD consultado; portanto, o teste novo, TypeScript e build não estão declarados como aprovados.
- A homologação visual renderizada em desktop/mobile, a escuta de Marianne/Solfeggio e os testes ponta a ponta do Diário/player permanecem pendentes.
- No Vercel, `INFINITEPAY_API_KEY` não aparece no inventário; `INFINITEPAY_HANDLE` está apenas em Production e `PUBLIC_APP_URL` não está configurada para Preview desta branch. O checkout permanece fail-closed; não foi feito checkout nem cobrança.
- A branch continua divergente da `main` (12 commits atrás no comparativo desta auditoria). Não foi feito merge, rebase ou publicação em Production.

## Commits desta rodada

- CSS dos modais: `c0c5b71a2294b598f6554b2c41763f1274abb602`
- Teste de regressão: `43a131c8e069941365c69159ed1839b16f760479`
- Correção da guarda do teste: `8be97538e83ebda84360dcb82736509a4e7804a1`
