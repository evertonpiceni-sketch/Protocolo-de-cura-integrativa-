# Auditoria RUN 153 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD anterior:** `5feabb788dcf4113d9c6bd1f937412b57529cd26`  
**HEAD após as correções:** `909ce94045432200e071db7a8b50275a072edf0d`  
**PR:** #79 — aberta, draft, não mergeable.

## Corrigido

1. **Resíduo verde no estado anterior à escolha:** a camada RUN 152 neutralizava o fundo do painel, cabeçalho, dock e modal, mas ainda deixava passar o radial sálvia definido em `src/index.css` no `body::before`. Agora o estado sem `data-layout` usa apenas o canvas creme/marfim com luz dourada muito discreta.
2. **Scrollbar herdada:** o track ainda usava o verde quase preto global `rgba(2,17,13,.85)`. Foi substituído por marfim, com thumb dourado discreto, somente antes da confirmação de um estilo.
3. **Proteção de regressão:** ampliado `tests/natural-sereno-global-shell-guard.test.ts` para exigir o canvas neutro, o pseudo-elemento sem radial sálvia e a scrollbar sem o track verde antigo.

Arquivos alterados:
- `src/layout-choice-neutral-shell.css`
- `tests/natural-sereno-global-shell-guard.test.ts`

Commits:
- CSS: `e296304876095362c63c02e7d13d86a45cf85de9`
- Teste: `909ce94045432200e071db7a8b50275a072edf0d`

## Preservado e reauditoria estática

- Seletor React oficial, sem pré-seleção, com escolha e confirmação explícitas dos quatro estilos.
- Aplicação do tema somente após confirmação, por `document.documentElement.dataset.layout`.
- Prancha original `1001196520.png` (`file_00000000317c820ebaad657dc3680de5`) recuperada e inspecionada diretamente. A derivação `docs/visual-qa/natural-sereno/reference.jpg` do repositório apresenta visualmente a mesma prancha e permanece em `object-contain`, sem recorte no card do seletor. A prancha ainda contém elementos de uma versão anterior — chapas verde-floresta, dourados/amarelos mais fortes, corpo com chakras e componentes antigos. Esses elementos são referências históricas e NÃO devem ser reintroduzidos: prevalecem as decisões posteriores de base creme/marfim, verde apenas como acento natural, dourado refinado, corpo neutro e logo oficial sutil/transparente. A comparação foi visual; igualdade binária/pixel a pixel não foi medida.
- Paleta Natural Sereno, paisagens, enquadramentos, tipografia, CTAs e assinatura oficial discreta preservados.
- Corpo neutro, player e animações preservados.
- Código de voz neural/Marianne mantém `fallbackToSpeechSynthesis: false` no Natural Sereno.
- Política Solfeggio mantém a frequência tonal fora da narração; ambiência não tonal permanece permitida.
- Diário mantém sincronização vinculada à conta e escrita coerente de perfil/progresso.
- Arcanjo mantém abertura por ação explícita, sem abrir automaticamente após pagamento.
- InfinitePay mantém exigência de `INFINITEPAY_API_KEY`, `single_payment: true` e locks compartilhados.
- Nenhuma alteração de tema nos Estilos 2, 3 ou 4; a correção nova só corresponde quando `data-layout` está ausente.

A reauditoria desta rodada foi estática, por leitura dos arquivos e testes. Não foi possível executar a suíte local nem validar a renderização real.

## Pendente

1. **CI no HEAD atual:** `fetch_commit_workflow_runs` não retornou execução PR-triggered; o status combinado consultado contém apenas o check Vercel em falha. Testes, TypeScript e build ainda não estão comprovados para este HEAD.
2. **Vercel Preview:** o último check conhecido do HEAD anterior falhou; não há Preview READY confirmado para inspeção. Não forcei novo deployment.
3. QA visual renderizado página a página em desktop e mobile, incluindo recorte responsivo das paisagens, legibilidade e estados dos botões.
4. Escuta real da Marianne, ambiência, Solfeggio, pausa e retomada.
5. Diário ponta a ponta com persistência por conta.
6. InfinitePay sandbox, checkout, confirmação e webhook. A RUN 152 registrou ausência de `INFINITEPAY_API_KEY` no inventário do Vercel; essa variável não foi reconsultada nesta rodada.
7. Se necessário, fazer comparação automatizada de pixels entre o PNG original e a derivação JPEG; a inspeção visual já confirmou que representam a mesma prancha, mas não foi medida igualdade binária.
8. Reconciliação seletiva dos 12 commits posteriores da `main`. Não fazer merge/rebase automático: preservar as decisões aprovadas e revisar os conflitos de segurança, áudio e abertura explícita.

## Estado da entrega

- PR #79 aberta, draft e `mergeable=false`.
- Branch: 202 commits à frente e 12 atrás da `main` no momento da comparação.
- Sem merge, publicação em Production ou cobrança real.
- Nenhuma credencial foi lida em texto claro, criada ou modificada.
