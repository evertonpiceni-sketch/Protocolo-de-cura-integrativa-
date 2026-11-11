# Auditoria Run 72 — Estilo 4 · Místico Moderno

**Data:** 11/11/2026  
**Branch:** `fix/mistico-moderno-run15-mainline-2026-11-09`  
**PR:** #77  
**HEAD de referência antes desta rodada:** `d98813a9c195d81b232d9f8d605d7075f8f8d99c`

## Corrigido nesta rodada
- A prancha original `1001196522.png` foi recuperada da Library e inspecionada: PNG de **1536 × 1152 px**, 569.376 bytes, proporção 4:3.
- A prancha contém elementos históricos que não prevalecem sobre decisões posteriores (ex.: indicação de 12 dias, figura masculina e logo dominante). O card do seletor agora informa explicitamente que a prancha orienta somente atmosfera/paleta e que prevalecem **21 dias, corpo neutro e logo oficial discreto/transparente**.
- A descrição canônica do Estilo 4 foi alinhada à regra congelada do logo-assinatura.
- Comentário do CSS final corrigido para não sugerir esmeralda como acento solto de interface: no Estilo 4, esmeralda fica restrita à natureza; ações usam superfície noturna e dourado.
- Adicionado teste de regressão para a precedência da prancha e a confirmação explícita dos quatro estilos.

## Reauditoria do código vigente
- `LayoutChoiceModal`: estado inicial `selectedLayout=null`; CTA desabilitado até seleção; persistência concluída antes de confirmar o layout na sessão.
- `App.tsx`: `data-layout` só é aplicado após confirmação explícita; logout limpa a confirmação.
- `src/main.tsx`: 27 folhas CSS específicas do Místico Moderno permanecem importadas. A última varredura integral (Run 69) contou 515 regras, sem seletores sem escopo, keyframes globais ou fontes globais indevidas.
- Canvas energético: índigo/violeta e dourado; verde independente removido. Estilos 1–3 permanecem sem alterações nesta rodada.
- Arcanjo: Estilo 4 exige ID ElevenLabs válido, sem fallback nativo; Solfeggio suspenso durante narração neural e retomado na pausa/fim. O áudio global da Home exclui a tela Arcanjo.
- Jornada de 21 dias: frequências Solfeggio bloqueadas durante a fase de narração; ambiências não tonais permanecem permitidas.
- Diário fechado por padrão; player, Media Session, Wake Lock e respeito a movimento reduzido preservados.
- Pagamento: `paymentRoutes.ts` exige API Key e handle específicos do ambiente; Preview não pode reutilizar os valores de Production e falha fechado.

## Referência visual — situação
- Original recuperado e confirmado na Library: `1001196522.png`, 1536 × 1152.
- O SVG versionado `public/brand/mistico-moderno/prancha-oficial-card.svg` ainda incorpora a miniatura WebP de 384 × 288. A fonte original foi localizada, mas **a substituição binária em alta resolução ainda não foi integrada ao repositório** nesta rodada.
- A fotografia fotorrealista de corpo neutro ainda não está integrada; a arte corporal vetorial existente foi preservada até aprovação de um ativo realista compatível.

## Vercel e pagamentos — bloqueios confirmados
- Deployment mais recente do HEAD de referência: `dpl_sKunKt9D1VywM8VSnYAwQLX7Mqmx`, `ERROR / BUILD_FAILED / Resource provisioning failed`. A Vercel retornou zero eventos de build; o erro ocorreu antes de logs de compilação. Não há Preview READY.
- Variáveis filtradas para esta branch em Preview: somente `UPSTASH_DB_KEY`. Não há `INFINITEPAY_PREVIEW_API_KEY`, `INFINITEPAY_PREVIEW_HANDLE` ou `PUBLIC_APP_URL` específicos desta branch.
- Na configuração do projeto, `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` estão em Production; não foi encontrado `INFINITEPAY_API_KEY`. Nenhum valor secreto foi descriptografado ou alterado.
- Checkout permanece fail-closed; sandbox, webhook e teste de cobrança continuam pendentes. Nenhuma cobrança foi realizada.

## Preservado
- Os quatro estilos e a exigência de escolha explícita.
- Jornada de 21 dias, protocolo do Arcanjo de sete dias, corpo neutro e logo oficial sutil/transparente.
- Voz neural sem fallback robótico no Estilo 4, política de Solfeggio, player, Diário e animações aprovadas.
- Preços, cupons e regras de confirmação server-side.
- Estilos 1–3 e Production sem alterações.

## Pendente
1. Integrar a prancha original 1536 × 1152 ao card versionado, sem recorte.
2. Obter Preview READY após resolver o provisionamento da Vercel e homologar as 12 superfícies em desktop/mobile.
3. Integrar fotografia fotorrealista de corpo neutro aprovada.
4. Testar voz, Solfeggio, player e animações em dispositivo real.
5. Configurar credenciais isoladas de Preview e API Key de Production da InfinitePay; homologar checkout e webhook em sandbox.
6. Executar CI no novo HEAD desta rodada antes de considerar as alterações validadas.

**Sem merge, sem publicação em Production e sem cobrança real.**
