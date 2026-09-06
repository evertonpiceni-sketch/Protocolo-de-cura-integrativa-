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
