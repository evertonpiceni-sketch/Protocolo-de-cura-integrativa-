# Restauração Natural Sereno — 12/10/2026

A publicação anterior continha somente o hotfix de abertura. As alterações do player, áudio e mobile permaneciam preservadas no checkout original e ainda não estavam no main. Esta branch integra esse conjunto ao main atualizado, sem desfazer o observador idempotente nem as regras atuais de jornada, acesso e catálogo.

A Home recupera título verde, menu lateral superior, mensagem sobre card creme e botão dourado quando a jornada está liberada. Mantém os textos e gates atuais; a composição segue a referência Natural Sereno do repositório. A restauração do CSS mobile também recupera os ajustes anteriores de legibilidade em modais. O player recupera atmosfera animada, canvas do Dia 1, respiração integrada, título e card equilibrados, progresso fino e controles unificados. Correções de volume, pausa, respostas atrasadas, Media Session, Wake Lock e fallback foram integradas junto com os testes.

## Validação

- Build, TypeScript e 32 testes passaram.
- Home conferida em 320×568, 360×740, 390×844, 430×932 e 1365×768, sem overflow horizontal; acesso ao botão por rolagem também exercitado.
- Player conferido em sete viewports; seis etapas, roteiro, controles, movimento reduzido e saída foram exercitados.
- WAV local real: seek, ±15s, volume, pausa/retomada, resposta atrasada descartada, reprodução e mudança de etapa em segundo plano, comandos Media Session e ação não suportada passaram.
- Fontes aprovadas carregadas diretamente pelo Chromium com TLS ativo. QA headless usa rasterização sem GPU por instabilidade gráfica deste ambiente.
- Capturas e JSONs neste diretório registram os resultados. Perfis sintéticos, APIs interceptadas; nenhuma conta real foi alterada.

Reproduzir com preview compilado: `JORNADA_QA_URL=http://127.0.0.1:4177/ node scripts/audit-jornada-mobile.mjs after --race --unsupported-media-action`. Permissão de escrita no banco NSS é necessária no sandbox. A fixture contém um perfil completo com jornada previamente liberada, preservando os gates reais.

Bloqueio de tela em Android/iPhone continua pendente de teste físico. Esta restauração não foi publicada em produção nesta etapa.

## Auditoria, correção, reauditoria e teste antes da publicação

O ciclo solicitado foi aplicado nas sete etapas do pedido: microanimação e fundo; hierarquia; legibilidade; card da frase; progresso e controles; acabamento Natural Sereno; responsividade. Capturas e testes de viewport confirmaram os critérios exercitados. A conferência visual ocorreu antes da publicação autorizada.

A revisão adicional encontrou duas camadas da Home disputando os mesmos textos e reescrevendo nós a cada frame, além de reconstruir repetidamente o card de escolha. Agora a camada de estado é a única responsável pelas mensagens e disponibilidade da jornada; a camada visual escreve somente diferenças. O card mantém seus controles e listeners quando o estado não mudou. As strings existentes e as regras de acesso foram preservadas.

`scripts/audit-home-stability.cjs` exercitou quatro estados (sem anamnese, sem acesso, escolha de protocolo e jornada ativa): zero mutações de conteúdo após estabilização na janela observada, zero erros JavaScript e bloqueios corretos. O ciclo do player foi repetido no build final, incluindo seis etapas e áudio real em segundo plano. Build, TypeScript, 32 testes e git diff --check passaram. A publicação completa foi autorizada explicitamente pelo usuário; o limite de bloqueio físico de tela permanece.
