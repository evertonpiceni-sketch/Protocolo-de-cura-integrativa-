# Auditoria RUN 72 — Estilo 2: Elegância Profunda

Data: 2026-11-07  
Branch: `main`  
HEAD inicial desta rodada: `d9f60054a2efd4146e9f816274df6c385a858b62`  
HEAD após as correções: `fc753b9e2264fabb1c26794c4a4f0dbfe750454b`

## Corrigido

- **Assinatura do logo nos modais de Contato e Cursos:** os dois componentes passaram a usar `ep-brand-signature-wrap` e `ep-brand-signature`. Foram removidos o `opacity-75` do wrapper de Contato e o fundo branco/borda decorativa do wrapper de Cursos. O CSS aprovado do Estilo 2 aplica opacidade de 30% ao logo e mantém o wrapper transparente.
- **Splash de autenticação:** o logo deixou de pulsar e perdeu moldura, sombra e fundo. Agora é exibido como assinatura pequena, com opacidade explícita de 30%.
- **ProfileSetup:** o logo foi reduzido e o wrapper deixou de usar selo branco/borda. A imagem permanece com opacidade de 30%.
- **Regressão protegida:** foram acrescentados testes estáticos para o tratamento discreto do logo e para os caminhos de voz neural, Solfeggio, Diário e confirmação de pagamento.

Não foram alterados o arquivo oficial do logo, os preços, cupons, scripts terapêuticos, etapas da jornada ou as paletas dos outros estilos.

## Varredura página por página

Foram conferidas as 21 folhas CSS do Estilo 2 importadas em `src/main.tsx`:

1. Overrides aprovados / superfícies e assinatura do logo.
2. Modais gerais e Prática Individual.
3. Anamnese.
4. Orações.
5. Contato.
6. Banhos de ervas.
7. Mapa astral e Numerologia.
8. Diário de Reconexão.
9. Diário diário.
10. Detalhe do dia.
11. Ho'oponopono.
12. Promoção.
13. Configurações finais.
14. Configurações semânticas.
15. Cursos.
16. Conquistas.
17. Navegação inferior.
18. Instalação mobile.
19. Cabeçalho.
20. Dashboard.
21. Player.

Resultado da inspeção estática: **21 folhas importadas; 0 seletores fora do escopo** `data-layout="elegancia-profunda"`.

As classes utilitárias antigas `purple-500` na Anamnese e `rose-50` no player ainda aparecem como alvos de neutralização, mas suas declarações no CSS do Estilo 2 as substituem por champagne/dourado. Não são cores ativas do tema. Estados semânticos de segurança, alerta e conclusão foram preservados.

## Seletor, prévias e componentes antigos

- `OFFICIAL_LAYOUTS` contém os quatro estilos: Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno.
- O seletor inicia com `selectedLayout = null`; o botão de confirmação fica desabilitado até uma escolha explícita.
- `App.tsx` mantém `layoutConfirmedThisSession = false` no início da sessão e remove `document.documentElement.dataset.layout` enquanto não houver confirmação.
- O logout limpa a confirmação e a solicitação de troca; a conta seguinte precisa escolher novamente.
- `OnboardingFlow` continua ativo. `WelcomeModal` antigo não foi reativado.
- A prancha oficial continua sendo usada como card de referência em `/brand/elegancia-profunda/prancha-oficial.svg`. A imagem-fonte enviada nesta conversa tem 1536 × 1152 px; o SVG incorporado no repositório contém uma prévia real de **240 × 180 px**. A alegação anterior de 384 × 288 px não correspondia ao arquivo existente; o teste atual foi mantido alinhado à dimensão real. A prévia não foi reencodada nesta rodada.

## Áudio, Diário, player e pagamento

