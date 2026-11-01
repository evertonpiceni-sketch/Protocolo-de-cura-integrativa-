# Auditoria — Estilo 1 Natural Sereno — Run 10

## Corrigido / consolidado
- Nenhuma alteração funcional arriscada foi aplicada nesta rodada: a inspeção confirmou que os dois próximos cortes exigem edição localizada em arquivos centrais e devem preservar autenticação, pagamento, progresso e conteúdo congelado.
- Mantida a proteção já existente que interrompe BG/Solfeggio durante sessão ativa e Reintegração.
- Mantido o tratamento aprovado do logo como assinatura sutil/transparente.

## Regressões confirmadas
1. **Seletor de estilos** — `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`. Assim, perfil com estilo persistido pula a escolha explícita. Correção exigida: separar o estado de exibição/confirmação do seletor da persistência de `visualLayout`; o estilo salvo pode ser pré-seleção, nunca autorização automática.
2. **Voz do player** — `src/components/MeditationSession.tsx` ainda converte preferência feminina sem `voiceId` em `Rachel` no `playProtocolStageStream`. Também trata `Rachel` como alias feminino no resolvedor nativo. Isso viola a decisão de respeitar a voz escolhida e explica substituição silenciosa/voz robótica. Não inventar ID de Maiara: remover fallback nominal e usar somente `voiceId` confirmado; na ausência, sinalizar indisponibilidade em vez de fingir que outra voz é a escolhida.
3. **Fallback nativo** — o monkey patch de `audioEngine.speak` tenta resolver voz do sistema por gênero. Para Natural Sereno, isso não deve substituir uma voz oficial escolhida.

## Preservado
- Conteúdo terapêutico e roteiros aprovados.
- Diário e progresso.
- Confirmação server-side de pagamento.
- Bloqueio de sobreposição de áudio global durante sessão/Reintegração.
- Base visual creme/marfim, café/marrom e dourado já consolidada nas camadas finais; logo discreto.

## Pendente
- Aplicar a correção mínima do seletor em `App.tsx` sem tocar no fluxo de persistência/login.
- Retirar `Rachel` e fallback nativo do caminho Natural Sereno em `MeditationSession.tsx` e demais componentes que repetem a mesma regra.
- Validar com a integração real qual é o `voiceId` da voz escolhida (Maiara) antes de congelar a voz.
- Continuar limpeza página a página das origens cromáticas antigas, Home/paisagens, animação terapêutica e responsividade, sem recoloração global.

## Critério de aceite
Natural Sereno só pode ser congelado quando: seletor dos 4 estilos aparece explicitamente antes da aplicação; voz escolhida toca sem substituição; Solfeggio não sobrepõe protocolo; player/animação correspondem ao aprovado; nenhuma grande chapa verde/amarela reaparece em desktop ou mobile.
