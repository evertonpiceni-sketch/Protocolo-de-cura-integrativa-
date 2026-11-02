# Auditoria — Estilo 4 Místico Moderno — Run 19

## Regra de referência
Preservar decisões aprovadas posteriores e usar a prancha oficial do Estilo 4 como referência visual subordinada a elas. Não recuperar versões antigas, reprovadas, substituídas ou marcadas como não usar.

## Corrigido / consolidado nesta rodada
- Reauditoria do fluxo de pagamento identificou uma segunda herança de PIX manual em `src/components/NumerologyModal.tsx`.
- O componente ainda define `handleCopyPix()` com `navigator.clipboard.writeText('evertonpiceni@gmail.com')`, embora o próprio fluxo já use `/api/payment/create-checkout`.
- A mesma herança permanece em `src/components/SpecificTreatmentModal.tsx`, onde selecionar PIX chama `handleCopyPix()` antes do checkout.
- A decisão vigente exige checkout InfinitePay nos projetos Protocolo/Anamnese, sem chave PIX manual. Portanto, ambos os `handleCopyPix()` são legado a remover na origem.

## Preservado
- Identidade Místico Moderno: fundo noturno sofisticado; azul-noturno/índigo/esmeralda/violeta; dourado/âmbar como acentos; marfim para leitura; efeitos luminosos discretos.
- Logo oficial sutil/transparente como assinatura, especialmente na Reintegração da Vida.
- Reintegração e suas proteções de áudio já aprovadas.
- Confirmação server-side de pagamento antes de liberar entitlement/acesso.
- Camadas específicas do Místico já implantadas, sem recoloração global dos Estilos 1–3.

## Pendente comprovado
1. `SpecificTreatmentModal.tsx`: remover `handleCopyPix()` e a chamada automática ao selecionar PIX; PIX deve apenas definir `paymentMethod` e seguir para `/api/payment/create-checkout`.
2. `NumerologyModal.tsx`: remover `handleCopyPix()`, estado/feedback de chave copiada e qualquer UI de cópia manual; pagamento deve seguir exclusivamente pelo checkout.
3. Seletor dos quatro estilos: manter preferência salva apenas como pré-seleção e exigir confirmação explícita antes da aplicação/persistência.
4. Ajustes > Aparência: clique no card não deve persistir imediatamente; deve selecionar/pré-visualizar e aguardar CTA de confirmação.
5. Áudio global/Arcanjo: validar e corrigir a exclusão da trilha global durante o Arcanjo sem duplicar a gestão local do synth/Solfeggio.
6. Voz: não substituir por alias/ID antigo sem comprovação da voz oficial aprovada mais recente.
7. Executar validação desktop/mobile de player, Solfeggio, Diário e animações após as correções funcionais.

## Limitação desta rodada
A integração disponível permite substituir arquivos inteiros, mas a leitura dos componentes grandes chega truncada. Não foi feita substituição parcial insegura em `SpecificTreatmentModal.tsx`, `NumerologyModal.tsx` ou `App.tsx`, para não apagar conteúdo aprovado. A correção deve ser atômica quando o conteúdo integral estiver disponível.