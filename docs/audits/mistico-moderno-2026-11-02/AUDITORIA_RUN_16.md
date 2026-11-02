# Auditoria Estilo 4 — Místico Moderno — Run 16

## Regra de preservação
Esta rodada preserva integralmente as decisões aprovadas posteriores e descarta referências antigas/reprovadas. A prancha oficial do Estilo 4 permanece referência visual subordinada às aprovações posteriores. Nenhuma recoloração global foi introduzida.

## Corrigido / consolidado nesta rodada
- Reauditoria da árvore atual confirmou que as superfícies de Ajustes, Diário, planos e Detalhes do Dia já possuem isolamento específico sob `:root[data-layout="mistico-moderno"]` em `src/mistico-moderno-approved-overrides.css`.
- Confirmado que o logo no Místico permanece tratado como assinatura discreta: opacidade reduzida, inclusive em mobile; esta regra deve permanecer congelada, especialmente na Reintegração da Vida.
- Confirmado que o retorno de pagamento só atualiza o perfil após `/api/payment/confirm` responder `status === 'paid'`; não alterar esse comportamento.
- Confirmado que a Reintegração da Vida assume o áudio ao abrir e chama `stopSpeech()` + `stopBG()`; preservar.

## Bloqueios funcionais ainda ativos
1. **Escolha explícita na entrada:** `App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`. Uma preferência persistida pode, portanto, pular a escolha explícita. A correção deve separar preferência salva (pré-seleção) de confirmação da sessão.
2. **Ajustes > Aparência:** os quatro cards ainda executam `saveProfile({ ...userProfile, visualLayout: layout.id })` diretamente no clique. Isso aplica/persiste antes de confirmação. O clique deve apenas atualizar uma seleção temporária/prévia; a persistência deve ocorrer somente em um CTA explícito de confirmação.
3. **Áudio global x Arcanjo:** o efeito global pausa para `activeSessionDay` e `showPersonalJourney`, mas não inclui `showArcanjoView`; o desbloqueio por gesto repete a mesma condição. Como o Arcanjo também controla Solfeggio/synth, a correção deve ser feita uma única vez no dono global do áudio e validada em execução para evitar dupla gestão.
4. **Voz:** Ajustes ainda expõe seleção baseada nas vozes do sistema e modo automático. Não substituir por aliases antigos ou por ID não comprovado. A decisão de voz aprovada mais recente deve prevalecer.

## Preservado
- Fundo noturno sofisticado e isolamento Místico Moderno.
- Azul noturno/índigo/violeta com esmeralda controlada; dourado/âmbar como acentos; marfim para leitura.
- Efeitos luminosos discretos.
- Logo oficial sutil/transparente como assinatura.
- Diário e superfícies já isoladas.
- Reintegração e proteção de áudio já implantada.
- Confirmação server-side de pagamento.

## Pendente para intervenção segura
- Alterar `App.tsx` em uma única intervenção coerente para: (a) estado de confirmação obrigatória por sessão, (b) pré-seleção sem persistência em Ajustes > Aparência, (c) CTA de confirmação, e (d) incluir Arcanjo na exclusão do áudio global.
- Reauditar desktop/mobile após a alteração, incluindo seletor, player, Solfeggio, Diário, animações e ausência de regressão nos Estilos 1–3.

## Observação de segurança da mudança
Nesta rodada não foi feita substituição parcial de `App.tsx`: o arquivo central concentra autenticação, pagamento, áudio, navegação, configurações e modais. A ação disponível substitui o arquivo completo; aplicar uma edição incompleta sem recuperar/validar integralmente o conteúdo atual criaria risco de regressão em áreas congeladas. O próximo write deve ser atômico e acompanhado de teste/regressão.