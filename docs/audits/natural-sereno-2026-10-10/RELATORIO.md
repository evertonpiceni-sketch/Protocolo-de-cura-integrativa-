# Natural Sereno — varredura adicional de heranças — 10/10/2026

Esta rodada complementa a auditoria de 07/10. Não certifica a reprodução integral das 12 telas nem encerra o Estilo 1.

## Correções

- Removido o corpo vetorial e as animações em loop remanescentes no estúdio visual. A prévia usa a presença humana existente em estado inicial escuro, sem simular um vídeo aprovado. A interface informa que o vídeo específico ainda está em preparação.
- Corrigidos os enquadramentos vertical, horizontal e quadrado da prévia, sem deformar o corpo.
- Estúdio com identificação de diálogo, foco contido, Escape e estado acessível dos seletores de formato e dia.
- Removidos emojis remanescentes em certificados, planos, tratamentos e resultados de astrologia e numerologia. Textos, valores e ações preservados. A tela de erro utiliza ícone vetorial coerente.
- Corrigido contraste de legendas, botões selecionados e critério de aprovação do estúdio após a primeira nova auditoria detectar falhas.

## Verificação

Lint, 23 testes e build passaram. A suíte geral do navegador concluiu as 18 verificações, incluindo estados responsivos, navegação, cadastro/login e isolamento dos outros três temas. A suíte de correções passou. Os testes de navegador usam dados sintéticos e não validam criação de conta na produção.

O estúdio foi aberto por acionamento do controle no DOM; o botão Próximo dia foi acionado pelo navegador. Confirmadas ausência do SVG infantil na prévia, mudança para dia 2 e saída com Escape. Portanto, essa verificação não certifica a descoberta/acessibilidade visual do botão de entrada no estúdio.

## Pendências que impedem finalizar o Estilo 1

Permanecem as pendências registradas em 07/10: vídeos específicos dos 21 dias, correspondência editorial integral dos roteiros do Protocolo, logo oficial com transparência real, cadastro/login completo no ambiente publicado e comparação final de todas as telas auxiliares com a referência. A fonte recuperada da Jornada Integrada tem estrutura diferente da jornada atual; não foi aplicada como substituição automática.

Nenhuma alteração de preços, pagamento, APIs ou jornada nesta rodada. Produção não atualizada por esta varredura. Estilos 2, 3 e 4 não iniciados.

## Continuação — recuperação do cadastro

Corrigido o bloqueio do formulário após sucesso: o botão permanece indisponível até a entrada no app, evitando um segundo cadastro durante a mensagem de confirmação. Falhas liberam a tentativa e preservam os campos. O login agora distingue indisponibilidade do servidor de problemas de credenciais, inclusive quando a resposta de erro não é JSON.

O teste de navegador `scripts/verify-registration-recovery.mjs` passou com fixtures locais: erro 503 e nova tentativa, criação bem-sucedida com três falhas de sincronização do perfil sem repetir o cadastro, bloqueio durante a transição, entrada no app e erro 503 no login. Lint, 23 testes e build novamente aprovados. Isso não certifica uma conta criada na produção.

## Continuação — logo e entrada

A varredura identificou opacidade acumulada no contêiner e na imagem do logo, além de uma regra antiga de 56 px no cadastro. Corrigido o logo do cadastro para 84 px e eliminada a redução acumulada no cabeçalho do Natural Sereno. O arquivo oficial foi preservado; isso não cria transparência real na fonte. Os outros três cabeçalhos não receberam essa alteração.

O login também permanece bloqueado durante a transição após sucesso. O teste de recuperação foi ampliado e passou com login bem-sucedido após erro 503. Lint, 23 testes e build passaram novamente.

Na conferência das novas capturas, corrigidos também os rótulos monoespaçados do cadastro/login e o contraste e área de toque do link de recuperação. A recuperação por SMS/e-mail ainda não está implementada no produto existente; o botão abre a orientação atual e não foi certificado como envio de recuperação funcional.

## Continuação — prévia publicada e anamnese

