# Auditoria — Estilo 1 Natural Sereno | RUN 38

**Data:** 2026-11-08  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-run33`  
**Head sincronizado:** `a54d0bc6a1dc9ff231d0c8d6893862790e9ca30c`  
**Base main:** `d058e1155e1aaf31bb4ac41a788f220bad585b70`

## Corrigido

- Corrigida a última herança de CTA amarelo/pílula nas telas de entrada: botões `.ns-gold` e confirmação de cadastro/login usam dourado refinado, café e cantos de 18 px, restritos ao Natural Sereno.
- Normalizadas as assinaturas do logo nas telas de acolhimento, cadastro e onboarding: imagem oficial a 30% de opacidade, sem moldura, disco ou sombra dominante.
- Reduzida a presença decorativa de folhagem nos cartões de entrada e telas internas, mantendo a fotografia natural sem chapas verdes.
- Aquecido o overlay da fotografia de cadastro: removido o viés verde-floresta, preservando a paisagem original.
- Corrigidos quatro testes de regressão que ainda esperavam expressões antigas de voz/canvas e não reconheciam as condições já implementadas para Natural Sereno. Não foi alterada a lógica de voz dos outros estilos.
- Sincronizada a branch com a main atual. A única alteração da main desde a base anterior era o relatório da Essência Luminosa; o blob desse relatório já era idêntico na branch. O merge preservou o conteúdo e eliminou a divergência histórica.

## Preservado

- Card oficial versionado em `docs/visual-qa/natural-sereno/reference.jpg`, utilizado pela prévia do seletor. Não foi substituído por imagem de outro estilo.
- Seletor explícito dos quatro estilos, sem aplicação automática antes da escolha e confirmação.
- Sete telas principais verificadas estaticamente: Home, acolhimento, menu, comunidade, perfil, biblioteca e ferramentas.
- Superfícies funcionais verificadas: Ajustes, Diário, Anamnese, Cursos, Mapa Astral, Numerologia, Planos, Prática Específica, Banhos, Ho'oponopono, Instalação, Conquistas, Administração, Progresso, Player e Arcanjo.
- Ativos fotográficos existentes em `public/brand/natural-sereno/`: vale-amanhecer, cachoeira, acolhimento, presença e folhagem.
- Paleta creme/marfim, café/marrom e dourado refinado; verde-sálvia apenas em acentos.
- Paisagens e regras responsivas de enquadramento desktop/mobile.
- Diário e persistência, voz neural sem fallback robótico, política Solfeggio, ownership do áudio do Arcanjo, player, seis etapas, animações e respiração 4–3–5.
- InfinitePay, catálogo atual, locks de concorrência, deduplicação, confirmação server-side e bloqueio seguro quando falta configuração.
- Estilos 2, 3 e 4 e suas decisões posteriores.

## Varredura estática

- `natural-sereno-approved-overrides.css`: 162 grupos de regras; nenhum seletor global encontrado.
- As regras de correção permanecem sob `:root[data-layout="natural-sereno"]` ou sob o shell explícito `#profile-setup-view.ep-auth-style-one`.
- A camada final de overrides é importada depois da folha legada `natural-sereno.css`, neutralizando os conflitos identificados sem apagar a lógica dos componentes antigos.

A varredura é estática; ela não substitui a inspeção de cada tela renderizada em navegador.

## Validação técnica

**GitHub Actions #1737 — sucesso:**  
https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42467223108

- npm audit: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **149/149 aprovados**.
- Build: aprovado.
- Entry points Vercel/Express: aprovados.
- Verificações de segredos e JWT: aprovadas.
- Proteção administrativa: aprovada.
- Smoke test de saúde/cadastro: aprovado.
- Endpoints de pagamento fail-closed: aprovados.

## Pendente

1. **Homologação visual em navegador:** o check Vercel continua falhando por `build-rate-limit`; ainda faltam capturas reais página por página em desktop e mobile.
2. **Áudio real:** falta escutar a voz neural escolhida e as transições entre narração, Solfeggio e ambiência no navegador.
3. **InfinitePay:** a última consulta de metadados não encontrou `INFINITEPAY_API_KEY` em produção/preview. O checkout permanece fail-closed; sandbox e retorno/webhook reais seguem sem homologação.
4. **Conciliação externa:** conferir links antigos potencialmente multiuso na conta InfinitePay.
5. **Segurança Vercel:** revisar a variável antiga de preview sinalizada como `readable-secret` (`UPSTASH_DB_KEY`) sem expor seu valor.

## Estado de entrega

- PR #67 permanece aberta e não mesclada.
- Branch sincronizada: **0 commits atrás da main**.
- O CI passou; o estado de merge continua `unstable` somente pelo check externo Vercel com limite diário de deployments.
- Nenhuma publicação em produção, cobrança ou estorno foi realizada.
