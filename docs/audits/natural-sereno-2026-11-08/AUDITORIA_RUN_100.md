# Auditoria — Estilo 1 Natural Sereno — RUN 100

Data: 08/11/2026  
Branch: `audit/natural-sereno-run97-mainline-2026-11-08`  
PR: #74  
HEAD de código/teste validado: `92b9df033a86c0bbaefa6d7f6f03ee01403365c4`

## Corrigido

- **Home — cascata runtime:** removidas regras duplicadas e supersedidas que permaneciam no bloco CSS injetado: ocultação antiga de `.ns-home-message`, margem negativa de `-34px`, largura de saudação `84%` e altura móvel legada de `405px`. A camada efetiva aprovada foi mantida; os breakpoints reais de quick links e altura da cena foram preservados. `line-height: 1.55` e alinhamento do CTA foram mantidos explicitamente na regra canônica.
- **Diário — preservação de dados:** `handleSaveDiaryDay` conserva `sensations` e `gratitudes` quando a chamada não envia esses campos opcionais. Valores explicitamente enviados, inclusive string vazia, continuam podendo atualizá-los/limpá-los.
- **Sincronização atômica:** a revisão independente identificou que `saveProfile` podia reenviar o progresso antigo após `saveProgress`. Corrigido: `saveProfile` aceita `progressOverride`, atualiza estado/cache e envia perfil + progresso no mesmo snapshot. `handleSaveSystemicAnswer` e `handleSaveDiaryDay` fazem uma única sincronização composta quando há perfil; `saveProgress` fica apenas no ramo sem perfil.
- **Anamnese e Cursos:** CTA da Anamnese alinhado a 18px, hover creme `#F5EFE4` e sombra dos cards de Cursos trocada de verde escuro para café. Testes cobrem esses valores.
- **Regressões:** acrescentados testes para impedir o retorno das regras Home supersedidas e para garantir a preservação dos campos opcionais do Diário.
- **Prancha oficial:** recuperado e inspecionado o arquivo exato `1001196520(2).png`, Library file ID `file_00000000317c820ebaad657dc3680de5`. A referência usada pelo seletor em `docs/visual-qa/natural-sereno/reference.jpg` mostra a mesma composição visual em JPEG otimizado; não é uma cópia byte a byte do PNG.

## Preservado

- Escolha explícita dos quatro estilos; seleção começa vazia e a confirmação é obrigatória antes de aplicar o tema.
- Identidade Natural Sereno: creme/marfim, café/marrom, dourado refinado e verde-sálvia apenas como acento; paisagens, tipografia, CTAs premium e assinatura do logo sem redesenho nesta rodada.
- Logo sutil: opacidade de 30% no desktop e 26% no mobile, conforme a camada aprovada.
- Voz neural: IDs ElevenLabs válidos são respeitados; o Natural Sereno normaliza aliases legados para `OFFICIAL_PROTOCOL_VOICE_ID` e desativa fallback silencioso para SpeechSynthesis.
- Solfeggio: 396, 417, 432, 528, 639, 741, 852 e 963 Hz; a prévia neural bloqueia as frequências tonais. O áudio global é interrompido durante sessão ativa e na tela Arcanjo.
- Player/canvas: sincronização pelo tempo real do áudio, suporte a `prefers-reduced-motion` e cadência respiratória 4–3–5 preservados.
- Diário: conteúdo, callbacks, exportação e persistência preservados; apenas corrigida a perda de campos opcionais.
- InfinitePay: checkout server-side por `/payment/create-checkout`, configuração via `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL`, confirmação por `/payment_check`, conferência do valor em centavos e bloqueio de transação reutilizada. O fluxo atual não exige `INFINITEPAY_API_KEY`.
- Nenhuma alteração visual ou funcional nos Estilos 2, 3 e 4.

## Reauditoria técnica

GitHub Actions **#42532849974**: concluída com sucesso no HEAD `92b9df033a86c0bbaefa6d7f6f03ee01403365c4`.

- `npm audit`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes: **165/165 aprovados**.
- Build Vite: aprovado, 2.247 módulos transformados.
- Entry points, JWT, autenticação/admin, smoke checks e endpoints de pagamento: aprovados.

## Pendente

1. A Vercel ainda não criou deployment para o HEAD atual; o check externo retorna `build-rate-limit`. O deployment anterior disponível está em commit mais antigo e terminou em `BUILD_FAILED — Resource provisioning failed`.
2. Capturas renderizadas de todas as páginas em desktop e mobile; a inspeção desta rodada foi estática.
3. Escuta real da voz escolhida e teste físico das transições entre narração, Solfeggio e ambiência.
4. Checkout, confirmação e webhook InfinitePay em sandbox.
5. Revisão independente do HEAD atualizado.

## Estado de entrega

PR #74 permanece aberta, em rascunho e mergeable; a branch está 38 commits à frente e 6 atrás por histórico. Revisei os seis commits recentes da `main`: a única alteração de conteúdo em `src/approved-theme.css` já está idêntica na branch; o relatório RUN 102 da Essência Luminosa permanece na `main` e suas decisões foram preservadas. Não houve merge, publicação em produção ou cobrança real.
