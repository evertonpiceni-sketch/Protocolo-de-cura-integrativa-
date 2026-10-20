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
