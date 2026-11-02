# Auditoria — Estilo 4 Místico Moderno — Run 12

## Corrigido / consolidado nesta rodada
- Reauditoria página por página continuada sobre a árvore atual, preservando as camadas exclusivas já implantadas para Místico Moderno.
- Confirmado que a camada semântica atual converte hardcodes claros (`#F8F4EC`, `#FBF8F2` etc.) para tokens do layout ativo; não foi criada nova recoloração global nesta rodada.
- Confirmado que Configurações já possui proteção específica sob `data-layout="mistico-moderno"`, portanto os cartões claros existentes no JSX não devem ser tratados com alteração direta sem regressão visual comprovada.
- Confirmado que Dashboard e Estúdio de Vídeos já possuem isolamento específico do Místico; preservar.

## Preservado
- Identidade Místico Moderno: noite/índigo/violeta/esmeralda controlado, dourado/âmbar como acentos e marfim para leitura.
- Logo oficial discreto/transparente como assinatura visual.
- Reintegração da Vida continua dona do áudio enquanto aberta: `App.tsx` executa `stopSpeech()` e `stopBG()` quando `showPersonalJourney` está ativo.
- Pagamento continua com confirmação server-side em `/api/payment/confirm` e atualização do perfil somente após `status === 'paid'`.
- O `LayoutChoiceModal` mantém seleção e confirmação como ações separadas; o botão permanece desabilitado sem seleção.

## Pendente comprovado — prioridade de correção
1. **Escolha explícita dos quatro estilos:** `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`. Perfil com preferência persistida pode pular a escolha. Corrigir no estado/fluxo: preferência salva deve servir apenas como pré-seleção; a sessão precisa exigir confirmação explícita antes de aplicar qualquer estilo. Não mascarar por CSS.
2. **Áudio do protocolo Arcanjo / Solfeggio:** `ArcanjoProtocolView.tsx` inicia e interrompe o synth próprio corretamente, mas o controle global de background em `App.tsx` não considera `showArcanjoView` em `shouldPlay`. Isso mantém risco de trilha global coexistir com o synth do protocolo. A correção deve incluir `!showArcanjoView` na condição global (e dependências do efeito), preservando o comportamento já aprovado da Reintegração.
3. **Voz:** `ArcanjoProtocolView.tsx` ainda usa aliases legados `Rachel`/`Marcus` quando `userProfile.voiceId` não existe. Não substituir por ID inventado. Assim que o identificador oficial da voz feminina BR aprovada estiver comprovado no projeto/configuração, remover aliases legados e centralizar o fallback oficial.
4. **Validação executada:** ainda é necessária passagem real desktop/mobile para player, animações terapêuticas e coexistência de áudio, pois inspeção estática não comprova sincronização visual/sonora.

## Critério da próxima correção
Aplicar alteração mínima no fluxo proprietário (`App.tsx`) para escolha explícita e exclusão do áudio global durante Arcanjo, reauditar e somente então avançar para outra página. Não alterar conteúdo terapêutico congelado nem os Estilos 1–3.