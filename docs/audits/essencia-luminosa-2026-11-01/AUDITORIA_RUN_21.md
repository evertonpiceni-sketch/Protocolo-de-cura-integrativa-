# Auditoria incremental — Estilo 3 · Essência Luminosa — Run 21

Referência visual oficial: prancha Estilo 3 (`1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`), subordinada às decisões aprovadas posteriores. Aprovado = congelado; reprovado/substituído/não usar = descartado.

## Corrigido
- A varredura do header confirmou duas heranças cromáticas ainda ativas no componente-base: botão Arcanjo em azul (`blue-*`) e CTA de instalação em esmeralda (`emerald-*`).
- `src/essencia-luminosa-final-audit.css` agora neutraliza exclusivamente esses dois IDs sob `data-layout="essencia-luminosa"`, usando superfície clara, borda champagne/ouro suave, texto secundário e ícone dourado.
- Função, conteúdo, responsividade e hierarquia dos botões foram preservados.

## Preservado
- Logo oficial permanece assinatura sutil/transparente: 30% desktop e 26% mobile.
- Identidade marfim/champagne/ouro suave e acentos naturais do Estilo 3.
- Diário, player, Pausa, Configurações, conteúdo terapêutico e demais estilos.
- Proteção contra sobreposição de áudio da Reintegração.
- Pagamento com confirmação server-side antes da atualização do perfil.

## Pendente
- `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`; perfil com estilo persistido pode pular a escolha explícita. A confirmação interna do modal já existe, mas a montagem precisa ser separada da preferência persistida.
- Voz: não substituir aliases/fallbacks legados sem identificador oficial comprovado da voz aprovada.
- Continuar validação executada de Solfeggio, player e animações em desktop/mobile.

## Reauditoria
- O novo override está restrito a `#main-header #header-btn-archangel` e `#header-btn-google-play` dentro do Estilo 3.
- Nenhuma regra global, conteúdo, pagamento ou outro estilo foi alterado.
- Próxima intervenção estrutural prioritária continua sendo o fluxo de confirmação de estilo em `App.tsx`.