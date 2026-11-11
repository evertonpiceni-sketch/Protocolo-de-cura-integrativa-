# Auditoria RUN 166 — Estilo 1: Natural Sereno

**Data:** 11/11/2026 — 05:52 BRT  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`

## Corrigido

1. **Diário semanal — isolamento de tema:** `personalCareIntegration.ts` era importado globalmente por `main.tsx`, mas `ensureStyles()` injetava seletores sem `data-layout` e cores antigas (verde-floresta/ocre). O cartão semanal agora usa os tokens `--layout-*` apenas quando um dos quatro estilos foi confirmado. Assim, Natural Sereno recebe creme/marfim, café e dourado refinado; os demais estilos usam seus próprios tokens aprovados, sem receber a paleta do Estilo 1.
2. **Selo “Em preparação”:** as regras de `.ep-courses-locked` foram limitadas ao Natural Sereno; o estilo não vaza para outros componentes/estilos.
3. **MutationObserver:** o cartão era reescrito com `innerHTML` em toda mutação da página, inclusive nas mutações geradas por ele próprio. A atualização agora compara o HTML e só escreve quando o conteúdo muda, evitando ciclo de mutações e consumo contínuo.
4. **Privacidade do Diário:** `readCurrentAccount()` não retorna mais `accounts[0]` quando não existe login ativo. Sem conta autenticada correspondente, o resumo semanal é removido e não exibe dados de outra conta.
5. **Texto livre:** a função de escape já existente foi preservada; o conteúdo da anamnese continua escapado antes de entrar no HTML. Rótulos de padrões são constantes internas.

## Preservado

- Seletor dos quatro estilos, sem pré-seleção e com confirmação explícita.
- Prancha oficial do Natural Sereno no card, sem recorte; decisões posteriores prevalecem sobre elementos históricos da prancha.
- Paleta aprovada do Natural Sereno, natureza realista, paisagens responsivas, logo oficial sutil/transparente e corpo neutro.
- Voz Marianne/ElevenLabs, política de Solfeggio, player, animações e conteúdo da Reintegração.
- Diário: registros, sincronização de perfil/progresso e conteúdo do usuário.
- Estilos 2, 3 e 4: nenhuma folha de tema ou componente de tema foi redesenhado; o cartão semanal passa a usar os tokens que cada estilo já define.
- InfinitePay: nenhuma rota, preço, cupom, credencial ou regra financeira foi alterada.

## Reauditoria estática após a intervenção

Foram verificadas antes da gravação:
- ausência de cores legadas na folha dinâmica;
- escopo por `:root[data-layout]` para o cartão semanal;
- escopo Natural Sereno para o selo de cursos;
- uso dos tokens de tema existentes;
- ausência de fallback para a primeira conta;
- atualização idempotente do HTML;
- preservação do escape de texto livre.

Foi adicionado `tests/natural-sereno-run166-diary-integration-safety.test.ts` com cinco testes. **A suíte Node/TypeScript ainda precisa ser executada pelo GitHub Actions; estes testes não são declarados aprovados nesta rodada.**

## Pendente / bloqueios

- Executar CI, TypeScript, suíte completa e build no novo HEAD.
- Vercel: o último status consultado para o HEAD anterior indicava `build-rate-limit`; ainda não há Preview READY para homologação renderizada.
- QA visual página a página em desktop e mobile.
- Escuta real da Marianne, transições Solfeggio/narração e Diário/player ponta a ponta.
- InfinitePay: a configuração de sandbox/Preview e a credencial de API precisam ser revalidadas; nenhuma cobrança foi realizada.
- A branch estava 277 commits à frente e 12 atrás da `main`. A reconciliação deve ser seletiva; não fazer merge/rebase automático. A correção recente de sincronização do Diário na `main` deve ser comparada com a implementação `syncUserState` já presente nesta branch antes de qualquer integração.

Nenhum merge, publicação em Production, alteração de credenciais ou pagamento real foi realizado.
