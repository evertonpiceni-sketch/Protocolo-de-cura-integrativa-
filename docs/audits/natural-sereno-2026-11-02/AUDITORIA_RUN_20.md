# Auditoria — Estilo 1 Natural Sereno — Run 20

## Corrigido
- Corrigida a sobreposição de áudio global durante a experiência Arcanjo/Solfeggio sem alterar o conteúdo aprovado do protocolo.
- Criado `src/lib/arcanjoAudioOwnershipPatch.ts`: enquanto a tela completa do protocolo está montada, qualquer tentativa do player global de reiniciar `startBG()` é bloqueada e o background global é interrompido.
- A proteção cobre também o reinício provocado pelo desbloqueio de áudio por gesto do navegador, que era um dos caminhos confirmados de regressão.
- Patch ativado em `src/main.tsx`, imediatamente após a camada de integridade de áudio.

## Preservado
- Narração e sintetizador/Solfeggio próprios do protocolo não são alterados pelo guard.
- Natural Sereno permanece com as camadas aprovadas carregadas na ordem vigente; `natural-sereno-approved-overrides.css` continua por último entre as camadas temáticas.
- Logo oficial discreto/transparente, Diário, player, conteúdo terapêutico e confirmação server-side de pagamento permanecem intactos.
- Numerologia já usa `/api/payment/create-checkout` e não contém mais o fluxo manual de PIX identificado em auditorias anteriores; não reintroduzir.

## Pendente
1. `src/App.tsx`: incorporar futuramente a mesma regra de ownership diretamente no cálculo `shouldPlay`, incluindo `showArcanjoView`, para eliminar a necessidade do guard de compatibilidade.
2. Seletor dos quatro estilos: ainda requer correção estrutural para que preferência persistida seja somente pré-seleção e a escolha explícita apareça antes de aplicar o estilo.
3. Continuar validação renderizada página por página de paisagens, tipografia, botões e responsividade desktop/mobile; não alterar telas já congeladas sem regressão comprovada.

## Reauditoria
- `src/lib/arcanjoAudioOwnershipPatch.ts` reaberto após gravação: bloqueia apenas `startBG` enquanto o marcador exclusivo da tela Arcanjo está presente e chama `stopBG` quando a tela entra no DOM.
- `src/main.tsx` reaberto após gravação: import do guard confirmado.
