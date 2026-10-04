# Natural Sereno — auditoria da implementação

final result: blocked

Implementação funcional validada; a equivalência visual integral com a prancha ainda não está concluída. Não iniciar o Estilo 2.

## Referência e evidências

Referência congelada: painel aprovado `1001196520.jpg`, copiado para [reference.jpg](docs/visual-qa/natural-sereno/reference.jpg). Os outros três painéis não orientam esta implementação.

[Comparação das 12 telas](docs/visual-qa/natural-sereno/comparison-board.jpg): referência à esquerda, aplicação à direita em cada par. Capturas Chromium em 390 × 844 CSS px, DPR 1. Os recortes da prancha foram redimensionados para essa área; a referência inclui dispositivos e tem resolução limitada. Comparações ampliadas: [Carregamento](docs/visual-qa/natural-sereno/compare-loading.png), [Boas-vindas](docs/visual-qa/natural-sereno/compare-welcome.png), [Resultado](docs/visual-qa/natural-sereno/compare-result.png), [Home](docs/visual-qa/natural-sereno/compare-home.png), [Menu](docs/visual-qa/natural-sereno/compare-menu.png), [Player](docs/visual-qa/natural-sereno/compare-player.png). Captura adicional do [Portal de Aceite](docs/visual-qa/natural-sereno/portal.png).

## Superfícies auditadas

- Estrutura e proporções: Home com cena alta, mensagem em cartão, CTA dourado e barra inferior; Menu com seis linhas; listas com ícone/miniatura, descrição e seta. A comparação levou ao aumento da cena, tipografia e linhas, e à retirada do cabeçalho institucional nas telas internas.
- Tipografia: serifadas Lora/Cormorant, hierarquia editorial, corpo legível. Não há correspondência tipográfica exata comprovada com o arquivo original da prancha.
- Paleta e acabamento: marfim, verde floresta e dourado, bordas claras, botões arredondados com luz e sombras. Todos os novos seletores são restritos ao layout `natural-sereno`.
- Imagens e ornamentação: vale ao amanhecer, folhagens, cachoeira, Reiki e aromas. O logo oficial existente foi preservado. As cenas reconstruídas reproduzem a atmosfera, mas não são os assets originais isolados da prancha.
- Controles e estados: navegação inferior, busca/filtro, progresso, entrada, aceite, player, roteiro e comunidade vazia foram exercitados no aplicativo real com fixtures locais.

## Diferenças pendentes e limites de escopo

**P2 — transposição visual restante:** a prancha usa retratos/cenas distintos por dia e categoria; o app usa cinco cenas alternadas na lista e reaproveita algumas imagens na biblioteca. Para maior fidelidade, produzir miniaturas individuais adequadas aos títulos reais, seguindo exclusivamente o Estilo 1. A figura do carregamento já foi reposicionada, mas a iluminação e o recorte ainda não coincidem com a prancha. O player mantém etapas/respiração e navegação extras exigidos pelo funcionamento existente: continuar ajustando a composição ao redor desses controles, preservando-os. Essas diferenças impedem afirmar que as 12 telas estão iguais.

**Conteúdo e comportamento preservados:** a anamnese existente tem quatro etapas, enquanto a prancha representa vinte perguntas. Jornada, ferramentas, biblioteca e resultado usam os destinos, textos e recomendações existentes. O player conserva os controles e etapas reais. Não foram inventados cursos, downloads, favoritos, fotos de perfil nem dados pessoais para preencher o modelo. A referência do player mostra dia 1; a captura funcional verifica a seleção real do dia 3.

**Comunidade:** apenas apresentação visual com estado vazio, autorizada pelo usuário. Sem publicações fictícias ou novas APIs. O perfil usa o nome e progresso do usuário de teste, sem retrato fictício.

