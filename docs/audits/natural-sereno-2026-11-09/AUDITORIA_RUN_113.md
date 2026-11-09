# Auditoria RUN 113 — Estilo 1: Natural Sereno

Data: 2026-11-09  
Branch: `fix/natural-sereno-mainline-run111-2026-11-09`  
Código auditado: `0f9f1e863780a65da120c794494d29ef59c3187d`  
PR: #79

## Corrigido

- Anamnese: a barra de progresso ainda usava gradiente índigo/verde e a waveform ativa usava índigo/púrpura. Foi adicionada a classe semântica `ep-anamnesis-waveform` e ambos passaram a usar dourado refinado do Natural Sereno.
- A ação primária da recomendação ficou consolidada no gradiente dourado aprovado, com cantos de 18 px.
- A ação secundária “Fale Conosco” agora usa marfim/café tanto quando renderizada como botão quanto no fallback de link; não permanece um CTA verde.
- A mensagem de status da Anamnese usa sálvia `#6F7B55`, sem texto verde-floresta.
- Criado `tests/natural-sereno-run113.test.ts` para impedir o retorno dessas heranças.

Todas as novas regras estão sob `data-layout="natural-sereno"`; não alteram os Estilos 2, 3 ou 4.

## Preservado e revalidado

- Prancha versionada em `docs/visual-qa/natural-sereno/reference.jpg` e sua utilização no card do seletor. A busca por `1001196520.png` / ID original não retornou o anexo nesta execução; a cópia versionada foi mantida, sem substituição por outra arte.
- Seletor dos quatro estilos: sem pré-seleção, com confirmação explícita antes de aplicar Natural Sereno, Elegância Profunda, Essência Luminosa ou Místico Moderno.
- Paleta Natural Sereno: creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento.
- Paisagens reais, regras de enquadramento responsivo e assinatura do logo com opacidade discreta de 30% desktop / 26% mobile.
- Voz neural oficial (Marianne), sem fallback silencioso para SpeechSynthesis no Natural Sereno.
- Solfeggio: frequências exatas, bloqueio durante prévia neural e retomada somente após o início real da narração.
- Diário, sincronização por conta, proteção contra troca de usuário entre abas, player, animações e respiração 4–3–5.
- Componentes antigos: o fluxo ativo continua usando `LayoutChoiceModal`; o seletor DOM legado permanece fora do fluxo ativo.
- InfinitePay: handle e URL canônica de produção presentes; confirmação server-side e proteção contra reutilização preservadas. Checkout, confirmação, webhook e ativação de teste permanecem bloqueados fora de produção. Nenhuma cobrança foi iniciada.

## Varredura

- Folhas CSS específicas do Natural Sereno e componentes ativos de Home/acolhimento, seletor, Anamnese, áudio, Arcanjo, oração, Ho'oponopono, Diário, player, planos/checkout, Numerologia e Mapa Astral revisados estaticamente.
- Nenhuma nova chapa verde-floresta foi identificada nas superfícies verificadas. Os indicadores sálvia restantes são pequenos estados/acessórios semânticos.
- A Anamnese era a regressão visual concreta desta rodada; corrigida na camada final aprovada e protegida por teste.
- Não houve inspeção renderizada página a página porque não existe preview READY.

## Validação técnica

GitHub Actions run `42575732639`, no commit de código `0f9f1e863780a65da120c794494d29ef59c3187d`:

- 214/214 testes aprovados; 0 falhas.
- `npm audit`: 0 vulnerabilidades.
- TypeScript aprovado.
- Build Vite + Express aprovado; 2.250 módulos transformados.
- Entry points Vercel/Express, JWT, autenticação administrativa, smoke tests e verificações de pagamento aprovados.

## Pendências

1. **Vercel / preview:** não há deployment para o HEAD de código `0f9f1e8`. O último preview da branch encontrado (commit `4269a296`) terminou em `ERROR / BUILD_FAILED / Resource provisioning failed`. A última implantação de produção registrada também terminou em `ERROR` no commit `ffe3659b`; o projeto informa `live:false`. Os eventos detalhados retornaram vazios, então a causa interna do provisionamento não pôde ser diagnosticada.
2. **Homologação visual:** faltam capturas reais de todas as páginas em desktop e mobile e a conferência de recortes das paisagens.
3. **Áudio real:** falta escutar a voz escolhida e testar narração, Solfeggio, ambiência, pausa e retomada em navegador/dispositivo.
4. **InfinitePay:** falta sandbox e homologação de checkout, confirmação e webhook.
5. **Sincronização com main:** a branch está 28 commits à frente e 3 atrás. Os três commits posteriores da main são específicos da Elegância Profunda (CSS de acolhimento, teste e relatório); permanecem na main e não foram revertidos. A PR continua mergeable, mas em rascunho. Não houve merge.

## Publicação

- PR #79 permanece aberta e em rascunho.
- Nenhum merge ou publicação em produção.
- Nenhuma cobrança real.
- O trabalho aprovado dos outros estilos não foi redesenhado nem descartado.

Conclusão: a regressão visual remanescente da Anamnese foi corrigida e protegida por testes. O código passou integralmente; a homologação final continua bloqueada pela ausência de preview e de testes reais de áudio/pagamento.
