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

**P2 — fidelidade restante:** as miniaturas repetidas foram eliminadas: a Jornada tem 21 cenas próprias e a Biblioteca seis imagens distintas. Carregamento, Home e player agora usam reconstruções orientadas por recortes do painel, com a mesma composição de figura frontal, vale ao amanhecer e cachoeira estreita. A comparação ainda mostra diferenças de acabamento: peso/tamanho da tipografia secundária, brilho das bordas e botões, proporção das folhagens e distribuição vertical de alguns cabeçalhos. Essas diferenças impedem declarar reprodução integral ou iniciar o Estilo 2. Os assets foram reconstruídos a partir do painel; não são arquivos originais isolados.

**Conteúdo e comportamento preservados:** a anamnese existente tem quatro etapas, enquanto a prancha representa vinte perguntas. Jornada, ferramentas, biblioteca e resultado usam os destinos, textos e recomendações existentes. O player conserva os controles e etapas reais. Não foram inventados cursos, downloads, favoritos, fotos de perfil nem dados pessoais para preencher o modelo. A referência do player mostra dia 1; a captura funcional verifica a seleção real do dia 3.

**Comunidade:** apenas apresentação visual com estado vazio, autorizada pelo usuário. Sem publicações fictícias ou novas APIs. O perfil usa o nome e progresso do usuário de teste, sem retrato fictício.

**Áreas congeladas:** cadastro/login mantidos; Reintegração continua usando sua apresentação própria. Os outros três layouts continuam no componente anterior. Correção técnica no círculo animado define o valor inicial já usado pela animação, sem mudar sua trajetória ou aparência.

## Validação e correções

`npm run lint`, `npm test` (5 testes) e `npm run build` aprovados. O build mantém avisos de tamanho de bundle e importação estática/dinâmica do mesmo modal.

[verification.json](docs/visual-qa/natural-sereno/verification.json) registra dezessete verificações aprovadas, sem erros de console: cliques reais, busca e vazio, progresso, aceite/check-in/player/roteiro, isolamento dos temas, login, entrada persistida e ausência de overflow em 320, 390, 768 e 1440 px. Reprodução: `node scripts/verify-natural-sereno.mjs`, com Vite disponível em `http://127.0.0.1:4173` e Chromium instalado.

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


## Continuação — terceira produção do Estilo 1

As evidências acima foram recapturadas após os últimos assets, no app real. Foram conferidos juntos os doze pares de referência e renderização.

- Jornada: 21 arquivos WebP individuais, com temas dos dias reais; nenhuma alteração dos títulos, etapas ou seleção. A Home usa a miniatura do dia atual.
- Biblioteca: seis imagens individuais correspondentes aos destinos existentes. Busca com lupa, campo sem fundo cinza interno e densidade ajustada para as seis linhas caberem acima da navegação em 390 × 844.
- Fundos: reconstrução a partir dos recortes aprovados de carregamento, Home e player; removidos textos e interface da arte de fundo. Logo oficial permanece no componente existente.
- Player: título do dia em primeiro plano; orientação de etapa e respiração organizada lado a lado; mantra e controles preservados. Novas classes são apenas ganchos de CSS restrito ao Natural Sereno.
- Anamnese: cartão da frequência em marfim/verde/dourado, sem alterar áudio, perguntas ou respostas.
- Perfil e contato: linhas mais compactas e ação de contato colocada no fluxo das telas internas, evitando cobertura dos últimos itens pela ação flutuante.

Validação final desta produção: lint, cinco testes e build aprovados; quatorze verificações de navegador aprovadas, sem erros de console. O build conserva os avisos existentes de tamanho de bundle e importação mista. As verificações adicionais confirmam 21 imagens distintas carregadas e seis imagens da Biblioteca distintas, carregadas e visíveis acima da barra.

`final result: blocked` continua sendo o estado de fidelidade integral, pelos ajustes de acabamento descritos acima. Esta produção é revisável na PR #24. Nenhuma modificação nova foi feita em pagamentos, APIs, Reintegração ou nos outros três estilos.


## Continuação — quarta produção do Estilo 1

A comparação seguinte ajusta o acabamento diretamente contra o painel: hierarquia serifada mais forte, botão dourado com borda dupla iluminada e relevo, cartão da Home de 195 px e CTA de 70 px, ícones de 66 px no Menu, textos secundários mais legíveis e navegação com símbolos maiores. Menu e Perfil foram compactados onde necessário para manter a última ação visível acima da barra. O título da Biblioteca foi ajustado para evitar que a nova tipografia deslocasse o sexto item sob a navegação.

