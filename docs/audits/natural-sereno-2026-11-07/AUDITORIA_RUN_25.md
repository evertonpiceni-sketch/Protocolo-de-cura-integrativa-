# Reauditoria — Estilo 1: Natural Sereno — RUN 25
**Data:** 07/11/2026  
**Base:** `main` em `2ef847a14a6edf26fe4d199c25a751e75504f3cb`  
**Branch:** `fix/natural-sereno-mainline-2026-11-07d`

## Corrigido
- Recriada a correção sobre a `main` atual, em vez de tentar mesclar a branch anterior. O PR #58 estava 14 commits atrás e 16 à frente da base, portanto foi tratado como versão divergente e não como fonte para sobrescrever a `main`.
- Aplicadas as correções visuais finais do Natural Sereno na cascata de tema e na Home: superfícies creme/marfim, café e dourado refinado; verde apenas em acentos; CTA premium sem pílula; paisagem responsiva preservada.
- A referência visual versionada `docs/visual-qa/natural-sereno/reference.jpg` foi aberta e conferida. Continua ligada à prévia do Natural Sereno no seletor. A prancha permanece subordinada às decisões posteriores que retiraram grandes chapas verdes/amarelas.
- O modelo legado `naturalSerenoHomeApprovedModel.ts` foi mantido para lógica de navegação/estado, mas suas regras visuais antigas foram alinhadas à paleta aprovada, em vez de depender somente de uma máscara CSS posterior.
- Player: canvas do Natural Sereno recebe a paleta própria creme/café/dourado e sálvia, sem alterar a geometria das seis etapas nem os demais estilos.
- Numerologia: checkout InfinitePay com preço fixo de R$ 90,00 no servidor; valor do navegador ignorado; cupom/valor personalizado recusados; confirmação só libera o mapa após validação do valor exato.
- Corrigido o achado P2 do checkout: pedidos sem link com mais de 5 minutos (ou data inválida) são encerrados como falhos e podem ser refeitos; pedidos recentes continuam protegidos contra duplicidade; cache Redis só é reutilizado se corresponder a pedido ainda pendente e com link persistido.
- Adicionados testes de regressão para o prazo de recuperação, paleta na origem da Home, seletor, camadas por página, player, Diário e pagamento.

## Preservado
- Escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno; nenhum tema é aplicado antes da confirmação.
- Logo oficial como assinatura sutil/transparente, sem competir com a composição.
- Voz neural aprovada e normalização Natural Sereno já presentes na `main` (commit `e26ccdbb`); IDs ElevenLabs válidos salvos no perfil são preservados, sem fallback silencioso para SpeechSynthesis.
- Solfeggio não sobrepõe a narração; ambiência não tonal permanece permitida.
- Diário e sincronização, seis etapas do player, animações e `prefers-reduced-motion`.
- Camadas já aprovadas para marcos, guias, contato e painel do Diário.
- Correção de dependências de segurança já presente na `main` (commit `8dbf6f5e`), sem reintroduzir o lockfile vulnerável da branch antiga.
- Estilos 2, 3 e 4 e seus componentes permanecem intocados.

## Pendente
- CI da nova branch/PR ainda precisa executar após a publicação dos commits.
- Capturas renderizadas página a página em desktop e mobile; a Vercel havia recusado prévias por limite diário de deployments. A validação estática não substitui a inspeção visual em navegador.
- Escuta real da voz/ambiência no navegador.
- Checkout, retorno e webhook InfinitePay em sandbox, sem cobrança real.

**Status:** correções preparadas sobre a base atual. Nenhuma alteração foi mesclada ou publicada em produção; nenhuma cobrança foi realizada.
