# Natural Sereno — auditoria da implementação

final result: blocked

Implementação funcional validada; a equivalência visual integral com a prancha ainda não está concluída. Não iniciar o Estilo 2.

## Referência e evidências

Referência congelada: painel aprovado `1001196520.jpg`, copiado para [reference.jpg](docs/visual-qa/natural-sereno/reference.jpg). Os outros três painéis não orientam esta implementação.

[Comparação das 12 telas](docs/visual-qa/natural-sereno/comparison-board.jpg): referência à esquerda, aplicação à direita em cada par. Capturas Chromium em 390 × 844 CSS px, DPR 1. Os recortes da prancha foram redimensionados para essa área; a referência inclui dispositivos e tem resolução limitada. Comparações ampliadas: [Home](docs/visual-qa/natural-sereno/compare-home.png), [Menu](docs/visual-qa/natural-sereno/compare-menu.png), [Player](docs/visual-qa/natural-sereno/compare-player.png). Captura adicional do [Portal de Aceite](docs/visual-qa/natural-sereno/portal.png).

## Superfícies auditadas

- Estrutura e proporções: Home com cena alta, mensagem em cartão, CTA dourado e barra inferior; Menu com seis linhas; listas com ícone/miniatura, descrição e seta. A comparação levou ao aumento da cena, tipografia e linhas, e à retirada do cabeçalho institucional nas telas internas.
- Tipografia: serifadas Lora/Cormorant, hierarquia editorial, corpo legível. Não há correspondência tipográfica exata comprovada com o arquivo original da prancha.
- Paleta e acabamento: marfim, verde floresta e dourado, bordas claras, botões arredondados com luz e sombras. Todos os novos seletores são restritos ao layout `natural-sereno`.
- Imagens e ornamentação: vale ao amanhecer, folhagens, cachoeira, Reiki e aromas. O logo oficial existente foi preservado. As cenas reconstruídas reproduzem a atmosfera, mas não são os assets originais isolados da prancha.
- Controles e estados: navegação inferior, busca/filtro, progresso, entrada, aceite, player, roteiro e comunidade vazia foram exercitados no aplicativo real com fixtures locais.

## Diferenças pendentes e limites de escopo

**P2 — imagens e composição:** splash/boas-vindas, miniaturas, paisagens e ornamentos ainda diferem da referência. A cena de carregamento usa cachoeira em vez da figura meditativa da prancha. O resultado usa símbolos repetidos em vez dos ícones específicos da referência. Essas diferenças impedem afirmar que as 12 telas estão iguais.

**Conteúdo e comportamento preservados:** a anamnese existente tem quatro etapas, enquanto a prancha representa vinte perguntas. Jornada, ferramentas, biblioteca e resultado usam os destinos, textos e recomendações existentes. O player conserva os controles e etapas reais. Não foram inventados cursos, downloads, favoritos, fotos de perfil nem dados pessoais para preencher o modelo. A referência do player mostra dia 1; a captura funcional verifica a seleção real do dia 3.

**Comunidade:** apenas apresentação visual com estado vazio, autorizada pelo usuário. Sem publicações fictícias ou novas APIs. O perfil usa o nome e progresso do usuário de teste, sem retrato fictício.

**Áreas congeladas:** cadastro/login mantidos; Reintegração continua usando sua apresentação própria. Os outros três layouts continuam no componente anterior. Correção técnica no círculo animado define o valor inicial já usado pela animação, sem mudar sua trajetória ou aparência.

## Validação e correções

`npm run lint`, `npm test` (5 testes) e `npm run build` aprovados. O build mantém avisos de tamanho de bundle e importação estática/dinâmica do mesmo modal.

[verification.json](docs/visual-qa/natural-sereno/verification.json) registra dez verificações aprovadas, sem erros de console: cliques reais, busca e vazio, progresso, aceite/check-in/player/roteiro, isolamento dos temas, login, entrada persistida e ausência de overflow em 320, 390, 768 e 1440 px. Reprodução: `node scripts/verify-natural-sereno.mjs`, com Vite disponível em `http://127.0.0.1:4173` e Chromium instalado.

Durante a validação foram corrigidos: índice de dia deslocado; tradução de etapa tratada como objeto em vez de texto; nomes de callbacks incompatíveis com o player; roteiro existente não exibido; círculo sem coordenada inicial; rodapé sobrepondo cliques da barra inferior. Nenhuma API, pagamento, regra de recomendação ou definição de jornada foi alterada.

O navegador intercepta as APIs com fixtures e simula a fala para inspecionar a etapa. Isso não valida serviços externos de áudio, dados de produção nem pagamento. O sucesso técnico não equivale à aprovação da fidelidade visual.
