# AUDITORIA_RUN_64 — Estilo 2 · Elegância Profunda

**Data:** 2026-11-07  
**Branch:** `main`  
**Base:** `a74e2ddda9249343af440e79cea9884272983e2c`  
**Referência:** prancha oficial `1001194194.png` / `file_00000000121c820e931b56bb6b1467e9`. Decisões aprovadas posteriores prevalecem; os 12 dias ilustrados na prancha não substituem a jornada funcional aprovada de 21 dias.

## Corrigido

- Removida do bloco `:root[data-layout="elegancia-profunda"]` em `src/approved-theme.css` a referência antiga `/brand/reintegracao-presenca-arte.png`. O Estilo 2 agora declara `--ep-scene:none` também na camada compartilhada, e não apenas no override carregado depois. Isso elimina a herança residual da arte da Reintegração e evita regressão/flash antes do override específico.
- Acrescentado teste para garantir que o bloco do Estilo 2 não volte a apontar para a arte da Reintegração.
- Corrigido o teste de regressão para localizar especificamente o bloco de cena do Estilo 2 (o bloco que declara `--ep-scene`), sem confundi-lo com o bloco anterior de tokens de cor.

## Varredura e preservado

- Seletor dos quatro estilos: seleção inicial vazia; botão de confirmação desabilitado até uma escolha; `App.tsx` mantém o modal enquanto `layoutConfirmedThisSession` for falso. Preferência persistida não aplica tema automaticamente.
- Prévia do Estilo 2 continua apontando para a prancha oficial versionada em `/brand/elegancia-profunda/prancha-oficial.svg`.
- Paleta do Estilo 2 preservada: verde profundo/natural, ouro nobre, champagne, bronze e marfim. Logo oficial continua assinatura discreta, sem fundo/selo ou protagonismo.
- Jornada aprovada de 21 dias, corpo neutro, onboarding ativo `OnboardingFlow` e componente antigo `WelcomeModal` inativo.
- Varredura estática das 21 folhas CSS do Estilo 2 importadas em `src/main.tsx`: os seletores identificados permanecem escopados ao atributo do Estilo 2 ou aos componentes proprietários; nenhuma regra global sem escopo foi encontrada.
- Voz do Estilo 2 continua exigindo ID neural válido salvo no perfil, sem fallback para voz nativa do dispositivo. A Reintegração mantém seu endpoint/voz neural dedicado.
- Solfeggio continua usando o oscilador com frequências exatas e o patch de integridade de áudio; nenhuma trilha MP3 legada foi reintroduzida.
- Diário e Diário de Reconexão, conteúdo e callbacks de gravação preservados.
- Player/canvas, temporização por áudio, respeito a `prefers-reduced-motion`, Wake Lock e Media Session preservados.
- InfinitePay permanece com criação de checkout e confirmação server-side por `payment_check`, conferência do valor e proteção contra reutilização de transação; sem cópia manual de PIX.

## Pendente

- A prancha original tem 1536 × 1152 px, mas o bitmap embutido no SVG de prévia continua em 240 × 180 px. A versão 2x/alta densidade ainda precisa ser incorporada sem ampliar artificialmente o bitmap existente.
- Não há fotografia independente de natureza com aprovação comprovada para o Estilo 2. `--ep-scene:none` permanece deliberadamente; não reutilizar arte da Reintegração nem imagens exclusivas dos outros estilos.
- O canvas do player do Dia 1 já anima a descida da luz e as raízes, mas ainda não reproduz a silhueta neutra da referência. Não foi inventado um modelo corporal genérico.
- A varredura desta rodada foi estática. Faltam capturas reais e comparação visual de todas as páginas em desktop/mobile, além de testes de reprodução da voz escolhida, frequências Solfeggio, persistência do Diário e transação controlada InfinitePay com webhook/liberação de acesso.
- Não houve nova execução de GitHub Actions para os commits desta rodada. O status combinado do commit de código continua mostrando apenas a verificação Vercel como falha `build-rate-limit`; não há implantação nova confirmada.
- `npm audit` não foi executado nesta rodada. A última auditoria anterior do Estilo 2 registrava 9 vulnerabilidades (3 moderadas e 6 altas); revalidar antes da homologação.

## Arquivos alterados

- `src/approved-theme.css`
- `tests/elegancia-profunda-audit.test.ts`
- `docs/audits/elegancia-profunda-2026-11-07/AUDITORIA_RUN_64.md`

**Commits relevantes de código/teste:** `026e6bccd9b54a02d77bb6d84993ebcc482cc353`, `d22401c0a5a18b1b0e4a01d0216b9176188eb148` e `2ba6f3785767f9702996152828353a39ab2f93cb`.

**Status:** corrigida uma herança residual de imagem entre estilos e criada proteção de regressão. Estilo 2 permanece sem homologação visual/funcional integral.
