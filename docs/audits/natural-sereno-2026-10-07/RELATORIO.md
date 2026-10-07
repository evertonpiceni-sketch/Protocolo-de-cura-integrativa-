# Estilo 1 — auditoria e correções de 7 de outubro de 2026

**Situação: correções implementadas e reauditoria executada; Estilo 1 ainda não certificado como reprodução integral do painel aprovado. Os estilos 2, 3 e 4 não estão liberados para execução.**

Esta revisão usa o painel Natural Sereno enviado pelo usuário e os documentos oficiais recuperados no Drive. Ela integra as alterações recentes da `main` em vez de substituir correções do Protocolo e das ferramentas. Os relatórios de 4 de outubro descrevem versões anteriores e não comprovam o estado atual.

## 1. Entrada, cadastro e boas-vindas

- Entrada: superfícies marfim, verde natural e dourado; corrigido texto escuro sobre o fundo verde. Os seis passos do acolhimento recebem foco no título, mantêm o foco dentro do diálogo e começam sem carregar a rolagem anterior.
- Cadastro/login: preservada a apresentação Natural Sereno nos quatro IDs de tema. Teste de navegador usa respostas locais controladas; teste do servidor cria três contas em banco temporário, verifica sessão e permissões. **Isso não comprova que a falha específica de cadastro na produção foi reproduzida e corrigida.**
- Boas-vindas: marca ampliada para 104 px; cabeçalho com marca de 52 px. Usado o mesmo logo oficial, sem recriação. O arquivo ainda contém fundo incorporado; composição CSS não equivale a PNG transparente.
- Tipografia: corpo dos textos de uso em Inter, títulos serifados; removida a aparência monoespaçada de textos e botões dos modais revisados.

## 2. Home, menu e navegação

- Corrigida proporção da Home no desktop e mantido o botão principal acima da navegação em janela de 1365 × 600.
- Painel da paisagem acompanha a rolagem da coluna adjacente no desktop. Corrigido o deslocamento superior criado durante a primeira tentativa; a versão final usa `top: 0`.
- Navegação real por clique entre início, jornada, biblioteca, comunidade, menu, ferramentas e perfil. Validação de ausência de transbordamento horizontal em 320, 390, 768 e 1440 px.
- As três outras aparências mantêm sua ramificação anterior; as novas regras visuais são condicionadas ao Estilo 1. Correções de acessibilidade e de tempo no código compartilhado permanecem comuns aos percursos que usam esses controles.

## 3. Anamnese e resultado

- Contador de etapa separado do botão de fechar; verificação de sobreposição no celular.
- Modal de desktop ampliado; ações do resultado em colunas proporcionais ou empilhadas no celular, com altura mínima e texto sem corte.
- Correção de cores violeta/índigo e de etiquetas douradas com contraste insuficiente. Identificado como causa um seletor legado que tratava `bg-[#B88736]/10` como dourado opaco; aplicado ajuste isolado no Natural Sereno.
- Botão de áudio do resultado recebe nome acessível para preparar, tocar e parar.
- Área rolável dos centros energéticos pode receber foco pelo teclado.
- Mantidos questionário, respostas, recomendações e callbacks existentes. Os quatro passos existentes não foram substituídos por um questionário novo apenas para imitar o número de perguntas desenhado no painel.

## 4. Reintegração — os 21 dias

