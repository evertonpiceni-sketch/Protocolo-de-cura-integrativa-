# Reauditoria — Estilo 1: Natural Sereno — RUN 24
**Data:** 07/11/2026  
**Base atual:** `main`  
**Branch de correção:** `fix/natural-sereno-mainline-2026-11-07c`

## Corrigido nesta rodada
- A execução foi baseada no `main` mais recente (commit 613aefd), após conferir que os quatro commits novos da base não alteravam os arquivos desta correção. O PR #55 continua separado e não mesclável; nenhuma história antiga foi mesclada.
- A camada `natural-sereno-approved-overrides.css` permanece no último ponto da cascata de tema em `main.tsx`; removido um import duplicado intermediário para evitar carregamento redundante. As regras permanecem estritamente sob `data-layout="natural-sereno"`.
- Home: neutralizadas as últimas superfícies oliva/amarelo herdadas do modelo antigo, mantendo a fotografia realista, o conteúdo marfim/café, o CTA dourado refinado e o recorte responsivo desktop/mobile.
- Seletor: o botão de confirmação recebe cantos de 18 px somente quando Natural Sereno está selecionado. Cadastro/login continuam neutros antes da escolha explícita; nenhuma regra de tema é aplicada antecipadamente.
- Numerologia: InfinitePay aceita `numerology_full`, fixa o preço em R$ 90,00 no servidor, ignora preço enviado pelo cliente e só libera o mapa após confirmação do valor exato.
- Proteção contra cobrança duplicada: checkout pendente da Numerologia reutiliza o mesmo link e pedido; uma segunda tentativa simultânea recebe conflito enquanto o primeiro link é criado. A proteção usa lock Redis quando a persistência está configurada e lock local nos testes/desenvolvimento. O link pendente fica registrado para reutilização até a confirmação do pagamento.
- Testes ampliados para cobrir concorrência e repetição do checkout sem criar uma segunda ordem.

## Preservado
- Escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno, sem opção pré-selecionada e sem aplicar tema antes da confirmação.
- Prancha oficial do Natural Sereno vinculada à prévia do seletor; decisões posteriores aprovadas prevalecem sobre detalhes antigos da prancha.
- Paleta creme/marfim, café/marrom e dourado refinado; verde-sálvia apenas como acento natural.
- Fotografia realista, enquadramento responsivo, tipografia e assinatura oficial discreta (opacidade aprovada de 30%, menor no mobile).
- Diário, player, seis etapas animadas e respeito a `prefers-reduced-motion`.
- Solfeggio não reinicia como trilha simultânea à fala do protocolo; ambiência não tonal permanece permitida.
- Voz neural e IDs ElevenLabs válidos salvos no perfil permanecem preservados; nenhum identificador pessoal de voz foi presumido ou substituído. A voz efetivamente escolhida ainda exige escuta real no navegador.
- Assinaturas e Prática Específica permanecem com preços calculados no servidor e confirmação InfinitePay.

## Pendente
- CI desta branch, incluindo TypeScript, testes, build e gate `npm audit`.
- O último run observado (1501, commit anterior) concluiu TypeScript, regressões, build, entrypoints, verificações de segredo/JWT/autenticação, smoke tests e endpoints; o gate final permaneceu bloqueado por 9 vulnerabilidades (3 moderadas e 6 altas).
- Homologação renderizada de todas as páginas em desktop e mobile. A Vercel recusou a prévia por limite diário de deployments (`api-deployments-free-per-day`); não há captura atual da branch.
- Reprodução real da voz e da ambiência no navegador.
- Checkout ponta a ponta em ambiente de teste da InfinitePay, sem cobrança real.
- A voz exata escolhida pelo usuário não pode ser deduzida do repositório; manter o ID ElevenLabs válido salvo no perfil, sem substituição presumida.

**Status:** correções reaplicadas sobre o `main` atual e protegidas por testes. O Estilo 1 ainda não está homologado integralmente até CI, validação visual/auditiva e checkout de teste.
