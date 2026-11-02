# Auditoria — Estilo 3 Essência Luminosa — Run 22

## Corrigido
- Varredura do header encontrou heranças ainda ativas no componente-base: botão de vídeo/apresentação com gradiente `amber` + `indigo` e botão de Mapa Astral com `purple`.
- `src/essencia-luminosa-final-audit.css` agora neutraliza esses resíduos somente sob `data-layout="essencia-luminosa"` + `#main-header`, convertendo fundo/borda/texto/ícone para superfície luminosa, champagne/ouro suave e texto secundário aprovado.
- A correção não altera ação, conteúdo, hierarquia ou outros estilos.

## Preservado
- Logo oficial como assinatura sutil/transparente (30% desktop, 26% mobile).
- Paleta marfim/champagne/ouro suave e acentos naturais.
- Diário, player, Pausa, Configurações e conteúdo terapêutico já aprovados.
- Proteção de áudio: música global não toca durante sessão/Reintegração e a Reintegração interrompe fala/BG ao abrir.
- Pagamento: confirmação server-side permanece antes de atualizar o perfil.
- Confirmação interna do `LayoutChoiceModal`: selecionar card e confirmar continuam etapas distintas.

## Pendente comprovado
- `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`; perfis com estilo persistido podem pular a escolha explícita. Corrigir no estado/fluxo, separando preferência persistida (pré-seleção) da confirmação obrigatória da entrada; não mascarar com CSS.
- Voz: não substituir aliases/fallbacks legados sem identificador oficial comprovado da voz aprovada.
- Continuar validação executada de Solfeggio, player e animações em desktop/mobile.

## Reauditoria
- Releitura da camada final após o commit confirmou escopo estrito ao Estilo 3 e ao header para a nova neutralização.
- Nenhuma regra global dos demais estilos foi modificada.
