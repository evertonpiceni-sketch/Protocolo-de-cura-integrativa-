# Auditoria Run 93 — Estilo 3: Essência Luminosa

**Data:** 08/11/2026  
**Branch:** `main`  
**HEAD de código:** `551513bbeedd14c9fd1fc68153d64e8cf1cb12c3`

## Corrigido

1. **Rótulo da ambiência `waves`:** o motor `src/lib/audio.ts` gera ruído filtrado/modulado para ondas, floresta e chuva; não gera tigelas tibetanas. No Estilo 3, Ajustes de Áudio e Ajustes da Prática agora mostram **“Ondas do Mar — Maré suave e brisa costeira”**. Os rótulos dos outros estilos foram mantidos, sem alteração.
2. **Regressão:** criado `tests/essencia-luminosa-wave-label.test.ts`, cobrindo o rótulo nos dois pontos de entrada e a regra que mantém `waves`/chuva selecionáveis durante a prévia neural, enquanto as frequências Solfeggio continuam bloqueadas.
3. **Varredura CSS:** revisadas as 24 folhas específicas localizadas no repositório (17 importadas diretamente por `main.tsx` e sete carregadas por componentes). A inspeção estática encontrou zero seletores sem `data-layout="essencia-luminosa"` e zero declarações de saída com as cores de herança examinadas (verdão, verde-esmeralda, índigo/roxo e amarelo/âmbar saturado).

## Preservado

- Card do seletor continua usando `/brand/essencia-luminosa/prancha-oficial.webp`; a prancha permanece referência do card, não fundo de página.
- Paleta posterior aprovada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, areia/oliva clara e ouro escuro `#A87E37`.
- Escolha dos quatro estilos continua sem seleção inicial e exige confirmação explícita antes de aplicar `data-layout`.
- Logo permanece assinatura transparente e discreta.
- Voz neural ElevenLabs e ausência de fallback silencioso para SpeechSynthesis no Estilo 3.
- As oito frequências Solfeggio continuam impedidas durante a prévia neural; floresta, chuva, ondas e silêncio continuam disponíveis.
- Diário, Diário de Reconexão, player, animações e conteúdo terapêutico.
- Semestral/Anual continuam exigindo a escolha de um único benefício; servidor registra somente o benefício escolhido após confirmação do pagamento. InfinitePay e catálogo de preços não foram alterados.
- Estilos 1, 2 e 4 não receberam alterações nesta rodada.

## Pendente

1. **Fotografia própria da Home:** `--ep-scene: none` permanece. A imagem gerada durante esta rodada retornou um mockup de interface, não uma fotografia limpa; não foi incorporada. Não reutilizei imagens de outros estilos.
2. **PNG-fonte:** a Run 92 registra a recuperação/inspeção de `1001196521(1).png` (1536 × 1152), mas a busca da Biblioteca nesta execução não reabriu o arquivo. A comparação pixel a pixel com o WebP continua pendente.
3. **Homologação real:** capturas de todas as páginas em desktop/celular; teste de execução da voz, Solfeggio, ambiências, Diário e player.
4. **Pagamento:** checkout InfinitePay em sandbox ainda não testado.
5. **CI/publicação:** o status combinado do HEAD informa Vercel `build-rate-limit`; não há confirmação de build/testes aprovados para este HEAD. Não declarar publicação homologada até nova execução bem-sucedida.

## Commits desta rodada

- `b0d3195648d49158bf491f087d09e9019fbb3acf` — rótulo correto da ambiência em Ajustes de Áudio.
- `3b859114e2368afcc85ecb6b50824f94fb7fce2a` — rótulo correto nos Ajustes da Prática.
- `551513bbeedd14c9fd1fc68153d64e8cf1cb12c3` — teste de regressão.

**Conclusão:** corrigida uma inconsistência concreta de nomenclatura que confundia ondas do mar com tigelas tibetanas. A varredura estática das 24 folhas CSS não encontrou vazamento de seletores nem as cores de herança examinadas. A fotografia da Home, a homologação real, o sandbox de pagamento e a validação CI/publicação continuam pendentes.