**Áreas congeladas:** cadastro/login mantidos; Reintegração continua usando sua apresentação própria. Os outros três layouts continuam no componente anterior. Correção técnica no círculo animado define o valor inicial já usado pela animação, sem mudar sua trajetória ou aparência.

## Validação e correções

`npm run lint`, `npm test` (5 testes) e `npm run build` aprovados. O build mantém avisos de tamanho de bundle e importação estática/dinâmica do mesmo modal.

[verification.json](docs/visual-qa/natural-sereno/verification.json) registra doze verificações aprovadas, sem erros de console: cliques reais, busca e vazio, progresso, aceite/check-in/player/roteiro, isolamento dos temas, login, entrada persistida e ausência de overflow em 320, 390, 768 e 1440 px. Reprodução: `node scripts/verify-natural-sereno.mjs`, com Vite disponível em `http://127.0.0.1:4173` e Chromium instalado.

Durante a validação foram corrigidos: índice de dia deslocado; tradução de etapa tratada como objeto em vez de texto; nomes de callbacks incompatíveis com o player; roteiro existente não exibido; círculo sem coordenada inicial; rodapé sobrepondo cliques da barra inferior. Nenhuma API, pagamento, regra de recomendação ou definição de jornada foi alterada.

O navegador intercepta as APIs com fixtures e simula a fala para inspecionar a etapa. Isso não valida serviços externos de áudio, dados de produção nem pagamento. O sucesso técnico não equivale à aprovação da fidelidade visual.

## Continuação — segunda produção do Estilo 1

A nova comparação substitui as capturas anteriores no mesmo diretório, mantendo o painel aprovado intacto. Foram corrigidas diferenças registradas na primeira auditoria:

- Carregamento: cena própria de meditação na floresta com chakras, mensagem aprovada e indicação indeterminada de carregamento. Não usa mais a cachoeira do player. Logo oficial original mantido pequeno, com tratamento de mistura para reduzir o fundo claro. As adições permanecem ocultas nos outros layouts.
- Boas-vindas: floresta própria sem cachoeira, luz dourada, CTA na base e controle de áudio central ampliado com onda dourada raster transparente, própria desse layout. Mesmos callbacks de voz e entrada persistida.
- Telas claras: folhagens raster transparentes nos cantos e papel marfim com paisagem suave ao fundo. A primeira versão dos ramos invadia o centro da lista; o asset foi regenerado com centro livre e cantos compactos.
- Resultado: símbolos distintos de frequência, chakra, floral, aroma, protocolo e duração; textos e motor de recomendação permanecem intactos.
- Player: dia/título da prática ganham destaque; etapa, respiração, mantra, roteiro, navegação entre etapas e controle de áudio continuam disponíveis. Corrigido contraste do número no cabeçalho. Reprodução e saltos de 15 segundos foram ampliados; a verificação adicional confirma que o controle principal permanece visível em 320, 390, 768 e 1440 px, sem overflow.
- Perfil: avatar simbólico discreto e linhas mais próximas da densidade do painel, usando os mesmos dados e destinos.
- Biblioteca: miniatura legível para chakras, restrita ao conjunto de imagens do Natural Sereno. QA agora verifica também que todas as miniaturas carregam. A Jornada alterna cinco cenas do próprio tema, em vez de duas.

Validação desta continuação: lint, os cinco testes, build e doze verificações de navegador aprovados, sem erros de console. Os limites da simulação de APIs e fala permanecem os mesmos. Nenhuma mudança nova foi feita na Reintegração, pagamentos, APIs ou outros três estilos.

O resultado visual continua `blocked`: esta é uma continuação revisável na PR #24, sem declarar a transposição integral concluída e sem iniciar o Estilo 2.

A última comparação focada conferiu carregamento, onda de boas-vindas e player ampliado lado a lado com a referência. A Home foi recapturada depois do ajuste de peso da citação. Anamnese recebeu corpo de 15 px e título de 32 px, com as mesmas quatro etapas existentes.
