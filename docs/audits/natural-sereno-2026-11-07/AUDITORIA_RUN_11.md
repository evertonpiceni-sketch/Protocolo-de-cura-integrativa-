# Auditoria — Estilo 1: Natural Sereno — Run 11
Data: 2026-11-07

## Referência e preservação
- A prancha original enviada pelo Everton foi localizada na Biblioteca como `1001196520(2).png` (623.950 bytes) e inspecionada visualmente.
- A cópia versionada em `docs/visual-qa/natural-sereno/reference.jpg`, usada pelo seletor, apresenta a mesma composição das 12 telas. Ela foi mantida nesta passagem para não substituir um asset congelado por uma cópia binária sem ganho visual comprovado.
- A prancha orienta o Estilo 1, subordinada às decisões posteriores: base creme/marfim, café, dourado refinado, verde natural como acento em superfícies de interface e logo oficial sutil/transparente. A folhagem escura das fotografias permanece como natureza real, não como chapas de UI.

## Corrigido nesta rodada
1. **Seletor dos quatro estilos:** a preferência persistida passa a ser apenas pré-seleção. A escolha da tela de Aparência também pré-seleciona o card clicado. Em ambos os casos, o tema só é aplicado após confirmação explícita; a persistência autenticada continua dependendo da resposta bem-sucedida do servidor.
2. **Voz Natural Sereno:** Home/boas-vindas/resultado e Ajustes de Áudio passam a exigir voz neural. O ID oficial Marianne é o padrão quando não há ID ElevenLabs válido; IDs neurais válidos já salvos continuam preservados. O player principal usa o ID salvo válido ou Marianne, em vez dos aliases legados Rachel/Marcus/masculina/feminina. O patch de áudio normaliza aliases inválidos e bloqueia fallback para Web Speech no Natural Sereno, evitando troca silenciosa para voz robótica.
3. **Regressão preventiva:** adicionados testes de regressão para pré-seleção sem aplicação automática, voz neural, posse de áudio do Arcanjo/Solfeggio, Diário/player e checkout InfinitePay. As expectativas compartilhadas dos testes dos Estilos 2 e 3 foram ajustadas sem alterar suas paletas ou fluxos.
4. **Varredura CSS:** analisadas as 12 folhas importadas do Natural Sereno. Os seletores do tema estão restritos ao `data-layout="natural-sereno"` ou ao shell de autenticação. Duas regras sem tema, `.ep-reintegration-running` e seu visual de presença mobile, foram preservadas por pertencerem à experiência independente Reintegração da Vida.

## Preservado e reauditorado
- Paleta: creme `#FAF7F2`, café `#2A2421`, dourado `#C89D52`, verde `#6B7A4B` como acento.
- Logo oficial como assinatura: opacidade de 30% no desktop e 26% em telas pequenas.
- Paisagem real do player (cachoeira), com enquadramento específico para desktop e mobile; controles, etapas, respiração e callbacks não foram alterados.
- Comunidade com fotografia e superfícies marfim/café, sem véu verde-floresta dominante; Diário com conteúdo e persistência intactos.
- Solfeggio: o áudio global já pausa em `showArcanjoView` tanto no efeito principal quanto no desbloqueio por gesto; o patch de posse do Arcanjo foi mantido.
- Prática Individual e Numerologia: continuam usando `/api/payment/create-checkout` / InfinitePay; não há cópia manual de chave PIX nos dois modais. Nenhuma regra de liberação de pagamento foi alterada.
- Reintegração da Vida, corpo neutro, movimento da luz e logo discreto permanecem fora de qualquer redesign desta rodada.

## Pendente / limites de validação
- Executar lint, testes e build na branch/CI; esta rodada não executou ambiente local nem navegador.
- Recapturar e comparar as 12 telas após as mudanças, em desktop e mobile, especialmente Home, Anamnese/Resultado, Biblioteca, Ferramentas, Comunidade e Perfil.
- Ouvir uma sessão real com ElevenLabs e validar a indisponibilidade neural sem fallback de dispositivo; confirmar áudio exclusivo durante Arcanjo/Solfeggio em runtime.
- Validar animações/canvas visualmente e fazer smoke test do checkout InfinitePay em ambiente de teste, sem transação real.
- A homologação de fidelidade integral continua **bloqueada** conforme `design-qa.md`: a prancha e as capturas existentes ainda registram diferenças de acabamento/estrutura. Nenhuma equivalência visual total foi declarada.

## Arquivos alterados
- `src/App.tsx`
- `src/components/LayoutChoiceModal.tsx`
- `src/components/TransformationHome.tsx`
- `src/components/MeditationSession.tsx`
- `src/components/AudioSettingsModal.tsx`
- `src/lib/naturalSerenoOfficialVoicePatch.ts`
- `tests/natural-sereno-audit.test.ts`
- `tests/essencia-luminosa.test.ts`
- `tests/elegancia-profunda-audit.test.ts`
