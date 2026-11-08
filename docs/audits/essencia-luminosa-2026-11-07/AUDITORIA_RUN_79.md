# Auditoria Run 79 — Estilo 3: Essência Luminosa

Data: 07/11/2026  
Base auditada: `7a6f990b147e11de91e3854c03b4f2e3d1f9f5ba` (branch `main`)  
Escopo: seletor/identidade do Estilo 3, catálogo de acesso, guia de planos, checkout, áudio, Diário, player e componentes ativos.

## Corrigido

- Corrigido o catálogo dos acessos avulsos para os valores aprovados pelo usuário: **7 dias — R$ 25,00** e **21 dias — R$ 50,00**. O preço é calculado no servidor por `PAYMENT_PLANS`; o valor enviado pelo cliente continua sem autoridade.
- Incluído o acesso avulso de 21 dias no tipo `SubscriptionPlanType`, no checkout, no guia de planos, no resumo do perfil e na lista de assinaturas aceitas pelo painel administrativo.
- Corrigido o encaminhamento do guia: o plano clicado agora é passado ao `ProUpgradeModal` e fica pré-selecionado. Antes, a escolha do card era descartada e o modal abria com o trimestral selecionado.
- Adicionada uma camada CSS restrita a `:root[data-layout="essencia-luminosa"] #plans-values-guide-modal`, com tokens de marfim/champagne/ouro suave e botões premium. Nenhum CSS dos Estilos 1, 2 ou 4 foi alterado.
- Adicionados testes para os preços, a preservação dos valores dos acompanhamentos individuais, a opção de 21 dias, o encaminhamento do plano e o isolamento visual.

## Preservado

- O seletor continua com seleção inicialmente vazia e exige confirmação explícita antes de aplicar `data-layout`. Preferência persistida não equivale a consentimento da sessão.
- A prévia do Estilo 3 continua usando o WebP versionado `public/brand/essencia-luminosa/prancha-oficial.webp`. Não foi substituído por mockup gerado.
- Paleta, logo discreto, 22 folhas CSS do estilo, voz neural ElevenLabs, política Solfeggio, Diário, player, animações e conteúdos foram preservados.
- InfinitePay permanece como checkout e confirmação server-side. Os acessos avulsos usam o catálogo autoritativo. Os acompanhamentos individuais continuam com preços próprios de R$ 59,90 (7 dias) e R$ 99,90 (21 dias); não foram confundidos com o acesso avulso.
- Cupons PROMO15/PROMO20 e degustação VIP7 foram preservados.

## Pendências verificadas

- **Natureza na Home:** `--ep-scene: none` permanece. A paisagem gerada que está na conversa não foi incorporada ao repositório nem tratada como aprovada; o mockup com texto também não foi usado. O PNG original `1001196521.png` não foi recuperado nesta execução; o WebP versionado permanece como card.
- **Numerologia Completa:** `NumerologyModal` envia `productType: 'numerology_full'`, mas `paymentRoutes` aceita apenas `subscription` e `specific_treatment`. A tela informa R$ 90,00, porém não há preço/rota server-side correspondente no catálogo atual. Não foi criada uma cobrança nova sem decisão aprovada sobre esse produto.
- **Homologação real:** ainda faltam captura visual por página em desktop/mobile, teste de áudio em dispositivo, teste de Diário persistido em conta real e transação InfinitePay em sandbox.
- **Publicação:** o commit-base tinha status Vercel `failure` com `build-rate-limit`. O status do novo commit será conferido após o push.

## Arquivos alterados

- `src/lib/paymentCatalog.ts`
- `src/types.ts`
- `server.ts`
- `src/App.tsx`
- `src/components/ProUpgradeModal.tsx`
- `src/components/PlansValuesGuideModal.tsx`
- `src/essencia-luminosa-final-audit.css`
- `tests/payment.test.ts`
- `tests/essencia-luminosa-plans.test.ts`

## Resultado

A auditoria encontrou e corrigiu uma divergência entre o preço aprovado e o catálogo ativo, uma opção de 21 dias ausente da interface e um encaminhamento que descartava a escolha do usuário. A identidade visual foi ajustada somente no guia de planos do Estilo 3. A Home com fotografia própria e a compra isolada de Numerologia permanecem pendentes por falta de ativo/catálogo aprovado.
