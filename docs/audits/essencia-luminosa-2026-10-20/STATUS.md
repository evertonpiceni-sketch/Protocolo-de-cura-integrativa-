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
