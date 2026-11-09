# Auditoria RUN 117 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**Referência visual:** prancha original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`, subordinada às decisões posteriores aprovadas.

## Corrigido

1. **Player desalinhado:** removidas regras antigas que forçavam `justify-content:flex-start`, `flex:none`, deslocamento superior de 84–150 px, cabeçalho absoluto e composição dividida em 50% da tela. A camada final agora controla explicitamente o flex vertical: cabeçalho no fluxo, conteúdo flexível centralizado e rodapé ancorado no fluxo.
2. **Fundo e paisagem:** o player usa uma base única creme/marfim; a cachoeira é renderizada por uma única imagem responsiva, com foco desktop em `center 16%` e mobile em `center 52%`. A opacidade foi ajustada moderadamente para manter a natureza perceptível sem competir com o corpo neutro e o texto.
3. **Heranças verdes:** removidos fundos verde-floresta do cabeçalho/rodapé antigos; ícones de linha agora usam papel claro com sálvia no símbolo; número do dia e barra de progresso usam dourado refinado; identidade do perfil usa café.
4. **Legibilidade do player:** texto geral de cabeçalho e conteúdo passa a usar café sobre a composição clara, evitando texto marfim herdado em superfícies claras.
5. **Logo:** regras-base contraditórias de opacidade total/multiplicação foram alinhadas a 30%; o override final mantém 30% no desktop e 26% no mobile.

## Preservado

- Paleta creme/marfim, café/marrom, dourado refinado e verde-sálvia somente como acento.
- Paisagem real do vale na Home e cachoeira no player; imagens-fonte não foram substituídas.
- Corpo neutro `NeutralBodyLightProgress`, sem `SacredEnergyCanvas` no ramo Natural Sereno.
- Seis etapas, animação de entrada, movimento de luz e respiração 4–3–5.
- Seletor dos quatro estilos sem pré-seleção; o tema só é aplicado após escolha e confirmação.
- Voz neural Marianne/ID ElevenLabs oficial ou ID neural válido salvo; sem fallback silencioso para SpeechSynthesis nos fluxos Natural Sereno.
- Solfeggio, Diário, sincronização por conta e isolamento entre sessões.
- Conteúdo preservado do Guia dos 7 Chakras; suas cores simbólicas permanecem sem recoloração global.
- InfinitePay: catálogo, preços, cupons, verificação server-side e bloqueio de checkout fora de produção preservados.
- Identidades dos Estilos 2, 3 e 4 não foram redesenhadas.

## Reauditoria e pendências

- Foram acrescentados testes para o canvas único/flexível, remoção de offsets e superfícies verdes, paleta dos ícones/progresso, logo discreto e confirmação explícita do seletor.
- **CI do novo HEAD:** aguardando execução após os commits desta rodada; não declarar aprovado antes do resultado.
- **Preview Vercel:** continua pendente enquanto não houver deployment READY. Sem isso, a inspeção renderizada página a página em desktop/mobile não pode ser homologada.
- **Áudio real:** falta escutar Marianne e testar narração, pausa/retomada, Solfeggio e ambiência em navegador.
- **InfinitePay:** sandbox e webhook de homologação pendentes; nenhuma cobrança foi iniciada.
- **Integração:** a branch continua atrás da main em alterações recentes dos Estilos 2/3; reconciliar manualmente sem sobrescrever decisões posteriores. Nenhum merge foi realizado.

## Estado da entrega

PR #79 permanece aberta e em rascunho. Sem merge, publicação em produção ou cobrança real.
