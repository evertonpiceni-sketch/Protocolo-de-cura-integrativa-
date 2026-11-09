# Auditoria RUN 105 — Estilo 1: Natural Sereno

**Data:** 08/11/2026 (horário local)  
**Branch:** `audit/natural-sereno-run97-mainline-2026-11-08`  
**HEAD:** `949788cf79e8c4921a61a41cdf60e7577beb7c60`  
**PR:** #74 — aberta, em rascunho

## Resultado executivo

- Corrigida a opacidade do logo na tela de carregamento, que perdia para uma regra de maior especificidade.
- Removidos na origem os overlays verde-floresta e os tons amarelos antigos do player mobile.
- Corrigidos quatro fluxos de narração que ainda podiam recorrer à voz nativa do navegador ou não declaravam explicitamente a política neural do Natural Sereno.
- Harmonizados os planos/checkout, Banhos, Mapa Astral e Numerologia com creme/marfim, café, dourado refinado e sálvia discreta.
- Varredura estática das 12 folhas CSS do Natural Sereno: nenhum dos tokens antigos de verde-floresta/amarelo saturado rastreados permaneceu nas declarações examinadas.
- CI #1972 aprovada: **183/183 testes**, zero vulnerabilidades, TypeScript e build aprovados.
- A prévia visual segue bloqueada por falha externa de provisionamento Vercel. Não há homologação renderizada desktop/mobile nesta rodada.

## Corrigido

### Logo e cascata

- A regra legada `#auth-loading-view img { opacity: .9 !important }` tinha especificidade de ID e vencia a opacidade definida apenas no wrapper.
- Acrescentada regra de mesma especificidade na camada final do Natural Sereno:
  - 30% no desktop;
  - 26% em telas pequenas;
  - blend normal e sem filtro.
- Adicionado teste de regressão que verifica a cascata e os dois valores.

### Player e superfícies mobile

- Substituídos na folha de origem os antigos véus verde-floresta por gradientes creme/marfim.
- Preservados a fotografia `--ns-waterfall`, o canvas e as animações existentes.
- Trilha de progresso, thumb e botão principal usam agora `#C89D52`, `#E2B96B` e superfícies claras; removidos os valores amarelos saturados anteriores.
- CTAs da Home que ainda usavam o gradiente antigo `#d7b45c → #a67a28` foram alinhados ao ouro aprovado `#E2B96B → #C89D52`, com sombra mais discreta.

### Voz neural

Foram encontrados fluxos que ainda não aplicavam explicitamente a regra do Natural Sereno:

- **Anamnese:** a rota direta ElevenLabs ainda caía em Web Speech quando a chamada falhava. Agora o Natural Sereno entra primeiro no caminho neural, usa o ID ElevenLabs válido salvo ou o ID oficial configurado, e não recorre a SpeechSynthesis. O caminho legado permanece apenas para estilos que não exigem voz neural.
- **Reflexão Sistêmica:** agora Natural Sereno usa voz neural em vez de `audioEngine.previewVoice`; a voz nativa continua reservada aos estilos que não exigem voz neural. O fechamento do modal também interrompe a narração.
- **Ho’oponopono:** política neural explícita para Natural Sereno, preservando o ID salvo e usando o ID oficial somente quando o valor salvo não é um ID neural válido.
- **Oração de São Miguel:** mesma proteção neural, sem fallback nativo no Natural Sereno.

Os Estilos 2 e 3 continuam exigindo voz neural como antes. As mudanças foram feitas nos ramos compartilhados e os testes correspondentes foram atualizados para assegurar que esses estilos não percam sua proteção.

### Anamnese, planos e páginas secundárias

- Anamnese: removidos fundos amarelos antigos e texto verde-escuro saturado; mantidas superfícies creme, sálvia como acento e dourado refinado.
- Planos/checkout (`#plans-modal`): corrigidos overlay, fundo da página, cartões, preços, escolha de benefício, cupom, métodos de pagamento e CTAs. Os botões principais usam dourado refinado, texto café e cantos de 18px.
- Banhos de Ervas: neutralizados gradientes esmeralda/âmbar antigos; mantidos sálvia e dourado em detalhes.
- Mapa Astral e Numerologia: cartões amarelos antigos passaram a creme e bordas/textos usam dourado refinado. Cores semânticas dos gráficos elementares foram preservadas.
- Nenhuma regra comercial, preço, cupom, benefício, endpoint ou comportamento de pagamento foi alterado.

## Preservado

