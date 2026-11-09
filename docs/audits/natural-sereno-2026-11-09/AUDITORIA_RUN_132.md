# Auditoria RUN 132 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código auditado:** `784ced54429eb428b76a18e2cb4a35c4277506ea`  
**PR:** #79 — aberta, em rascunho, `mergeable=false`.

## Corrigido

1. **Fundos dourados que estavam ficando opacos.** O bridge compartilhado de `approved-theme.css` usa o seletor amplo `[class*="bg-[#B88736]"]`; ele também alcançava classes com alpha (`/8`, `/10`, `/12`, `/15`, `/20`) e podia transformar realces translúcidos em chapas sólidas. A camada final do Natural Sereno agora preserva cada transparência com o dourado aprovado `#C89D52`, sem alterar os outros estilos.
2. **Teste visual desatualizado.** `natural-sereno-visual-guardrails.test.ts` ainda exigia `#B88736` e texto branco no marcador do dia, embora o CSS vigente já use `#C89D52` e texto café `#2A2421`. Atualizei a expectativa e acrescentei um teste para os cinco níveis de alpha.
3. **CTAs compartilhados.** Os botões ativos de `AudioSettingsModal` e das configurações ainda herdavam texto branco, raio de 12px e hover `#8F631E`. No Natural Sereno, agora usam gradiente `#E2B96B → #C89D52`, texto café, raio de 18px e hover `#A87E37`. As variantes de borda com alpha (`/15` a `/55`) e o texto `/60` também preservam a transparência original, em vez de virarem ouro opaco pelo bridge global.

Arquivos alterados:
- `src/natural-sereno-approved-overrides.css`
- `tests/natural-sereno-visual-guardrails.test.ts`

## Preservado

- A prancha oficial continua no card via `docs/visual-qa/natural-sereno/reference.jpg`, derivação visualmente correspondente ao original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`; a miniatura usa `object-contain`, enquanto a fotografia da prévia usa `object-cover`. As decisões posteriores de paleta, corpo neutro e logo discreto prevalecem sobre elementos antigos da prancha.
- Paleta creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento.
- Quatro paisagens reais versionadas e enquadramentos separados para desktop/mobile.
- Logo como assinatura discreta (30% desktop / 26% mobile).
- Seletor React sem pré-seleção; o tema só é aplicado após escolha, confirmação e persistência.
- Corpo neutro e player; voz neural exige ID ElevenLabs explícito e não usa voz nativa como fallback no Natural Sereno.
- Solfeggio subordinado à reprodução real da narração; Diário e sincronização por conta; animações e respiração 4–3–5.
- InfinitePay com validação server-side e bloqueio de checkout fora de produção enquanto não houver sandbox.
- Estilos 2, 3 e 4 sem redesenho ou alteração comercial.

## Reauditoria desta rodada

- Conferência estática dos novos seletores, dos cinco níveis de transparência de fundo, quatorze níveis de transparência de borda, marcador do dia, CTAs de áudio/configurações e ordem de imports: aprovada.
- Os arquivos de paisagem, ícones neutros e a prancha JPEG versionada existem na branch.
- O fluxo de seleção remove `data-layout` até a confirmação explícita.
- A narração do Arcanjo usa `requireExplicitVoiceId`; se a voz neural não estiver disponível, informa erro e não inicia a voz nativa.
- O guardião Solfeggio, sincronização por conta e bloqueio de pagamentos em preview permanecem presentes.
- **Não há GitHub Actions associada ao HEAD de código desta rodada**; não declaro a suíte completa, TypeScript ou build aprovados.
- O deployment Vercel ligado ao commit `bcfe466` terminou em `ERROR / BUILD_FAILED — Resource provisioning failed`. A consulta de eventos de build retornou vazia; não há preview READY nem evidência suficiente para atribuir a falha ao código.

## Pendências

1. Preview navegável e inspeção renderizada página por página em desktop e mobile, incluindo recortes de paisagens, tipografia, botões e alinhamento do player.
2. Escuta real de Marianne, Solfeggio e ambiência; testar pausa, retomada, término e falha em navegador/dispositivo.
3. Homologar InfinitePay em sandbox: checkout, confirmação e webhook. Nenhuma cobrança foi realizada.
4. Reconciliar os **9 commits posteriores de `main`** sem atualização cega. Há mudanças compartilhadas em `App.tsx` e `ArcanjoProtocolView.tsx`, além de trabalho aprovado da Elegância Profunda; portar condicionalmente e preservar os estilos 2/3 e os guardas de sincronização por conta.

## Estado da entrega

- PR #79 aberta e em rascunho.
- Branch: **115 commits à frente e 9 atrás** de `main`; `mergeable=false`.
- Sem merge, publicação em produção ou cobrança real.
