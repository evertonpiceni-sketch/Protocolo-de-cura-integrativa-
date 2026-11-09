# Auditoria Estilo 1 — Natural Sereno | RUN 110

**Data:** 09/11/2026  
**Projeto:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `audit/natural-sereno-run97-mainline-2026-11-08`  
**HEAD de código/testes:** `1a4bc679b23207caae2a152306cf2d5be7cb3be0`  
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
   - O cadastro e o reenvio de campos pendentes também incluem o login de origem no perfil enviado.
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
   - Se o perfil trouxer login ausente ou divergente do usuário autenticado, a API rejeita a gravação.
   - O servidor grava o login autenticado no perfil persistido.

5. **Testes**
   - Acrescentados cinco cenários: ausência de identidade, perfil sem login mesmo com chave de aba, divergência entre perfil e origem, envio de `accountLogin` e validação server-side.
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

Validação executada em sandbox isolado Vercel, Node 22, no HEAD de código/testes `1a4bc679b23207caae2a152306cf2d5be7cb3be0`:

- `npm test`: **201/201 aprovados**.
- `npm run lint`: `tsc --noEmit` aprovado, sem erros.
- `npm run build`: Vite + esbuild aprovados; **2.250 módulos transformados**.
- `npm audit --audit-level=low`: **zero vulnerabilidades**.
- Integração HTTP isolada de `/api/user/sync`: cookie da conta B com identidade/payload da conta A retornou **403 ACCOUNT_SESSION_MISMATCH**; gravação da própria conta retornou **200**; perfil sem login retornou **403**. Nenhum dado ou usuário de produção foi usado.

A suíte e o build geraram apenas o aviso não bloqueante de chunk JavaScript acima de 500 kB. A execução local em sandbox não substitui um check oficial de CI.

- **GitHub Actions:** não há execução associada ao HEAD; o status externo disponível continua sendo Vercel `build-rate-limit`.
- **Vercel Preview:** sem preview READY; capturas renderizadas página a página em desktop/mobile continuam pendentes.
- Escuta real da voz, Solfeggio e ambiência permanece pendente.
- Checkout, confirmação e webhook InfinitePay em sandbox permanecem pendentes.
- A resposta técnica ao apontamento P1 foi publicada na própria thread e a thread foi resolvida após a correção e as evidências de teste/runtime. O Codex informou limite de uso para uma segunda revisão automatizada; por isso não há parecer independente novo do HEAD final.
- A branch está **152 commits à frente e 23 atrás** da `main`. A inspeção confirmou que a `main` já contém uma fotografia própria mais recente da Elegância Profunda (`photo-1788699626335-906b2c4ae2d8`), ausente desta branch, além de tokens compartilhados diferentes. Não fiz merge automático: a reconciliação precisa incorporar essa decisão posterior dos Estilos 2/3/4 sem substituir a paleta aprovada do Natural Sereno nem recuperar componentes rejeitados. Como não houve merge, a correção P1 está registrada na PR #74 e ainda não foi aplicada à `main`/produção.

**Sem merge, publicação em produção ou cobrança real.**
