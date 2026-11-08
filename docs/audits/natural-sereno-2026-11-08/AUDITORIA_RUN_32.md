# Reauditoria — Estilo 1: Natural Sereno — RUN 32

**Data:** 08/11/2026  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run32`  
**Base utilizada:** `main` em `8bdb210c65ae2f388350f152ea5506b1e61136c5`  
**Estado:** correções reaplicadas em branch isolada; CI e homologação visual/auditiva aguardando.

## Corrigido

### Identidade visual e seletor
- Reaplicadas as correções do Natural Sereno sobre a base atual, sem copiar arquivos compartilhados antigos por inteiro.
- Modelo legado da Home neutralizado: superfícies creme/marfim, café e dourado; verde-sálvia restrito a acentos; removidos os tokens de saída verde-floresta e amarelo saturado.
- Overrides finais continuam escopados a `:root[data-layout="natural-sereno"]`; não foi introduzido seletor global.
- Home recebe superfície clara e CTA premium com raio de 18 px; a paisagem realista mantém `cover` e posições responsivas distintas.
- No seletor, a prévia e a confirmação do Natural Sereno usam cantos de 18 px. O CTA de confirmação continua neutro antes da escolha; os acabamentos dos outros estilos não foram alterados.
- A prancha oficial versionada continua ligada à prévia: `docs/visual-qa/natural-sereno/reference.jpg`.

### Player, voz e Solfeggio
- Canvas do player recebe a paleta Natural Sereno (dourado/café e sálvia discreta), sem alterar a geometria das seis etapas nem as paletas dos outros estilos.
- Ownership do Arcanjo corrigido: áudio global é interrompido uma vez na entrada, não a cada mutação do React; o bloqueio de `startBG` não chama `stopBG` e não interrompe o oscilador próprio do Solfeggio.
- Abertura do Arcanjo deixou de ocorrer automaticamente apenas porque a conta possui `arcanjo_7d`. O acesso continua autorizado, mas a abertura exige ação explícita; o evento valida o acesso e a compra recém-confirmada ainda pode abrir a prática solicitada.

### InfinitePay
- A rota atual foi atualizada para o endpoint de links com `options.single_payment: true`.
- `INFINITEPAY_API_KEY` é obrigatória e enviada somente no header server-side; sem a chave, o endpoint retorna 503 antes de criar pedido ou chamar o provedor.
- Payload original, NSU e URLs são persistidos antes da chamada; recuperação reutiliza o payload original e permite somente um replay idêntico.
- Trava Redis distribuída com `SET NX PX`, renovação por token e liberação compare-and-delete serializa criação/recuperação entre instâncias.
- Confirmação valida transação e valor exato no servidor antes de liberar plano ou prática individual.
- **Removido do fluxo de checkout** o produto obsoleto `numerology_full` e qualquer liberação `numerologyPurchased` por essa rota. A decisão atual da `main` prevalece: mapa completo depende do benefício confirmado já existente; nenhum preço avulso antigo foi recuperado.

## Preservado

- Decisões recentes da `main` para os Estilos 2 e 3: `jornada_21d`, preços de acesso 7/21 dias, seleção de plano no checkout e CTA neutro antes da escolha. Os dois commits que avançaram a `main` após a base usada nesta branch não alteram os arquivos modificados aqui; serão preservados no merge.
- Estilos 2, 3 e 4 sem redesenho nesta rodada.
- Logo oficial discreto (30% desktop / 26% mobile), Diário e sincronização, voz neural aprovada/IDs válidos, seis etapas, respiração 4–3–5 e `prefers-reduced-motion`.
- Preços e cupons vigentes do catálogo: acessos 7/21 dias e práticas individuais 7/21 dias. VIP7 permanece apenas degustação autorizada.

## Testes adicionados/atualizados

- Regressão do seletor e isolamento da paleta Natural Sereno.
- Regressão de ownership de áudio e abertura manual do Arcanjo.
- Teste do lock Redis entre duas instâncias independentes.
- Teste de checkout sem API Key, header server-side e `single_payment`.

**CI do head desta branch ainda não foi retornado.** Não declarar testes/build aprovados até a execução atual terminar.

## Pendente

1. CI completo no head final: TypeScript, suíte de testes, build, segurança e `npm audit`.
2. Preview navegável e capturas página a página em desktop/mobile. A última tentativa conhecida da Vercel foi bloqueada por limite de deployments; não foi realizada nova tentativa nesta rodada.
3. Escuta real da voz selecionada e da transição narração/Solfeggio/ambiência.
4. Cadastrar a `INFINITEPAY_API_KEY` oficial no ambiente Vercel correto. A última consulta de metadados não a encontrou; enquanto ausente, o checkout fica bloqueado por segurança.
5. Conciliar links legados possivelmente multiuso diretamente na conta InfinitePay. A InfinitePay não oferece sandbox; nenhum link de teste, compra, cobrança ou estorno foi iniciado.
6. Revisar a variável antiga de preview sinalizada como segredo legível, sem consultar ou expor seu valor.

**Sem merge, sem deploy de produção e sem transação financeira nesta rodada.**