- **Voz geral do Estilo 2:** Home e Configurações exigem um ID ElevenLabs válido e passam `fallbackToSpeechSynthesis: false` quando o estilo exige voz neural. Se o ID não for válido ou o serviço falhar, o caminho reporta erro em vez de trocar silenciosamente para voz nativa. O nome/ID nominal da voz geral escolhida não foi localizado nos registros recuperados; nenhum ID foi inventado.
- **Reintegração da Vida:** a rota dedicada usa a voz neural aprovada `21m00Tcm4TlvDq8ikWAM` e não oferece fallback para SpeechSynthesis/voz do dispositivo.
- **Solfeggio:** o oscilador inclui o fundamental nominal exato (`Number.parseFloat(type)`) além das camadas harmônicas suaves. A audição em dispositivo real ainda não foi homologada.
- **Diário:** `DailyDiaryModal` envia a entrada a `handleSaveDiaryDay`, que atualiza o progresso e chama `saveProgress`; `JournalLog` lê e exporta os registros existentes. A persistência ponta a ponta ainda precisa de teste em sessão real.
- **Player:** o Wake Lock de `MeditationSession` é solicitado somente durante a reprodução e liberado ao pausar/desmontar. O Dia 1 do `SacredEnergyCanvas` sincroniza canal de luz e raízes douradas ao relógio real do áudio. A composição atual do canvas **não inclui a silhueta humana** que aparece na prancha; não foi introduzido um corpo genérico. Essa correspondência visual permanece pendente.
- **Reintegração:** a jornada posterior aprovada de 21 dias e o componente `ReintegrationPresenceVisual` com a arte humana aprovada permanecem intactos; o logo da jornada continua com opacidade de 30%.
- **InfinitePay:** checkout externo com host permitido; confirmação server-side confere pagamento efetivo, valor exato da ordem e unicidade da transação. Não houve transação real de homologação nesta rodada.

## Preservado

- Identidade Elegância Profunda: verde profundo intencional, dourado nobre, champagne, bronze e marfim.
- Escolha explícita antes da aplicação do estilo.
- Logo oficial como assinatura discreta, sem competir com a arte.
- Jornada de 21 dias e corpo/arte humana neutra aprovada da Reintegração.
- Voz neural sem fallback robótico, oscilador Solfeggio e fluxo de Diário.
- Checkout e confirmação server-side da InfinitePay.
- Conteúdos, regras comerciais e identidade dos Estilos 1, 3 e 4.

## Pendente

1. **Natureza integrada própria:** `--ep-scene:none` permanece intencional. Falta fotografia própria aprovada para o Estilo 2; nenhuma imagem da Reintegração ou dos outros estilos foi reutilizada.
2. **Player:** falta a composição visual aprovada com silhueta neutra, natureza e luz/raízes, comparada à prancha. A animação de canal e raízes está presente, mas não equivale à composição completa.
3. **Prévia do seletor:** a prancha-fonte é 1536 × 1152 px, mas a prévia embutida continua em 240 × 180 px; uma derivação de maior densidade ainda precisa ser incorporada e validada.
4. **Homologação visual:** faltam capturas e comparação renderizada de todas as páginas em desktop e celular.
5. **Homologação funcional:** reprodução real da voz geral e da voz dedicada, Solfeggio em dispositivos, animações, Diário ponta a ponta e transação controlada InfinitePay/webhook/liberação de acesso.
6. **Segurança:** não foi executado novo `npm audit`. O último relatório disponível registrava nove vulnerabilidades (três moderadas e seis altas); esse número precisa ser revalidado.
7. **Build/publicação:** o status do HEAD desta rodada mostra falha Vercel `build-rate-limit`. Não há workflow run do GitHub Actions consultável para este commit. Os testes foram adicionados, mas não declaro que foram executados; build e publicação não estão homologados.

## Commits desta rodada

- `28c5bbf77b8cd0141140e8b40dba23e9de35f6bf` — assinatura discreta no Contato.
- `ff6d8001513df667b502c4b1a35f8c895d0635c9` — assinatura discreta em Cursos.
- `b916f3ed12216ca82e4d42fb2b81a8d7b2a9fbbe` — testes de logo, voz, Solfeggio, Diário e pagamento.
- `8606d661c3dc097da47ecfdec0b9622352c89db4` — splash com logo discreto.
- `5a6fe1b2ab6f9739b401d6cf9cc07fc8c209cbce` — ProfileSetup com logo discreto.
- `fc753b9e2264fabb1c26794c4a4f0dbfe750454b` — testes de regressão do logo em autenticação.

## Critério de continuidade

Não reabrir as correções de assinatura do logo, confirmação explícita, isolamento CSS, Wake Lock, voz neural, Solfeggio, Diário ou confirmação server-side sem evidência de regressão. Próxima prioridade: aprovar a fotografia de natureza e a composição do player, depois executar a homologação visual/funcional e a auditoria de dependências.
