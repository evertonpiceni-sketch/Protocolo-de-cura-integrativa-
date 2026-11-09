# Auditoria Estilo 1 — Natural Sereno | RUN 104

Data: 2026-11-08
Projeto: `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`
Branch: `audit/natural-sereno-run97-mainline-2026-11-08`

## Corrigido

1. **Heranças verde-floresta e amarelo saturado na origem**
   - Removidos os três fallbacks de tela `#063020` do player, do carregamento e do acolhimento; as fotografias reais foram preservadas e o fallback passou a café `#2A2421`.
   - O carregamento mantém gradiente neutro café sobre a fotografia, sem véu verde-floresta.
   - O overlay duplicado `rgba(2, 31, 19, .15)` foi substituído pelo gradiente café aprovado.
   - O símbolo semântico que usava verde saturado `#297241` passou para sálvia `#5E6948` com superfície suave.
   - A barra de carregamento saiu do amarelo antigo `#e6c66e` e passou ao dourado refinado `#C89D52`.
   - Teste de regressão impede o retorno desses tokens.

2. **Logo oficial**
   - Regra final aplicada às superfícies do Natural Sereno: 30% desktop e 26% até 640px.
   - Wrapper do logo na tela de carregamento fica transparente, sem borda ou sombra.
   - O logo permanece como assinatura, sem competir com a fotografia ou a mensagem.

3. **Voz neural e Solfeggio**
   - `AudioSettingsModal`: frequências Solfeggio ficam bloqueadas durante a prévia da voz neural também no Natural Sereno; ambiências não tonais permanecem disponíveis.
   - `ArcanjoProtocolView`: Natural Sereno usa o ID neural salvo quando válido ou a voz oficial configurada; exige ID ElevenLabs explícito e não cai em SpeechSynthesis nativo quando o serviço falha.
   - Os guardrails equivalentes de Elegância Profunda e Essência Luminosa foram preservados; os testes compartilhados foram atualizados para a condição comum dos três estilos.

## Preservado

- Prancha original recuperada: `1001196520(2).png`, Library ID `file_00000000317c820ebaad657dc3680de5`; o seletor usa a conversão JPEG visualmente correspondente em `docs/visual-qa/natural-sereno/reference.jpg`.
- Seletor dos quatro estilos sem pré-seleção; nenhuma identidade é aplicada antes da escolha e confirmação explícitas.
- Natureza fotográfica e enquadramentos responsivos da Home, acolhimento e player.
- Paleta creme/marfim, café/marrom e dourado refinado; verde apenas em acentos sálvia.
- Botões premium de 18px, tipografia, estrutura e conteúdo aprovados.
- Diário: preservação de sensações/gratidões opcionais e salvamento composto com o mesmo snapshot de perfil/progresso.
- Player de seis etapas, cadência respiratória 4–3–5, animações, Wake Lock e Media Session.
- Estilos 2, 3 e 4: nenhuma alteração de identidade visual ou regra comercial; os testes foram ajustados apenas para reconhecer o bloqueio adicional do Estilo 1.
- InfinitePay: checkout público, handle e URL pública com defaults; confirmação server-side via `/payment_check`, conferência de valor em centavos, deduplicação de transação e escolha server-side de benefício Semestral/Anual. A implementação não depende de `INFINITEPAY_API_KEY`.

## Reauditoria técnica

GitHub Actions #1957 — execução `42542584844`, HEAD de código `3e2f16158f5621291c81d46211e7ab95333fe9f9`:

- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes automatizados: **178/178 aprovados**.
- Build Vite + Express: aprovado; 2.249 módulos transformados.
- Entry points Vercel/Express: aprovados.
- JWT e segredos: aprovados.
- Autenticação e proteção administrativa: aprovadas.
- Smoke tests: aprovados.
- Endpoints de pagamento fail-closed: aprovados.

## Pendências

1. Vercel continua recusando preview por `build-rate-limit`; sem deployment READY não há capturas renderizadas página a página em desktop/mobile.
2. Falta escutar a voz neural efetivamente escolhida e validar em navegador as transições narração/Solfeggio/ambiência.
3. Falta checkout, confirmação e webhook InfinitePay em sandbox; nenhuma cobrança real foi feita.
4. A branch está **62 commits à frente e 9 atrás da main**; GitHub informa `mergeable=true`. Os nove commits posteriores da main foram inspecionados e incluem decisões de outros estilos, principalmente Essência Luminosa. Devem ser preservados e reconciliados antes do merge.
5. Revisão independente do HEAD atualizado solicitada; ainda sem parecer final.

## Entrega e segurança

- PR #74 permanece aberta e em rascunho.
- Sem merge, publicação em produção ou cobrança.
- Nenhuma decisão aprovada dos Estilos 2, 3 ou 4 foi descartada.

Links:
- PR: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/pull/74
- CI #1957: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42542584844