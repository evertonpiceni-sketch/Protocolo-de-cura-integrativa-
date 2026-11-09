# Auditoria Estilo 1 — Natural Sereno | RUN 110

**Data:** 09/11/2026  
**Projeto:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `audit/natural-sereno-run97-mainline-2026-11-08`  
**HEAD desta rodada:** `0e9053343ca52f4f20fb438667c94682e3a14930`  
**PR:** #74 — aberta, draft, não mergeable.

## Achado crítico corrigido — P1: identidade da conta ausente

A revisão independente encontrou um risco real de isolamento entre contas. O endpoint `/api/auth/me` devolve o login em `data.user.login`, mas o perfil pode não conter `login`. O App mantinha esse perfil sem anexar a identidade externa. Em outra aba, a chave compartilhada do `localStorage` podia já representar a conta B enquanto o estado React ainda continha dados privados da conta A. O helper aceitava a chave B como fallback e poderia enviar o payload A com o cookie B.

## Corrigido nesta rodada

1. **`src/lib/userSync.ts`**
   - Removido o fallback que inferia a origem pela chave atual do `localStorage`.
   - A origem passa a ser somente a identidade capturada explicitamente na chamada ou o login presente no próprio perfil.
   - Se a identidade não existe no navegador, a sincronização falha fechada antes de fazer a requisição.
   - Se a chave explícita diverge do login do perfil, a chamada é rejeitada.
   - Cada requisição inclui `accountLogin` capturado no momento da chamada para validação server-side.

2. **`src/App.tsx`**
   - O perfil recebido em `/api/auth/me` recebe obrigatoriamente `login: account.login`, depois da mesclagem dos dados pendentes.
   - O perfil offline recebe `login: localAccount.login`.
   - O onboarding persiste e ativa um perfil com o login externo da conta.
   - A fila de perfil pendente usa a identidade do perfil ativo e confirma que ela ainda corresponde à sessão.
   - O cache local só grava quando identidade ativa e identidade do perfil existem e coincidem; não rotula mais um perfil sem login com a conta atual.

3. **`src/lib/naturalSerenoHomeJourneyStateFix.ts`**
   - Estado local e resposta remota recebem o login da conta externa.
   - Resposta remota só é aceita quando corresponde à identidade ativa.
   - Escolha de protocolo exige identidade de origem e a compara antes da sincronização e antes da gravação local.
   - Removido o fallback para `readLocalAccount()?.login`.

4. **`server.ts`**
   - `/api/user/sync` compara `accountLogin` com o usuário autenticado pelo cookie.
   - Ausência ou divergência retorna 403 `ACCOUNT_SESSION_MISMATCH`.
   - Se o perfil trouxer um login diferente do usuário autenticado, a API também rejeita a gravação.
   - O servidor grava o login autenticado no perfil persistido.

5. **Testes**
   - Acrescentados quatro cenários: ausência de identidade, divergência entre perfil e origem, envio de `accountLogin` e validação server-side.
   - Atualizada a expectativa da fila serializada para confirmar que todos os retries carregam a mesma identidade de origem.

## Preservado

- Prancha oficial `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`; escolhas históricas da prancha continuam subordinadas às decisões posteriores.
- Paleta Natural Sereno: creme/marfim, café/marrom, dourado refinado e sálvia somente como acento.
- Paisagens, enquadramentos, tipografia, CTAs premium e logo oficial discreto/transparente.
- Seletor dos quatro estilos sem pré-seleção automática e com confirmação explícita.
- Marianne — Meditação, Solfeggio, Diário, player, seis etapas, animações e respiração 4–3–5.
- Estilos 2, 3 e 4 sem redesenho ou alteração de regras comerciais.
- InfinitePay, preços, cupons, benefícios e endpoints; nenhuma cobrança foi iniciada.

## Reauditoria e limitações

- A inspeção de conteúdo confirmou que os cinco arquivos alterados contêm as novas proteções e que o fallback inseguro foi removido.
- **Não há execução de CI associada ao HEAD desta rodada.** Não declaro testes, TypeScript ou build aprovados.
- O status externo disponível continua sendo Vercel `build-rate-limit`; não há preview READY.
- A tentativa de clonar o repositório para rodar a suíte local falhou por indisponibilidade de resolução DNS de `github.com` neste ambiente.
- Capturas renderizadas página a página em desktop/mobile e escuta real da voz, Solfeggio e ambiência permanecem pendentes.
- Checkout, confirmação e webhook InfinitePay em sandbox permanecem pendentes.
- A revisão independente do novo HEAD foi solicitada; o apontamento P1 permanece aberto até parecer verificável.
- A branch está **137 commits à frente e 20 atrás** da `main`. Não fiz merge automático: a reconciliação precisa preservar as decisões posteriores dos Estilos 2/3/4 e não reintroduzir tokens antigos do Natural Sereno.

**Sem merge, publicação em produção ou cobrança real.**
