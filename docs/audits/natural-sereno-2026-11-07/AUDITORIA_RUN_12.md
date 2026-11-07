# Auditoria — Estilo 1 Natural Sereno — Run 12 — 07/11/2026

Referência oficial conferida: `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A prancha versionada em `docs/visual-qa/natural-sereno/reference.jpg` corresponde à imagem enviada. A composição e a atmosfera da prancha são referência; as decisões posteriores aprovadas de paleta e logo prevalecem.

## Corrigido

- **Player:** removidas as camadas verde-floresta do bloco responsivo do Estilo 1. A cachoeira permanece como paisagem, agora sob véu creme/marfim; cabeçalho, mantra, controles e progresso seguem café/dourado. A animação de presença e a respiração 4/3/5 foram preservadas.
- **Canvas do player:** Natural Sereno deixou de herdar a paleta genérica antiga `#D4AF37`/verde. Agora usa dourado `#C89D52`, verde-sálvia `#6B7A4B` apenas como acento e transparências creme.
- **Solfeggio/ownership:** a política permite os sete tons do protocolo (396, 417, 528, 639, 741, 852 e 963 Hz) e bloqueia ambiência global enquanto Arcanjo está aberto. A interrupção da trilha ocorre uma vez na entrada, não em cada mutação React.
- **Abertura automática:** possuir a assinatura `arcanjo_7d` não força mais a abertura da tela no login; ela abre por ação explícita ou pela confirmação de compra já existente.
- **Varredura de superfícies secundárias:** estados selecionados de Numerologia, Mapa Astral, Ho'oponopono, instalação e conquistas foram alinhados ao creme/café/dourado/sálvia. O logo do carregamento recebe opacidade de 24%.
- **Prévia do Estilo 2:** restaurado o SVG oficial a partir da cópia válida do audit run 55; o WebP embutido voltou a ter payload completo (384×288). A prancha não foi redesenhada; apenas o arquivo corrompido foi substituído.

## Preservado

- **Seletor:** os quatro estilos continuam em prévia explícita, sem tema aplicado até a confirmação. O modal começa sem seleção; o botão de confirmação depende de uma escolha. O seletor React permanece o único ativo.
- **Prancha e paisagens:** a referência oficial foi mantida; Home e Comunidade preservam fotografia real e regras responsivas desktop/mobile. A cachoeira do player continua presente.
- **Diário e conteúdo:** textos, registros, exportação e lógica do Diário não foram alterados; os overrides continuam limitados a `data-layout="natural-sereno"`.
- **Voz:** o patch neural oficial continua carregado. IDs ElevenLabs válidos salvos no perfil são preservados; valores inválidos continuam normalizados para o ID oficial existente. Nenhum ID novo foi inventado.
- **Pagamento:** InfinitePay e confirmação server-side permanecem intactos; Prática Individual continua em R$ 59,90/7 dias e R$ 99,90/21 dias; PROMO15/PROMO20 preservados; sem chave PIX manual.

## Pendente

1. Confirmar o ID ElevenLabs efetivamente salvo no perfil e ouvir a amostra no navegador. O repositório não comprova qual voz específica foi escolhida.
2. Homologar em navegador real desktop e mobile: recorte das paisagens, nitidez, alinhamento final do player, animação visível e reprodução acústica dos sete tons.
3. Aguardar a última execução do CI. Na execução anterior, TypeScript passou; a suíte apontou a prancha do Estilo 2 com base64 truncado, agora restaurada e com validador ajustado para quebras de linha. A auditoria de dependências ainda reporta vulnerabilidades preexistentes; não foram feitas atualizações de pacotes fora do escopo. Nenhum checkout real foi disparado e nenhuma implantação de produção foi executada.

## Escopo

Correções limitadas ao Estilo 1 e à política de ownership do áudio Arcanjo. Nenhum conteúdo terapêutico aprovado, valor, cupom, fluxo de checkout, regra de acesso ou outro estilo foi redesenhado.
