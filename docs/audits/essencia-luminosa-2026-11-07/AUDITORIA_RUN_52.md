# Auditoria Estilo 3 — Essência Luminosa — Run 52

Referência visual oficial: prancha enviada por Everton nesta conversa (1001196521.png / file_0000000019d0820eb7a70b6c982619d6). A prancha orienta a atmosfera e a composição do card; decisões posteriores prevalecem, especialmente paleta atual, corpo neutro e logo discreto.

## Corrigido
- Adicionada a prancha oficial como asset de prévia em public/brand/essencia-luminosa/prancha-oficial.webp (derivação WebP 320 × 240 para o card, sem substituir a referência original).
- LayoutChoiceModal.tsx agora exibe a prancha própria da Essência Luminosa em object-contain, sem reutilizar a imagem do Natural Sereno ou de outro estilo.
- Corrigida a voz da Home: antes, Essência Luminosa caía no fallback Marcus e ignorava os controles salvos. Agora usa a voz salva (ou a voz oficial quando o perfil contém um alias legado) e respeita volume, velocidade e tom.
- Corrigidos, somente sob data-layout=essencia-luminosa, o texto amarelo-claro #f2e7c6 sobre fundo bege, o trilho escuro de progresso e o gradiente amarelo herdado. O CTA usa ouro suave e texto escuro legível.
- Incluído teste de regressão para prancha, confirmação explícita, voz e contraste da Home.

## Preservado
- Os quatro estilos e o fluxo de confirmação explícita. App.tsx mantém layoutConfirmedThisSession = false no início, remove data-layout antes da confirmação e só aplica o estilo após o servidor aceitar a escolha.
- Tokens atuais da Essência Luminosa: marfim #FFFFF8, champagne #F7F3E8, ouro suave #C6A46A, sálvia #A6B49B.
- Logo oficial como assinatura discreta (opacidade já aprovada de 30%, 26% em telas pequenas).
- Conteúdo, lógica da anamnese, recomendações, Diário, player, animações, Solfeggio, pagamentos e os demais estilos. A Reintegração da Vida permanece independente do tema.

## Pendente
- Executar npm run lint, npm test e npm run build em ambiente com dependências; esta sessão não dispõe de acesso de rede ao GitHub para clonar o projeto nem executar o build local.
- Fazer comparação visual real, página por página, em desktop e mobile; a prévia da prancha não substitui captura renderizada de cada tela.
- Testar em runtime a voz selecionada via ElevenLabs, Solfeggio durante transições do player, animações e interrupção de áudio ao abrir a Reintegração.
- Validar fluxo de checkout e confirmação InfinitePay em ambiente de teste, sem alterar preços, cupons ou regras aprovadas.
- A Home ainda precisa de conferência visual de integração de fotografias de natureza reais nas páginas, usando assets aprovados e sem reutilizar imagens exclusivas de outros estilos.