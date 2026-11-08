# Auditoria Run 91 — Estilo 3: Essência Luminosa

Data: 2026-11-08  
Branch auditada: `main`  
HEAD observado: `e955ee5724ef204450433d8f22eb2d192470cf46`

## Resultado

Não foi necessário criar novo override de código nesta rodada. As correções de benefício do Semestral/Anual e o reset da escolha ao reabrir o checkout já estão no histórico atual de `main`. Evitei duplicar CSS ou alterar componentes aprovados sem evidência de regressão.

## Corrigido / confirmado no HEAD atual

- A referência original foi recuperada na Biblioteca: `1001196521(1).png`, file ID `file_0000000019d0820eb7a70b6c982619d6`.
- `LayoutChoiceModal.tsx` usa `/brand/essencia-luminosa/prancha-oficial.webp` como prévia do Estilo 3; o arquivo existe no repositório. A prancha permanece card/referência, não fundo de página.
- A paleta ativa continua subordinada às decisões posteriores: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B` e ouro escuro `#A87E37`. As cores impressas na prancha não substituem esses tokens atuais.
- O logo continua sutil: opacidade de 30% no desktop e 26% em telas pequenas; wrappers da assinatura ficam transparentes, sem borda ou sombra dominante.
- A escolha dos quatro estilos permanece explícita: seleção inicial nula, confirmação desabilitada sem escolha e aplicação condicionada à confirmação na sessão.
- Semestral e Anual agora exigem escolha explícita entre Mapa Astral Completo e Numerologia Completa. O servidor valida a opção, registra-a no pedido, concede somente o benefício selecionado após confirmação do pagamento e protege o campo contra alteração via sincronização do perfil.
- A escolha de benefício e o erro do checkout são reiniciados ao abrir uma nova sessão do modal.
- O checkout da Essência Luminosa já possui overrides próprios em `essencia-luminosa-final-audit.css`; os valores continuam derivados do catálogo de pagamento.
- Foram revisadas 17 folhas CSS importadas diretamente por `main.tsx`, além dos componentes de seletor, Home, checkout, Mapa Astral, Ajustes de Áudio, player, Diário e Reconexão.

## Preservado

- Prancha oficial como referência do card.
- Paleta posterior aprovada e isolamento por `data-layout="essencia-luminosa"`.
- Escolha explícita dos quatro estilos.
- Logo como assinatura transparente.
- Voz neural, política Solfeggio, Diário, player e animações.
- Fluxos InfinitePay e preços do catálogo.
- Identidades dos Estilos 1, 2 e 4; nenhum arquivo desses estilos foi alterado nesta rodada.

## Pendente

- A Home ainda declara `--ep-scene: none`. Não há no repositório uma fotografia independente aprovada para ser usada como fundo. A prancha é uma composição de telas e não deve ser recortada/reutilizada como fotografia de fundo.
- Comparação pixel a pixel entre o PNG original da Biblioteca e o WebP versionado não foi executada.
- Homologação visual real em navegador, desktop e celular.
- Testes de execução real de voz, Solfeggio, Diário e player.
- Teste de checkout InfinitePay em sandbox.
- CI do HEAD atual não foi confirmado nesta rodada: a consulta de workflow runs não retornou execução associada ao HEAD. O status combinado disponível aponta falha Vercel `build-rate-limit`; isso não comprova falha de código, mas impede declarar build/publicação homologados.

## Histórico relevante já presente em main

- `6e631f2bf89a856ea152a0fedce3702bc5c3b1a7` — escolha e persistência do benefício Semestral/Anual.
- `ca35e3f4cf01da80c020f330e05324ed4501589d` — regressão de checkout e benefício.
- `fd1ab71810774411d1f2eff869abaeca93de7eeb` — reset da escolha ao reabrir o modal.
- `e955ee5724ef204450433d8f22eb2d192470cf46` — HEAD observado durante esta auditoria (teste de isolamento do checkout do Estilo 2).

## Conclusão

A pendência de escolha de benefício registrada na Run 89 foi resolvida no histórico atual. A principal pendência do Estilo 3 continua sendo a fotografia própria da Home e a homologação visual/funcional em execução real. Nenhuma decisão aprovada foi alterada nesta rodada.
