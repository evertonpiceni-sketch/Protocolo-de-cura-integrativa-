# Auditoria RUN 77 — Estilo 3: Essência Luminosa

**Data:** 7 de novembro de 2026  
**Branch:** `main`  
**Base da auditoria:** `2ef847a14a6edf26fe4d199c25a751e75504f3cb`  
**HEAD de código/testes:** `b48ac195da74f80adc36410c1220a8bb93bd98e4`

## Corrigido

### Logo oficial — assinatura realmente transparente

A auditoria encontrou dois wrappers que ainda davam fundo, borda e sombra ao logo no Estilo 3, apesar da opacidade reduzida da imagem:

- O wrapper compartilhado `.ep-brand-signature-wrap` recebia fundo marfim translúcido, borda dourada e sombra.
- O wrapper do logo dentro de `#main-header` recebia outra superfície translúcida, borda e sombra.

As duas regras agora usam fundo transparente, borda transparente e nenhuma sombra. A imagem do logo continua como assinatura: **30% de opacidade no desktop e 26% no celular**. Os wrappers do hero e do acolhimento já estavam transparentes e foram preservados.

A correção está isolada por `data-layout="essencia-luminosa"`; não altera os outros estilos.

### Proteção contra regressão

O teste do logo foi ampliado para verificar:
- Wrapper geral transparente, sem borda e sem sombra.
- Wrapper do cabeçalho transparente, sem borda e sem sombra.
- Hero e acolhimento mantendo o mesmo tratamento.
- Opacidade discreta do logo em desktop e mobile.
- Ordem de carregamento das folhas CSS.

## Varredura estática por página/área

Foram identificadas **22 folhas CSS próprias do Estilo 3**. A suíte de regressão percorre todas e exige que cada seletor visual esteja sob `data-layout="essencia-luminosa"`; nenhum seletor sem isolamento foi encontrado. Quinze dessas folhas são importadas diretamente em `src/main.tsx`; as demais também entram na varredura automatizada.

| Página/área | Resultado |
|---|---|
| Acesso e cadastro | Estado neutro anterior à escolha preservado |
| Seletor e prévias | Quatro opções; seleção começa vazia; confirmação obrigatória |
| Home e cabeçalho | Logo transparente; cena própria continua pendente |
| Onboarding/acolhimento | Assinatura do logo preservada e discreta |
| Anamnese | Camada própria isolada |
| Guia dos Chakras | Cores simbólicas preservadas |
| Banhos de Ervas | Camada própria isolada |
| Numerologia | Camada própria isolada |
| Mapa Astral | Correções cromáticas anteriores preservadas |
| Ho'oponopono e orações | Camadas próprias preservadas |
| Cursos e Biblioteca | Camadas próprias preservadas |
| Diário e Diário de Reconexão | Salvamento, histórico e exportação preservados |
| Configurações de áudio | Catálogo neural e seleção de voz preservados |
| Solfeggio e ambiência | Política de pausa durante narração/prévia neural preservada |
| Player e animações | Estrutura, sincronização e controles preservados |
| Prática Individual | Selo champagne preservado |
| Planos e pagamentos | Fluxo InfinitePay server-side preservado |
| Contato e Conquistas | Camadas próprias isoladas |

A conferência de páginas foi estática, por componentes, imports, CSS e testes. Não houve sessão autenticada nem captura visual de navegador nesta rodada.

## Preservado

- Referência do card: `/brand/essencia-luminosa/prancha-oficial.webp`; não foi substituída nem reexportada.
- Paleta: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, com areia e oliva clara como acentos.
- Logo oficial sem protagonismo, agora sem placa/fundo no Estilo 3.
- Quatro estilos e confirmação explícita antes de aplicar o tema.
- Voz neural ElevenLabs; IDs válidos continuam respeitados e não há fallback silencioso para voz robótica nos fluxos que exigem voz neural.
- As oito frequências Solfeggio não tocam durante a narração ou prévia neural; ambiências não tonais continuam permitidas.
- Diário, player, animações e conteúdo terapêutico.
- Checkout InfinitePay, validação server-side do valor e proteção contra reutilização de transação.
- Estilos 1, 2 e 4: nenhum arquivo visual deles foi alterado.

## Natureza — pendente

A pasta pública própria do Estilo 3 contém apenas o card `public/brand/essencia-luminosa/prancha-oficial.webp` (14.512 bytes). A prancha é uma composição de telas, não uma fotografia limpa para fundo. A variável `--ep-scene` permanece `none`.

Não foram reutilizadas imagens do Natural Sereno, da Reintegração da Vida ou de materiais antigos/reprovados. A integração de fotografias realistas próprias continua pendente até existir um conjunto de imagens adequado e aprovado.

## Validação técnica

GitHub Actions — [run #42432947206](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42432947206), executado no HEAD `b48ac195da74f80adc36410c1220a8bb93bd98e4`:

- `npm ci`: aprovado.
- `npm audit --audit-level=moderate`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **109/109 aprovados**.
- Build Vite + Express: aprovado.
- Entry points Vercel, verificação de segredos, JWT fail-closed, proteção de administrador, smoke test e endpoints de pagamento: aprovados.

O status Vercel do commit continua em falha por `build-rate-limit`. O build de CI passou, mas não há implantação de produção homologada.

## Pendente

1. Integrar fotografias realistas próprias da Essência Luminosa, sem reutilizar imagens de outros estilos.
2. Capturar e homologar todas as páginas em desktop e celular em navegador autenticado.
3. Testar voz neural, Solfeggio, ambiências, player e animações em dispositivos reais.
4. Testar persistência ponta a ponta do Diário em sessões/dispositivos reais.
5. Realizar transação controlada InfinitePay em sandbox e conferir webhook/liberação de acesso.
6. Resolver o limite de implantação da Vercel e confirmar publicação.

## Commits desta rodada

- `0f5b1f0037bff88df71fceb9bda87d4730920bd7` — wrapper geral do logo transparente.
- `e210d6962cdc490a7b52b80c1321c96c22b49eeb` — wrapper do cabeçalho transparente.
- `b48ac195da74f80adc36410c1220a8bb93bd98e4` — teste de regressão do logo.

**Conclusão:** o logo do Estilo 3 agora aparece sem placa, borda ou sombra, mantendo a imagem em opacidade discreta. A suíte completa passou, o build passou e o audit de dependências encontrou zero vulnerabilidades. Natureza fotográfica própria, homologação visual/runtime, teste real de pagamento e publicação continuam pendentes.
