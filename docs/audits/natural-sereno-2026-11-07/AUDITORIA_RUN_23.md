# Reauditoria — Estilo 1: Natural Sereno
**Data:** 07/11/2026  
**Branch:** `fix/natural-sereno-visual-audit-2026-11-07-v2`  
**PR:** #55

## Corrigido nesta rodada
- Corrigido um vazamento de escopo no botão de autenticação: o raio de 18 px agora só é aplicado quando `data-layout="natural-sereno"`. Os outros três estilos não recebem essa regra.
- Corrigido um defeito funcional no checkout da Numerologia: a tela enviava `productType: numerology_full`, mas o servidor aceitava apenas assinatura e prática específica, rejeitando a compra. A rota agora aceita o produto, calcula no servidor o valor fixo de **R$ 90,00**, ignora preço informado pelo cliente, não aceita cupom/valor personalizado e impede checkout duplicado quando o acesso já está liberado.
- A confirmação da Numerologia só marca `numerologyPurchased: true` depois de o provedor confirmar pagamento efetivo e valor exato. A compra não transforma a conta em PRO; libera somente o mapa completo.
- Acrescentados testes de regressão para isolamento do botão de autenticação, preço autoritativo, confirmação/valor incorreto, liberação de entitlement e prevenção de compra duplicada.

## Preservado e revalidado no código
- O seletor continua explícito, sem estilo pré-selecionado, e exige confirmação antes de aplicar o tema. As quatro opções permanecem disponíveis.
- A prancha oficial do Natural Sereno continua vinculada à prévia por meio de `docs/visual-qa/natural-sereno/reference.jpg`; as decisões posteriores de paleta prevalecem sobre detalhes antigos da prancha.
- Home e acolhimento mantêm fotografia realista e enquadramento responsivo; a camada aprovada usa creme/marfim, café e dourado refinado, com verde-sálvia apenas em acentos semânticos.
- O logo oficial permanece como assinatura discreta, com opacidade aprovada de 30% e redução adicional no mobile.
- A voz oficial neural está identificada no catálogo como **Marianne — Meditação**. O ID ElevenLabs válido salvo pelo usuário é preservado; o ID oficial é usado como fallback canônico e o Natural Sereno não recorre à síntese de voz do navegador.
- Durante a fala do protocolo, frequências Solfeggio não são reiniciadas como trilha simultânea; ambiência não tonal continua permitida.
- Diário, player, seis etapas animadas, respeito a `prefers-reduced-motion`, checkout de assinatura e Prática Específica foram preservados.
- O componente legado `naturalSerenoHomeApprovedModel.ts` permanece porque contém lógica de estado e atualização da Home. Seus estilos visuais antigos estão subordinados aos overrides finais de maior especificidade; removê-lo integralmente exigiria separar lógica e apresentação e não é necessário para esta correção pontual.

## Pendente
- A execução `1499` (commit de código `dd6941e`) aprovou TypeScript, **113/113 testes**, build, entrypoints, verificações de segredo/JWT/autenticação, smoke tests e endpoints de pagamento. Falhou somente no gate `npm audit`, ainda com **9 vulnerabilidades (3 moderadas e 6 altas)**. O commit mais recente `86d6619` acrescenta apenas este relatório, sem alterar código.
- Homologação renderizada página por página em navegador desktop/mobile continua pendente. O status Vercel do branch permanece em falha por limite diário de deployments (`api-deployments-free-per-day`); não há captura atual do branch.
- Reprodução real da voz e da ambiência ainda precisa ser ouvida no navegador.
- O checkout foi coberto por testes com provedor simulado; ainda falta teste de ponta a ponta em ambiente de teste da InfinitePay, sem cobrança real.

**Status:** duas regressões objetivas corrigidas nesta rodada (escopo visual e checkout da Numerologia). O Estilo 1 permanece sem homologação integral até CI atual, validação visual/auditiva e checkout de teste.
