# Auditoria RUN 160 — Estilo 1: Natural Sereno

**Data:** 10/11/2026 — 22:53 (America/Sao_Paulo)  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79

## Corrigido nesta rodada

1. **CTA da prévia Natural Sereno:** o pequeno botão “Iniciar jornada” dentro do card do seletor usava raio de 18px em uma altura curta, ficando visualmente em formato de pílula. Ajustado para `rounded-xl` (12px), mantendo borda dourada, gradiente aprovado e texto café. O CTA de confirmação principal já era retangular e permanece inalterado.
2. **Diário — limpeza de cascata:** removida uma regra antiga de hover que definia texto branco no botão Exportar. A regra posterior aprovada, com texto café, permanece como única declaração de hover.
3. **Regressão do seletor:** ampliado `tests/layout-choice-premium-cta.test.ts` para verificar também o CTA da prévia Natural Sereno, não apenas o botão de confirmação.
4. **Regressão do Diário:** ampliado `tests/natural-sereno-run159-diary-history-palette.test.ts` para verificar a superfície principal “Como estou agora”, seus textos e bordas em sálvia discreta, além dos pequenos estados semânticos de humor.

## Preservado e reauditorado no código

- Seletor dos quatro estilos sem pré-seleção; confirmação explícita antes de gravar/aplicar o tema.
- Prancha Natural Sereno em `docs/visual-qa/natural-sereno/reference.jpg`, exibida com `object-contain`; decisões posteriores de creme/marfim, café, dourado refinado, verde natural, corpo neutro e logo-assinatura discreto prevalecem sobre componentes antigos da prancha.
- Home Natural Sereno e enquadramento responsivo da paisagem em desktop/mobile.
- Marianne — ID `mJqP14JQFEK0PojR5lfV`; as duas rotas de voz da Reintegração verificam sessão autenticada, conta existente, trechos permitidos e limite por usuário. Não há fallback robótico silencioso.
- Política Solfeggio: frequências tonais não são reiniciadas como trilha de fundo durante narração; o protocolo possui controle explícito de áudio.
- Diário: conteúdo e categorias semânticas preservados; sincronização e exportação não foram alteradas.
- Player, movimento da luz, corpo neutro e animações preservados.
- O seletor React é o único fluxo montado; o seletor DOM legado não é importado.
- InfinitePay permanece fail-closed: API Key obrigatória para criar checkout, `single_payment: true`, autenticação, confirmação server-side e conferência do valor. Nenhuma rota, preço ou cupom financeiro foi alterado.
- Estilos 2, 3 e 4 não receberam alterações de tema.

## Infraestrutura e homologação pendentes

- GitHub Actions: nenhuma execução PR-triggered associada ao HEAD anterior desta rodada; após os novos commits, é necessário confirmar se o workflow foi disparado. Não declarar testes/TypeScript/build aprovados sem run concluído.
- Vercel: projeto `protocolodecuraintegrativa` informa `live=false`. O deployment Natural Sereno mais recente encontrado é do commit `683c208`, estado `ERROR / BUILD_FAILED — Resource provisioning failed`; eventos de build vieram vazios. Não há Preview READY para o HEAD atual.
- Variáveis consultadas sem descriptografar segredos: `INFINITEPAY_API_KEY` não consta no inventário; `INFINITEPAY_HANDLE` está somente em Production; `PUBLIC_APP_URL` não está configurada para a branch Preview atual. `UPSTASH_DB_KEY` exclusivo do Preview desta branch está configurado. `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` constam em Preview e Production; valores não foram lidos.
- Permanecem pendentes: QA renderizado página a página em desktop/mobile; escuta real de Marianne, ambiência e Solfeggio; Diário ponta a ponta; teste sandbox e webhook InfinitePay.
- A comparação visual renderizada com a prancha original permanece condicionada à recuperação de Preview funcional.

## Estado de integração

A PR #79 continua em rascunho. A comparação atual indica 243 commits à frente e 12 atrás de `main`; não fazer merge/rebase automático. Nenhum merge, publicação em Production ou pagamento real foi realizado.

## Commits desta rodada

- `ee83e39396cd57aa9e4d232e765953e172c2c80b` — `src/components/LayoutChoiceModal.tsx`
- `78623abb92d0cb722e0c07ab7b22c72a0c7c70bf` — `src/natural-sereno-approved-overrides.css`
- `76a6dd0f4b58d6485b8734e7c75abb4336cdb311` — `tests/layout-choice-premium-cta.test.ts`
- `10cbad3280b90bdc1c6809d273731ef6a5f11f1f` — `tests/natural-sereno-run159-diary-history-palette.test.ts`
