# Auditoria RUN 106 — Estilo 2: Elegância Profunda

**Data:** 09/11/2026  
**Branch:** `main`  
**HEAD de implementação validado:** `18e2021fdecb94a4e9e083f7aed0339191b163d7`

## Resultado executivo

Foi encontrada e corrigida uma regressão real na pré-seleção: `src/approved-theme.css` declarava tokens de cor no seletor `#profile-setup-view` com valores próprios do Natural Sereno, embora o comentário afirmasse que o cadastro era neutro. Isso podia antecipar parte da identidade do Estilo 1 antes da escolha explícita.

A declaração de paleta local foi removida. O cadastro agora herda os tokens neutros já definidos em `:root:not([data-layout])`. A escolha dos quatro estilos continua obrigatória antes de qualquer aplicação de `data-layout`.

## Corrigido

- Removido o bloco de variáveis de tema específico de `#profile-setup-view` em `src/approved-theme.css`.
- Cadastro/login passam a herdar exclusivamente os tokens neutros de pré-seleção: canvas, superfícies, acento, dourado, texto e bordas.
- Preservado o comentário contratual esperado pelos testes de auditoria existentes.
- Ampliado `tests/style2-prestyle-neutral.test.ts` para impedir que uma paleta específica volte a ser declarada no bloco do cadastro.
- A nova proteção verifica os tokens neutros de `:root:not([data-layout])` e mantém a assinatura do logo em 30%, com wrapper transparente.

## Preservado e revalidado

- As 21 folhas CSS específicas da Elegância Profunda não foram alteradas.
- O teste de regressão que percorre as 21 folhas e exige isolamento por `data-layout="elegancia-profunda"` passou.
- A camada `elegancia-profunda-approved-overrides.css` permanece na ordem aprovada.
- Card oficial continua em `/brand/elegancia-profunda/prancha-oficial.svg`, com derivação 300 × 225, proporção 4:3, sem recorte e hash de integridade preservado.
- Paleta profunda, ouro nobre/champagne/bronze/marfim e tipografia Playfair Display/Montserrat preservados.
- Logo oficial permanece discreto, com 30% de opacidade e wrapper transparente.
- `LayoutChoiceModal` continua com seleção inicial nula e confirmação desabilitada até escolha explícita.
- `App.tsx` mantém `layoutConfirmedThisSession = false` e remove `data-layout` até a confirmação persistida.
- Onboarding React ativo; mecanismos DOM antigos e `WelcomeModal` permanecem fora do fluxo.
- Jornada de 21 dias e corpo neutro preservados.
- Voz neural, bloqueio de Solfeggio durante prévia, ambiências não tonais, Diário, player, Media Session e animações não foram modificados.
- InfinitePay permanece com confirmação server-side, validação de valor e proteção contra reutilização de transação; nenhuma regra comercial foi alterada.

## Validação técnica

GitHub Actions **#42554645443**, no commit `18e2021fdecb94a4e9e083f7aed0339191b163d7`:
- Testes: **153 aprovados, 0 falhas**.
- `npm audit --audit-level=moderate`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Build Vite e bundle do servidor: aprovados.
- Verificações de segurança, entrypoints, autenticação e endpoints de pagamento: aprovadas.

Evidência: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42554645443

## Pendente

1. Fotografia real de natureza exclusiva da Elegância Profunda, com origem/licença registrada e aprovação visual. `--ep-scene:none` permanece intencional; não reutilizar imagens de outros estilos.
2. Comparação renderizada, página por página, em desktop e celular.
3. Confirmar o ID exato da voz geral escolhida e homologar voz, frequências, ambiências, Diário, player e animações em dispositivos reais.
4. Executar transação InfinitePay em sandbox e homologar webhook.
5. Publicar o HEAD atual na Vercel.

## Vercel

- O check do HEAD continua retornando `build-rate-limit`.
- Último deployment de produção disponível: `dpl_8twmo4eW3XTgmEwahU3hfZFmqSKT`, associado ao commit anterior `e2f9168e2c0cc415e8aad90f9d4d607f9004ba28`.
- Estado: `ERROR`, `BUILD_FAILED`, mensagem `Resource provisioning failed`.
- Não há deployment registrado para o HEAD de implementação validado nesta rodada.
- Eventos detalhados de build retornaram vazios; não há evidência suficiente para atribuir causa adicional.
- Nenhuma implantação manual, alteração de plano ou mudança financeira foi realizada.

Deployment: https://vercel.com/evertonpiceni-sketch/protocolodecuraintegrativa/8twmo4eW3XTgmEwahU3hfZFmqSKT

## Commits da correção

- CSS: `55e52c8ba3ab0fb8cb86500a4472195abfce42dd`
- Teste de regressão final: `18e2021fdecb94a4e9e083f7aed0339191b163d7`

**Conclusão:** a pré-seleção agora herda a paleta neutra em vez de antecipar tokens do Natural Sereno. A CI do HEAD de implementação passou integralmente. A Elegância Profunda permanece tecnicamente preservada; a homologação visual, a natureza exclusiva, os testes físicos, o sandbox e a publicação continuam pendentes.