- Seletor React dos quatro estilos: seleção inicial vazia, escolha explícita e confirmação antes de aplicar `data-layout`.
- Paleta vigente do Natural Sereno: creme/marfim, café/marrom, dourado refinado e verde-sálvia apenas como acento.
- Fotografias reais de natureza e estrutura responsiva já aprovada; não foram substituídas por imagens artificiais.
- Tipografia, estrutura das páginas e comportamento dos componentes aprovados, exceto pelas correções de superfície descritas acima.
- Diário, persistência, sincronização de perfil/progresso e conteúdo.
- Solfeggio: bloqueio das frequências tonais durante a prévia neural em Ajustes; ambiências não tonais continuam disponíveis.
- Player, seis etapas, canvas e respiração 4–3–5.
- Estilos 2, 3 e 4 sem redesenho ou troca de identidade visual.
- Regras específicas da Reintegração da Vida permanecem separadas; os seletores `.ep-reintegration-running` não foram alterados.
- InfinitePay, confirmação server-side, deduplicação e escolha explícita de benefício Semestral/Anual. Nenhuma cobrança foi feita.

## Referência visual

- O seletor continua apontando para `docs/visual-qa/natural-sereno/reference.jpg`.
- A busca atual na Library pela identificação exata `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` não retornou o arquivo original.
- Foi localizada e inspecionada a prancha `Painel UX_UI Natural Sereno.png`. Ela serve como referência estrutural/compositiva, mas contém amostras cromáticas antigas. Essas cores não prevalecem sobre as decisões posteriores aprovadas.
- A referência versionada no repositório foi preservada; não substituí o arquivo nem afirmo identidade binária com o ID original sem confirmação.

## Varredura estática

Folhas examinadas:

1. `natural-sereno.css`
2. `natural-sereno-refinement.css`
3. `natural-sereno-mobile-fixes.css`
4. `natural-sereno-final-audit.css`
5. `natural-sereno-home-latest-approved.css`
6. `natural-sereno-milestone-audit.css`
7. `natural-sereno-journal-dashboard-audit.css`
8. `natural-sereno-contact-audit.css`
9. `natural-sereno-home-surface-audit.css`
10. `natural-sereno-guides-semantic-audit.css`
11. `natural-sereno-legacy-green-audit.css`
12. `natural-sereno-approved-overrides.css`

Após as correções, não foram encontrados nas 12 folhas os tokens rastreados de verde-floresta e amarelo antigo (`#063020`, `#297241`, `#d7b45c`, `#a67a28`, `#d8bd7a`, `#ead8a6`, `#ebd7a0`, `#fff4d8`, `#e6c66e`, `#e9d296`, `#efefdf`, `#d8caa9`, `#315d3d`, `#fbf3dc`, `#dcc58b`, `#6e5620` e overlays verdes antigos).

A verificação é estática. Ela não substitui a inspeção visual renderizada de cada página.

## Validação técnica

GitHub Actions **#42548232858** — concluída com sucesso:

- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **183 aprovados, 0 falhas**.
- Build Vite: aprovado; 2.249 módulos transformados.
- Entry points Vercel/Express: aprovados.
- Verificações de segredos e JWT: aprovadas.
- Autenticação administrativa: aprovada.
- Smoke tests: aprovados.
- Endpoints de pagamento: aprovados.

## Vercel e integração

- Deployment mais recente: `dpl_7WeGFMweJkgE7vwtgrYR7NvnEGUo`.
- Estado: `ERROR`, `BUILD_FAILED`, mensagem `Resource provisioning failed`.
- Eventos detalhados de build retornaram vazios.
- O check Vercel também apresenta bloqueio `build-rate-limit`.
- Não existe preview READY para inspeção visual.

Comparação da branch com `main`:

- **82 commits à frente**.
- **10 commits atrás**.
- PR mergeable, mas mantida aberta e em rascunho.
- Os 10 commits posteriores da main foram inspecionados: incluem auditorias/documentação dos Estilos 2 e 3 e duas alterações de comentário/teste que já estão presentes no conteúdo atual da branch. Não foi feito merge automático; as decisões documentadas da main devem permanecer preservadas na integração final.

## Pendente

1. Obter preview Vercel navegável e conferir todas as páginas em desktop e mobile.
2. Ouvir a voz efetivamente escolhida e testar as transições reais entre narração, Solfeggio e ambiência.
3. Homologar InfinitePay em sandbox, incluindo confirmação e webhook.
4. Confirmar o arquivo original `1001196520.png` / ID informado; a busca Library atual não o localizou.
5. Reconciliar os 10 commits de divergência da main, preservando integralmente as decisões recentes dos Estilos 2 e 3.
6. Receber revisão independente do HEAD atualizado.

## Estado de publicação

- PR #74 permanece aberta e em rascunho.
- Nenhum merge.
- Nenhuma publicação em produção.
- Nenhuma cobrança real.

**Conclusão:** as correções de código desta rodada estão implementadas e a CI passou. O Natural Sereno ainda não está homologado integralmente: faltam prévia renderizada, escuta real, sandbox e reconciliação final da branch.