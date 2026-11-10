# Auditoria RUN 139 — Estilo 1: Natural Sereno

**Data:** 10/11/2026 00:42 (America/Sao_Paulo)  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD antes deste relatório:** `4b0ce7d625a933dc9c3624e79c0c8a3a5f7aa4e8`  
**Main verificada:** `783aacc8210d92f35037a0d06309806b89a96973`  
**PR:** #79, aberta e em rascunho.

## Resultado

Não foi identificada uma nova regressão visual/funcional do Natural Sereno que justificasse outra alteração de código. As correções anteriores permanecem coerentes; esta rodada registra a reauditoria e evita retrabalho.

## Verificado e preservado

- Seletor React dos quatro estilos inicia com `selectedLayout = null`; o botão de confirmação fica desabilitado até uma escolha e a aplicação ocorre somente após `onSelect` persistir a escolha.
- Prévia Natural Sereno combina paisagem realista (`vale-amanhecer.webp`) com a prancha de referência versionada em `docs/visual-qa/natural-sereno/reference.jpg`, usando `object-contain` para a prancha. O código documenta o PNG original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`; a cópia no repositório é uma derivação JPEG, não uma alegação de equivalência pixel a pixel.
- Ordem de CSS em `src/main.tsx`: `index.css`, `approved-theme.css`, camadas de estilo, auditorias Natural Sereno e, por último entre as camadas do Estilo 1, `natural-sereno-approved-overrides.css`. As camadas finais da Elegância Profunda e Essência Luminosa permanecem escopadas a seus estilos.
- Revisão estática das camadas Natural Sereno: `natural-sereno.css`, `natural-sereno-refinement.css`, `natural-sereno-mobile-fixes.css`, `natural-sereno-final-audit.css`, `natural-sereno-home-surface-audit.css`, `natural-sereno-legacy-green-audit.css`, `natural-sereno-milestone-audit.css` e `natural-sereno-approved-overrides.css`.
- Não foram encontradas declarações ativas de propriedade usando os valores antigos `#B88736`, `#D4AF37`, `#315C85` ou `#2D4A3E` nas quatro folhas principais de override/refinamento/mobile/final-audit. As ocorrências residuais nas camadas finais são seletores que capturam classes Tailwind legadas e as substituem por valores aprovados, ou comentários explicativos.
- Cabeçalho/logo, dock inferior, botão flutuante de contato, toast, Diário, Anamnese, oração, Prática Individual, celebração de marcos, player e Arcanjo têm regras específicas sob `data-layout="natural-sereno"`.
- Paleta vigente preservada: creme/marfim `#FAF7F2` / `#F5EFE5`, café `#2A2421`, texto secundário `#6B625B`, dourados `#E2B96B` / `#C89D52` / `#A87E37`, sálvia como acento.
- Arcanjo usa `NeutralBodyLightProgress`; o áudio neural exige ID ElevenLabs explícito no Natural Sereno. A política de Solfeggio impede sobreposição com a narração e respeita áudio desativado.
- Diário usa `syncUserState`, fila por conta e verificação da identidade atual; servidor valida `accountLogin` contra a sessão.
- InfinitePay mantém API Key obrigatória, lock compartilhado, persistência protegida e bloqueio de pagamentos reais fora de produção até homologação sandbox.
- O logo permanece como assinatura discreta; as decisões posteriores sobre corpo neutro, paleta e transparência prevalecem sobre detalhes históricos da prancha.

## Achado crítico de integração — não atualizar a branch cegamente

Comparação atual: **159 commits à frente / 12 atrás** de `main`; merge base `41724715950186ba1715b61e1e921a2dcd30a7d6`.

A inspeção dos arquivos correspondentes mostrou que uma cópia cega da `main` reintroduziria regressões:
- `src/components/ArcanjoProtocolView.tsx` na main volta a declarar `ChakraBody` com `human-chakra-model.jpg`; a branch usa `NeutralBodyLightProgress` e a política de áudio específica do Natural Sereno.
- `src/components/LayoutChoiceModal.tsx` na main não contém a prévia composta atual da paisagem + prancha e mantém tokens dourados antigos no card Natural Sereno; a branch tem escolha explícita, confirmação obrigatória e dourado aprovado.
- `src/lib/paymentRoutes.ts` na branch mantém a barreira `VERCEL_ENV === 'production'` para impedir cobranças reais antes do sandbox; essa barreira não aparece na versão atual da main.
- `server.ts` na branch valida a identidade `accountLogin` na sincronização e protege `/api/tts/stream` com autenticação/limite; a versão da main consultada não contém essas mesmas proteções.
- A main também contém alterações posteriores de Elegância Profunda e testes adicionais de pagamento/áudio. Elas devem ser reconciliadas seletivamente, sem substituir os guardas do Natural Sereno nem os testes já existentes.

**Decisão desta rodada:** não fazer merge, rebase, atualização automática da branch ou cherry-pick sem reconciliação por arquivo. Nenhum componente congelado foi alterado.

## Validação e pendências

- GitHub Actions associados ao HEAD consultado: nenhum.
- Status combinado: somente Vercel `failure`. O deployment do HEAD documental `2bd3e60914c79adbe9fa2d9b353db4732a3334ea` está em `ERROR / BUILD_FAILED`, com `errorMessage: Resource provisioning failed` (deployment `dpl_3fPQhsk7vjNu2mkQ3j8dFMdfX8rN`). A consulta de eventos de build retornou lista vazia; não há preview READY e não foi possível determinar a causa mais específica.
- A inspeção foi estática no repositório. Não equivale a homologação visual renderizada em desktop/mobile.
- Pendente: reconciliação seletiva dos 12 commits da main; CI completa no HEAD reconciliado; preview e inspeção visual página por página; escuta real de Marianne/ambiência/Solfeggio; homologação InfinitePay em sandbox (checkout, confirmação e webhook).

**Sem alteração de código de produto, merge, publicação em produção ou cobrança real nesta rodada.**
