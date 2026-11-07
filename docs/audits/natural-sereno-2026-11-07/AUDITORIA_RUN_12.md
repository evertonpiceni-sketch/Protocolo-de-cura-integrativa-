# Auditoria — Estilo 1 Natural Sereno — Run 12 — 07/11/2026

Referência oficial conferida: `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A prancha versionada em `docs/visual-qa/natural-sereno/reference.jpg` corresponde à imagem enviada. A composição e a atmosfera da prancha são referência; as decisões posteriores aprovadas de paleta e logo prevalecem.

## Corrigido

- **Player:** removidas as camadas verde-floresta do bloco responsivo do Estilo 1. A cachoeira permanece como paisagem, agora sob véu creme/marfim; cabeçalho, mantra, controles e progresso seguem café/dourado. A animação de presença e a respiração 4/3/5 foram preservadas.
- **Canvas do player:** Natural Sereno deixou de herdar a paleta genérica antiga `#D4AF37`/verde. Agora usa dourado `#C89D52`, verde-sálvia `#6B7A4B` apenas como acento e transparências creme.
- **Solfeggio/ownership:** a política permite os sete tons do protocolo (396, 417, 528, 639, 741, 852 e 963 Hz) e bloqueia ambiência global enquanto Arcanjo está aberto. A interrupção da trilha ocorre uma vez na entrada, não em cada mutação React.
- **Abertura automática:** possuir a assinatura `arcanjo_7d` não força mais a abertura da tela no login; ela abre por ação explícita ou pela confirmação de compra já existente.
- **Varredura de superfícies secundárias:** estados selecionados de Numerologia, Mapa Astral, Ho'oponopono, instalação e conquistas foram alinhados ao creme/café/dourado/sálvia. O logo do carregamento recebe opacidade de 24%.
- **Prévia do Estilo 2:** o SVG oficial atual do `main` foi validado com payload WebP íntegro em 240×180. Corrigida a asserção contraditória do teste (que exigia simultaneamente 180 e 288 px); a prancha e a composição não foram alteradas.

## Varredura página por página

| Área | Resultado |
|---|---|
| Entrada e seletor | Quatro prévias explícitas; nenhuma aplicação antes da confirmação. |
| Home | Fotografia real e recorte responsivo preservados; superfícies creme/café/dourado. |
| Menu e jornada | Cartões claros; sálvia restrita a ícones e pequenos acentos. |
| Anamnese e Diário | Conteúdo e registros preservados; neutralização de emerald/amber/indigo escopada ao Estilo 1. |
| Comunidade | Paisagem real com véu creme; sem chapas verdes na superfície principal. |
| Player | Camada verde-floresta removida; cachoeira, respiração e animações preservadas com paleta correta. |
| Numerologia, Mapa Astral e abas auxiliares | Estados selecionados alinhados ao dourado/sálvia. |
| Arcanjo/Solfeggio | Abertura explícita e ownership de áudio corrigidos; visual próprio do protocolo preservado. |
| Checkout e prática individual | InfinitePay e confirmação server-side preservados; sem PIX manual. |

## Preservado

- **Seletor:** os quatro estilos continuam em prévia explícita, sem tema aplicado até a confirmação. O modal começa sem seleção; o botão de confirmação depende de uma escolha. O seletor React permanece o único ativo.
- **Prancha e paisagens:** a referência oficial foi mantida; Home e Comunidade preservam fotografia real e regras responsivas desktop/mobile. A cachoeira do player continua presente.
- **Diário e conteúdo:** textos, registros, exportação e lógica do Diário não foram alterados; os overrides continuam limitados a `data-layout="natural-sereno"`.
- **Voz:** o patch neural oficial continua carregado. IDs ElevenLabs válidos salvos no perfil são preservados; valores inválidos continuam normalizados para o ID oficial existente. Nenhum ID novo foi inventado.
- **Pagamento:** InfinitePay e confirmação server-side permanecem intactos; Prática Individual continua em R$ 59,90/7 dias e R$ 99,90/21 dias; PROMO15/PROMO20 permanecem nos descontos de prática; VIP7 continua exclusivo da degustação PRO de 7 dias, validado no servidor e recusado para prática individual; sem chave PIX manual.

## Pendente

1. Confirmar o ID ElevenLabs efetivamente salvo no perfil e ouvir a amostra no navegador. O repositório não comprova qual voz específica foi escolhida.
2. Homologar em navegador real desktop e mobile: recorte das paisagens, nitidez, alinhamento final do player, animação visível e reprodução acústica dos sete tons.
3. Aguardar a última execução do CI após a correção da asserção de dimensões da prancha do Estilo 2. A auditoria de dependências reportou vulnerabilidades preexistentes; não foram feitas atualizações de pacotes fora do escopo.
4. Homologação visual ainda depende de preview navegável. O Vercel retornou `Resource provisioning failed` antes da fase de build em uma tentativa de preview; não foi executado deploy de produção.

## Escopo

Correções limitadas ao Estilo 1 e à política de ownership do áudio Arcanjo. Nenhum conteúdo terapêutico aprovado, valor, cupom, fluxo de checkout, regra de acesso ou outro estilo foi redesenhado.
