# AUDITORIA RUN 156 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho; sem merge.

## Corrigido nesta rodada

1. **Cabeçalho:** o logo oficial do cabeçalho deixa de aparecer dentro de um disco com fundo, borda e halo. A imagem continua como assinatura de baixa opacidade. A legenda que usava o amarelo antigo passa a usar dourado refinado.
2. **Atalho Arcanjo:** removida a herança azul do botão do cabeçalho; agora usa superfície marfim, borda dourada discreta e texto café.
3. **Diário:** o cartão “Como estou agora” não usa mais a superfície esmeralda ampla. A superfície passou a creme/marfim, com sálvia somente em pequenos rótulos de estado. O botão Exportar usa dourado refinado, texto café e acabamento retangular premium.
4. **Barra do navegador:** o fallback de `theme-color` antes da confirmação agora é `#FAF7F2`, alinhado ao shell neutro e à base do Natural Sereno.

As novas regras estão isoladas em `:root[data-layout="natural-sereno"]`. Não alteram os Estilos 2, 3 e 4, nem o conteúdo, a lógica do Diário ou a lógica de acesso ao Arcanjo.

## Reauditoria e proteção

Foi criado `tests/natural-sereno-run156-header-diary.test.ts` com seis casos para proteger:
- fallback marfim do navegador;
- assinatura transparente do logo;
- atalho Arcanjo sem azul;
- cartão de estado do Diário sem chapa esmeralda;
- botão Exportar premium;
- isolamento de todas as novas regras no Natural Sereno.

**Limitação:** os testes foram adicionados, mas não executados pelo runner nesta rodada. Não declarar CI, TypeScript ou build aprovados.

## Preservado

- Seletor dos quatro estilos sem pré-seleção, com prévias e confirmação explícita antes de aplicar `data-layout`.
- Card de referência versionado em `docs/visual-qa/natural-sereno/reference.jpg`; decisões posteriores de paleta, corpo neutro e logo discreto prevalecem.
- Home ativa, paisagens responsivas, acolhimento, Reintegração, movimento da luz e animações.
- Marianne/ElevenLabs na rota ativa da Reintegração (`mJqP14JQFEK0PojR5lfV`); sem fallback robótico no fluxo neural.
- Política de não sobrepor Solfeggio à narração.
- Sincronização atômica do Diário vinculada à conta.
- Arcanjo com corpo neutro e abertura somente por ação explícita.
- InfinitePay com pagamento único e validação server-side; nenhuma regra de preço ou cupom foi alterada.
- Estilos 2, 3 e 4 sem alteração de tema nesta rodada.

## Pendências e bloqueios

- **Referência original:** a busca pela Library pelo arquivo exato `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` não retornou o original nesta execução. A derivação versionada no repositório foi preservada; não foi substituída por outra prancha.
- **CI:** nenhuma execução GitHub Actions associada ao HEAD desta rodada foi encontrada.
- **Vercel:** projeto `protocolodecuraintegrativa` reporta `live:false`. O último deployment global consultado pertence ao branch Místico Moderno e falhou com `BUILD_FAILED — Resource provisioning failed`; o último deployment listado do branch Natural Sereno (`dpl_BKL7zKDD9M2wVeV8SLKHzHkgtci3`, commit `b7f0f62`) também falhou com o mesmo erro e não trouxe eventos de build. Não há Preview READY do HEAD atual.
- **InfinitePay:** a listagem de variáveis não contém `INFINITEPAY_API_KEY`; `INFINITEPAY_HANDLE` está apenas em Production. `PUBLIC_APP_URL` não está configurada para o Preview desta branch. O checkout permanece fail-closed; sem sandbox, webhook ou cobrança real.
- **QA renderizado:** inspeção página a página em desktop/mobile e comparação pixel a pixel com o PNG original aguardam Preview funcional.
- **QA funcional:** reprodução real de Marianne/Solfeggio, Diário ponta a ponta e checkout sandbox permanecem pendentes.
- **Mainline:** manter reconciliação seletiva dos 12 commits posteriores da `main`; não fazer merge/rebase automático.

## Commits desta rodada

- CSS do cabeçalho e Diário: `e3303323826a455da485f80ec414b2ebf23937b9`
- fallback marfim do navegador: `e8eb4a8b423f0d5e621e647b18c101370e94a259`
- teste de regressão: `d8711d945cbb45e3252554718b1f87d66b06e8a7`

Sem merge, sem publicação em Production e sem cobrança real.
