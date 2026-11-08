# Reauditoria — Estilo 1: Natural Sereno — RUN 27

**Data:** 07/11/2026  
**Branch:** `fix/natural-sereno-mainline-2026-11-07d`  
**PR:** #62 — correções sobre a `main` atual, sem recuperar a branch divergente #58.

## Corrigido

### Identidade visual e superfícies
- Removidos os dois últimos resíduos identificados na Home: sombra com tonalidade verde-escura e contorno amarelo-pálido do cartão do dia. Ambos agora usam café/marrom e dourado refinado.
- Varredura estática de 152 regras em `natural-sereno-approved-overrides.css` e 23 regras em `natural-sereno-home-surface-audit.css`: 175/175 regras permanecem escopadas a `data-layout="natural-sereno"`; nenhum seletor global foi encontrado.
- Referências hexadecimais verde/amarelo que ainda aparecem no override são somente seletores de classes legadas que precisam ser capturadas e remapeadas; os valores de saída dessas regras são creme/marfim, café, dourado ou sálvia.
- Home mantém fotografia de natureza realista, `cover` e recortes próprios: desktop em 52%, mobile em 54%. O card do seletor continua ligado à prancha versionada `docs/visual-qa/natural-sereno/reference.jpg`; a imagem de natureza da prévia usa `/brand/natural-sereno/vale-amanhecer.webp`.
- Botões principais da Home e confirmação do Natural Sereno mantêm acabamento retangular premium de 18 px. A escolha de outro estilo não recebe essa alteração.

### InfinitePay — dois achados de segurança corrigidos
- Todos os novos links passam a incluir `options.single_payment: true` e o servidor envia a API Key exclusivamente no header `X-Api-Key`.
- A criação de checkout falha de forma fechada quando `INFINITEPAY_API_KEY` não está configurada; não gera pedido nem chama o provedor nessa condição.
- O payload original do checkout (handle, order NSU, URLs, itens, preço e opção de pagamento único) é persistido no pedido antes da chamada ao provedor.
- Recuperação de pedido interrompido reutiliza esse payload persistido, sem reconstruir URLs ou handle a partir de variáveis que possam ter mudado.
- Cache Redis e links reutilizados só são aceitos quando o pedido persistido comprova `single_payment: true`.
- Pedidos antigos com link sem essa proteção ou pedido em preparação sem payload original são bloqueados para conferência; não são reutilizados nem reconstruídos automaticamente.
- A confirmação de pagamento continua validando no servidor o NSU, a transação e o valor exato antes de liberar acesso.

### Testes adicionados
- API Key ausente: checkout retorna 503 sem criar pedido nem chamar o provedor.
- API Key no header e `single_payment: true` no payload.
- Recuperação após interrupção, mesmo NSU e payload idêntico apesar de alteração posterior de handle/URL.
- Bloqueio de link legado multiuso e de pedido antigo sem payload original.
- Regressão visual para impedir o retorno da sombra verde e do contorno amarelo.

## Preservado

- Seletor explícito dos quatro estilos — Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno — sem pré-seleção e sem aplicar tema antes da confirmação.
- Paleta Natural Sereno creme/marfim, café/marrom e dourado refinado; verde-sálvia apenas como acento natural.
- Logo oficial como assinatura sutil: 30% desktop e 26% mobile.
- Voz neural aprovada Marianne — Meditação (`mJqP14JQFEK0PojR5lfV`); IDs ElevenLabs válidos salvos no perfil são preservados e o fluxo Natural Sereno não usa fallback silencioso para SpeechSynthesis.
- Solfeggio não toca simultaneamente à narração; ambiência não tonal continua permitida.
- Diário e sincronização, seis etapas do player, animações, cadência 4–3–5 e `prefers-reduced-motion`.
- Estilos 2, 3 e 4, conteúdos, preços e cupons vigentes não receberam redesenho ou alteração de paleta nesta rodada.

## Validação concluída

GitHub Actions — **Security Audit #1582**, execução `42435877934`, commit `86e9baa809821fb6ea9b73393e4a037361d64ea6`:
- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **120/120 aprovados**.
- Build: aprovado.
- Entry points Vercel, padrões de segredos, JWT, cadastro/admin, smoke tests e endpoints de pagamento fail-closed: aprovados.

## Pendente para homologação

1. **API Key:** a listagem de metadados das variáveis Vercel não contém `INFINITEPAY_API_KEY`. A consulta não descriptografou nem leu valores secretos. Até a chave oficial da mesma conta da InfiniteTag ser cadastrada no ambiente Vercel, os novos checkouts permanecem bloqueados de propósito.
2. **Links legados:** links criados antes de `single_payment` podem continuar multiuso. A documentação InfinitePay informa que links já criados não podem ser cancelados pela API e que links sem `valid_until` não expiram. É necessária conciliação dos pedidos antigos na conta InfinitePay; não os tratamos como revogados.
3. **Teste financeiro:** a documentação oficial informa que a InfinitePay não oferece sandbox; o botão de teste cria um link real. Nenhuma cobrança foi feita. Um teste ponta a ponta exige autorização para uma compra real de baixo valor (mínimo R$ 1,00) e eventual estorno.
4. **Validação visual e auditiva:** a Vercel recusou a prévia pelo limite diário de deployments (mais de 100). Sem preview não há capturas renderizadas de todas as páginas em desktop/mobile nem escuta real da voz/ambiência. A análise atual é estática e automatizada; não é homologação visual/auditiva.

## Status

Correções de código e CI concluídas nesta rodada. PR #62 continua aberto, sem merge e sem deploy de produção. Nenhuma cobrança real foi realizada.