- Restauradas as meditações próprias de cada dia diretamente de `jornada21Dias.ts`, sem substituir suas frases por paráfrases repetidas. Abertura, aceite, aviso de silêncio e encerramento vêm das constantes oficiais.
- Retirados da locução pública nomes técnicos da programação energética privada. Explicações opcionais continuam acessíveis em detalhes recolhidos; não são lidas como meditação.
- Removida a expressão rejeitada “se isso for seguro para você”. Testes também impedem a reintrodução de “se for confortável” na locução.
- Corrigida a seleção de passagem ao retomar ou voltar no áudio: não descarrega falas antigas acumuladas. A janela de absorção de 21:00 a 27:00 permanece sem narração.
- Pausar/continuar preserva a narração nativa, inclusive ao pausar em 00:00; o cancelamento do áudio global foi separado do controle da sessão. Voltar 15 segundos permite retomar a passagem correspondente.
- Removido o corpo desenhado do player e da apresentação dos dias 2–21. O fallback utiliza o corpo da arte aprovada, começa com luminosidade reduzida e revela regiões conforme o relógio da sessão. Não usa um ciclo de animação independente que continue enquanto o áudio está parado.
- Restaurado o mapa visual oficial encontrado no Drive. Exemplo: dia 3 volta a apresentar pés → pernas → ventre; o mapa local anterior dizia peito → mãos.
- **Limite material:** o fallback com recortes/máscaras não é o vídeo final de cada dia. Ele não reproduz todos os gestos previstos, como marcha, articulações, passagem para o mundo e movimentos tridimensionais. A validação dos 21 MP4s e sua integração ao player permanecem abertas. Não afirmar que o modelo animado está concluído.

## 5. Protocolo 21 dias e São Miguel / Rafael / Chama Violeta

- Integradas as correções recentes da `main`: tempo real do áudio, ausência de duração inventada, condução dos três sistemas e Solfeggio correspondente.
- Corrigida uma incompatibilidade da integração: o motor já converte os eventos nativos para segundos; o player não divide o valor novamente por mil. Respiração preservada em 4 segundos para inspirar, 3 para sustentar e 5 para expirar.
- Painel de leitura agora inclui o mesmo contexto diário enviado à voz. Controles de avanço temporal ficam indisponíveis quando a duração não é conhecida.
- São Miguel preserva a pausa/retomada implementada na versão atual da `main`, sem usar a implementação local anterior que reiniciava a prática.
- Acrescentado tom fundamental ao fundo sintetizado que antes continha apenas sub-harmônicos. Verificação no Web Audio confirma início e parada das sete frequências; não equivale a uma escuta humana integral das sessões.
- **Pendência editorial:** o Protocolo atual usa seis etapas comuns e contexto distinto para os 21 dias. Isso não é comprovação de 21 roteiros completos diferentes. O documento “Jornada Única Integrada” encontrado no Drive contém outro conjunto de títulos e outra sequência temporal; não foi usado para substituir silenciosamente a jornada existente, seus acessos ou sua arquitetura.

## 6. Biblioteca, cursos e ferramentas

- Cursos: uma coluna no celular, duas/três conforme a largura efetiva do modal; botões de contato ocupam a largura disponível e não cortam o texto. Preservada seleção por teclado e indicação de curso selecionado da versão atual da `main`.
- Mapa Astral: nenhum mapa calculado com data fictícia quando o nascimento não foi informado. Abre o formulário de dados; resultados e impressão ficam indisponíveis nessa condição. Mantida a proteção PRO existente para recursos aprofundados.
- Símbolos astrológicos solicitam apresentação tipográfica, evitando a versão de emoji colorido do navegador.
- Numerologia, banhos, chakras, perguntas sistêmicas e Ho’oponopono: correções de contraste e etiquetas; controles anterior/próximo e fechar recebem nomes acessíveis. Preservadas as correções de conteúdo e pagamento já existentes na `main`.
- Configurações: campos de idioma, voz, horário, velocidade e volume com nomes acessíveis. Ajustado contraste de ações verdes e de saída.

## 7. Comunidade, perfil e planos

