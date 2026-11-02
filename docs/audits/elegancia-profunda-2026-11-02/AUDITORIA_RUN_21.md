# Auditoria — Estilo 2 Elegância Profunda — Run 21

## Corrigido
- Varredura do modal de boas-vindas confirmou heranças claras/genéricas ainda presentes no componente proprietário: palco `#FBF8F2`, cards `bg-white`, controle `#F5EFE4` e CTA emerald/amber genérico.
- Criada `src/elegancia-profunda-welcome-audit.css`, estritamente isolada por `data-layout="elegancia-profunda"`.
- O modal agora usa superfícies profundas, bordas champagne/douradas, tipografia coerente e CTA premium champagne/bronze com verde profundo integrado apenas como parte intencional do Estilo 2.
- A camada foi importada diretamente pelo `WelcomeModal.tsx`, evitando impacto nos outros estilos.

## Preservado
- Conteúdo e lógica do modal de boas-vindas.
- Identidade e camadas já aprovadas do Estilo 2.
- Logo oficial como assinatura sutil/transparente nas áreas já tratadas.
- Reintegração mantém bloqueio de sobreposição: ao abrir, `audioEngine.stopSpeech()` e `audioEngine.stopBG()` continuam ativos.
- Pagamento mantém confirmação server-side e só atualiza perfil quando `/api/payment/confirm` retorna `status === 'paid'`.
- Nenhuma alteração em conteúdo terapêutico, Diário, player, animações ou demais estilos sem regressão comprovada.

## Pendente comprovado
- `src/App.tsx` ainda monta `LayoutChoiceModal` somente sob `!userProfile.visualLayout`; perfil com preferência persistida pode pular a escolha explícita. A correção correta continua sendo separar preferência persistida (pré-seleção) da confirmação obrigatória na entrada, sem apagar a preferência salva e sem mascarar por CSS.
- Voz: não substituir aliases/fallbacks legados sem identificador oficial comprovado da voz aprovada.
- Continuar validação executada de Solfeggio, player e animações em desktop/mobile.
