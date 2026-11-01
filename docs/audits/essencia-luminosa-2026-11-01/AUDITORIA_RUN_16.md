# Auditoria — Estilo 3 Essência Luminosa — Run 16

Referência oficial: prancha Estilo 3 (`1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`), subordinada às decisões aprovadas posteriores. Aprovado = congelado; reprovado/substituído/não usar = descartado.

## Corrigido
- `LayoutChoiceModal` deixou de aplicar o estilo no primeiro clique do card.
- A escolha agora é em duas etapas: selecionar a prévia e confirmar explicitamente o estilo.
- O botão de confirmação fica desabilitado até existir seleção e identifica nominalmente o estilo escolhido.
- Mantidas as quatro prévias oficiais e adicionados estado selecionado/`aria-pressed` e indicação visual clara.
- Commit funcional: `93c014294e9024256808f6f8a071e091f232afcb`.

## Preservado
- Estilo 3 continua claro, leve e expansivo, sem nova recoloração global.
- Camada aprovada do Essência Luminosa, player, Diário, Pausa e Configurações não foram alterados nesta rodada.
- Logo oficial permanece assinatura sutil/transparente; não foi fortalecido nem reposicionado.
- Fluxo de pagamento server-side não foi alterado.
- Conteúdo terapêutico, animações e lógica de jornada não foram modificados sem regressão comprovada.

## Pendente confirmado
- `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`. Assim, perfis que já possuem `visualLayout` persistido podem continuar pulando o modal. A correção definitiva precisa separar `visualLayout` persistido (pré-seleção) de uma confirmação de estilo por sessão/entrada.
- A alteração estrutural em `App.tsx` não foi feita nesta rodada porque o conector disponível substitui o arquivo inteiro e o arquivo é grande; aplicar uma reconstrução parcial criaria risco de perda/regressão. Não mascarar com CSS.
- Voz: manter pendente a remoção de aliases/fallbacks antigos até existir identificação oficial verificável da voz aprovada; não inventar ID.
- Solfeggio/player/animações: continuar validação executada das transições, especialmente entrada/saída de sessão e Reintegração.

## Reauditoria
- Releitura do `LayoutChoiceModal` após commit confirmou que `onSelect` só é chamado pelo botão final de confirmação, nunca pelo clique de prévia.
- Nenhuma herança cromática nova foi introduzida no Estilo 3 nesta correção.