# Reauditoria — Estilo 1: Natural Sereno — RUN 28

**Data:** 07/11/2026 (horário local)  
**Branch:** `fix/natural-sereno-mainline-2026-11-07d`  
**PR:** #62 — continuação sobre a `main` atual.

## Corrigido nesta rodada

### Concorrência do checkout de Numerologia
- Corrigido o achado P2 do review: o lock distribuído do Redis tinha TTL fixo de 30 segundos e não era renovado durante a criação do checkout.
- O lock agora renova o próprio TTL a cada 10 segundos por script Lua atômico, que só estende a chave quando o token ainda pertence à requisição atual.
- A verificação explícita renova/confirma a posse antes de reutilizar cache, recuperar pedido em preparação, persistir novo pedido e chamar a InfinitePay.
- Se a renovação falhar, o token mudar ou a chave já tiver expirado, a requisição falha fechada e não continua a criação do link.
- A liberação também compara o token antes de excluir a chave; uma requisição antiga não consegue apagar o lock adquirido por outra.
- O fallback local continua com liberação idempotente, sem alterar o comportamento de pedidos não relacionados à Numerologia.

### Testes adicionados
- Simulação de Redis comprova que o TTL permanece vivo após múltiplos intervalos de renovação e que a liberação remove o lock.
- Simulação de perda da lease comprova que `assertHeld()` rejeita a continuação do checkout.
- O teste de heartbeat usa uma janela de 300 ms e renovação de 40 ms para reduzir flakiness em CI.

## Preservado
- Correções visuais do Natural Sereno, seletor explícito dos quatro estilos, referência oficial versionada, paleta creme/marfim/café/dourado e verde-sálvia apenas como acento.
- Paisagem realista e enquadramento responsivo, assinatura discreta do logo, voz neural Marianne, política Solfeggio, Diário, player, seis etapas e movimento reduzido.
- Estilos 2, 3 e 4, conteúdos, preços e cupons aprovados.
- InfinitePay com `single_payment: true`, API Key exclusivamente server-side, payload original persistido, recuperação com o mesmo NSU/handle/URLs e confirmação server-side pelo valor exato.
- Links legados sem proteção de pagamento único continuam bloqueados para reutilização automática.

## Validação desta rodada
- Código e testes foram gravados na branch do PR #62.
- A execução de CI correspondente aos novos commits ainda não apareceu na consulta de workflow runs; portanto, os testes novos não são declarados aprovados nesta etapa.
- Não houve criação de checkout, chamada financeira real, cobrança, estorno, merge ou deploy de produção.

## Pendências para homologação
1. Confirmar CI completo no head atualizado (TypeScript, testes, build, auditoria de dependências e verificações de segurança).
2. Cadastrar `INFINITEPAY_API_KEY` oficial da mesma conta InfiniteTag no ambiente Vercel; a ausência da chave foi identificada nos metadados e o checkout permanece fail-closed.
3. Conciliar links antigos potencialmente multiuso diretamente na conta InfinitePay; a API não permite presumir que links legados tenham sido cancelados.
4. Homologar páginas renderizadas em desktop/mobile e escutar voz/ambiência em navegador; a validação estática não substitui esses testes.
5. Teste financeiro ponta a ponta exige compra real mínima e eventual estorno, pois a InfinitePay não oferece sandbox; nenhuma transação foi iniciada nesta rodada.

**Status:** correção do lock e testes de regressão preparados na PR #62. A PR permanece aberta, sem merge e sem publicação em produção.
