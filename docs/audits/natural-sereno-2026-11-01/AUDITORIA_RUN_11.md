# Auditoria — Estilo 1 Natural Sereno — Run 11

## Corrigido / consolidado nesta rodada
- Reauditoria da camada final `src/natural-sereno-final-audit.css`: permanece protegendo base marfim/creme, café, dourado refinado, verde apenas como acento, player responsivo, navegação inferior sem chapas de outros estilos, pagamento sem chapa verde e logo oficial em baixa opacidade.
- Confirmada a proteção de áudio em `App.tsx`: música global é interrompida durante sessão/jornada e a Reintegração interrompe fala + background ao abrir, evitando sobreposição de Solfeggio.
- Confirmado que a confirmação de pagamento continua server-side antes de atualizar o perfil; não foi alterada.

## Regressões ainda ativas
1. **Seletor dos quatro estilos** — `src/App.tsx` ainda renderiza `LayoutChoiceModal` somente sob `!userProfile.visualLayout`. Perfil com estilo persistido pula a escolha explícita. O estilo salvo deve servir apenas como pré-seleção; a aplicação deve aguardar confirmação explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno.
2. **Voz do player** — `MeditationSession.tsx` ainda contém alias/fallback feminino `Rachel`. O repositório já possui `OFFICIAL_PROTOCOL_VOICE_ID = mJqP14JQFEK0PojR5lfV` (Marianne — Meditação), mas não há comprovação no código de que esse ID seja a voz Maiara aprovada. Não inventar/substituir o ID sem evidência.
3. **Heranças cromáticas na origem** — a busca por `#073B2B` ainda encontra ocorrências proprietárias em `naturalSerenoHomeApprovedModel.ts`, `natural-sereno.css`, `natural-sereno-mobile-fixes.css`, `natural-sereno-refinement.css`, `ProUpgradeModal.tsx`, `HerbalBathsModal.tsx`, `AstralMapModal.tsx` e `NumerologyModal.tsx`. A camada final mascara parte dessas ocorrências, mas a limpeza deve continuar na origem, página por página.
4. **Animação** — `MeditationSession` ainda usa `SacredEnergyCanvas`. Permanece pendente validar/substituir somente o necessário para obedecer ao conceito congelado: corpo neutro, movimento da luz, região anatômica do dia e integração final, sem círculos/chakras/espetáculo energético.

## Preservado
- Conteúdo terapêutico e roteiros aprovados.
- Diário, progresso e navegação funcional.
- Player/alinhamento responsivo já corrigido.
- Logo oficial sutil/transparente como assinatura.
- Confirmação server-side e fluxo de pagamento.
- Proteção contra sobreposição do áudio/Solfeggio.

## Próxima intervenção mínima segura
- Corrigir o estado de exibição/confirmação do seletor em `App.tsx` sem alterar autenticação, perfil, progresso ou pagamento.
- Em seguida remover o alias `Rachel` do caminho Natural Sereno preservando `voiceId` explícito e sem inventar a voz Maiara.
- Depois limpar as ocorrências proprietárias de `#073B2B` nos modais de Banhos, Mapa Astral e Numerologia, reauditar desktop/mobile e só então avançar para Home/animação.

O Estilo 1 ainda não deve ser congelado como concluído.