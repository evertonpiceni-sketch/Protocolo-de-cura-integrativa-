# Auditoria Run 64 — Estilo 4: Místico Moderno

**Data:** 11/11/2026  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `fix/mistico-moderno-run15-mainline-2026-11-09`  
**Commit de código revalidado:** `1c12af804eeea3de03b3c4c57e13f83481ec3150`

## Corrigido

- Em `src/lib/paymentRoutes.ts`, o guard de domínio de Production consultava a referência da função `isPreview` em vez de executar `isPreview()`. Como a referência de função é sempre truthy, o domínio oficial de Production podia ser rejeitado também em Production, bloqueando o checkout real.
- Corrigido para aplicar a rejeição de domínio de Production somente quando `VERCEL_ENV === 'preview'`.
- Em `tests/payment.test.ts`, acrescentado teste de regressão que confirma que Preview continua rejeitando o domínio de Production e que Production aceita seu próprio domínio, gera redirect e webhook no host canônico e chama o provedor quando a configuração está completa.

## Reauditoria técnica

Execução GitHub Actions **Security Audit #42999610224 — Run 2406: SUCCESS**.

- 236 testes aprovados; 0 falhas.
- `npm audit`: 0 vulnerabilidades.
- TypeScript aprovado.
- Build aprovado; 2.252 módulos transformados.
- Verificações de autenticação JWT, proteção administrativa, smoke test e endpoints financeiros fail-closed aprovadas.

## Varredura visual/estrutural

- 26 folhas CSS importadas para o Místico Moderno examinadas.
- 495 blocos de regras CSS contabilizados.
- 0 seletores fora do escopo `:root[data-layout="mistico-moderno"]` ou `html[data-layout="mistico-moderno"]`.
- 0 keyframes globais e 0 declarações `@font-face` nas folhas específicas examinadas.
- Tokens compartilhados de cor são remapeados pelo `data-layout`; no Místico Moderno, o alias legado de sálvia acompanha o violeta do estilo, e a camada final substitui a névoa sálvia por índigo/violeta e dourado.
- Seletor dos quatro estilos confirmado: estado inicial sem seleção; `data-layout` só é aplicado após escolha explícita e persistência bem-sucedida no servidor.
- A varredura estrutural cobriu as superfícies de entrada/pré-escolha, acolhimento, Home, navegação, jornada, player, anamnese/resultados, biblioteca/guias, protocolos, comunidade/vídeo e perfil/configurações/Diário. Não equivale a homologação visual renderizada.

## Preservado

- Quatro estilos e suas decisões aprovadas; nenhum ajuste foi aplicado aos Estilos 1, 2 ou 3.
- Jornada principal de 21 dias; protocolo do Arcanjo de sete dias.
- Corpo neutro e logo oficial discreto/transparente.
- Voz neural ElevenLabs sem fallback robótico no Estilo 4; política de Solfeggio, player, Diário e respeito a movimento reduzido.
- Preços, cupons, regras de checkout, confirmação de pagamento e webhook; nenhuma credencial ou preço foi alterado.
- Card versionado `public/brand/mistico-moderno/prancha-oficial-card.svg`: viewBox 384×288 (4:3), com recursos WebP/AVIF incorporados e identificação da origem `1001196522.png`. Nenhuma ampliação ou substituição aproximada foi feita nesta rodada.

## Pendências e bloqueios

1. **Vercel:** o check do commit permanece `failure` com `build-rate-limit`; não há preview READY para o HEAD desta rodada. A homologação visual das 12 superfícies em desktop e celular permanece pendente.
2. **Imagens realistas:** `chakra-body.svg` continua sendo a imagem corporal usada no Dashboard e no Arcanjo; a Home do Místico Moderno mantém `--ep-scene: none`. Falta integrar fotografia realista de corpo neutro aprovada. Uma imagem experimental presente no ambiente de trabalho não foi integrada porque contém figura visualmente marcada por gênero, texto e logo dominante, contrariando as decisões congeladas.
3. **Áudio:** as variáveis secretas `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` estão cadastradas para Preview e Production, mas a reprodução efetiva da voz escolhida e do Solfeggio ainda precisa de teste em dispositivo real.
4. **InfinitePay:** a listagem de ambientes não contém `INFINITEPAY_API_KEY`, `INFINITEPAY_PREVIEW_API_KEY` nem `INFINITEPAY_PREVIEW_HANDLE`. `INFINITEPAY_HANDLE` está somente em Production. `PUBLIC_APP_URL` está em Production e Development, mas não há URL própria de Preview para esta branch. O checkout permanece fail-closed até a configuração das credenciais/URL próprias e a homologação em sandbox. Nenhuma cobrança real foi realizada.

## Estado do PR

- PR #77 aberto, em rascunho e mergeable.
- Branch 201 commits à frente de `main`, 0 atrás, antes deste relatório.
- Sem merge e sem publicação em Production.
- O check Vercel permanece bloqueado por rate limit; nenhuma nova implantação foi forçada.
