# Auditoria — Estilo 1 Natural Sereno — Run 12

## Corrigido
- Corrigida a ordem semântica das quatro cores oficiais do Natural Sereno em `src/config/layouts.ts`.
- `LayoutChoiceModal` interpreta as amostras como `[canvas, accent, gold, surface]`; a configuração anterior entregava `[creme, café, verde, dourado]`, fazendo o verde ocupar o papel de `gold` e o dourado ocupar a superfície na prévia.
- A ordem passa a ser `[creme/marfim, café, dourado refinado, verde natural]`: `#FAF7F2`, `#2A2421`, `#C89D52`, `#6B7A4B`.
- Reauditoria após gravação confirmou a configuração corrigida no `main`.

## Preservado
- Nomes e IDs dos quatro estilos.
- Natural Sereno como estilo padrão de fallback.
- Descrição aprovada do Natural Sereno.
- Conteúdo, jornada, Diário, player, Solfeggio, pagamento e logo não foram alterados nesta intervenção.
- O verde permanece disponível somente como acento natural da paleta, sem transformá-lo em cor principal do CTA da prévia.

## Pendente
- `src/App.tsx` ainda renderiza `LayoutChoiceModal` somente sob `!userProfile.visualLayout`; um perfil com estilo persistido ainda pode pular a escolha explícita dos quatro estilos. A correção deve separar preferência persistida de confirmação da escolha na entrada, sem apagar a preferência salva.
- Continuar a varredura página por página das heranças cromáticas e componentes antigos.
- Validar voz/fallback e animação terapêutica contra as decisões aprovadas mais recentes antes de qualquer substituição.

## Estado
Natural Sereno continua em auditoria; ainda não congelar como concluído.
