# Auditoria incremental — Estilo 3 · Essência Luminosa — Run 20

Referência oficial: prancha `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`, sempre subordinada às decisões posteriores aprovadas.

## Corrigido
- Encontrado em Configurações um resíduo `emerald` no badge de estado positivo da Anamnese (`Ficha Preenchida`).
- A camada isolada `essencia-luminosa-approved-overrides.css` agora converte somente no Estilo 3 os utilitários `text/bg/border-emerald-*` para o acento `--layout-accent` (sálvia/oliva clara) e suas misturas suaves.
- Não houve recoloração global nem alteração dos outros estilos.

## Preservado
- Marfim/champagne/ouro suave e acentos naturais do Estilo 3.
- Logo oficial em baixa opacidade como assinatura visual (30% desktop / 26% mobile).
- Player, Diário e Pausa mantidos na camada aprovada.
- Proteção de áudio: música global para durante sessão/Reintegração; Reintegração interrompe fala e BG ao abrir.
- Pagamento: confirmação server-side permanece antes de atualizar o perfil.

## Pendente comprovado
- `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`; perfil com estilo persistido pode pular a escolha explícita. A correção correta continua sendo separar preferência persistida (pré-seleção) de confirmação obrigatória de entrada. Não mascarar com CSS.
- Voz: ainda existem aliases/fallbacks legados `Rachel` em backend/engine/componentes. Não substituir sem o identificador oficial comprovado da voz aprovada.
- Continuar validação executada de Solfeggio, player e animações em desktop/mobile.

## Reauditoria
- O override novo está estritamente limitado a `:root[data-layout="essencia-luminosa"] #settings-view`.
- Nenhum conteúdo terapêutico, lógica de pagamento ou outro estilo foi modificado nesta rodada.
