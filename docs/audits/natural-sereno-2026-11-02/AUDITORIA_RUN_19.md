# Auditoria — Estilo 1 Natural Sereno — Run 19

## Corrigido / consolidado
- Reauditoria da árvore atual após as correções visuais anteriores. A camada `natural-sereno-final-audit.css` continua preservando base creme/marfim, café, dourado refinado, verde apenas como acento e logo oficial discreto.
- Confirmado que a confirmação geral de pagamento em `App.tsx` só atualiza o perfil após retorno server-side `status === 'paid'`; preservar.

## Achados funcionais confirmados
1. **Solfeggio / áudio global:** `App.tsx` ainda calcula `shouldPlay` sem `showArcanjoView`, tanto no efeito global quanto no desbloqueio por gesto. Isso permite que o áudio global continue/reinicie durante a experiência Arcanjo/Solfeggio. Correção atômica: adicionar `!showArcanjoView` nas duas condições e `showArcanjoView` nas dependências correspondentes.
2. **Voz Natural Sereno:** `MeditationSession.tsx` ainda envia o alias literal `Rachel` quando `voiceGender === 'feminina'`, embora o projeto possua `OFFICIAL_PROTOCOL_VOICE_ID = mJqP14JQFEK0PojR5lfV` (Marianne — Meditação). O backend ainda trata `Rachel` como voz legada distinta. Corrigir o caminho feminino do Natural Sereno para a voz oficial vigente, sem inventar novo ID.
3. **Pagamento / Prática Individual:** `SpecificTreatmentModal.tsx` ainda contém `handleCopyPix()` que copia `evertonpiceni@gmail.com` e é chamado ao selecionar PIX. Isso viola a decisão vigente: PIX deve ser apenas método dentro do checkout InfinitePay. Remover a cópia/chave manual; selecionar PIX deve apenas definir `paymentMethod='pix'` e seguir para `/api/payment/create-checkout`.
4. **Pagamento / Numerologia:** `NumerologyModal.tsx` também conserva `handleCopyPix()` com a mesma chave manual. Deve ser removido pelo mesmo motivo, preservando apenas checkout InfinitePay.
5. **Seletor dos quatro estilos:** permanece necessário separar preferência persistida de confirmação explícita na entrada; preferência salva deve ser apenas pré-seleção.

## Preservado
- Conteúdo terapêutico e lógica já aprovados.
- Reintegração da Vida continua dona exclusiva do áudio enquanto aberta (`stopSpeech()` + `stopBG()`).
- Confirmação server-side de pagamento antes de liberar perfil/acesso.
- Camadas visuais já aprovadas do Natural Sereno e assinatura sutil/transparente do logo.

## Pendente para intervenção segura
As correções funcionais acima ficam delimitadas para edição nos arquivos-fonte. Não foi feita substituição integral de `App.tsx`, `MeditationSession.tsx` ou modais extensos nesta rodada porque o conector de conteúdo exige replacement completo e a leitura integral desses arquivos é truncada; substituir conteúdo parcial arriscaria apagar código aprovado. Prioridade: (1) remover PIX manual; (2) bloquear áudio global no Arcanjo; (3) alinhar voz oficial; (4) corrigir seletor explícito; (5) validar renderização desktop/mobile.