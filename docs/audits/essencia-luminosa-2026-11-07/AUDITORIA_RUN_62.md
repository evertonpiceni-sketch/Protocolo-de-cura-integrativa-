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

- Teste de regressão/build desta rodada aguardando CI.
- Capturas e homologação visual real página por página em desktop e celular.
- Fotografias independentes de natureza aprovadas para a Home do Estilo 3; o card do seletor continua apontando para o WebP versionado porque a tentativa de transferir o PNG original não retornou bytes binários íntegros.
- Testes de voz, Solfeggio, player e animações em dispositivos; checkout InfinitePay em sandbox; segurança de dependências e deploy.
