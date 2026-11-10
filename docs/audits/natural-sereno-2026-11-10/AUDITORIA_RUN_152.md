# Auditoria RUN 152 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD auditado antes da intervenção:** `d154668d9e819c777eeb345a0ae8ac42e59d6dd5`  
**PR:** #79 — aberta, draft.

## Corrigido

1. **Shell anterior à escolha dos estilos:** a folha global `src/index.css` aplicava fundos verde-floresta ao `#cura-main-layout`, cabeçalho e dock. Como `data-layout` permanece ausente até a confirmação explícita, esse shell legado ficava visível por trás do seletor. Criada `src/layout-choice-neutral-shell.css`, limitada a `:root:not([data-layout])`, com fundo creme/marfim, café e dourado refinado. O seletor passa a ocupar um canvas marfim quase opaco. Assim que o usuário confirma qualquer estilo, essa camada deixa de atuar; não altera os Estilos 1, 2, 3 ou 4 já selecionados nem suas prévias.
2. **Teste de regressão desatualizado:** `tests/natural-sereno-global-shell-guard.test.ts` esperava a borda antiga `rgba(184,135,54,.34)`, enquanto a regra aprovada já usa `rgba(200,157,82,.34)`. Alinhada a asserção ao CSS real e incluída proteção para o shell neutro anterior à escolha.
3. **Ordem de carregamento:** nova camada importada depois das quatro folhas finais de tema, mas seus seletores só correspondem quando não existe `data-layout`.

## Preservado

- Escolha sem pré-seleção e confirmação obrigatória dos quatro estilos.
- Paleta, paisagens, enquadramento, logo discreto, corpo neutro, player e animações do Natural Sereno.
- Voz neural/Marianne, política de não sobreposição do Solfeggio e sincronização do Diário; nenhuma lógica funcional foi alterada nesta rodada.
- InfinitePay e proteções server-side; nenhuma credencial foi criada, lida em texto claro ou modificada.
- Estilos 2, 3 e 4 permanecem sem alterações de tema; a nova camada só atua no estado sem estilo confirmado.

## Verificações de infraestrutura

- Vercel confirma namespace `UPSTASH_DB_KEY` exclusivo para Preview desta branch.
- Inventário sem descriptografia: `INFINITEPAY_HANDLE` existe em Production; `INFINITEPAY_API_KEY` não aparece cadastrada. Checkout não pode ser homologado até a chave ser provisionada.
- `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` constam como variáveis sensíveis em Production e Preview; seus valores e validade não foram inspecionados.
- `PUBLIC_APP_URL` para Preview desta branch não está configurada; existe apenas em Development (localhost) e Production.
- O deployment mais recente listado para a branch ainda aponta para commit anterior (`4ed440e`) e está em ERROR. Não há deployment para o HEAD auditado `d154668d9e819c777eeb345a0ae8ac42e59d6dd5`.

## Pendente

- Execução de CI no novo HEAD e validação de TypeScript/testes/build.
- Preview READY e inspeção renderizada página por página em desktop/mobile.
- Escuta real de Marianne, ambiência e Solfeggio; Diário ponta a ponta.
- InfinitePay sandbox, após configuração segura da API Key e URL de retorno isolada.
- Recuperar o PNG original `1001196520.png` para nova comparação pixel a pixel; a derivação versionada do repositório continua no card.
- Reconciliação seletiva dos 12 commits posteriores da `main`; nenhum merge foi realizado.

Nenhuma publicação em Production ou cobrança real foi realizada.
