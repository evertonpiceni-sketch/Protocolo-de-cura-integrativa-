# Auditoria RUN 151 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`

## Corrigido

- O fluxo de pagamento confirmado de `arcanjo_7d` ainda chamava `setShowArcanjoView(true)`, abrindo o protocolo automaticamente após a compra. Agora atualiza o perfil, fecha o modal de compra e mostra um aviso de acesso liberado. A abertura fica para a ação explícita do usuário pelo botão Arcanjo do painel ou pelo evento `OPEN_PROTOCOL_DAY`.
- Atualizado `tests/natural-sereno-arcanjo-explicit-open.test.ts` para proteger esse comportamento e garantir que as duas chamadas restantes de abertura correspondam somente ao evento explícito e ao botão do painel.
- Criado no Vercel um `UPSTASH_DB_KEY` exclusivo para Preview desta branch: `cura_integrada:database:preview:natural-sereno:2026-11-10`. A branch não tinha namespace próprio e poderia cair no namespace padrão compartilhado com Production. A nova variável isola os dados de homologação.

## Preservado e reauditado

- Seletor sem estilo pré-selecionado; a aplicação depende de escolha e confirmação explícitas.
- Paleta Natural Sereno: creme/marfim, café, dourado refinado e verde-sálvia apenas como acento.
- Paisagens realistas e referência versionada `docs/visual-qa/natural-sereno/reference.jpg`, exibida com `object-contain`.
- Logo oficial discreto/transparente; corpo neutro e movimento da luz no player.
- CSS de Natural Sereno restrito a `:root[data-layout="natural-sereno"]`; os estilos 2, 3 e 4 não foram alterados.
- Player principal sem fallback silencioso para SpeechSynthesis; Arcanjo exige ID ElevenLabs nos estilos que usam voz neural.
- Política Solfeggio sem sobreposição com narração; teste de sincronização atômica do Diário presente.
- InfinitePay continua exigindo API Key e `single_payment: true`; locks e confirmação server-side preservados.

**Verificação estática:** 14/14 invariantes consultados nesta rodada confirmados. Isso não substitui a execução da suíte automatizada nem a homologação renderizada.

## Pendente

- GitHub Actions não retornou execução associada ao HEAD atual `fc5d9a76133d93ac5ac21a8a9b5f45f75a202b1b`; a suíte `tsx --test`, TypeScript e build ainda não estão comprovados.
- O último deployment Vercel criado para a correção funcional (commit `4ed440e4c796153813e434f1efa18fdf397481f1`) terminou em `ERROR / BUILD_FAILED — Resource provisioning failed`; eventos de build retornaram vazios. O HEAD posterior de teste não possui Preview READY.
- Sem Preview READY, não foi possível fazer QA renderizado página a página em desktop/mobile nem testar áudio real, Diário ponta a ponta ou InfinitePay sandbox.
- A variável `INFINITEPAY_API_KEY` não existe no inventário de ambientes Vercel do projeto. `INFINITEPAY_HANDLE` está configurada em Production, mas não substitui a API Key. `PUBLIC_APP_URL` específica para Preview também não está configurada; não executei checkout.
- A busca pela Library nesta rodada não recuperou o PNG original `1001196520.png`; a derivação versionada do repositório permanece como referência do card. Não foi feita nova comparação pixel a pixel.
- Reconciliação seletiva com a `main` pendente: branch divergente, 193 commits à frente e 12 atrás.

Nenhum merge, publicação em Production, checkout ou pagamento real foi realizado.
