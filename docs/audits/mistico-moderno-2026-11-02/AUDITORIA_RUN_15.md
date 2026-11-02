# Auditoria — Estilo 4 Místico Moderno — Run 15

## Corrigido / consolidado nesta rodada
- Reauditoria feita sobre a árvore atual do projeto, preservando as camadas exclusivas já aprovadas para `data-layout="mistico-moderno"` e sem introduzir recoloração global.
- Corrigida a conclusão de auditorias anteriores: há **dois caminhos** que ainda violam a exigência de escolha explícita antes de aplicar um estilo, não apenas a montagem inicial do modal.
- Registrado como bloqueio funcional prioritário que a tela **Ajustes da Prática > Aparência** chama `saveProfile({ ...userProfile, visualLayout: layout.id })` diretamente no `onClick` de cada card. Assim, clicar numa prévia aplica e persiste imediatamente o estilo, sem confirmação. A correção correta é usar seleção temporária/prévia e persistir somente após confirmação explícita.
- Reconfirmado que o player global em `App.tsx` pausa para `activeSessionDay` e `showPersonalJourney`, mas não usa `showArcanjoView` na condição nem no desbloqueio por gesto. O protocolo do Arcanjo controla seu próprio synth, porém a proteção global deve continuar sendo tratada com cautela para não criar dois donos concorrentes do áudio.

## Preservado
- Identidade Místico Moderno: fundo noturno sofisticado, azul-noturno/índigo, violeta e esmeralda controlados, dourado/âmbar como acentos e marfim para leitura.
- Logo oficial discreto/transparente como assinatura; na Reintegração da Vida não deve competir com corpo neutro, movimento da luz ou mensagem terapêutica.
- Camadas específicas já implantadas para Boas-vindas, Dashboard, modal e overrides do Místico.
- `LayoutChoiceModal` continua correto internamente: seleção local e confirmação são ações separadas.
- Pagamento continua com confirmação server-side em `/api/payment/confirm`; o perfil só é atualizado quando o retorno é `status === 'paid'`.
- Reintegração continua interrompendo fala e áudio global enquanto aberta.

## Pendente comprovado
1. **Entrada:** separar preferência persistida de confirmação da sessão; perfil com `visualLayout` salvo não pode pular a escolha explícita.
2. **Configurações > Aparência:** remover persistência direta no clique do card; clicar deve selecionar/mostrar prévia, e um segundo comando deve confirmar e só então chamar `saveProfile`.
3. **Áudio/Arcanjo:** validar em execução real a convivência entre áudio global e synth/Solfeggio antes de alterar a lógica; não aplicar correção duplicada sem teste.
4. **Voz:** não substituir aliases/fallbacks por referência antiga apenas por existir no código. A decisão de voz aprovada mais recente prevalece; sem identificador oficial comprovado, manter como pendência em vez de inventar.
5. **Player/animações:** concluir validação desktop/mobile da Reintegração e demais protocolos antes de marcar o Estilo 4 como fechado.

## Regra de continuidade
Aplicar correção mínima e localizada. Não recuperar versões antigas, não alterar conteúdo congelado e não usar CSS para mascarar problema de estado/fluxo.