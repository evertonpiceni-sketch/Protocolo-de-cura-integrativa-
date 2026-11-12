# Quatro modelos — restauração e comparação visual

Data: 11/11/2026 (America/Sao_Paulo). Base: `783aacc8210d92f35037a0d06309806b89a96973`.

**final result: blocked**

A implementação dos quatro estilos foi alterada e testada, mas **a igualdade integral às quatro imagens ainda não está certificada**. O bloqueio é de fidelidade visual, não de compilação. Esta entrega deve permanecer em revisão, sem substituir produção como se estivesse homologada.

## Fontes visuais recuperadas

As quatro imagens completas foram recuperadas do commit `5b2789e`, em `public/brand/official-themes/`. Os arquivos históricos tinham extensão `.png`, mas contêm JPEG. Os bytes originais foram preservados, sem recompressão, com extensão `.jpg` em:

- `public/brand/natural-sereno/prancha-modelo.jpg` — 1536 × 1404.
- `public/brand/elegancia-profunda/prancha-modelo.jpg` — 1536 × 1152.
- `public/brand/essencia-luminosa/prancha-modelo.jpg` — 1536 × 1152.
- `public/brand/mistico-moderno/prancha-modelo.jpg` — 1536 × 1152.

Origem, dimensões e SHA-256 estão em `public/brand/reference-layouts.json`. O seletor usa as quatro imagens reais, incluindo versões completas por `srcSet`; não desenha mais um substituto da prancha do Místico Moderno.

## Comparações efetivamente abertas

Evidências em `docs/audits/four-reference-layouts-2026-11-11/`:

- `*-comparison.jpg`: imagem-fonte completa ao lado de capturas reais do aplicativo.
- `*-home-focus.jpg`: recorte da Home de cada fonte ao lado da Home renderizada.
- `*-home.jpg`, `*-welcome.jpg`, `*-player.jpg`, `*-anamnesis.jpg`: capturas ampliadas para conferir detalhes.
- `four-homes.jpg`: quatro estilos implementados na mesma escala.
- `normalization.json`: coordenadas dos recortes e normalização.
- `verification.json`: resultados funcionais e geometrias do player.

Capturas: Chromium local, 390 × 844 CSS px, DPR 1. Responsividade adicional em 320, 768 e 1440 px. As fontes completas mantêm suas dimensões originais; os recortes de Home são normalizados para 390 × 844 apenas na comparação. Moldura, notch e status bar pertencem às imagens demonstrativas, não foram desenhados dentro do aplicativo.

Estado: conta sintética Maria, plano PRO mensal, jornada de 21 dias, dia 3 atual e dois dias concluídos. As pranchas contêm outros nomes, dias, contagens e conteúdo demonstrativo; esses dados não foram falsificados para preencher a interface.

## Histórico da comparação e correções

1. **P1 — Estilos 2–4 usavam uma página genérica.** Havia um hero alto e um bloco de resultado com corpo/chakras; menus, lista de dias, recursos e perfil não seguiam a composição das pranchas. A estrutura funcional foi compartilhada com os quatro temas, conservando os callbacks existentes. As Homes receberam composições diferentes: paisagem integral no Natural Sereno; paisagem com CTA e quatro atalhos na Elegância Profunda; hero claro com atalhos e cartão do dia na Essência Luminosa; cartão do dia, quatro atalhos e destaque no Místico Moderno.
2. **P1 — Contraste do player.** Texto café ficava sobre paisagem escura. A reprodução agora usa texto marfim e controles dourados sobre superfícies escuras. As fases de aceite e check-in mantêm suas regras.
3. **P2 — Retorno do check-in.** O reset de rolagem era exclusivo do Natural Sereno. Passou a valer nos quatro temas; a verificação aguarda a saída da transição e confirma cabeçalho visível e controles no rodapé.
4. **P2 — Cascata compartilhada impedia a cena da Essência Luminosa.** O seletor genérico de estilos não naturais tinha especificidade maior que o do próprio tema. A condição comum usa `:where`, deixando a decisão específica do modelo prevalecer.
5. **P2 — Arte e tipografia inconsistentes.** Fontes licenciadas foram adicionadas localmente. A moldura transparente de folhagens já fornecida no projeto passou a enquadrar os quatro temas. As três cenas reconstruídas foram exportadas para WebP, sem usar capturas de interface como fundo.

6. **P1 — Opções da anamnese com pouco contraste.** A edição passou a expor estado/etapa e seleção por atributos semânticos. Opções da primeira etapa e o painel de frequência receberam foreground/background coerentes; a Elegância Profunda usa painel marfim e texto escuro, preservando as cores simbólicas dos chakras nas outras etapas.

Após as correções, foram feitas novas capturas e comparações completas/focadas. As evidências são do estado final desta branch, não das primeiras tentativas.

## Superfícies de fidelidade

