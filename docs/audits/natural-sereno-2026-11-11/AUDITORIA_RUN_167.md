# Auditoria RUN 167 — Estilo 1: Natural Sereno

**Data:** 11/11/2026 — 06:41 BRT  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD verificado antes do registro deste relatório:** `63cb5940dd9a8783079ba7225c0413c5f983b290`

## Corrigido

1. **Logo do cabeçalho — cascata contraditória removida.** `natural-sereno-refinement.css` ainda declarava `opacity: 1` para `.ep-brand-signature`, embora a decisão aprovada e a camada final já exigissem a assinatura em 30%. A regra intermediária agora também usa `opacity: .30`; o wrapper permanece transparente. A camada final continua com `mix-blend-mode: normal`.
2. **Proteção de regressão.** Adicionado `tests/natural-sereno-run167-logo-cascade.test.ts` para verificar a opacidade nas duas camadas, a ordem de importação e a escolha explícita do estilo. A primeira versão do teste encontrou o seletor de wrapper por prefixo; a busca foi corrigida para exigir o seletor exato antes de registrar o teste final.

## Preservado e reauditorado

- **Seletor:** `LayoutChoiceModal` inicia com `selectedLayout = null`; o botão de confirmação fica desabilitado sem escolha. `App.tsx` inicia `layoutConfirmedThisSession = false`, remove `data-layout` antes da confirmação e só aplica o estilo após persistir a escolha.
- **Quatro estilos:** Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno continuam explícitos. As folhas de tema dos estilos 2 e 3 permanecem escopadas aos próprios `data-layout`; nenhuma delas foi alterada.
- **Referência visual:** o card usa `docs/visual-qa/natural-sereno/reference.jpg` com `object-contain`, sem recorte. O componente mantém registrado o ID da prancha original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A prancha continua subordinada às decisões posteriores; não foram recuperados seus elementos históricos de verde-floresta ou corpo com chakras.
- **Identidade:** creme/marfim, café/marrom, dourado refinado, verde somente como acento natural, fotografias reais, tipografia suavizada e logo discreto.
- **Paisagens:** Home usa `vale-amanhecer.webp`; acolhimento usa `acolhimento.webp`; páginas internas usam a folhagem natural. Há enquadramentos distintos para desktop e mobile.
- **Reintegração:** 21 dias, corpo neutro, movimento da luz, arte diária, player e animações preservados. O logo permanece em 30%.
- **Voz:** Marianne `mJqP14JQFEK0PojR5lfV` está fixada na rota de TTS da Reintegração; a rota ativa `api/index.ts` exige sessão e conta existente, limita a cues autorizados e não oferece fallback robótico. O patch Natural Sereno normaliza IDs antigos e desativa `SpeechSynthesis` no fluxo neural.
- **Solfeggio/Arcanjo:** a política bloqueia frequência tonal enquanto a voz está carregando ou tocando. A posse de áudio do Arcanjo usa o contêiner estável `#arcanjo-protocol-view`, sem depender da arte corporal aposentada.
- **Diário:** texto livre é escapado; o cartão semanal usa a conta atual, não recorre à primeira conta armazenada e atualiza o HTML apenas quando há mudança. Perfil e progresso continuam sendo persistidos no mesmo snapshot.
- **Pagamentos:** checkout permanece fail-closed, exige API Key, pagamento único, lock de escrita e confirmação server-side. Nenhuma regra de preço ou cupom foi alterada.

## Reauditoria estática após a intervenção

**8/8 verificações estáticas de fonte passaram**, cobrindo:
- opacidade 30% na regra intermediária e na camada final;
- ausência de `opacity: 1` no seletor exato do logo;
- ordem de importação da camada final;
- seletor sem pré-seleção;
- aplicação do layout somente após confirmação;
- HEAD correspondente ao commit do teste final.

O arquivo de teste foi adicionado, mas **a suíte Node/TypeScript não foi executada**. Não declarar CI, TypeScript ou build aprovados.

## Pendente / bloqueios

- **GitHub Actions:** nenhuma execução associada ao HEAD verificado; o status combinado permanece com Vercel em falha.
- **Vercel:** projeto `protocolodecuraintegrativa` permanece `live=false`. O deployment mais recente listado para esta branch é do commit `9aca204f` e terminou em `ERROR / BUILD_FAILED — Resource provisioning failed`; não há eventos de build nem Preview READY para o HEAD atual.
- **InfinitePay:** `INFINITEPAY_API_KEY` não consta no inventário. `INFINITEPAY_HANDLE` está somente em Production e `PUBLIC_APP_URL` não tem alvo Preview para esta branch. As variáveis ElevenLabs aparecem em Preview e Production; nenhum valor secreto foi descriptografado. Sandbox/webhook e qualquer cobrança permanecem pendentes.
- **Homologação:** QA visual renderizado página a página em desktop/mobile; escuta real de Marianne e Solfeggio; Diário/player ponta a ponta; teste do checkout e webhook em sandbox.
- **Integração:** a branch está 283 commits à frente e 12 atrás de `main`. Não fazer merge/rebase automático; comparar seletivamente as alterações de App, API, pagamentos e áudio, preservando as decisões aprovadas.

Nenhum merge, publicação em Production, alteração de credenciais ou pagamento real foi realizado.
