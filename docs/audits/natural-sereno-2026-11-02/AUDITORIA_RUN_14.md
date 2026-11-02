# Auditoria — Estilo 1 Natural Sereno — Run 14

## Corrigido / consolidado nesta rodada
- Reauditoria página por página retomada pela Home e fluxo de entrada.
- Confirmado que o Natural Sereno deve permanecer com base creme/marfim, café/marrom, dourado refinado e verde apenas como acento natural.
- Registrada como regressão ativa a implementação da Home em `src/lib/naturalSerenoHomeApprovedModel.ts`: ainda há CTA principal com `background: #073b2b`, menu com grande superfície verde e fechamento da Home em gradiente verde escuro. Esses blocos não atendem à decisão posterior de remover grandes chapas verdes.
- Confirmado que a paisagem realista permanece como fundo da Home e deve ser preservada; a correção deve retirar a dominância verde sem remover a natureza.

## Preservado
- Pagamento: `src/App.tsx` continua exigindo confirmação server-side com `data.status === 'paid'` antes de atualizar o perfil.
- Solfeggio/áudio: a Reintegração continua chamando `audioEngine.stopSpeech()` e `audioEngine.stopBG()` ao abrir, evitando sobreposição do áudio global.
- Logo: permanece a regra congelada de assinatura visual sutil/transparente; não deve ser fortalecido nem transformado em elemento dominante.
- Diário, progresso, conteúdo terapêutico e gates da jornada não foram alterados sem regressão comprovada.

## Pendente comprovado
1. **Seletor dos quatro estilos — prioridade estrutural:** `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`. Perfil com estilo persistido continua podendo entrar sem escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno. A correção deve separar preferência persistida de confirmação da escolha da sessão.
2. **Home Natural Sereno:** retirar as grandes superfícies `#073b2b` do CTA/menu/fechamento em `naturalSerenoHomeApprovedModel.ts`, mantendo natureza realista e convertendo superfícies dominantes para creme/marfim + café + dourado; verde apenas em acentos naturais.
3. **Paisagem desktop/mobile:** validar renderização real em ambas as larguras após a limpeza da Home; não mascarar proporção com recorte agressivo.
4. **Voz:** validar o ID/voz oficial aprovada antes de remover ou substituir fallback; não inventar equivalência entre aliases existentes e a voz escolhida.
5. **Animação terapêutica:** validar contra a micro-narrativa aprovada da Reintegração antes de alterar implementação.

## Regra de intervenção
Não fazer substituição global de `#073b2b`: existem usos semânticos e acentos que podem continuar válidos. Corrigir no componente proprietário e reauditar depois de cada mudança. O Estilo 1 ainda não deve ser congelado como concluído.