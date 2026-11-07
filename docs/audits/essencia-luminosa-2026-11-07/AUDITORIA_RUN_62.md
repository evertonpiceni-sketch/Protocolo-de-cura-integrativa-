# Auditoria Run 62 — Estilo 3: CTA do dock principal

**Data:** 7 de novembro de 2026  
**Base auditada:** `6682bf0702f1fec7b6e189f631d02e138cc8e106` (branch `main`).

## Corrigido

- Encontrado no `App.tsx` o botão `#bottom-btn-specific-treatment` ainda usando gradiente verde profundo `from-emerald-950/90 to-teal-950/90`, borda esmeralda e badge verde.
- Adicionadas regras estritamente escopadas ao Estilo 3 para trocar o fundo por sálvia clara/champagne, harmonizar borda, ícone, badge e hover, sem alterar o destino ou a lógica do botão.
- Adicionado teste de regressão para esse CTA.

## Preservado

- Botão e ação continuam abrindo a Prática Individual; nenhum fluxo, preço, cupom ou pagamento foi alterado.
- Paleta ativa marfim/champagne/ouro suave/sálvia, seletor explícito, logo discreto e demais estilos.
- O gradiente legado continua disponível nos outros estilos, sem alterar suas identidades.

## Reauditoria estática

- Confirmado que Banhos de Ervas e Anamnese já importam camadas próprias do Estilo 3; a superfície dos cards de banhos é neutralizada por regra específica e a Anamnese tem overrides próprios para gradientes e botões.
- Confirmado que o CTA sistêmico já possui override; o botão de Tratamento Específico era a lacuna no mesmo dock.

## Pendente

- **CI concluído no run 42372537447:** TypeScript, 79 testes de regressão, build Vite, entrypoints Express, verificações de autenticação/segurança e endpoints de pagamento passaram. A etapa final de enforcement permanece em falha porque o `npm audit` encontrou 9 vulnerabilidades (3 moderadas e 6 altas).
- Capturas e homologação visual real página por página em desktop e celular.
- Fotografias independentes de natureza aprovadas para a Home do Estilo 3; o card do seletor continua apontando para o WebP versionado. A prancha original foi recuperada e inspecionada, mas a transferência dos bytes integrais para o repositório não foi concluída com segurança.
- Testes de voz, Solfeggio, player e animações em dispositivos; checkout InfinitePay em sandbox; correção das 9 vulnerabilidades de dependências; deploy. O status Vercel do commit auditado continua `failure` por `build-rate-limit`, portanto não há homologação de produção.
