# Auditoria — Estilo 1 Natural Sereno | RUN 42

**Data:** 2026-11-08  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**HEAD auditado:** `a1a1b0457403d3fe995e42848f2081c498906cbc`  
**PR:** #67, aberta e não mesclada.  
**Main observada:** `fd1ab71810774411d1f2eff869abaeca93de7eeb`.

## Referência visual e precedência

- Mantida como referência ativa a prancha já versionada em `docs/visual-qa/natural-sereno/reference.jpg`; nenhuma versão antiga/reprovada foi recolocada.
- A prancha orienta composição e atmosfera, mas as decisões posteriores prevalecem: base creme/marfim e café/marrom, dourado refinado, verde apenas como acento natural e sem grandes chapas verdes.
- Nesta execução, a busca do Library não retornou o ID original `file_00000000317c820ebaad657dc3680de5`; por isso não substituí nem regenerei o asset versionado.

## Corrigido / confirmado nesta rodada

1. **P2 Retry-After:** `src/lib/userSync.ts` respeita o valor numérico ou HTTP-date. Se o prazo solicitado exceder a janela limitada de retry, encerra a tentativa sem reenviar antes do prazo; não reduz um Retry-After longo para 5 segundos.
2. **P2 onboarding:** `ProfileSetup` envia nascimento, cidade, telefone e preferências no próprio `/api/auth/register`. O servidor valida os campos com schema Zod estrito e persiste a conta/perfil sob o lock global. O fluxo não depende de uma segunda chamada de sincronização depois de a conta existir.
3. **Sincronização do usuário:** `/api/user/sync` anuncia `Retry-After: 1` ao responder 409 por contenção; o cliente repete apenas falhas transitórias e mantém payload de perfil/progresso separado quando a alteração é parcial.
4. **Seletor:** os quatro estilos estão no catálogo; a seleção começa em `null`, a confirmação fica desabilitada até uma escolha e `data-layout` só é aplicado após confirmação.
5. **Escopo visual:** as camadas Natural Sereno são ativadas por `:root[data-layout="natural-sereno"]`; o teste de regressão verifica ausência de override global na camada Home e isolamento da pré-seleção.
6. **Voz:** a camada Natural Sereno preserva IDs ElevenLabs válidos do perfil e normaliza identificadores legados de dispositivo para a voz oficial. A política Natural Sereno desativa fallback silencioso para SpeechSynthesis. A Vercel lista `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` em produção/preview, sem consultar valores.
7. **Solfeggio e player:** frequências tonais ficam bloqueadas durante a prévia de voz; ambiências não tonais permanecem permitidas. O protocolo do Arcanjo mantém ownership próprio do áudio e não deve ser interrompido por reinicializações da trilha global.
8. **Diário e páginas:** testes verificam persistência do Diário, tema de canvas do player, Home, Mapa Astral, Numerologia, Banhos, Ho'oponopono, Anamnese e demais superfícies cobertas pelas camadas aprovadas. Logo continua como assinatura discreta (30% desktop / 26% mobile).

Não foi necessário alterar novamente o desenho aprovado nesta rodada. As correções de retry e persistência atômica já estavam no HEAD atual da RUN 41; foram verificadas contra o código e os testes.

## Pagamentos e segurança

- `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` estão configurados em produção.
- `INFINITEPAY_API_KEY` não aparece na listagem de variáveis de produção; o checkout permanece fail-closed (503 antes de chamar o provedor).
- Não foi realizado checkout, cobrança ou estorno.
- `UPSTASH_DB_KEY` permanece como variável `plain` de preview vinculada somente à antiga branch `audit/natural-sereno-infinitepay-2026-10-13`. Não consultei o valor nem alterei/rotacionei a variável.

## Reauditoria e bloqueios

- A execução #1759 anteriormente consultada terminou com sucesso: TypeScript, build, segurança e 158/158 testes. Ela não foi confirmada como execução do HEAD atual `a1a1b045`; não se declara esse resultado como validação integral do HEAD atual.
- O HEAD atual não expõe execução GitHub Actions associada na consulta desta rodada.
- O deployment Vercel do HEAD atual está em `ERROR / BUILD_FAILED`, mensagem `Resource provisioning failed`; não existe preview navegável para capturas reais.
- A escuta da voz escolhida e das transições narração/Solfeggio/ambiência permanece pendente.

## Preservado

- Prancha versionada, quatro estilos com escolha explícita e confirmação.
- Identidade Natural Sereno e logo oficial discreto.
- Diário, player, seis etapas, animações e respiração 4–3–5.
- Catálogo atual, lock global, refresh de snapshot, deduplicação, idempotência e confirmação server-side.
- Decisões posteriores de Elegância Profunda e Essência Luminosa; nenhuma tela desses estilos foi redesenhada.

## Pendente / risco de integração

1. A branch está **86 commits à frente e 4 atrás da main**, com histórico divergente; PR #67 está `mergeable=false`.
2. Os quatro commits posteriores da main incluem alterações de Elegância Profunda/Essência Luminosa e escolha explícita de benefício Semestral/Anual, com impacto em `ProUpgradeModal`, `paymentRoutes`, `server.ts`, `App.tsx`, tipos e testes. Não mesclar a PR #67 enquanto essas decisões não forem reconciliadas e revalidadas.
3. Preview visual e capturas desktop/mobile pendentes por falha de provisionamento Vercel.
4. Teste auditivo real pendente.
5. Configurar `INFINITEPAY_API_KEY` no ambiente apropriado e executar sandbox; conciliar links legados antes de qualquer cobrança.
6. Revisar com segurança a variável antiga `UPSTASH_DB_KEY`, sem expor seu valor.

Foi solicitado novo review independente do HEAD atual no PR #67. Nenhuma alteração foi mesclada ou publicada em produção.
