# Auditoria RUN 78 — Estilo 2: Elegância Profunda

Data: 2026-11-07/08  
Branch: `main`  
Commit validado pelo GitHub Actions: `44abfc2ab495fcb6f00ba5bf810173bbb0638ef0`

## Resultado

A reauditoria encontrou uma falha de validação introduzida junto da proteção compartilhada contra sobreposição de Solfeggio e voz neural. A implementação de áudio foi preservada; os testes desatualizados foram corrigidos e a cobertura específica do Estilo 2 foi ampliada.

## Corrigido nesta rodada

- O teste da Essência Luminosa ainda esperava dois usos de `shouldPlayProtocolSessionBackground`, mas o fluxo compartilhado passou a ter três pontos: sincronização global, desbloqueio por gesto e início da prévia neural. A expectativa foi atualizada para três.
- Uma asserção do mesmo teste continha um parêntese excedente no texto esperado; foi corrigida.
- O teste `tests/style2-audio-preview.test.ts` agora verifica também:
  - ativação e encerramento do estado compartilhado de prévia neural;
  - bloqueio de início do oscilador Solfeggio em `audioIntegrityPatch.ts` enquanto a prévia neural está ativa;
  - integração do estado com `App.tsx` e `TransformationHome.tsx`.
- A proteção de runtime já presente na `main` foi revalidada: `neuralVoicePreviewState` é ativado durante prévias/narrações neurais e encerrado ao concluir, interromper, cancelar, salvar, falhar, desmontar ou sair da conta. O patch de áudio impede o início de uma frequência Solfeggio enquanto esse estado está ativo; ambiências não tonais continuam permitidas.
- Não foram criadas novas regras CSS nem alterados preços, cupons, conteúdo terapêutico ou os outros estilos.

## Preservado e reauditoria

### Identidade e seletor
- As 21 folhas CSS específicas do Estilo 2 continuam importadas em `src/main.tsx`.
- A camada visual mantém o escopo `data-layout="elegancia-profunda"`; não foi necessário alterar a identidade aprovada nesta rodada.
- O seletor mantém `selectedLayout = null`, confirmação desabilitada até uma escolha e aplicação de `data-layout` somente após persistência/confirmação.
- O estado de confirmação começa falso e o logout limpa a confirmação e o pedido de troca.
- `OnboardingFlow` permanece ativo; o antigo `WelcomeModal` não foi reativado.
- Logo oficial permanece assinatura discreta/transparente, com a regra específica do Estilo 2 em 30%.
- Paleta verde profundo intencional, dourado nobre, champagne, bronze e marfim preservada.

### Varredura estática das páginas/folhas
- Base visual e assinatura do logo;
- modais e Prática Individual;
- Anamnese;
- oração de São Miguel;
- Contato;
- Banhos de ervas;
- Mapas e Numerologia;
- Diário de Reconexão;
- Diário diário;
- detalhe do dia;
- Ho'oponopono;
- Promoção;
- Configurações e semântica dos controles de áudio;
- Cursos;
- Conquistas;
- Navegação inferior;
- instalação mobile;
- cabeçalho;
- dashboard;
- player.

A lista de importações continua com 21 folhas próprias. A comparação visual real de cada página em desktop e celular não foi executada nesta rodada e permanece pendente.

### Áudio, jornada e pagamentos
- Voz neural sem fallback silencioso para SpeechSynthesis nos três estilos que exigem catálogo neural.
- Solfeggio mantém oscilador de frequência exata e não inicia durante prévia/narração neural.
- A Reintegração continua com sua voz dedicada, jornada de 21 dias, corpo neutro e cadência 4–3–5.
- Diário, player, animações e Wake Lock não foram alterados nesta rodada.
- Checkout InfinitePay, confirmação server-side, validação do valor e unicidade da transação permanecem preservados.

## CI

GitHub Actions [run #42437562784](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42437562784), no commit `44abfc2`:

- `npm audit`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes de regressão: 111 aprovados.
- Build: aprovado.
- Verificações Express, segredos, JWT, autenticação administrativa, smoke tests e endpoints de pagamento: aprovadas.

O status da Vercel continua em falha com `build-rate-limit`. O build do GitHub Actions passou, mas não há publicação de produção homologada.

## Pendências

1. Recuperar o PNG original `1001194194.png` / `file_00000000121c820e931b56bb6b1467e9` para produzir prévia de maior densidade sem interpolação artificial. A versão atual permanece 240 × 180 px.
2. Obter e aprovar fotografia real de natureza exclusiva do Estilo 2; manter `--ep-scene:none` até essa aprovação.
3. Finalizar a comparação visual do player e da silhueta corporal neutra em desktop e celular.
4. Testar voz neural, Solfeggio e ambiências em dispositivos reais.
5. Homologar persistência do Diário ponta a ponta.
6. Realizar transação controlada InfinitePay, conferir webhook e liberação de acesso.
7. Aguardar liberação do limite Vercel e confirmar implantação.

## Commits desta rodada

- `d8f3977` — cobertura específica do estado compartilhado de prévia neural no Estilo 2.
- `2dd2d24` — atualização da contagem de pontos de aplicação da política de áudio.
- `44abfc2` — correção da asserção de regressão.

## Critério de continuidade

Não reabrir paleta, logo, seletor, isolamento CSS, conteúdo, jornada de 21 dias, corpo neutro, checkout ou confirmação server-side sem evidência de regressão. A próxima etapa deve avançar a referência original, fotografia própria, player e homologação real.
