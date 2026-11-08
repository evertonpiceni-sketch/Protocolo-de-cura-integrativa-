# Reauditoria — Estilo 1: Natural Sereno — RUN 32

**Data:** 08/11/2026  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run32b`  
**Base:** `main` em `b622872f166e5a43b3eebba2b7301da4c69e700e`  
**Estado:** correções reaplicadas diretamente sobre a main atual; CI desta nova base aguardando.

## Corrigido

### Identidade visual e seletor
- Reaplicadas apenas as correções válidas do Natural Sereno sobre a main atual.
- Modelo legado da Home neutralizado: superfícies creme/marfim, café e dourado; verde-sálvia restrito a acentos; removidos tokens de saída verde-floresta e amarelo saturado.
- Overrides finais escopados a `:root[data-layout="natural-sereno"]`. Varredura estrutural das regras CSS: 175 regras, 277 seletores individuais, nenhum seletor fora do escopo Natural Sereno.
- Home recebe superfície clara e CTA premium com raio de 18 px; paisagem realista mantém `cover` e posições responsivas distintas.
- Prévia e confirmação do Natural Sereno usam cantos de 18 px. O CTA de confirmação continua neutro antes da escolha; os outros estilos não recebem essa alteração.
- A prancha oficial versionada permanece ligada à prévia: `docs/visual-qa/natural-sereno/reference.jpg`.

### Player, voz e Solfeggio
- Canvas do player recebe a paleta Natural Sereno (dourado/café e sálvia discreta), sem alterar geometria das seis etapas ou as paletas dos outros estilos.
- Ownership do Arcanjo corrigido: áudio global interrompido uma vez na entrada, não a cada mutação do React; o bloqueio de `startBG` não chama `stopBG` e não interrompe o oscilador próprio do Solfeggio.
- Abertura do Arcanjo não ocorre automaticamente pelo plano `arcanjo_7d` no login. Acesso continua autorizado, mas a abertura exige ação explícita; o evento valida o acesso e a compra recém-confirmada ainda pode abrir a prática solicitada.

### InfinitePay
- Rota atualizada para endpoint de links com `options.single_payment: true`.
- `INFINITEPAY_API_KEY` obrigatória, enviada somente no header server-side; sem a chave, endpoint retorna 503 antes de criar pedido ou chamar o provedor.
- Payload original, NSU e URLs persistidos antes da chamada; recuperação reutiliza o payload original e permite somente um replay idêntico.
- Trava Redis distribuída com `SET NX PX`, renovação por token e liberação compare-and-delete serializa criação/recuperação entre instâncias.
- Confirmação valida transação e valor exato no servidor antes de liberar plano ou prática individual.
- Removido do checkout o produto obsoleto `numerology_full` e qualquer liberação `numerologyPurchased` por essa rota. A decisão atual da main prevalece: mapa completo depende do benefício confirmado já existente; nenhum preço avulso antigo foi recuperado.

## Preservado

- Base atual da main, incluindo as duas atualizações mais recentes de Elegância Profunda/Numerologia e o teste compartilhado de entitlement.
- Decisões recentes dos Estilos 2 e 3: acesso 7/21 dias, preços aprovados, seleção do plano no checkout e correções compartilhadas de modais.
- Estilos 2, 3 e 4 sem redesenho nesta rodada.
- Logo oficial discreto (30% desktop / 26% mobile), Diário e sincronização, voz neural aprovada/IDs válidos, seis etapas, respiração 4–3–5 e `prefers-reduced-motion`.
- Catálogo atual de acessos e práticas individuais; VIP7 permanece apenas degustação autorizada.

## Evidência de CI

Na branch de integração anterior, com os mesmos arquivos e correções, GitHub Actions #1659 concluiu:
- npm audit: 0 vulnerabilidades;
- TypeScript: aprovado;
- testes: 130/130 aprovados;
- build Vite/servidor: aprovado;
- entrypoints Express, segredos, JWT, proteção administrativa, smoke tests e endpoints de pagamento: aprovados.

Esta branch foi reaplicada sobre a main mais recente após essa execução; o CI precisa repetir na nova base antes de qualquer merge.

## Pendente

1. CI completo no head desta branch recém-rebaseada.
2. Preview navegável e capturas reais página a página em desktop/mobile. A última tentativa Vercel foi bloqueada por `api-deployments-free-per-day` (mais de 100 deployments; aguardar janela de 24h).
3. Escuta real da voz selecionada e das transições narração/Solfeggio/ambiência.
4. Cadastrar a `INFINITEPAY_API_KEY` oficial no ambiente Vercel correto. A última consulta de metadados não a encontrou; enquanto ausente, o checkout fica bloqueado por segurança.
5. Conciliar links legados possivelmente multiuso na conta InfinitePay. O provedor não oferece sandbox; nenhum checkout real, compra, cobrança ou estorno foi iniciado.
6. Revisar a variável antiga de preview sinalizada como segredo legível, sem consultar ou expor seu valor.

**Sem merge e sem deploy de produção.**
