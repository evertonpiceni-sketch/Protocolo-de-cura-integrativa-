# Auditoria — Estilo 3 Essência Luminosa — Run 28

Referência visual oficial: prancha Estilo 3 (`1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`), subordinada às decisões aprovadas posteriores. Aprovado = congelado; reprovado/substituído/não usar = descartado.

## Corrigido
- A varredura página por página chegou à **Prática Individual** (`#specific-treatment-modal`) e confirmou heranças fortes de `emerald`, `indigo` e `amber` escuro no sucesso, badges, preço, planos, imagem/legenda e CTAs.
- `src/essencia-luminosa-final-audit.css` agora neutraliza essas heranças somente quando `data-layout="essencia-luminosa"` está ativo.
- A superfície passa a marfim/champagne; estados positivos usam sálvia/oliva clara; destaques usam ouro suave; CTAs permanecem contrastados e premium.
- Inputs/selects/textarea receberam superfície e foco coerentes com o Estilo 3.
- A Prática Individual foi incluída na proteção de nitidez tipográfica.

## Preservado
- Logo oficial permanece assinatura sutil/transparente.
- Header, Boas-vindas, Diário, Diário de Reconexão, Mapa Astral, Numerologia, Contato e Apresentação permanecem congelados.
- Não houve recoloração global nem alteração dos Estilos 1, 2 ou 4.
- O backend de pagamento permanece apontando para InfinitePay com handle padrão `evertonterapeutareiki`, checkout HTTPS e confirmação server-side antes da liberação.

## Pendente comprovado
1. **Seletor dos quatro estilos:** `App.tsx` ainda monta `LayoutChoiceModal` apenas sob `!userProfile.visualLayout`; preferência persistida ainda pode pular a escolha explícita.
2. **Pagamento / Prática Individual:** o componente ainda contém `handleCopyPix()` que copia `evertonpiceni@gmail.com` ao selecionar PIX. Isso é herança de PIX manual e conflita com o fluxo oficial InfinitePay; deve ser removido na origem, preservando PIX apenas como método solicitado ao checkout InfinitePay.
3. **Voz:** não substituir por ID presumido; falta validação do identificador oficial escolhido.
4. **Solfeggio/player/animações:** ainda exigem validação executada em desktop e mobile para confirmar ausência de sobreposição e regressões visuais.

## Reauditoria
- Correção desta rodada está restrita a `:root[data-layout="essencia-luminosa"] #specific-treatment-modal`.
- Nenhuma lógica terapêutica, conteúdo aprovado ou regra de confirmação server-side foi alterada.
