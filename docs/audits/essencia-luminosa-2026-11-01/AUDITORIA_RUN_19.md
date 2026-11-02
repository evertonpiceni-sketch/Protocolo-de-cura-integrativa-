# Auditoria incremental — Estilo 3 · Essência Luminosa

## Corrigido
- Identificado resíduo azul/índigo no invólucro do logo do header: `App.tsx` ainda usa `border-indigo-500/40` e sombra rgba(99,102,241). Foi neutralizado apenas sob `data-layout="essencia-luminosa"`, devolvendo borda ouro suave/champagne e sombra quente discreta.
- Restaurado o token `--layout-text-soft`, usado pelos overrides do Estilo 3 mas não definido na paleta-base. Agora referencia `--layout-text-secondary`, evitando fallback/herança imprevisível em textos secundários.
- Mantida opacidade do logo em 30% desktop e 26% mobile, como assinatura visual.

## Preservado
- Paleta marfim/champagne/ouro suave e acentos naturais.
- Diário, player, Pausa, Configurações e conteúdo terapêutico.
- Proteção de áudio da Reintegração e confirmação server-side de pagamento.
- Demais estilos sem alteração visual.

## Pendente
- `App.tsx` ainda monta `LayoutChoiceModal` somente quando `!userProfile.visualLayout`; perfis com preferência persistida podem pular a escolha explícita. A confirmação interna do modal está preservada, mas falta separar preferência salva de confirmação da sessão.
- Voz: não substituir aliases/fallbacks até existir ID oficial verificável.
- Validar em execução as transições de Solfeggio/player/animações em desktop e mobile.
