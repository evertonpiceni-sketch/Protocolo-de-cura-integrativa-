# Status da implementação

Componentes preparados na branch `feature/refined-welcome-experience`:
- `src/components/RefinedWelcomeExperience.tsx`
- `src/components/GuidedMeditationStore.tsx`
- `src/components/ChakraDailyMandala.tsx`
- `src/lib/wellnessExperience.ts`

## Proteções
Os componentes permanecem desacoplados do fluxo de produção até build/testes. Checkout e liberação exigem confirmação server-side. Os assets dos chakras devem usar as artes aprovadas e a rotação respeita `prefers-reduced-motion`.

## Estado de validação
Código criado e revisado estruturalmente. Build/runtime ainda não executados neste ambiente; o PR permanece em rascunho.

## Decisões incorporadas
- acolhimento essencial gratuito;
- meditações premium iniciais a R$ 10, com prévia e acesso permanente após pagamento confirmado;
- Protocolos Energizados de 7 Dias, 21 Dias e São Miguel separados das Jornadas;
- paisagem sonora por escolha do usuário;
- sequência Muladhara, Svadhisthana, Manipura, Anahata, Vishuddha, Ajna e Sahasrara com iconografia aprovada.

> A pessoa pode pagar para aprofundar a experiência — nunca para merecer acolhimento.

## Antes do merge
- executar build e lint;
- integrar navegação sob rollout;
- adicionar assets aprovados dos sete chakras;
- conectar prévia ao audioEngine;
- implementar checkout/entitlement server-side;
- testar mobile, acessibilidade e persistência.

Last staging commit.
