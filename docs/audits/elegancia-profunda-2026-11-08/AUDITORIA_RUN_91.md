# Auditoria RUN 91 — Estilo 2: Elegância Profunda

Data: 08/11/2026  
Branch: `main`  
HEAD de código auditado: `e955ee5724ef204450433d8f22eb2d192470cf46`  
Base da comparação: `27b5df0dc45a812515cf9a194d4369c98bae5de8`

## Resumo

A comparação desde a RUN 90 encontrou seis commits posteriores. A maior parte das alterações era da Essência Luminosa (Estilo 3), mas também havia mudanças em `ProUpgradeModal.tsx`, `paymentRoutes.ts`, `App.tsx`, `server.ts` e no guia de planos, relacionadas à escolha explícita de benefício nos planos semestral e anual.

A lógica nova de pagamento estava validada no servidor, mas o componente compartilhado `ProUpgradeModal` ainda renderizava o checkout com superfícies creme, texto oliva e botões claros. Não havia tratamento correspondente para `#plans-modal` nas folhas específicas da Elegância Profunda. Isso fazia o checkout destoar do tema escuro aprovado quando aberto no Estilo 2.

## Corrigido

- Adicionada camada CSS restrita a `:root[data-layout="elegancia-profunda"] #plans-modal` em `src/elegancia-profunda-modal-audit.css`.
- Harmonizados fundo do modal, cabeçalho, cartões de planos, seção de checkout, cupom, campos, métodos de pagamento, mensagens de erro e botões.
- O bloco `#plan-benefit-choice` agora usa verde profundo, ouro/champagne e marfim; as opções têm estados normal, hover, foco, selecionado e desabilitado coerentes com a Elegância Profunda.
- A seleção ativa permanece explícita por `aria-pressed="true"`; não foi alterado o conteúdo, a regra de escolha nem o fluxo de pagamento.
- Adicionado teste de regressão em `tests/style2-shared-entitlements.test.ts`, garantindo que o checkout compartilhado tenha acabamento próprio do Estilo 2 e que os seletores permaneçam isolados.

Commits:
- CSS: `cdc1ae3145a72b462ba486d90e085cdf0c31109f`
- Teste: `e955ee5724ef204450433d8f22eb2d192470cf46`

## Preservado / revalidado

- Os 21 imports CSS da Elegância Profunda continuam ativos em `src/main.tsx`; a antiga `elegancia-profunda-welcome-audit.css` permanece fora dos imports.
- As 21 folhas específicas não foram modificadas pelos seis commits posteriores à RUN 90. As regras de isolamento continuam sob `data-layout="elegancia-profunda"`.
- Seletor dos quatro estilos: escolha inicial vazia, confirmação explícita e aplicação somente após persistência.
- Logo oficial com opacidade de 30%, wrapper transparente e sem protagonismo excessivo.
- Identidade verde profundo, ouro nobre, champagne, bronze e marfim; jornada de 21 dias e corpo neutro.
- Voz neural, ausência de fallback robótico silencioso, bloqueio das oito frequências Solfeggio durante prévia neural, ambiências não tonais, Diário, player e animações.
- As mudanças de Estilo 3 continuam isoladas por `data-layout="essencia-luminosa"`.
- Pagamentos: planos semestrais/anuais exigem uma escolha entre Mapa Astral Completo e Numerologia Completa; o servidor valida a opção, registra somente o benefício escolhido e preserva `subscriptionBenefitChoice` na sincronização do perfil. Acessos não elegíveis e opções inválidas continuam rejeitados.

## CI e publicação

- GitHub Actions **#42481463179**, no HEAD `e955ee5`: concluído com sucesso.
- npm audit: **0 vulnerabilidades**.
- TypeScript, testes de regressão, build, entrypoints Express, verificações JWT/segredos/administração e verificações automatizadas de pagamento: aprovados.
- O status combinado do commit ainda mostra Vercel em falha com `build-rate-limit`. O build aprovado no GitHub não equivale a deployment publicado; produção permanece sem homologação.

## Referência visual e pendências

- O card segue apontando para o ativo oficial versionado `/brand/elegancia-profunda/prancha-oficial.svg`.
- A busca de arquivos por `1001194194.png`, pelo identificador `file_00000000121c820e931b56bb6b1467e9` e pela descrição da prancha não recuperou o original nesta execução. Não foi usado outro card como substituto e não houve ampliação artificial. A prévia versionada continua em 240 × 180 px.
- `--ep-scene:none` permanece intencional até existir fotografia real de natureza exclusiva e aprovada.
- Pendente: derivação fiel da prancha em alta densidade; fotografia própria aprovada; capturas e comparação de todas as páginas em desktop/mobile; homologação física de voz, Solfeggio, ambiências, player, animações e persistência do Diário; transação InfinitePay em sandbox com conferência do webhook; resolução do limite Vercel e homologação da produção.

## Conclusão

A RUN 91 corrigiu uma regressão visual concreta no checkout compartilhado: a Elegância Profunda agora recebe tratamento próprio também na escolha de benefícios semestrais/anuais, sem alterar a lógica de pagamento nem os demais estilos. O novo teste e o pipeline do HEAD passaram. A publicação e a homologação visual/física continuam pendentes.
