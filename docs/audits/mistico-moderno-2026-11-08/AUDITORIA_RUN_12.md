# Auditoria — Estilo 4 · Místico Moderno — Run 12 (complemento)

**Data:** 08/11/2026  
**Branch:** `fix/mistico-moderno-current-main-2026-11-08-run12`  
**Base:** `main` atual, sem alterações nos outros estilos.  
**Referência visual oficial:** `1001196522.png` — recuperada da Biblioteca e inspecionada em **1536 × 1152 px (4:3)**.

## Corrigido

- A paleta do seletor foi reconciliada com a prancha: azul-noturno, índigo, esmeralda, violeta, dourado, âmbar, marfim e verde natural apenas como acento integrado à natureza. O cartão do Estilo 4 agora usa superfície noturna e texto marfim, sem herdar o cartão branco dos outros estilos.
- O player do Arcanjo não liga o Solfeggio antecipadamente ao retomar: no Místico Moderno, a frequência volta somente pelo evento real de reprodução da mídia neural (`onStart`). Pausa, erro, reinício, troca de dia, conclusão e saída continuam interrompendo o oscilador.
- O encerramento da Anamnese não reinicia 639 Hz durante o fechamento; a retomada da frequência permanece apenas para a pausa/encerramento normal da narração enquanto a tela continua aberta.
- Home, player principal, Ajustes de Áudio, Arcanjo e práticas legadas continuam exigindo o ID neural salvo no perfil. ID ausente/inválido gera aviso; não há fallback para voz robótica/local nem troca silenciosa por voz presumida.
- Camadas de boas-vindas e Arcanjo permanecem carregadas e escopadas ao Místico Moderno.

## Varredura estática por superfície

A prancha apresenta 12 quadros de referência, conferidos como mapa de superfícies: **1)** splash/carregamento; **2)** boas-vindas com áudio; **3)** página inicial; **4)** menu principal; **5)** lista da jornada; **6)** player do dia; **7)** anamnese/teste; **8)** resultado; **9)** biblioteca integrativa; **10)** ferramentas de apoio; **11)** comunidade; **12)** perfil.

- O seletor continua com quatro opções sem pré-seleção; confirmar fica indisponível até uma escolha explícita. O tema só é aplicado após confirmação da sessão e o logout limpa a confirmação anterior.
- Os **24 módulos CSS Místico** importados no ponto de entrada (22 camadas existentes + boas-vindas + Arcanjo) permanecem isolados por `data-layout="mistico-moderno"`; a varredura anterior contabilizou **303 seletores**, sem seletor global indevido.
- Diário fechado por padrão; conteúdo, callbacks e persistência não foram reescritos. Canvas e Diário respeitam `prefers-reduced-motion`.
- Logo oficial preservado como assinatura transparente: **30% desktop / 26% mobile**.
- Nenhum arquivo de pagamento foi alterado. InfinitePay, catálogo vigente, cupons, confirmação server-side do valor exato, idempotência e comportamento fail-closed permanecem preservados.

## Preservado

- Conteúdo terapêutico, roteiros, jornadas, dados e fluxos aprovados.
- Estilos 1, 2 e 3 sem redesenho ou alteração de paleta.
- Escolha explícita dos quatro estilos, Diário, player, animações e política de áudio.
- InfinitePay e controles de segurança de pagamento; nenhuma cobrança real foi executada.

## Pendente

1. A prancha original foi localizada e inspecionada, mas **o PNG binário ainda não foi incorporado à árvore GitHub** nesta execução. Não reutilizei a derivação antiga de baixa resolução nem inventei substituto; o seletor mantém a prévia de paleta, agora alinhada à prancha. A incorporação literal do quadro 1536 × 1152 e sua exibição dentro do cartão continuam pendentes.
2. A homologação renderizada página a página em desktop/mobile depende de preview navegável. Em **08/11/2026**, a tentativa Vercel foi bloqueada pelo limite diário de deployments (`api-deployments-free-per-day`); por isso não declaro comparação visual real nem publicação.
3. Permanecem pendentes audição física da voz neural salva, reprodução/pausa/retomada do Solfeggio e teste do player/animações em navegador real.
4. Falta validar a persistência do Diário em sessão real de navegador.
5. Falta a homologação controlada do checkout/webhook InfinitePay com credenciais válidas. Não foi presumido sandbox transacional e nenhuma cobrança real foi feita.

## Reauditoria automatizada

GitHub Actions **Security Audit #1825** (commit anterior à presente correção): `npm audit`, TypeScript, testes de regressão, build, entrypoints, smoke tests e verificações fail-closed dos endpoints de pagamento concluídos com sucesso. A nova correção aguarda sua própria execução de CI. Vercel segue bloqueado pelo limite diário citado acima.

**Status:** PR em rascunho, sem merge e sem publicação em produção. A referência visual foi recuperada; a integração binária literal e a homologação renderizada continuam pendentes.
