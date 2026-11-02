# Auditoria — Estilo 1 Natural Sereno — Run 18

## Corrigido
- Corrigida a ordem de precedência das camadas CSS do Natural Sereno em `src/main.tsx`.
- `natural-sereno-approved-overrides.css`, que contém decisões posteriores aprovadas (logo sutil/transparente, neutralização de chapas verdes/âmbar/índigo, Diário, cabeçalho, Ajustes, Anamnese e apresentação), agora é carregado depois de `natural-sereno-final-audit.css` e `natural-sereno-home-latest-approved.css`.
- Isso impede que regras antigas de auditoria/refinamento recuperem precedência apenas pela ordem da cascata.
- Reauditoria confirmou a nova ordem no arquivo de entrada.

## Preservado
- Não houve redesign de telas congeladas.
- Conteúdo terapêutico, Diário, player, animações, pagamento e lógica de sessão não foram alterados nesta intervenção.
- O pagamento continua dependendo de confirmação server-side `status === 'paid'` antes de atualizar o perfil.
- O logo oficial continua definido na camada aprovada como assinatura de baixa opacidade.

## Pendências confirmadas
1. `src/App.tsx`: `LayoutChoiceModal` ainda depende de `!userProfile.visualLayout`; uma preferência persistida pode pular a escolha explícita dos quatro estilos. A preferência salva deve servir apenas como pré-seleção, com confirmação explícita na sessão.
2. `src/App.tsx`: o dono global do áudio pausa para `activeSessionDay` e `showPersonalJourney`, mas ainda não inclui `showArcanjoView`; o desbloqueio por gesto repete a omissão. Incluir `!showArcanjoView` nas duas condições e dependências para evitar coexistência do background global com o áudio/Solfeggio do Arcanjo.
3. `src/components/MeditationSession.tsx`: o caminho Natural Sereno ainda usa alias literal `Rachel` quando `voiceGender === 'feminina'`, apesar de existir `OFFICIAL_PROTOCOL_VOICE_ID`. A correção de voz deve respeitar a decisão de voz oficial vigente e não inventar/substituir ID sem comprovação.
4. Validar renderização real das paisagens em desktop e mobile após build/deploy, especialmente `cover/contain`, recortes e altura de viewport.

## Regra de continuidade
Continuar pelo menor patch funcional comprovável, reauditar depois de cada intervenção e não reintroduzir versões antigas ou elementos de outros estilos.