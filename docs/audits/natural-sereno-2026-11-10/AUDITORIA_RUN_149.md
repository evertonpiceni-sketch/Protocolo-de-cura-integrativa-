# Auditoria RUN 149 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79

## Corrigido

A varredura encontrou uma herança visual ativa no fluxo de acolhimento compartilhado (`OnboardingFlow`). O componente é montado após o primeiro acesso, quando a pessoa já confirmou explicitamente um dos estilos. Entretanto, seu cartão ainda carregava o gradiente verde-floresta da implementação compartilhada (`rgba(7,52,38,.97)` / `rgba(3,27,19,.98)`), junto de textos claros e dourados antigos. No Natural Sereno, isso produzia uma grande chapa escura incompatível com a identidade aprovada.

Foi acrescentado um bloco final e estritamente escopado em `src/natural-sereno-approved-overrides.css`:

- superfície do acolhimento em creme/marfim (`#FFFDF8`, `#FAF7F2`, `#F0E7D9`);
- títulos em café (`#2A2421`) e texto secundário em `#6B625B`;
- realce dourado refinado (`#A87E37` / `#C89D52`);
- CTA principal com gradiente `#E2B96B → #C89D52` e texto café;
- estados selecionado/não selecionado e foco visível com contraste;
- halo superior suavizado, sem verde-floresta nem amarelo intenso.

Nenhum texto, etapa, conteúdo, callback, navegação ou regra de acesso do onboarding foi alterado. O logo permaneceu como assinatura discreta: opacidade 30% no desktop e 26% no mobile.

**Proteção criada:** `tests/natural-sereno-onboarding-surface.test.ts`. O teste verifica o ponto real de montagem do fluxo, a paleta clara, os estados dos botões, o escopo exclusivo do Natural Sereno, a preservação do CSS da Essência Luminosa e a presença dos assets visuais.

## Preservado

- **Seletor:** começa sem estilo marcado; Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno continuam exigindo escolha e confirmação explícitas antes da aplicação.
- **Card de referência:** `LayoutChoiceModal` continua usando `docs/visual-qa/natural-sereno/reference.jpg` em `object-contain`, com referência ao original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A derivação JPEG está versionada no repositório.
- **Natureza realista:** `--ns-valley` aponta para `vale-amanhecer.webp`; o acolhimento usa `acolhimento.webp`; a sessão usa `cachoeira.webp`. Os três assets existem no repositório. As regras responsivas desktop/mobile já estão presentes e não precisaram ser alteradas.
- **Logo:** assinatura oficial de baixa opacidade mantida.
- **Conteúdo de chakras:** o Guia dos 7 Chakras e suas referências de conteúdo foram preservados; a decisão anterior preserva esse conteúdo. A regra de corpo neutro continua aplicada às artes/player, sem reintroduzir chakras no corpo visual.
- **Voz:** Natural Sereno exige ID ElevenLabs válido no Arcanjo e na prévia de voz; o fallback nativo é bloqueado nesse estilo. O ID oficial Marianne permanece como seleção padrão quando o perfil não contém um ID neural válido.
- **Solfeggio:** a política impede sobreposição com carregamento/reprodução de voz; pausa, retomada, término e falha continuam sob controle explícito do player.
- **Diário:** a branch persiste perfil e progresso no mesmo payload quando a entrada do diário atualiza ambos (`saveProfile(updatedProfile, updatedProgress)`); o teste `diary-progress-atomic-sync.test.ts` cobre essa regra.
- **Player/animações:** corpo neutro, luz, respiração, progresso real e controles preservados.
- **InfinitePay:** permanecem as proteções de API Key obrigatória, `single_payment`, lock compartilhado, verificação de posse do lock, conferência server-side de valor/transação e prevenção de reutilização de transação. Nenhum checkout foi iniciado.
- **Componentes antigos:** o fluxo ativo de acolhimento é `OnboardingFlow`; `WelcomeModal` não é o componente montado por essa condição. As correções de paleta existentes nas superfícies de Diário, Anamnese, mapas, numerologia, planos, prática individual, banhos, oração, Arcanjo, vídeo, conquistas e celebrações foram preservadas.

## Reauditoria após a intervenção

A folha final foi relida no HEAD atualizado. Foram verificadas 13 condições estáticas: montagem após confirmação, cartão claro, textos café/muted, CTA dourado, estados selecionados, ausência dos tokens verde-floresta no novo bloco, escopo exclusivo `data-layout="natural-sereno"`, opacidade do logo, isolamento do CSS da Essência Luminosa, assets de referência/paisagem e importação da folha final. **As 13 verificações estáticas passaram.**

Isso não equivale à execução do runner `tsx --test`: a CI ainda não retornou uma execução associada ao HEAD atual.

## Pendente

1. Executar `npm test`, `npm run lint` e `npm run build` no HEAD atual.
2. Recuperar um Preview Vercel READY e validar todas as páginas renderizadas em desktop e mobile.
3. Escutar Marianne, ambiência e Solfeggio em dispositivo real, incluindo pausa/retomada.
4. Homologar Diário ponta a ponta com persistência por conta.
5. Homologar InfinitePay em sandbox, checkout, confirmação e webhook.
6. Reconciliar seletivamente os 12 commits posteriores da `main`. Não fazer merge cego: a implementação da branch mantém a exigência de voz neural do Natural Sereno no Arcanjo; o arquivo correspondente da `main` difere. A sincronização do Diário e as proteções principais de pagamento já têm implementações equivalentes e testes nesta branch.

**Estado do HEAD:** `6662d1bf3837139e44fe424c85adcab4ce2d8d39`.  
**Comparação com main:** 190 commits à frente, 12 atrás; PR #79 continua aberta, em rascunho e `mergeable=false`.

O check Vercel associado ao HEAD terminou em `ERROR / BUILD_FAILED — Resource provisioning failed` (deployment `dpl_CLHfRGt711npfcKoWRCJ1d3p5UG4`). A consulta de eventos de build não retornou logs; não há Preview READY nem execução GitHub Actions associada ao HEAD.

Nenhum merge, publicação em produção ou pagamento real foi realizado nesta auditoria.
