# Auditoria RUN 73 — Estilo 2: Elegância Profunda

Data: 2026-11-07
Branch: `main`
HEAD auditado: `4fb1223cf41bf266d5d09335c0500b2cf6f61199`

## Corrigido

- O teste de regressão da voz neural dependia de uma frase literal dentro de um comentário de `api/index.ts`. O comentário estava quebrado em duas linhas e a asserção falhava mesmo com a rota sem fallback nativo.
- A asserção foi substituída por verificações de comportamento e roteamento:
  - a rota legada usa o ID neural dedicado;
  - a rota ativa `api/reintegration-tts.ts` fixa a voz `21m00Tcm4TlvDq8ikWAM`;
  - respostas de indisponibilidade mantêm `fallbackToSpeechSynthesis: false`;
  - o endpoint não contém chamada a `speechSynthesis`;
  - `vercel.json` direciona `/reintegration-tts` para `/api/reintegration-tts`.
- Nenhuma mudança de CSS ou conteúdo terapêutico foi feita nesta rodada: não apareceu nova regressão visual comprovada que justificasse reabrir os componentes congelados.

## Reauditoria estrutural e página por página

- O seletor mantém os quatro estilos oficiais e começa sem seleção (`selectedLayout = null`); a confirmação permanece desabilitada até escolha explícita.
- `App.tsx` mantém a confirmação de layout falsa no início da sessão e remove `data-layout` enquanto não há confirmação. O logout limpa a confirmação para a próxima conta.
- `OnboardingFlow` permanece ativo; o `WelcomeModal` legado não foi reativado.
- O `LayoutChoiceModal` continua apontando a prévia do Estilo 2 para `/brand/elegancia-profunda/prancha-oficial.svg`.
- Foram reconfirmados 21 imports CSS específicos do Estilo 2 em `src/main.tsx). A lista de telas e a inspeção completa das 21 folhas permanecem registradas na RUN 72; não foi identificada nesta rodada uma regressão que justificasse nova sobrescrita visual.
- O arquivo de prévia incorporado continua com bitmap WebP real de 240 × 180 px. A imagem-fonte indicada pelo usuário (1536 × 1152 px) não ficou disponível na busca de arquivos desta execução; por isso não foi reencodada nem artificialmente ampliada.

## Áudio, Diário e pagamento

- Voz geral do Estilo 2 continua neural e sem fallback silencioso para voz nativa quando o estilo exige ElevenLabs.
- A Reintegração continua usando a voz dedicada `21m00Tcm4TlvDq8ikWAM`, sem fallback para SpeechSynthesis.
- Solfeggio mantém o oscilador de frequência exata.
- O Diário mantém o callback de salvamento ligado a `handleSaveDiaryDay`.
- InfinitePay mantém checkout externo e confirmação server-side, conferência do valor e unicidade da transação; não foi feita transação real nesta rodada.

## Validação CI do HEAD

Execução: [GitHub Actions #42415015508](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42415015508)

Aprovados:
- TypeScript;
- testes de regressão;
- build;
- entrypoints Express;
- verificação de padrões de segredo;
- configuração JWT fail-closed;
- proteção de criação de administrador;
- autenticação administrativa;
- smoke test de saúde e cadastro;
- endpoints de pagamento fail-closed.

O job geral permanece reprovado somente na etapa de enforcement do `npm audit`. O relatório da execução identificou **9 vulnerabilidades: 3 moderadas e 6 altas**, envolvendo `body-parser`, `ip-address`, `qs`, `vite` e `zod` em dependências diretas/transitivas. Não foi executado `npm audit fix` nem alterado o lockfile nesta rodada, para evitar atualização ampla sem validação isolada.

O status Vercel do HEAD continua em falha por `build-rate-limit`; não há publicação confirmada.

## Preservado

- Identidade Elegância Profunda: verde profundo intencional, dourado nobre, champagne, bronze e marfim.
- Logo oficial discreto/transparente como assinatura; testes de splash, cadastro, Contato e Cursos aprovados.
- Escolha explícita dos quatro estilos antes da aplicação.
- Jornada posterior aprovada de 21 dias e arte/corpo neutro da Reintegração.
- Player, animação de luz/raízes e Wake Lock já corrigidos.
- Voz neural, Solfeggio, Diário e InfinitePay.
- Conteúdos, preços, cupons e identidades dos Estilos 1, 3 e 4.

## Pendente

1. Incorporar uma fotografia de natureza própria aprovada para o Estilo 2; `--ep-scene:none` permanece intencional até existir esse ativo.
2. Concluir a composição visual do player com a silhueta neutra aprovada, comparando-a à prancha, sem introduzir corpo genérico ou elementos rejeitados.
3. Obter a imagem-fonte da prancha nesta execução para derivar e validar uma prévia de maior densidade; não ampliar artificialmente o bitmap atual.
4. Homologar visualmente todas as páginas em desktop e celular.
5. Testar em dispositivos reais a voz geral, a voz dedicada da Reintegração, Solfeggio, animações, persistência ponta a ponta do Diário e uma transação InfinitePay com webhook/liberação.
6. Atualizar as dependências vulneráveis em tarefa isolada e repetir CI.
7. Aguardar liberação do limite de implantação Vercel e confirmar publicação.

## Commit desta rodada

- `4fb1223cf41bf266d5d09335c0500b2cf6f61199` — teste da voz neural passa a validar o endpoint e o roteamento, não a redação exata de um comentário.

## Critério de continuidade

Não reabrir as correções de assinatura do logo, seletor explícito, isolamento visual, Wake Lock, voz neural, Solfeggio, Diário ou confirmação server-side sem evidência de regressão. Próxima prioridade visual: ativo de natureza aprovado e composição do player. Próxima prioridade técnica: dependências vulneráveis e homologação real.
