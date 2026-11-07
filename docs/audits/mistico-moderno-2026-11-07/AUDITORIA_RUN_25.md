# Auditoria — Estilo 4 Místico Moderno (Run 25)
Data: 2026-11-07
Base verificada: `main` em `007382902a888618d5ab203ff2672ea990cc181c`
Branch de correção: `fix/style4-mistico-current-main-2026-11-07`

## Referência oficial
A prancha já existente em `public/brand/mistico-moderno/prancha-oficial.webp` foi recuperada do trabalho anterior, aberta e inspecionada visualmente. Ela apresenta a composição noturna Místico Moderno com índigo, esmeralda, violeta e acentos dourados. O seletor passa a usar essa prancha como cartão de referência, sem reutilizar cartões antigos de outros estilos. O PNG original `1001196522.png` / `file_000000009978820eb49581883ae6340d` não ficou acessível no índice de arquivos desta execução; portanto, o WebP existente foi preservado como derivado já versionado, não declarado como uma nova cópia byte a byte do PNG.

## Corrigido nesta rodada
- O cartão do Místico Moderno no seletor deixa de usar o preview genérico/claro e passa a mostrar a prancha oficial em superfície noturna, com borda violeta e acento dourado.
- A confirmação do tema continua obrigatória. O logout agora limpa a confirmação da sessão e a próxima conta precisa escolher novamente.
- O catálogo ElevenLabs passa a ser carregado também no Estilo 4. Ajustes e Home usam o ID neural salvo no perfil; Sessão e Arcanjo exigem esse ID e deixam de substituí-lo por voz fixa ou voz nativa do navegador.
- A proteção de áudio do Místico Moderno falha de forma explícita quando não há ID ElevenLabs válido; não converte falha de rede em narração robótica do navegador.
- O CSS noturno de Arcanjo/Solfeggio passa a alcançar a tela real: foram adicionados os IDs que faltavam no root, backdrop, imagem do corpo e legenda, e a folha foi importada em `main.tsx`.
- A assinatura oficial mantém opacidade de 30%, mas o invólucro perde fundo, borda e brilho para não virar um selo visual.
- O aviso de voz do Arcanjo deixa de citar apenas o Estilo 2.

## Preservado
- Os quatro estilos oficiais, as decisões aprovadas e a seleção explícita antes de aplicar qualquer tema.
- Os 22 módulos CSS existentes do Místico Moderno: varredura estática confirmou seletores restritos ao atributo `data-layout="mistico-moderno"`. A nova folha de Arcanjo segue a mesma regra.
- A política de áudio: frequências Solfeggio não reiniciam como trilha global durante a narração; ambiência não tonal como ondas pode continuar. Arcanjo mantém seu próprio sintetizador de frequência e o interrompe ao pausar/parar.
- InfinitePay, catálogo e valores: R$ 59,90 / 7 dias; R$ 99,90 / 21 dias; PROMO15 e PROMO20 no checkout. VIP7 permanece restrito à degustação de 7 dias. Nenhum endpoint, preço ou cupom foi alterado.
- Conteúdos, roteiros, mapas, Diário, progresso e os outros estilos não foram redesenhados.

## Pendente
- Executar CI (TypeScript, testes e build) na branch nova.
- Homologação renderizada página por página em desktop e celular; a varredura desta rodada foi estática, não um teste visual de navegador.
- Ouvir a voz efetivamente escolhida pelo usuário em Home, Sessão e Arcanjo; o código agora usa o ID salvo, mas a audição real depende do catálogo/credenciais ElevenLabs disponíveis no ambiente.
- Confirmar a prancha PNG original em uma leitura direta do arquivo, caso volte a ficar disponível. O WebP existente foi usado sem alegar equivalência binária.

## Segurança de integração
A PR #42 não foi reaproveitada como base: sua branch está divergente de `main` (21 commits à frente e 94 atrás na comparação feita nesta execução). As correções foram reconstituídas em uma branch limpa a partir do `main` atual, evitando mesclar regressões de versões antigas.
