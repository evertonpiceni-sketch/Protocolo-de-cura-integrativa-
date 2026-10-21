# Estilo 3 — auditoria de 20/10/2026

Status: correções verificadas em navegador local com dados sintéticos; fidelidade integral e áudio real ainda pendentes. Branch exclusiva: fix/essencia-luminosa-recovery-20261016.

## Resultado desta execução

20 casos percorridos em 320, 390 e 1365 px (60 estados de viewport). Nenhum overflow horizontal ou controle sem nome acessível detectado nesses estados. Isso não representa comparação visual aprovada nem exercício de todos os botões. Navegação usa interceptação local de API e perfis fictícios; nenhum dado real ou cobrança foi alterado.

Cobertura: cadastro, login, home com/sem anamnese, resultado, menu, jornada, recursos, busca sem resultados, ferramentas, comunidade, perfil, configurações, quatro etapas da anamnese, Pausa Consciente, Ainda Há Algo em Mim e painel da Reintegração. coverage.json reúne resultados por caso. As imagens foram capturadas em /tmp para inspeção interna e não constituem ativos do produto.

## Defeitos corrigidos e reauditoria

1. O ajuste naturalSerenoHomeApprovedModel injetava um rótulo adicional no card do dia em Essência Luminosa. Na captura, o título ficava comprimido em uma coluna de letras. applyHomeModel agora roda somente para natural-sereno, sem modificar seu comportamento nesse estilo. Reauditoria: rótulo extra ausente e título ocupa largura adequada.
2. O suporte flutuante cobria a navegação inferior. No Estilo 3, foi deslocado acima do dock.
3. Atalhos da jornada apareciam mesmo com aria-disabled/aria-hidden calculados pelo fluxo existente. CSS do Estilo 3 agora respeita esses estados; não altera critérios de acesso. Caso sem anamnese foi reproduzido novamente com atalho oculto.
4. O foco/Tab/Escape da anamnese eram habilitados somente para Natural Sereno. O mesmo hook existente foi habilitado para Essência Luminosa, incluindo rolagem ao topo e foco no título ao mudar de etapa. As quatro etapas passaram: foco inicial dentro, Tab dentro e Escape fecha. A falha transitória da etapa 2 durante recarga do desenvolvimento foi descartada após nova execução isolada bem-sucedida.

## Verificação técnica

32 testes existentes passaram, TypeScript passou e build passou novamente após as correções. git diff --check passou. Scripts novos: audit-layout3.cjs e run-layout3-audit.cjs. npm ci instalou headless-shell; use headless:'shell' e pipe:true. Para acesso ao localhost, execute servidor e auditor sob o mesmo processo pai:

    AUDIT_OUT=/tmp/layout3-check AUDIT_FILTER='^(home|home-no-anamnesis|anamnesis-step-[1-4])$' node scripts/run-layout3-audit.cjs

Para rodar o restante, ajuste AUDIT_FILTER ou omita-o. Não confundir testes de API simulada com serviços reais.

## Pendências da próxima execução

- Revisar player, boas-vindas, carregamento, rolagem completa e os demais modais em navegador. Não afirmar que as 12 telas da prancha foram aprovadas.
- Completar fidelidade visual usando os ativos oficiais separados da prancha. Cenas de fundo atualmente ausentes não podem ser substituídas por imagens inventadas ou geradas. A composição atual ainda difere do modelo aprovado.
- Escuta integral e sincronização de áudio real, sem gerar voz ou consumir créditos.
- Não publicar produção nem fazer merge antes das validações essenciais. Preservar demais estilos, lógica, conteúdo, pagamento, Biblioteca e Mini Diagnóstico.

Agendamento existente Essência Luminosa reativado como Auditar Estilo 3, de hora em hora a partir de 01:00 de 20/10, America/Sao_Paulo; ID 6ab1a28a9ef08191ab2c91c1234dd3f5. Retomar deste relatório e do estado remoto, sem repetir tarefas já verificadas. Sem merge ou atualização de produção nesta execução.

