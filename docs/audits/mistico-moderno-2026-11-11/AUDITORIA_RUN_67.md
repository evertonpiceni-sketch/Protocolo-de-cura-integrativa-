# Auditoria Estilo 4 — Místico Moderno — Run 67

**Data:** 11/11/2026  
**Branch:** `fix/mistico-moderno-run15-mainline-2026-11-09`  
**Base da PR:** `main` — `783aacc8210d92f35037a0d06309806b89a96973`  
**Escopo:** corrigir somente a divergência de Solfeggio no protocolo do Arcanjo, reforçar testes e revalidar as decisões vigentes. Sem merge e sem publicação.

## Corrigido

- **Arcanjo — divergência de áudio:** a branch ainda tratava o Místico Moderno como exceção e permitia Solfeggio simultâneo à narração neural. O componente também anunciava “Narração neural + Solfeggio ativos”. Isso contrariava a decisão aprovada mais recente (Run 76/78/98): as frequências Solfeggio devem permanecer interrompidas durante a narração neural; ambiências não tonais podem continuar.
- A condição `suspendsSolfeggioDuringNeuralNarration` agora inclui os Estilos 2, 3 e 4. No Místico Moderno, a frequência fica desligada durante preparação e fala; retorna quando a narração é pausada ou concluída. Em erro de voz, o protocolo encerra a tentativa sem fallback do navegador e deixa a frequência disponível sem narração.
- O status acessível do player foi corrigido: informa Solfeggio suspenso durante a fala e ativo apenas durante pausas ou após a narração. Removida a mensagem que afirmava reprodução simultânea.
- Atualizados os testes de regressão para cobrir início, reprodução, pausa, conclusão, erro, restauração e texto de status. Acrescentado teste para o player de 21 dias: as oito frequências Solfeggio (396, 417, 432, 528, 639, 741, 852 e 963 Hz) não são reiniciadas durante a narração; ambiências não tonais permanecem permitidas.

## Preservado

- Estilos 1, 2 e 3 e suas políticas específicas; nenhuma paleta ou componente visual deles foi alterado.
- Seletor dos quatro estilos com seleção inicial vazia, confirmação explícita e persistência antes da aplicação.
- Prancha oficial do Místico Moderno, identidade noturna, logo oficial discreto/transparente e corpo neutro.
- Jornada de 21 dias, protocolo do Arcanjo de sete dias, Diário fechado por padrão, player e respeito a movimento reduzido.
- Voz neural ElevenLabs salva no perfil; Místico Moderno continua sem fallback para SpeechSynthesis.
- Catálogo, preços, cupons, checkout e webhook InfinitePay. Nenhuma credencial foi lida ou alterada; nenhuma cobrança foi feita.

## Reauditoria estrutural

- 26 folhas CSS específicas do Místico Moderno permanecem importadas e isoladas por `data-layout="mistico-moderno"`; o teste de isolamento verifica os seletores das folhas carregadas.
- As 12 superfícies continuam cobertas estruturalmente pela auditoria e pelos testes existentes. A inspeção visual renderizada em desktop/celular ainda não pode ser declarada concluída sem Preview READY.
- O player de 21 dias já usa `shouldPlayProtocolSessionBackground`, que bloqueia as frequências Solfeggio durante a fase `playing` e permite trilhas não tonais. O teste novo protege esse contrato.
- A última CI anterior à correção era Security Audit Run 2439 (SUCCESS). A nova execução após os commits desta rodada precisa concluir antes de declarar a reauditoria técnica aprovada.

## Pagamentos e implantação — estado observado

- A listagem de variáveis Vercel foi feita com `decrypt=false`; nenhum valor secreto foi consultado.
- `INFINITEPAY_HANDLE` existe apenas em Production. Não foram encontradas `INFINITEPAY_API_KEY`, `INFINITEPAY_PREVIEW_API_KEY` ou `INFINITEPAY_PREVIEW_HANDLE`.
- `PUBLIC_APP_URL` existe em Production e Development, mas não para esta branch Preview. O código continua fail-closed; o sandbox e o webhook ainda não foram homologados.
- `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` estão cadastradas como secrets para Preview e Production; os valores não foram lidos e a reprodução real ainda precisa ser ouvida em dispositivo.
- Os cinco deployments recentes listados para a branch estavam em ERROR. O mais recente observado foi criado em 11/11/2026 às 13:50:49 UTC (10:50:49 BRT). O comentário do Vercel no PR informa limite diário `api-deployments-free-per-day`; não foi disparada nova implantação.

## Pendente

1. Aguardar a liberação do limite de deployments e obter Preview READY.
2. Homologar visualmente as 12 superfícies em desktop e celular.
3. Integrar fotografia fotorrealista de corpo neutro aprovada; `chakra-body.svg` permanece vetorial e a Home não inventa uma fotografia ausente.
4. Testar a voz neural escolhida, início/pausa/retomada/encerramento e Solfeggio em dispositivo real.
5. Configurar credenciais/handle próprios de Preview e homologar checkout/webhook InfinitePay em sandbox.

**Estado:** PR #77 permanece aberto e em rascunho. Sem merge, sem deploy de Production e sem cobrança real.
