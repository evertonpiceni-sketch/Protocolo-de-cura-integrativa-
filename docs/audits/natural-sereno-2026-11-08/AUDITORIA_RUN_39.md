# Auditoria — Estilo 1 Natural Sereno | RUN 39

**Data:** 2026-11-08  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Head de código e testes:** `22cb67b7bdad5ea82c9c4fc6ed483758ca254ea5`  
**PR:** #67, aberta e não mesclada.

## Achado e correção

A revisão página/fluxo encontrou uma herança obsoleta nas telas de acesso:

- `ProfileSetup.tsx` já usa `ep-auth-prestyle`, sem aplicar um dos quatro estilos antes da escolha.
- A decisão posterior registrada na RUN 63 da Essência Luminosa determina que cadastro/login permaneçam neutros, sem antecipar Natural Sereno e sem carregar a fotografia desse estilo antes da confirmação.
- Apesar disso, `natural-sereno.css` e `natural-sereno-approved-overrides.css` ainda continham seletores mortos `#profile-setup-view.ep-auth-style-one`. A folha antiga continha inclusive paisagem, folhagem, verde-floresta, CTA amarelo em pílula e opacidade de logo conflitante.
- Foram removidos **35 seletores** obsoletos da folha base e **7 seletores** da camada final. Nenhuma regra ativa de uma tela aprovada foi redesenhada.
- O teste antigo que exigia esses seletores foi substituído por uma regressão que exige `ep-auth-prestyle`, confirma o tema neutro antes da escolha e impede a reintrodução de `ep-auth-style-one` no acesso.

Referência da decisão posterior preservada: `docs/audits/essencia-luminosa-2026-11-07/AUDITORIA_RUN_63.md`.

## Preservado

- Card oficial Natural Sereno em `docs/visual-qa/natural-sereno/reference.jpg`, subordinado às decisões posteriores.
- Seletor dos quatro estilos: seleção inicial vazia, confirmação obrigatória e `data-layout` aplicado somente após confirmação explícita.
- Natural Sereno: creme/marfim, café/marrom, dourado refinado e verde-sálvia apenas como acento; natureza realista nas telas do estilo após a escolha.
- Logo oficial como assinatura discreta.
- Diário, player, seis etapas, animações, respiração 4–3–5 e respeito a movimento reduzido.
- Voz neural salva/selecionada, sem fallback silencioso para voz robótica; política de não tocar Solfeggio durante prévia neural, mantendo ambiência não tonal.
- Ownership do áudio próprio do Arcanjo.
- Locks globais, refresh do snapshot, deduplicação, idempotência, validação server-side e fail-closed do checkout InfinitePay.
- Atualizações posteriores dos Estilos 2, 3 e 4. Nenhuma alteração visual nesses estilos.

## Varredura estática por camadas

- `natural-sereno.css`: 465 seletores; todos sob `data-layout="natural-sereno"`.
- `natural-sereno-approved-overrides.css`: 230 seletores; todos sob o escopo Natural Sereno.
- `natural-sereno-home-surface-audit.css`: 22 seletores; todos sob o escopo Natural Sereno.
- Não restaram seletores de acesso `#profile-setup-view.ep-auth-style-one`.
- A pré-seleção neutra continua em `approved-theme.css`, com `#profile-setup-view.ep-auth-prestyle`.

Esta verificação é estática; não substitui a inspeção renderizada em navegador.

## Reauditoria técnica — GitHub Actions #1740

- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **149/149 aprovados**, 0 falhas.
- Build Vite: aprovado (2.247 módulos transformados).
- Entry points Vercel/Express: aprovados.
- Verificações de segredos/JWT e proteção administrativa: aprovadas.
- Smoke test de saúde/cadastro: aprovado.
- Endpoints de pagamento fail-closed: aprovados.

Execução: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42469460934

## Pendente

1. **Homologação visual real:** o check externo Vercel segue falhando por limite diário `api-deployments-free-per-day`; faltam capturas página a página em desktop e mobile.
2. **Homologação auditiva:** escutar no navegador a voz escolhida e as transições narração/Solfeggio/ambiência.
3. **InfinitePay:** a última consulta de metadados registrada na RUN 38 não encontrou `INFINITEPAY_API_KEY`; o checkout permanece fail-closed. Configuração e sandbox continuam pendentes.
4. **Conciliação externa:** conferir eventuais links antigos pendentes na conta InfinitePay.
5. **Segurança Vercel:** revisar a variável antiga de preview sinalizada como `readable-secret` (`UPSTASH_DB_KEY`) sem consultar ou expor seu valor.

## Estado de entrega

- PR #67 aberta, mergeable, sem merge.
- Base `main`: `d058e1155e1aaf31bb4ac41a788f220bad585b70`.
- Head após esta rodada: `22cb67b7bdad5ea82c9c4fc6ed483758ca254ea5`.
- Check GitHub Actions #1740: sucesso.
- Check externo Vercel: falha por limite diário de deployments.
- Nenhuma publicação em produção, cobrança ou estorno real foi realizada.
