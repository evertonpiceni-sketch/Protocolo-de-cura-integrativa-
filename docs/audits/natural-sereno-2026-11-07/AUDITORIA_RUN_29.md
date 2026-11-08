# Reauditoria — Estilo 1: Natural Sereno — RUN 29

**Data:** 07/11/2026 (horário local)  
**Branch de homologação:** `fix/natural-sereno-mainline-2026-11-08-rebased`  
**PR atual:** #64 — substitui o PR #62, sem merge.

## Corrigido nesta rodada

### Base aprovada e regressão entre estilos
- Foi identificado que a branch anterior estava 15 commits atrás de `main` e não carregava as correções mais recentes de prévia neural/áudio já aprovadas para os Estilos 2, 3 e 4.
- Criada uma branch de homologação a partir da linha atual de `main`; reaplicados os arquivos do escopo Natural Sereno e conciliado o teste compartilhado da Essência Luminosa.
- O cabeçalho do seletor voltou ao tom neutro aprovado antes da confirmação.
- A folha de auditoria da Home agora declara explicitamente a superfície `.ns-home-content` e o CTA premium com gradiente dourado aprovado.

### Recuperação de checkout após falha de persistência
- O pedido padrão (assinatura ou prática específica) é persistido com o payload original antes da chamada à InfinitePay.
- Se a resposta do provedor trouxer a URL mas a gravação final falhar, o pedido não é marcado como falho nem substituído por um novo NSU.
- Uma nova tentativa igual localiza o pedido pendente, compara produto/preço/método e, para prática específica, duração/categoria/título/descrição/demandas; então reenvia exatamente o payload original.
- O contador `checkoutRecoveryAttempts` é persistido antes do replay. É permitido apenas um replay automático; se a recuperação também falhar, o sistema bloqueia novas tentativas e exige conciliação manual para não multiplicar links.
- Links legados sem `single_payment` permanecem bloqueados para reutilização ou substituição automática.
- A injeção de persistência no handler permite testar a falha exatamente depois de o provedor devolver a URL.

## Preservado
- Prancha oficial Natural Sereno versionada e usada na prévia do seletor.
- Escolha explícita dos quatro estilos, sem aplicar tema antes da confirmação.
- Creme/marfim, café, dourado refinado e verde-sálvia apenas como acento; paisagem realista com recorte desktop/mobile; tipografia nítida; botões premium; logo oficial sutil.
- Diário e persistência, player de seis etapas, animações, movimento reduzido e política de áudio.
- Voz neural Marianne/ID oficial, sem fallback silencioso para a voz do navegador no protocolo.
- Solfeggio não sobreposto à narração; ambiência não tonal permitida.
- Atualizações atuais da `main` para Estilos 2, 3 e 4, incluindo o estado compartilhado de prévia neural.
- InfinitePay com `single_payment: true`, API Key exclusivamente server-side, confirmação server-side por valor e transação exatos, lock Redis de Numerologia com renovação por token.

## Limitação externa importante — InfinitePay
A documentação oficial informa que:
- `order_nsu` identifica o pedido, mas não é uma consulta de link;
- a API não oferece consulta nem cancelamento de link por `order_nsu`;
- reenviar uma requisição idêntica **pode** devolver o mesmo link, sem garantia de replay;
- links sem `valid_until` não expiram automaticamente.

Por isso, a aplicação faz apenas um replay idêntico e, depois dele, exige conciliação manual. Links antigos potencialmente multiuso precisam ser conferidos na conta InfinitePay.

Referência: https://ajuda.infinitepay.io/pt-BR/articles/10766888-como-usar-o-checkout-integrado-da-infinitepay

## Validação e pendências

GitHub Actions — **Security Audit #1623**, execução `42439280797`, head `1e6ebb6d9d7c58e4e7bb4d6d62b703ba1a200581`:
- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **123/123 aprovados**, incluindo lock renovável, recuperação pós-falha de persistência, assinatura, prática específica e bloqueio após o único replay automático.
- Build: aprovado.
- Entry points Vercel, verificações de segredos/JWT/autenticação, smoke tests e endpoints de pagamento fail-closed: aprovados.
- Job completo: sucesso.
- Varredura das duas folhas CSS do Natural Sereno: 175 regras na folha de overrides e 16 na folha da Home; **0 seletores globais** e **0 valores de saída** nas tonalidades antigas de verde-floresta/amarelo.

Pendências externas:
- A Vercel recusou nova prévia por `api-deployments-free-per-day` (mais de 100 deployments; retry após 24h).
- `INFINITEPAY_API_KEY` continua ausente nos metadados do projeto Vercel; o checkout permanece fail-closed.
- Sem prévia, ainda faltam capturas reais de todas as páginas desktop/mobile e escuta da voz/ambiência no navegador.
- A revisão automática solicitada para o head final ainda não retornou; o P2 anterior foi corrigido e seu thread está resolvido.
- Não houve checkout real, cobrança, estorno, merge ou deploy de produção.

**Status:** código e regressões aprovados pelo CI no PR #64. A homologação visual/auditiva e financeira permanece pendente.
