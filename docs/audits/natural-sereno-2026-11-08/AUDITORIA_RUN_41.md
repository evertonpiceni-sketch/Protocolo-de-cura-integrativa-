# Auditoria — Estilo 1 Natural Sereno | RUN 41

**Data:** 2026-11-08  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Base:** `main`  
**PR:** #67, aberta e não mesclada.

## Referência visual e precedência

A prancha original `1001196520.png` (1536 × 1404) foi localizada e inspecionada visualmente nesta auditoria. Ela continua sendo o card/referência oficial do Natural Sereno e está versionada no projeto em `docs/visual-qa/natural-sereno/reference.jpg`.

A prancha contém telas com áreas verdes escuras. Esses detalhes não prevalecem sobre decisões posteriores: base creme/marfim, café/marrom, dourado refinado, verde apenas como acento natural e ausência de grandes chapas verdes. A prancha orienta composição e atmosfera; as aprovações posteriores determinam a implementação final.

## Corrigido

1. **Retry-After:** `src/lib/userSync.ts` não limita mais um `Retry-After` longo a cinco segundos. Se o servidor pedir uma espera superior à janela máxima de retry, a rotina encerra a tentativa atual sem reenviar antes do prazo. A regra cobre os formatos numérico e HTTP-date.
2. **Onboarding atômico:** os dados iniciais de nascimento, cidade, telefone, preferência sonora, timbre e cupom agora são enviados no próprio `/api/auth/register` e persistidos junto com a criação da conta, sob o lock global de escrita. O fluxo não depende mais de um segundo `/api/user/sync` após a conta já existir.
3. **Validação de perfil:** o backend aceita somente os campos permitidos por um schema Zod estrito; valida formato e data de nascimento, enumera as preferências e mantém `plan: free` sob controle do servidor.
4. **Retry do sync:** `/api/user/sync` agora envia `Retry-After: 1` ao responder 409 por contenção do lock.
5. **Regressões:** adicionados testes para Retry-After numérico/data futura e para a persistência atômica do perfil de onboarding.

## Preservado

- Seletor explícito dos quatro estilos, sem pré-seleção automática e com confirmação antes de aplicar.
- Identidade Natural Sereno: creme/marfim, café/marrom, dourado refinado, verde-sálvia como acento e natureza realista.
- Logo oficial discreto/transparente como assinatura.
- Paisagens responsivas, tipografia, botões e telas já aprovadas.
- Diário, voz neural, Solfeggio, player, seis etapas, animações e respiração 4–3–5.
- Catálogo atual de pagamentos, InfinitePay fail-closed, lock global, refresh do snapshot, deduplicação, idempotência e confirmação server-side.
- Estilos 2, 3 e 4: nenhuma alteração visual nesta rodada.

## Reauditoria

As alterações foram gravadas na branch da PR #67. A execução de CI correspondente a este novo head ainda precisa concluir; não se declara aprovação de testes/build antes do resultado do GitHub Actions.

## Pendências

1. Prévia Vercel e capturas reais de todas as páginas em desktop/mobile; o último status observado para o head anterior foi falha por limite diário de deployments.
2. Escuta real da voz neural escolhida e transições entre narração, Solfeggio e ambiência.
3. `INFINITEPAY_API_KEY` não estava presente na última consulta registrada; checkout permanece fail-closed. Sandbox e conciliação de links antigos pendentes.
4. Revisão controlada da variável antiga `UPSTASH_DB_KEY` sinalizada como `readable-secret`, sem expor seu valor.
5. Revisão independente do novo head após CI.

Nenhuma alteração foi mesclada ou publicada em produção. Nenhuma cobrança, estorno ou transação real foi realizada.
