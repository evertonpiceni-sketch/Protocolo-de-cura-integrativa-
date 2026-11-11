# Auditoria RUN 169 — Estilo 1: Natural Sereno

**Data:** 11/11/2026 — 09:14 BRT  
**HEAD auditado antes da intervenção:** `45a11cdbf07aa8ca2d9ea49b5b2aa364ea25e8c7`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho.

## Corrigido

1. **Acolhimento mobile:** a cascata final ainda permitia que o véu marrom escuro definido em uma camada antiga prevalecesse na tela de chegada do Natural Sereno. A camada final agora usa o creme/marfim aprovado, com sobreposição leve e texto café, mantendo a fotografia realista `acolhimento.webp`.
2. **Desktop:** o enquadramento vertical da mesma fotografia foi preservado na regra específica para telas largas; não foi substituído por outra imagem.
3. **Proteção:** criado `tests/natural-sereno-run169-welcome-surface.test.ts` para proteger paleta, fotografia, enquadramento desktop, assinatura do logo e isolamento do Estilo 1.

## Preservado

- Seletor dos quatro estilos: sem pré-seleção, escolha explícita e confirmação obrigatória antes de aplicar o tema.
- Home ativa `NaturalSerenoHome`, navegação, conteúdo, imagens diárias e ações existentes.
- Creme/marfim, café/marrom, dourado refinado e verde somente como acento natural.
- Logo oficial discreto; regra de assinatura da Reintegração em 30% preservada.
- Reintegração de 21 dias, corpo neutro, movimento da luz, player e animações.
- Marianne (`mJqP14JQFEK0PojR5lfV)), autenticação e respostas privadas sem fallback robótico na narração da Reintegração.
- Política Solfeggio e sincronização/privacidade do Diário.
- Proteções de checkout InfinitePay.
- Estilos 2, 3 e 4 sem alterações de tema.

## Reauditoria e estado técnico

- A correção ficou restrita a seletores `:root[data-layout="natural-sereno"]`.
- O teste foi adicionado, mas não executado pelo runner nesta rodada.
- GitHub Actions não retornou workflow associado ao HEAD auditado.
- O check combinado do HEAD auditado retornou Vercel `failure`, com destino indicando `build-rate-limit`.
- A comparação da branch com `main` retornou **292 commits à frente e 12 atrás**.
- A PR #79 ainda estava com a descrição antiga apontando HEAD `5d3dcafe`; esse metadado será atualizado para o HEAD real após os commits desta rodada.
- O último inventário financeiro registrado na RUN 168 apontava ausência de `INFINITEPAY_API_KEY` e de configuração `PUBLIC_APP_URL` para Preview. Não foram reconsultados nem descriptografados segredos nesta rodada.

## Pendente

- Executar suíte Node/TypeScript, TypeScript e build.
- Recuperar Preview READY e validar o acolhimento renderizado em desktop e celular.
- QA visual renderizado página a página.
- Escuta real de Marianne, Solfeggio e player.
- Diário e Reintegração ponta a ponta.
- Homologação InfinitePay sandbox/webhook.
- Reconciliação seletiva dos 12 commits divergentes da `main`; não fazer merge/rebase automático.

Nenhum merge, deploy em Production, alteração de credenciais ou pagamento real foi realizado.


## Verificações estáticas adicionais

Após a intervenção, foram verificadas **18/18 condições de fonte**: camada final do acolhimento, fotografia, base creme/marfim, sobreposição clara, remoção do véu café escuro, enquadramento desktop, seletor sem pré-seleção, confirmação explícita, Home ativa, assinatura do logo, Marianne/autenticação/cache privado, política Solfeggio e ordem de importação das folhas CSS.

Essas verificações inspecionam os arquivos versionados e **não substituem** a execução da suíte Node/TypeScript, TypeScript ou build, que continuam pendentes.
