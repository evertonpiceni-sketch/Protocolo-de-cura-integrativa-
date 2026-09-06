# Status da implementação

Componentes preparados na branch `feature/refined-welcome-experience`:

- `src/components/RefinedWelcomeExperience.tsx`
- `src/components/GuidedMeditationStore.tsx`
- `src/components/ChakraDailyMandala.tsx`
- `src/lib/wellnessExperience.ts`

## Proteções

Os componentes foram criados de forma desacoplada para não substituir ainda o fluxo de produção. A integração no `App.tsx` será feita somente após build/testes da branch.

Checkout real e liberação de meditações exigem confirmação server-side de pagamento. O clique em comprar nunca deve, sozinho, preencher `ownedIds`.

Os assets finais dos chakras devem usar as artes fidedignas aprovadas. A rotação ocorre no componente visual e respeita `prefers-reduced-motion`.

## Estado de validação

Código criado e revisado estruturalmente. Build/runtime ainda não executados neste ambiente; portanto o PR permanece em rascunho e não deve ser mesclado até a validação automatizada ou local.

## Decisões de produto incorporadas

Acolhimento essencial gratuito; conteúdo premium aprofunda a experiência. Meditações premium do catálogo inicial usam preço simbólico de R$ 10, prévia e acesso permanente após confirmação de pagamento.

> A pessoa pode pagar para aprofundar a experiência — nunca para merecer acolhimento.

Os Protocolos Energizados (7 Dias, 21 Dias e São Miguel) continuam conceitualmente separados das Jornadas de autocuidado.

A paisagem sonora oferece silêncio, natureza, meditação, ambiente suave e frequências, sempre por escolha do usuário.

A sequência diária dos chakras é Muladhara, Svadhisthana, Manipura, Anahata, Vishuddha, Ajna e Sahasrara; os assets finais devem preservar a iconografia aprovada.

Não foram adicionados assets inventados ao repositório: a arte final deve ser a coleção visual aprovada pelo proprietário do projeto.

O redesign não altera ainda autenticação, progresso persistido ou APIs existentes.

PR de trabalho: #13. Manter como draft até build e testes reais.

A Home de produção ainda não foi substituída; isso é intencional para que o rollout possa ser validado sem quebrar a experiência existente.

### Checklist antes do merge
- executar build e lint;
- integrar os componentes na navegação sob controle de rollout;
- adicionar assets aprovados dos sete chakras;
- conectar prévia de áudio ao audioEngine;
- implementar checkout e entitlement server-side;
- testar mobile, acessibilidade e persistência.

O ref da branch precisa avançar para o último commit para que o PR inclua estes arquivos.
