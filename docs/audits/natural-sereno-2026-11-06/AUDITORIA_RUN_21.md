# Auditoria — Estilo 1: Natural Sereno
**Data:** 06/11/2026  
**Base inspecionada:** `main` — `207d10cd851cf2e6ddd7d63111f28db9ba840fcd`  
**Branch de correção:** `audit/natural-sereno-2026-11-06`

## Referência visual e método
- Usei como referência a cópia versionada da prancha em `docs/visual-qa/natural-sereno/reference.jpg`, que reproduz visualmente o card do Estilo 1 indicado pelo Everton. A prancha continua subordinada às decisões aprovadas posteriores.
- Comparei a prancha com o painel de 12 telas em `docs/visual-qa/natural-sereno/comparison-board.jpg` e com as capturas atuais versionadas de Home, Menu, Player e Comunidade.
- O anexo original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` não está montado no ambiente desta execução; portanto, a correspondência foi visual, não uma comparação binária dos arquivos.
- Esta rodada foi uma auditoria estática do código e das capturas versionadas. Não foi executado um navegador ao vivo nem uma nova captura em 1440 px.

## Corrigido nesta rodada
- `tests/protocol-fallback.test.ts`: substituída a expectativa legada de que o player deveria falar com a voz nativa do navegador quando o stream oficial falhasse. A política vigente do player é não trocar silenciosamente para uma voz robótica: a falha deve ser comunicada e a reprodução interrompida.
- O teste agora verifica falha de serviço/rede sem fala nativa, retorno de erro, volume inicial do elemento de áudio e cancelamento de uma requisição em andamento ao sair do player.
- Nenhuma regra visual, componente aprovado, conteúdo, pagamento ou API foi alterado nesta rodada, pois a inspeção não confirmou uma regressão visual/funcional que justificasse essa intervenção.

## Preservado e reaudidado
- **Seletor:** `App.tsx` mantém `layoutConfirmedThisSession=false` no início da sessão; `LayoutChoiceModal.tsx` começa sem estilo pré-selecionado, mostra as quatro prévias e mantém a confirmação desabilitada até uma escolha. O atributo `data-layout` só é aplicado depois da confirmação. Preferência salva não aplica o tema automaticamente.
- **Quatro estilos:** `layouts.ts` mantém Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno. Natural Sereno mantém creme `#FAF7F2`, café `#2A2421`, dourado `#C89D52` e verde `#6B7A4B` como acento.
- **Paisagens e responsividade:** `natural-sereno-home-latest-approved.css` diferencia o enquadramento da paisagem em telas a partir de 900 px e em telas menores. O tema usa o vale do amanhecer na Home e fotografia de cachoeira nas cenas de boas-vindas, player e Comunidade. Essas áreas escuras são imagens de natureza, não chapas verdes sólidas; foram preservadas.
- **Logo:** `natural-sereno-approved-overrides.css` mantém o logo oficial em baixa opacidade (`.30`) como assinatura discreta.
- **CSS legado:** as folhas temáticas continuam carregadas, com `natural-sereno-approved-overrides.css` por último. Não removi camadas históricas em bloco: isso poderia reintroduzir regressões nos outros estilos. Os ajustes existentes de Diário, Prática Individual, Mapa Astral, Ajustes e componentes antigos foram preservados.
- **Voz:** `OFFICIAL_PROTOCOL_VOICE_ID` permanece `mJqP14JQFEK0PojR5lfV`; `naturalSerenoOfficialVoicePatch.ts` normaliza o alias feminino legado `Rachel` para a voz oficial no Natural Sereno, sem sobrescrever escolhas masculinas/personalizadas explícitas.
- **Solfeggio e áudio:** `audioIntegrityPatch.ts` mantém os osciladores exatos para 396, 417, 432, 528, 639, 741, 852 e 963 Hz. `App.tsx` impede o áudio ambiente global durante Arcanjo/Solfeggio, inclusive no desbloqueio por gesto; a proteção de posse de áudio também permanece.
- **Diário, player e animações:** permanecem os overrides de cor do Diário, a cadência respiratória 4–3–5, o progresso em segundos reais, os títulos distintos por dia e o mapeamento da animação às seis etapas narradas. Esses testes passaram na última execução disponível.
- **Pagamento:** Prática Individual e Numerologia seguem por `/api/payment/create-checkout`; a rota usa InfinitePay, valida domínio HTTPS e confirma valor/transação no servidor. Não há chave PIX manual nem cópia automática nos dois componentes. Valores da Prática Individual permanecem 1 dia R$ 20,00, 7 dias R$ 59,90 e 21 dias R$ 99,90.

## Pendente
1. **CI após esta correção:** o teste atualizado ainda precisa ser executado pelo workflow em uma PR. Na execução anterior, 32 de 35 testes passaram; os três registros de falha correspondiam a duas subasserções e ao teste pai que ainda esperavam o fallback nativo antigo. O build foi ignorado porque a etapa de testes falhou.
2. **Segurança de dependências:** o workflow também apontou 9 vulnerabilidades (3 moderadas e 6 altas), envolvendo `body-parser`, `ip-address`, `qs`, `vite` e `zod` (incluindo a cadeia `puppeteer/chromium-bidi`). Não alterei versões nem lockfile nesta auditoria visual para evitar uma atualização ampla sem validação isolada.
3. **Homologação ao vivo:** ainda falta repetir a navegação visual em 390 px e 1440 px, testar a reprodução com as credenciais de voz de produção e conferir o retorno do checkout em ambiente real. Nenhuma transação foi iniciada.
4. **Anexo original:** a cópia versionada da prancha foi usada como referência visual; a comparação binária com o anexo original permanece pendente por indisponibilidade do arquivo no runtime.


## Reauditoria após a primeira execução de CI
- A primeira execução da PR rodou TypeScript com sucesso e 33/35 testes passaram. O único teste novo que falhou estava lendo a primeira instância de áudio, que é o elemento keep-alive inicializado pelo motor, e não o elemento do player oficial. A asserção foi corrigida para verificar a última instância criada (o áudio do protocolo).
- A execução também confirmou novamente 9 vulnerabilidades de dependências (3 moderadas e 6 altas). O build foi ignorado porque a suíte de testes não concluiu; o workflow permanece bloqueado pela auditoria de dependências.
- O preview da Vercel associado à PR retornou `BUILD_FAILED / Resource provisioning failed`, sem eventos de build. O erro é de provisionamento do ambiente, não uma falha de compilação demonstrada; não foi feita nova implantação manual.
- A correção de asserção já está no branch e aguarda nova execução do workflow.

**Conclusão:** o código atual já contém as proteções visuais e funcionais principais do Natural Sereno. A única correção aplicada nesta rodada foi alinhar o teste de regressão à política aprovada de não usar voz nativa robótica como fallback do player oficial. A homologação final continua aberta até CI, segurança de dependências e teste visual/funcional ao vivo.
