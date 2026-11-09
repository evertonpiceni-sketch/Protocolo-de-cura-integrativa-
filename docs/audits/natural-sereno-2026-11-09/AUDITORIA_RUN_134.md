# Auditoria RUN 134 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código:** `b112034d7e5cadd70e110cff7b93a0a39e7d1b59`  
**PR:** #79, aberta em rascunho.

## Corrigido

1. **CTA “Enviar Feedback” da Anamnese ainda herdava verde-floresta.**  
   O componente `AnamnesisModal.tsx` usa `bg-emerald-600 hover:bg-emerald-500 text-white` no botão de envio. A camada `natural-sereno-refinement.css` continha uma regra com a mesma especificidade que forçava `var(--ns-modal-forest)` e texto branco. A regra geral posterior de dourado não conseguia vencê-la por especificidade.

2. **Correção na camada final aprovada.**  
   Em `natural-sereno-approved-overrides.css`, acrescentei uma regra de igual especificidade, carregada depois das camadas anteriores, restrita a:
   `data-layout="natural-sereno" #anamnesis-modal #anamnesis-feedback-area`.
   O botão ativo agora usa gradiente `#E2B96B → #C89D52`, texto café `#2A2421`, contorno `#A87E37`, raio de 18px e hover dourado escuro. O estado desabilitado não foi alterado.

3. **Proteção contra regressão.**  
   Ampliei `tests/natural-sereno-modal-palette-guard.test.ts` para confirmar a presença do CTA legado e exigir o override final, incluindo hover, texto café e ausência da variável verde-floresta/texto branco.

## Preservado

- Card da prancha de referência, miniatura `object-contain` e cópia versionada `docs/visual-qa/natural-sereno/reference.jpg`. O código mantém as referências textuais ao arquivo `1001196520.png` e ao identificador `file_00000000317c820ebaad657dc3680de5`; o PNG original não foi recuperado independentemente nesta rodada.
- Creme/marfim, café/marrom, dourado refinado e verde-sálvia somente como acento natural.
- Paisagens, enquadramentos responsivos, tipografia, botões premium e logo oficial sutil/transparente.
- Seletor dos quatro estilos sem pré-seleção e com confirmação explícita.
- Voz neural, política Solfeggio, Diário/sincronização por conta, player, corpo neutro e animações.
- Estilos 2, 3 e 4 sem redesenho ou alteração nesta rodada.
- Regras comerciais, preços e cupons existentes; nenhuma cobrança foi feita.

## Reauditoria e limites

- Conferidos o JSX do CTA, a regra antiga de mesma especificidade, o novo override e a ordem de importação em `src/main.tsx`: o override Natural Sereno é o último CSS do Estilo 1; as camadas posteriores dos Estilos 2 e 3 permanecem escopadas.
- A correção foi verificada estaticamente nos arquivos do branch.
- **Não há GitHub Actions associada ao HEAD atual** e o status combinado retornou apenas o check Vercel em falha. Não declarar testes, TypeScript ou build aprovados nesta rodada.
- O deployment mais recente listado para a branch é o commit anterior `bcfe46678fa7fa32fc8a4665140fa2f4cf998b05`, em estado `ERROR / BUILD_FAILED — Resource provisioning failed`; os eventos de build retornaram vazios. Não há preview READY confirmado para o HEAD atual.
- Não houve merge, publicação em produção ou cobrança.

## Pendências prioritárias

1. **Reconciliação com `main`:** a branch está 11 commits atrás e 121 à frente. A `main` contém hardening posterior de pagamentos e persistência: API Key obrigatória da InfinitePay, locks compartilhados, refresh do snapshot Redis, deduplicação/recuperação de checkouts e locks em cadastro, sincronização e bootstrap administrativo. Portar essas proteções preservando a regra desta branch que bloqueia pagamentos reais fora de produção enquanto não houver sandbox, além das validações de sessão/conta. Não fazer atualização cega.
2. Preview navegável e homologação visual renderizada página a página em desktop e mobile.
3. Escuta real da voz neural, Solfeggio e ambiência; testar pausa, retomada, término e falha em dispositivo.
4. InfinitePay sandbox: checkout, confirmação e webhook.
5. Recuperar/inspecionar independentemente o PNG original da prancha, se necessário para confirmar identidade do asset.

## Estado

- PR #79 aberta, em rascunho e `mergeable=false`.
- 121 commits à frente e 11 atrás de `main`.
- Sem merge, publicação em produção ou cobrança real.
