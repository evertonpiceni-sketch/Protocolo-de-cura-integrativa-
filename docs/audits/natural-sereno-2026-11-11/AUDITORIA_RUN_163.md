# Auditoria RUN 163 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`

## Corrigido

A reauditoria da Reintegração da Vida encontrou resíduos cromáticos na tela estática dos 21 dias. O shell, os modais, a navegação e a sessão imersiva já tinham overrides, mas alguns elementos ainda exibiam utilitários legados `#B88736` e `#8F631E`:

- título/etiquetas do cabeçalho interno e barra de progresso;
- destaque do cartão de voz e progresso do player;
- cor nativa do checkbox de aceite;
- bordas dos detalhes energéticos, rodapé e roteiro do dia.

Foi acrescentada uma camada final estritamente sob `:root[data-layout="natural-sereno"]` em `src/natural-sereno-approved-overrides.css`:
- dourado refinado `#A87E37` e `#C89D52`;
- gradiente de progresso `#A87E37 → #E2B96B`;
- superfícies marfim e café;
- bordas areia/dourado discretas;
- checkbox com `accent-color: #C89D52`.

O JSX compartilhado não foi alterado; os utilitários antigos permanecem disponíveis aos outros estilos, enquanto o Natural Sereno os neutraliza por escopo. Nenhum conteúdo, tempo de áudio, roteiro, preço ou regra funcional foi modificado.

## Preservado e reauditado

- Seletor React dos quatro estilos: sem pré-seleção; confirmação explícita antes de aplicar `data-layout`.
- Prancha Natural Sereno versionada em `docs/visual-qa/natural-sereno/reference.jpg`; elementos históricos de verde-floresta e corpo com chakras não foram reintroduzidos.
- Paisagem `vale-amanhecer.webp` inspecionada: fotografia natural de amanhecer e vale; enquadramentos responsivos já existentes foram preservados.
- Logo da Reintegração com opacidade `0.30`, como assinatura discreta.
- Silhueta humana neutra e percurso único de luz; sem chakras, mandalas ou marcadores coloridos.
- Marianne/ElevenLabs, autenticação das rotas de voz, política de Solfeggio, Diário, player, animações e proteções InfinitePay.
- Estilos 2, 3 e 4 sem alterações de tema.

## Proteção adicionada

Novo teste `tests/natural-sereno-run163-reintegration-active-surface.test.ts` com três verificações:
1. cobertura das superfícies ativas da Reintegração que ainda usavam ouro antigo;
2. isolamento de todos os seletores no Natural Sereno;
3. preservação do logo discreto e da silhueta neutra.

O arquivo de teste foi revisado após a criação para corrigir a extração da classe JSX e a divisão de linhas. **A suíte Node/TypeScript ainda não foi executada nesta rodada**; não declarar CI, TypeScript ou build aprovados.

## Pendências e limites

- GitHub Actions não retornava execução associada ao HEAD consultado antes desta intervenção. O novo commit deve ser conferido para saber se a PR disparou CI.
- Vercel: o último estado documentado na RUN 162 era `build-rate-limit`, sem Preview READY e com deployment anterior falhando em provisionamento. Não foi realizada nova consulta ao painel Vercel nesta rodada.
- QA renderizado página a página em desktop e mobile, incluindo enquadramento das paisagens.
- Escuta real de Marianne, transições Solfeggio/narração e teste ponta a ponta do Diário/player.
- InfinitePay sandbox, checkout e webhook. A RUN 162 registrou `INFINITEPAY_API_KEY` ausente no inventário e `PUBLIC_APP_URL` de Preview não configurada; sem reconsulta de variáveis nesta rodada. Nenhum checkout ou pagamento foi feito.
- Sem reconciliação automática dos 12 commits divergentes da `main`; sem merge, publicação em Production ou cobrança real.

## Commits desta rodada

- CSS da Reintegração: `5a01dd6c753ee600f176a82a3b499b3c7ceba647`
- Teste e guarda: `ae36028de8a28647be2870cedd5e95c4765ad0ad`, seguido da correção do próprio teste `bc5f3fe0f00fe95fc257cf9167c7115dd9e1933d`


## Snapshot após a primeira reauditoria do HEAD RUN 163

- Commit consultado: `3db695849cae8546162bb355347201448dc38369`.
- Comparação com `main`: 266 commits à frente e 12 atrás; histórico divergente. Nenhuma reconciliação automática.
- GitHub Actions PR-triggered: nenhuma execução associada ao commit consultado.
- Status checks: Vercel em `failure`; URL de status: https://vercel.com/evertonpiceni-sketch/protocolodecuraintegrativa/J1Rtmt67uoDE3M895dn5rbCr9eRp.
- A verificação estática independente dos arquivos desta rodada passou em 10/10 condições de escopo/integração. Isso não substitui a execução da suíte Node/TypeScript, CI, build ou homologação renderizada.
- A PR permanece aberta e em rascunho; nenhum merge, deploy de produção ou pagamento foi realizado.
