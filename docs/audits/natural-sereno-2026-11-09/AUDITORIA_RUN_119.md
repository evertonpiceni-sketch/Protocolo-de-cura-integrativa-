# Auditoria RUN 119 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**HEAD de código/testes validado:** `c1cf2be28ec32062cebff8bfb3ab0a11c1b6653f`

## Corrigido

### Acolhimento mobile

A rota ativa foi confirmada: `TransformationHome` renderiza `NaturalSerenoHome` no Natural Sereno, e a tela inicial desse componente é `.ns-app.ns-welcome`.

A auditoria da cascata encontrou uma diferença concreta:
- Desktop já usava a fotografia `acolhimento.webp` sobre uma base clara.
- Mobile ainda herdava a cachoeira escura e o véu café pesado da regra-base, deixando a página predominantemente escura/verde.

Correção mínima adicionada ao final de `natural-sereno-approved-overrides.css`, sob `data-layout="natural-sereno"` e breakpoint até 899px:
- Base da página em creme `#FAF7F2`.
- Mesma fotografia realista de acolhimento do desktop, com véu creme translúcido.
- Títulos em café `#2A2421` e textos secundários em `#6B625B`.
- Controle circular de áudio em marfim/dourado, sem alterar sua função.
- CTA principal permanece dourado refinado, com raio premium de 18px.
- Logo mantém as regras aprovadas de assinatura discreta.

Foi criado `tests/natural-sereno-welcome-surface.test.ts` para proteger a rota ativa, a imagem de acolhimento, a superfície clara e a ausência do fundo/overlay escuro legado no mobile.

### Reauditoria após a intervenção

A primeira execução (#2133) identificou somente uma asserção duplicada e incorreta no teste novo: ela procurava uma regra isolada para `.ns-welcome-brand`, embora a opacidade já seja garantida pela regra agrupada aprovada e pelo teste existente `natural-sereno-logo-audit.test.ts`. A asserção redundante foi retirada; nenhuma regra de logo foi alterada.

A execução final **Security Audit #2135 / run 42612606952**, no HEAD de código/testes acima, concluiu com sucesso:
- **240/240 testes aprovados**, 0 falhas.
- `npm audit`: 0 vulnerabilidades.
- TypeScript aprovado.
- Build aprovado; 2.251 módulos transformados.
- Entry points Vercel/Express, JWT, segredos, autenticação administrativa, smoke tests e verificações fail-closed de pagamento aprovados.

## Varredura e preservado

- Revisadas as 12 folhas CSS específicas do Natural Sereno e a ordem de importação: `natural-sereno-approved-overrides.css` continua como última camada do Estilo 1.
- Home ativa: paisagem do vale, base creme/marfim, café e dourado; CTA/menu/fechamento não recebem chapas verdes.
- Acolhimento: corrigida a diferença mobile/desktop descrita acima.
- Seletor: `LayoutChoiceModal` React continua sendo o único seletor ativo; quatro estilos, seleção inicial nula e confirmação explícita. `data-layout` só é aplicado depois da confirmação e da persistência bem-sucedida.
- Player: imagem única `cachoeira.webp`, corpo neutro `NeutralBodyLightProgress`, seis etapas, animação de luz e respiração 4–3–5; sem `SacredEnergyCanvas` no ramo Natural Sereno.
- Logo: assinatura oficial transparente, 30% desktop e 26% mobile, coberta pelo teste de logo existente.
- Voz: Marianne — Meditação / ID oficial ou ID neural válido salvo; sem fallback silencioso para SpeechSynthesis nos fluxos Natural Sereno.
- Solfeggio: frequências tonais bloqueadas durante prévia neural; início/retomada vinculados ao evento real de reprodução da narração.
- Diário e perfil: fila de sincronização por conta, snapshots e cancelamento após troca de sessão preservados.
- Componentes antigos: o seletor DOM legado e os patches DOM de escolha não são importados; o fluxo ativo é React. `NaturalSerenoHome` é componente ativo, não foi confundido com o antigo `WelcomeModal`.
- InfinitePay: catálogo, preços, cupons, benefícios e validação server-side preservados. Checkout público real permanece bloqueado fora de produção até existir sandbox. Nenhuma cobrança foi feita.
- Elegância Profunda, Essência Luminosa, Místico Moderno e Reintegração da Vida não receberam redesenho nem alteração comercial.

A prancha versionada `docs/visual-qa/natural-sereno/reference.jpg` foi recuperada e inspecionada visualmente no repositório; o seletor a utiliza como referência subordinada às decisões posteriores. O arquivo original `1001196520.png` / ID do anexo não foi recuperado como arquivo independente nesta rodada, então não afirmo equivalência binária. Nenhuma arte semelhante foi promovida como substituta.

## Pendências reais

1. **Preview Vercel:** check do HEAD continua em `failure / build-rate-limit`. Não existe preview READY para este commit; não foi forçada nova implantação.
2. **Homologação visual renderizada:** faltam capturas reais página a página em desktop e mobile. A correção do acolhimento foi validada por código/teste, não por navegador visual.
3. **Áudio real:** falta escutar Marianne e testar narração, pausa/retomada, Solfeggio e ambiência em dispositivo.
4. **InfinitePay:** sandbox, checkout de teste, confirmação e webhook continuam pendentes; nenhuma transação real foi iniciada.
5. **Reconciliação com main:** a comparação indica 76 commits da branch além da base comum e 7 commits posteriores na main. Esses sete incluem alterações aprovadas da Elegância Profunda/Essência Luminosa em `App.tsx`, CSS e testes; devem ser preservados na reconciliação. Não fazer merge automático.
6. **Revisão independente:** não há threads inline abertas; não há parecer independente novo disponível nesta rodada.

## Estado da entrega

- PR #79 aberta, em rascunho e mergeable.
- Código/testes validados no commit `c1cf2be`.
- Nenhum merge, deploy de produção ou cobrança real.
- A homologação visual/auditiva/financeira permanece pendente.

**Conclusão:** foi corrigida uma regressão real do acolhimento mobile que mantinha a página escura/verde apesar da base clara aprovada. A correção foi protegida por teste e a CI final passou integralmente. Os elementos aprovados permanecem congelados.
