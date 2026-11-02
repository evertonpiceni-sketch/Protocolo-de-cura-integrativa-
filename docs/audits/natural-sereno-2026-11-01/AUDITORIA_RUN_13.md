# Auditoria — Estilo 1 Natural Sereno — Run 13

## Corrigido / consolidado nesta rodada
- Reauditoria estrutural do fluxo inicial confirmou que a escolha explícita dos quatro estilos ainda não está implementada corretamente: `src/App.tsx` monta `LayoutChoiceModal` apenas quando `userProfile.visualLayout` está vazio. Um perfil com preferência persistida continua pulando a escolha. A correção correta é separar **preferência persistida** de **confirmação da escolha na sessão**, preservando o valor salvo até o usuário confirmar.
- Reauditoria cromática encontrou heranças de `#073B2B` ainda ativas em fontes do Natural Sereno, especialmente `src/lib/naturalSerenoHomeApprovedModel.ts`, `src/natural-sereno.css`, `src/natural-sereno-mobile-fixes.css`, `src/natural-sereno-refinement.css` e componentes compartilhados. Não foi feita substituição global, pois isso alteraria estados semânticos e outros estilos; a limpeza deve continuar no componente proprietário e sob `data-layout="natural-sereno"`.
- A home ainda contém regras antigas que transformam verde escuro em superfície/CTA e até uma faixa final verde escura. Isso conflita com a decisão vigente: creme/marfim como base, café/marrom como texto/estrutura, dourado refinado como ação premium e verde somente como acento natural.

## Preservado
- Confirmação de pagamento server-side em `/api/payment/confirm`: perfil só é atualizado quando o retorno é `paid`; `pending` mantém retry controlado.
- Proteção de áudio da Reintegração: ao abrir, fala e background global são interrompidos; a música global não deve tocar durante sessão/jornada.
- Logo oficial como assinatura sutil/transparente; não aumentar contraste/opacidade.
- Conteúdo terapêutico, Diário, progresso e jornadas não foram alterados sem regressão comprovada.

## Pendente prioritário
1. Corrigir `App.tsx` para exibir o seletor dos quatro estilos explicitamente antes da aplicação automática, mesmo quando existe `visualLayout` persistido, sem apagar a preferência salva.
2. Remover da home as grandes superfícies verdes herdadas em `naturalSerenoHomeApprovedModel.ts`, preservando a fotografia realista e substituindo superfícies/CTAs por creme, café e dourado refinado.
3. Limpar `#073B2B` nas folhas antigas do Natural Sereno somente onde ele atua como chapa/superfície; manter verde apenas como acento natural e estados semânticos comprovados.
4. Validar renderização real desktop/mobile das paisagens após a limpeza; não aceitar imagem desproporcional, recortada de modo incoerente ou incapaz de acompanhar a altura/largura da página.
5. Voz: não substituir por nome/ID não comprovado. Manter pendente até confirmar no código a voz feminina BR aprovada; remover fallback robótico somente com rota oficial validada.
6. Animação da Reintegração: validar contra a micro-narrativa congelada — corpo neutro, movimento da luz, atuação na região do dia, integração e maior presença — com logo discreto.

## Critério de fechamento
Natural Sereno só pode ser congelado quando o seletor explícito estiver funcional, não houver grandes chapas verdes/amarelas herdadas, desktop e mobile estiverem proporcionais, voz/animação estiverem no aprovado e a reauditoria não encontrar regressões em áudio, Diário, player ou pagamento.
