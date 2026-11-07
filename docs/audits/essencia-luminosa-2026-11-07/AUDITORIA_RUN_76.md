# Auditoria — Estilo 3: Essência Luminosa — Run 76

**Data:** 7 de novembro de 2026  
**Branch:** `main`  
**Base da rodada:** `07dc401d9f805746f088bbc2091f9cee014812f3`  
**HEAD de código/testes:** `0abcca05e960c8ac340bea3fc654932e1812b8a4`

## Corrigido

### Solfeggio durante a prévia de voz

A reauditoria encontrou uma lacuna que não estava coberta pela regra do player de protocolo: a prévia neural em Ajustes podia tocar junto com a frequência Solfeggio.

- A sincronização global de áudio do `App.tsx` agora considera `isPlayingVoiceTest` no Estilo 3. Durante a prévia, as oito frequências Solfeggio ficam interrompidas; ambiências não tonais, como ondas e chuva serena, continuam permitidas.
- O desbloqueio de áudio por gesto respeita a mesma regra, evitando que um clique reinicie a frequência durante a fala.
- `AudioSettingsModal.tsx` passou a usar a política compartilhada. Se a seleção for tonal — ou se o áudio de fundo estiver desativado — a trilha é interrompida antes da narração neural.
- O estado da prévia binaural é limpo quando a trilha tonal é interrompida, evitando que o controle indique reprodução enquanto o som está parado.
- Ao terminar, interromper ou falhar a prévia, o modal restaura a trilha selecionada somente depois da fala; os demais estilos mantêm seu comportamento anterior.

Foi acrescentado teste de regressão cobrindo 396, 417, 432, 528, 639, 741, 852 e 963 Hz, além de ondas/chuva serena e dos dois fluxos de prévia.

## Preservado

- Prancha oficial do Estilo 3 como referência, subordinada às decisões posteriores; o seletor continua usando `/brand/essencia-luminosa/prancha-oficial.webp`.
- Paleta marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B), com areia e oliva clara como acentos.
- Logo oficial com opacidade discreta de assinatura.
- Quatro estilos, seleção inicialmente vazia e confirmação explícita antes da aplicação.
- Voz neural ElevenLabs; IDs válidos salvos permanecem respeitados e Marianne continua como voz oficial para valores legados inválidos. Nenhum fallback silencioso para SpeechSynthesis foi introduzido.
- Diário, Diário de Reconexão, player, canvas, animações e conteúdos dos protocolos.
- Checkout InfinitePay, confirmação pelo provedor, validação do valor e proteção contra reutilização de transação.
- Estilos 1, 2 e 4: nenhuma regra visual deles foi alterada.

## Varredura incremental por área

| Área | Resultado |
|---|---|
| Acesso/cadastro e seletor | Escolha explícita e card próprio conferidos |
| Home e identidade visual | Paleta, logo e isolamento de cena conferidos |
| Ajustes de voz | ElevenLabs e prévia corrigidos |
| Solfeggio/ambiência | Política aplicada à prévia global e ao modal |
| Player/protocolo | Regra de frequência durante a narração preservada |
| Diário/Diário de Reconexão | Componentes e camadas preservados |
| Numerologia/Mapa Astral/Anamnese/Banhos/Ho'oponopono | Camadas anteriores preservadas |
| Cursos/Biblioteca/Contato/Conquistas | Camadas anteriores preservadas |
| Planos/checkout | Fluxos InfinitePay conferidos estaticamente |

O diff desta rodada ficou restrito a quatro arquivos: `src/App.tsx`, `src/components/AudioSettingsModal.tsx`, `src/lib/protocolSessionAudioPolicy.ts` e `tests/essencia-luminosa.test.ts`. Nenhum CSS ou conteúdo terapêutico foi redesenhado.

## Natureza — pendente

A prancha recuperada na Run 75 é uma composição de telas, não uma fotografia limpa para servir de fundo. A busca atual na Biblioteca não encontrou um conjunto fotográfico independente com aprovação comprovada para a Essência Luminosa. Por isso, `--ep-scene: none` permanece intencional: não foram reutilizadas imagens do Natural Sereno, da Reintegração ou de colagens antigas.

A integração de natureza realista própria na Home e nas áreas que pedem paisagem continua pendente.

## Validação e limitações

- Verificação estática desta rodada confirmou seletor explícito, card WebP, voz neural, política das oito frequências, presença do Diário e validação server-side do pagamento.
- O novo teste de regressão foi gravado, mas **não foi executado nesta rodada**. O ambiente de execução não conseguiu clonar o repositório por indisponibilidade de resolução de `github.com`, e não há resultado novo de GitHub Actions acessível para este HEAD.
- A última execução completa confirmada antes destas alterações foi `42422335426`: 108/108 testes e build aprovados; enforcement de dependências reprovado. Esse resultado antecede a Run 76 e não comprova os novos testes.
- O status combinado atual da Vercel continua em falha por `build-rate-limit`; publicação não homologada.
- A última auditoria de dependências registrou 9 vulnerabilidades (3 moderadas e 6 altas). O audit não foi repetido nesta rodada.

## Commits desta rodada

- `8622b49cd25868207564006862fef22bccaec9c3` — sincronização global pausa Solfeggio durante a prévia neural.
- `bdeaca3833b815128a0d49f492c6e3a4b94561e4` — modal de áudio aplica a mesma política.
- `e34bd4afc67111697652f064cd5a2775f78ad21b` — comentário da política atualizado.
- `a6a7a40fda366c7736d4c30d2694122deda516d6` — teste de regressão das frequências.
- `e2b2bbea9da8903add3dffc2ca52529dd9d92880` — limpa estado visual da prévia tonal.
- `c29050ea80674a75035a82355b7fbf1be859f90f` — teste do estado da prévia.
- `4d29519cfd13c2ea15f2a4577e4f497b5a10f952` — restaura a trilha selecionada após a fala.
- `0abcca05e960c8ac340bea3fc654932e1812b8a4` — teste da restauração da ambiência.

**Conclusão:** foi corrigida a lacuna que permitia Solfeggio durante a prévia neural da Essência Luminosa, mantendo ambiência não tonal e restaurando a seleção após a fala. A identidade, o seletor, o Diário, o player e os pagamentos foram preservados. Natureza fotográfica própria, homologação visual/runtime, execução da suíte no novo HEAD, segurança e publicação continuam pendentes.
