# Reauditoria — Estilo 1: Natural Sereno — RUN 34

**Data:** 08/11/2026  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Head de código validado:** `75c1e7c60949ce6e953abcc6198d8572edb98cfd`  
**Base:** `main` em `b43ba0c73f920d8ef66186a2476116070592d9b1`  
**Estado:** PR #67 aberta, 0 commits atrás, sem merge e sem publicação.

## Corrigido nesta rodada

### Concorrência e integridade dos pagamentos — P1
- A revisão independente identificou que o lock anterior era separado por usuário e tipo de produto. Como `saveDb()` persiste o snapshot inteiro, checkouts simultâneos de usuários/produtos diferentes podiam sobrescrever pedidos uns dos outros.
- Substituído o escopo por uma única chave Redis compartilhada: `payment:shared-database-write`.
- Criação de checkout, confirmação/webhook e ativação da degustação VIP7 usam o mesmo lock.
- Cada fluxo adquire e valida o lock, recarrega o snapshot persistente antes de consultar/mutar os dados e valida novamente a posse antes de persistir.
- A confirmação mantém o lock durante a verificação remota do pagamento; a renovação automática protege operações que excedam o TTL inicial.
- Falha ao obter/perder o lock bloqueia a operação de forma segura; não cria links nem concede acesso fora da sequência protegida.
- Adicionado teste cobrindo usuários e produtos diferentes compartilhando a mesma chave, além da atualização da expectativa de regressão que ainda citava o escopo antigo.
- O tópico P1 de revisão foi marcado como resolvido após a alteração.

### Identidade visual — varredura estática
- A camada final continua restrita a `:root[data-layout="natural-sereno"]`.
- `src/natural-sereno-approved-overrides.css`: 188 grupos de regras e 218 seletores; nenhum seletor fora do escopo Natural Sereno.
- `src/natural-sereno-home-surface-audit.css`: 16 grupos de regras e 22 seletores; nenhum seletor fora do escopo Natural Sereno.
- O modelo legado da Home não contém os tokens de verdão/amarelão explicitamente descartados nos testes; preserva creme `#FAF7F2` e dourado `#C89D52`.
- A cobertura estática inclui Home/Comunidade, acolhimento, cabeçalho/dock, Mapa Astral, Numerologia, Banhos, Ho'oponopono, Instalação, Conquistas, Diário, Anamnese, Administração, Prática Individual e player.
- Esta checagem é estática e não substitui captura renderizada em navegador.

## Preservado
- Prancha oficial do Natural Sereno versionada em `docs/visual-qa/natural-sereno/reference.jpg`, subordinada às decisões posteriores.
- Seletor dos quatro estilos sem pré-seleção automática e com confirmação explícita.
- Creme/marfim, café/marrom e dourado refinado; verde-sálvia somente como acento.
- Paisagens realistas e regras responsivas desktop/mobile.
- Logo oficial como assinatura discreta (30% desktop / 26% mobile).
- Diário, sincronização, player, seis etapas, animações, respiração 4–3–5 e movimento reduzido.
- Voz neural aprovada e IDs válidos; sem substituição silenciosa pela voz robótica do navegador.
- Ownership do áudio do Arcanjo e Solfeggio próprio.
- Estilos 2, 3 e 4 e atualizações mais recentes da main, sem redesenho nesta rodada.
- Catálogo atual de preços/cupons e entitlement de Numerologia; checkout avulso obsoleto `numerology_full` não foi recuperado.

## Evidência de CI — RUN 1673
- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **136/136 aprovados**.
- Build: aprovado.
- Entry points Vercel: aprovados.
- Verificações de segredos/JWT e proteção administrativa: aprovadas.
- Smoke tests: aprovados.
- Endpoints de pagamento fail-closed: aprovados.
- RUN 1672 falhou apenas por uma expectativa de teste que ainda citava o escopo antigo; a expectativa foi atualizada e a RUN 1673 passou integralmente.

## Pendências e bloqueios externos
1. **API Key InfinitePay:** a listagem de metadados Vercel (sem descriptografar segredos) encontrou `INFINITEPAY_HANDLE`, mas não encontrou `INFINITEPAY_API_KEY` em produção nem em preview. O checkout permanece fail-closed e retorna 503 sem chamar o provedor. Não foi criada nem alterada credencial.
2. **Preview visual:** Vercel recusou o deployment por `api-deployments-free-per-day` (limite de mais de 100 deployments no período). Sem preview navegável, permanecem pendentes capturas reais página a página em desktop/mobile.
3. **Áudio:** falta escuta real no navegador da voz selecionada e das transições narração/Solfeggio/ambiência.
4. **Links legados:** conciliar links antigos potencialmente multiuso diretamente na conta InfinitePay; nenhuma transação real foi iniciada.
5. **Segredo antigo de preview:** `UPSTASH_DB_KEY` em uma branch de auditoria de outubro continua sinalizado como `readable-secret`. Seu valor não foi consultado, copiado ou alterado; revisar dependências dessa branch antes de rotação/remoção.
6. **Revisão independente final:** nova revisão solicitada para o head `75c1e7c`; aguardar resultado.

**Sem merge, sem deploy de produção, sem checkout real, cobrança ou estorno.**
