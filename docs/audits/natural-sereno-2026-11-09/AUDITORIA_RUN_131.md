# Auditoria RUN 131 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD após as correções:** `ac4feecff47c26a693078da7bf6787a36ad345d7`  
**PR:** #79 — aberta, em rascunho, `mergeable=false`.

## Corrigido

Foi encontrada uma herança ativa de dourado antigo no seletor de aparência:

- No modal inicial dos quatro estilos, a borda, o anel de foco, o marcador de seleção e o foco do botão de confirmação do Natural Sereno ainda usavam `#B88736`.
- No seletor de aparência dentro das configurações, o card Natural Sereno também usava `#B88736` na borda e no foco.

Correção restrita ao Natural Sereno:
- seleção e foco agora usam `#C89D52`;
- marcador usa `#C89D52` com contorno `#A87E37` e texto café;
- CTA de confirmação mantém gradiente `#E2B96B → #C89D52 → #A87E37` e foco refinado;
- os estilos 2, 3 e 4 mantêm seus tratamentos anteriores.

Adicionado teste de regressão em `tests/natural-sereno-layout-reference.test.ts`, cobrindo os dois seletores.

## Preservado

- Prancha de referência continua no card com `object-contain`; a foto principal da prévia continua com `object-cover`.
- O relatório RUN 130 registra a recuperação/inspeção do original `1001196520(2).png` pelo identificador informado e a comparação visual com a derivação JPEG versionada em `docs/visual-qa/natural-sereno/reference.jpg`. A consulta atual da Biblioteca não retornou uma segunda cópia independente; não foi criada arte substituta.
- Os quatro estilos continuam sem pré-seleção e exigem escolha e confirmação explícitas.
- Creme/marfim, café/marrom, dourado refinado e sálvia como acento; paisagens realistas e arquivos `vale-amanhecer.webp`, `cachoeira.webp`, `presenca.webp` e `acolhimento.webp` existem na branch.
- Logo oficial discreto/transparente, corpo neutro, player, voz neural, política Solfeggio, Diário, animações, respiração 4–3–5 e regras comerciais InfinitePay foram preservados.
- Estilos 2, 3 e 4 não foram redesenhados.

## Reauditoria técnica

- A ordem de imports mantém `natural-sereno-approved-overrides.css` como última camada do Estilo 1; os overrides posteriores dos Estilos 2 e 3 permanecem escopados aos respectivos layouts.
- Arquivos de tema inspecionados nesta rodada: `index.css`, `approved-theme.css` e as camadas Natural Sereno `natural-sereno.css`, `natural-sereno-refinement.css`, `natural-sereno-mobile-fixes.css`, `natural-sereno-final-audit.css`, `natural-sereno-home-surface-audit.css`, `natural-sereno-legacy-green-audit.css`, `natural-sereno-milestone-audit.css` e `natural-sereno-approved-overrides.css`.
- Os arquivos de paisagem e ícones neutros referenciados pelo código foram confirmados na branch.
- **Não há GitHub Actions associada ao HEAD atual**. O status combinado disponível contém apenas o check Vercel em falha por `build-rate-limit`. Não declaro testes, TypeScript ou build aprovados para este HEAD.
- Não há preview READY; portanto, não foi possível fazer inspeção renderizada página a página em desktop/mobile.

## Pendências

1. Recuperar preview navegável e realizar inspeção visual renderizada em desktop e mobile, incluindo recortes das paisagens e alinhamento do player.
2. Escutar Marianne, Solfeggio e ambiência; testar pausa, retomada, término e falha em navegador/dispositivo.
3. Homologar InfinitePay em sandbox, checkout, confirmação e webhook. Nenhuma cobrança foi realizada.
4. Reconciliar os **9 commits posteriores de `main`** sem atualização cega: há mudanças compartilhadas em `App.tsx` e `ArcanjoProtocolView.tsx`, além de trabalho aprovado da Elegância Profunda. Preservar os guardas de sincronização por conta e a voz/corpo neutros do Natural Sereno.

## Estado da entrega

- PR #79 aberta e em rascunho; `mergeable=false`.
- Branch: **104 commits à frente e 9 atrás** de `main`.
- Sem merge, publicação em produção ou cobrança real.
