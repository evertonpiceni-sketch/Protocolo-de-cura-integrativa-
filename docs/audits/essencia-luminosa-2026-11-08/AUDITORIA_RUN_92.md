# Auditoria Run 92 — Estilo 3: Essência Luminosa

Data: 2026-11-08  
Branch: `main`  
HEAD auditado antes da correção: `972fee8f19c15cca74f8c30eb334121f69825858`

## Corrigido

- Reauditada a política de áudio neural. O seletor de trilhas do Ajustes de Áudio desabilitava **todas** as trilhas durante a prévia de voz na Essência Luminosa, embora a decisão vigente permita ambiências não tonais.
- Criada a função `shouldBlockTrackDuringNeuralVoicePreview`: no Estilo 3, durante a prévia neural, bloqueia somente as oito frequências Solfeggio (396, 417, 432, 528, 639, 741, 852 e 963 Hz).
- Floresta, chuva, ondas e silêncio continuam selecionáveis. A regra já existente do Estilo 2 foi mantida sem alteração; os Estilos 1 e 4 também não receberam mudança. A reprodução de Solfeggio continua impedida durante a narração pelo mecanismo global existente.
- Adicionado teste de regressão para as oito frequências, quatro opções não tonais/silêncio e estados sem voz neural ou sem prévia ativa.

## Preservado

- A prancha original foi recuperada da Biblioteca como `1001196521(1).png` (1536 × 1152 px) e inspecionada. O seletor React continua usando o WebP versionado em `/brand/essencia-luminosa/prancha-oficial.webp`; a prancha é referência do card, não fundo de página.
- Paleta posterior aprovada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B` e ouro escuro `#A87E37`. Os valores impressos na prancha não substituem decisões posteriores.
- Seleção inicial vazia dos quatro estilos, confirmação explícita e proteção da aplicação do tema.
- Logo oficial como assinatura transparente, sem fundo/borda/sombra dominante.
- Diário, Diário de Reconexão, player, animações, conteúdo terapêutico, catálogo InfinitePay e checkout server-side.
- Escolha explícita e persistência de apenas um benefício (Mapa Astral Completo ou Numerologia Completa) nos planos Semestral e Anual, já implementada no histórico recente de `main`.
- Identidades dos Estilos 1, 2 e 4. O último CSS do Estilo 2 para o checkout usa exclusivamente `data-layout="elegancia-profunda"` e não contamina a Essência Luminosa.

## Varredura

- Inventariadas 24 folhas de auditoria CSS da Essência Luminosa; 17 são importadas diretamente por `main.tsx`.
- Conferidos seletor/prévia, Home, Ajustes de Áudio, Diário, Diário de Reconexão, sessão/player, Mapa Astral, Numerologia, checkout de planos e fluxo de escolha dos benefícios.
- Os seletores específicos do Estilo 3 permanecem escopados por `data-layout="essencia-luminosa"`.

## Pendente

- A Home ainda mantém `--ep-scene: none`. Não há fotografia independente aprovada no repositório; a prancha é uma composição de telas e não deve ser usada como paisagem de fundo.
- Comparação pixel a pixel do PNG original com o WebP atualmente versionado não foi concluída.
- Homologação visual real em navegador, desktop e celular, página por página.
- Teste de execução real de voz, Solfeggio, ambiências, Diário e player.
- Teste InfinitePay em sandbox.
- CI do novo HEAD e publicação Vercel após este commit.

## Conclusão

A correção desta rodada é funcional e localizada: a prévia neural deixa de bloquear ambiências não tonais e continua impedindo apenas a seleção de frequências Solfeggio. Nenhuma decisão visual aprovada foi reaberta. A fotografia própria e a homologação real continuam pendentes.
