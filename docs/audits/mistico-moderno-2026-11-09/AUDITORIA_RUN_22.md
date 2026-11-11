# Auditoria RUN 22 — Estilo 4 · Místico Moderno

Data: 09/11/2026  
Branch: `fix/mistico-moderno-run15-mainline-2026-11-09`  
Commit de código auditado: `51efff09ac9167af32a3c76bffb605225a47da25`  
PR: #77

## Corrigido

- Corrigida a abertura automática recorrente do protocolo Arcanjo: `isArcanjoViewActive` agora depende apenas de `showArcanjoView`. Uma assinatura persistida `arcanjo_7d` não reabre o protocolo em todo login.
- Preservada a entrada imediata após uma compra de 7 dias confirmada (`setShowArcanjoView(true)` no fluxo de checkout), além da navegação explícita por `OPEN_PROTOCOL_DAY` e pelo botão do painel.
- Atualizado o teste de regressão para garantir que o protocolo não abra automaticamente em sessões posteriores e que a entrada pós-compra continue disponível.
- Recuperada e inspecionada a prancha original `1001196522.png` da Library: 1536 × 1152 px, proporção 4:3. A miniatura versionada no repositório mantém 4:3 e `object-contain`; a comparação visual não mostrou recorte. A prancha é referência de atmosfera/paleta, não fonte para reintroduzir conteúdos antigos.
- O seletor continua com quatro opções, seleção inicial nula e confirmação obrigatória. O tema só é aplicado após confirmação; o acolhimento inicial permanece condicionado à escolha.
- Reconfirmados estruturalmente: voz neural ElevenLabs salva no perfil, ausência de fallback nativo no Místico Moderno, Solfeggio subordinado à narração, Diário fechado por padrão, player e preferência de movimento reduzido.

## Preservado

- Estilos 1, 2 e 3 e seus arquivos visuais aprovados.
- Jornada de 21 dias; não foi reintroduzida a menção antiga de 12 dias presente na prancha.
- Corpo neutro; não foi copiada a silhueta corporal da prancha para a experiência.
- Logo oficial discreto/transparente (30% desktop e 26% mobile), subordinado à arte.
- Conteúdos, dados, player e decisões aprovadas.
- InfinitePay, preços, cupons, checkout, webhook e validação server-side. Nenhum arquivo de pagamento foi alterado.

## Reauditoria técnica

GitHub Actions **Security Audit #2110**: sucesso.

- **177 testes aprovados; 0 falhas**.
- `npm audit`: 0 vulnerabilidades.
- TypeScript e build aprovados.
- Entry points Vercel, verificações JWT/admin, smoke test e endpoints de pagamento fail-closed aprovados.

## Pendente

1. **Homologação visual:** não há deployment/preview para o HEAD atual `51efff0`. A última implantação registrada na branch (commit anterior `d595aeda`) falhou com `BUILD_FAILED — Resource provisioning failed`; o comentário do Vercel também informou limite diário de mais de 100 deployments. Nenhuma nova implantação foi forçada.
2. **12 superfícies:** falta inspeção renderizada em desktop e celular; a varredura disponível é estrutural, não homologação visual.
3. **Imagens:** `public/brand/human-chakra-model.jpg` é uma ilustração digital estilizada, não fotografia realista. Foi preservada por não haver substituta fotográfica aprovada; não reutilizei imagens rejeitadas ou de outros estilos.
4. **Áudio:** falta teste auditivo em dispositivo real com a voz salva, incluindo início, pausa, retomada e encerramento do Solfeggio.
5. **Pagamento:** falta homologação controlada de checkout e webhook InfinitePay em sandbox. Nenhuma cobrança real foi feita.

## Estado

- PR #77 permanece aberto e em rascunho.
- Branch: 32 commits à frente e 0 atrás da `main` na verificação deste relatório.
- Sem merge e sem publicação em produção.

Conclusão: a correção da abertura recorrente do Arcanjo foi aplicada e coberta por regressão. A base técnica passou no CI; a conclusão do Estilo 4 ainda depende de homologação visual, auditiva e financeira.
