# Auditoria RUN 111 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Base de integração:** main em `41724715950186ba1715b61e1e921a2dcd30a7d6`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, draft, mergeable.

## Achados e correções integradas

- A main ainda carregava tokens antigos do Natural Sereno: verde-floresta `#2D4A3E`, fundos mais escuros e dourado anterior. Restaurada a paleta aprovada: creme/marfim `#FAF7F2` / `#F5EFE5`, café `#2A2421`, texto secundário `#6B625B`, dourado `#E2B96B` / `#C89D52` / `#A87E37` e sálvia apenas como acento.
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
- Fotografia aprovada mais recente da Elegância Profunda na main: `photo-1788699626335-906b2c4ae2d8` e sua atribuição permanecem intactas; a edição do CSS compartilhado toca somente os blocos Natural Sereno.
- InfinitePay, preços, cupons, benefícios e endpoints sem alteração; nenhuma cobrança foi iniciada.
- Nenhum merge ou deploy de produção.

## Reauditoria técnica — GitHub Actions #2038

Execução **42567314852**, no commit `67ea20c7038a958982daf70a286ec0e186de3f26`: concluída com sucesso.

- `npm audit --audit-level=moderate`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes de regressão: **201/201 aprovados**.
- Build Vite + Express: aprovado; **2.250 módulos transformados**.
- Entry points Vercel/Express, JWT, segredos, autenticação administrativa, smoke test de saúde/cadastro e endpoints de pagamento: aprovados.
- Avisos não bloqueantes: chunk JavaScript acima de 500 kB e depreciações de dependências/ações. Logs de erro de áudio aparecem em fixtures de falha controlada e os testes correspondentes passaram.

## Pendências reais

1. **Vercel Preview:** deployment `dpl_4TyCSUs25KijcieA8XNsULsTCWSD` terminou em `ERROR / BUILD_FAILED — Resource provisioning failed`. A consulta de eventos de build retornou vazia; não há evidência de falha do código nem preview READY. Não forcei novo deployment.
2. **Homologação visual:** faltam capturas renderizadas página a página em desktop e mobile. A validação desta rodada é estática e automatizada.
3. **Áudio real:** falta escutar Marianne — Meditação no dispositivo e conferir transições narração/Solfeggio/ambiência.
4. **InfinitePay:** checkout, confirmação e webhook em sandbox permanecem pendentes.
5. A revisão visual/auditiva e financeira continua aberta; não declarar o Estilo 1 integralmente homologado até essas etapas.

## Estado da entrega

- PR #79 aberta, draft, mergeable; branch limpa sobre a main atual.
- Um commit de código e um commit documental; sem commits atrás da main.
- PR #74 permanece aberta e divergente; não é a candidata de integração. A PR #79 é a linha limpa baseada na main atual.
- Sem merge, deploy de produção ou cobrança real.
