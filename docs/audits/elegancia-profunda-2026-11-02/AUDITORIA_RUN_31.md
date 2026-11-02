# Auditoria — Estilo 2 Elegância Profunda — Run 31

## Corrigido / consolidado nesta rodada
- Reauditoria página por página retomada a partir das camadas exclusivas já implantadas do Estilo 2.
- Confirmado que a identidade visual proprietária continua isolada por `data-layout="elegancia-profunda"`, preservando verde profundo intencional, marfim e champagne/bronze sem recoloração global dos outros estilos.
- Confirmado que o logo permanece tratado como assinatura visual discreta/transparente na camada aprovada.
- Confirmado que o pagamento só atualiza o perfil após confirmação server-side com `status === 'paid'`.
- Confirmado que a Reintegração interrompe fala e áudio global ao abrir, reduzindo risco de sobreposição.
- Reauditado o motor de Solfeggio: `src/lib/audio.ts` sintetiza as frequências suportadas via Web Audio; para 396/528/432/639/741/852/963/417 usa base sub-harmônica (metade da frequência nominal) dentro do arranjo sintetizado. Não substituir por arquivos genéricos sem validação acústica.

## Preservado
- Correções anteriores do Diário, player, cabeçalho, modais, vídeo promocional e instalação PWA.
- Conteúdo terapêutico, navegação e lógica já aprovados.
- Regra do logo oficial sutil/transparente.
- Confirmação server-side do pagamento.
- Proteção de áudio da Reintegração.

## Pendente comprovado
1. **Seletor dos quatro estilos — prioridade estrutural:** `src/App.tsx` ainda monta `LayoutChoiceModal` apenas quando `!userProfile.visualLayout`. Uma preferência persistida continua podendo pular a escolha explícita.
2. O mesmo `App.tsx` ainda sincroniza `document.documentElement.dataset.layout` diretamente de `userProfile.visualLayout`, aplicando a preferência persistida antes de uma nova confirmação da sessão.
3. A correção correta é separar `savedVisualLayout` (pré-seleção) de `confirmedSessionLayout` (aplicação efetiva), mantendo o modal visível antes da aplicação automática. Não mascarar isso com CSS.
4. **Voz:** não substituir a voz/fallback por alias ou ID não comprovado. A voz oficial aprovada precisa de identificador real/configuração disponível no projeto.
5. **Solfeggio:** apesar da síntese estar implementada, falta validação executada/acústica no navegador e confirmação de que não há retomada indevida após iniciar protocolo/Reintegração.
6. **Player/animações:** falta validação executada desktop/mobile da micro-narrativa visual aprovada, proporção, responsividade e ausência de regressões.

## Reauditoria
- Nenhuma nova herança cromática segura para remoção foi confirmada nesta rodada além das já cobertas pelas camadas exclusivas do Estilo 2.
- Não foi feita alteração visual especulativa.
- O defeito do seletor permanece real e não deve ser considerado resolvido até a mudança de estado/fluxo em `App.tsx` ser aplicada e testada.
