# AUDITORIA_RUN_61 — Estilo 2 · Elegância Profunda
Data: 2026-11-07
Branch: main
Base: estado atual após RUN_60; correções incrementais em `SpecificTreatmentModal`.

## Corrigido
- A reauditoria da Prática Individual encontrou superfícies brancas ainda visíveis nos ciclos de 7/21 dias, nos cartões de categorias, no resumo de preço, nas abas e em áreas do formulário. A camada `elegancia-profunda-modal-audit.css` agora remapeia essas superfícies para verde profundo e escuro, somente sob `data-layout="elegancia-profunda"`.
- Textos escuros herdados dentro do modal agora recebem marfim; o texto índigo legado passa ao tom secundário do Estilo 2. O destaque “Completo (Recomendado)” permanece em champagne/bronze.
- Adicionado teste de regressão para impedir o retorno de cards brancos e texto índigo na Prática Individual.

## Referência oficial e decisões preservadas
- A prancha original `1001194194(5).png` foi recuperada da Biblioteca e inspecionada em 1536 × 1152 px. O seletor React continua usando `/brand/elegancia-profunda/prancha-oficial.svg` como card de referência.
- Conferência do código encontrou a prévia incorporada em 240 × 180 px (não 384 × 288 como descrito no RUN_60). A prévia permanece sem alteração nesta rodada; a versão de alta densidade fica pendente. A prancha é referência de composição, não fundo global.
- `--ep-scene:none` permanece intencional no Estilo 2 até existir fotografia de natureza própria e aprovada; nenhuma imagem de outro estilo foi reutilizada.
- Seletor dos quatro estilos, seleção inicial vazia e confirmação explícita antes de aplicar qualquer tema permanecem intactos.
- Jornada posterior aprovada de 21 dias, corpo neutro, logo oficial como assinatura discreta/transparente (30% desktop / 26% mobile) e paleta verde profundo, ouro, champagne, bronze e marfim preservados.

## Varredura estática por tela/fluxo
- Seletor/prévia e aplicação de tema: `LayoutChoiceModal` e guarda de confirmação em `App.tsx`.
- Onboarding/Home/dashboard, cabeçalho, menu, perfil e configurações: `OnboardingFlow` ativo; `WelcomeModal` legado inativo.
- Jornada/lista de dias, player principal, canvas, Reintegração, roteiro, Wake Lock e Media Session.
- Anamnese/resultado, oração, Ho'oponopono, banhos, mapas/numerologia, cursos, conquistas, Prática Individual.
- Diário, Diário de Reconexão, Solfeggio, voz e configurações de áudio.
- Checkout, confirmação server-side e rotas de pagamento InfinitePay.

## Preservado e revalidado estaticamente
- Voz geral do Estilo 2 exige ID ElevenLabs válido salvo no perfil; sem troca silenciosa para voz do navegador. A Reintegração continua na rota neural dedicada aprovada, sem `speechSynthesis`.
- Solfeggio mantém oscilador exato para 396, 417, 432, 528, 639, 741, 852 e 963 Hz; mapa MP3 legado não foi reativado.
- Diário e Diário de Reconexão não tiveram dados ou conteúdo alterados.
- InfinitePay permanece com checkout e confirmação server-side, handle `evertonterapeutareiki`, sem chave PIX manual ou liberação local.
- 21 folhas CSS específicas do Estilo 2 continuam importadas; as regras desta correção estão limitadas ao Estilo 2.

## Validação e pendências
- A correção CSS e o teste de regressão foram registrados, mas ainda não há execução de Actions associada ao commit mais recente `cdb001e`.
- Última execução de Actions disponível (run 42366110497): TypeScript, testes, build, smoke tests, segurança de autenticação e endpoints de pagamento passaram; o pipeline terminou reprovado na etapa de auditoria de dependências, com 9 vulnerabilidades (3 moderadas e 6 altas).
- Status combinado atual do commit mais recente: Vercel `failure` por `build-rate-limit`; não há nova publicação confirmada.
- Pendentes: prévia de alta densidade; fotografia de natureza própria e aprovada; comparação visual real de todas as telas em desktop/mobile; teste real da voz, frequências, Diário, player e animações; transação controlada InfinitePay/webhook; atualização isolada das dependências vulneráveis e nova homologação.

## Commits desta rodada
- `b91c51b` — correção das superfícies claras e texto índigo na Prática Individual.
- `cdb001e` — teste de regressão para a correção.

Status: uma herança visual ativa na Prática Individual foi corrigida e protegida por teste. O Estilo 2 continua sem homologação visual/funcional integral e sem nova publicação.
