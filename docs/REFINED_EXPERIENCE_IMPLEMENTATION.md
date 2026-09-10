# Experiência Refinada — implementação e testes

## Norte
**Que bom que você se ouviu e está aqui.**

A experiência acolhe antes de oferecer conteúdo e preserva a identidade espiritual do projeto.

## Implementado na branch
- componente `RefinedWelcomeExperience`: acolher → escutar → responder → escolher paisagem sonora;
- nenhuma paisagem sonora inicia sem escolha explícita;
- `GuidedMeditationStore`: catálogo premium, prévia, compra única de R$ 10 e acesso permanente;
- práticas essenciais permanecem gratuitas como princípio de produto;
- `ChakraDailyMandala`: suporte ao visual diário dos sete chakras com rotação suave e `prefers-reduced-motion`;
- metadados dos chakras e dos Protocolos Energizados preservados em `wellnessExperience.ts`;
- Academia continua dependente da feature flag já existente e não é ativada por estas mudanças.

## Próxima integração
Os novos componentes foram deliberadamente mantidos desacoplados do `App.tsx` nesta etapa para reduzir risco de regressão no fluxo de autenticação, progresso e protocolos existentes. A integração na Home deve ser feita após build/testes da branch.

As imagens finais dos chakras devem ser fornecidas como assets aprovados. O código não tenta redesenhar símbolos tradicionais por CSS; recebe `imageSrc`, permitindo usar a arte fidedigna aprovada.

O botão de compra da loja é uma interface por callback (`onBuy`). Nenhum pagamento é considerado aprovado pelo front-end sozinho; a liberação permanente deverá ser confirmada no backend pelo provedor de pagamento antes de preencher `ownedIds`.

## Critérios de teste
1. TypeScript/build sem erros.
2. 320 px sem rolagem horizontal.
3. teclado e foco visível.
4. `prefers-reduced-motion` interrompe a rotação dos chakras.
5. áudio não inicia automaticamente e não sobrepõe sessão guiada.
6. compra não libera conteúdo apenas por ação do cliente.
7. protocolos 7/21 dias e São Miguel permanecem separados de Jornadas.
8. logout/login não perde progresso sincronizado.
9. Academia permanece invisível na Etapa 1.

## Princípio comercial
**A pessoa pode pagar para aprofundar a experiência — nunca para merecer acolhimento.**
