# Auditoria RUN 103 — Estilo 3: Essência Luminosa

**Data:** 08/11/2026  
**Branch:** `main`  
**HEAD de código auditado:** `f2bff9f0a2e0d7b6cf2271f77262337037089eda`

## Corrigido nesta rodada

- Corrigida uma mensagem desatualizada em `tests/essencia-luminosa.test.ts`: a camada-base mantém `--ep-scene:none` e `--ep-scene-overlay:none` para impedir herança de outros temas; a fotografia exclusiva do Estilo 3 é aplicada pela folha final. Nenhuma regra visual, conteúdo, preço ou fluxo funcional foi alterado.
- Revalidada a cascata: `approved-theme.css` é carregado antes das folhas específicas; `essencia-luminosa-approved-overrides.css` permanece depois das folhas de auditoria do Estilo 3.

## Preservado e revalidado

- A prancha oficial `1001196521.png` foi recuperada pelo identificador de arquivo informado e inspecionada visualmente. Continua sendo o card/referência oficial do Estilo 3. Ela contém telas e amostras de uma fase anterior; detalhes antigos como 28 dias, tratamento de corpo, logo dominante e amostras cromáticas antigas não substituem decisões posteriores.
- O card ativo do seletor continua em `public/brand/essencia-luminosa/prancha-oficial.webp`, usado com `object-contain`. A composição não foi reconstruída.
- Paleta efetiva preservada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B` e ouro escuro `#A87E37`; areia natural e oliva clara permanecem acentos.
- Logo oficial: wrapper transparente, sem moldura/sombra dominante; assinatura a 30% no desktop e 26% em telas pequenas.
- As 24 folhas CSS específicas foram examinadas: 577 blocos de regras identificados; não foram encontrados seletores sem escopo do Estilo 3. Os hex antigos rastreados aparecem em seletores que neutralizam classes herdadas, não como valores ativos de propriedades de cor nas folhas examinadas.
- Home: a cena é aplicada em `#cura-main-layout` e no hero; o overlay marfim preserva a leitura. Em telas pequenas, o attachment passa a `scroll`. A imagem atual é carregada do CDN Unsplash; não foi criada cópia local nesta rodada.
- Seletor: quatro estilos; seleção inicial nula; confirmação desabilitada até a escolha; `App.tsx` só define `data-layout` após confirmação explícita. Preferência persistida não é tratada como consentimento automático; logout reinicia a confirmação.
- Voz: IDs ElevenLabs válidos salvos são preservados; valores legados inválidos são normalizados para Marianne; o fluxo protegido do Estilo 3 não usa fallback silencioso para SpeechSynthesis.
- Solfeggio: as oito frequências são bloqueadas durante a prévia neural; ambiências não tonais e silêncio permanecem disponíveis.
- Diário e Diário de Reconexão: callbacks de persistência permanecem conectados. Player e animações preservam o tema ouro suave/sálvia, respiração 4–3–5 e respeito a `prefers-reduced-motion`.
- Checkout: `#plans-modal` já possui regras específicas na folha final; seleção explícita de Mapa Astral ou Numerologia nos planos Semestral/Anual permanece protegida. InfinitePay e confirmação server-side não foram alterados. Nenhum preço ou cupom foi modificado.
- Componentes ativos do seletor continuam no fluxo React; não foram reintroduzidos seletores antigos nem removidos materiais aprovados.

## Validação técnica

GitHub Actions **#42537090862** no commit de código auditado:
- `npm audit`: aprovado.
- TypeScript: aprovado.
- Testes de regressão: aprovados.
- Build: aprovado.
- Entry points Vercel/Express, verificações de segredos, JWT, autenticação administrativa, smoke test e endpoints de pagamento: aprovados.

## Pendente

1. Verificar origem/licença específica da fotografia externa e decidir se será versionada localmente; a autoria não foi confirmada nesta auditoria.
2. Homologação visual renderizada, página por página, em desktop e celular. A varredura CSS estática não substitui a conferência no navegador.
3. Testes físicos de voz neural, frequências, ambiências, Diário, player, Media Session e animações em dispositivos.
4. Transação InfinitePay em sandbox e validação do webhook.
5. Resolver o provisionamento da Vercel e publicar o HEAD atual.

## Produção

- Deployment do HEAD `f2bff9f`: estado **ERROR**, código `BUILD_FAILED`, mensagem `Resource provisioning failed`. A consulta de eventos de build não retornou logs.
- O alias estável `protocolo-de-cura-integrativa.vercel.app` continua apontando para o deployment READY do commit `5bd202e30f6459a0862ba38796912c0025c6af5a`, anterior ao HEAD atual. Portanto, a produção ainda não contém o HEAD auditado.

## Evidências

- CI: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42537090862
- Commit de correção do teste: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/commit/f2bff9f0a2e0d7b6cf2271f77262337037089eda
- Deployment com erro: https://vercel.com/evertonpiceni-sketch/protocolodecuraintegrativa/3o3ayVGcgMazXBFcP5xRQ5FG8mfA
- Produção READY ainda no commit anterior: https://vercel.com/evertonpiceni-sketch/protocolodecuraintegrativa/87ANQ2b6G3738g7CxA6uekoaN1Du

**Conclusão:** o Estilo 3 permanece visualmente isolado no código e os testes técnicos passaram. Nesta rodada foi corrigida apenas a mensagem de teste que descrevia incorretamente a camada neutra. Não foi feita recoloração ou reconstrução de páginas aprovadas. A conclusão global permanece bloqueada por homologação visual real, validações físicas, sandbox e publicação Vercel.
