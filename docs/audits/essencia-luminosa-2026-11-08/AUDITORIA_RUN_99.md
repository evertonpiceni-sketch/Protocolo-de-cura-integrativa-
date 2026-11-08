# Auditoria Run 99 — Estilo 3: Essência Luminosa

**Data:** 8 de novembro de 2026  
**Branch:** `main`  
**HEAD de código/teste:** `85f1d2c5d95292bf96f26cfb5d748da9164f28c7`  
**Base anterior:** `331bb0686a69e434091d70af2dbe2f63c853ac44`

## Referência visual oficial e decisões vigentes

- A prancha original `1001196521(1).png` foi recuperada e inspecionada: **1536 × 1152 px**.
- O card do seletor continua apontando para `/brand/essencia-luminosa/prancha-oficial.webp`; o teste confirma a existência do ativo.
- O WebP versionado permanece em **320 × 240 px**. Uma derivação direta da prancha em **768 × 576 px** foi preparada para inspeção, mas não foi incorporada ao repositório nesta rodada.
- A prancha é referência de atmosfera/composição. Textos, valores e swatches antigos representados nela não substituem as decisões posteriores.
- Paleta vigente preservada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro `#A87E37`, areia e oliva clara.
- O logo oficial permanece como assinatura discreta/transparente, sem aumentar contraste ou protagonismo.

## Corrigido

1. **Contrato incompleto de tokens semânticos do Estilo 3.** O bloco `:root[data-layout="essencia-luminosa"]` já definia a paleta `--layout-*`, e a regra compartilhada `:root[data-layout]` mapeava os principais aliases globais. Porém, os aliases residuais `--sage-subtle`, `--sage-border` e `--journey-*` continuavam definidos apenas no root global. Foram mapeados explicitamente no bloco da Essência Luminosa para:
   - acento sálvia/oliva clara;
   - bordas champagne/areia;
   - canvas e cartões marfim;
   - ouro suave;
   - texto grafite.
   
   Também foi centralizado `--layout-text-soft:var(--layout-text-secondary)` no bloco do Estilo 3. A mudança é estritamente escopada ao Estilo 3 e não altera os outros temas.

2. **Teste de regressão.** `tests/essencia-luminosa.test.ts` agora verifica os aliases semânticos e rejeita no bloco ativo do Estilo 3 os valores globais legados `#5E7153`, `#B88736` e `#8F631E`.

> A busca de código não encontrou uso atual de `var(--sage-subtle)`, `var(--sage-border)` ou `var(--journey-*)`; o mapeamento fecha preventivamente o contrato de tema para componentes antigos ou futuros, sem afirmar que esses aliases causavam uma regressão visível nesta execução.

## Varredura página a página — folhas CSS

Foram recuperadas e inspecionadas as 24 folhas específicas:
- 17 importadas diretamente por `src/main.tsx`;
- 7 importadas pelos componentes Welcome, Contact, Courses, Onboarding, Achievements, Chakras e Herbal Baths.

Áreas cobertas: Home/acolhimento/cabeçalho, seletor, onboarding, canvas, jornada/sessão/player, Anamnese, Chakras, Banhos de Ervas, Ho'oponopono, Numerologia, Diário, Diário de Reconexão, Pausa do Dia, conquistas, navegação inferior, instalação mobile, cursos, contato, modais compartilhados, Configurações/áudio, vídeo de apresentação e checkout.

Resultado estático:
- **24/24** folhas com seletores escopados a `data-layout="essencia-luminosa"`;
- **0** seletores sem escopo encontrados;
- **0** declarações diretas com os valores saturados/legados examinados (verdão/esmeralda profundo, amarelo/âmbar antigo e verde profundo).
- Classes Tailwind antigas ainda podem aparecer como alvos de seletores de neutralização; isso não significa que a cor antiga esteja sendo aplicada.

A inspeção é estática e não substitui captura renderizada no navegador.

## Preservado e revalidado estaticamente

- **Seletor:** `LayoutChoiceModal` inicia com `selectedLayout = null`, mantém o botão de confirmação desabilitado até escolha e usa o fluxo React único. `App.tsx` só aplica `data-layout` depois da confirmação da sessão; preferência persistida não é consentimento automático.
- **Precedência:** `essencia-luminosa-approved-overrides.css` continua como última folha CSS de tema em `main.tsx`.
- **Logo:** wrappers transparentes/sem moldura; assinatura em 30% no desktop e 26% em telas pequenas.
- **Voz:** o patch do Estilo 3 preserva IDs ElevenLabs válidos, normaliza valores legados para a voz oficial e força `preferElevenLabs: true` / `fallbackToSpeechSynthesis: false` nos fluxos protegidos.
- **Solfeggio:** as oito frequências permanecem bloqueadas durante a prévia neural; ondas, chuva, floresta e silêncio continuam como opções não tonais.
- **Diário:** `DailyDiaryModal` continua recebendo `onSaveEntry={handleSaveDiaryDay}` e `onSaveExpectations={handleSaveTreatmentExpectations}`; salvamento e exportação permanecem implementados.
- **Player/animações:** `MeditationSession` continua usando o tema de canvas da Essência Luminosa; cadência, sincronização e redução de movimento permanecem protegidas pelos testes existentes.
- **InfinitePay:** catálogo e preços permanecem no `paymentCatalog.ts`; validação server-side e escolha explícita de benefício nos planos Semestral/Anual permanecem. Nenhuma regra comercial foi alterada.
- Estilos 1, 2 e 4, conteúdo, roteiros, dados, logo e componentes aprovados não foram modificados.

## Pendente

1. **Fotografia própria da Home:** `--ep-scene` e `--ep-scene-overlay` continuam neutros. Os arquivos gerados anteriormente que foram inspecionados são composições de interface, não fotografias limpas; nenhum foi incorporado. Não reutilizar imagens dos outros estilos.
2. **Card de maior resolução:** incorporar o derivado 768 × 576 após validação binária; o card atual 320 × 240 continua funcional e preservado.
3. **Homologação visual:** capturas de todas as páginas em navegador, desktop e celular.
4. **Homologação funcional:** reprodução real de voz, Solfeggio/ambiências, Diário, player, Media Session e animações em dispositivos.
5. **InfinitePay sandbox:** transação real de teste.
6. **CI do HEAD atual:** o status consultado não retornou execução GitHub Actions associada ao commit de teste; não se declara build/testes aprovados para este HEAD.
7. **Publicação:** o check de status do commit apresenta Vercel `failure` com destino `build-rate-limit`; produção não homologada.

## Commits

- Tema — [`a67b7276cfff8cef88d21a435341fd063a466b4e`](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/commit/a67b7276cfff8cef88d21a435341fd063a466b4e)
- Teste — [`85f1d2c5d95292bf96f26cfb5d748da9164f28c7`](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/commit/85f1d2c5d95292bf96f26cfb5d748da9164f28c7)
- Status Vercel do HEAD: [check de implantação](https://vercel.com/evertonpiceni-sketch?upgradeToPro=build-rate-limit)

## Conclusão

Foi fechado o mapeamento dos aliases semânticos restantes e adicionada uma regressão automatizada específica. A varredura das 24 folhas não encontrou seletores fora do escopo nem declarações diretas das cores saturadas examinadas. A identidade aprovada e os fluxos de voz, Diário, player e pagamento foram preservados.

A fotografia própria, a incorporação do card em alta resolução, a homologação real e a publicação continuam pendentes. O Estilo 3 permanece em produção, não concluído.