A implantação da prévia no commit `3edad73` foi conferida sem fixtures: `/api/health` respondeu 200 e `/api/auth/me` sem sessão respondeu 401, conforme esperado. Não foi criada conta nem executado pagamento nessa verificação. A produção continua sem atualização desta rodada.

Na anamnese, removidas confirmações bloqueantes do navegador para sintonização e ausência de suporte de voz. A confirmação passa a usar mensagem acessível dentro do próprio diálogo. Corrigidos estados de hover escuros herdados em botões claros, sem alterar os callbacks. Lint, 23 testes e build passaram. A confirmação de frequência foi acionada pelo navegador e apareceu na tela sem abrir diálogo nativo.

A repetição da auditoria nas 19 capturas desta rodada concluiu sem alertas de acessibilidade nos critérios automatizados utilizados e sem bloqueios de navegação: Home, quatro passos de anamnese, resultado e ações em desktop/mobile, frequência, mapa astral e edição, numerologia, banhos, chakras, perguntas sistêmicas, Ho’oponopono, configurações e comunidade em desktop/mobile. Esses resultados não substituem validação editorial, vídeos finais nem autenticação completa na produção. Evidências em `reauditoria-telas.json` e `frequencia-confirmacao.png`.

## Continuação — iluminação do Dia 1

A varredura encontrou troca abrupta entre as cinco imagens humanas aprovadas. Substituída por mesclagem gradual nos marcos do áudio, mantendo o estado inicial escuro. Removida a transição CSS independente, para que a pausa mantenha exatamente os valores da iluminação. A função anterior de fases foi removida, evitando duas definições concorrentes da mesma linha do tempo.

Lint, 25 testes e build passaram. O teste no navegador confirmou duas imagens com opacidade 0,5 aos 262,5 segundos, preservação dessas opacidades durante a pausa e retorno à experiência após continuar. Nenhum timer visual independente foi criado. Os vídeos específicos e a revisão integral de roteiros permanecem pendentes; esta correção não certifica a didática visual completa dos 21 dias.

## Integração das correções mais recentes da main

A main avançou até `5edfafb` durante a auditoria. Integradas as correções já existentes de ferramentas, diário, conquistas, instalação, Solfeggio e ajuda de acesso, preservando a nova linha do tempo visual e as correções desta PR.

A revisão da integração detectou e corrigiu três incompatibilidades: uma camada de compatibilidade multiplicava novamente os segundos por 1000; a proteção da locução removia trechos públicos aprovados apenas por seus horários; o teste de nomes privados encontrava `Rama` dentro da palavra `programada`. Mantida a normalização única na origem, a separação por conteúdo privado e os trechos públicos aprovados de aceite/integração. A ajuda para acessar a conta passou a integrar o componente React com link de suporte já existente, substituindo o observador que alterava o DOM repetidamente.

Validação da integração: lint, 28 testes, build e auditoria de dependências aprovados. Suíte geral de navegador, suíte focada, recuperação de cadastro/login e acionamento/parada reais dos sete Solfeggios aprovados, com fixtures locais e sem escrever dados na produção. Nenhum pagamento foi executado.

Busca adicional de fontes: a galeria aprovada foi recuperada e inspecionada; contém logo opaco e acervo de sistemas, não vídeos dos 21 dias. A consulta de MP4 no Drive acessível não retornou arquivos. A especificação técnica original do Protocolo confirma a matriz comum de seis etapas, mas não fornece a locução completa individual dos 21 dias. Esses achados não autorizam substituir o percurso atual pela Jornada Integrada encontrada com outra estrutura.

Após a integração, a auditoria encontrou novos alertas de contraste em chakras, aba selecionada do Ho’oponopono e contato nas configurações. Corrigidos apenas no Natural Sereno e reauditados os três estados sem alertas. O teste de cadastro/login também confirmou abertura da ajuda e presença do link correto de suporte, sem enviar mensagem. A produção antes desta publicação servia o commit `5edfafb`; a atualização publicada e seu resultado serão registrados após a conferência do ambiente real.
