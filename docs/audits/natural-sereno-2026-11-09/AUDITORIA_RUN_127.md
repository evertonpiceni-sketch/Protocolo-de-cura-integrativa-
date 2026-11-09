# Auditoria RUN 127 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD anterior:** `4e17fff292adee4a2a23b7f086a7ae6a8a4715da`

## Achado e correção

A varredura das 12 folhas CSS encontrou declarações ativas ainda usando o dourado antigo `#B88736`, o âmbar escuro `#8F631E`, o dourado amarelado `#CDAA57` e variantes RGB antigas. Parte delas estava justamente na camada final `natural-sereno-approved-overrides.css`, portanto não era apenas resíduo histórico: alguns botões, bordas, ícones e textos ainda poderiam renderizar com a tonalidade anterior.

Atualizei sete folhas que continham declarações ativas: `natural-sereno.css`, `natural-sereno-refinement.css`, `natural-sereno-mobile-fixes.css`, `natural-sereno-milestone-audit.css`, `natural-sereno-legacy-green-audit.css`, `natural-sereno-approved-overrides.css` e `natural-sereno-home-surface-audit.css`.

- CTAs que ainda tinham fundo antigo passaram a usar gradiente `#E2B96B → #C89D52`, texto café `#2A2421` e borda `#A87E37`.
- Textos/ícones de destaque passaram ao dourado escuro `#A87E37`.
- Bordas e brilhos sutis passaram ao dourado refinado `rgba(200,157,82,...)`.
- Os seletores que procuram classes antigas como `bg-[#B88736]` ou `text-[#B88736]` foram preservados para neutralizar componentes legados; somente valores de declarações foram atualizados.

Também corrigi o texto secundário da Home, que ainda usava `#8F631E`, e incluí a folha `natural-sereno-home-surface-audit.css` na correção. No painel administrativo, o botão de ação ainda herdava fundo sálvia sólido; ele passou a usar o gradiente dourado premium, texto café e borda refinada. O contorno antigo `#CDAA57` também foi substituído.

Adicionei `tests/natural-sereno-approved-gold-palette.test.ts`, que percorre as 12 folhas, verifica o CTA do painel administrativo e impede que tokens antigos voltem a aparecer em declarações CSS ativas.

## Referência visual

A cópia versionada `docs/visual-qa/natural-sereno/reference.jpg` foi aberta. A prancha mostra a composição original do Estilo 1, mas também detalhes antigos (chapas verdes, corpo/chakras e logo mais forte). Ela continua sendo o card/referência oficial de composição; paleta clara, corpo neutro e logo sutil das decisões posteriores prevalecem. O PNG original `1001196520.png` / ID informado não foi recuperado independentemente.

## Preservado

- Creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento natural.
- Fotografias realistas, enquadramentos responsivos, tipografia e botões premium.
- Logo oficial transparente/discreto.
- Seletor explícito dos quatro estilos.
- Voz neural, política Solfeggio, Diário, player, corpo neutro e animações.
- Preços, cupons, validação server-side e proteção InfinitePay.
- Estilos 2, 3 e 4 sem redesenho.

## Validação

A nova CI desta branch ainda precisa executar. A validação anterior do HEAD `4e17fff292adee4a2a23b7f086a7ae6a8a4715da` foi run `42677230012`, com 247/247 testes, npm audit sem vulnerabilidades, TypeScript e build aprovados.

## Pendências

- PR #79 permanece divergente: 87 commits à frente e 8 atrás de `main`, `mergeable=false`. As alterações posteriores da Elegância Profunda em componentes compartilhados devem ser reconciliadas sem regressões.
- PR #83 contém a correção pontual do guardião de áudio por `#arcanjo-protocol-view`; CI 162/162, aguardando integração e preview.
- A implantação Vercel do commit de áudio terminou em `BUILD_FAILED — Resource provisioning failed`, sem logs de evento. Não há preview READY.
- Ainda faltam homologação visual renderizada em desktop/mobile, escuta real dos áudios e sandbox InfinitePay.
- Nenhuma cobrança, merge ou publicação em produção.

