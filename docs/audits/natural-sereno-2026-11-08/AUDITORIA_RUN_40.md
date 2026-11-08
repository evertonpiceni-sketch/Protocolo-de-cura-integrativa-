# Auditoria — Estilo 1 Natural Sereno | RUN 40

**Data:** 2026-11-08  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Head de código validado:** `03ebd11ec430baaaa5e7ae26ccc3593f3ce7cb60`  
**PR:** #67, aberta e não mesclada.

## Achado principal — sincronização sob contenção do lock

A revisão independente do head `3a04945f7cb364d2a9122815a8e84d05249bdb86` apontou que `/api/user/sync` podia responder HTTP 409 quando o lock global do snapshot estivesse ocupado, enquanto os chamadores `saveProfile` e `saveProgress` apenas registravam o erro. Alterações locais poderiam parecer salvas e desaparecer no próximo login.

### Corrigido

- Criado `src/lib/userSync.ts`, com até oito tentativas limitadas para contenção do lock, falhas de rede e respostas transitórias (409, 423, 429, 500, 502, 503 e 504).
- O atraso respeita `Retry-After` sem encurtar o backoff exponencial.
- Respostas permanentes, como 400 e 401, não são repetidas.
- `saveProfile` envia somente `profile`; `saveProgress` envia somente `progress`. Isso evita que uma gravação concorrente envie o outro campo com um snapshot antigo.
- Conclusão de sessão, reinício do programa, confirmação de estilo e escolha de protocolo da Home Natural Sereno usam a mesma rotina resiliente.
- O endpoint informa `Retry-After: 1` quando o lock global está ocupado.
- A rotina mantém o payload idempotente: repetir a mesma atualização de perfil/progresso não cria pedidos nem concede benefícios.

### Preservado

- Prancha oficial Natural Sereno versionada em `docs/visual-qa/natural-sereno/reference.jpg`, subordinada às decisões aprovadas posteriores.
- Estado neutro de cadastro/login e seletor explícito dos quatro estilos antes da confirmação.
- Paleta creme/marfim, café/marrom, dourado refinado e verde-sálvia apenas como acento; paisagens realistas e enquadramento responsivo.
- Logo oficial discreto/transparente como assinatura.
- Diário, voz neural, Solfeggio, player, seis etapas, animações e respiração 4–3–5.
- Proteções InfinitePay, lock global, refresh do snapshot, deduplicação, idempotência e validação server-side.
- Estilos 2, 3 e 4: nenhuma alteração visual nesta rodada.

## Revisão independente anterior

- O apontamento P1 de sincronização sob lock foi tratado nesta rodada.
- O apontamento P2 do teste do seletor do Estilo 2 já estava corrigido no head posterior à revisão: a expectativa voltou a corresponder ao comentário vigente da prancha; a suíte atual confirmou.
- Nova revisão independente deve ser feita sobre o head atualizado. A revisão anterior não deve ser considerada como aprovação do novo código.

## Reauditoria — GitHub Actions #1759

- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **158/158 aprovados**, 0 falhas.
- Build Vite: aprovado.
- Entry points Vercel/Express: aprovados.
- Verificações de segredos/JWT e proteção administrativa: aprovadas.
- Smoke test de saúde/cadastro: aprovado.
- Endpoints de pagamento fail-closed: aprovados.

Execução: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42475253531

## Pendências verificadas

1. **Preview visual:** o status Vercel do head continua em falha por `build-rate-limit`. A consulta de deployments não encontrou deployment de preview para este commit; faltam capturas reais em desktop e mobile.
2. **Áudio:** ainda falta escuta real no navegador da voz neural selecionada e das transições entre narração, Solfeggio e ambiência.
3. **InfinitePay:** a listagem atual de variáveis de produção contém `INFINITEPAY_HANDLE`, mas não contém `INFINITEPAY_API_KEY`. O checkout permanece fail-closed. Não foi feita cobrança.
4. **Preview da branch atual:** não há variáveis específicas configuradas para esta branch no Vercel; portanto, o checkout sandbox não pode ser homologado neste preview.
5. **Configuração antiga:** existe `UPSTASH_DB_KEY` plain, sinalizada como `readable-secret`, restrita à branch antiga `audit/natural-sereno-infinitepay-2026-10-13`. Não foi alterada nem seu valor reproduzido; precisa de limpeza controlada se a branch antiga não for mais utilizada.
6. **Conciliação externa:** conferir links InfinitePay antigos que eventualmente permaneçam pendentes.

## Estado de entrega

- PR #67 aberta, mergeable e não mesclada.
- Branch sincronizada com a `main` (0 commits atrás na comparação verificada).
- Head de código `03ebd11ec430baaaa5e7ae26ccc3593f3ce7cb60`: CI #1759 concluído com sucesso.
- Check Vercel: falha por limite diário de deployments.
- Nenhuma publicação em produção, cobrança ou estorno real foi realizada.
