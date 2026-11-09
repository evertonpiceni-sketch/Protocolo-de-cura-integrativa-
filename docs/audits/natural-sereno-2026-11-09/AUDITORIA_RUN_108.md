# Auditoria Estilo 1 — Natural Sereno | RUN 108

**Data:** 09/11/2026  
**Branch:** `audit/natural-sereno-run97-mainline-2026-11-08`  
**Correções de código:** `9c026aee6120298c1830eb978577329bf8711789`, `29d3c514bf9922726ebb63c269c385737e915366`  
**Testes de regressão:** `424af9983e619c7121e247223af48a61df9df27d`  
**Pré-seleção neutra:** `0888e48edd5ec5ac6680b54668644e972298efb2` / `7a3984e907506dc23c7072b2c18d57b7b28eb4ae`

## Corrigido

1. **Pré-seleção indevidamente marcada como Natural Sereno.** Removido de `src/approved-theme.css` o bloco `#profile-setup-view` que antecipava a paleta do Estilo 1 antes da escolha. A tela de cadastro/login volta a herdar apenas os tokens neutros. O teste de pré-seleção da main foi incorporado à branch e protege contra retorno dessa regressão.

2. **Paleta antiga na origem do tema.** Atualizado o bloco-base `:root[data-layout="natural-sereno"]` em `src/approved-theme.css`: creme/marfim `#FAF7F2` / `#F5EFE5`, café `#2A2421`, texto secundário `#6B625B`, dourado refinado `#E2B96B` / `#C89D52` / `#A87E37` e sálvia `#6F7B55` apenas como acento. Saíram da origem os tokens antigos `#2D4A3E`, `#B38634` e `#202D24`.

3. **Cena herdada da Reintegração.** O bloco-base do Natural Sereno deixa de apontar para `/brand/reintegracao-presenca-arte.png`; agora usa `var(--ns-valley)`, overlay claro e painel café. A cena noturna de outros estilos não foi alterada.

4. **Solfeggio do Arcanjo iniciava antes da voz.** Removido o `startSynth` antecipado em `ArcanjoProtocolView.tsx`. A frequência só começa no callback `onStart` da narração neural. Pausa, erro, conclusão, reinício, troca de dia e desmontagem continuam interrompendo o sintetizador. Teste de regressão adicionado.

5. **Documento visual histórico.** `design-qa.md` recebeu aviso explícito de que sua descrição cromática inicial está superada. A prancha segue como referência de composição, não como autorização para recuperar verde-floresta, dourado saturado ou logo dominante.

## Preservado e conferido estaticamente

- Card do seletor: `docs/visual-qa/natural-sereno/reference.jpg`. O registro de design documenta a cópia de `1001196520.jpg`; a imagem foi inspecionada. O ID binário original `file_00000000317c820ebaad657dc3680de5` não foi revalidado pela Library nesta rodada; a referência versionada não foi substituída.
- Seletor dos quatro estilos: `selectedLayout` inicia em `null`; confirmação desabilitada até escolha; `App.tsx` só define `data-layout` depois da confirmação e persistência. Os quatro nomes oficiais permanecem em `OFFICIAL_LAYOUTS`.
- Voz: workspace ElevenLabs confirma **Marianne — Meditação**, ID `mJqP14JQFEK0PojR5lfV`, português brasileiro, descrição calma/meditativa. O ID coincide com `OFFICIAL_PROTOCOL_VOICE_ID`. O guard do Natural Sereno desativa fallback para SpeechSynthesis nos caminhos auditados.
- Configuração Vercel: `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` existem como variáveis sensíveis em produção e preview; valores não foram lidos.
- Diário: `syncUserState` mantém até 24 tentativas limitadas, respeita Retry-After e preserva salvamentos compostos de perfil/progresso. Os testes existentes verificam retenção de sensações/gratidões e uso do mesmo snapshot.
- Player: seis etapas, progresso real, animações e respiração 4–3–5 preservados; camada aprovada continua depois das folhas do Natural Sereno.
- Pagamento: `SpecificTreatmentModal` encaminha PIX pelo checkout InfinitePay (`/api/payment/create-checkout`), sem cópia/chave manual. `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` estão presentes em produção. A implementação atual usa o checkout público e **não exige `INFINITEPAY_API_KEY`**. Nenhuma cobrança foi feita.
- Identidade visual dos Estilos 2, 3 e 4 preservada; a correção de timing do Arcanjo é compartilhada e não altera suas telas.

## Validação e limitações

- A inspeção estática desta rodada cobriu `approved-theme.css`, `natural-sereno-approved-overrides.css`, `main.tsx`, `App.tsx`, `LayoutChoiceModal`, `ProfileSetup`, voz, áudio, Diário, player e checkout.
- Última CI confirmada antes destas três correções: Security Audit **#1995**, execução [42553269824](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42553269824), **187/187 testes**, npm audit sem vulnerabilidades, TypeScript e build aprovados. **Não há execução Actions associada aos commits RUN 108**; portanto, as novas alterações e os novos testes ainda aguardam CI.
- Vercel: último deployment consultado da branch, `dpl_BgxyzwVrimhbworJo1BXq2Vou14Y`, falhou com `BUILD_FAILED — Resource provisioning failed`. O check do commit retorna `build-rate-limit`. Não existe preview READY do HEAD atual.
- Sem preview, continuam pendentes capturas renderizadas página a página em desktop/mobile e escuta real da voz, Solfeggio, ambiência e player.
- InfinitePay: sandbox, confirmação e webhook ainda não foram homologados.
- `UPSTASH_DB_KEY` permanece restrita a uma branch antiga de preview e sinalizada pela Vercel como `readable-secret`. Não foi lida, alterada nem removida nesta rodada; revisar/rotacionar depois de confirmar que a branch antiga não será reutilizada.
- Comparação atual: branch **105 commits à frente e 19 atrás** da `main`, com divergência em arquivos compartilhados (`App.tsx`, `ArcanjoProtocolView`, modais de áudio/cadastro e testes). A correção pontual de pré-seleção da main foi incorporada, mas a integração completa exige reconciliação cuidadosa. Não fazer merge.

## Estado

PR #74 permanece aberta e em rascunho. Nenhum merge, deploy de produção ou pagamento foi realizado. Homologação integral continua bloqueada por preview, CI do novo HEAD, teste auditivo e sandbox financeiro.
