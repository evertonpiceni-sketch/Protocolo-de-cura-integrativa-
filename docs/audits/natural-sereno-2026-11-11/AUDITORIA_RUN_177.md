# Auditoria RUN 177 — Estilo 1: Natural Sereno

**Data:** 11/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código após a correção e o teste:** `b3cf1970aa53d4c78f06478551db186ecaa4d4ac`

## Corrigido

1. **Anamnese — preservar consentimento de áudio.**
   - `handleSaveAnamnesis` deixava `audioEnabled: true` ao salvar a avaliação, mesmo quando o usuário havia desativado o áudio.
   - Removido o override. O spread de `userProfile` agora preserva a preferência existente; salvar a Anamnese atualiza a recomendação de frequência, mas não concede consentimento de reprodução.
   - A aplicação manual de uma frequência continua sendo uma ação explícita separada.
2. **Proteção de regressão.**
   - Adicionado `tests/natural-sereno-run177-anamnesis-preserve-audio-consent.test.ts`, verificando que o salvamento preserva `audioEnabled` e não ativa `audioPlaybackRequested`.

## Preservado e reauditoriado

- **Seletor:** `layoutConfirmedThisSession` inicia em `false`; enquanto não há confirmação, o efeito remove `data-layout`. O seletor dos quatro estilos aparece antes da aplicação. A preferência só é aplicada depois que a sincronização do perfil termina com sucesso.
- **Card oficial:** o seletor mantém a derivação versionada `docs/visual-qa/natural-sereno/reference.jpg` em `object-contain`, sem recorte, ao lado da prévia atual de natureza realista. A prancha histórica foi inspecionada: os grandes verdes, chakras, corpo masculino e logo dominante não prevalecem sobre as decisões posteriores de corpo neutro, creme/marfim, café, dourado refinado, verde como acento e logo discreto. O arquivo original `1001196520.png` não está anexado nesta conversa nem foi localizado na busca da Biblioteca nesta execução; a derivação versionada foi a referência disponível.
- **Paleta e isolamento:** análise estática de `natural-sereno-approved-overrides.css`: 488 regras, zero seletores fora do escopo `:root[data-layout="natural-sereno"]` e nenhuma chapa de fundo verde-escura identificada.
- **Paisagens:** Home mantém enquadramento desktop em 52% e mobile em 48%; o player preserva a cachoeira com posições responsivas. Os testes de enquadramento e existência dos assets permanecem no repositório.
- **Reintegração:** silhueta neutra, caminho único de luz e raízes no Dia 1 preservados. A sessão imersiva e os modais usam as superfícies creme/marfim, textos café e dourado refinado; botões principais mantêm cantos premium. Logo permanece assinatura a 30%.
- **Seletor e abertura:** não há chamadas a `setShowWelcomeModal(true)` ou `setShowDailyTip(true)`; somente o seletor obrigatório aparece automaticamente após login. Os caminhos antigos de onboarding/dica permanecem sem gatilho ativo.
- **Voz:** rota `/api/reintegration-tts` usa Marianne `mJqP14JQFEK0PojR5lfV`, ElevenLabs `eleven_multilingual_v2`, valida sessão e restringe os trechos autorizados; sem fallback robótico nesse fluxo.
- **Solfeggio:** política exige modal aberto, opção ativa, áudio global permitido e ausência de voz carregando/reproduzindo. O micro-chime da Anamnese exige opt-in explícito da sessão.
- **Diário e player:** sincronização vinculada à conta, gravação atômica do progresso, Media Session, pausa/retomada e Wake Lock preservados.
- **Estilos 2, 3 e 4:** nenhuma alteração nesta rodada.

## Pendências e bloqueios

- O teste RUN 177 foi adicionado, mas não executado pelo runner. TypeScript, lint e build também não foram executados; não declarar CI aprovada.
- GitHub Actions: nenhuma execução associada ao HEAD anterior consultado; reconsultar após o commit do relatório.
- Vercel: projeto `protocolodecuraintegrativa` está `live=false`; não há deployment para o SHA de código consultado. Deployments recentes da branch terminam em `ERROR`; o último erro de provisionamento consultado foi `BUILD_FAILED — Resource provisioning failed`, sem eventos de build.
- Sem Preview READY, QA visual renderizado em desktop/mobile e homologação auditiva real permanecem pendentes.
- InfinitePay: inventário consultado sem descriptografar segredos. `INFINITEPAY_API_KEY` ausente; `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` disponíveis em Production, mas não para o Preview desta branch. O Preview atual tem somente `UPSTASH_DB_KEY`. Checkout/webhook sandbox pendentes; nenhuma cobrança realizada.
- PR #79 continua divergente da `main`; não fazer merge/rebase automático nem publicar em Production antes da reconciliação seletiva e homologação.

## Commits desta rodada

- `6b15a184a4aebfac3ac5715aa4ae873fe12ae091` — preserva preferência de áudio ao salvar Anamnese.
- `b3cf1970aa53d4c78f06478551db186ecaa4d4ac` — teste de regressão do consentimento.

**Decisão:** manter Natural Sereno visualmente congelado. A correção desta rodada é de consentimento de áudio; não redesenhar telas já aprovadas. Recuperar Preview e executar a homologação real antes de qualquer merge ou publicação.
