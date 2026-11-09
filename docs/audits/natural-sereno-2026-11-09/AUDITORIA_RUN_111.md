# Auditoria RUN 111 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Base de integração:** `main` em `41724715950186ba1715b61e1e921a2dcd30a7d6`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**Status:** integração preparada em branch limpa; CI do PR pendente.

## Achados e correções integradas

- A `main` ainda carregava tokens antigos do Natural Sereno: verde-floresta `#2D4A3E`, fundos mais escuros e dourado anterior. Restaurada a paleta aprovada: creme/marfim `#FAF7F2` / `#F5EFE5`, café `#2A2421`, texto secundário `#6B625B`, dourado `#E2B96B` / `#C89D52` / `#A87E37` e sálvia apenas como acento.
- Home e componentes de entrada: removidos overlays verde-floresta, grandes chapas escuras, CTA antigo em pílula e regras supersedidas; preservada a paisagem `--ns-valley` com enquadramento responsivo e superfícies claras.
- Superfícies secundárias/mobile: atualizados player, Anamnese, Cursos, Numerologia, Admin, Planos, Diário, Ajustes, acolhimento e carregamento para creme/café/dourado refinado. CTAs do Natural Sereno ficam com cantos de 18px.
- Logo: mantida a assinatura oficial discreta; opacidade final de 30% desktop e 26% mobile, incluindo a tela de carregamento, sem filtro ou fundo dominante.
- Seletor: confirmação continua obrigatória, sem estilo pré-selecionado; CTA do Natural Sereno usa 18px e os demais estilos mantêm seus acabamentos próprios.
- Voz e Solfeggio: Natural Sereno passa a exigir voz neural Marianne — Meditação nos caminhos de Anamnese, Arcanjo, oração, Ho'oponopono e Reflexão Sistêmica; sem fallback silencioso para SpeechSynthesis. Frequências tonais ficam bloqueadas durante prévia neural e o Solfeggio só inicia/retoma após reprodução real da narração.
- Diário e sessão: preservados campos opcionais; perfil/progresso sincronizados por snapshot coerente e fila por conta.
- Segurança P1: sincronizações ficam vinculadas à conta que iniciou a operação; payload sem identidade ou com divergência falha fechado no cliente e no servidor (403), evitando mistura de perfil/Diário entre contas. Cadastro com falha transitória mantém campos pendentes isolados por login para reenvio autenticado.

## Preservado

- Prancha oficial `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`, sempre subordinada às decisões posteriores.
- Identidade Natural Sereno, paisagens, tipografia, player, seis etapas, animações e respiração 4–3–5.
- Elegância Profunda, Essência Luminosa e Místico Moderno sem redesenho ou alteração comercial.
- Fotografia aprovada mais recente da Elegância Profunda na `main`: `photo-1788699626335-906b2c4ae2d8` e sua atribuição permanecem intactas; a integração altera somente o bloco Natural Sereno do CSS compartilhado.
- InfinitePay, preços, cupons, benefícios e endpoints sem alteração; nenhuma cobrança foi iniciada.
- Nenhum merge, deploy de produção ou alteração de configuração financeira.

## Validação e pendências

- A suíte RUN 110 anterior passou 201/201 testes, TypeScript, build e npm audit zero vulnerabilidades em sandbox isolado. Essa evidência é da branch anterior, não substitui a CI desta integração limpa.
- **CI GitHub Actions do novo PR:** pendente de execução/resultado.
- **Vercel Preview:** check anterior em `build-rate-limit`; sem preview READY. Faltam capturas renderizadas página a página em desktop e mobile.
- **Áudio real:** falta escutar Marianne — Meditação no dispositivo e conferir transições narração/Solfeggio/ambiência.
- **InfinitePay:** checkout, confirmação e webhook em sandbox permanecem pendentes.
- A homologação visual e auditiva continua aberta; não declarar o Estilo 1 integralmente homologado até essas etapas.
