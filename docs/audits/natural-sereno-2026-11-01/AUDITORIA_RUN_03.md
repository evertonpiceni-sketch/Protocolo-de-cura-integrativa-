# Estilo 1 — Natural Sereno — reauditoria 2026-11-01

Referência visual oficial: prancha Estilo 1 enviada pelo Everton, subordinada às decisões aprovadas posteriores. Regra: aprovado = congelado; reprovado/substituído/não usar = descartado.

## Corrigido/preservado nesta rodada
- Mantido o logo oficial como assinatura sutil/transparente; não recolorir nem usar como elemento dominante.
- Mantidos conteúdo terapêutico, Diário, progresso e confirmação server-side de pagamento sem alterações sem evidência de regressão.
- Mantida a regra de não aplicar recoloração global: correções visuais devem ocorrer no componente proprietário.

## Reprovado / regressões confirmadas
1. **Fluxo inicial de estilos** — `App.tsx` só mostra `LayoutChoiceModal` quando `userProfile.visualLayout` está vazio. Perfil com estilo salvo pula a escolha. Deve haver escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno antes de aplicar o estilo.
2. **Voz** — há fallbacks hard-coded para `Rachel` em `MeditationSession.tsx`, `ArcanjoProtocolView.tsx`, `HooponoponoModal.tsx`, `AnamnesisModal.tsx` e `ProfileSetup.tsx`. Isso pode substituir a voz escolhida. Não inventar ID da voz Maiara: só configurar quando o identificador real da integração estiver comprovado.
3. **Player/animação** — `MeditationSession` ainda usa estrutura genérica centralizada e `SacredEnergyCanvas`; a experiência observada permanece desalinhada e a animação não corresponde ao conceito aprovado de corpo neutro + movimento da luz + região do dia + integração.
4. **Heranças cromáticas** — `#073B2B` ainda aparece em `natural-sereno.css`, `natural-sereno-refinement.css`, `natural-sereno-mobile-fixes.css`, `naturalSerenoHomeApprovedModel.ts`, `naturalSerenoHomeJourneyStateFix.ts`, `ProUpgradeModal.tsx`, `HerbalBathsModal.tsx`, `AstralMapModal.tsx` e `NumerologyModal.tsx`. O uso deve ser revisto por contexto; grandes chapas verdes são proibidas no Natural Sereno.
5. **Home** — `naturalSerenoHomeApprovedModel.ts` ainda contém CTA/fundos em verde profundo herdado. A palavra `Approved` no nome do arquivo não prevalece sobre a decisão posterior que reprovou grandes chapas verdes.
6. **Solfeggio** — `audioIntegrityPatch.ts` redireciona Solfeggio de `startSynth` para `startBG`; `MeditationSession` chama `stopSynth` fora da fase playing e no cleanup. Requer teste de reprodução real para confirmar que nenhuma instância global permanece ativa ao entrar no protocolo.

## Critério visual obrigatório
- Natureza realista presente e integrada à página.
- Base clara creme/marfim, café/marrom e dourados refinados.
- Verde somente como acento natural; sem grandes chapas verdes.
- Paisagem responsiva em desktop e mobile, sem corte/desproporção.
- Tipografia nítida; botões premium; logo discreto/transparente.
- Não misturar elementos dos Estilos 2, 3 ou 4.

## Próxima correção segura
Prioridade 1: corrigir a condição de exibição do seletor no `App.tsx` sem apagar a preferência salva; a escolha explícita deve confirmar/aplicar o estilo. Depois reauditar o fluxo. Prioridade 2: remover fallbacks `Rachel` na origem, preservando a voz escolhida e falhando de forma explícita quando a voz oficial não estiver disponível. Prioridade 3: corrigir Home e Player nos componentes proprietários, não por override global.
