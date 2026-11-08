# Reauditoria — Estilo 1: Natural Sereno — RUN 33

**Data:** 08/11/2026  
**Base:** `main` em `b43ba0c73f920d8ef66186a2476116070592d9b1`  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Estado:** integração reconstruída sobre a main atual; PR aberta, sem merge ou publicação.

## Corrigido

### Integração e decisões vigentes
- A integração foi reconstruída a partir do HEAD atual da `main`, incluindo as três atualizações posteriores da RUN 83 dos Estilos 2 e 3.
- Os arquivos dessas atualizações não se sobrepõem aos arquivos do escopo Natural Sereno; foram preservados integralmente.
- Nenhuma versão antiga das PRs #64/#65 ou da branch divergente #66 foi usada como base.

### InfinitePay — bloqueio de links simultâneos
- Corrigido também o achado P1 de concorrência entre instâncias Vercel: após adquirir o lock Redis, a rota agora recarrega o snapshot persistente antes de consultar pedidos pendentes.
- A renovação/validação do lock é repetida após a leitura remota; falha de Redis interrompe o checkout em modo fail-closed, sem chamar o provedor.
- Isso impede que uma instância aquecida deduplique usando uma cópia antiga e sobrescreva o pedido criado pela instância anterior.
- Corrigido o achado P1 da revisão independente: uma assinatura pendente de um plano agora impede criar um segundo link para outro plano.
- O mesmo plano reutiliza o link único já existente.
- Pedidos legados sem `productType`, mas com `planId`, também são reconhecidos como assinaturas pendentes e não podem ser contornados.
- Adicionados testes de regressão para plano diferente, repetição do mesmo plano, registro legado e atualização do snapshot Redis sob o lock.
- Mantidos lock Redis distribuído, persistência do payload original, recuperação idempotente e `single_payment: true`.

### Heranças visuais finais identificadas e neutralizadas
- A varredura da cascata ativa encontrou o gradiente amarelo antigo do CTA de acolhimento/Editorial, o texto verde do CTA editorial e o véu verde-floresta do pseudo-elemento do player.
- A regra antiga do rodapé do player tinha especificidade maior que a correção genérica de footer; foi substituída por uma regra final escopada ao Natural Sereno.
- Variáveis locais antigas de modal, cursos, Numerologia e Administração foram normalizadas para café/marrom, creme/marfim e dourado refinado; sálvia permanece apenas em pequenos sinais naturais.
- O botão principal do player e a barra de progresso receberam acabamento dourado refinado, sem alterar a lógica de áudio.
- Teste de regressão cobre CTA, variáveis e player.

## Preservado

- Prancha oficial do Natural Sereno versionada em `docs/visual-qa/natural-sereno/reference.jpg`, subordinada às decisões posteriores.
- Seletor explícito dos quatro estilos, sem pré-seleção e sem aplicação antes da confirmação.
- Creme/marfim, café/marrom e dourado refinado; verde-sálvia somente como acento, sem grandes chapas verdes.
- Fotografia realista e regras responsivas de paisagem para desktop/mobile.
- Logo oficial discreto (30% desktop / 26% mobile).
- Diário, sincronização, player, seis etapas, animações, respiração 4–3–5 e movimento reduzido.
- Voz neural aprovada e política de não substituir silenciosamente a voz escolhida por voz robótica.
- Ownership do áudio do Arcanjo e Solfeggio próprio; ambiência global não interrompe o oscilador do protocolo.
- Atualizações atuais dos Estilos 2, 3 e 4, sem redesenho nesta rodada.
- Catálogo atual de preços/cupons e benefício de Numerologia condicionado ao entitlement confirmado; checkout avulso obsoleto `numerology_full` não foi recuperado.

## Reauditoria estática por áreas

A camada Natural Sereno mantém regras escopadas ao atributo `data-layout="natural-sereno"`. A cobertura inclui Home/Comunidade, Mapa Astral, Numerologia, Banhos, Ho'oponopono, Instalação, Conquistas, Diário, Anamnese, Administração, Prática Individual, cabeçalho, dock e player. Esta verificação é estática; não equivale a inspeção renderizada pixel a pixel.

## Pendências e bloqueios externos

1. **API Key InfinitePay:** a revisão P1 permanece como bloqueio de publicação. A última consulta de metadados Vercel não encontrou `INFINITEPAY_API_KEY`. O código continua fail-closed (503 antes de criar pedido ou chamar o provedor). Não há credencial disponível nesta execução para configurar o segredo; não tentar contornar a proteção.
2. **Preview visual:** Vercel recusou a última implantação por `api-deployments-free-per-day`. Sem preview navegável, não há capturas reais página a página em desktop/mobile.
3. **Áudio:** falta escuta real da voz selecionada e das transições narração/Solfeggio/ambiência no navegador.
4. **Links antigos:** conciliar links legados potencialmente multiuso na conta InfinitePay. Nenhum checkout, cobrança ou estorno real foi iniciado.
5. **Segredo de preview legado:** revisar a variável sinalizada como segredo legível sem consultar, expor ou alterar seu valor.

## Evidência

- A execução GitHub Actions **#1668**, no head `4d49a4f3be7c20ee48d93469e8a863abe0c01455`, concluiu com sucesso: `npm audit` encontrou **0 vulnerabilidades**; TypeScript, build, entry points Vercel, verificação de segredos/JWT, proteção administrativa, smoke tests e endpoints de pagamento aprovados; **136/136 testes aprovados**.
- O review automatizado apontou três pontos P1 ao longo da rodada: API Key ausente no ambiente, múltiplos links de assinatura pendentes e snapshot Redis desatualizado entre instâncias. Os dois problemas de código foram corrigidos; os respectivos tópicos de revisão foram tratados. A API Key continua sendo configuração externa obrigatória antes de qualquer publicação.
- Não houve merge, deploy de produção, transação real, cobrança ou estorno.

**Evidência CI:** [Execução #1668 — 136/136 testes e zero vulnerabilidades](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42453011750).\n\n**Critério:** não mesclar nem publicar enquanto o segredo InfinitePay não estiver configurado e enquanto a homologação visual/auditiva não puder ser concluída.