# Auditoria — Estilo 2 Elegância Profunda — Run 46

## Corrigido / consolidado nesta rodada
- Reauditoria da árvore atual na `main`, preservando decisões aprovadas posteriores e sem recuperar referências reprovadas.
- Confirmado que o fluxo ativo da Reintegração usa `/api/reintegration-tts` para os cues neurais e, quando a voz neural falha, agenda nova tentativa mantendo o player de mídia ativo; não há chamada ativa ao helper nativo no caminho de reprodução.
- Confirmado que as camadas específicas do Estilo 2 continuam isoladas por `data-layout="elegancia-profunda"` para mapas, vídeo/promocional, modais, contato, Diário, boas-vindas, cursos, dashboard, detalhe diário, navegação inferior, Diário diário, Ho'oponopono e conquistas.
- Reauditado pagamento: o checkout geral continua partindo de `/api/payment/create-checkout`; não reintroduzir PIX manual nos fluxos já corrigidos.

## Preservado
- Identidade Elegância Profunda: canvas profundo, natureza integrada, verde profundo somente intencional, champagne/bronze/marfim e dourado nobre.
- Logo oficial como assinatura sutil/transparente, sem competir com a experiência visual.
- Seletor/prévia: manter a proteção de escolha explícita já instalada; preferência persistida deve ser apenas pré-seleção, nunca aplicação silenciosa.
- Diário, player, conteúdo dos 21 dias, Media Session e wake lock não foram redesenhados nem reescritos nesta rodada.
- Confirmação server-side de pagamento permanece regra obrigatória antes de liberar acesso.

## Pendente comprovado
1. `src/components/PersonalJourney21.tsx` ainda contém código morto de `speechSynthesis`: `nativeUtteranceRef`, `speakCueNatively`, seleção de vozes do dispositivo e cancelamento nativo em `clearVoice()`. O caminho neural ativo não chama esse helper, mas ele deve ser removido da origem para impedir regressão futura para voz robótica.
2. A remoção acima exige edição integral segura de `PersonalJourney21.tsx`; o conector de conteúdo disponível nesta execução truncou o arquivo completo. Não foi feita substituição parcial arriscada que pudesse apagar conteúdo aprovado.
3. Permanecem testes funcionais reais em desktop/mobile para Solfeggio/ownership de áudio, continuidade do player com tela bloqueada/Media Session e animações. Inspeção estática não substitui reprodução real.

## Critério para a próxima correção
- Remover somente o código morto de `speechSynthesis` quando o arquivo integral puder ser editado com segurança; manter `voiceRef`, `/api/reintegration-tts`, retry neural, Media Session, wake lock, soundtrack e conteúdo exatamente como estão.
- Não alterar visual aprovado do Estilo 2 sem um achado reproduzível de herança de outro estilo.
