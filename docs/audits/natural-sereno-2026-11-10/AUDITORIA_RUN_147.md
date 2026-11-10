# Auditoria RUN 147 — Estilo 1: Natural Sereno

Data: 2026-11-10  
Repositório: `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
Branch: `fix/natural-sereno-mainline-run111-2026-11-09`  
HEAD após as correções: `20ac586a818e6d72e56a64080037c387f4a0438c`  
PR: #79

## Corrigido

A revisão da tela do Arcanjo identificou pequenos acentos antigos que permaneciam fora dos painéis já neutralizados:

- Texto amarelo `#f0d989` no botão “Ler roteiro completo”.
- Fundo amarelo `#e5c66f/12` no dia selecionado.
- Bordas e rótulos com o dourado legado `#B88736` em controles compartilhados.
- Fundo escuro `bg-black/10` nos dias não selecionados.

Foram acrescentados overrides exclusivamente sob:

`:root[data-layout="natural-sereno"] #arcanjo-protocol-view.ep-arcanjo-natural`

Os acentos foram alinhados ao dourado refinado `#A87E37`, `#C89D52` e ao creme `#FBF8F2`. O componente compartilhado não foi alterado, evitando regressões nos outros estilos.

Também foi ampliado `tests/natural-sereno-arcanjo-neutral.test.ts` para proteger os tokens antigos e exigir os novos overrides.

Commits:
- CSS: `35f4104dd1084476e93b8cbba00c8690d9ffb2b7`
- Teste: `20ac586a818e6d72e56a64080037c387f4a0438c`

## Preservado e reauditado

- Prancha do Estilo 1 permanece representada no card pela derivação versionada `docs/visual-qa/natural-sereno/reference.jpg`, com `object-contain`. A comparação pixel a pixel com o PNG original não foi repetida nesta rodada.
- Paleta creme/marfim, café/marrom, dourado refinado e verde-sálvia discreto.
- Logo oficial sutil: o override final de opacidade é carregado depois das folhas anteriores.
- Paisagens e enquadramentos responsivos do Natural Sereno.
- Seletor dos quatro estilos sem seleção inicial e com confirmação explícita antes de aplicar `data-layout`.
- Arcanjo com `NeutralBodyLightProgress`, sem reintroduzir o corpo ilustrado com chakras.
- Voz neural explícita no Natural Sereno, sem fallback silencioso para SpeechSynthesis.
- Política de Solfeggio sem sobreposição com narração.
- Sincronização de Diário por conta e proteções de persistência.
- Proteções server-side da InfinitePay, API Key obrigatória e lock compartilhado.
- Estilos 2, 3 e 4 não foram alterados nesta rodada.

A ordem de imports em `src/main.tsx` foi conferida: `natural-sereno-approved-overrides.css` é carregado depois das folhas-base e dos overrides anteriores, portanto as regras específicas desta auditoria estão ativas.

## Validação e limitações

- A reauditoria dos arquivos e dos seletores foi concluída após cada gravação.
- O teste foi atualizado, mas não há execução GitHub Actions associada ao HEAD atual; não se declara teste, TypeScript ou build aprovados.
- O check Vercel do HEAD continua em falha por `build-rate-limit`. O último deployment efetivamente criado para a branch ainda aponta para o commit documental anterior `749542c` e terminou em `BUILD_FAILED — Resource provisioning failed`; não há eventos de build nem Preview READY.
- Sem preview, a inspeção visual renderizada de todas as páginas em desktop e mobile permanece pendente.
- Voz, pausa/retomada, Diário ponta a ponta e InfinitePay sandbox ainda exigem homologação real.

## Reconciliação com main

A branch está 180 commits à frente e 12 atrás de `main`; a PR permanece `mergeable=false`.

A comparação confirmou mudanças posteriores na `main` que precisam ser reconciliadas seletivamente. A versão da `main` reintroduz no Arcanjo o corpo com chakras, em conflito com a decisão aprovada de corpo neutro. O seletor da `main` mantém a imagem da prancha, mas reduz a prévia do Natural Sereno à prancha isolada; a branch desta PR preserva a prévia composta com paisagem, identidade vigente, CTA, paleta e miniatura da prancha. A `main` também contém a integração de `PromoVideoModal`, novos ajustes da Elegância Profunda e uma suíte de pagamento mais extensa; esses itens devem ser portados seletivamente, sem substituir os componentes neutros, a prévia composta, as proteções de conta e os locks financeiros da branch. Não foi feito merge, rebase ou substituição integral de arquivos.

## Estado

- Correção visual do Arcanjo registrada.
- Teste de regressão atualizado, ainda não executado.
- Identidade aprovada preservada.
- Nenhum merge ou publicação em produção.
- Nenhuma cobrança real.
