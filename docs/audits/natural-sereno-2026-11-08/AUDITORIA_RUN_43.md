# Reauditoria — Estilo 1: Natural Sereno — RUN 43

**Data:** 08/11/2026 — 09:37 (America/Sao_Paulo)  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Head de trabalho antes desta rodada:** `4049357e6eec8bc4b42c1628169ecf720b285a5a`  
**Main integrada:** `fac34e51250915f823b5e5f4d76e41a7e9b23db5`  
**Estado:** integração registrada em merge commit; PR permanece aberta, sem merge e sem publicação.

## Corrigido nesta rodada

### Sincronização do perfil e progresso — P2
- A revisão mais recente apontou que oito tentativas poderiam encerrar a sincronização enquanto o lock global ainda estivesse ocupado por uma chamada ao provedor com timeout de 15 segundos.
- Aumentado o orçamento padrão para 24 tentativas, mantendo backoff progressivo e o limite de espera de 5 segundos.
- Respostas com `Retry-After` superior ao limite continuam encerrando a tentativa sem reenviar antes do prazo indicado; não há retry antecipado.
- Adicionado teste de regressão com 16 respostas 409 consecutivas e sucesso após a liberação do lock, verificando que a espera acumulada supera 15 segundos.
- O cadastro continua persistindo nascimento, cidade, telefone e preferências atomicamente na transação de registro; não depende de uma segunda chamada de sync.

### Integração das decisões posteriores da main
- Reconciliados os sete commits posteriores à base comum `27b5df0`, sem descartar as correções do Natural Sereno.
- Preservada a escolha explícita do benefício Semestral/Anual (Mapa Astral Completo OU Numerologia Completa).
- O checkout valida a escolha no servidor, grava somente o benefício selecionado após confirmação financeira e protege `subscriptionBenefitChoice` contra sobrescrita pelo cliente.
- Preservado o reset da escolha ao abrir novamente o checkout.
- Integradas as atualizações de checkout compartilhado da Elegância Profunda, suas regras CSS isoladas e os testes correspondentes.
- Mantidos os relatórios RUN 90 e RUN 91 da Elegância Profunda.

### Revisão independente
- Os cinco apontamentos P1 de concorrência/deduplicação em pagamentos já estavam corrigidos e com threads resolvidas.
- Os dois apontamentos P2 anteriores estão cobertos: Retry-After longo não provoca retry antecipado; cadastro grava os campos na mesma transação.
- O P2 atual de sincronização prolongada foi corrigido e recebeu teste dedicado.

## Preservado

- Referência Natural Sereno versionada em `docs/visual-qa/natural-sereno/reference.jpg`; não foi substituída por outra imagem.
- Seletor neutro dos quatro estilos, sem aplicação automática antes da escolha e confirmação.
- Paleta creme/marfim, café/marrom e dourado refinado; verde-sálvia somente como acento.
- Fotografias realistas, regras responsivas, botões premium e assinatura discreta do logo.
- Diário, player, seis etapas, animações, respiração 4–3–5, voz neural e política Solfeggio.
- Locks globais, refresh de snapshot, deduplicação, idempotência, confirmação server-side e fail-closed de pagamento.
- Decisões vigentes dos Estilos 2, 3 e 4, sem redesenho ou reversão.

## Auditoria visual e evidência disponível

- As camadas Natural Sereno continuam escopadas a `data-layout="natural-sereno"`; as correções desta rodada não introduzem seletores globais.
- A busca no Library por `1001196520.png` e pelo identificador `file_00000000317c820ebaad657dc3680de5` não localizou o arquivo original exato. A cópia versionada no repositório foi preservada, sem inventar ou substituir a referência.
- A inspeção renderizada página a página em desktop/mobile permanece pendente: não há deployment READY para o head atual.

## Pagamentos e configuração externa

- Metadados Vercel consultados sem descriptografar segredos: `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` estão presentes em produção.
- `INFINITEPAY_API_KEY` não aparece na listagem de variáveis; o checkout permanece bloqueado com segurança antes de criar pedido ou chamar o provedor.
- A variável antiga `UPSTASH_DB_KEY` permanece plain e sinalizada como `readable-secret`, limitada à branch de auditoria antiga. Não foi lida em claro, alterada ou removida.
- Nenhuma cobrança, confirmação financeira real ou estorno foi executado.

## Pendências

1. CI completo do novo merge commit: aguardando execução.
2. Preview Vercel navegável: os deployments recentes desta branch estão em estado ERROR; o check externo atual aponta `build-rate-limit`. Sem preview, não há capturas reais desktop/mobile.
3. Escuta real da voz neural escolhida e transições entre narração, Solfeggio e ambiência.
4. Configuração segura da `INFINITEPAY_API_KEY` e teste sandbox.
5. Conciliação de links InfinitePay legados.
6. Revisão/limpeza da variável plain de preview da branch antiga, após confirmar que não há dependência operacional.

**Conclusão:** a integração foi reconciliada sem recuperar versões reprovadas; a sincronização agora permanece tentando por uma janela superior ao timeout do provedor. A homologação visual, auditiva e financeira continua pendente. Nenhuma publicação em produção foi realizada.


## Reauditoria do primeiro CI após a integração

- Execução #1773: `npm audit` aprovado e TypeScript aprovado.
- Testes: 167/168 aprovados. A única falha foi uma asserção antiga de `tests/natural-sereno-mainline.test.ts` que proibia qualquer ocorrência de `numerologyPurchased`.
- A decisão posterior da main permite esse entitlement exclusivamente quando o plano Semestral/Anual tem escolha explícita e o pagamento é confirmado. O checkout avulso `numerology_full` continua removido.
- Atualizada a asserção para verificar a origem restrita do entitlement e manter a proibição do produto avulso.
- Nova execução CI aguardando após este commit.
