# Auditoria Run 28 — Estilo 4: Místico Moderno

**Data:** 07/11/2026  
**Branch:** `fix/mistico-moderno-mainline-2026-11-07`  
**PR:** #49 — alterações mantidas fora da `main`  
**Referência oficial:** arquivo `1001196522.png`, ID `file_000000009978820eb49581883ae6340d`.

## Corrigido nesta rodada

- **Prancha oficial:** recuperado o arquivo original (1536×1152, proporção 4:3). O derivado anterior no repositório estava em 16:9 e deformava a composição. Substituído por WebP 256×192 (4:3), mantendo a prancha inteira no cartão do seletor com `object-contain`.
- **Voz escolhida:** removida a imposição fixa de Marianne no Estilo 4. Home, Ajustes, player e Arcanjo passam a respeitar o `voiceId` neural salvo no perfil. O catálogo ElevenLabs é carregado também para o Estilo 4.
- **Sem voz robótica:** ID ausente/inválido ou falha do serviço interrompe a narração e apresenta erro; não há fallback para Rachel, Marcus ou SpeechSynthesis do navegador. O Arcanjo valida a voz antes de iniciar o Solfeggio.
- **Seletor de áudio da página Ajustes:** o Estilo 4 agora oferece o catálogo neural e o teste reproduz exatamente o ID salvo, em vez de usar a voz local do dispositivo.
- **Regressão:** testes agora verificam a voz salva do perfil, a ausência de fallback e a proporção 4:3 real do arquivo da prancha.

## Preservado

- Escolha explícita entre os quatro estilos, confirmação antes da aplicação e limpeza da confirmação no logout.
- Paleta Místico Moderno: azul noturno, índigo, esmeralda, violeta, dourado, âmbar, marfim e verde natural.
- 23 módulos CSS isolados por `data-layout="mistico-moderno"`; a identidade dos outros estilos não foi alterada.
- Diário fechado por padrão; player, animação e `prefers-reduced-motion` preservados.
- Política de áudio: Solfeggio tonal global não reinicia durante a fala do protocolo; o Arcanjo mantém somente seu fluxo próprio e o interrompe em pausa/erro.
- Logo oficial como assinatura transparente, opacidade de 30% (26% em telas pequenas), sem filtros concorrentes.
- Pagamentos: nenhuma alteração de checkout. O backend continua criando cobranças na InfinitePay, validando valor/transação no servidor e liberando acesso somente após confirmação.

## Pendente

1. CI do PR após o novo commit e inspeção visual em navegador desktop/celular.
2. Teste auditivo real com o ID que estiver salvo no perfil e credenciais ElevenLabs ativas.
3. Homologação ponta a ponta do checkout em ambiente de teste; não foi alterado nesta rodada.
4. Resolver 9 alertas anteriores de dependências (3 moderados, 6 altos) sem upgrades forçados.
5. Preview Vercel segue sujeito ao bloqueio de limite de provisionamento; não houve deploy de produção.

**Status:** correções de código preparadas no PR #49; Estilo 4 continua em homologação, sem merge e sem deploy.
