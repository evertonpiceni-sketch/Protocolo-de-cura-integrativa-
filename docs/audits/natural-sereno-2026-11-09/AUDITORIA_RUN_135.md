# Auditoria RUN 135 — Estilo 1: Natural Sereno

Data: 2026-11-09 (America/Sao_Paulo)

## Corrigido

- A tela de sessão (MeditationSession) ainda trazia, na barreira de acesso dos dias PRO, um CTA com fundo sólido legado #8F631E, texto branco e hover #7A5318.
- Foi adicionada uma regra final e isolada em src/natural-sereno-approved-overrides.css, limitada a :root[data-layout="natural-sereno"] .ep-session-access-gate.
- O CTA agora usa gradiente dourado refinado #E2B96B → #C89D52, texto café #2A2421, borda #A87E37, raio de 18px e hover dourado escuro.
- Criado tests/natural-sereno-session-access-gate.test.ts para proteger o escopo e as cores contra regressão.

## Preservado e rechecado

- Seletor dos quatro estilos começa sem pré-seleção, exige escolha e confirmação, e só então persiste/aplica o estilo.
- A abertura do onboarding de boas-vindas já está condicionada a layoutConfirmedThisSession && !layoutChoiceRequested; não deve anteceder a escolha do estilo.
- CTA de confirmação do seletor permanece com rounded-xl, sem formato de pílula.
- Card do Natural Sereno mantém a prancha em object-contain; a fotografia de prévia mantém enquadramento próprio.
- Paleta de referência posterior: creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento; a prancha histórica não autoriza reintroduzir chapas verdes, chakras no corpo, nem logo dominante quando decisões posteriores os substituíram.
- Anamnese, Perguntas Sistêmicas, Diário, Ho'oponopono, oração de São Miguel, Ajustes de Áudio e sessão foram revisados estaticamente. Tokens antigos ainda existentes nos componentes são neutralizados por regras escopadas do Natural Sereno; estados de sucesso usam sálvia discreta.
- Voz neural, política de não sobreposição entre narração e Solfeggio, Diário/sincronização por conta, player, corpo neutro e animações permanecem sem alteração nesta rodada.
- A branch mantém proteções de InfinitePay: API key obrigatória, checkout de pagamento único, lock compartilhado, atualização do banco persistente e validação server-side. Nenhuma cobrança foi executada.

## Limitações / pendências

- O teste novo foi adicionado, mas não há execução GitHub Actions associada ao HEAD atual 8e32ef1ad942eb6f7d9c8851da94033e1f9daef2. A última CI confirmada é a run #2183, anterior a este commit; portanto, não declarar suíte, TypeScript ou build aprovados nesta rodada.
- O único status atual no HEAD é Vercel em falha por build-rate-limit; não há preview READY. Sem prévia, a inspeção pixel a pixel de todas as páginas em desktop/mobile e a escuta real de Marianne/Solfeggio/ambiência continuam pendentes.
- InfinitePay ainda requer homologação sandbox de checkout, confirmação e webhook.
- A busca na Biblioteca encontrou uma prancha chamada Painel UX_UI Natural Sereno.png com a mesma composição geral de 12 telas; não foi possível confirmar que o identificador interno é exatamente o arquivo original 1001196520.png / file_00000000317c820ebaad657dc3680de5. A cópia versionada no repositório não foi substituída.
- A PR está divergida da main: 143 commits à frente e 12 atrás, mergeable=false. As alterações posteriores dos estilos 2/3 e de infraestrutura devem ser reconciliadas por partes, preservando o que já foi aprovado; não foi feito merge.

## Evidências

- Correção CSS: commit 7747beef5a334731922fb0cb7529850b89243c10.
- Teste de regressão: commit 8e32ef1ad942eb6f7d9c8851da94033e1f9daef2.
- PR: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/pull/79
- Última CI aprovada antes desta rodada: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42677230012

## Estado

PR aberta em rascunho. Nenhum merge, deploy de produção ou pagamento real.
