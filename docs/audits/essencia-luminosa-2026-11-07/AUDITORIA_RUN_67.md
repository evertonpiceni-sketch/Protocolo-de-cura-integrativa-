# Auditoria Run 67 — Estilo 3 · Essência Luminosa

**Data:** 7 de novembro de 2026  
**Branch:** `main`  
**Base auditada:** `fad7f79bcbd2cfbf39e4ed6e2afa9c46257f4bc4`  
**Proteção adicionada:** `01094c6d1d73c326fc08ad7d2448d26e0d52219e`

## Corrigido nesta rodada

- Reauditado o fluxo de escolha explícita no estado atual da `main`.
- A revisão identificou uma correção recente e relevante no fluxo compartilhado: o logout agora redefine `layoutConfirmedThisSession` e `layoutChoiceRequested`. Isso impede que a conta seguinte herde a confirmação de estilo da conta anterior sem nova escolha.
- Essa correção já estava no código principal desde `b286063fa37ffa56daa97c202117333b8c4078d9`, mas o teste correspondente estava somente na suíte do Estilo 2. Foi acrescentado um teste equivalente em `tests/essencia-luminosa.test.ts`, commit `01094c6d1d73c326fc08ad7d2448d26e0d52219e`.
- Não foi necessário alterar CSS ou componentes visuais do Estilo 3 nesta rodada: a revisão estática não encontrou regressão nova que justificasse reabrir o que já foi aprovado.

## Varredura por página e fluxo

- **Pré-seleção/acesso:** `ProfileSetup` continua usando `ep-auth-prestyle`; não ativa a identidade do Natural Sereno nem importa a fotografia desse estilo.
- **Seletor/prévia:** `LayoutChoiceModal` mantém seleção inicial vazia, card próprio do Estilo 3 e botão de confirmação desabilitado até a escolha.
- **Aplicação do tema:** `App.tsx` mantém `data-layout` ausente até a confirmação explícita; logout limpa a confirmação para a próxima conta.
- **Home/cabeçalho/navegação:** folhas específicas do Estilo 3 permanecem escopadas por `data-layout="essencia-luminosa"`; logo permanece assinatura discreta.
- **Onboarding/acolhimento:** `OnboardingFlow` continua ativo; o fluxo antigo `WelcomeModal` não foi reativado.
- **Anamnese/Guia dos Chakras/Banhos de Ervas:** overrides próprios e tokens atuais preservados.
- **Numerologia/Mapa Astral/Ho'oponopono:** folhas específicas preservadas.
- **Cursos/Biblioteca/Contato/Conquistas:** folhas específicas preservadas.
- **Diário/Diário de Reconexão:** componentes, callbacks e persistência existentes não foram alterados.
- **Configurações de áudio:** Estilos 2 e 3 usam catálogo neural ElevenLabs; a prévia não permite fallback silencioso para Web Speech.
- **Player/canvas/animações:** paleta própria do Estilo 3 preservada; movimento reduzido e estados do player não foram alterados.
- **Solfeggio:** frequências tonais permanecem interrompidas durante a narração; ambiência não tonal, como ondas, continua permitida.
- **Planos/pagamentos:** rotas InfinitePay, preços, cupons e confirmação server-side não foram alterados.

A varredura desta rodada foi estática, por código, folhas CSS e testes existentes. Não houve captura visual de navegador nem teste de hardware.

## Preservado

- Paleta aprovada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, oliva clara/areia como acentos e texto escuro legível.
- Card do Estilo 3 continua ligado a `public/brand/essencia-luminosa/prancha-oficial.webp`.
- Logo oficial permanece discreto, com opacidade reduzida.
- Estilos 1, 2 e 4 não foram redesenhados nem tiveram seus tokens alterados.
- Nenhum componente antigo ou referência marcada como não usar foi reativado.
- Nenhuma regra comercial, conteúdo do Diário ou conteúdo terapêutico foi modificado.

## Referência e natureza — pendências

- A busca por `1001196521.png` e pelo identificador `file_0000000019d0820eb7a70b6c982619d6` não retornou o PNG original acessível nesta execução. O WebP versionado foi mantido; não afirmo comparação pixel a pixel com o original.
- A pasta própria do Estilo 3 ainda contém somente a prancha de prévia, não um conjunto independente de fotografias realistas de natureza.
- A Home mantém `--ep-scene: none` na camada final do Estilo 3. Não foram importadas imagens do Natural Sereno nem da Reintegração da Vida, e nenhum ativo não aprovado foi inventado.

## Validação técnica disponível

GitHub Actions — Security Audit do commit-base `fad7f79bcbd2cfbf39e4ed6e2afa9c46257f4bc4`, run `42388950609`:

- Instalação de dependências: aprovada.
- TypeScript: aprovado.
- Testes de regressão: aprovados.
- Build Vite/Express: aprovado.
- Verificações de entrypoints, padrões de segredos, JWT fail-closed, autenticação administrativa, smoke test e endpoints de pagamento: aprovadas.
- Enforcement final de dependências: falhou por **9 vulnerabilidades (3 moderadas e 6 altas)**.
- Status Vercel do commit-base: falha `build-rate-limit`; não há deploy de produção homologado.

O novo teste de logout foi gravado após esse run e aguarda a execução do workflow correspondente ao novo commit.

## Pendente

1. Recuperar o PNG original para comparação visual direta; manter o WebP atual até então.
2. Integrar fotografias realistas próprias e aprovadas à Home e às páginas que pedem natureza, sem reutilizar ativos de outros estilos.
3. Capturar e homologar todas as páginas em desktop e celular.
4. Testar voz ElevenLabs escolhida, transições Solfeggio, pausa/retomada e animações em dispositivos.
5. Testar checkout, retorno e webhook InfinitePay em sandbox.
6. Resolver as vulnerabilidades de dependências e o bloqueio de implantação Vercel.

**Status:** a correção compartilhada de logout foi revalidada e ganhou cobertura específica na suíte do Estilo 3. Nenhuma decisão visual aprovada foi reaberta. A integração de natureza, a homologação visual real, os testes de hardware/pagamento e a publicação continuam pendentes.
