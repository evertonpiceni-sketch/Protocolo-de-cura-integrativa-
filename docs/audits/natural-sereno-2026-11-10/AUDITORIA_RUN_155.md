# Auditoria RUN 155 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho.

## Corrigido

1. **Voz da Reintegração:** `api/reintegration-tts.ts` utilizava o ID `21m00Tcm4TlvDq8ikWAM` (Rachel), enquanto o ID oficial do projeto é `mJqP14JQFEK0PojR5lfV` (Marianne). O endpoint agora usa o ID oficial. Como a assinatura da voz participa da chave de cache, o áudio antigo não é reutilizado. A política continua neural-only, sem fallback para voz do dispositivo.
2. **Shell de carregamento:** a tela anterior à escolha usava o fundo legado `#F8F4EC` e o ocre `#8F631E`. Corrigidos para creme `#FAF7F2` e dourado refinado `#A87E37`.
3. **Toast da aplicação:** o componente `.ep-app-toast` combinava fundo índigo/roxo escuro com texto café, criando contraste inadequado e uma chapa de outro estilo. A nova superfície marfim/café/dourado está isolada em `:root[data-layout="natural-sereno"]`; as demais identidades não são alteradas.

## Preservado e reauditoria

- Seletor dos quatro estilos continua sem pré-seleção, com prévias e confirmação explícita.
- Card da prancha oficial continua versionado em `docs/visual-qa/natural-sereno/reference.jpg`; decisões posteriores sobre paleta, corpo neutro e logo discreto continuam prevalecendo.
- Home ativa, acolhimento, Reintegração da Vida, paisagens, enquadramentos responsivos e assinatura transparente preservados.
- Player principal continua usando voz neural oficial; Arcanjo e oração exigem voz neural no Natural Sereno.
- Solfeggio continua bloqueado durante narração neural; ambiência não tonal permanece permitida.
- Diário mantém sincronização atômica por conta.
- Animações, corpo neutro e abertura explícita do Arcanjo preservados.
- InfinitePay mantém `single_payment`, API Key obrigatória, lock compartilhado e confirmação server-side de valor/transação. Nenhuma regra financeira foi alterada.

## Proteção de regressão

Criado `tests/natural-sereno-run155-voice-and-chrome.test.ts` com quatro verificações:
- Marianne oficial na rota da Reintegração, sem Rachel e sem fallback nativo;
- shell de carregamento creme/dourado;
- toast claro com contraste adequado e escopo Natural Sereno;
- seletor explícito sem aplicação automática.

Os testes foram adicionados ao script `npm test`, mas **não foram executados nesta sessão**. Não declarar CI, TypeScript ou build aprovados.

## Pendente

- GitHub Actions sem execução PR-triggered associada ao HEAD anterior; consultar novamente após os commits.
- Preview Vercel READY e inspeção renderizada de todas as páginas em desktop/mobile.
- Reprodução real da Marianne, ambiência e Solfeggio em dispositivos.
- Diário ponta a ponta.
- InfinitePay sandbox, checkout e webhook; nenhuma cobrança real.
- Comparação pixel a pixel com o PNG original; a derivação JPEG versionada permanece como referência no repositório.
- Reconciliação seletiva dos 12 commits posteriores da `main`; não fazer merge/rebase automático.

**Sem merge, publicação em Production ou alteração de credenciais.**
