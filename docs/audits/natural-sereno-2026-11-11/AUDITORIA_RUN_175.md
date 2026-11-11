# Auditoria RUN 175 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código auditado antes deste registro:** `4b2dd66ef06c8bf9bf7cc719219a43e7df9c7d45`

## Corrigido

1. **Anamnese — consentimento de áudio**
   - O micro-chime de seleção em 639 Hz agora só toca quando há opt-in explícito de áudio na sessão (`backgroundPlaybackRequested`) e o áudio global não está desativado.
   - Os dois caminhos de salvamento deixaram de reativar a trilha apenas porque a preferência de áudio estava salva. Ambos reutilizam `restoreUserBackground()`, que exige consentimento da sessão.
   - A chamada direta ao chime ficou concentrada em um único helper protegido.

2. **Logo — opacidade efetiva**
   - Quatro overrides mobile antigos de 26% foram alinhados à regra aprovada de 30%.
   - O wrapper do logo no cabeçalho tinha opacidade adicional de 55%, reduzindo a opacidade efetiva da imagem para cerca de 16,5%. O wrapper agora fica em 100% e a imagem em 30%, sem fundo, borda ou sombra.
   - O logo oficial continua sendo usado como assinatura transparente, sem competir com a cena.

3. **Proteções adicionadas**
   - `tests/natural-sereno-run175-explicit-audio-consent.test.ts`: cinco casos de regressão para chime, restauração de trilha, Solfeggio, prévia de voz e início da Reintegração.
   - `tests/natural-sereno-run175-logo-mobile-opacity.test.ts`: proteção da opacidade efetiva de 30% em desktop/mobile e do wrapper do cabeçalho.

## Preservado e conferido

- **Seletor:** começa sem estilo selecionado; confirmação permanece desabilitada até uma escolha; os quatro estilos continuam disponíveis. `data-layout` só é aplicado após confirmação explícita na sessão.
- **Prancha oficial:** o card usa `docs/visual-qa/natural-sereno/reference.jpg` com `object-contain`, sem recorte, e informa que decisões posteriores prevalecem. A imagem versionada foi recuperada e inspecionada. A busca pelo ID do upload original nesta execução não retornou um arquivo acessível; a derivação versionada é a referência usada pelo seletor.
- **Hierarquia visual:** creme/marfim, café/marrom e dourados `#E2B96B`, `#C89D52`, `#A87E37`; verde apenas em acentos oliva. Os elementos históricos de grandes superfícies verde-floresta e chakras da prancha não foram transportados para a interface, pois decisões posteriores prevalecem.
- **Paisagem:** Home mantém fotografia de natureza realista em `cover`; enquadramento desktop em 52% e mobile em 48%. Acolhimento, imagens dos dias e recursos permanecem preservados.
- **CSS:** 487 regras no override final do Natural Sereno; zero seletores de paleta fora do escopo `data-layout="natural-sereno"`; zero fundos verde-escuro identificados nas declarações de background examinadas. As folhas dos outros três estilos permanecem isoladas por seus próprios atributos de layout. O shell neutro só atua antes da confirmação.
- **Abertura automática:** preferência salva não aplica o tema; o seletor é obrigatório. Os estados de onboarding, dica diária e marco começam fechados e não têm acionamento automático identificado. A trilha global também não inicia por um clique genérico.
- **Voz/Solfeggio:** Marianne permanece como voz oficial da Reintegração; Solfeggio da Anamnese e Perguntas Sistêmicas começa desativado e cede à narração. A prévia de voz exige opt-in de sessão e áudio habilitado.
- **Diário, player e animações:** implementação existente preservada; a Reintegração mantém aceite e comando explícito de início, Media Session, Wake Lock e controles. Não houve alteração de conteúdo, roteiro ou duração.

## Pendente

- **Execução de testes/CI:** os novos testes foram adicionados, mas não executados pelo runner. Não há workflow GitHub Actions associado ao HEAD auditado.
- **Vercel:** projeto `protocolodecuraintegrativa` permanece `live=false`. O deployment mais recente encontrado para a branch, no commit `91e62c9`, terminou em `BUILD_FAILED — Resource provisioning failed`; eventos de build vieram vazios. O check Vercel permanece em falha com `build-rate-limit`. Não há Preview READY para o HEAD atual.
- **QA visual/auditivo:** sem Preview não foi possível homologar a renderização real de todas as páginas em desktop/mobile nem ouvir Marianne/Solfeggio nesta rodada.
- **InfinitePay:** `INFINITEPAY_API_KEY` não aparece no inventário; `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` estão em Production, não nesta branch Preview. O Preview tem somente o namespace isolado `UPSTASH_DB_KEY`. Sandbox, checkout e webhook continuam pendentes; nenhuma cobrança foi realizada.
- **Reconciliação:** PR #79 permanece divergente da `main`; não fazer merge/rebase automático. Os 12 commits atrás precisam de comparação seletiva para evitar reintroduzir voz, áudio, paletas ou componentes rejeitados.

## Commits desta rodada

- `a93b8a3` — consentimento explícito do áudio na Anamnese.
- `5218172` — teste de consentimento explícito.
- `3293bac` — opacidade mobile do logo alinhada a 30%.
- `beede20` / `20a85ed` — teste de opacidade e correção da asserção.
- `b1abb5c` — remoção da dupla atenuação do logo no cabeçalho.
- `4b2dd66` — teste da opacidade efetiva do cabeçalho.

**Resultado da reauditoria estática desta execução:** 17/17 verificações de fonte passaram. Isso não substitui a execução da suíte, o build, a inspeção visual renderizada ou a homologação auditiva.
