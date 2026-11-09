# Auditoria RUN 109 — Elegância Profunda

Data: 2026-11-09  
Branch: `main`  
Base auditada: `41724715950186ba1715b61e1e921a2dcd30a7d6`

## Corrigido

- A tela de acolhimento inicial (`OnboardingFlow`) recebia uma camada opaca de gradientes e não exibia a fotografia de natureza aprovada para a Elegância Profunda.
- `src/elegancia-profunda-approved-overrides.css`: o fundo de `.ep-care-onboarding` agora reutiliza `--ep-scene-overlay` e `--ep-scene`, mantendo a floresta real sob o véu verde profundo/champagne já aprovado.
- A camada do cartão permanece escura e legível; em telas de até 640 px, o fundo passa a rolagem para evitar problemas de `background-attachment: fixed`.
- `tests/elegancia-profunda-audit.test.ts`: acrescentado teste de regressão para a fotografia no acolhimento, a legibilidade do cartão, o comportamento mobile e o isolamento da Essência Luminosa.

## Preservado e revalidado

- Prancha oficial `1001194194.png`: card derivado 300 × 225, proporção 4:3, sem recorte e integridade protegida por hash.
- Identidade Elegância Profunda: verde profundo, ouro nobre/champagne/bronze/marfim, Playfair Display e Montserrat.
- Logo oficial como assinatura discreta (30% no tratamento geral; wrapper transparente e sem moldura dominante).
- Seletor dos quatro estilos: seleção inicial vazia, confirmação obrigatória e aplicação de `data-layout` somente após confirmação. Cadastro neutro.
- Jornada de 21 dias, corpo neutro e componentes antigos de entrada fora do fluxo ativo.
- Varredura estática independente das 21 folhas CSS específicas: 657 seletores, 0 fora de `data-layout="elegancia-profunda"`.
- Páginas/áreas: modais, anamnese, oração, contato, banhos, mapas, diário, detalhe do dia, Ho'oponopono, promoção, ajustes, cursos, conquistas, navegação inferior, instalação mobile, cabeçalho, dashboard, player e acolhimento inicial.
- Voz neural ElevenLabs obrigatória no Estilo 2, sem fallback silencioso para SpeechSynthesis. O ID geral exato escolhido ainda não está comprovado; não usar a voz dedicada da Reintegração como substituta.
- Solfeggio: 396, 417, 432, 528, 639, 741, 852 e 963 Hz; bloqueio durante prévia neural. Diário, player, Media Session, Wake Lock e animações preservados.
- InfinitePay: checkout HTTPS, confirmação server-side via `/payment_check`, conferência do valor em centavos e proteção contra reutilização de `transaction_nsu`.

## Validação técnica

- A última CI anterior à correção passou com 153 testes, npm audit sem vulnerabilidades, TypeScript e build aprovados (run `42564687773`, commit base `41724715950186ba1715b61e1e921a2dcd30a7d6`).
- A primeira CI do commit inicial da correção encontrou duas asserções antigas excessivamente amplas: elas proibiam `var(--ep-scene)` em todo o CSS, inclusive no acolhimento que agora deve usar a fotografia, e não isolavam a regra específica do player.
- Corrigidos os testes para validar a fotografia no bloco de acolhimento e verificar separadamente que o backdrop do player não consome a cena global. A nova CI deste commit precisa concluir antes de declarar a validação final.

## Pendente

1. Cópia local otimizada da fotografia; neste momento ela continua servida pelo Unsplash.
2. Comparação renderizada de todas as páginas em desktop e celular — depende de deployment funcional.
3. Confirmar o ID exato da voz geral escolhida e homologar áudio em dispositivo real.
4. Homologar Solfeggio, ambiências, Diário, player e animações em dispositivos reais.
5. Executar transação InfinitePay em sandbox e validar webhook.
6. Resolver o provisionamento Vercel.

## Publicação

- A última implantação de produção associada ao `main` disponível no histórico consultado corresponde ao commit `801755b6dba612b9168ea4f2bc24ce678f86d115` e terminou em `ERROR / BUILD_FAILED / Resource provisioning failed`.
- O HEAD base `41724715950186ba1715b61e1e921a2dcd30a7d6` não possui deployment válido identificado.
- A Vercel também mostra falhas de provisionamento em deployments recentes de outras branches; esses registros não foram tratados como alterações do Estilo 2.
- Eventos detalhados de build retornaram vazios. Nenhuma configuração financeira ou de plano foi alterada.

Conclusão: a fotografia de natureza agora também aparece no acolhimento inicial da Elegância Profunda, sem modificar conteúdo, lógica, seleção de estilo ou outros temas. A homologação visual e a publicação continuam pendentes.


## Ajuste de testes após a primeira CI

A execução `42575154567` executou 154 testes: 152 passaram e 2 falharam por asserções de escopo antigas, não por falha de build ou TypeScript. As duas asserções foram atualizadas para distinguir a cena do acolhimento da cena própria do player. A execução seguinte deve confirmar o resultado final.
