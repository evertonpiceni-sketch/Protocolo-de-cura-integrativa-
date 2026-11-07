# Auditoria Run 65 — Estilo 3 · Essência Luminosa

**Data:** 7 de novembro de 2026  
**Branch:** `main`  
**Base inspecionada:** `d503057a37aee8f84fe5bcd8a01cde85acb468b2`  
**Referência visual:** prancha original `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`, recuperada e inspecionada nesta execução. O card do seletor aponta para `public/brand/essencia-luminosa/prancha-oficial.webp`; a imagem versionada corresponde à prancha e permanece restrita à prévia.

## Corrigido

- Identificado texto branco sobre gradientes claros de sálvia/champagne/ouro em quatro camadas do Estilo 3:
  - Anamnese: o botão selecionado usava branco sobre o gradiente ouro suave → ouro escuro. O texto passou para `#221D17`, preservando o gradiente e o estado.
  - Instalação móvel, Numerologia e Player: CTAs com fundos claros passaram a usar `var(--layout-text)`.
- Acrescentados testes de regressão para contraste dos quatro grupos de botões e para impedir que os seletores DOM legados voltem a ser carregados.

## Preservado

- Paleta aprovada vigente: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`; não foram restauradas cores antigas da prancha.
- Prancha original como referência; o derivado WebP existente continua sendo usado somente no card de prévia.
- Seletor React com seleção inicialmente vazia e confirmação explícita. `App.tsx` só define `data-layout` depois da confirmação; a preferência salva não é consentimento automático.
- `OnboardingFlow` ativo; `WelcomeModal` legado e os patches DOM antigos de seleção permanecem fora dos imports ativos.
- Logo oficial como assinatura discreta (opacidade de 30%, com redução em telas pequenas).
- Voz neural escolhida, fallback oficial Marianne para identificadores legados, política que impede retomar frequências Solfeggio tonais durante a narração, Diário, conteúdo, player, animações e paleta do canvas.
- Preços, cupons, checkout InfinitePay e confirmação server-side; nenhuma rota ou regra comercial foi alterada.
- Identidades dos Estilos 1, 2 e 4.

## Varredura estática por página/fluxo

- **Acesso e pré-seleção:** `ProfileSetup` permanece neutro antes da escolha.
- **Seletor:** quatro estilos; prancha própria da Essência Luminosa no card; confirmação obrigatória.
- **Home, cabeçalho e navegação inferior:** camadas específicas do Estilo 3 conferidas. A Home ainda declara `--ep-scene: none`; portanto, não há fotografia de natureza própria aplicada.
- **Acolhimento:** `OnboardingFlow` ativo, com CSS próprio e logo discreto.
- **Anamnese/Mapa do Momento e Guia dos Chakras:** camadas próprias; cores individuais dos chakras permanecem semânticas, não são tratadas como herança de tema.
- **Banhos de Ervas, Numerologia, Mapa Astral, Ho'oponopono, Cursos/Biblioteca, Contato e Conquistas:** camadas próprias ou overrides específicos confirmados.
- **Diário e Diário de Reconexão:** superfícies, estados e controles mapeados para tokens atuais.
- **Player, respiração e canvas:** paleta ouro/sálvia; respeito a movimento reduzido; Solfeggio tonal bloqueado como fundo durante a narração.
- **Ajustes de áudio, vídeo promocional, dicas, marcos e instalação móvel:** overrides específicos conferidos.
- **Planos e pagamentos:** estilos visuais isolados; fluxo de checkout/retorno preservado.

A varredura desta execução foi estática por código/imports/testes; não houve captura visual real em navegador desktop ou celular.

## Pendente

- **Natureza realista:** não há fotografia independente aprovada dentro de `public/brand/essencia-luminosa`; a pasta contém somente a prancha do card. Não reutilizei imagens do Natural Sereno nem da Reintegração. A Home continua sem cena fotográfica até existir um ativo próprio aprovado.
- Homologação visual com capturas reais de todas as páginas em desktop e celular.
- Testes de execução real da voz neural, transições de áudio/Solfeggio, pausa/retomada e animações em dispositivos.
- Checkout, retorno e webhook InfinitePay em sandbox.
- Segurança de dependências: o workflow anterior da base auditada registrou 9 vulnerabilidades (3 moderadas e 6 altas); a etapa de enforcement falhou. Não foram feitas atualizações indiscriminadas nesta correção visual.
- Publicação: o status Vercel conhecido para a base estava em falha por `build-rate-limit`; não há deploy de produção homologado.
- CI da nova correção e dos testes recém-adicionados: aguardando a execução do GitHub Actions.

**Status:** corrigido o contraste dos CTAs claros e adicionada proteção de regressão. A identidade aprovada e os fluxos funcionais foram preservados. A homologação visual/funcional completa continua aberta.
