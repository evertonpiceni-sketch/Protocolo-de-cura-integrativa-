# Reauditoria — Estilo 1: Natural Sereno — RUN 26

**Data:** 07/11/2026  
**Base:** `main` após a correção de dependências `8dbf6f5e48b1138563e073eda0f445169693182f` e registro `2ef847a14a6edf26fe4d199c25a751e75504f3cb`.  
**Branch:** `fix/natural-sereno-mainline-2026-11-07d`

## Corrigido nesta rodada

- **InfinitePay:** atualizado o host da API para `https://api.checkout.infinitepay.io`, com os endpoints oficiais `/links` e `/payment_check`. A documentação atual da InfinitePay identifica esse como o endereço-base vigente.
- **Achado P2 — pedido de Numerologia sem URL:** removido o encerramento automático após cinco minutos. Um pedido persistido sem `checkoutUrl` agora é recuperado reenviando o mesmo payload, com o mesmo `order_nsu`, preço, descrição e URLs de retorno/webhook. A InfinitePay documenta que uma requisição idêntica pode devolver o mesmo link; a recuperação não cria um segundo pedido nem troca o identificador.
- **Falha/interrupção durante a criação:** pedidos `numerology_full` sem URL permanecem recuperáveis; não recebem `failedAt` apenas porque a resposta do provedor ou a gravação da URL foi interrompida. Outros tipos de compra mantêm o tratamento de falha existente.
- **Cache Redis:** permanece subordinado ao pedido persistido: só é reutilizado se usuário, tipo, estado não pago/não falho e URL coincidirem. A gravação do cache mantém TTL de 24 horas.
- **Testes:** incluído cenário de interrupção da resposta do provedor e nova tentativa. O teste exige o mesmo `order_nsu`, payload idêntico, URL recuperada, nenhum pedido adicional e endpoint oficial. O teste compartilhado de auditoria do Estilo 2 também foi atualizado para o host atual da InfinitePay.

## Preservado

- Referência oficial do Natural Sereno em `docs/visual-qa/natural-sereno/reference.jpg`, subordinada às decisões aprovadas posteriores.
- Seletor explícito dos quatro estilos, sem seleção prévia e sem aplicar tema antes da confirmação.
- Home e páginas auditadas: creme/marfim, café/marrom e dourado refinado; verde-sálvia apenas como acento; paisagem realista e recortes responsivos; CTA premium sem pílula.
- Logo oficial como assinatura sutil/transparente, sem competir com a composição.
- Voz neural aprovada já presente na `main`; IDs válidos salvos no perfil são preservados, sem fallback silencioso para SpeechSynthesis.
- Solfeggio não sobrepõe a narração; ambiência não tonal permanece permitida.
- Diário e sincronização, seis etapas do player, animações e respeito a `prefers-reduced-motion`.
- Correção das dependências de segurança já integrada à `main`; não foi reintroduzido o lockfile vulnerável da branch antiga.
- Estilos 2, 3 e 4 permanecem sem alterações visuais nesta rodada.

## Pendente

1. Executar CI completo na nova PR: TypeScript, testes, build e `npm audit`.
2. Capturas renderizadas página a página em desktop e mobile. A verificação de CSS/testes estáticos não substitui homologação visual no navegador; o limite de deployments da Vercel havia bloqueado prévias anteriores.
3. Escuta real da voz aprovada e da transição entre narração e ambiência no navegador.
4. Checkout, retorno e webhook InfinitePay em sandbox, sem cobrança real.
5. Verificar na configuração de ambiente da Vercel se há API Key InfinitePay disponível. A opção `single_payment` da documentação exige API Key; não foi ativada nem presumida nesta rodada.

## Referência técnica

A documentação oficial informa que o host atual é `api.checkout.infinitepay.io`, que `order_nsu` identifica o pedido e que reenviar exatamente a mesma requisição pode devolver o mesmo link. Também informa que `single_payment` requer API Key e que links sem validade configurada não expiram.

- Documentação oficial: https://www.infinitepay.io/checkout-documentacao

**Status:** correção de recuperação idempotente e atualização do endpoint preparadas sobre a linha atual. A PR ainda precisa de CI e homologação real. Nenhuma alteração foi mesclada ou publicada em produção; nenhuma cobrança foi realizada.
