# Auditoria RUN 74 — Estilo 2: Elegância Profunda

Data: 2026-11-07  
Branch: `main`  
Base auditada: `b56a795f34a2f0f938ed42e5ccc0fd8d710e1f2a`

## Corrigido

- Foi identificada uma disputa real de especificidade no logo do acolhimento/Home. A camada compartilhada `approved-theme.css` elevava a imagem dentro de `.ep-home-hero` e `.ep-welcome-audio` para 72% de opacidade; a regra geral de 30% do Estilo 2 tinha menor especificidade e não vencia a cascata.
- Adicionada regra exclusiva de Elegância Profunda, com especificidade equivalente à regra compartilhada e carregamento posterior, mantendo o logo em **30% de opacidade** nos dois contextos.
- O wrapper permanece transparente, sem moldura, fundo ou sombra. Nenhuma regra compartilhada ou identidade dos outros estilos foi alterada.
- O teste de regressão agora cobre explicitamente a regra compartilhada de 72% e a neutralização de 30% do Estilo 2.

## Varredura página por página

Foram reconferidos os 21 imports CSS ativos do Estilo 2 em `src/main.tsx`. A inspeção dos seletores encontrou **0 seletores sem isolamento** por `data-layout="elegancia-profunda"`.

1. Superfícies gerais e assinatura do logo.
2. Modais e Prática Individual.
3. Anamnese.
4. Oração de São Miguel — azul legado é remapeado para champagne/dourado no Estilo 2.
5. Contato.
6. Banhos de ervas.
7. Mapa astral e Numerologia.
8. Diário de Reconexão.
9. Diário diário.
10. Detalhe do dia.
11. Ho'oponopono.
12. Promoção.
13. Configurações.
14. Estados semânticos das Configurações.
15. Cursos.
16. Conquistas.
17. Navegação inferior.
18. Instalação mobile.
19. Cabeçalho.
20. Dashboard.
21. Player.

A paleta própria continua definida por verde profundo, dourado nobre, champagne, bronze e marfim. O tema compartilhado mantém os painéis profundos do Estilo 2. Não foi encontrada justificativa para alterar conteúdo, preços, jornadas ou componentes congelados.

## Seletor e componentes antigos

- `OFFICIAL_LAYOUTS` continua contendo os quatro estilos oficiais.
- `LayoutChoiceModal` começa com `selectedLayout = null`; confirmar permanece impossível até uma escolha.
- `App.tsx` inicia com `layoutConfirmedThisSession = false` e remove `data-layout` antes da confirmação.
- A escolha só é aplicada após a persistência bem-sucedida; o logout limpa a confirmação para a próxima conta.
- `OnboardingFlow` permanece ativo.
- `WelcomeModal`, `requiredLayoutChoiceEntryPatch` e `layoutSettingsExplicitConfirmationPatch` não estão importados no fluxo ativo. O seletor React é a entrada única.
- A prancha continua no card `/brand/elegancia-profunda/prancha-oficial.svg`. O ativo versionado contém imagem WebP real de **240 × 180 px**. A fonte original de 1536 × 1152 px (`1001194194.png`) não foi localizada na Biblioteca nesta execução; não foi ampliada artificialmente nem substituída por outra referência.

## Áudio, Diário, player e pagamento

- Voz geral do Estilo 2: exige ID ElevenLabs válido escolhido no perfil; sem fallback silencioso para SpeechSynthesis. O identificador nominal escolhido pelo usuário não foi recuperado nesta execução e não foi inventado.
- Reintegração: permanece com a voz neural dedicada `21m00Tcm4TlvDq8ikWAM`, sem fallback nativo.
- Solfeggio: oscilador de frequência exata preservado.
- Diário: `DailyDiaryModal` envia a entrada a `handleSaveDiaryDay`, que atualiza o progresso e chama `saveProgress`.
- Player: Wake Lock permanece condicionado à reprodução e é liberado ao pausar/desmontar; conteúdo de 21 dias e corpo neutro da Reintegração preservados.
- InfinitePay: checkout externo e confirmação server-side preservados, incluindo conferência do valor e unicidade da transação. Não foi realizada transação real nesta rodada.

## Validação e pendências

- O último workflow disponível para o código anterior foi [GitHub Actions #42417715309](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42417715309). TypeScript, testes, build, entrypoints, verificações de autenticação, smoke tests e endpoints de pagamento passaram; o job geral falhou somente no enforcement do `npm audit`.
- O relatório desse run apontou **9 vulnerabilidades (3 moderadas, 6 altas)**: `body-parser <1.20.9`, `ip-address <=10.7.3`, `qs <=6.16.0`, `vite <=6.4.3` e `zod <4.6.6` em dependências diretas/transitivas. A correção exige atualizar o lockfile com instalação controlada e repetir os testes; não foi feita edição manual de versões/lockfile.
- Não há execução de CI confirmada para os commits desta rodada; a nova asserção ainda precisa rodar no pipeline.
- A verificação de implantação mais recente continua apontando `build-rate-limit` na Vercel; não há publicação homologada.
- Continua pendente uma fotografia de natureza própria aprovada para o Estilo 2. `--ep-scene:none` permanece intencional; não se reutiliza a arte da Reintegração nem imagens de outros estilos.
- Continua pendente a homologação visual do player em dispositivos, a reprodução real da voz/Solfeggio, a persistência ponta a ponta do Diário e uma transação InfinitePay com webhook/liberação.

## Commits desta rodada

- `b5d36787b110aae86720476ab8fd9863d02f034c` — regra de 30% para o logo do hero no Estilo 2.
- `42e2d0a91bdff27cad84f4a35849022c60ddd6a8`, `7f57b4eef6b8be85605ea0e26d64dd42d49f0fbd`, `58d2819090f3e30b680da8ea7f1515378d6c87b1` — teste de regressão e refinamento das asserções.

## Critério de continuidade

Não reabrir seletor, logo fora do hero, jornadas, voz dedicada, Solfeggio, Diário ou pagamentos sem evidência de regressão. Próximas prioridades: executar CI após esta correção; atualizar dependências com lockfile e testes; obter a fotografia de natureza aprovada; homologar player/áudio/Diário/InfinitePay; publicar somente após validação.
