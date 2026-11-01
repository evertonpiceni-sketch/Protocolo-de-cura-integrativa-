# Auditoria — Estilo 2 Elegância Profunda — Run 14

## Corrigido
- Varredura do Guia de Banhos confirmou herança clara ainda ativa em `HerbalBathsModal.tsx`: palco `#FBF8F2`, cards/campos `bg-white`, superfícies `#F5EFE4` e bordas claras.
- Criada `src/elegancia-profunda-herbal-baths-audit.css`, estritamente isolada por `:root[data-layout="elegancia-profunda"] #herbal-baths-modal`.
- Superfícies neutras do Guia de Banhos agora seguem canvas/surface profundos, borda champagne/dourada, texto e muted do Estilo 2, busca e botões com acabamento premium.
- Estados semânticos amber/emerald/rose foram deliberadamente preservados; não houve recoloração global.
- A nova camada foi importada em `src/main.tsx` após as camadas específicas já aprovadas do Estilo 2.

## Preservado
- Identidade Elegância Profunda e isolamento por `data-layout`.
- Logo oficial como assinatura sutil/transparente; nenhuma regra de logo foi alterada.
- Correções anteriores de cabeçalho, Configurações/Solfeggio, player, Diário, modal de dia, Chakras e Contato.
- Proteção da Reintegração que interrompe áudio global/fala enquanto a jornada está aberta.
- Confirmação de pagamento server-side em `/api/payment/confirm`.
- Conteúdo ritual e avisos de segurança dos banhos; somente apresentação visual foi corrigida.

## Pendente confirmado
1. `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`; perfis com estilo persistido podem pular a escolha explícita. A correção deve ocorrer no estado/fluxo e não por CSS.
2. Voz: não substituir aliases/fallbacks por ID não comprovado.
3. Solfeggio, voz, player e animações ainda precisam de validação executada/renderizada para aceite final.
4. Continuar varredura página por página dos modais restantes, removendo somente heranças comprovadas e preservando estados semânticos.
