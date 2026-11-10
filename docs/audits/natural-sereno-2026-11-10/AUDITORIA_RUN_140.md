# Auditoria RUN 140 — Estilo 1: Natural Sereno

**Data:** 10/11/2026 — 01:41 (America/Sao_Paulo)  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD de código/teste antes deste relatório:** `7875faf3e529d1c11fe0775f0a5acd3a4193c4a0`  
**Main verificada:** `783aacc8210d92f35037a0d06309806b89a96973`  
**PR:** #79, aberta em rascunho, `mergeable=false`.

## Resultado

A reauditoria estática não encontrou regressão visual ativa que justificasse alterar telas ou componentes congelados. Para reforçar uma decisão crítica, acrescentei um teste que garante que `document.documentElement.dataset.layout` permaneça neutro até a confirmação explícita do estilo.

## Corrigido nesta rodada

- Ampliado `tests/natural-sereno-layout-reference.test.ts` para verificar que o atributo `data-layout` é removido enquanto não há confirmação e só recebe o estilo escolhido depois de `layoutConfirmedThisSession`.
- Commit do teste: `7875faf3e529d1c11fe0775f0a5acd3a4193c4a0`.

Não alterei CSS, componentes de interface, conteúdo, roteiros, preços ou lógica de pagamentos nesta rodada, pois não encontrei regressão nova confirmada. Os Estilos 2, 3 e 4 não foram modificados.

## Verificado e preservado

### Identidade e páginas

- `main.tsx` importa as camadas do Natural Sereno e deixa `natural-sereno-approved-overrides.css` depois das folhas anteriores.
- O Estilo 1 usa `NaturalSerenoHome`; o caminho genérico de `TransformationHome` com cartões globais `ep-luxury-card` não é renderizado para Natural Sereno.
- Base creme/marfim, café/marrom, dourado refinado e sálvia em pequenos acentos.
- A prancha original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` continua documentada como referência oficial. O card do repositório usa a derivação versionada `docs/visual-qa/natural-sereno/reference.jpg`, em `object-contain`; não se afirma equivalência pixel a pixel. As decisões posteriores sobre paleta, corpo neutro e logo prevalecem sobre elementos históricos da prancha.
- A prévia do card mantém paisagem realista e a prancha sem recorte.
- O hero possui regras separadas de enquadramento desktop/mobile no modelo aprovado; o player mantém a cachoeira com posições específicas para desktop e celular, cobertas por `natural-sereno-landscape-framing.test.ts`.
- Logo oficial como assinatura: 30% desktop e 26% mobile, coberto por `natural-sereno-logo-audit.test.ts`.

### Seletor

- `LayoutChoiceModal` começa com `selectedLayout = null`.
- A confirmação fica bloqueada até existir escolha; a persistência é aguardada antes de fechar.
- `App.tsx` só define `data-layout` depois de `layoutConfirmedThisSession`; enquanto não confirmado, remove o atributo e mantém o navegador em cor neutra.
- As quatro opções oficiais continuam: Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno.

### Voz, Solfeggio, Diário e player

- O fluxo neural do Natural Sereno exige um ID ElevenLabs válido; falha de voz interrompe a narração e apresenta erro, sem troca silenciosa para a voz nativa do navegador.
- A política Solfeggio permite reprodução somente com modal aberto, áudio habilitado e sem voz carregando/reproduzindo; durante prévia neural bloqueia frequências Solfeggio, sem bloquear ambiência não tonal.
- O Arcanjo mantém corpo neutro e arte neutra nos controles de mídia do Natural Sereno; falha de narração neural não chama o fallback nativo.
- `userSync.ts` mantém filas por identidade de conta, falha fechada sem identidade e retentativas controladas; os testes de sincronização atômica do Diário permanecem presentes.
- Player, animações e respiração aprovada permanecem sem alterações.

### InfinitePay

- O checkout exige `INFINITEPAY_API_KEY`; sem chave, o teste confirma falha fechada sem chamada ao provedor nem criação de pedido.
- Payload mantém `single_payment: true`.
- Lock compartilhado e atualização do armazenamento persistente permanecem no fluxo financeiro.
- `VERCEL_ENV !== 'production'` retorna HTTP 503 com `PAYMENTS_PRODUCTION_ONLY`, mantendo pagamentos reais desativados fora de produção até homologação sandbox.
- Nenhuma cobrança ou chamada real de checkout foi iniciada nesta auditoria.

## Validação e bloqueios

- O teste de regressão foi atualizado e conferido no repositório; não foi executado localmente nesta rodada.
- A consulta de workflows para o HEAD documental anterior `b7c7d295cc792a1dc7758d39948a1a106d39382c` retornou lista vazia. O status combinado disponível era apenas Vercel em falha. A nova CI do HEAD `7875faf` precisa ser confirmada após o evento de sincronização da PR.
- Vercel permanece sem preview READY; o status associado ao HEAD anterior está em falha. Sem preview, não há inspeção renderizada completa página por página em desktop/mobile.
- Pendente escuta real em dispositivo de Marianne, ambiência e Solfeggio, incluindo pausa/retomada e conclusão.
- Pendente homologação InfinitePay em sandbox: checkout, confirmação, webhook e reconciliação do pedido.
- A branch está divergida: 163 commits à frente e 12 atrás da main atual. A main contém alterações em API/server, banco, pagamentos, App, Arcanjo, seletor, testes e Elegância Profunda. A reconciliação deve ser seletiva, sem substituição cega dos arquivos mais atuais do Natural Sereno nem perda das aprovações dos Estilos 2 e 3.
- A PR ainda aponta para base SHA `4172471`, enquanto a main atual é `783aacc`; a atualização controlada da base continua pendente.
- A cópia JPEG versionada permanece como referência do card; não foi substituída por arte nova.

**Sem merge, publicação em produção ou cobrança real.**