O player conserva todas as etapas e controles: o título foi elevado, o cabeçalho ficou translúcido e o espaço antes do rodapé foi reduzido. Boas-vindas recebe arte limpa reconstruída do recorte aprovado, com centro verde livre, folhagens no alto, luz dourada e pedras na base, preservando callbacks e conteúdo.

A auditoria funcional inclui agora as últimas linhas do Menu e do Perfil e abertura/fechamento do contato. O estado de fidelidade integral permanece bloqueado: a fonte exata e os assets originais não estão disponíveis; há diferenças na escala da onda de boas-vindas, bordas/ornamentos e distribuição dos controles adicionais do player. A comparação registra essas diferenças sem alterar conteúdo nem excluir recursos existentes.


A quarta produção passou em lint, nos cinco testes e no build. Dezesseis verificações Chromium passaram, sem erros de console. Além das verificações anteriores, as seis linhas do Menu e a ação Sair do Perfil cabem acima da barra em 390 × 844; o contato abre e fecha com o callback existente. A entrada no player agora também verifica `scrollTop === 0`: a apresentação rolável do check-in deixava sua posição na tela seguinte, corrigida com reposicionamento somente no Natural Sereno, sem alterar etapas, áudio ou APIs.


A medição de estilo calculado detectou ainda o espaçamento legado de 16 px na área principal do player mobile, apesar do espaçamento de 90 px especificado pelo tema. A regra final passa a prevalecer explicitamente, restrita ao Natural Sereno, e a QA verifica os 90 px calculados. Os controles extras existentes permanecem disponíveis.


## Correção da entrada apontada pelo usuário

A captura enviada na prévia mostrou o cadastro com cartão escuro e a arte de cinco figuras da Reintegração ao fundo. A inspeção confirmou que o CSS legado de `ep-auth-style-one` referenciava explicitamente essa imagem. Isso não correspondia ao Natural Sereno exigido para cadastro/login.

Correção restrita ao shell de autenticação existente: paisagem do Natural Sereno, papel marfim, folhagem, tipografia verde, campos claros, dourado nos controles e logo oficial discreto. Não altera campos, validação, handlers, APIs, pagamento ou fluxo de entrada. A Reintegração mantém seus próprios assets e componentes. O cadastro/login fica independente do ID do tema do perfil, inclusive quando outro layout foi usado anteriormente.

Evidências adicionais: `docs/visual-qa/natural-sereno/registration.png` e `login.png`. Lint, cinco testes, build e dezessete verificações Chromium aprovados. A verificação de entrada exercita as abas reais sem submeter dados e confere os fundos do cartão e campos sob os quatro IDs de tema. A alteração corrige a entrada; não declara a equivalência integral das doze telas concluída.

## Cadastro — correções solicitadas e publicação autorizada

O painel opcional preserva o marfim do Natural Sereno sob os quatro IDs de tema. Horário/cidade e cartões de voz passam a uma coluna em telas estreitas; rodapés permitem quebra sem sobreposição. Autofill mantém marfim, o logo oficial original fica legível em 76 px sem opacidade reduzida, e a folhagem deixa de esticar ao longo do formulário expandido.

A identificação como voz de Éverton foi removida do cadastro, anamnese e metadados de voz. Uma amostra masculina Brian/ElevenLabs, com texto de acolhimento sem identificação pessoal, fica em arquivo público de 5,75 s e funciona antes do login sem liberar a API de narração autenticada. O alias masculino usa ELEVENLABS_MALE_VOICE_ID ou Brian; a voz oficial congelada da Reintegração não foi alterada.

O erro FUNCTION_INVOCATION_FAILED na prévia foi associado à ausência de JWT_SECRET no ambiente preview. Foi configurado um segredo exclusivo para preview; o segredo de produção não foi lido nem alterado. A publicação de produção deve ser um build de main com as variáveis de produção, não promoção de um build preview com segredo diferente. Falhas de cadastro não JSON agora apresentam mensagem de indisponibilidade e tentativa novamente.

Validação: lint, cinco testes e build; 18 verificações Chromium sem erros; cadastro válido, sessão, sincronização do perfil, login e duplicidade em banco local isolado, sem criar contas reais; erro HTTP 500 não JSON validado no navegador. Evidências: registration.png, login.png, registration-options.png e verification.json em docs/visual-qa/natural-sereno.

O usuário autorizou publicar a versão atual e continuar ajustes. A auditoria de fidelidade integral das 12 telas segue com as diferenças documentadas; não inicia Estilo 2.
