# Auditoria RUN 71 — Estilo 2: Elegância Profunda

Data: 2026-11-07  
Branch: `main`  
Base desta rodada: `a2e29bf47cd0ff6c7e2ba80f4b9310896d70be5c`  
HEAD após as correções: `62ae598dbf73eb0ac361a96fb9f8bb272be64c83`

## Corrigido

- **Player / Wake Lock:** o bloqueio de tela em `MeditationSession` agora só é solicitado quando `sessionPhase === 'playing'` e `isPlaying === true`. É liberado ao pausar, sair da reprodução, concluir a sessão ou desmontar o componente. A limpeza do áudio foi separada para ocorrer apenas no unmount, evitando que uma pausa/retomada encerre indevidamente a narração.
- **Home / atalhos de cuidado:** os títulos dos quatro cartões internos de atalho herdavam texto café escuro sobre superfície verde profunda. Um override estritamente escopado a `data-layout="elegancia-profunda"` agora usa `--ep-panel-text` (marfim).
- **Regressão:** adicionados testes para o ciclo de vida do Wake Lock e para o contraste dos títulos dos atalhos.

## Preservado e reauditado

- O seletor React continua apontando para `/brand/elegancia-profunda/prancha-oficial.svg`; seleção inicial nula e botão de confirmação desabilitado até escolha explícita.
- `App.tsx` mantém a confirmação da sessão como condição para aplicar `data-layout`; preferência persistida não equivale a consentimento para aplicar automaticamente.
- Foram identificadas **21 folhas CSS ativas** do Estilo 2. Varredura estática de todas as 21: **0 seletores fora do escopo** `data-layout="elegancia-profunda"`.
- `OnboardingFlow` permanece ativo; `WelcomeModal` não é importado nem reativado.
- Logo oficial continua como assinatura discreta: imagem com opacidade baixa e wrapper transparente, sem fundo, selo ou sombra dominantes.
- Jornada posterior aprovada de 21 dias e corpo neutro preservados.
- Voz do Estilo 2 continua exigindo ID ElevenLabs válido e não permite fallback silencioso para SpeechSynthesis. Os caminhos de Home, Anamnese, player, Ho'oponopono, perguntas sistêmicas, oração e protocolo de Arcanjo mantêm essa guarda.
- Solfeggio continua usando o oscilador de frequência exata; a política do player impede manter frequências tonais durante a narração do protocolo.
- Diário permanece conectado ao callback de salvamento da aplicação.
- InfinitePay permanece no checkout externo e na confirmação server-side com conferência do valor pago; não foi reintroduzido PIX manual nem liberação local de acesso.
- Conteúdo, preços, cupons, scripts, etapas da animação e identidade dos outros estilos não foram alterados.

## Pendente

- **Natureza integrada:** `--ep-scene:none` permanece intencional até existir uma fotografia própria do Estilo 2 com aprovação comprovada. Não foi reutilizada imagem de outro estilo nem improvisada uma fotografia.
- **Voz:** a estrutura exige ID ElevenLabs válido, mas não há nome/ID nominal da voz escolhida confirmado nos registros recuperados nesta rodada. Não foi inventado nem substituído.
- **Homologação visual:** faltam capturas e comparação real de todas as páginas em desktop e celular; sem implantação válida não é possível atestar fidelidade visual final.
- **Testes funcionais:** reprodução real da voz, frequências em dispositivos, persistência ponta a ponta do Diário e transação controlada InfinitePay continuam pendentes.
- **Segurança:** não foi executado novo `npm audit`; o último relatório anterior registrava vulnerabilidades e precisa ser atualizado.
- **Build/publicação:** o status combinado do HEAD desta rodada retorna falha apenas no contexto Vercel com `build-rate-limit`. Não há workflow run associado ao commit consultável por esta integração. Os novos testes foram adicionados, mas sua execução não foi confirmada; build e publicação não são declarados aprovados.

## Commits desta rodada

- `30232e937a847beb774bb5b4ecdd29324ef7c11a` — ciclo de vida do Wake Lock.
- `99d15e8adc8499abb1ffae27c4bc51645207af55` — contraste marfim dos atalhos da Home.
- `62ae598dbf73eb0ac361a96fb9f8bb272be64c83` — testes de regressão.

## Critério de continuidade

Não reabrir as correções de Wake Lock, contraste dos atalhos, seletor, logo, confirmação explícita, jornada de 21 dias ou política de voz sem evidência de regressão. Próxima prioridade: obter a fotografia de natureza própria aprovada, concluir comparação visual do player e executar homologação funcional quando a publicação estiver disponível.
