# Auditoria — Estilo 2 Elegância Profunda — Run 33

## Corrigido / consolidado nesta rodada
- Reauditoria do fluxo estrutural de escolha de estilo confirmou que a regressão não é visual: `src/App.tsx` aplica `data-layout` diretamente a partir de `userProfile.visualLayout` e só monta `LayoutChoiceModal` quando a preferência persistida está vazia.
- Não foi adicionada nova sobreposição CSS para mascarar esse comportamento. A correção correta permanece no estado/fluxo: preferência salva deve servir apenas como pré-seleção; aplicação efetiva deve depender de confirmação explícita da sessão.
- Revalidado o bloqueio de sobreposição de áudio: ao abrir Reintegração, `audioEngine.stopSpeech()` e `audioEngine.stopBG()` são chamados, e o player global também deixa de tocar durante sessão/Reintegração.
- Revalidada a confirmação server-side de pagamento: o perfil só é atualizado quando `/api/payment/confirm` responde com `status === 'paid'`.

## Preservado
- Camadas exclusivas do Estilo 2 continuam isoladas por `data-layout="elegancia-profunda"`.
- Identidade aprovada: verde profundo intencional, marfim/champagne/bronze, hierarquia refinada e botões premium.
- Diário, Dashboard, cabeçalho, instalação PWA, vídeo promocional, certificado e demais superfícies já corrigidas não receberam regressões nesta rodada.
- Logo oficial permanece como assinatura sutil/transparente; nenhuma regra nova aumenta contraste ou protagonismo do logo.
- Não foi introduzido alias, voz do sistema ou identificador de voz não comprovado.

## Pendente comprovado
1. **Seletor dos quatro estilos — bloqueador estrutural:** separar `savedVisualLayout` (pré-seleção) de `confirmedSessionLayout` (aplicação), manter o modal visível antes da aplicação automática e persistir somente após confirmação.
2. **Voz oficial:** o repositório não contém ocorrência comprovada de `Maiara`, `voiceId`, `voice_id` ou `elevenlabs` associada à voz aprovada. Não substituir por fallback inventado.
3. **Validação executada:** Solfeggio, player e animações ainda precisam de teste funcional desktop/mobile para comprovar ausência de sobreposição e aderência à micro-narrativa aprovada.

## Reauditoria
- `src/App.tsx`: confirmação de pagamento permanece condicionada a `status === 'paid'`.
- `src/App.tsx`: Reintegração continua interrompendo fala e música global.
- `src/App.tsx`: preferência persistida ainda é aplicada diretamente a `document.documentElement.dataset.layout`.
- `src/App.tsx`: `LayoutChoiceModal` ainda depende de `!userProfile.visualLayout`.
- Nenhuma referência antiga/reprovada foi reintroduzida nesta rodada.