## Continuação da reauditoria — player e modais

A prancha oficial `1001196525(1).png` foi relida como referência. O auditor passou a cobrir separadamente portal de aceite, acolhimento inicial, player em execução e gaveta do roteiro, além de corrigir a própria fixture de boas-vindas e a seleção do diálogo realmente visível. Essas correções evitam falso bloqueio por estado de sessão persistido e falso negativo causado por um diálogo oculto no DOM. A fixture também passou a bloquear toda requisição HTTP externa, incluindo telemetria, mantendo a reauditoria estritamente local.

Defeito comprovado no player mobile: o cartão do acolhimento inicial ultrapassava a área útil e era cortado pelo contêiner fixo; título e textos escuros apareciam sobre o cartão verde; no estado de execução, cabeçalho, conteúdo e controles competiam por altura. A correção ficou restrita ao Estilo 3: portal e check-in ganharam rolagem interna, o check-in voltou à superfície clara com contraste legível e cabeçalho/conteúdo/controles passaram a respeitar a altura disponível. Portal, check-in, player e roteiro foram novamente renderizados em 320, 390 e 1365 px sem overflow horizontal, controles sem nome ou falha de teclado detectada. Isso comprova encaixe e operação básica, não fidelidade integral à prancha nem sincronização de áudio.

Os modais de relatório/certificado, planos, prática individual, vídeo de apresentação e Diário de Reconexão ainda limitavam foco/Tab/Escape ao Natural Sereno. O mesmo mecanismo já existente foi habilitado para Essência Luminosa, sem mudar conteúdo ou lógica. Reauditoria dos cinco modais, dos dois estados de edição do diário e da gaveta do roteiro passou nas três larguras; Escape fechou, o foco iniciou e permaneceu no diálogo.

Verificação técnica desta continuação: 32 testes passaram com `node --import tsx --test tests/*.test.ts`; TypeScript, build de produção e `git diff --check` passaram. O comando `npm test` não conseguiu abrir o pipe IPC do `tsx` neste executor (`EPERM`), mas a mesma suíte foi executada diretamente pelo carregador `tsx` e passou integralmente. Nenhuma cobrança, conta real, publicação ou deploy foi acionado.

Pendências permanecem: comparação visual completa das 12 telas contra ativos oficiais separados ainda ausentes; escuta integral e sincronização do áudio real; validação de serviços reais fora das fixtures. Não declarar o Estilo 3 concluído enquanto esses pontos permanecerem.

## Continuação da reauditoria — Guia dos 7 Chakras

A varredura dos modais ainda não cobertos confirmou, sem overflow horizontal ou controles sem nome nas larguras de 320, 390 e 1365 px, uma falha de teclado comum em dez telas: foco inicial fora do diálogo, Tab sem contenção e Escape inoperante no Estilo 3. Conforme a regra de uma página e um defeito por vez, somente o Guia dos 7 Chakras foi corrigido nesta passagem. O hook de foco existente passou a reconhecer `essencia-luminosa`, preservando o comportamento de Natural Sereno e sem mudar conteúdo ou lógica.

A reauditoria isolada do Guia dos 7 Chakras passou nas três larguras: sem overflow horizontal, sem controle sem nome, com rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando o diálogo. Permanecem para a sequência os mesmos três requisitos de teclado em Banhos e Aromas, Ho'oponopono, Numerologia, Mapa Astral, Perguntas Sistêmicas, Cursos, Dashboard, Oração do Arcanjo Miguel e painel Admin. O modal de contato não entrou na checagem automática de teclado por não usar o seletor de diálogo do auditor e deve ser validado separadamente.

## Continuação da reauditoria — Banhos e Aromas

O defeito de teclado foi reproduzido isoladamente no Guia de Banhos de Ervas: nas três larguras não havia overflow horizontal nem controles sem nome, mas o foco inicial permanecia fora do diálogo, Tab escapava e Escape não fechava no Estilo 3. A correção mínima habilitou para `essencia-luminosa` o mesmo hook já usado em Natural Sereno, sem alterar receitas, avisos, busca, filtros ou lógica de cópia.

