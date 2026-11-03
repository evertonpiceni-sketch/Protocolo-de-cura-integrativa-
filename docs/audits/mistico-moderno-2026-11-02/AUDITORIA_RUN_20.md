# Auditoria — Estilo 4 Místico Moderno — Run 20

## Referência e precedência
- Referência visual oficial: prancha Estilo 4 `1001196522.png` / `file_000000009978820eb49581883ae6340d`.
- Decisões aprovadas posteriores prevalecem; aprovado permanece congelado; antigo/reprovado/substituído/não usar permanece descartado.
- Na Reintegração da Vida, o logo oficial permanece sutil/transparente como assinatura, sem competir com a experiência visual.

## Corrigido / estado atual revalidado
- Reauditoria do pagamento na árvore atual corrigiu uma pendência documental antiga: `SpecificTreatmentModal.tsx` já não contém `handleCopyPix()` nem cópia automática da chave manual; o pedido segue por `/api/payment/create-checkout`.
- Reauditoria cruzada confirmou que `NumerologyModal.tsx` também já teve o fluxo legado de PIX manual removido na árvore atual. Portanto, essas duas pendências deixam de ser tratadas como abertas no Estilo 4.
- O contato por e-mail existente em `ContactModal.tsx` é funcionalidade de contato e não deve ser confundido com chave PIX/pagamento.

## Preservado
- Camadas visuais do Místico Moderno permanecem isoladas sob `data-layout="mistico-moderno"`, sem recoloração global dos Estilos 1–3.
- Identidade noturna sofisticada, índigo/azul-noturno/violeta, esmeralda controlada, dourado/âmbar como acento e marfim para leitura.
- Reintegração, Diário, player e módulos já protegidos pelas camadas específicas do Místico não foram reescritos nesta rodada.
- Checkout e confirmação server-side permanecem como fluxo de pagamento; nenhuma chave PIX manual foi reintroduzida.

## Pendente comprovado na origem
1. **Escolha explícita dos quatro estilos:** `src/App.tsx` ainda monta `LayoutChoiceModal` somente quando `!userProfile.visualLayout`. Uma preferência persistida pode pular a escolha explícita. A preferência deve ser apenas pré-seleção e a sessão deve exigir confirmação.
2. **Ajustes > Aparência:** a persistência do estilo ainda precisa ser separada do clique de prévia; o card não deve aplicar automaticamente antes do CTA de confirmação.
3. **Áudio global / Arcanjo:** permanece necessária a validação/correção atômica da exclusão do áudio global durante a experiência Arcanjo/Solfeggio, sem interferir no synth local nem na proteção já aprovada da Reintegração.
4. **Voz oficial:** não substituir ID/alias automaticamente sem comprovação de correspondência com a voz feminina BR aprovada mais recente; evitar fallback robótico/legado.
5. **Validação executada:** ainda falta build/teste e inspeção desktop/mobile integrada de seletor, Diário, player, Solfeggio, Arcanjo, Reintegração, animações e checkout.

## Regra para próxima intervenção
Corrigir somente as pendências funcionais comprovadas acima na origem. Não criar novas camadas cosméticas para mascarar estado React e não alterar áreas já aprovadas apenas porque o componente-base contém classes claras neutralizadas pelo escopo do Místico.
