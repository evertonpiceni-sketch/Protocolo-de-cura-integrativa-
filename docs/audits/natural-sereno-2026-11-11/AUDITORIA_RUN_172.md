# Auditoria RUN 172 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79

## Corrigido

- Em `src/natural-sereno-final-audit.css`, alinhei a regra global de assinatura do logo de `opacity: .24` para `.30`. A camada aprovada final já usava 30%; a alteração elimina a declaração divergente anterior e evita regressão se a ordem da cascata mudar.
- Adicionado `tests/natural-sereno-run172-logo-reference-gate.test.ts`, protegendo a opacidade aprovada, a transparência da assinatura na Reintegração, a referência visual integral e a confirmação explícita do seletor.
- Após as alterações, foram realizadas **25 verificações estáticas de fonte; 25/25 passaram**.

## Preservado e reauditoria por área

- **Referência visual:** o card React continua apontando para `docs/visual-qa/natural-sereno/reference.jpg`, derivado da prancha informada `1001196520.png`; a miniatura usa `object-contain`, sem recorte. O binário original não foi retornado pela busca de arquivos desta execução; a imagem derivada versionada foi inspecionada. Elementos históricos da prancha (grandes superfícies verdes e chakras) não foram reintroduzidos porque decisões posteriores prevalecem.
- **Seletor:** os quatro estilos oficiais permanecem disponíveis; a seleção começa vazia, o botão de confirmação fica desabilitado até a escolha e o tema só é aplicado após confirmação na sessão. O chooser DOM legado não é montado.
- **Home e paisagens:** NaturalSerenoHome é a rota ativa do Estilo 1. Home usa `vale-amanhecer.webp`, com enquadramentos separados para desktop e mobile; acolhimento usa `acolhimento.webp` com véu marfim; carregamento usa `presenca.webp` com leitura marfim; comunidade usa a paisagem de cachoeira com superfície clara. Paleta ativa: creme/marfim, café/marrom, dourado refinado e verde apenas em pequenos acentos.
- **Telas NaturalSerenoHome:** home, menu, jornada, recursos, ferramentas, perfil, resultado e comunidade foram conferidas no código. Também foram conferidos cabeçalho, rodapé, ajustes, anamnese, Diário, Arcanjo e modais da Reintegração.
- **Logo:** assinatura de baixa opacidade; na Reintegração permanece a 30%, transparente, sem moldura, fundo ou sombra dominantes.
- **Voz:** `OFFICIAL_PROTOCOL_VOICE_ID` permanece Marianne (`mJqP14JQFEK0PojR5lfV`). Natural Sereno usa voz neural selecionada, sem fallback nativo nos fluxos verificados. A rota da Reintegração exige autenticação, usa cache privado e retorna erro sem fallback robótico.
- **Solfeggio:** a política impede frequências tonais durante narração/sessão falada e durante prévia neural; o som ambiente não tonal segue a política de reprodução.
- **Diário:** sincronização valida a identidade da conta de origem; o histórico renderiza texto como conteúdo React, sem `dangerouslySetInnerHTML`. Regras de superfície e exportação permanecem preservadas.
- **Player e animações:** áudio real, progresso, Media Session, controles, movimento da luz e transições existentes foram preservados. O componente SVG `NeutralBodyLightProgress` apresenta silhueta neutra e um único percurso de luz, sem marcadores de chakras.
- **Componentes antigos:** classes utilitárias antigas permanecem em componentes compartilhados apenas onde necessárias para os outros estilos; os overrides do Natural Sereno são escopados. O chooser DOM antigo não é montado.
- **Estilos 2, 3 e 4:** nenhuma regra de tema desses estilos foi alterada nesta rodada.

## Pagamentos

- `paymentRoutes.ts` mantém a exigência de `INFINITEPAY_API_KEY`, pagamento único (`single_payment: true`), validação server-side e guard de ambiente `PAYMENTS_PRODUCTION_ONLY`.
- Inventário Vercel sem descriptografar segredos: `INFINITEPAY_API_KEY` não cadastrada; `INFINITEPAY_HANDLE` apenas em Production; `PUBLIC_APP_URL` não configurada para a branch atual (há configuração Preview em outra branch antiga). O Preview da branch atual tem apenas o namespace isolado `UPSTASH_DB_KEY`.
- Sandbox, checkout e webhook não puderam ser homologados. Nenhuma cobrança foi realizada.

## Pendências e limitações

- **CI/testes/build:** o teste RUN 172 foi adicionado, mas a suíte `npm test`, `npm run lint` e `npm run build` não foram executadas pelo runner. As 25/25 verificações são inspeções estáticas de fonte, não aprovação de CI.
- **Vercel:** projeto `protocolodecuraintegrativa` está `live=false`. O último deployment de branch consultado, no commit `7a3c512c893213277778280ab6a8d65bc531e8fa`, terminou `BUILD_FAILED — Resource provisioning failed`; eventos de build vieram vazios. Não há Preview READY para o HEAD da PR.
- **GitHub Actions:** nenhuma execução associada ao HEAD consultado.
- **Homologação visual:** sem Preview, não foi possível renderizar cada tela em desktop/mobile. A inspeção do binário `public/brand/reintegracao-presenca-arte.png` também permanece pendente; o conector não forneceu os bytes da imagem nesta execução.
- **Homologação auditiva:** falta ouvir Marianne e testar Solfeggio/player na aplicação publicada.
- **Reconciliação:** PR #79 continua divergente da `main`; não fazer merge ou rebase automático. Comparar os commits divergentes individualmente, preservando as decisões aprovadas e rejeitando regressões.

## Commits desta rodada

- Correção da cascata do logo: `7a3c512c893213277778280ab6a8d65bc531e8fa`.
- Teste de proteção: `e94c9aef3d04270b87309df486fda75c31bf8eef`.

**Decisão:** manter o Natural Sereno visualmente congelado; avançar para recuperação do Preview e homologação real, sem iniciar novo redesenho.