A reauditoria em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com rolagem até o fim do conteúdo, foco inicial dentro, Tab contido e Escape fechando o diálogo. Permanecem com a falha de teclado já comprovada: Ho'oponopono, Numerologia, Mapa Astral, Perguntas Sistêmicas, Cursos, Dashboard, Oração do Arcanjo Miguel e painel Admin; o modal de contato continua pendente de validação específica pelo auditor.

## Continuação da reauditoria — Ho'oponopono

O modal de Ho'oponopono reproduziu isoladamente a falha já inventariada: foco inicial e Tab permaneciam fora do diálogo e Escape não fechava no Estilo 3, embora não houvesse overflow horizontal nem controles sem nome nas três larguras. A correção mínima habilitou para `essencia-luminosa` o mesmo hook de foco existente, sem alterar oração, temas, contagem, áudio ou progresso.

A reauditoria em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com rolagem completa, foco inicial dentro, Tab contido e Escape fechando o diálogo. Permanecem com a falha de teclado comprovada: Numerologia, Mapa Astral, Perguntas Sistêmicas, Cursos, Dashboard, Oração do Arcanjo Miguel e painel Admin; o modal de contato continua pendente de validação específica.

## Continuação da reauditoria — Numerologia

O modal de Numerologia reproduziu a falha já inventariada: foco inicial e Tab fora do diálogo e Escape inoperante no Estilo 3, sem overflow horizontal ou controles sem nome nas três larguras. A correção mínima habilitou para `essencia-luminosa` o hook de foco existente, sem alterar cálculos, abas, desbloqueio, impressão ou pagamento.

A reauditoria em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando o diálogo. Permanecem com a falha de teclado comprovada: Mapa Astral, Perguntas Sistêmicas, Cursos, Dashboard, Oração do Arcanjo Miguel e painel Admin; o modal de contato continua pendente de validação específica. A captura comprova renderização e operação básica, não aprovação integral da fidelidade visual.

## Continuação da reauditoria — Mapa Astral

O modal de Mapa Astral reproduziu isoladamente a falha já inventariada: foco inicial e Tab permaneciam fora do diálogo e Escape não fechava no Estilo 3, embora as três larguras não apresentassem overflow horizontal nem controles sem nome. A correção mínima habilitou para `essencia-luminosa` o mesmo hook de foco existente, sem alterar cálculos, dados pessoais, abas, impressão, conteúdo ou pagamento.

A reauditoria em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando o diálogo. Permanecem com a falha de teclado comprovada: Perguntas Sistêmicas, Cursos, Dashboard, Oração do Arcanjo Miguel e painel Admin; o modal de contato continua pendente de validação específica. A captura confirma renderização e operação básica, não fidelidade visual integral à prancha.

## Continuação da reauditoria — Perguntas Sistêmicas

O modal de Perguntas Sistêmicas reproduziu isoladamente a falha de teclado: foco inicial e Tab permaneciam fora do diálogo e Escape não fechava no Estilo 3, sem overflow horizontal nem controles sem nome nas três larguras. A correção mínima habilitou para `essencia-luminosa` o hook de foco existente, sem alterar perguntas, respostas, progresso, frequência, áudio ou lógica de salvamento.

A reauditoria em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando o diálogo. Permanecem com a falha de teclado comprovada: Cursos, Dashboard, Oração do Arcanjo Miguel e painel Admin; o modal de contato continua pendente de validação específica. A captura confirma renderização e operação básica, não fidelidade visual integral à prancha nem escuta do áudio de 639 Hz.

## Continuação da reauditoria — Cursos

O modal Cursos reproduziu a falha de teclado inventariada: foco inicial e Tab fora do diálogo e Escape inoperante no Estilo 3, sem overflow horizontal nem controles sem nome nas três larguras. O hook existente passou a reconhecer `essencia-luminosa`, sem alterar o bloqueio, textos, conteúdo da Biblioteca ou qualquer liberação. A primeira captura corrigida também revelou que, em 320 × 568 px, o cartão mais alto que a viewport era centralizado com o cabeçalho fora da área alcançável. O alinhamento ao topo foi aplicado somente ao Estilo 3 e somente em viewports de até 640 px de altura.

