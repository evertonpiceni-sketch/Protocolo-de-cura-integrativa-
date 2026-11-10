# Auditoria RUN 137 — Estilo 1: Natural Sereno
**Data:** 09/11/2026 (consulta de estado GitHub às 22:43 BRT)  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código auditado:** `37e29d0160ad49f2be5b7067d4e7a74d5f865c5e`  
**Main no momento da auditoria:** `783aacc8210d92f35037a0d06309806b89a96973`

## Resultado
**Nenhuma nova regressão de código foi confirmada nesta rodada.** Não foi feita alteração visual ou funcional desnecessária. As correções aprovadas das rodadas anteriores permanecem na branch.

## Verificado e preservado

- **Card/referência:** `LayoutChoiceModal.tsx` usa a paisagem realista do Natural Sereno e a derivação versionada `docs/visual-qa/natural-sereno/reference.jpg` como miniatura da prancha, com `object-contain`. O arquivo JPEG existe na branch. O PNG original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` não foi recuperado em bytes independentes nesta rodada; não foi criada arte substituta.
- **Seletor:** estado inicial sem estilo selecionado; `App.tsx` mantém `layoutConfirmedThisSession=false` e só aplica o estilo após escolha, confirmação e persistência. A prévia composta da branch foi preservada.
- **Paleta/cascata:** creme/marfim, café/marrom, dourado refinado e sálvia discreto. Foram encontrados nomes utilitários legados (emerald/amber/indigo) em camadas antigas; eles são hooks de componentes e recebem neutralização na camada final do Natural Sereno. `src/main.tsx` importa `natural-sereno-approved-overrides.css` depois das demais camadas Natural Sereno (linha 95). Regras finais específicas para Anamnese, acesso PRO, transparências, botões e halo da respiração continuam presentes.
- **Player corporal:** `MeditationSession.tsx` mantém brilho constante `rgba(200,157,82,.16)` no Natural Sereno, sem herdar as cores variáveis das etapas compartilhadas.
- **Arcanjo/corpo neutro:** a branch usa `NeutralBodyLightProgress` e `arcanjoProtocolDays.ts`; a ilustração antiga de chakras não é usada no Natural Sereno.
- **Voz:** Natural Sereno exige ID ElevenLabs explícito e resolve a voz oficial Marianne quando a preferência salva não é um ID neural válido. A falha de narração não libera fallback nativo no caminho neural.
- **Solfeggio:** respeita `audioEnabled`; para antes do início/retomada da narração neural e só retorna durante pausa ou falha, conforme a política do áudio.
- **Diário/sincronização:** `handleSaveDiaryDay` passa perfil e progresso calculados do mesmo snapshot para `saveProfile`; a branch usa `syncUserState` e `progressOverride` para enviar ambos juntos. Campos omitidos preservam os valores existentes. A proteção de sincronização da branch foi mantida.
- **InfinitePay:** a branch já contém API Checkout atual, API Key obrigatória para link de pagamento único, `single_payment: true`, bloqueio fora de produção até sandbox e lock compartilhado com refresh do banco. Não foi feita transação nem alteração de preços/cupons.
- **Outros estilos:** não foram alterados. A versão da branch do seletor e do Arcanjo foi preservada em vez de copiar arquivos mais antigos atualmente presentes em `main`.

## CI e implantação

- A execução Security Audit #2183 terminou com sucesso: npm audit, TypeScript, testes de regressão, build, entrypoints, JWT, autenticação e verificações financeiras concluídos com sucesso.
- Essa execução foi disparada para a PR #79 com head da branch `37e29d0` e base `4172471`. A `main` avançou desde então para `783aacc`; portanto, a execução anterior não valida a combinação com a main atual.
- O commit da branch tem zero check-runs associados diretamente; o status atual é Vercel em falha por limite de deployments: “Deployment rate limited — retry in 24 hours” (status atualizado em 10/11/2026 00:54 UTC). Não há preview READY.
- As capturas históricas existentes na pasta de QA não substituem uma inspeção renderizada do HEAD atual em desktop e mobile.

## Pendências

1. Reconciliar os 12 commits posteriores de `main` por arquivo, sem atualização cega. Preservar as mudanças aprovadas dos Estilos 2/3 e os reforços de pagamento/conta/diário, comparando-os com as implementações já existentes e mais completas desta branch.
2. Obter preview READY e fazer inspeção renderizada página por página em desktop e mobile, incluindo paisagens, tipografia, botões e assinatura do logo.
3. Escutar Marianne, ambiência e Solfeggio em dispositivo; testar início, pausa, retomada, término e falha.
4. Homologar InfinitePay em sandbox: checkout, confirmação e webhook.
5. Recuperar independentemente os bytes do PNG original, caso a conferência pixel a pixel ainda seja necessária.

## Estado
- PR #79 aberta, em rascunho, `mergeable=false`.
- Comparação atual: 153 commits à frente e 12 atrás de `main`.
- Nenhum merge, deploy de produção ou pagamento real.
- **Decisão desta rodada:** manter o código congelado onde não há defeito novo comprovado; avançar para reconciliação controlada e homologação real.
