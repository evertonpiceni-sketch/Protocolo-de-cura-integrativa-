# Auditoria de pagamentos — 23/10/2026

Branch: `integracao-infinitepay-protocolo`, base `94bae32`. Etapa técnica local concluída; **aprovação comercial e deployment final pendentes**. Não houve pagamento real nem liberação comercial com base em simulação. Não alterar/mesclar `main` até concluir a validação externa.

## Divergências corrigidas

1. Servidor local respondia 503 enquanto o catch-all da Vercel tinha outra implementação. Agora usam o mesmo roteador de autenticação e pagamentos.
2. O backend ignorava `specific_treatment`. Agora aceita práticas específicas com preço, duração e cupom calculados no servidor. PIX pessoal/manual e preço fixo incorreto foram removidos dessa compra.
3. Login concluído não atualizava `isLoggedIn`; um reload global mascarava o problema. Estado corrigido e hack de reload retirado.
4. Existindo API key, o código omitia `handle` obrigatório. Contrato público atualizado: `POST https://api.checkout.infinitepay.io/links`, com handle, items, order_nsu, redirect_url e webhook_url. A documentação pública não exige `X-Api-Key` nesse fluxo.
5. Pedidos financeiros estavam em perfil gravável pelo cliente. Pedidos canônicos ficam no servidor; sync não substitui direitos, transações ou dados de pagamento.
6. Worker aquecido podia desconhecer novas contas. A entrada serverless atualiza o banco; gravação usa compare-and-set e merge para preservar pagamentos concorrentes. Comando CAS é enviado no corpo POST, evitando incluir banco/dados privados na URL.
7. Confirmação confere `success === true`, `paid === true`, valor inteiro esperado, pedido, usuário e transação única; aplica expiração. Redirect sozinho não concede acesso. Webhook e retorno consultam `payment_check`. Webhook ainda não confirmado retorna 400, conforme o contrato de nova tentativa do provedor; consulta autenticada mantém 202 para pendência.
8. Pedidos têm estados creating/pending/checkout_failed/expired/paid, validade de 30 minutos para tentativa pendente e reaproveitamento seguro de checkout pendente. A expiração da tentativa não invalida uma transação posteriormente comprovada pelo provedor. Históricos financeiros não foram apagados.
9. Rate limits próprios de criação, consulta e confirmação; limitadores em memória por instância. Rate limit distribuído não foi validado com infraestrutura real.
10. PROMO15/PROMO20 validados no servidor. VIP7 concede sete dias, impede segundo resgate e preserva o limite existente da campanha. Nenhum checkout pago é criado para ativação VIP7.
11. Navegação de Práticas Específicas restaurada. Natural Sereno recebeu correção CSS restrita às superfícies de pagamento, aos destaques excessivos e à camada que ocultava a imagem da prática; nenhum redesign.
12. Configurações lançava exceção ao ler frequência ausente em perfil parcial. Proteção adicionada apenas à leitura desse campo em Configurações. Nenhum componente/fluxo do Mini Diagnóstico foi modificado.
13. Dependências Vite e ip-address atualizadas para patches de segurança. Removida declaração duplicada de Vite em dependencies; permanece ferramenta de desenvolvimento/build.

## Evidência local

- TypeScript: `npm run lint`.
- Testes: `npm test`, 37 aprovados. Cobrem autenticação real HTTP, as duas entradas da API, adulteração de preço, cupons, VIP7/expiração, pagamento pendente/valor divergente, webhook idempotente, conta errada, tentativa duplicada, falha do provedor, limites e concorrência no banco com Upstash simulado.
- Build: `npm run build`.
- Auditoria npm completa, incluindo desenvolvimento: zero vulnerabilidades após os patches.
- Primeira varredura: 63 cenários em 320/390/1365 px; sete não abriram porque a fixture tinha outro protocolo selecionado. Fixture ajustada para o protocolo correto; sete cenários reexecutados com sucesso, sem mudar a regra do produto.
- Reauditoria de menu, planos, práticas e sete cenários anteriores em 320/390/768/1365/1920 px: sem overflow horizontal ou controles sem nome. Telas afetadas conferidas visualmente. Isto não equivale a aprovação visual global dos quatro estilos, nem a escuta integral dos players.
- Navegador com autenticação real local: login → refresh preservado → menu → prática de 7 dias → PROMO20 → servidor calcula R$47,92 → navegação para URL oficial interceptada no teste → retorno ao app → Configurações → VIP7 → servidor registra expiração em sete dias. API externa simulada; **não é prova de checkout InfinitePay real**. Evidência em `infinitepay-2026-10-23/browser-payment-fixture.json`.
- Capturas representativas de planos/prática em `infinitepay-2026-10-23/`. Script de varredura: `scripts/audit-layout1.cjs`, aceita `AUDIT_FILTER`, `AUDIT_WIDE=1`, `AUDIT_SCROLL=1` e `PLAYER_QA_FONTS`.
- Telemetria Vercel retorna 404 na prévia local; isso não representa a disponibilidade do endpoint na Vercel.

## Bloqueios externos e próximos passos obrigatórios

- A política efetiva deste ambiente não permite `api.checkout.infinitepay.io` (CONNECT 403). A inclusão do domínio foi salva em rascunho de configuração, mas ainda precisa ser revisada/publicada nas configurações do ambiente. Não se utilizou endpoint legado para contornar o bloqueio.
- Sem credenciais/conector Vercel, não foi possível conferir ou alterar variáveis reais Preview/Production. Confirmar `INFINITEPAY_HANDLE=evertonterapeutareiki`, `PUBLIC_APP_URL`/`APP_URL` do ambiente correto, JWT_SECRET estável e persistência Upstash. O contrato público adotado não usa API key; ausência dela não é tomada isoladamente como causa do erro.
- O erro relatado “conta não cadastrada” tem uma causa possível concreta corrigida (omissão de handle). O reconhecimento real da conta precisa ser confirmado pelo provedor. Não trocar o destinatário por hipótese.
- Um checkout legado previamente emitido abriu “Página não encontrada”; isso não comprova que a InfiniteTag esteja errada. Validar novo link no contrato atual.
- Validar preview efetivamente publicado antes de qualquer consolidação em produção. Conferir cookie/sessão no domínio real e no retorno InfinitePay.
- Completar transações controladas PIX/cartão, parcelamento até 12x conforme conta InfinitePay, retorno, webhook/payment_check, valor, produto e expiração gravada. Testar atraso e repetição do webhook. Nenhum destes testes reais foi declarado aprovado.

Seguir `docs/DECISOES_VIGENTES_2026-10-23.md`. Estilos 2/3/4, áudio e demais etapas do Relatório-Mestre continuam pendentes; Mini Diagnóstico permanece fora do escopo.