A reauditoria final em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com cabeçalho visível no viewport curto, rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando. Permanecem com a falha de teclado comprovada: Dashboard, Oração do Arcanjo Miguel e painel Admin; o modal de contato segue pendente de validação específica. A captura comprova encaixe e operação básica, não aprovação integral de fidelidade visual.

## Continuação da reauditoria — Dashboard

O Dashboard reproduziu a falha de teclado inventariada: foco inicial e Tab fora do diálogo e Escape inoperante no Estilo 3, sem overflow horizontal nem controles sem nome nas três larguras. O hook existente passou a reconhecer `essencia-luminosa`, sem alterar progresso, sequência dos sete dias, desbloqueios ou navegação. A primeira captura corrigida revelou ainda título branco e percentual dourado com contraste insuficiente no fundo claro; o Estilo 3 passou a usar os tons escuros já existentes somente nesses textos.

A reauditoria final em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com contraste legível, rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando. Permanecem com a falha de teclado comprovada: Oração do Arcanjo Miguel e painel Admin; o modal de contato segue pendente de validação específica. A captura comprova renderização e operação básica com dados sintéticos, não valida progresso real nem fidelidade visual integral.

## Continuação da reauditoria — Oração do Arcanjo Miguel

O modal da Oração do Arcanjo Miguel reproduziu a falha de teclado inventariada: foco inicial e Tab fora do diálogo e Escape inoperante no Estilo 3, sem overflow horizontal nem controles sem nome nas três larguras. A correção mínima habilitou para `essencia-luminosa` o hook existente, sem alterar oração, partes, cópia, áudio, contador ou progresso diário.

A reauditoria em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando o diálogo. Permanece com a falha de teclado comprovada o painel Admin; o modal de contato segue pendente de validação específica. A captura confirma renderização e operação básica, não escuta integral do áudio nem fidelidade visual integral.

## Continuação da reauditoria — painel Admin

O painel Admin reproduziu isoladamente a última falha de teclado do inventário automático: foco inicial e Tab permaneciam fora do diálogo e Escape não fechava no Estilo 3, sem overflow horizontal nem controles sem nome nas três larguras. A reprodução usou exclusivamente o perfil administrativo fictício e as APIs interceptadas do auditor, sem credenciais, contas ou dados reais. A correção mínima habilitou para `essencia-luminosa` o hook existente, sem alterar autenticação, permissões, usuários, cupons, áudios, vídeos ou chamadas de API.

A reauditoria em 320, 390 e 1365 px passou sem overflow horizontal ou controles sem nome, com rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando o diálogo. Os 32 testes existentes, TypeScript, build de produção e `git diff --check` passaram novamente. Assim, o inventário automático de teclado dos modais cobertos está saneado; o modal de contato ainda exige validação específica porque não usa o seletor de diálogo atualmente adotado pelo auditor. Permanecem também a comparação visual integral contra os ativos oficiais separados ainda ausentes, a escuta e sincronização do áudio real e a validação de serviços reais fora das fixtures. Não declarar o Estilo 3 concluído enquanto essas validações essenciais permanecerem.

## Continuação da reauditoria — Fale Conosco

A validação específica revelou primeiro um falso positivo do auditor: o caso `contact` terminava na tela Recursos e não abria o diálogo. A fixture passou a acionar diretamente o botão flutuante existente e a exigir `#contact-us-modal`; a mesma correção foi aplicada ao estado de cópia negada. Com o diálogo realmente renderizado, a falha de teclado foi comprovada: no formulário comum o foco inicial permanecia fora e Escape não fechava; após a tentativa de cópia negada, Escape também não fechava. O hook existente passou a reconhecer `essencia-luminosa`, sem alterar formulário, endereço, WhatsApp, texto, envio ou tratamento da área de transferência.

