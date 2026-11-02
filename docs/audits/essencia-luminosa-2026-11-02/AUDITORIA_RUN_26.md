# Auditoria — Estilo 3 Essência Luminosa — Run 26

Referência oficial: prancha Estilo 3 `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`, subordinada às decisões aprovadas posteriores. Aprovado = congelado; reprovado/substituído/não usar = descartado.

## Corrigido
- Varredura do Mapa Astral confirmou herança `emerald` ainda ativa no halo decorativo, em Ervas & Aromas, no feedback de salvamento e no CTA de contato.
- `src/essencia-luminosa-final-audit.css` agora neutraliza essas ocorrências exclusivamente sob `data-layout="essencia-luminosa" + #astral-map-modal`, usando sálvia/oliva clara, superfície luminosa e ouro suave.
- O CTA de contato mantém contraste branco e função, mas deixa de usar o verde escuro legado.
- O Mapa Astral foi incluído na regra de nitidez tipográfica do Estilo 3.

## Preservado
- Logo oficial permanece sutil/transparente como assinatura; sem aumento de contraste ou protagonismo.
- Paleta marfim/champagne/ouro suave e acentos naturais do Estilo 3.
- Correções anteriores de header, boas-vindas, Diário e JournalLog.
- Conteúdo, cálculos e lógica do Mapa Astral não foram alterados.
- Pagamento permanece com confirmação server-side antes de atualizar o perfil.
- Nenhuma recoloração global foi aplicada aos outros estilos.

## Pendente comprovado
1. **Seletor dos quatro estilos:** `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`; perfil com preferência persistida pode pular a escolha explícita. A correção deve separar preferência persistida (pré-seleção) de confirmação obrigatória na entrada, sem apagar a preferência salva e sem mascarar via CSS.
2. **Voz:** não substituir aliases/fallbacks legados sem identificador oficial comprovado da voz aprovada.
3. **Solfeggio/player/animações:** continuar validação executada em desktop/mobile antes de alterar lógica aprovada.
4. Continuar a varredura página por página de ocorrências cromáticas restantes, distinguindo herança visual de estado semântico.

## Reauditoria
- Escopo da correção: somente `:root[data-layout="essencia-luminosa"] #astral-map-modal`.
- Nenhum componente-base ou conteúdo terapêutico foi reescrito nesta rodada.
- Commit da correção visual: `9fb678015bab9fa5b419e0aa99b2926e5e574549`.
