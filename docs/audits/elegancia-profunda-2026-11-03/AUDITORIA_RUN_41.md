# Auditoria — Estilo 2 Elegância Profunda — Run 41

## Corrigido
- Reauditado o fluxo de seleção dos quatro estilos na árvore atual.
- Confirmado que `LayoutChoiceModal` já exige seleção + confirmação e que `layoutSettingsExplicitConfirmationPatch.ts` já protege Ajustes > Aparência contra aplicação no primeiro clique.
- Corrigida a regressão restante no retorno de usuários com preferência persistida: `requiredLayoutChoiceEntryPatch.ts` agora coloca o documento em estado neutro `layout-choice-pending` e usa `MutationObserver` para impedir que `App.tsx` aplique `userProfile.visualLayout` atrás do seletor antes da confirmação explícita.
- A preferência persistida continua sendo apenas pré-seleção; após confirmação e sincronização bem-sucedida, o guard é liberado, a escolha é aplicada e a sessão recarrega.
- Em falha de autenticação/sincronização, o guard é liberado ou mantém o seletor com mensagem de nova tentativa, sem sobrescrever dados aprovados.

## Preservado
- Os quatro estilos oficiais e suas prévias.
- Estilo 2 com identidade profunda/champagne/bronze/marfim e verde profundo apenas intencional.
- Logo oficial sutil/transparente como assinatura.
- Pagamento com confirmação server-side `status === 'paid'` antes de atualizar o perfil.
- Reintegração continua com propriedade do áudio: `stopSpeech()`/`stopBG()` ao abrir e bloqueio do áudio global enquanto `showPersonalJourney` está ativo.
- Diário, Dashboard, detalhe diário, Prática Individual, cabeçalho, PWA, vídeo e camadas já corrigidas não foram reescritos.

## Pendente
1. Primeira escolha de usuário sem `visualLayout`: o modal React já exige confirmação; a árvore principal ainda possui efeito que normaliza `visualLayout` ausente. A correção estrutural ideal continua sendo mover a aplicação de `data-layout` para estado confirmado, em vez de depender de proteção externa.
2. Voz oficial: manter sem alias/ID inventado até existir identificador verificável da voz aprovada.
3. Solfeggio, player e animações: executar validação funcional desktop/mobile para confirmar comportamento real e ausência de sobreposição/regressão.
4. Continuar varredura página por página por heranças visuais não semânticas ainda não cobertas pelas camadas proprietárias do Estilo 2.

## Reauditoria
- `requiredLayoutChoiceEntryPatch.ts` permanece importado em `main.tsx` antes da renderização do App.
- `layoutSettingsExplicitConfirmationPatch.ts` permanece importado e mantém confirmação explícita em Ajustes.
- Nenhuma regra visual dos Estilos 1, 3 ou 4 foi alterada nesta rodada.