- Comunidade com campo de escrita, consentimento, estado pendente, moderação, denúncia, exclusão pelo autor e iniciais geradas pelo sistema. API exercitada em banco temporário com usuários distintos; sem publicar conteúdo fictício na produção.
- Removida a ordenação por popularidade. O segundo filtro mostra “Minhas experiências”, preservando a disposição com duas opções e seguindo a política explícita do projeto: comunidade protegida, sem ranking de popularidade.
- Perfil mantém progresso baseado em conclusões e os callbacks existentes de contato e saída.
- Planos: preços e títulos legíveis sobre cards claros; três colunas no desktop, uma no celular; controles com foco retido no diálogo e fechamento por Escape.
- **Não alterados preços, cupons, autorização, checkout ou APIs de pagamento. Não executada transação real.** A auditoria de planos percorre seleção e apresentação do checkout.

## 8. Evidência e método

- `npm run lint`: aprovado (`tsc --noEmit`).
- `npm test`: 23 testes aprovados, incluindo registro em ambiente isolado, comunidade, roteiros oficiais, silêncio, unidades do tempo e isolamento dos temas.
- `npm run build`: aprovado. Permanece aviso de tamanho do bundle principal, sem erro de compilação.
- O primeiro check do GitHub falhou por duas dependências transitivas vulneráveis. Atualizados somente `proxy-addr` 2.0.7 → 2.0.8 e `source-map-js` 1.2.1 → 1.2.2; `npm audit --audit-level=moderate` passou com zero vulnerabilidades.
- Conferência adicional: 18 estados de tela e 481 controles inventariados, incluindo repetições entre estados. Foram corrigidos os alertas de contraste, nomes acessíveis e regiões roláveis encontrados; Configurações recebeu uma execução final separada para conferir o último ajuste. Esses números não representam 481 cliques nem certificação de toda a experiência.
- Navegador Chromium: suíte geral de 18 verificações; suíte focada de correções; conferência adicional de ferramentas com inventário de controles e axe; verificação dos 21 dias sem corpo desenhado; execução do grafo Web Audio nas sete frequências.
- Separação obrigatória: inventariar um botão não significa tê-lo clicado. Foram acionadas as rotas e ações descritas acima. Não foi feita compra real, mensagem enviada ao terapeuta, publicação de teste na produção ou escuta humana completa de 21 × 29:57.
- Imagens em `evidence/` são capturas locais do app real com perfis e respostas de API controlados, não capturas da produção autenticada.

## 9. Fontes recuperadas e limites de aprovação

1. [Briefing oficial da Reintegração](https://docs.google.com/document/d/15-2F4WPcvZRW8Vf4-T1y46hsm2e6mGk9t_Dw15PqoeI/edit): locução pública, abertura, silêncio e retorno.
2. [Mapa didático visual oficial dos 21 dias](https://docs.google.com/document/d/18bfk2yzr_o2DdPaQas1Jv_ajGBNt2E5jPe_kEafRjFY/edit): regiões e movimento de cada dia.
3. [Documento da Jornada Única Integrada](https://docs.google.com/document/d/1MXgQqnKxX8Nqt9oWaT5LnzqSjLfTYqFVuppYKReXMlg/edit): fonte encontrada com estrutura diferente da jornada atual; diferença registrada, sem migração automática.

**O que impede encerrar o Estilo 1:** vídeos finais e sincronização fina de cada dia; correspondência editorial integral dos 21 roteiros do Protocolo; fonte do logo com transparência real; reprodução/verificação do cadastro na produção; comparação visual final dos 12 estados aprovados e suas telas auxiliares. Testes aprovados e ausência de alertas automáticos não removem essas pendências.

## Verificação adicional da prévia real

A conferência sem fixtures detectou HTTP 500 em `/api/health` e `/api/auth/me`. Os logs da Vercel identificaram `ERR_MODULE_NOT_FOUND` no import de `jornada21Dias` por `reintegrationJourneyPublic`. Corrigida a extensão `.js` necessária para a execução ESM na função Node. A validação da nova implantação ainda deve confirmar a recuperação; cadastro real continua sem certificação até essa confirmação.

O workflow adicional de análise por IA falhou por quota mensal do serviço (HTTP 402), sem apresentar uma descoberta de código. A auditoria de dependências passou com zero vulnerabilidades.