A reauditoria do formulário comum e da cópia negada passou em 320, 390 e 1365 px sem overflow horizontal ou controles sem nome, com rolagem disponível, foco inicial dentro, Tab contido e Escape fechando o diálogo; a negação de acesso à área de transferência não produziu confirmação falsa. Os 32 testes existentes, TypeScript, build de produção e `git diff --check` passaram novamente. Nenhum e-mail, WhatsApp ou serviço externo foi acionado. O inventário de teclado dos modais auditados está agora completo. Permanecem a comparação visual integral contra os ativos oficiais separados ainda ausentes, a escuta e sincronização do áudio real e a validação de serviços reais fora das fixtures; essas pendências impedem declarar o Estilo 3 concluído.

## Continuação da reauditoria — contraste do Fale Conosco

A captura já validada do diálogo revelou uma falha visual independente do teclado: a regra global de tema substituía por dourado opaco as classes douradas translúcidas usadas nos brilhos decorativos, no selo e no ícone de e-mail. Os brilhos cobriam o conteúdo e selo/ícone ficavam dourado sobre dourado, reduzindo fortemente a leitura. A correção foi restrita ao `#contact-us-modal` do Estilo 3 e apenas restaurou as transparências previstas pelo próprio componente, sem mudar textos, estrutura, paleta, logo ou canais de atendimento.

A reauditoria visual do formulário comum e do estado de cópia negada confirmou cabeçalho, selo, ícone, endereço e campos legíveis em 320, 390 e 1365 px. Os dois estados permaneceram sem overflow horizontal ou controles sem nome, com foco inicial dentro, Tab contido e Escape fechando o diálogo. Os 32 testes existentes, TypeScript, build de produção e `git diff --check` passaram novamente. Isso corrige o contraste observado nessa página, mas não representa aprovação integral de fidelidade das demais telas nem substitui os ativos oficiais ausentes.

## Continuação da reauditoria — Diário de Reconexão

Os três estados do Diário — leitura, edição da anotação e edição da intenção — foram renderizados separadamente. A mesma regra global que afetava o Contato transformava o brilho e os marcadores dourados translúcidos em superfícies opacas: o cabeçalho ficava coberto, selo e ícones desapareciam e, em 320 px, o selo invadia a área do botão fechar. A correção ficou restrita ao `#daily-diary-modal` do Estilo 3: restaurou a transparência prevista no componente e reservou espaço para o botão no cabeçalho móvel, sem alterar registros, intenção, exportação, progresso ou salvamento.

A reauditoria visual dos três estados confirmou selo, título, marcadores, ícones e conteúdo legíveis em 320, 390 e 1365 px. Todos permaneceram sem overflow horizontal ou controles sem nome, com rolagem disponível, foco inicial dentro, Tab contido e Escape fechando o diálogo. Os 32 testes existentes, TypeScript, build de produção e `git diff --check` passaram novamente. A validação usou apenas registros sintéticos e não exportou nem salvou dados reais.

## Continuação da reauditoria — valores da Prática Individual

A rolagem completa da Prática Individual revelou uma divergência funcional na apresentação do pagamento: com o ciclo de 21 dias selecionado, selo, chave e botão indicavam R$ 99,90, mas o resumo exibia o valor fixo de R$ 70,00. O mesmo valor fixo permanecia ao trocar de ciclo e o preço tachado de cupom também assumia apenas 59,90 ou 99,90. A correção substituiu somente essas constantes visuais pelos valores base e final já calculados pelo fluxo existente; preços, descontos, payload, confirmação segura e integração de pagamento não foram alterados.

O auditor passou a selecionar os três ciclos e exigir consistência entre selo, resumo e botão. A reauditoria confirmou R$ 20,00 para a sessão única, R$ 59,90 para sete dias e R$ 99,90 para 21 dias, em 320, 390 e 1365 px, sem iniciar checkout ou cobrança. A página permaneceu sem overflow horizontal ou controles sem nome, com foco inicial dentro, Tab contido e Escape fechando o diálogo.

