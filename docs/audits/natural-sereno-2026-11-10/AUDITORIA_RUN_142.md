# Auditoria RUN 142 — Estilo 1: Natural Sereno

**Data:** 10/11/2026 — 03:40 (America/Sao_Paulo)  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código/teste após a correção:** `0f0d23f643b1c6898c095bb46176e0740041061b`  
**Main comparada:** `783aacc8210d92f35037a0d06309806b89a96973`  
**PR:** #79, aberta em rascunho.

## Corrigido nesta rodada

### Abertura automática indevida do Arcanjo

A renderização de `ArcanjoProtocolView` ainda dependia de:

```tsx
showArcanjoView || userProfile.subscriptionPlan === 'arcanjo_7d'
```

Isso fazia a tela abrir apenas porque o perfil possuía a assinatura `arcanjo_7d`, sem ação explícita na sessão. A regra foi reduzida para:

```tsx
showArcanjoView
```

O acesso contratado continua preservado. A assinatura não abre mais a tela por si só; a abertura permanece ligada ao estado explícito do fluxo, incluindo o evento `OPEN_PROTOCOL_DAY` e a conclusão de uma compra iniciada pelo usuário.

Foi adotada a mesma regra de abertura explícita já presente na branch aprovada da Essência Luminosa, sem mesclar ou substituir os demais arquivos daquela branch.

### Teste de regressão

Criado `tests/natural-sereno-arcanjo-explicit-open.test.ts`, que verifica:
- estado inicial fechado;
- renderização condicionada somente a `showArcanjoView`;
- ausência de condição de abertura baseada apenas em `subscriptionPlan === 'arcanjo_7d'`;
- preservação do evento explícito `OPEN_PROTOCOL_DAY`.

O teste foi relido após a gravação e as expressões regulares foram conferidas. **Ainda não foi executado em CI.**

## Reauditoria estática das superfícies

- **Seletor inicial:** `layoutConfirmedThisSession` começa em `false`; o atributo `data-layout` é removido até a confirmação. `LayoutChoiceModal` inicia com `selectedLayout = null` e mantém o botão de confirmação desabilitado até uma escolha.
- **Quatro estilos:** Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno continuam disponíveis no seletor. Nenhuma folha visual dos Estilos 2–4 foi modificada.
- **Card de Natural Sereno:** a prancha permanece referenciada em `LayoutChoiceModal` via derivação JPEG versionada e `object-contain`; não foi substituída. A busca pelo PNG original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` não retornou o arquivo na Library nesta execução; portanto, não foi feita comparação pixel a pixel.
- **Home e paisagem:** a folha final mantém a fotografia realista e enquadramentos distintos: desktop com posição vertical em 52% e altura responsiva `clamp(480px,62vh,680px)`; mobile em 54% e `clamp(520px,72vh,700px)`.
- **Paleta e cascata:** `natural-sereno-approved-overrides.css` continua depois das camadas antigas e da folha de auditoria da Home. As regras são escopadas a `data-layout="natural-sereno"`. Tokens verdes ainda existentes na origem compartilhada de Numerologia/Planos estão cobertos por overrides específicos; não foram removidos globalmente para não alterar outros estilos.
- **Logo:** assinatura oficial continua com opacidade reduzida e sem moldura dominante.
- **Player:** Natural Sereno monta `NeutralBodyLightProgress`; `SacredEnergyCanvas` permanece fora do ramo Natural Sereno.
- **Voz:** `naturalSerenoOfficialVoicePatch` preserva IDs ElevenLabs válidos, normaliza aliases/dispositivo para `OFFICIAL_PROTOCOL_VOICE_ID` e desativa fallback silencioso de SpeechSynthesis no Natural Sereno. A escolha de voz continua pendente de escuta real em dispositivo.
- **Solfeggio/áudio:** o áudio global considera `showArcanjoView`; o protocolo local respeita `audioEnabled`, interrompe Solfeggio durante narração e o retoma nos estados previstos. O guardião usa o contêiner estável `#arcanjo-protocol-view`, não a arte antiga de chakras.
- **Diário:** sincronização de perfil/progresso permanece no mesmo snapshot e vinculada a `accountLogin`; testes de identidade e gravação atômica continuam presentes.
- **Pagamento:** `SpecificTreatmentModal` não contém `handleCopyPix` nem chave PIX manual; o fluxo segue pelo checkout. `paymentRoutes` exige `INFINITEPAY_API_KEY` e `single_payment: true`. Não foi iniciado checkout nem cobrança.

## Preservado

- Paleta creme/marfim, café/marrom, dourado refinado e verde-sálvia somente como acento.
- Fotografias realistas e enquadramentos responsivos já aprovados.
- Logo oficial discreto/transparente.
- Seletor explícito e prévias dos quatro estilos.
- Corpo neutro, movimento da luz, respiração, voz neural, Solfeggio, Diário, player e animações.
- Preços, cupons, benefícios e regras server-side da InfinitePay.
- Componentes e decisões aprovadas dos Estilos 2, 3 e 4.

## Pendente / bloqueios

1. **CI:** a consulta de workflow para o HEAD `0f0d23f` retornou lista vazia; o status combinado mostra somente Vercel em falha. TypeScript, suíte de testes e build não foram declarados aprovados.
2. **Vercel:** deployment `dpl_2tycv9CZfvaJMSq4PFtWh3c181G6`, associado ao HEAD `0f0d23f`, terminou em `ERROR / BUILD_FAILED — Resource provisioning failed`. A consulta de eventos de build retornou vazia. Não há Preview READY.
3. **Visual:** inspeção renderizada página por página em desktop/celular permanece pendente por falta de preview.
4. **Áudio:** falta ouvir Marianne, ambiência e frequências Solfeggio em dispositivo real, incluindo pausa, retomada, conclusão e falha de rede.
5. **Diário:** falta homologação ponta a ponta com persistência real por conta.
6. **InfinitePay:** falta sandbox de checkout, confirmação, webhook e recuperação de pedido.
7. **Integração:** após os commits de código/teste, a branch está **170 commits à frente e 12 atrás** da main. Reconciliar seletivamente os 12 commits posteriores; não fazer merge/rebase cego nem substituir integralmente arquivos.

**Sem merge, sem publicação em Production e sem cobrança real.**
