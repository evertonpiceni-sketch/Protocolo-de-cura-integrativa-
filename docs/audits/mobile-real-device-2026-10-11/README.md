# Auditoria real em Android — 2026-10-11

Evidências fornecidas em aparelho Android mostraram regressões que não apareceram na auditoria estática:

- narração da Reintegração interrompendo ao sair da aba/app;
- halos dourados herdando fundo opaco e lavando textos em Numerologia e Perguntas Sistêmicas;
- contrastes e etiquetas inconsistentes em Cursos e Admin;
- símbolo decorativo `★` em PRO/VIP apesar da diretriz sem emojis/símbolos decorativos;
- scrollbars e área útil pesadas em modais mobile.

## Correções deste lote

1. `natural-sereno-mobile-fixes.css` neutraliza apenas as heranças visuais observadas, sem redesenho.
2. `noDecorativeEmojiPatch.ts` remove símbolos/emoji decorativos visíveis, preservando ícones vetoriais.
3. `backgroundMediaPatch.ts` conecta `Audio` criados dinamicamente a um dock DOM persistente antes do `play()`, para que o Chrome/Android trate a narração como mídia de documento e tenha chance de mantê-la em segundo plano.
4. `main.tsx` carrega as correções após o refinamento aprovado.

## Critério de aceite

- nenhum halo pode cobrir/clarear texto;
- nenhum emoji/símbolo decorativo visível deve permanecer;
- a fala em andamento deve continuar ao alternar para outro app e ao bloquear a tela;
- o Natural Sereno não deve ser redesenhado.

A continuidade em segundo plano precisa ser validada novamente no mesmo aparelho Android após o deploy do preview/produção, pois depende também do comportamento do Chrome/Android em execução real.
