# Reauditoria — Estilo 1: Natural Sereno
**Data:** 07/11/2026  
**Branch:** `fix/natural-sereno-visual-audit-2026-11-07-v2`  
**PR:** #55

## Corrigido nesta rodada
- Resolvido o apontamento de revisão do painel administrativo: o CTA de WhatsApp é um link `<a>`, não um botão. O override de Natural Sereno agora cobre `:is(button,a)` para as ações emerald, incluindo texto e ícone. O thread de revisão foi marcado como resolvido.
- Reconciliado `ProfileSetup.tsx` com a versão mais recente já aprovada em `main`: essa versão posterior removeu a prévia de voz pré-login e, com ela, o alias `Rachel` e o fallback para `SpeechSynthesis`. A branch não reintroduz o fluxo antigo.
- Preservados `voiceType` e `preferredVoiceGender` no cadastro; a escolha neural efetiva continua no fluxo autenticado de Ajustes de Áudio, que mantém IDs ElevenLabs válidos salvos.
- Atualizados os testes de regressão para cobrir o link de WhatsApp e impedir o retorno de aliases/fallbacks de voz do dispositivo no cadastro.

## Preservado
- Os quatro estilos continuam com escolha explícita e confirmação antes da aplicação; preferência salva não equivale a confirmação.
- A prancha oficial do Natural Sereno permanece versionada e vinculada à prévia do seletor.
- Paleta creme/marfim, café, dourado refinado e verde-sálvia apenas como acento; paisagem realista e regras de enquadramento responsivo preservadas.
- Logo oficial permanece assinatura sutil/transparente.
- IDs ElevenLabs válidos já salvos no perfil continuam preservados nos fluxos autenticados; o fallback canônico só cobre ausência/alias inválido.
- Diário, player, animação, política de Solfeggio e checkout InfinitePay não tiveram alteração funcional nesta rodada.

## Pendente
- O ID neural personalizado que Everton escolheu não aparece comprovado no histórico recuperado nem pode ser inferido do repositório. O fluxo autenticado preserva IDs ElevenLabs válidos salvos e usa `OFFICIAL_PROTOCOL_VOICE_ID` como fallback canônico quando necessário. A reprodução real ainda precisa ser ouvida no navegador.
- Homologação visual renderizada, página por página, em desktop e mobile continua pendente. O deploy de preview anterior falhou por limite diário da Vercel (`api-deployments-free-per-day`, mais de 100 deployments); não foi possível validar o branch no navegador.
- Checkout InfinitePay ainda requer teste em ambiente de teste, sem cobrança real.
- A verificação de dependências permanece bloqueada: a execução 1424 passou TypeScript, regressões (106/106), build, smoke tests e verificações dos endpoints, mas falhou no gate `npm audit --audit-level=moderate` com 9 vulnerabilidades (3 moderadas e 6 altas). Nenhuma dependência foi atualizada fora do escopo.
- O relatório RUN_21 continua como registro histórico da rodada anterior; esta reauditoria não o sobrescreve.

## Estado da validação
- As alterações desta rodada foram gravadas na branch e o apontamento inline foi resolvido.
- A CI correspondente ao commit mais recente ainda não foi observada nesta consulta; não declarar os novos testes aprovados até a conclusão de uma execução posterior.

**Status:** correções pontuais aplicadas; Estilo 1 ainda não está homologado integralmente.
