# Auditoria — Estilo 4 · Místico Moderno — Run 25
Data: 07/11/2026
Base: `main` em `cbb68335f80fc64580c68d2722f6b1ead95f5159`
Branch: `fix/mistico-moderno-mainline-2026-11-07`

## Referência visual
- O seletor passa a usar `public/brand/mistico-moderno/prancha-oficial.webp`, derivação WebP já registrada na branch anterior e visualmente identificada como a prancha “ESTILO 4 — MÍSTICO MODERNO”.
- A prancha é usada somente como prévia/card; não foi transformada em fundo global.
- O PNG original `1001196522.png` / `file_000000009978820eb49581883ae6340d` não foi localizado nos arquivos da conversa nem na Biblioteca nesta execução. A derivação disponível é 320 × 180; a conferência pixel a pixel com o original permanece pendente.

## Corrigido
- O cartão do Estilo 4 deixa de herdar a superfície branca dos demais cartões: agora usa fundo noturno, tipografia marfim e borda violeta/dourada.
- A prévia do Estilo 4 exibe sua própria prancha, com enquadramento `object-contain`, fundo azul-noturno e moldura dourada.
- Logout agora limpa a confirmação de layout da conta encerrada, remove `data-layout` imediatamente e zera a solicitação de escolha. A próxima conta precisa confirmar explicitamente seu próprio estilo.
- Arcanjo/Solfeggio recebeu camada visual noturna isolada por `data-layout="mistico-moderno"`; os IDs de escopo foram adicionados ao contêiner, backdrop, palco do corpo e legenda.

## Varredura estática por página/fluxo
- Seletor e prévias: React `LayoutChoiceModal`; seleção inicial nula e confirmação desabilitada até escolha explícita.
- Home/dashboard/cabeçalho/navegação: camadas Místico existentes preservadas.
- Player e sessões: `mistico-moderno-session-audit.css` preservado; política `protocolSessionAudioPolicy` continua impedindo Solfeggio tonal de reiniciar como trilha de fundo durante a narração principal.
- Diário e Diário de Reconexão: camadas `daily-diary` e `journal` preservadas.
- Anamnese/guias, cursos, mapas/numerologia, conquistas, banhos, Ho'oponopono, certificado, Prática Específica, promoções, contato, vídeo, instalação móvel e ajustes de áudio: módulos atuais preservados.
- Os 22 módulos CSS Místico já existentes foram examinados: todos os seletores encontrados permanecem sob `data-layout="mistico-moderno"`. A nova camada Arcanjo também é estritamente escopada.
- O seletor DOM legado permanece desativado; o seletor React é o único fluxo autoritativo.
- InfinitePay permanece com checkout e confirmação server-side. Testes existentes mantêm R$ 59,90/7 dias e R$ 99,90/21 dias; PROMO15/PROMO20 são descontos de prática e VIP7 permanece exclusivo do acesso VIP de 7 dias. Nenhuma rota, preço ou cupom foi alterado.

## Preservado
- Paleta noturna atual (azul-noturno, índigo, violeta, dourado/âmbar e marfim); sem recoloração global.
- Prévias e regras aprovadas dos Estilos 1, 2 e 3, inclusive os ajustes mais recentes da `main`.
- Conteúdo, roteiros, Diário, player, animações compartilhadas, `SacredEnergyCanvas`, Reintegração da Vida e assinatura oficial discreta.
- Checkout InfinitePay e política de confirmação server-side.

## Pendente
- Homologação visual renderizada de todas as telas em desktop e mobile; esta rodada é estática, sem navegador autenticado.
- Voz: a Home e Arcanjo ainda apresentam caminhos distintos entre voz local/ElevenLabs e fallback nativo. O identificador exato escolhido pelo usuário não foi confirmado; nenhum ID foi substituído nem uma voz presumida como aprovada. A reprodução real precisa ser conferida antes de alterar a rota.
- Teste de áudio real: Solfeggio no Arcanjo, player, pausa/retomada, Media Session e encerramento de sessão.
- Checkout InfinitePay ponta a ponta em sandbox; nenhuma cobrança real foi executada.
- Deploy de preview: o status atual da Vercel na `main` indica bloqueio `build-rate-limit`; a homologação hospedada depende da liberação do limite.
- CI desta branch ainda precisa concluir TypeScript, testes, build e auditoria de dependências.

## Arquivos alterados
- `public/brand/mistico-moderno/prancha-oficial.webp`
- `src/components/LayoutChoiceModal.tsx`
- `src/App.tsx`
- `src/components/ArcanjoProtocolView.tsx`
- `src/main.tsx`
- `src/mistico-moderno-arcanjo-audit.css`
- `tests/mistico-moderno-mainline-audit.test.ts`
- `docs/audits/mistico-moderno-2026-11-07/AUDITORIA_RUN_25.md`
