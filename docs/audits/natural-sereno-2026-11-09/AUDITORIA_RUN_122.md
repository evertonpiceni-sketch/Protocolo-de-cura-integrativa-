# Auditoria RUN 122 — Estilo 1 · Natural Sereno

Data: 9 de novembro de 2026  
Projeto: `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
Branch: `fix/natural-sereno-mainline-run111-2026-11-09`

## Corrigido

- A ação global `#floating-whatsapp-btn` era declarada em `App.tsx` com `rounded-full`. O override do Natural Sereno já corrigia superfície, cor, borda e sombra, mas não substituía o raio; o botão continuava em formato de pílula.
- O override final de `src/natural-sereno-approved-overrides.css` agora aplica `border-radius:18px!important` exclusivamente sob `:root[data-layout="natural-sereno"]`.
- Não foi alterado o JSX global nem o acabamento dos outros três estilos.

## Verificado e protegido

- O toast global nasce com classes índigo/violeta em `App.tsx`, mas o override final do Natural Sereno já o converte para superfície marfim, texto café e detalhe dourado.
- Criado `tests/natural-sereno-global-shell-guard.test.ts` para impedir regressão do CTA flutuante e do toast, além de verificar a precedência da última camada CSS do Estilo 1.
- `src/main.tsx` importa `natural-sereno-approved-overrides.css` depois das demais camadas do Natural Sereno. As regras verificadas permanecem escopadas ao atributo `data-layout="natural-sereno"`.

## Preservado

- Identidade: creme/marfim, café/marrom, dourado refinado e sálvia somente como acento natural.
- Paisagens realistas, enquadramentos já aprovados, tipografia e botões existentes.
- Logo oficial discreto/transparente.
- Seletor explícito dos quatro estilos, sem pré-seleção e com confirmação obrigatória.
- Marianne/voz neural, política de Solfeggio, Diário, player, corpo neutro, animações e respiração 4–3–5.
- Catálogo, preços, cupons e validação server-side da InfinitePay.
- Estilos 2, 3 e 4 sem redesenho ou alteração nesta rodada.

## Reauditoria técnica

GitHub Actions Security Audit #2162 — run `42653311998`: **success**.

- **245/245 testes aprovados**, incluindo os dois novos testes de shell global.
- `npm audit`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Build Vite + Express: aprovado; 2.251 módulos transformados.
- Entry points, verificações de segredos/JWT/admin, smoke test e proteção fail-closed dos endpoints financeiros: aprovados.

## Pendente

1. Check Vercel continua em falha por `build-rate-limit`; não há preview READY para homologação visual renderizada.
2. Capturas e conferência de todas as superfícies em desktop e mobile.
3. Escuta real de Marianne, Solfeggio, ambiência, pausa e retomada em dispositivo.
4. Sandbox InfinitePay, checkout, confirmação e webhook.
5. Recuperação independente do PNG original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`; a cópia versionada no repositório permanece preservada, sem substituição.
6. Reconciliar os sete commits posteriores da `main`, que contêm decisões da Elegância Profunda e um guard de seleção/Essência Luminosa. Não descartá-los nem sobrescrevê-los.

Sem merge, publicação em produção ou cobrança real.
