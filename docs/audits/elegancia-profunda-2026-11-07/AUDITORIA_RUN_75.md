# Auditoria RUN 75 — Estilo 2: Elegância Profunda

Data: 2026-11-07  
Branch: `main`  
HEAD auditado antes deste registro: `1c3a9234785dbf66e5e3092349530e69f3848294`

## Resultado da rodada

**Não foi identificada nova regressão de código específica do Estilo 2 que justifique uma sobrescrita ou alteração de componente.** A revisão confirmou as proteções existentes. Para evitar retrabalho e preservar o aprovado, nenhum arquivo-fonte do Estilo 2 foi modificado nesta rodada; este documento registra a reauditoria e os bloqueios atuais do repositório.

## Corrigido / confirmado nesta reauditoria

- Recontados os imports de `src/main.tsx`: **21 folhas CSS do Estilo 2**.
- Inspecionadas as 21 folhas individualmente. Todas as regras CSS encontradas estão ancoradas em `data-layout="elegancia-profunda"`; não foi detectada regra global sem isolamento.
- O seletor React continua sendo a entrada única. `LayoutChoiceModal` começa com `selectedLayout = null`, e o botão de confirmação permanece desabilitado até uma escolha.
- `App.tsx` mantém `layoutConfirmedThisSession = false` no início e remove `document.documentElement.dataset.layout` enquanto não existe confirmação. A aplicação do tema só ocorre depois da persistência bem-sucedida.
- O logout limpa `layoutConfirmedThisSession` e `layoutChoiceRequested`, exigindo nova escolha na próxima conta.
- O `OnboardingFlow` permanece ativo; o `WelcomeModal` legado e os antigos patches DOM não foram reativados.
- A assinatura do logo do Estilo 2 permanece em 30% no hero/acolhimento, com wrapper transparente e sem moldura, fundo ou sombra dominante. A regra específica continua carregada depois do tema compartilhado.
- A prancha do card continua apontando para `/brand/elegancia-profunda/prancha-oficial.svg`. O arquivo versionado contém WebP incorporado de 240 × 180 px. O PNG-fonte de 1536 × 1152 px, identificado como `1001194194.png` / `file_00000000121c820e931b56bb6b1467e9`, não foi localizado nesta busca da Biblioteca; não foi substituído por outra imagem nem ampliado artificialmente.
- `--ep-scene:none` continua intencional. Não existe fotografia de natureza própria aprovada para este estilo no conjunto de ativos verificado; não se reutilizaram cenas da Reintegração ou do Natural Sereno.

## Reauditoria funcional

- **Voz:** a seleção geral exige ID ElevenLabs válido e não aceita nomes/URIs de SpeechSynthesis nem os IDs de fallback rejeitados. A rota dedicada da Reintegração continua fixada em `21m00Tcm4TlvDq8ikWAM`, com `fallbackToSpeechSynthesis: false`. O ID nominal da voz geral escolhido pelo usuário não foi recuperado nesta execução; não foi inventado.
- **Solfeggio:** `audioIntegrityPatch` mantém o oscilador com a frequência nominal exata e interrompe o oscilador quando o áudio tonal é desligado.
- **Diário:** `DailyDiaryModal` encaminha a entrada ao callback de salvamento; `JournalLog` lê, pesquisa e exporta os registros. A persistência ponta a ponta em sessão real continua sem homologação.
- **Player/animações:** Wake Lock é solicitado somente durante a fase de reprodução e liberado no cleanup; a implementação também libera o lock se a solicitação assíncrona terminar depois do descarte do efeito. A cadência 4–3–5 e a sincronização visual com o áudio permanecem protegidas por testes.
- **Pagamento:** as rotas de checkout, confirmação autenticada e webhook continuam ativas. A confirmação consulta o provedor, compara o valor pago com o valor do pedido e impede reutilização de uma transação. Nenhuma transação real foi realizada nesta rodada.
- **Jornada:** permanecem os 21 dias e o corpo neutro aprovados.

## CI, segurança e publicação

Execução mais recente observada para o HEAD auditado: [GitHub Actions #42422218792](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42422218792).

- TypeScript: passou.
- Testes: **107 passaram; 1 falhou**.
- A única falha de regressão identificada no log é de `tests/essencia-luminosa.test.ts`, no teste do logo da **Essência Luminosa (Estilo 3)**: a asserção procura `opacity: .26 !important;` dentro de uma janela textual de 1.100 caracteres. Não é uma falha do Estilo 2 e não foi alterada nesta tarefa para não modificar outro estilo aprovado.
- Build e etapas posteriores foram pulados após a falha de testes.
- `npm audit` continua encontrando **9 vulnerabilidades (3 moderadas e 6 altas)**: `body-parser <1.20.9`, `ip-address <=10.7.3`, `qs 6.7.0–6.16.0`, `vite <=6.4.3` e `zod <4.6.6`, incluindo dependências transitivas. O relatório do CI indica correção disponível por atualização de dependências; o lockfile não foi editado manualmente.
- O status Vercel do commit continua em falha por `build-rate-limit`; não há implantação homologada.

## Preservado

- Identidade Elegância Profunda: verde profundo intencional, dourado nobre, champagne, bronze e marfim.
- Logo oficial como assinatura sutil/transparente.
- Escolha explícita dos quatro estilos antes da aplicação.
- Isolamento das 21 folhas CSS do Estilo 2.
- Onboarding ativo, jornada de 21 dias e corpo neutro.
- Voz neural sem fallback robótico, Solfeggio exato, Diário, player e fluxo server-side da InfinitePay.
- Conteúdo, preços, cupons e identidades dos Estilos 1, 3 e 4.

## Pendente

1. Recuperar a imagem-fonte original da prancha para derivar uma prévia de maior densidade, sem interpolação artificial.
2. Obter e aprovar uma fotografia real de natureza exclusiva para o Estilo 2; manter `--ep-scene:none` até isso acontecer.
3. Finalizar e homologar visualmente a composição do player com a silhueta neutra aprovada em desktop e celular.
4. Testar voz geral, voz dedicada, Solfeggio, animações e persistência do Diário em dispositivos/sessões reais.
5. Realizar transação controlada InfinitePay e conferir webhook e liberação de acesso.
6. Corrigir a falha de teste do Estilo 3 em tarefa própria, sem alterar sua identidade nesta auditoria.
7. Atualizar dependências e lockfile por instalação controlada, repetir testes/build e zerar o `npm audit`.
8. Aguardar a liberação do limite de implantação e confirmar publicação.

## Critério de continuidade

Não reabrir seletor, logout, assinatura do logo, isolamento CSS, jornada, corpo neutro, voz dedicada, Solfeggio, Diário, Wake Lock ou confirmação server-side sem evidência de regressão. A próxima alteração visual do Estilo 2 deve depender do ativo de natureza aprovado e da referência original da prancha; a próxima alteração técnica deve tratar dependências e homologação sem misturar correções de outros estilos.
