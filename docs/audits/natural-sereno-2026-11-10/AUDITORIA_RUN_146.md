# Auditoria RUN 146 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**HEAD auditado:** `30ef652114698976988f26abc8f1c116bac9f81f`

## Corrigido

Nenhuma nova alteração funcional ou visual foi aplicada nesta rodada: a inspeção estática não encontrou regressão nova comprovada que justificasse outro override. Evitei acrescentar uma nova camada CSS sem preview renderizado, pois isso aumentaria a sobreposição de regras sem evidência visual.

A auditoria confirmou que o arquivo dinâmico `src/lib/naturalSerenoHomeJourneyStateFix.ts` contém apenas os tokens aprovados (`#A87E37`, `#2A2421`, `#6B625B`, `#E2B96B`, `#C89D52`); não há nele as antigas cores ocre/amarelo verificadas nesta rodada.

## Preservado e revalidado

- **Seletor:** `selectedLayout` inicia em `null`; o atributo `data-layout` é removido enquanto `layoutConfirmedThisSession` é falso. Os quatro estilos continuam disponíveis e a confirmação explícita antecede a aplicação.
- **Referência visual:** o card Natural Sereno exibe a paisagem realista atual e a miniatura da prancha com `object-contain`. O código registra o original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`, mas a imagem efetivamente versionada no repositório é a derivação `docs/visual-qa/natural-sereno/reference.jpg`. O PNG original não pôde ser recuperado pela busca da Library nem pela lista de anexos desta execução; não foi substituído.
- **Paleta e superfícies:** creme/marfim, café/marrom, dourado refinado e sálvia em pequenos acentos. Os seletores legados restantes estão escopados por `:root[data-layout="natural-sereno"]` e servem para neutralizar classes antigas ou preservar acentos pequenos; não foi identificada nova chapa verde ativa na inspeção estática.
- **Paisagens:** acolhimento usa `acolhimento.webp`, com enquadramento desktop em 42% e mobile em 46%; player mantém a paisagem e o corpo neutro com iluminação dourada uniforme.
- **Logo:** assinatura oficial com baixa opacidade; não foi introduzida moldura ou destaque dominante.
- **Voz:** ID oficial Marianne `mJqP14JQFEK0PojR5lfV`. No player principal, falha de ElevenLabs gera erro recuperável; não há fallback silencioso para SpeechSynthesis. No Arcanjo, os estilos neurais exigem ID válido e a rota nativa de fallback é recusada.
- **Solfeggio:** frequências 396/417/432/528/639/741/852/963 Hz são bloqueadas durante narração neural; ambiências não tonais podem continuar conforme a política de áudio.
- **Diário:** `syncUserState` mantém fila por conta, identidade de origem e proteção contra gravação atrasada em outra conta; o servidor valida `accountLogin` e preserva campos de entitlement.
- **Player/animações:** `NeutralBodyLightProgress`, movimento de luz, controles de pausa/retomada e respiração permanecem preservados.
- **InfinitePay:** API Key obrigatória, `single_payment: true`, lock compartilhado, recuperação controlada de checkout, confirmação server-side por valor e prevenção de reutilização de transação. Nenhuma cobrança foi feita.

A varredura estática cobriu Home/acolhimento, shell/cabeçalho/navegação, seletor, perfil/configurações, Anamnese, Diário, Mapa/Numerologia, Prática Individual, São Miguel/Arcanjo, player, planos e rotas de pagamento. Os Estilos 2, 3 e 4 não receberam alteração visual.

## Validação e pendências

- GitHub Actions: nenhuma execução PR-triggered associada ao HEAD auditado.
- Status combinado do commit: somente o check Vercel, em falha.
- Deployment `dpl_5rd9oF2UvA7H82NvHKcJ4nbWE4XX`: `ERROR / BUILD_FAILED — Resource provisioning failed`; a consulta de eventos de build retornou lista vazia.
- Sem Preview READY; portanto, a inspeção visual renderizada de todas as páginas em desktop/mobile não pode ser declarada concluída.
- Permanecem pendentes: CI completa; preview e QA visual renderizado; escuta real em dispositivo; Diário ponta a ponta; InfinitePay sandbox (checkout, confirmação e webhook); recuperação do PNG original; reconciliação seletiva dos 12 commits posteriores da `main`.

## Estado Git

- Comparação da branch com `main`: 177 commits à frente / 12 atrás; histórico divergente.
- Os 12 commits posteriores da `main` tocam API/server, App, Arcanjo, seletor, banco, rotas de pagamento e testes. A branch contém implementações e testes correspondentes, mas a reconciliação ainda precisa ser feita por arquivo/trecho; não fazer merge ou rebase cego.
- PR #79 continua aberta, em rascunho e `mergeable=false`.
- Sem merge, sem publicação em Production e sem pagamento real.
