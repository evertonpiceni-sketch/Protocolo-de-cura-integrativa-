# Auditoria RUN 178 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho

## Resultado executivo

Não encontrei uma regressão visual ativa que justificasse nova alteração de CSS ou de componentes nesta rodada. As correções aprovadas das rodadas anteriores continuam presentes. Foi adicionada uma proteção de regressão para impedir que o onboarding antigo ou a dica diária voltem a abrir automaticamente: o seletor obrigatório dos quatro estilos permanece a única abertura automática de entrada.

## Corrigido / protegido

- Adicionado `tests/natural-sereno-run178-explicit-entry-only.test.ts`.
- O teste protege:
  - montagem do `LayoutChoiceModal` antes da confirmação do tema;
  - ausência de pré-seleção automática;
  - `showWelcomeModal` e `showDailyTip` iniciando em `false`;
  - ausência de chamadas que os reabram automaticamente;
  - ausência do componente legado `WelcomeModal` no fluxo ativo.
- As sete verificações de fonte usadas nesta reauditoria passaram. O teste Node ainda não foi executado pelo runner.

Nenhum CSS de produção foi alterado: as superfícies ativas já respeitam a paleta aprovada e uma mudança adicional sem renderização/Preview criaria risco de regressão.

## Preservado e reauditoriado

### Referência e identidade

- O card do seletor continua apontando para `docs/visual-qa/natural-sereno/reference.jpg`, em `object-contain`, sem recorte.
- A derivação versionada foi inspecionada visualmente (blob `d260253d853c089d04134a13648716a8f20319f3`). Ela conserva a prancha histórica completa; os elementos antigos — grandes áreas verdes, chakras, corpo masculino e logo dominante — não substituem as decisões posteriores aprovadas.
- A busca por `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` não recuperou o arquivo original no conjunto de arquivos acessível nesta execução. Não foi usada outra prancha como substituta.
- Base creme/marfim `#FAF7F2`, café `#2A2421`, marrom secundário `#6B625B`, dourado `#C89D52`; sálvia `#6F7B55` reservada a pequenos acentos.
- O único fundo sálvia identificado no banner 639 Hz é o contêiner de ícone de 32×32 px; não é uma chapa de página. O CTA legado verde da Anamnese é substituído pela camada final dourada.
- A folha final `natural-sereno-approved-overrides.css` contém 488 regras, todas escopadas a `data-layout="natural-sereno"`, e é importada depois das camadas anteriores do Estilo 1.

### Páginas, paisagens e componentes

- Seletor: quatro estilos disponíveis; seleção começa nula; confirmação é obrigatória; `data-layout` só é aplicado após salvar a escolha.
- Home: `vale-amanhecer.webp`, superfícies claras, café e CTAs dourados; regras responsivas distintas para desktop e mobile.
- Acolhimento: `acolhimento.webp`, base marfim e véu claro; enquadramento aprovado mantido em 42% desktop / 46% mobile.
- Player: `cachoeira.webp`, enquadramentos desktop/mobile e superfície clara preservados.
- Menu, configurações, Anamnese, Diário, comunidade, perfil, modais de apoio, contato, toast e botão flutuante foram conferidos nos respectivos overrides ativos.
- O arquivo `natural-sereno-mobile-fixes.css` mantém duas regras globais somente de layout para a Reintegração compartilhada (overflow horizontal e redução do visual em telas de pouca altura). Não alteram paleta; foram preservadas para não modificar outros estilos sem auditoria própria.
- Logo oficial: opacidade efetiva de 30%, sem disco, moldura ou sombra dominante, incluindo os estados da Reintegração.
- Reintegração: corpo neutro, percurso único de luz e raízes no Dia 1 preservados.

### Voz, Solfeggio, Diário e player

- Marianne: `mJqP14JQFEK0PojR5lfV`; `OFFICIAL_PROTOCOL_VOICE_ID` e a rota `/api/reintegration-tts` usam o mesmo ID.
- Modelo `eleven_multilingual_v2`; rota autenticada, trechos autorizados e sem fallback para SpeechSynthesis na Reintegração.
- Solfeggio depende de áudio habilitado e consentimento de reprodução; é interrompido durante narração neural e retomado nos estados permitidos.
- O efeito global de áudio respeita confirmação do estilo, opt-in, sessões ativas e modais que possuem o áudio.
- Diário e Anamnese mantêm acesso e sincronização por conta; o handler de salvamento da Anamnese preserva a preferência de áudio e não concede consentimento.
- Player mantém Media Session, Wake Lock, pausa/retomada e interrupção do áudio global durante a Reintegração.
- Estilos 2, 3 e 4 não receberam alterações.

## Pagamentos e infraestrutura

- `paymentRoutes.ts` exige `single_payment: true`, API Key, ambiente de produção para cobrança real, lock compartilhado do snapshot, validação do payload e proteção contra checkout duplicado.
- Inventário Vercel consultado sem descriptografar segredos:
  - `INFINITEPAY_API_KEY`: ausente em todos os ambientes;
  - `INFINITEPAY_HANDLE`: somente Production;
  - `PUBLIC_APP_URL`: Development e Production, sem Preview para a branch atual;
  - Preview da branch: namespace isolado `UPSTASH_DB_KEY`;
  - `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID`: Preview e Production.
- Sem API Key não há checkout operacional; sem variáveis Preview não há homologação de pagamento nesta branch. Sandbox e webhook permanecem pendentes. Nenhuma cobrança foi realizada.
- As dez implantações Preview mais recentes listadas para a branch estão em `ERROR`. A mais recente é do commit `795b8fa`; não há deployment para o HEAD desta rodada. Os eventos de build retornaram vazios.
- O check de commit do GitHub mostra Vercel `failure` (`build-rate-limit`); não há execução GitHub Actions associada ao commit desta rodada.

## Pendências

1. Recuperar o provisionamento da Vercel e obter Preview do HEAD atual.
2. Executar suíte Node, TypeScript, lint e build.
3. Fazer QA visual renderizado página a página em desktop e mobile.
4. Testar audivelmente Marianne, Solfeggio, player e transições.
5. Configurar API Key/variáveis Preview e homologar InfinitePay em sandbox, inclusive webhook.
6. Reconciliar seletivamente os commits divergentes da `main`, sem merge/rebase automático e sem recuperar itens rejeitados.

**Decisão:** manter o Natural Sereno visualmente congelado. Sem nova alteração de CSS nesta rodada; preservar o que está aprovado, proteger o comportamento de entrada e retomar a homologação somente quando houver Preview funcional.