- **Fontes e tipografia:** Cormorant Garamond, Lora, Playfair Display, Montserrat, Inter e JetBrains Mono locais; títulos, texto de apoio, hierarquia e quebras foram comparados. A identificação de fontes a partir de uma prancha rasterizada não prova equivalência tipográfica exata.
- **Espaçamento e composição:** Homes diferenciadas; listas compactas; navegação de quatro itens no Natural Sereno e de cinco nos estilos 3/4; atalhos de cuidado na Home do estilo 2, sem barra inferior persistente nessa prancha. Adaptado a desktop sem inserir molduras de telefone no produto.
- **Cores e tokens:** marfim/café/dourado no estilo 1; verde profundo/champagne no 2; marfim/champagne/sálvia no 3; noturno/teal, dourado e acentos frios nos atalhos do 4. Cores simbólicas e estados funcionais não foram redefinidos como conteúdo novo.
- **Imagens e arte:** pranchas originais preservadas; logo oficial existente reutilizado; cenários independentes reconstruídos por Image Gen nos estilos 2–4. Esses cenários não são os arquivos fotográficos originais nem equivalem pixel a pixel à prancha. Ícones funcionais continuam sendo da biblioteca existente.
- **Texto e conteúdo:** mantidos dados reais da conta, catálogo público atual, permissões, anamnese existente, jornadas e retornos de ações. Não foram criados avatares de pessoas, publicações, cursos, favoritos ou downloads para imitar conteúdo fictício da referência.

## Achados ainda abertos

- **P1 — Igualdade literal das imagens não atendida.** As cenas reconstruídas diferem dos cenários das composições; ornamentação e ilustrações também não têm equivalência exata. É necessário continuar a produção/comparação dos assets, ou obter os assets originais separados, antes de afirmar que os estilos ficaram iguais às imagens. Aprovação técnica não resolve esta pendência.
- **P2 — Estados diferentes da prancha.** O formulário existente é uma anamnese compacta em etapas, enquanto as composições mostram 20 perguntas; o catálogo público se chama Recursos e não expõe a Biblioteca privada. A entrada permanece neutra até a escolha explícita; portanto, o splash específico de cada prancha não foi simulado como se tivesse sido implementado. Essas diferenças estão identificadas nas comparações.
- **P2 — Homologação visual integral pendente.** Detalhes de tipografia, ornamentos, recortes, brilho e proporções ainda exigem avaliação contra os quatro modelos completos; não há aceite final registrado para esta implementação.

## Validação funcional

- `npm run lint`: aprovado.
- `npm test`: 172 testes aprovados, incluindo integridade das quatro pranchas recuperadas.
- `npm run build`: aprovado; permanece o aviso de tamanho de bundle existente.
- `node scripts/verify-four-reference-layouts.mjs`: quatro estilos aprovados, 17 estados por estilo, 68 capturas, sem erros JavaScript.
- Testados: escolha explícita e persistência simulada do tema; menus; ferramentas; recursos, filtro e vazio; comunidade vazia; perfil/progresso; abertura do resumo e da primeira etapa de edição da anamnese; resultado; 21 dias; aceite/check-in/player; configurações; acolhimento e entrada.
- Sem overflow horizontal nas quatro larguras verificadas; navegação/atalhos visíveis e descobertos no hit test. O cabeçalho e o rodapé do player são conferidos depois das transições.

Todas as APIs foram interceptadas com fixtures. Nenhuma conta, publicação, cobrança ou dado de produção foi modificado. A narração usa MP3 de teste interceptado; isso não certifica voz, cobrança ou integrações em produção.

## Reprodução e limites de entrega

No repositório, com dependências instaladas:

```sh
npx vite --host 0.0.0.0 --port 4173 --strictPort
```

Em outro processo:

```sh
FOUR_LAYOUTS_OUT=/tmp/four-reference-layouts node scripts/verify-four-reference-layouts.mjs
```

O navegador desta verificação é o Chromium local do ambiente, não uma sessão conectada do usuário. A implementação está preparada para revisão em branch. Não houve merge nem publicação de produção.

O relatório anterior do Natural Sereno permanece recuperável no histórico em `783aacc:design-qa.md`.

## Revisão das regressões de 12/11/2026

Ver `docs/audits/reported-regressions-2026-11-12/README.md`: contraste de planos e numerologia, aprofundamento das leituras, remoção do corpo dos fundos da Home, modelo compartilhado no protocolo e tratamento de falhas da Reintegração. Testes locais de interface passaram nos quatro estilos. A chamada real de voz em produção retornou 503; restabelecer o serviço e confirmar modelos separados de Reiki continuam pendentes. O resultado global permanece **blocked**, sem equivalência integral certificada nem publicação.

## Referência de Reiki recebida em 12/11

O usuário forneceu a prancha única `public/brand/jornada-integrada-21-dias-aprovada.jpg`, preservada sem edição. Ela define 21 cenas em três ciclos de sete dias: São Miguel, Chama Violeta e Rafael. A hipótese anterior de três artes separadas está superada. A prancha foi incorporada à tela do percurso com acesso ao original ampliado. O player legado ainda contém sete dias de chakras; sua conversão ao roteiro integrado de 21 dias permanece pendente e não está homologada por esta inclusão da referência.
