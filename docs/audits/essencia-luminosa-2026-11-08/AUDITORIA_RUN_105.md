# Auditoria RUN 105 — Estilo 3: Essência Luminosa

**Data:** 08/11/2026 — 22:38 (America/Sao_Paulo)  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Base auditada:** `main` em `36ca2cad51a78c34151819a1410a02661bae4899`  
**Branch de correção:** `fix/essencia-luminosa-dialog-focus-20261108-run11`  
**Commit de código:** `7d010ca397643d3f05a8bee07c56717285567acd`

## Corrigido

A varredura de todos os usos de `useDialogFocus` encontrou sete diálogos em que o gerenciamento de foco era ativado somente para Natural Sereno. No Estilo 3, esses diálogos podiam abrir sem foco inicial gerenciado, contenção de Tab/Shift+Tab e fechamento por Escape.

Correção mínima aplicada, mantendo Natural Sereno intacto e incluindo Essência Luminosa:

1. `src/components/AnamnesisModal.tsx`
2. `src/components/CoursesModal.tsx`
3. `src/components/DashboardCura.tsx`
4. `src/components/ContactModal.tsx`
5. `src/components/PromoVideoModal.tsx`
6. `src/components/ProReportCertificateModal.tsx`
7. `src/components/AdminPanelModal.tsx`

Foi acrescentado `tests/essencia-luminosa-dialog-focus.test.ts` para impedir regressão dessas sete condições.

## Preservado e revalidado estaticamente

- O comportamento de foco do Natural Sereno foi mantido nas sete telas.
- Os demais componentes encontrados já usavam `useDialogFocus` sem restrição exclusiva a Natural Sereno ou já incluíam Essência Luminosa; não foram alterados.
- O seletor React continua com escolha inicial nula, confirmação obrigatória e card do Estilo 3 em `/brand/essencia-luminosa/prancha-oficial.webp`.
- `App.tsx` continua removendo `data-layout` até a confirmação explícita.
- A ordem da cascata continua preservando `essencia-luminosa-approved-overrides.css` como última camada de tema.
- Paleta marfim/champagne/ouro suave/sálvia/areia, assinatura discreta do logo, Home, componentes, textos, lógica e demais estilos não foram modificados nesta rodada.
- A voz do Estilo 3 continua no fluxo neural protegido, sem fallback silencioso para SpeechSynthesis; o bloqueio de frequências durante prévia neural permanece.
- Diário, player, animações e regras de pagamento não receberam alterações. O código de checkout e as regras comerciais foram preservados.
- Nenhuma imagem gerada nesta rodada foi incorporada. A cena atual da Home continua sem alteração.

## Referência visual e natureza

- O seletor continua apontando para `public/brand/essencia-luminosa/prancha-oficial.webp` (320 × 240 px).
- A conversa contém uma derivação `prancha-oficial-768.webp`, visualmente correspondente à prancha. O arquivo-fonte exato `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6` não foi recuperado pela busca de arquivos nesta execução; portanto, não foi feita nova comparação pixel a pixel nem substituição do card.
- A fotografia da Home continua vindo do CDN Unsplash. A autoria/licença específica não foi confirmada e não existe cópia local versionada. Não atribuir fotógrafo sem comprovação.

## Validação e limites

- A inspeção estática confirmou que as sete chamadas agora incluem Essência Luminosa.
- O teste de regressão foi adicionado, mas **não foi executado** nesta rodada.
- A tentativa de clonar o repositório no executor falhou por indisponibilidade de resolução de `github.com`.
- O workflow `Security Audit` está configurado para `push` em `main`, `pull_request` para `main` e `workflow_dispatch`; não executa automaticamente em branch isolada. Não foi aberto PR nem feito merge, para evitar outro deployment enquanto a Vercel apresenta falha de provisionamento.
- O commit de base `36ca2cad` tem a execução de Security Audit `42537328831` aprovada; isso não valida o novo commit desta branch.

## Vercel

O bloqueio de provisionamento não está isolado ao código do Estilo 3:

- Deployment do Estilo 3 associado ao commit `f2bff9f`: `ERROR / BUILD_FAILED / Resource provisioning failed`.
- Deployment mais recente consultado, de uma branch de auditoria do Estilo 1: também `ERROR / BUILD_FAILED / Resource provisioning failed`.
- A consulta de eventos de build retornou lista vazia; não há log que permita atribuir a falha a uma linha de código.
- Nenhum novo deployment foi iniciado nesta rodada.

## Pendente

1. Executar o novo teste e a suíte completa em CI.
2. Homologar em navegador os sete diálogos em 320, 390 e 1365 px: foco inicial, Tab, Shift+Tab, Escape e retorno do foco ao elemento de origem.
3. Percorrer visualmente todas as páginas renderizadas; inspeção estática não comprova fidelidade visual.
4. Recuperar o PNG-fonte para comparação com o card WebP.
5. Confirmar origem/licença da fotografia externa e decidir sobre cópia local.
6. Testar voz neural, oito frequências, ambiências, Diário, player, Media Session e animações em dispositivos.
7. Executar transação InfinitePay em sandbox e validar webhook.
8. Resolver o provisionamento da Vercel, depois publicar e conferir o alias de produção.

**Conclusão:** foi corrigida uma regressão real de acessibilidade em sete diálogos, com teste de proteção acrescentado. A correção está isolada em branch própria e não altera a identidade visual nem os fluxos comerciais. Não declaro CI, homologação visual, áudio real, sandbox ou produção aprovados enquanto essas etapas não forem executadas.

## Estado concorrente do repositório

Durante esta execução, outra auditoria publicou em `main` o commit `cbb6f0acae6aea90daabfbc7b38b64e5eb62df03`, que adiciona somente `docs/audits/elegancia-profunda-2026-11-08/AUDITORIA_RUN_105.md`. A branch desta correção parte de `36ca2cad`, permanece 2 commits à frente e 1 atrás de `main`; a diferença concorrente é documental, sem conflito de código. Não foi feito merge nem atualização de `main` nesta rodada.

## Alias de produção

A consulta direta aos dois aliases Vercel do projeto confirmou que ambos ainda apontam para o deployment READY `dpl_87ANQ2b6G3738g7CxA6uekoaN1Du`, commit `5bd202e30f6459a0862ba38796912c0025c6af5a` (correção anterior de contraste em CTA). Os cinco deployments de produção mais recentes consultados, incluindo o deployment Style 3 de `f2bff9f`, estão em `ERROR`. Assim, a produção não contém esta correção de foco nem o código mais recente da branch `main`.
