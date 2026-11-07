# Auditoria — Estilo 3: Essência Luminosa — Run 75

**Data:** 7 de novembro de 2026  
**Branch:** `main`  
**HEAD de código/testes:** `613aefd69c75c4c214554d1ac52eff8b9dcd1194`  
**Base antes desta rodada:** `a7da74ca50c30b649b193757cfb048782e9e8be1`

## Referência visual oficial

A prancha original `1001196521(1).png`, identificada pelo arquivo `file_0000000019d0820eb7a70b6c982619d6`, foi localizada na Biblioteca e inspecionada. Resolução: 1536 × 1152. Ela confirma a direção visual de natureza realista, folhagens integradas, paisagens luminosas e superfícies claras da Essência Luminosa.

A prancha continua subordinada às decisões aprovadas posteriormente. A paleta vigente no código permanece marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, com areia e oliva clara como acentos. O card React continua apontando para `public/brand/essencia-luminosa/prancha-oficial.webp`; não foi substituído. Não foi feita comparação pixel a pixel entre o PNG e o WebP.

## Corrigido

### Assinatura do logo — Home e acolhimento com áudio

A camada compartilhada `approved-theme.css` aplica opacidade de 72% à imagem do logo dentro de `.ep-home-hero` e `.ep-welcome-audio`, além de elevar o wrapper. A Essência Luminosa já neutralizava o hero, mas não declarava explicitamente o contexto `.ep-welcome-audio` independente.

A folha `src/essencia-luminosa-final-audit.css` agora cobre os dois contextos:

- wrapper com opacidade 1, fundo transparente, sem borda e sem sombra;
- imagem do logo com opacidade de 30% em desktop;
- imagem do logo com opacidade de 26% em telas pequenas;
- regra específica carregada depois de `approved-theme.css`.

O logo continua como assinatura discreta e não compete com a cena. Nenhum outro estilo foi alterado.

Foi acrescentado teste de regressão que verifica a regra compartilhada de 72%, os overrides específicos do Estilo 3, o estado mobile, a ordem dos imports e o markup atual do acolhimento.

## Preservado

- Os quatro estilos e a escolha inicial vazia, seguida de confirmação explícita.
- Preferência salva não equivale à confirmação da sessão; `layoutConfirmedThisSession` inicia falso.
- Card do Estilo 3 e ativo WebP já versionado.
- Paleta posterior aprovada e logo oficial sutil.
- Diário, Diário de Reconexão, salvamento e exportação.
- Voz neural ElevenLabs; IDs válidos preservados e sem fallback silencioso para SpeechSynthesis nos fluxos da Essência Luminosa.
- Política Solfeggio: frequências tonais não reiniciam durante a narração; ambiência não tonal continua permitida.
- Player, canvas, respiração, animações e progresso ligado ao áudio.
- Conteúdos dos protocolos, Anamnese, Chakras, Banhos, Numerologia, Mapa Astral e Ho'oponopono.
- Checkout InfinitePay, confirmação server-side e validação do estado pago.
- Identidades dos Estilos 1, 2 e 4; nenhuma regra visual deles foi alterada.

## Varredura por página/área

Foram rechecadas as 22 folhas CSS com prefixo `essencia-luminosa`, além de `approved-theme.css`, `main.tsx`, `App.tsx`, `LayoutChoiceModal.tsx`, `TransformationHome.tsx`, o patch de voz, a política de áudio, as rotas de pagamento e os testes.

| Área | Resultado |
|---|---|
| Acesso/cadastro | Estado neutro antes da escolha preservado |
| Seletor/prévias | Quatro estilos, seleção vazia e confirmação obrigatória |
| Home/cabeçalho | Paleta própria; logo com cascata corrigida |
| Acolhimento com áudio | Logo explicitamente discreto também fora do seletor hero |
| Onboarding/boas-vindas | Camadas claras preservadas |
| Anamnese/Chakras/Banhos | Overrides específicos; cores simbólicas dos chakras preservadas |
| Numerologia/Mapa Astral | Correções cromáticas anteriores preservadas |
| Ho'oponopono/orações | Camadas próprias preservadas |
| Cursos/Biblioteca/Contato/Conquistas | Camadas específicas preservadas |
| Diário/Diário de Reconexão | Salvamento, histórico e exportação preservados |
| Voz/Solfeggio | Regras de voz neural e áudio conferidas estaticamente |
| Player/canvas/animações | Regras e estados preservados |
| Prática Individual | Acabamento champagne preservado |
| Planos/pagamento | Checkout e confirmação server-side conferidos |

A varredura foi estática por código/imports/testes; não equivale a homologação visual em navegador.

## Natureza — pendente

A prancha foi recuperada, mas é uma prancha composta por várias telas e elementos gráficos, não um arquivo fotográfico limpo para uso como background. A pasta `public/brand/essencia-luminosa/` continua contendo somente `prancha-oficial.webp`. O token `--ep-scene: none` permanece ativo para não reutilizar imagens do Natural Sereno ou da Reintegração.

Portanto, a integração de fotografias realistas próprias da Essência Luminosa continua pendente. Nenhuma imagem de outro estilo foi importada.

## Validação automatizada

GitHub Actions — execução `42422335426`, commit `613aefd69c75c4c214554d1ac52eff8b9dcd1194`:

- TypeScript: aprovado.
- Testes: **108/108 aprovados**.
- Build Vite + Express: aprovado.
- Entry points Vercel/Express: aprovados.
- Verificações de segredos, JWT, autenticação e cadastro: aprovadas.
- Smoke test de saúde/cadastro: aprovado.
- Verificação dos endpoints de pagamento: aprovada.
- Enforcement final de dependências: reprovado.

O `npm audit` mantém **9 vulnerabilidades: 3 moderadas e 6 altas**. O workflow terminou vermelho exclusivamente no enforcement de dependências depois de TypeScript, testes, build e verificações funcionais passarem.

O status Vercel permanece em falha por `build-rate-limit`; não há publicação de produção homologada.

## Pendente

1. Integrar fotografias realistas próprias à Home e às demais áreas que pedem natureza, sem reutilizar imagens de outros estilos.
2. Comparar visualmente o PNG original e o WebP do card quando os dois bytes estiverem disponíveis no mesmo ambiente.
3. Capturar e homologar todas as páginas em desktop e celular.
4. Testar em dispositivos reais voz neural, Solfeggio, pausa/retomada, player, animações e persistência do Diário.
5. Testar checkout, retorno e webhook InfinitePay em sandbox.
6. Resolver as vulnerabilidades sem atualização indiscriminada.
7. Regularizar o limite de build da Vercel e homologar a publicação.

## Commits desta rodada

- `9b29b0eeaed0b1ebf9a391a4e4abf81f8d10a8bf` — amplia o override do logo para Home e acolhimento com áudio.
- `314d0cd33dd73353289d9be148be4a936f941431` — primeira versão do teste de cascata.
- `e24f88e569460c2022c71be0734331abfd54cd24` — ajusta a asserção do teste.
- `613aefd69c75c4c214554d1ac52eff8b9dcd1194` — separa a asserção mobile e fecha a validação com 108 testes aprovados.

**Conclusão:** a cascata compartilhada do logo foi neutralizada explicitamente nos dois contextos do Estilo 3 e protegida por teste. A prancha original foi localizada e inspecionada. A identidade aprovada e as funções existentes foram preservadas. Natureza fotográfica própria, homologação visual/runtime, segurança e publicação continuam pendentes.
