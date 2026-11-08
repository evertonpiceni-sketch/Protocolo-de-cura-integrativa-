# Auditoria RUN 84 — Estilo 2: Elegância Profunda

Data: 08/11/2026  
Branch: `main`  
HEAD de código validado: `49d92f414837d7259e351eb8a0dfdaebadfc762b`

## Corrigido

### Solfeggio durante a prévia neural

A auditoria encontrou uma diferença entre a proteção do mecanismo de áudio e os controles da interface: o motor já recusava iniciar frequências Solfeggio durante uma prévia neural, mas os botões do Estilo 2 continuavam habilitados. Isso permitia alterar a seleção visual mesmo quando a frequência não poderia tocar.

- Exportada a função compartilhada `isSolfeggioFrequency` em `protocolSessionAudioPolicy.ts`.
- No Estilo 2, os oito botões Solfeggio (396, 417, 432, 528, 639, 741, 852 e 963 Hz) ficam bloqueados enquanto a voz neural está em prévia.
- Ambiências não tonais continuam selecionáveis no Estilo 2.
- A Essência Luminosa mantém seu comportamento anterior; nenhuma regra visual ou funcional do Estilo 3 foi alterada.
- Acrescentados testes para as oito frequências, ambiências e proteção da interface.

A primeira execução revelou uma asserção antiga do teste do Estilo 3 que dependia da expressão JSX anterior. Atualizei somente essa expectativa para o novo guard compartilhado; o comportamento do Estilo 3 permaneceu igual.

## Referência visual oficial

A prancha original informada pelo Everton foi recuperada pelo identificador `file_00000000121c820e931b56bb6b1467e9` e inspecionada:

- Dimensões: 1536 × 1152.
- Nome retornado: `1001194194(5).png`.
- Os bytes são JPEG/JFIF, apesar da extensão `.png` e do MIME reportado.

A prancha confirma a direção visual: natureza integrada, verde profundo, ouro nobre, champagne, bronze, marfim, Playfair Display e Montserrat, botões dourados e composição imersiva.

Elementos antigos da prancha permanecem subordinados às decisões posteriores: a jornada funcional continua com 21 dias (não 12), o corpo continua neutro e o logo no produto continua como assinatura sutil com 30% de opacidade.

O card do seletor continua apontando para `/brand/elegancia-profunda/prancha-oficial.svg`. Essa versão do repositório ainda incorpora um WebP de 240 × 180; a fonte original foi recuperada e confirmada, mas a substituição da derivação de baixa resolução por uma derivação de maior densidade continua pendente.

## Varredura e preservado

- `main.tsx` importa 21 folhas CSS do Estilo 2.
- Foram analisados 549 seletores nessas 21 folhas: nenhum ficou fora do escopo `data-layout="elegancia-profunda"`.
- Os dois commits posteriores à RUN 83 alteraram apenas CSS/teste da Essência Luminosa; os 210 seletores da nova folha do Estilo 3 também permanecem restritos a `data-layout="essencia-luminosa"`.
- Seletor: `selectedLayout` inicia em `null`; o CTA fica desabilitado até a escolha; `onSelect` só é chamado após confirmação. O app aplica `data-layout` somente com confirmação válida na sessão.
- `OnboardingFlow` continua ativo; seletor DOM legado e `WelcomeModal` antigo permanecem inativos.
- Logo do Estilo 2: 30% de opacidade, wrapper transparente e sem moldura/sombra dominante.
- Paleta, jornada de 21 dias, corpo neutro, páginas, player, animações e conteúdo aprovado foram preservados.
- Voz: Elegância Profunda exige ID ElevenLabs válido do perfil e mantém `fallbackToSpeechSynthesis: false`; ID ausente/inválido falha de forma explícita em vez de trocar silenciosamente para voz do navegador.
- Diário: `DailyDiaryModal` recebe `handleSaveDiaryDay` e `handleSaveTreatmentExpectations` pelo App.
- Pagamentos: checkout e confirmação server-side permanecem; o servidor confere estado/valor junto à InfinitePay, rejeita transação reutilizada e concede o acesso uma única vez. Não foi realizada transação real nesta rodada.

## Validação técnica

GitHub Actions #42456568463, no HEAD `49d92f4`:

- npm audit: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes: 127/127 aprovados.
- Build: aprovado.
- Entry points Express, segredos, JWT, proteção administrativa, smoke tests e endpoints de pagamento: aprovados.

O check Vercel no HEAD continua em falha: `Deployment rate limited — retry in 24 hours`. Build do GitHub aprovado não equivale a produção publicada.

## Pendente

1. Substituir a prévia 240 × 180 por derivação fiel de maior densidade da prancha original recuperada.
2. Integrar fotografia real de natureza exclusiva do Estilo 2, após aprovação; `--ep-scene:none` permanece intencional até lá.
3. Comparação visual real de todas as páginas em desktop e celular.
4. Teste físico de voz neural, Solfeggio, ambiências, player e animações.
5. Homologação ponta a ponta do Diário.
6. Transação controlada InfinitePay, webhook e liberação efetiva de acesso.
7. Aguardar liberação do limite Vercel e homologar a produção.

## Critério de continuidade

Não reabrir paleta, logo, seletor, jornada de 21 dias, corpo neutro ou componentes aprovados sem evidência concreta de regressão. Priorizar a prévia em alta densidade, natureza aprovada, QA visual real, testes funcionais e publicação.
