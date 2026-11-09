# Auditoria RUN 106 — Estilo 1: Natural Sereno

**Data:** 08/11/2026 (horário local)  
**Branch:** `audit/natural-sereno-run97-mainline-2026-11-08`  
**Commit de código validado:** `06ade781b9e16ff304bbf183bee0bf92b82303e7`  
**PR:** #74 — aberta, em rascunho

## Resultado executivo

A reauditoria encontrou duas regressões concretas na Anamnese: o seletor de gênero ainda aparecia mesmo quando o áudio usava a voz neural salva, e o player mantinha gradientes amarelo-dourados de uma camada antiga. Ambos foram corrigidos na origem e protegidos por teste de regressão.

## Corrigido

### Voz da Anamnese

- O Natural Sereno já utilizava o ID neural ElevenLabs do perfil (ou Marianne — Meditação como voz oficial de reserva), mas ainda exibia controles “Voz masculina” / “Voz suave” que não alteravam essa voz.
- O seletor de gênero agora aparece somente nos estilos que não exigem voz neural.
- A identificação junto ao áudio mostra a voz efetiva: voz neural salva no perfil ou “Marianne — Meditação (voz oficial)”.
- O texto deixa de sugerir uma troca de voz que não ocorria.

### Player de áudio da Anamnese

Na folha `natural-sereno-refinement.css` ainda existiam os valores antigos `#D8BD6B`, `#896923`, `#E5C773`, `#A8812E`, `#EFD896`, `#FFF0B3` e `#C3A557`.

Foram substituídos na própria folha de origem por:
- Dourado aprovado `#E2B96B → #C89D52`.
- Sálvia discreta `#5E6948` apenas no pequeno indicador de onda.
- Borda e sombra café discretas, sem brilho amarelo saturado.

Não foi adicionada uma nova camada de override para esconder a regra antiga.

### Testes

- Adicionado teste que verifica a voz exibida e impede o retorno dos sete valores antigos no player da Anamnese.
- Atualizada a expectativa compartilhada do teste da Essência Luminosa para o guardrail comum `requiresNeuralVoice`. O comportamento do Estilo 3 não foi alterado.
- A primeira CI após a correção de código encontrou somente essa expectativa de teste desatualizada; ela foi atualizada e a execução seguinte passou integralmente.

## Preservado

- Seletor dos quatro estilos com estado inicial vazio, seleção explícita e confirmação antes de aplicar `data-layout`.
- Cadastro/login neutros; a preferência salva não aplica tema sem confirmação na sessão.
- Prancha Natural Sereno continua sendo a imagem de referência do card; a descrição e as amostras abaixo do card mostram a paleta vigente, subordinada às decisões posteriores.
- Creme/marfim, café/marrom, dourado refinado e verde-sálvia somente como acento.
- Fotografias de natureza, enquadramentos responsivos existentes, tipografia, botões premium e assinatura discreta do logo (30% desktop / 26% mobile).
- Diário, sincronização, Solfeggio, player, seis etapas e respiração 4–3–5.
- Estilos 2, 3 e 4 sem redesenho. A alteração compartilhada apenas mantém a regra de voz neural que já existia nesses estilos.
- InfinitePay, preços, cupons, benefícios, confirmação server-side e deduplicação; nenhuma regra financeira foi modificada.

## Varredura e validação

- 12 folhas CSS específicas do Natural Sereno examinadas.
- Os 16 tokens legados de verde-floresta/amarelo já rastreados não aparecem nas 12 folhas.
- A varredura adicional por tons dourados encontrou os sete valores listados acima no player da Anamnese; todos foram removidos dessa folha.
- GitHub Actions Security Audit **#1977** — execução **42550144539**:
  - `npm audit`: **0 vulnerabilidades**.
  - TypeScript: aprovado.
  - Testes: **184/184 aprovados**.
  - Build: aprovado, **2.249 módulos transformados**.
  - Entry points Vercel/Express, JWT, autenticação administrativa, smoke tests e endpoints de pagamento: aprovados.

## Pendências

1. Check Vercel continua em `build-rate-limit`; não há preview READY. Falta inspeção renderizada de cada página em desktop e mobile.
2. Falta ouvir a voz realmente selecionada e testar em navegador as transições entre narração, Solfeggio e ambiência. A proteção contra fallback robótico foi validada no código, não por escuta real.
3. Falta homologar InfinitePay em sandbox, incluindo confirmação e webhook. Nenhuma cobrança foi feita.
4. A Library retornou e permitiu inspecionar `Painel UX_UI Natural Sereno.png`, visualmente correspondente à prancha do Estilo 1. A busca não retornou o identificador exato `file_00000000317c820ebaad657dc3680de5`; por isso, não afirmo identidade binária. A referência versionada `docs/visual-qa/natural-sereno/reference.jpg` foi preservada e não substituída.
5. A branch está **87 commits à frente e 10 atrás** da `main`. Os 10 commits posteriores foram comparados: incluem documentação dos Estilos 2/3, `src/approved-theme.css` (idêntico na branch) e ajustes de teste da Essência Luminosa; a branch contém as expectativas mais recentes de voz/Solfeggio. Não foi feito merge; manter a revisão de integração antes de publicar.
6. Solicitar revisão independente do HEAD atualizado.

## Publicação

- PR #74 permanece aberta, em rascunho e mergeable.
- Nenhum merge na `main`.
- Nenhuma publicação em produção.
- Nenhuma cobrança real.

**Conclusão:** a voz exibida na Anamnese agora corresponde à voz neural efetivamente usada, e os últimos tons amarelos antigos desse player foram substituídos na origem. A CI passou com 184/184 testes. O Natural Sereno ainda não está homologado integralmente até haver preview navegável, escuta real e sandbox financeiro.
