# Auditoria RUN 44 — Estilo 1: Natural Sereno

**Data:** 08/11/2026  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**PR:** #67  
**Integração:** merge commit sobre a branch de trabalho, incorporando a `main` em `0abc0fadbb637480d393712fc6c055480f89b2de`.  
**Estado:** integração registrada; CI do novo merge commit e homologação externa ainda pendentes.

## Corrigido / integrado

1. Reconciliados os 23 commits posteriores da `main` sem descartar os 110 commits de trabalho da auditoria Natural Sereno.
2. Preservados os ajustes posteriores da Elegância Profunda e da Essência Luminosa: superfícies de banho de ervas, mapas/modais, ajustes de áudio, regras de prévia neural e rótulos corretos de ondas do mar.
3. Mesclados os rótulos de ambiência sem alterar o Natural Sereno: a Essência Luminosa exibe “Ondas do Mar”; o Natural Sereno mantém “Sinos & Brisa Tibetana” na lista de práticas e “Sinos Zen” nas configurações de áudio.
4. Preservada a política de áudio compartilhada: durante a prévia neural, somente frequências Solfeggio ficam bloqueadas nos estilos que exigem essa proteção; ambiências não tonais continuam disponíveis conforme a regra de cada estilo.
5. Reconciliados os testes de integração para manter simultaneamente as proteções do Natural Sereno e as verificações posteriores dos Estilos 2 e 3.
6. Conferida a revisão P2 sobre escolha de benefício em checkout pendente: `matchesRequestedStandardOrder` compara `candidate.benefitChoice === benefitChoice`. O teste de regressão cobre a troca de Mapa Astral para Numerologia (409, sem novo link) e a repetição da mesma escolha (reutiliza o link existente).

## Preservado

- Seletor neutro dos quatro estilos, sem escolha inicial, com confirmação explícita.
- Natural Sereno: creme/marfim, café/marrom, dourado refinado e verde-sálvia apenas como acento; fotografias realistas; botões premium; logo oficial discreto.
- Diário, sincronização resiliente, perfil, progresso e cadastro atômico.
- Player, seis etapas, animações e respiração 4–3–5.
- Voz neural, proteção contra fallback robótico silencioso e ownership do áudio do Arcanjo.
- Solfeggio e ambiências conforme a política de cada estilo.
- Catálogo vigente, escolha única de benefício Semestral/Anual, checkout InfinitePay fail-closed, locks globais, deduplicação e confirmação server-side.
- Alterações aprovadas recentes dos Estilos 2 e 3; o Estilo 4 não foi redesenhado.

## Pendente

1. CI completo do novo merge commit: TypeScript, testes, build, segurança e endpoints.
2. Vercel ainda reporta `build-rate-limit`; sem preview READY não há capturas reais desktop/mobile.
3. Homologação auditiva da voz escolhida, Solfeggio, ambiências e transições do player.
4. `INFINITEPAY_API_KEY` não aparece na configuração de produção consultada; checkout permanece fail-closed. Sandbox e conciliação de links legados pendentes.
5. O PNG original `1001196520.png` não foi localizado nesta execução; a referência versionada existente foi preservada, sem substituição.
6. Revisar a variável antiga `UPSTASH_DB_KEY` da branch de auditoria antiga sem expor seu valor.

## Segurança da entrega

- Nenhum merge na `main`.
- Nenhuma publicação em produção.
- Nenhuma cobrança, reembolso ou chamada real à InfinitePay.
- Não foram removidos materiais aprovados nem substituídas as referências visuais.
