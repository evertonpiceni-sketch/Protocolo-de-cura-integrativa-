# Auditoria — Estilo 3 Essência Luminosa — Run 37

## Corrigido nesta rodada
- Confirmada a regressão funcional de ownership de áudio global no `src/App.tsx`: o cálculo `shouldPlay` e o desbloqueio por gesto pausam para sessão ativa e Reintegração, mas ainda não consideram `showArcanjoView`.
- Correção segura definida para a próxima alteração atômica do `App.tsx`: acrescentar `!showArcanjoView` às duas condições e `showArcanjoView` às dependências correspondentes, sem alterar o synth/Solfeggio local do Arcanjo nem a proteção já aprovada da Reintegração.

## Preservado
- Estilo 3 permanece subordinado à prancha oficial e às decisões posteriores aprovadas.
- Logo oficial sutil/transparente como assinatura.
- Identidade clara e expansiva: marfim/champagne, ouro suave, sálvia/oliva clara/areia.
- PIX manual removido de Prática Individual e Numerologia; não reintroduzir.
- Confirmação server-side de pagamento preservada.

## Pendente
1. Aplicar a correção atômica de `showArcanjoView` no `App.tsx` quando a edição integral do arquivo puder ser feita sem risco de sobrescrever alterações concorrentes.
2. Corrigir o seletor para exigir escolha/confirmação explícita dos quatro estilos antes de aplicar preferência persistida.
3. Validar voz oficial, Solfeggio, player e animações em execução desktop/mobile.
4. Continuar varredura página por página sem reabrir decisões congeladas.

## Observação de segurança
A `main` recebeu alterações de outras auditorias durante esta janela. Nenhuma substituição integral de `App.tsx` foi feita nesta rodada para evitar regressão ou perda de mudanças concorrentes.
