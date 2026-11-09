# Auditoria RUN 128 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de partida:** `b32bd5c82958ca7faa4386e2b2ae9458c134686d`

## Corrigido

A varredura encontrou uma referência aposentada no guardião global de áudio:

- `src/components/ArcanjoProtocolView.tsx` mantém o contêiner estável `#arcanjo-protocol-view` e usa `NeutralBodyLightProgress`.
- `src/lib/arcanjoAudioOwnershipPatch.ts` ainda procurava `img[alt="Pessoa em meditação com os sete chakras"]`.
- Como essa imagem não existe mais, o guardião podia deixar de reconhecer o protocolo depois do intervalo de abertura de cinco segundos, permitindo que o áudio de fundo global voltasse a iniciar sobre a tela do Arcanjo.

Corrigido o marcador para `#arcanjo-protocol-view`, com exclusão de qualquer ocorrência dentro de `#progress-dashboard`. A correção não interfere na narração neural nem no oscilador Solfeggio. Foi acrescentado `tests/arcanjo-audio-ownership.test.ts` para impedir a volta do seletor antigo.

A correção pontual que existia na PR #83 foi incorporada diretamente nesta branch para manter a linha de entrega do Natural Sereno autocontida; a PR #83 não foi alterada nem integrada.

## Varredura visual e componentes

Foi feita nova leitura estática das 12 folhas CSS específicas do Natural Sereno:

- Nenhuma declaração ativa encontrada com os tokens pesquisados de verde-floresta, amarelo saturado ou dourado antigo.
- A camada final aprovada continua isolada por `data-layout="natural-sereno"`.
- O card do seletor usa a paisagem `vale-amanhecer.webp` e a prancha versionada `docs/visual-qa/natural-sereno/reference.jpg`.
- Os testes de paisagem cobrem enquadramento desktop/mobile; os testes de logo mantêm 30% de opacidade no desktop e 26% no mobile.
- O seletor React continua sem estilo pré-selecionado e exige escolha e confirmação explícitas entre os quatro estilos.

A inspeção renderizada página por página continua pendente porque não há preview READY. A prancha JPEG versionada foi preservada como referência oficial de composição, subordinada às decisões posteriores. O PNG original `1001196520.png` / identificador `file_00000000317c820ebaad657dc3680de5` não foi recuperado independentemente nesta rodada.

## Preservado

- Creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento.
- Paisagens realistas, enquadramento responsivo, tipografia e botões premium.
- Logo oficial como assinatura transparente e discreta.
- Seletor explícito dos quatro estilos.
- Corpo neutro, protocolo Arcanjo de sete dias, narração neural, política Solfeggio, Diário, player, animações e respiração 4–3–5.
- Preços, cupons e validação server-side da InfinitePay; operações continuam fail-closed fora de produção. Nenhuma cobrança foi realizada.
- Elegância Profunda, Essência Luminosa e Místico Moderno sem redesenho nesta rodada.

## Validação e limites

- A CI anterior confirmada para esta branch é run `42677230012`, no commit `4e17fff`, com 247/247 testes, npm audit sem vulnerabilidades, TypeScript e build aprovados. Ela antecede as alterações RUN 127 e esta correção.
- O HEAD de partida `b32bd5c` não tinha uma execução de testes associada; o status Vercel estava limitado por `api-deployments-free-per-day`.
- A CI para o novo commit deve ser verificada antes de declarar a correção tecnicamente aprovada.
- A PR #79 está divergente de `main`: 92 commits à frente e 8 atrás na comparação desta rodada; `mergeable=false`. Não fazer merge automático. Reconciliar as mudanças compartilhadas de Elegância Profunda preservando as decisões aprovadas dos dois estilos.
- Sem preview READY: faltam capturas renderizadas desktop/mobile e inspeção visual real.
- Falta escuta em dispositivo de Marianne, Solfeggio, ambiência, pausa e retomada.
- Falta sandbox InfinitePay com checkout, confirmação e webhook.
- Sem merge, publicação em produção ou cobrança real.
