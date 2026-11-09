# Auditoria RUN 110 — Elegância Profunda

Data: 2026-11-09  
Branch: `main`  
Base auditada: `59abff893d556a368c3f3511b1c45d5b2238b04f`

## Corrigido

- A reauditoria encontrou uma divergência entre o relatório RUN 109 e o código: a fotografia `--ep-scene` estava aplicada ao modal `.ep-care-onboarding`, mas não era consumida pelo shell principal `#cura-main-layout` nem pelos heros da Home.
- `src/elegancia-profunda-approved-overrides.css`: a fotografia de floresta e o véu verde profundo/champagne agora compõem o shell principal, o hero da Home e o acolhimento com áudio.
- Em telas de até 640 px, o fundo do shell usa `background-attachment: scroll` para evitar problemas de rolagem móvel.
- `tests/elegancia-profunda-audit.test.ts`: novo teste exige a cena no shell e nos dois heros, verifica o ajuste mobile e impede que o player ou a Essência Luminosa herdem a cena do Estilo 2.

## Preservado e revalidado

- Prancha oficial `1001194194.png` no card `/brand/elegancia-profunda/prancha-oficial.svg`, 300 × 225, proporção 4:3, sem recorte.
- Paleta Elegância Profunda: verde profundo, ouro nobre/champagne/bronze/marfim; Playfair Display e Montserrat.
- Logo oficial como assinatura: 30% de opacidade no desktop, 26% no mobile; wrapper sem fundo, moldura ou sombra dominante.
- Seletor dos quatro estilos: seleção inicial vazia, confirmação obrigatória e aplicação de `data-layout` somente após confirmação.
- A correção do commit `3ead1034958c239232d927406fac66c290816800` mantém o `OnboardingFlow` bloqueado até a confirmação explícita do estilo.
- Cadastro neutro; jornada de 21 dias; corpo neutro; componentes antigos de entrada fora do fluxo ativo.
- As 21 folhas CSS do Estilo 2 continuam importadas e isoladas; a última varredura registrada contou 657 seletores e nenhum fora de `data-layout="elegancia-profunda"`.
- Voz neural ElevenLabs obrigatória, sem fallback silencioso. O ID geral aprovado continua não comprovado; o ID `21m00Tcm4TlvDq8ikWAM` pertence somente à Reintegração da Vida e não é substituto para o Estilo 2.
- Solfeggio: 396, 417, 432, 528, 639, 741, 852 e 963 Hz; o oscilador fundamental mantém o valor nominal exato e o bloqueio durante prévia neural.
- Diário, player, Media Session, Wake Lock e animações preservados. O player mantém cenário próprio, sem herdar a fotografia global.
- InfinitePay: checkout HTTPS, confirmação server-side por `/payment_check`, conferência do valor em centavos e proteção contra reutilização de `transaction_nsu`.

## Validação técnica

- No HEAD-base `59abff893d556a368c3f3511b1c45d5b2238b04f`, a execução GitHub Actions `42583510095` terminou com sucesso: TypeScript, regressões, build, entrypoints Express, verificações de segurança, smoke test e endpoints de pagamento aprovados.
- O novo teste de integração da fotografia será executado pela CI disparada por este commit; seu resultado deve ser conferido antes da homologação.
- A contagem de testes do HEAD-base foi de 154 na auditoria anterior; esta rodada acrescenta uma asserção de regressão.

## Publicação e pendências

- Deployment do HEAD-base `59abff893d556a368c3f3511b1c45d5b2238b04f`: `dpl_Hz2MAcGnNpsL6JyNEY5sWFSt3mQD`, estado `ERROR / BUILD_FAILED`, mensagem `Resource provisioning failed`.
- A consulta de eventos de build retornou lista vazia; não há evidência suficiente para atribuir a falha a uma configuração específica do código.
- A fotografia continua hospedada no Unsplash; cópia local otimizada e proveniência local permanecem pendentes.
- Comparação renderizada de todas as páginas em desktop e celular ainda depende de deployment funcional.
- Confirmar o ID exato da voz geral escolhida e homologar voz, Solfeggio, ambiências, Diário, player e animações em dispositivos reais.
- Executar transação InfinitePay em sandbox e validar webhook.
- Resolver o provisionamento Vercel e homologar a versão publicada.

Conclusão: a fotografia da Elegância Profunda agora é consumida pelo shell principal e pelos heros da Home, não apenas pelo modal de acolhimento. A alteração permanece isolada no Estilo 2 e preserva o cenário próprio do player e as decisões posteriores aprovadas.


## Ajuste da primeira execução pós-commit

- A primeira CI do commit `c18aacccfdd73427c4c8551e80e0cdf275e68f80` (`42590757150`) executou 156 testes: 155 passaram e 1 falhou por um detalhe do próprio teste novo.
- O helper usava `lastIndexOf` para localizar a regra do shell e acabava selecionando a regra mobile posterior, que contém apenas `background-attachment`, em vez da regra principal com a fotografia.
- Corrigido o teste para localizar a primeira regra principal do shell; nenhuma regra de produção foi alterada nessa correção.
- A CI do commit seguinte deve ser consultada para confirmar os 156 testes e o build antes da homologação.
