# Auditoria RUN 99 — Estilo 1: Natural Sereno

**Data:** 08/11/2026  
**Base:** `main` em `2e1f7aa78171e6faf8404d569316f86cb7e30fe2`  
**Branch:** `audit/natural-sereno-run97-mainline-2026-11-08`  
**HEAD validado:** `46ba1e3f5bd5faabe37cb16fe4c2d064258af22a`

## Corrigido nesta rodada

- Corrigido o contraste do botão habilitado **“Enviar Feedback”** no modal de Anamnese: o fundo continua sálvia `#6F7B55` e o texto passou de café `#2A2421` para branco `#FFFFFF`.
- Razão calculada: **4,53:1**, acima do mínimo **4,5:1** WCAG AA para texto pequeno.
- Adicionado teste de regressão que lê as cores efetivas da regra e calcula a razão de contraste, impedindo que a combinação de baixo contraste retorne.
- Os apontamentos P2 de contraste e P1 do próprio teste foram corrigidos; a segunda falha era apenas a extração do hexadecimal no teste, não do CSS de produção.

## Varredura e preservado

- Varredura estática de **12 folhas CSS** do Natural Sereno e verificação da ordem de importação: `natural-sereno-approved-overrides.css` permanece por último.
- Nas declarações ativas examinadas, não foram encontrados os tokens legados de verde-floresta/amarelo saturado que estavam na lista de regressão.
- Nenhum CTA `.ns-gold` com raio de pílula foi encontrado. Os três usos de `999px` identificados nessa varredura pertencem a trilhas de slider e ao trilho de um switch, não a botões.
- Seletor: quatro estilos continuam sem pré-seleção; confirmação explícita obrigatória; preferência salva não aplica o tema automaticamente antes da confirmação na sessão.
- Home, paisagens, superfícies mobile, botões premium, identidade creme/marfim/café/dourado e verde apenas como acento preservados.
- Logo oficial permanece como assinatura discreta: 30% desktop e 26% até 640px.
- Voz neural sem fallback silencioso para SpeechSynthesis; Solfeggio, proteção durante prévia neural, Diário, player, seis etapas, animações e respiração 4–3–5 preservados.
- Fluxo InfinitePay, escolha server-side de benefício Semestral/Anual, validação de valor e deduplicação preservados. Nenhuma cobrança foi iniciada.
- Estilos 2, 3 e 4 não foram redesenhados nesta rodada.

## Validação

GitHub Actions Security Audit **#1914** — execução `42529455570` — concluída com sucesso:
- `npm audit`: **0 vulnerabilidades**;
- TypeScript: aprovado;
- testes: **161/161 aprovados**;
- build Vite: aprovado (**2.247 módulos**);
- entrypoints Vercel/Express, JWT, autenticação/admin, smoke tests e endpoints de pagamento: aprovados.

A revisão independente foi solicitada novamente para o HEAD atual; o resultado ainda precisa ser confirmado.

## Pendências

1. Vercel continua bloqueando novo preview pelo limite diário de deployments (`api-deployments-free-per-day`). Não há preview READY confirmado.
2. Faltam capturas renderizadas e comparação página a página em desktop e mobile; a varredura desta rodada foi estática, não visual em navegador.
3. Falta escutar a voz neural salva e testar em navegador autenticado as transições narração/Solfeggio/ambiência e o player.
4. Falta homologar checkout, confirmação e webhook InfinitePay em sandbox. Nenhuma cobrança real foi feita.
5. A busca pela Library não recuperou o arquivo exato `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. O painel semelhante `Painel UX_UI Natural Sereno.png` não foi tratado como substituto. A referência versionada `docs/visual-qa/natural-sereno/reference.jpg` foi preservada sem substituição.

## Estado de entrega

- PR #74 aberta em rascunho, baseada na `main`.
- Última comparação: 21 commits à frente, zero atrás.
- Vercel: falha externa por limite diário.
- Sem merge na `main`, sem publicação em produção e sem cobrança real.

**Conclusão:** a falha concreta de legibilidade do botão de feedback foi corrigida e coberta por teste quantitativo. A identidade visual e os fluxos aprovados foram preservados. O Estilo 1 ainda não está homologado integralmente porque a prévia renderizada, a escuta real dos áudios e o sandbox financeiro permanecem indisponíveis.
