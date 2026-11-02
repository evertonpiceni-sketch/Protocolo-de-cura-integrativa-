# Auditoria — Estilo 3 Essência Luminosa — Run 34

## Corrigido
- `SpecificTreatmentModal.tsx`: removida a herança de PIX manual (`evertonpiceni@gmail.com`), incluindo cópia automática e chave exposta na interface.
- PIX agora permanece apenas como método selecionado e segue exclusivamente para `/api/payment/create-checkout`, com texto explícito de checkout seguro InfinitePay e liberação somente após confirmação.
- Corrigido o valor visual fixo `R$ 70,00`: a área de pagamento agora usa `formattedBasePrice`/`formattedFinalPrice`, coerentes com ciclo, valor personalizado e cupom.
- Mantidos os valores vigentes do componente: 1 dia R$ 20,00; 7 dias R$ 59,90; 21 dias R$ 99,90.

## Preservado
- Confirmação server-side e redirecionamento via `checkoutUrl`.
- Conteúdo funcional da Prática Individual, ciclos, categorias, relatos, cupons e tratamentos existentes.
- Camadas visuais já aprovadas do Estilo 3 continuam isoladas por `data-layout="essencia-luminosa"`; logo permanece sutil/transparente conforme regra congelada.

## Reauditoria / pendente
- A Numerologia ainda contém herança separada de PIX manual e deve ser corrigida na origem em rodada própria.
- Seletor dos quatro estilos ainda precisa garantir confirmação explícita antes de aplicar preferência persistida.
- Voz oficial, Solfeggio/player/animações ainda precisam de validação executada desktop/mobile.
- Não houve workflow de CI associado ao commit desta correção; validação de build/deploy continua pendente.

## Commit funcional
- `001802a7ab1c36803ee6f4c86b6d8f37b01bd433`
