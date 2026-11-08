# Auditoria — Estilo 1: Natural Sereno — RUN 36

**Data:** 08/11/2026  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Base main integrada:** `000a8818ed895fc2be0f0dc4933a6848ed5b8af4`  
**Head auditado após integração:** `aeb8dae038432d2a7b6e883dbaf81e65aaaed483`  
**PR:** #67 — aberta, mergeável, sem merge e sem publicação.

## Corrigido e confirmado nesta rodada

### Pagamentos — achado P1 sobre prática individual pendente

A revisão independente mais recente apontou risco de criar um segundo link quando uma prática individual já possui checkout pendente e a pessoa tenta novamente com outro cupom ou forma de pagamento.

O head atual contém a proteção:
- identifica a intenção da prática pendente independentemente do valor/cupom;
- se a mesma prática já está pendente, mas preço ou método diferem, responde **409** antes de chamar a InfinitePay;
- não cria novo pedido nem novo link;
- mantém a reutilização idempotente do link quando a compra corresponde exatamente ao pedido protegido.

O teste em `tests/payment.test.ts` cobre a troca de cupom: espera 409, confirma que o número de chamadas ao provedor não aumenta e que permanece apenas um pedido para a conta de teste. A thread P1 correspondente está resolvida e desatualizada pelo head atual.

### Cleanup após perda do lock

O fluxo de falha só marca um pedido como falho se:
1. comprovar a posse do lock global;
2. recarregar o snapshot persistido;
3. comprovar novamente a posse do lock;
4. localizar o pedido pelo ID no snapshot atualizado;
5. validar o lock imediatamente antes de persistir.

Se a posse não puder ser comprovada, não grava um snapshot possivelmente obsoleto.

### Identidade visual — varredura estática

- A referência visual versionada está presente em `docs/visual-qa/natural-sereno/reference.jpg` (blob `d260253d853c089d04134a13648716a8f20319f3`) e é usada pelo seletor como prévia do Natural Sereno.
- `src/natural-sereno-approved-overrides.css`: 188 grupos de regras; todos os seletores estão escopados a `:root[data-layout="natural-sereno"]`.
- `src/natural-sereno-home-surface-audit.css`: 16 grupos de regras; todos os seletores também estão escopados ao Natural Sereno.
- Não foram encontrados seletores globais nessas duas camadas.
- As referências a classes antigas de verde-floresta/oliva e amarelo nos seletores servem para localizar e neutralizar classes herdadas; os valores ativos são remapeados para creme/marfim, café/marrom, dourado refinado e sálvia discreta.
- A cobertura estática inclui Home/acolhimento, cabeçalho, dock, contato flutuante, Diário, Anamnese, vídeo, Mapa Astral, Numerologia, planos/checkout, Banhos, Ho'oponopono, instalação, conquistas, cursos, Administração, configurações de áudio, painel de progresso e player.
- A Home mantém regras separadas para desktop e mobile, com posições de paisagem específicas. A imagem real permanece como fundo responsivo, sem chapas verdes dominantes.

### Seletor e áudio

- `LayoutChoiceModal` inicia com `selectedLayout = null`; confirmar fica desabilitado até uma escolha explícita.
- `App.tsx` mantém `layoutConfirmedThisSession = false` ao iniciar a sessão e apresenta o seletor antes de aplicar o tema.
- Os quatro estilos permanecem disponíveis; a escolha é persistida antes de fechar o seletor.
- Logo oficial: opacidade 30% no desktop e 26% em telas pequenas.
- Prévia neural: o Natural Sereno não usa fallback silencioso para SpeechSynthesis; frequências Solfeggio ficam indisponíveis durante a prévia, enquanto ambiências não tonais continuam possíveis.
- Player: política de áudio bloqueia frequências tonais durante a narração, mantém ambiência não tonal e preserva o oscilador próprio do Arcanjo.
- Ownership do áudio do Arcanjo interrompe a trilha global uma única vez na entrada, sem parar repetidamente o Solfeggio próprio.
- Diário, sincronização, seis etapas, animações, respiração 4–3–5 e preferência de movimento reduzido permanecem preservados.

## Integração das decisões posteriores da main

Depois da primeira validação, a main recebeu dois commits posteriores do Estilo 2:
- `3a721a838ad76a6d93407d02a0fd4a5236ecd381`: remove heranças de cor no Diário da Elegância Profunda.
- `000a8818ed895fc2be0f0dc4933a6848ed5b8af4`: acrescenta testes de isolamento da paleta do Diário.

Ambos foram integrados sem conflito no merge commit `aeb8dae038432d2a7b6e883dbaf81e65aaaed483`. A branch voltou a ficar **0 commits atrás da main**, preservando as duas atualizações posteriores sem alterar o Natural Sereno.

## Reauditoria técnica — GitHub Actions #1702

Executada no merge commit atual `aeb8dae038432d2a7b6e883dbaf81e65aaaed483`:
- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **142/142 aprovados** (0 falhas, 0 ignorados).
- Build Vite e bundle Express: aprovado.
- Entry points Vercel: aprovados.
- Verificações de padrões de segredos/JWT: aprovadas.
- Proteção de cadastro/admin: aprovada.
- Smoke tests: aprovados.
- Endpoints de pagamento fail-closed: aprovados.

## Pendências externas

1. **Prévia visual:** o status Vercel do head permanece em falha por limite de build/deployment; o deployment mais recente retornou `BUILD_FAILED — Resource provisioning failed`. Sem preview navegável, não há capturas reais página a página em desktop/mobile.
2. **Áudio real:** a validação de código não substitui a escuta da voz neural efetivamente salva nem das transições entre narração, Solfeggio e ambiência no navegador.
3. **InfinitePay:** a consulta de metadados sem descriptografar segredos encontrou `INFINITEPAY_HANDLE`, mas não encontrou `INFINITEPAY_API_KEY` em produção ou preview. O checkout permanece fail-closed (503 antes de criar pedido ou chamar o provedor). Não criar segredo sem o valor fornecido pelo responsável.
4. **Links legados:** ainda é necessária conciliação de links antigos potencialmente multiuso na conta InfinitePay; nenhum checkout ou pagamento real foi iniciado.
5. **Higiene de preview antigo:** `UPSTASH_DB_KEY` está restrita à branch antiga `audit/natural-sereno-infinitepay-2026-10-13` e é sinalizada pela Vercel como `readable-secret`. Não foi descriptografada, exposta nem alterada; não está configurada para produção nem para a branch atual.

## Decisões preservadas

- A prancha oficial permanece como referência de prévia; as decisões posteriores prevalecem na aplicação real: creme/marfim, café/marrom, dourado refinado e verde-sálvia apenas como acento.
- Logo oficial sutil, transparente e subordinado à arte.
- Paisagens realistas e responsivas.
- Seletor explícito dos quatro estilos, sem pré-seleção.
- Diário, player, voz neural, Solfeggio, animações e componentes funcionais existentes.
- Estilos 2, 3 e 4 e suas decisões posteriores, sem redesenho nesta rodada.
- Catálogo atual de preços/cupons e entitlement de Numerologia; checkout avulso obsoleto `numerology_full` não foi recuperado.

**Conclusão:** o merge commit atual passou em 142/142 testes, build e auditoria de dependências. O achado P1 de checkout duplicado para a mesma prática está coberto por código e teste. A homologação visual/auditiva e a ativação do checkout real continuam pendentes por bloqueios externos. Sem merge, sem deploy de produção e sem transação financeira.
