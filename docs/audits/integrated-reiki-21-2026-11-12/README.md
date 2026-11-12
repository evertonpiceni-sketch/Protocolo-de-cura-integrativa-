# Jornada Integrada — 21 dias

Referência: prancha enviada pelo usuário, preservada em `public/brand/jornada-integrada-21-dias-aprovada.jpg`.

Implementados 21 dias e três ciclos, com títulos e intenções transcritos da prancha. Cada cena usa a região correspondente da imagem original via CSS, sem redesenhar ou substituir as figuras. A resolução disponível de cada figura é limitada pela prancha de 906 × 1280; a ampliação não produz detalhes novos.

O menu apresenta “Jornada Integrada — 21 dias”. O player e o painel de progresso usam os 21 dias, e a abertura pelo painel respeita o dia selecionado. O progresso usa um novo campo `integratedReiki21CompletedDays` e chaves locais próprias, preservando os registros do antigo percurso de sete chakras sem tratá-los como conclusão da nova jornada.

A narração inclui o título, ciclo e intenção do dia antes do roteiro integrado existente de Miguel, Chama Violeta e Rafael. A prancha não fornece 21 roteiros narrados completos nem novas frequências; os blocos narrados e a sequência semanal de frequências existentes foram preservados. Não foram inventados 21 roteiros “aprovados”.

Validação: TypeScript, 174 testes e build aprovados. Chromium percorreu todos os 21 dias nos quatro estilos, verificou 21 cenas distintas, o texto enviado à narração do Dia 21, pausa e conclusão. Capturas dos limites dos ciclos: dias 1, 7, 8, 14, 15 e 21. APIs de voz simuladas com áudio de teste; isso não resolve a indisponibilidade real de voz 503 anteriormente identificada.

PR #88 permanece em rascunho. Esta adaptação não equivale à publicação em produção nem à homologação visual completa das quatro Homes.
