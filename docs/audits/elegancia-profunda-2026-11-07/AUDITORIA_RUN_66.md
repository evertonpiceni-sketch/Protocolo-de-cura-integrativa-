# AUDITORIA_RUN_66 — Estilo 2 · Elegância Profunda

**Data:** 2026-11-07  
**Branch:** `main`  
**Base desta rodada:** `ab83b69f57cc5ea8aa0f604e6f82305b91a47ad7`  
**Commits da correção:** `b286063fa37ffa56daa97c202117333b8c4078d9` (código) e `14700b4cd62abc56fd3b4c4899805f3d921ce746` (teste).  
**Referência visual:** arquivo original `1001194194.png`, file id `file_00000000121c820e931b56bb6b1467e9`, recuperado e inspecionado nesta rodada; resolução original 1536 × 1152 px. As decisões aprovadas posteriores continuam prevalecendo sobre detalhes ilustrativos da prancha, inclusive a jornada funcional de 21 dias.

## Corrigido

- Encontrada regressão de sessão no `src/App.tsx`: `handleLogout` removia o perfil e encerrava a autenticação, mas não zerava `layoutConfirmedThisSession` nem `layoutChoiceRequested`.
- Isso permitia que, após logout e novo login sem desmontar a aplicação, a segunda conta herdasse a confirmação de estilo da conta anterior e pudesse receber o tema sem uma nova escolha explícita.
- O logout agora redefine ambos os estados para `false`. A próxima conta volta a receber o seletor React com os quatro estilos; o tema só é aplicado após nova confirmação.
- Acrescentado teste de regressão em `tests/elegancia-profunda-audit.test.ts` para proteger esse fluxo.

## Preservado e revalidado

- O seletor React continua sendo o único seletor ativo; seleção inicial vazia e confirmação obrigatória.
- O efeito de tema continua removendo `data-layout` enquanto `layoutConfirmedThisSession` for falso.
- A comparação de histórico mostrou oito commits posteriores à base anterior, incluindo alterações do Estilo 3 em `App.tsx`; a correção foi aplicada apenas ao bloco de logout, preservando essas alterações.
- A prancha do Estilo 2 continua no card `/brand/elegancia-profunda/prancha-oficial.svg`; a referência original recuperada corresponde à imagem indicada.
- Tokens do Estilo 2 preservados: verde profundo, ouro nobre, champagne/bronze e marfim. Logo continua assinatura sutil/transparente.
- `OnboardingFlow` permanece ativo; `WelcomeModal` legado permanece inativo.
- Jornada de 21 dias, corpo neutro, player, áudio neural dedicado da Reintegração, Wake Lock e Media Session preservados.
- Voz geral do Estilo 2 continua exigindo ID ElevenLabs válido escolhido/salvo; não há ID nominal da voz aprovada comprovado nos registros recuperados. Nenhum fallback robótico ou ID inventado foi introduzido.
- Solfeggio continua no oscilador de frequência exata; patch de integridade de áudio preservado.
- Diário e Diário de Reconexão, callbacks e conteúdo preservados.
- InfinitePay continua com criação de checkout e confirmação server-side via `payment_check`, validação do valor e proteção contra reutilização de transação; nenhuma regra comercial foi alterada.

## Varredura estática página por página

- **Acesso/login e seletor:** preferência persistida não é consentimento; logout agora limpa a confirmação da sessão.
- **Home, dashboard, cabeçalho e navegação:** tokens do Estilo 2 e camadas específicas preservados.
- **Acolhimento:** `OnboardingFlow` ativo; fluxo antigo não reativado.
- **Jornada/lista de dias e player:** paleta própria do Estilo 2, canvas, temporização e estados existentes preservados.
- **Reintegração da Vida:** 21 dias, corpo neutro, áudio neural dedicado e assinatura discreta preservados.
- **Anamnese, orações, banhos, mapas/numerologia, Ho'oponopono, cursos, conquistas e contato:** folhas específicas conferidas.
- **Diário e Diário de Reconexão:** componentes, callbacks de salvamento e folhas específicas conferidos.
- **Ajustes de áudio/Solfeggio:** exigência de voz neural do Estilo 2 e oscilador exato conferidos estaticamente.
- **Instalação móvel, promoções e configurações:** folhas específicas conferidas.
- **Pagamentos:** endpoints InfinitePay e confirmação server-side conferidos estaticamente.

As 21 folhas CSS importadas para o Estilo 2 foram recuperadas e submetidas a varredura estática de seletores. Não foram encontrados seletores globais suspeitos fora dos escopos de layout ou das classes/componentes proprietários. Isso não substitui inspeção visual em navegador.

## Pendente

1. O SVG da prévia ainda contém bitmap WebP de 240 × 180 px, enquanto a prancha original tem 1536 × 1152 px. A versão 2x/alta densidade ainda não foi incorporada.
2. Não há fotografia independente de natureza com aprovação comprovada para o Estilo 2; `--ep-scene:none` deve permanecer até existir ativo próprio aprovado. Não reutilizar imagens da Reintegração ou dos outros estilos.
3. O canvas do player ainda não reproduz integralmente a silhueta corporal neutra e a composição de natureza da prancha.
4. Faltam capturas e comparação visual real de todas as páginas em desktop e celular.
5. Faltam testes de execução real da voz neural escolhida, reprodução/transição das frequências Solfeggio, persistência do Diário e transação controlada InfinitePay com webhook/liberação de acesso.
6. Não há execução nova de GitHub Actions comprovada para os commits desta rodada. O status combinado do commit de teste mostra a verificação Vercel em falha `build-rate-limit`; não há implantação nova confirmada.
7. `npm audit` não foi reexecutado nesta rodada. O último registro de auditoria disponível apontava 9 vulnerabilidades (3 moderadas e 6 altas); revalidar antes da homologação.

## Arquivos alterados nesta rodada

- `src/App.tsx`
- `tests/elegancia-profunda-audit.test.ts`
- `docs/audits/elegancia-profunda-2026-11-07/AUDITORIA_RUN_66.md`

**Status:** corrigida regressão que permitia reaproveitar a confirmação de estilo entre contas no mesmo ciclo da aplicação. O Estilo 2 permanece sem homologação visual/funcional integral.
