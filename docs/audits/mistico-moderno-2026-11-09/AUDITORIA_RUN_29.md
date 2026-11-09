# Auditoria Estilo 4 — Místico Moderno — Run 29

**Data:** 09/11/2026  
**Branch:** `fix/mistico-moderno-run15-mainline-2026-11-09`  
**Commit de código validado:** `64b8403a07713bd7641db05d0d2bc166e2eac899`  
**PR:** #77 — aberto, em rascunho, sem merge.

## Corrigido nesta rodada

- Identificada uma herança anterior à escolha: `src/index.css` aplicava diretamente ao shell do app fundos verde-floresta, cabeçalho e dock escuros, mesmo sem `data-layout`. O atributo não era ativado, mas a interface por trás do seletor ainda recebia o tratamento global antigo.
- Criado `src/prestyle-neutral.css`, importado depois de todas as camadas dos quatro estilos. A folha neutraliza apenas o shell de `#cura-main-layout` enquanto `:root:not([data-layout])` for verdadeiro.
- Neutralizados cabeçalho, dock, superfícies compartilhadas do app, Ajustes, hero da Home, campos e CTAs antes da confirmação.
- A assinatura do logo no cabeçalho permanece discreta (opacidade de 30%) também no estado de escolha.
- A folha não altera a experiência pública da Reintegração nem os componentes do Arcanjo/checkout.
- Criado `tests/layout-choice-neutral-state.test.ts` com três regressões: confirmação explícita, neutralidade pré-seleção e proteção da Reintegração pública.

## Preservado e reauditoria estrutural

- Seletor React único; quatro estilos; seleção inicial nula; confirmação desabilitada até selecionar; preferência só é confirmada depois da resposta bem-sucedida do servidor; logout exige nova escolha.
- A prancha derivada `public/brand/mistico-moderno/prancha-oficial-card.webp` permanece no card, com proporção 4:3 e `object-contain`. A busca na Library por `1001196522.png` e pelo identificador informado não encontrou o PNG original; não foi declarada comparação pixel a pixel nesta rodada.
- Revalidadas as 25 folhas CSS do Místico Moderno: **408 seletores analisados, todos escopados** a `data-layout="mistico-moderno"`.
- As 12 superfícies continuam verificadas estruturalmente; a inspeção visual renderizada permanece pendente.
- Voz neural salva sem fallback robótico, sincronização de Solfeggio, propriedade de áudio do Arcanjo, Diário fechado por padrão, player e `prefers-reduced-motion` preservados.
- Jornada de 21 dias, corpo neutro, logo oficial sutil e Estilos 1–3 preservados.
- Nenhum arquivo de pagamento consta entre os 43 arquivos alterados do PR.

## Reauditoria técnica

GitHub Actions **Security Audit #2174: sucesso** no commit de código `64b8403a07713bd7641db05d0d2bc166e2eac899`:
- **185 testes aprovados, 0 falhas**.
- `npm audit`: 0 vulnerabilidades.
- TypeScript, build, entry points, segurança/JWT/admin, smoke tests e verificações fail-closed dos endpoints de pagamento aprovados.

Execução: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42668092823

## Pendente

1. Vercel: o check do HEAD continua em falha por `build-rate-limit`; sem preview renderizada para homologar as 12 superfícies em desktop e celular.
2. Comparação pixel a pixel com o PNG original: arquivo original não localizado na Library nesta rodada; a miniatura derivada continua versionada.
3. Teste auditivo real da voz salva e do Solfeggio em dispositivo.
4. Checkout e webhook InfinitePay em sandbox; nenhuma cobrança real foi feita.

## Estado

- PR #77 aberto, em rascunho e tecnicamente integrável.
- 60 commits à frente e 0 atrás da `main` no momento do registro.
- Sem merge, sem publicação em produção e sem cobrança real.
