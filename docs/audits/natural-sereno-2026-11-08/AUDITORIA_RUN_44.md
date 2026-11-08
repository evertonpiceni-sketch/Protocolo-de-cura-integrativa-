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


## Correção complementar — player mobile

A varredura das cinco folhas CSS específicas do Natural Sereno encontrou regras antigas de overlay verde-floresta no player mobile. Embora a última camada aprovada já as neutralizasse, elas permaneciam no arquivo responsivo e poderiam reaparecer se a ordem de importação mudasse.

- Substituídos os cinco fundos/overlays escuros por superfícies creme/marfim e café, com bordas douradas refinadas.
- Mantidos os enquadramentos da fotografia, a animação da camada de fundo e a estrutura responsiva.
- Adicionado teste de regressão para impedir o retorno de `rgba(3,26,19)` e `rgba(5,38,28)`.
- Corrigida a expressão regular do teste após a primeira execução TypeScript apontar erro sintático; a validação completa foi disparada novamente no head seguinte.

A reauditoria estática das cinco folhas específicas encontrou 911 regras/seletores analisados, sem seletores globais indevidos (o único token não escopado detectado foi `to`, pertencente a keyframe) e sem os valores de verde-floresta examinados.


## Reconciliação posterior da main

A `main` recebeu mais quatro commits após a primeira integração, todos relativos à identificação correta da ambiência `waves` nos Estilos 2 e 3. Eles foram incorporados por um segundo merge commit.

- Elegância Profunda e Essência Luminosa agora exibem “Ondas do Mar” nos dois pontos de seleção.
- Natural Sereno conserva os rótulos próprios aprovados (“Sinos & Brisa Tibetana” e “Sinos Zen”); não foi alterado por essa decisão dos outros estilos.
- Atualizados os testes de regressão dos Estilos 2 e 3 e preservados os testes adicionais do Natural Sereno.
- A branch voltou a incluir a `main` atual sem commits atrasados.

O primeiro CI após a limpeza do player encontrou um erro de escape na expressão regular do teste; a sintaxe foi corrigida. O CI do HEAD seguinte deve ser tratado como fonte de verdade para a validação final.


## Registro posterior da Elegância Profunda

A auditoria RUN 94 da Elegância Profunda, publicada depois da segunda integração, também foi incorporada à branch. O documento registra que a correção recente de rótulo `waves` afeta somente os Estilos 2 e 3; Natural Sereno e Místico Moderno permanecem inalterados. A branch agora inclui esse registro sem reintroduzir componentes ou cores de outro estilo no Natural Sereno.


## CI do HEAD validado

A execução GitHub Actions `42497160339` concluiu com sucesso no HEAD `048fa0b51af275b7981fc8292d243b52d5ce58fe`:

- `npm audit`: zero vulnerabilidades.
- TypeScript: aprovado.
- Testes: **177/177 aprovados**.
- Build Vite: aprovado; 2.249 módulos transformados.
- Entry points Vercel, verificação de segredos, JWT, autenticação/admin, smoke tests e endpoints de pagamento fail-closed: aprovados.

O check Vercel permanece em falha `build-rate-limit`; por isso ainda não há preview navegável nem homologação visual/auditiva real.
