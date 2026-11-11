# Auditoria RUN 158 — Estilo 1: Natural Sereno

**Data:** 10/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79

## Corrigido nesta rodada

1. **Shell inicial e PWA:** o HTML ainda entregava `#F8F4EC` como `theme-color` e fundo inicial, enquanto o efeito React já usava `#FAF7F2`. Alinhei `index.html` e `public/manifest.json` ao canvas creme aprovado `#FAF7F2`, ao texto `#2A2421` e ao acento de máscara `#A87E37`. Isso evita a cor antiga no primeiro paint e na instalação PWA.
2. **Teste de referência:** `tests/natural-sereno-layout-reference.test.ts` ainda esperava `#F8F4EC` no efeito do navegador, embora `App.tsx` já usasse `#FAF7F2`. Atualizei a expectativa e acrescentei proteção para HTML e manifest.
3. **Cobertura da Home ativa:** `tests/natural-sereno-active-home-reintegration.test.ts` estava chamando de “Home ativa” verificações da ramificação antiga `.ep-home` do `TransformationHome`. Para Natural Sereno, a ramificação montada é `NaturalSerenoHome` (`.ns-app`, `.ns-home-scene`, `.ns-home-content`). Substituí as verificações antigas por testes do componente realmente montado, dos assets de natureza, do enquadramento responsivo desktop/mobile, do acolhimento, da assinatura do logo e dos CTAs `.ns-gold`.

**Commits desta rodada:**
- `a7ccbbc` — shell HTML inicial;
- `6ff4d7e` — cores do manifest PWA;
- `53a2fbe` — teste do seletor/referência e shell;
- `24ed5ba` — testes da Home ativa.

## Preservado

- Seletor obrigatório dos quatro estilos, sem pré-seleção e com confirmação explícita antes de definir `data-layout`.
- Prancha Natural Sereno mantida como referência visual no card, sem recorte; as decisões posteriores continuam prevalecendo sobre o verdão, o amarelo forte, o corpo com chakras e os botões antigos presentes na prancha.
- Home ativa usa `NaturalSerenoHome`; paisagem principal `vale-amanhecer.webp), acolhimento `acolhimento.webp), enquadramentos responsivos e superfícies creme/café/dourado.
- Logo oficial permanece como assinatura discreta, com opacidade reduzida.
- Reintegração da Vida mantém corpo neutro, movimento da luz, player e animações; a marca permanece sutil.
- Marianne/ElevenLabs permanece configurada no fluxo neural; o player da Reintegração não usa fallback nativo silencioso.
- Política de Solfeggio impede frequência tonal durante carregamento/reprodução de voz; a narração do Arcanjo interrompe e retoma a frequência conforme pausa/término/falha.
- Diário salva perfil e progresso no mesmo payload ao registrar a entrada; a fila de sincronização é serializada por conta.
- InfinitePay permanece fail-closed: API Key obrigatória, pagamento único, autenticação, conferência server-side do valor e proteção contra duplicidade.
- Estilos 2, 3 e 4 não foram alterados.

## Pendências e bloqueios confirmados

- **CI:** nenhuma execução GitHub Actions associada ao HEAD desta rodada. O workflow `Security Audit` contém `npm ci`, TypeScript, testes, build e smoke test, mas não há resultado para o novo HEAD. A tentativa de clonar o repositório para execução local foi bloqueada por indisponibilidade de DNS/rede neste ambiente; não declaro testes aprovados.
- **Vercel:** projeto informa `live=false`. O último deployment conhecido da branch Natural Sereno foi o commit `cc5606d`, com `ERROR / BUILD_FAILED — Resource provisioning failed`; não há deployment para o HEAD desta rodada e não há Preview READY. Os eventos de build disponíveis vieram vazios.
- **InfinitePay:** `INFINITEPAY_API_KEY` não aparece no inventário de variáveis do projeto. `INFINITEPAY_HANDLE` está somente em Production e `PUBLIC_APP_URL` não está configurada para a branch Preview atual. Não há sandbox de pagamento pronto; nenhuma cobrança foi feita.
- **Áudio real:** configuração de Marianne e política de Solfeggio conferidas no código, mas falta ouvir a voz e validar a transição em navegador/dispositivo.
- **QA renderizado:** falta inspeção visual página por página em desktop e mobile, teste ponta a ponta do Diário e comparação pixel a pixel com a imagem original.
- **Endpoint público de voz da Reintegração:** continua limitado a cues pré-aprovadas e rate limit por IP, sem autenticação geral. Mantido para não quebrar o fluxo local/offline; a política de autenticação deve ser revista antes de ampliar o uso público.

## Referência visual

A busca da Library não resolveu o ID exato `file_00000000317c820ebaad657dc3680de5` nesta execução. Foi localizada e inspecionada uma cópia da prancha intitulada `Painel UX_UI Natural Sereno.png`, visualmente correspondente ao card descrito; o repositório mantém a derivação `docs/visual-qa/natural-sereno/reference.jpg`. Não substituí a prancha por outra referência.

## Estado

PR #79 permanece aberta e em rascunho. Não foi feito merge, publicação em Production, alteração de credenciais ou pagamento real. A branch continua divergente da `main`; a reconciliação deve ser seletiva, sem recuperar comportamentos rejeitados.