Os 32 testes existentes, TypeScript, build de produção e `git diff --check` passaram novamente. Permanecem pendentes a comparação visual integral contra os ativos oficiais separados ainda ausentes, a escuta e sincronização do áudio real e a validação de serviços reais fora das fixtures; essas pendências impedem declarar o Estilo 3 concluído.

## Continuação da reauditoria — Ajustes de Áudio

A captura completa dos Ajustes de Áudio comprovou outra ocorrência da regra global que convertia fundos dourados translúcidos em superfícies opacas. Os dois brilhos cobriam cabeçalho e painel binaural, enquanto os ícones dourados desapareciam sobre o fundo da mesma cor. A correção ficou restrita ao `#audio-settings-modal` do Estilo 3 e restaurou exatamente as transparências de 10%, 12% e 15% já declaradas pelo componente, sem alterar frequências, volumes, voz, camada binaural, bloqueios VIP, salvamento ou reprodução.

A reauditoria visual confirmou cabeçalho, ícones, frequências e painel binaural legíveis em 320, 390 e 1365 px. A tela permaneceu sem overflow horizontal ou controles sem nome, com rolagem até o fim, foco inicial dentro, Tab contido e Escape fechando o diálogo. Nenhum áudio foi executado nem salvo; a captura e os testes de interface não substituem a escuta integral e a validação de sincronização ainda pendentes.

Os 32 testes existentes, TypeScript, build de produção e `git diff --check` passaram novamente. Permanecem pendentes os ativos oficiais separados, a comparação visual integral das demais telas, a escuta e sincronização completa do áudio real e a validação de serviços reais fora das fixtures.

## Continuação da reauditoria — Conquistas e Marcos

A captura da tela Conquistas e Marcos comprovou mais uma ocorrência isolada da regra global de fundos dourados: o brilho decorativo de 10% tornava-se uma mancha opaca sobre o título, e o fundo de 12% do resumo apagava o ícone de coroa. A correção ficou restrita ao `#achievements-modal` do Estilo 3 e somente restaurou essas duas transparências já declaradas pelo componente, sem alterar critérios, pontos, categorias, progresso ou desbloqueios.

A reauditoria visual confirmou selo, título, ícone de coroa, resumo e cartões legíveis em 320, 390 e 1365 px. A tela permaneceu sem overflow horizontal ou controles sem nome, com rolagem disponível, foco inicial dentro, Tab contido e Escape fechando o diálogo. A fixture manteve todos os emblemas bloqueados e não escreveu progresso real.

Os 32 testes existentes, TypeScript, build de produção e `git diff --check` passaram novamente. Permanecem pendentes os ativos oficiais separados, a comparação visual integral das demais telas, a escuta e sincronização completa do áudio real e a validação de serviços reais fora das fixtures.

## Continuação da reauditoria — categorias de Conquistas no mobile

Após corrigir o contraste, a captura de 320 px revelou um defeito independente na faixa horizontal de categorias: a centralização de uma linha mais larga que o contêiner posicionava `Todos` e parte de `Constância` fora da borda esquerda, sem possibilidade de retornar ao início. A correção ficou restrita ao Estilo 3 e a telas de até 640 px, alinhando a faixa ao início e mantendo a centralização existente no desktop; categorias, filtros e resultados não foram alterados.

A reauditoria em 320, 390 e 1365 px confirmou `Todos` integralmente visível na posição inicial, demais categorias acessíveis pela rolagem horizontal e desktop ainda centralizado. O auditor agora exige que a primeira categoria esteja dentro da área visível antes das capturas. A tela permaneceu sem overflow da página ou controles sem nome, com foco inicial dentro, Tab contido e Escape fechando o diálogo.

Os 32 testes existentes, TypeScript, build de produção e `git diff --check` passaram novamente. Permanecem pendentes os ativos oficiais separados, a comparação visual integral das demais telas, a escuta e sincronização completa do áudio real e a validação de serviços reais fora das fixtures.
