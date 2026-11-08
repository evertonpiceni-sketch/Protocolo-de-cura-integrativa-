# Auditoria — Estilo 1: Natural Sereno — RUN 35

**Data:** 08/11/2026  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Base integrada:** `main` em `1219158a78e354a3bf98111badf85ae5463fb2ae`  
**Código validado:** `c858048bd7f041ca9e93b5763edaf316b3b3cd46`  
**Estado:** PR #67 aberta, sem merge ou publicação.

## Corrigido nesta rodada

### Pagamentos — dois achados P1 da revisão independente

1. **Cleanup após perda do lock:** a limpeza de pedidos agora só tenta persistir enquanto o lock global continua comprovadamente retido. Antes de gravar, recarrega o snapshot compartilhado, valida novamente a posse do lock e localiza o pedido pelo ID no snapshot atualizado. Se a posse do lock não puder ser comprovada, não grava nem marca o pedido com um snapshot potencialmente obsoleto; a tentativa fica disponível para recuperação segura ou conferência manual.

2. **Práticas individuais legadas:** pedidos pendentes sem `productType`, mas com `treatment`, agora entram na reconciliação. Um retry idêntico reutiliza o link existente quando o payload comprova `single_payment: true`; links legados sem essa garantia bloqueiam nova abertura (503); dados diferentes em uma prática legada ainda pagável bloqueiam a criação de outro link (409). Não se reabre o checkout obsoleto de Numerologia.

### Voz e Solfeggio

- Natural Sereno bloqueia a seleção de frequências Solfeggio durante a prévia neural, evitando sobreposição tonal.
- Ambiências não tonais continuam selecionáveis; a proteção não transforma toda a paisagem sonora em bloqueio.
- Preservada a regra mais recente da main para Elegância Profunda (bloqueio de Solfeggio durante a prévia neural) e Essência Luminosa (bloqueio da seleção durante a prévia).
- Mantida a política compartilhada que impede Solfeggio global durante narração de protocolo.

### Integração com a main

- Integrados os seis commits posteriores da main que tratam da classificação de frequências, seleção de Solfeggio no Estilo 2, correções do contato flutuante e testes do Estilo 3.
- Integrado também o relatório documental mais recente do Estilo 2.
- Nenhuma versão antiga das PRs substituídas foi recuperada.

## Preservado

- Prancha oficial Natural Sereno em `docs/visual-qa/natural-sereno/reference.jpg`, subordinada às decisões aprovadas posteriores.
- Seletor explícito dos quatro estilos, sem pré-seleção automática e com confirmação antes da aplicação.
- Creme/marfim, café/marrom e dourado refinado; verde-sálvia apenas como acento natural, sem grandes chapas verdes.
- Paisagens realistas e regras responsivas desktop/mobile.
- Logo oficial discreto como assinatura (30% desktop / 26% mobile).
- Diário, sincronização, player, seis etapas, animações, respiração 4–3–5 e movimento reduzido.
- Voz neural e IDs válidos; sem substituição silenciosa pela voz robótica do navegador.
- Ownership de áudio do Arcanjo e Solfeggio próprio.
- Estilos 2, 3 e 4 e suas decisões posteriores, sem redesenho nesta rodada.
- Catálogo atual de preços/cupons e entitlement de Numerologia.

## Reauditoria — GitHub Actions #1688

No head de código `c858048bd7f041ca9e93b5763edaf316b3b3cd46`:

- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **139/139 aprovados**.
- Build Vite: aprovado.
- Entry points Vercel/Express: aprovados.
- Verificações de padrões de segredos e JWT: aprovadas.
- Proteção de registro/admin: aprovada.
- Smoke tests de saúde e cadastro: aprovados.
- Endpoints de pagamento fail-closed: aprovados.

A integração documental subsequente apenas adiciona o relatório atual da main; não altera o código validado. A PR permanece mergeável.

## Pendências e bloqueios externos

1. **Preview visual:** Vercel ainda bloqueia nova implantação pelo limite diário de deployments. Sem preview navegável, faltam capturas renderizadas página a página em desktop/mobile; a auditoria CSS permanece estática.
2. **Áudio real:** falta escutar no navegador a voz neural efetivamente selecionada e conferir as transições entre narração, Solfeggio e ambiência.
3. **InfinitePay:** a última consulta de metadados sem descriptografar segredos não encontrou `INFINITEPAY_API_KEY` em produção nem em preview. O checkout permanece fail-closed (503 antes de criar pedido ou chamar o provedor).
4. **Links legados:** conciliar links antigos potencialmente multiuso diretamente na conta InfinitePay. Nenhum checkout, cobrança ou estorno real foi iniciado.
5. **Segredo antigo de preview:** revisar a variável `UPSTASH_DB_KEY` sinalizada como `readable-secret` em uma branch antiga. Seu valor não foi consultado, copiado ou alterado.
6. **Revisão independente final:** solicitada para o head atualizado; aguardar retorno.

**Sem merge, sem deploy de produção, sem transação real, cobrança ou estorno.**
