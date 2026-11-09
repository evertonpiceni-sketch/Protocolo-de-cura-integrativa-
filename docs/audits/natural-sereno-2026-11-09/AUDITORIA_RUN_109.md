# Auditoria Estilo 1 — Natural Sereno | RUN 109

**Data:** 09/11/2026  
**Projeto:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Branch:** `audit/natural-sereno-run97-mainline-2026-11-08`  
**HEAD de código/testes:** `b0f62173f534d3dd4da3bf8fc7512c9288352fed`  
**PR:** #74 — aberta, draft, não mergeable.

## Corrigido nesta rodada

A revisão independente da PR #74 havia deixado três apontamentos abertos. Os três receberam correção no código:

1. **P1 — isolamento entre contas durante retries**
   - Criado `src/lib/authSession.ts` para centralizar a chave de sessão local.
   - Cadastro e login atualizam a identidade ativa imediatamente após a resposta bem-sucedida do endpoint, antes de qualquer sincronização ou transição atrasada da interface.
   - Logout invalida a identidade local antes de aguardar a chamada ao servidor, cancelando retries antigos.
   - O cache local também recusa gravar um perfil cujo login não corresponde à conta ativa; callbacks antigos não conseguem trocar a chave de sessão para outra conta.
   - `syncUserState` captura a conta de origem, compara a identidade antes de cada tentativa e depois da resposta; se a conta mudar, interrompe o envio.
   - Payloads de perfil usam também o login declarado no próprio perfil. Os fluxos autenticados do App e da jornada Natural Sereno passam explicitamente a conta de origem.

2. **P2 — retry antigo sobrescrevendo Diário/progresso mais recente**
   - Escritas são serializadas por conta.
   - O payload é congelado no momento da chamada.
   - Uma tentativa antiga termina ou falha antes de a próxima escrita da mesma conta seguir. Assim, um snapshot novo não pode ser ultrapassado por um retry antigo.
   - A fila é independente por conta; uma troca de usuário não mistura as filas.

3. **P2 — Solfeggio durante retomada da narração**
   - Removidos o início otimista do sintetizador e a atualização antecipada de `isPlaying` em `togglePlayback`.
   - A retomada volta a depender do evento real `audio.onplay`, que aciona o callback `onStart`; só então a frequência é reiniciada.
   - Se a retomada de áudio falhar, a frequência não começa sozinha.

## Testes de regressão adicionados

- Cancelamento de retry quando a conta ativa muda.
- Rejeição de callback antigo cujo perfil pertence a outra conta.
- Ordem de persistência: snapshot antigo/retry primeiro, snapshot novo por último.
- Identidade atualizada antes de sincronizar cadastro/login e invalidada antes do logout.
- Cache local protegido contra callbacks de perfil de outra conta.
- Solfeggio retomado somente pelo callback de reprodução real da narração.

**Importante:** os testes foram adicionados, mas ainda não há execução de CI associada ao HEAD desta rodada. Não declaro aprovação de testes, TypeScript ou build sem uma execução verificável.

## Preservado

- Prancha oficial do Natural Sereno e referência otimizada já versionada; as escolhas históricas de cor/CTA/logo da prancha continuam subordinadas às decisões posteriores.
- Paleta vigente: creme/marfim, café/marrom, dourado refinado e sálvia somente como acento; sem grandes chapas verdes ou amarelo saturado.
- Paisagens, enquadramentos, tipografia, botões premium e assinatura sutil do logo. Nenhuma regra CSS ou composição visual foi alterada nesta rodada.
- Seletor dos quatro estilos sem pré-seleção e com confirmação explícita.
- Marianne — Meditação, ID ElevenLabs `mJqP14JQFEK0PojR5lfV`, sem fallback silencioso para SpeechSynthesis nos caminhos protegidos.
- Diário, campos opcionais, seis etapas do player, animações, Media Session e respiração 4–3–5.
- InfinitePay, preços, cupons, validação server-side e confirmação financeira; nenhuma regra comercial foi modificada.
- Identidades visuais dos Estilos 2, 3 e 4; nenhuma tela deles foi redesenhada.
- Assertions de pré-seleção neutra da auditoria mais recente da Elegância Profunda foram incorporadas ao teste compartilhado; os guardrails de voz mais abrangentes do Estilo 1 + Estilos 2/3 foram mantidos.

## Reauditoria e limitações

- O HEAD de código/testes é `e7cbb989619d69ff72a9d6ed6a0c6f2d53c382ae`.
- A consulta de workflow runs associados ao HEAD não retornou execução de GitHub Actions.
- O status combinado disponível continua mostrando somente o check Vercel em falha: `build-rate-limit`.
- A tentativa de clonar a branch para executar testes localmente falhou por indisponibilidade de resolução DNS de `github.com` neste ambiente. Portanto, não foi possível executar a suíte local.
- Não há preview READY para inspeção renderizada. Capturas página a página em desktop/mobile e escuta real de Marianne, Solfeggio e ambiência continuam pendentes.
- Sandbox, confirmação e webhook InfinitePay continuam pendentes. Nenhuma cobrança foi feita.
- A comparação com `main` continua divergente: a branch preserva as correções aprovadas do Natural Sereno, enquanto a main contém 19 commits posteriores de auditorias dos Estilos 2/3 e uma versão de `approved-theme.css` com tokens antigos do Estilo 1. Não copiei essa paleta antiga nem fiz merge automático. A reconciliação deve manter as decisões mais recentes de cada estilo.

## Estado de entrega

PR #74 permanece aberta e em rascunho. Não houve merge, deploy de produção, alteração de preços ou cobrança real. A homologação integral continua bloqueada por CI do novo HEAD, preview navegável, teste auditivo e sandbox financeiro.
