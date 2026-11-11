# Auditoria RUN 173 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79  
**Base auditada:** `75fcc32a44de337613f4d1850e7c29aa4b3ed5a5`

## Corrigido

- A inspeção visual do card oficial confirmou que a prancha `1001196520.png` está versionada como `docs/visual-qa/natural-sereno/reference.jpg` e é exibida com `object-contain`, sem recorte. A prancha contém elementos históricos de verde dominante e chakras; as decisões posteriores (creme/marfim, café, dourado refinado, verde como acento e corpo neutro) continuam prevalecendo.
- Encontrei uma referência ativa indevida em dois arquivos CSS: o carregamento do Natural Sereno ainda usava `presenca.webp`. Inspecionei o arquivo: ele mostra uma figura humana com marcadores luminosos de chakras em uma floresta escura, incompatível com a decisão posterior de corpo neutro e sem chakras.
- Substituí a imagem de carregamento por `vale-amanhecer.webp`, uma paisagem realista de vale e amanhecer, em `src/natural-sereno.css` e `src/natural-sereno-approved-overrides.css`.
- Alinhei também a regra-base ao véu creme/marfim e ao texto café, para que uma mudança futura na ordem de importação não recupere o fundo escuro.
- Atualizei `tests/natural-sereno-run170-loading-surface.test.ts`: agora exige a paisagem aprovada e falha se `presenca.webp` ou o véu escuro antigo voltarem às folhas CSS ativas.
- O arquivo antigo permanece no repositório como material não referenciado; não o apaguei para evitar quebrar usos históricos fora do tema ativo.

## Preservado e reauditoria por área

- **Seletor:** começa sem escolha; as quatro opções são exibidas; o tema só é aplicado após confirmação explícita e salvamento da preferência. O card Natural Sereno continua usando a prancha oficial sem recorte.
- **Home e paisagens:** Home usa a paisagem de vale; acolhimento usa fotografia de água e pedras com véu marfim; o carregamento passa a usar a paisagem de vale. Não alterei enquadramentos de desktop/mobile sem Preview renderizado.
- **Identidade:** creme/marfim, café/marrom, dourado refinado e verde apenas como detalhe natural; logo oficial em baixa opacidade, sem moldura, fundo ou sombra dominante.
- **Reintegração:** `NeutralBodyLightProgress` continua sendo a silhueta SVG neutra, com percurso de luz e sem marcadores de chakras. Logo discreto presente na jornada, sessão imersiva, roteiro e modais.
- **Pausa Consciente / Ainda Há Algo em Mim:** overrides exclusivos do Natural Sereno corrigem canvas, filtros e CTAs; logo permanece como assinatura.
- **Voz:** Marianne (`mJqP14JQFEK0PojR5lfV`) confirmada na rota de narração da Reintegração; a rota exige autenticação e retorna indisponibilidade sem fallback robótico. A prévia neural do App desativa fallback nativo.
- **Solfeggio:** a política bloqueia frequências tonais durante narração e prévia neural; som ambiente não tonal permanece sujeito ao estado de reprodução.
- **Diário:** sincronização vinculada à conta de origem e gravação serializada por conta; os componentes de histórico e edição permanecem preservados.
- **Player/animações:** áudio real, controles, progresso, Media Session, movimento da luz e transições existentes preservados.
- **Estilos 2, 3 e 4:** nenhuma regra desses estilos foi alterada nesta rodada.

## Pagamentos e infraestrutura

- `paymentRoutes.ts` mantém pagamento único, validação server-side, proteção de checkout concorrente e bloqueio por ambiente.
- Inventário Vercel sem descriptografar segredos: não há `INFINITEPAY_API_KEY`; `INFINITEPAY_HANDLE` está somente em Production; `PUBLIC_APP_URL` está em Production/Development e em uma branch Preview antiga, mas não nesta branch. O Preview desta branch contém apenas `UPSTASH_DB_KEY`.
- Nenhum checkout ou webhook foi homologado; nenhuma cobrança foi realizada.
- O check combinado do HEAD auditado está em falha no contexto Vercel (`build-rate-limit`); não há workflow run do GitHub Actions associado ao HEAD.
- O deployment mais recente listado é de um commit anterior (`7a3c512c`) e terminou `BUILD_FAILED — Resource provisioning failed`; eventos de build retornaram vazios. Não há Preview READY para o HEAD auditado.

## Pendências

- Executar `npm test`, `npm run lint` e `npm run build` quando a infraestrutura liberar o runner.
- Renderizar e inspecionar todas as páginas em desktop e mobile; esta rodada foi uma auditoria de fonte e de assets, não homologação visual em browser.
- Ouvir Marianne e testar Solfeggio/player na aplicação publicada.
- Inspecionar os PNGs binários da pasta `public/brand/days` em Preview; o conector não forneceu os bytes desses arquivos nesta execução. O componente SVG neutro foi inspecionado diretamente.
- Homologar InfinitePay em sandbox após provisionar credencial e URL de Preview.
- Não fazer merge/rebase automático: PR #79 permanece divergente da `main`; reconciliar os commits individualmente e preservar as decisões aprovadas.

**Decisão:** manter o Natural Sereno congelado; remover do tema ativo a imagem de carregamento com chakras e avançar para Preview, testes e homologação real.