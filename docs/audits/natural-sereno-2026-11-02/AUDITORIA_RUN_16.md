# Auditoria — Estilo 1 Natural Sereno — Run 16

## Reauditoria executada
- Confirmado que a camada `src/natural-sereno-final-audit.css` mantém a base aprovada creme/marfim, café/marrom e dourados refinados, com verde restrito a acentos naturais.
- Confirmado que o player Natural Sereno permanece em canvas claro, responsivo, sem restaurar grandes chapas verde-escuras.
- Confirmado tratamento do logo oficial como assinatura sutil/transparente (`opacity: .24`) nos hooks aprovados, sem competir com a experiência visual.
- Confirmado que o pagamento em `src/App.tsx` continua exigindo confirmação server-side `status === 'paid'` antes de atualizar o perfil.
- Confirmado que o áudio global é interrompido quando há sessão/jornada ativa, preservando a proteção contra sobreposição.

## Regressões comprovadas ainda ativas
1. **Seletor dos quatro estilos — prioridade estrutural:** `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`. Assim, um perfil com preferência persistida pode pular a escolha explícita. A correção correta continua sendo separar preferência persistida (apenas pré-seleção) de confirmação obrigatória da entrada.
2. **Voz Natural Sereno:** `src/components/MeditationSession.tsx` ainda contém fallback literal `Rachel` quando `voiceGender === 'feminina'`, apesar de já importar `OFFICIAL_PROTOCOL_VOICE_ID`. Há também aliases legados em outros caminhos. Não substituir por um identificador inventado; preservar `voiceId` explícito e usar somente identificador oficial comprovado.
3. **Backend de voz:** `server.ts` ainda expõe aliases legados (`Rachel`, `Marcus`) em catálogo/fallback. Precisa ser alinhado à decisão vigente somente depois de confirmar o identificador oficial da voz aprovada.

## Preservado
- Conteúdo terapêutico e roteiros canônicos.
- Diário, progresso e gates da jornada.
- Pagamento server-side.
- Proteções de Solfeggio/áudio já implementadas.
- Logo discreto/transparente.
- Nenhuma recoloração global ou alteração em outros estilos foi introduzida nesta rodada.

## Pendente / próxima intervenção mínima segura
- Corrigir o estado de entrada em `App.tsx` para sempre exibir a escolha explícita dos quatro estilos, usando a preferência salva apenas como pré-seleção.
- Remover o fallback literal `Rachel` do caminho Natural Sereno sem inventar voz; manter `voiceId` explícito e `OFFICIAL_PROTOCOL_VOICE_ID` como fonte canônica quando aplicável.
- Executar validação renderizada desktop/mobile das paisagens, player e animações antes de congelar o Estilo 1.

O Estilo 1 ainda não deve ser marcado como concluído/congelado.