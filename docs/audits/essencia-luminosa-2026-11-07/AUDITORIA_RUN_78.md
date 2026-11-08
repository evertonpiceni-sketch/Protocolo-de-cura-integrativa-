# Auditoria RUN 78 — Estilo 3: Essência Luminosa

**Data:** 7 de novembro de 2026 (horário local)  
**Branch:** `main`  
**HEAD inicial:** `44abfc2ab495fcb6f00ba5bf810173bbb0638ef0`  
**HEAD final das correções:** `c6eb1bba0cf99835ad58da18694e485c209f33fc`

## Corrigido

### Acesso e cadastro neutros antes da escolha

A revisão encontrou acentos âmbar/dourados antigos ainda hardcoded em `ProfileSetup.tsx`, embora essa tela seja exibida antes da escolha e não deva aplicar nenhum dos quatro estilos:

- `#B88736` nos estados ativos, botões e focos;
- `#8F631E` no hover dos CTAs;
- `#e5c66f` na identificação superior.

Foram substituídos pelos tons neutros já definidos para o estado sem `data-layout`:

- `#A99B84` para destaque/foco;
- `#817460` para texto e hover.

A correção não aplica Essência Luminosa antes da confirmação e não altera a paleta dos outros estilos.

### Cabeçalho do seletor

O texto de identificação “4 estilos, uma mesma essência” também usava o dourado antigo. Foi neutralizado para `#817460`. Os cards, as prévias e os estados próprios de cada estilo foram preservados; o card da Essência Luminosa continua usando a prancha WebP versionada e seu ouro suave.

### Proteção contra regressão

O teste de acesso neutro agora verifica que os três valores antigos não retornem e que CTAs/estados ativos usem os tons neutros. O teste do seletor verifica que o cabeçalho permaneça neutro antes da confirmação.

## Varredura estática por página/área

A suíte verifica 22 folhas CSS `essencia-luminosa*.css`; os seletores permanecem isolados por `data-layout="essencia-luminosa"`. Quinze folhas são importadas diretamente em `src/main.tsx`; as demais são verificadas pela suíte e importadas pelos respectivos componentes.

| Página/área | Resultado |
|---|---|
| Acesso e cadastro | Acentos antigos removidos; tela neutra antes da escolha |
| Seletor e quatro prévias | Escolha vazia inicial e confirmação explícita preservadas |
| Home e cabeçalho | Paleta e assinatura do logo preservadas |
| Onboarding/acolhimento | Superfícies claras e logo discreto preservados |
| Anamnese | CSS próprio isolado |
| Guia dos Chakras | Cores simbólicas preservadas |
| Banhos de Ervas | Sálvia clara/champagne preservados |
| Numerologia | Tokens atuais preservados |
| Mapa Astral | Correções cromáticas anteriores preservadas |
| Ho'oponopono e orações | Superfícies próprias preservadas |
| Cursos e Biblioteca | Camadas próprias preservadas |
| Diário e Diário de Reconexão | Salvamento, histórico e exportação preservados |
| Configurações de áudio | Catálogo ElevenLabs e seleção neural preservados |
| Solfeggio/ambiência | Frequências tonais suspensas durante narração/prévia neural; ambiências não tonais permitidas |
| Player e animações | Cadência, sincronização e canvas ouro/sálvia preservados |
| Prática Individual | Selo champagne e tratamentos de superfície preservados |
| Planos e pagamentos | Checkout InfinitePay e confirmação server-side preservados |
| Contato e Conquistas | Camadas específicas isoladas |

A varredura de páginas foi estática, por componentes, imports, CSS e testes. Não houve sessão autenticada nem captura de todas as telas em navegador nesta execução.

## Preservado

- Card oficial do seletor: `/brand/essencia-luminosa/prancha-oficial.webp`. O ativo versionado foi inspecionado visualmente e continua sendo uma composição de telas da Essência Luminosa.
- Paleta: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, com areia/oliva clara como acentos.
- Logo oficial discreto/transparente, sem placa, borda ou sombra no Estilo 3.
- Quatro estilos; nenhuma preferência salva equivale a consentimento: o tema só é aplicado após confirmação explícita na sessão.
- Voz neural ElevenLabs; IDs válidos são respeitados e os fluxos que exigem voz neural falham sem recorrer à voz robótica do navegador.
- As oito frequências Solfeggio (396, 417, 432, 528, 639, 741, 852 e 963 Hz) não tocam durante narração/prévia neural; ondas/chuva continuam como ambiência não tonal.
- Diário, player, animações e conteúdo terapêutico.
- InfinitePay server-side; catálogo mantém R$ 59,90/7 dias e R$ 99,90/21 dias; cupons de pagamento PROMO15/PROMO20 permanecem validados no servidor.
- Estilos 1, 2 e 4: nenhum arquivo visual próprio desses estilos foi alterado.

## Natureza realista — pendente

A pasta `public/brand/essencia-luminosa/` contém somente `prancha-oficial.webp` (14.512 bytes). A prancha é uma composição de interfaces, não uma fotografia limpa para fundo. `--ep-scene` permanece `none`.

O PNG original `1001196521.png` não pôde ser reaberto pela Biblioteca/conversa nesta execução; por isso não foi alegada comparação pixel a pixel. O card continua apontando para o ativo WebP versionado já existente. Não foram reutilizadas imagens do Natural Sereno, da Reintegração da Vida ou de referências antigas/reprovadas. Fotografias próprias aprovadas continuam pendentes.

## Validação técnica

GitHub Actions — [run #42437914643](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42437914643), executado no HEAD `c6eb1bba0cf99835ad58da18694e485c209f33fc`:

- `npm ci`: aprovado.
- `npm audit --audit-level=moderate`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes automatizados: **111/111 aprovados**.
- Build Vite + Express: aprovado.
- Entry points Vercel, verificação de segredos, JWT fail-closed, proteção administrativa, smoke test e endpoints de pagamento: aprovados.

O status Vercel do commit continua em falha por `build-rate-limit`. O build de CI passou, mas a implantação de produção não está homologada.

## Pendente

1. Integrar fotografias realistas próprias da Essência Luminosa, sem reutilizar imagens de outros estilos.
2. Capturar e homologar todas as páginas em desktop e celular em navegador autenticado.
3. Testar voz neural, Solfeggio, ambiências, player e animações em dispositivos reais.
4. Testar persistência ponta a ponta do Diário em sessões/dispositivos reais.
5. Realizar transação controlada InfinitePay em sandbox e conferir webhook/liberação de acesso.
6. Resolver o limite de implantação da Vercel e confirmar publicação.

## Commits desta rodada

- `9423ebe19ae53ac42bd87cf6a7c72952fbb4adff` — neutralização dos acentos antigos em acesso/cadastro.
- `8a855a4a4cab2a245ede843f779fc9f82d221f4e` — testes de regressão para acesso e seletor.
- `c6eb1bba0cf99835ad58da18694e485c209f33fc` — cabeçalho neutro do seletor.

**Conclusão:** a tela de acesso e o cabeçalho do seletor não carregam mais o âmbar/amarelo antigo antes da escolha. O fluxo de confirmação continua explícito; 111 testes passaram, o build passou e o audit encontrou zero vulnerabilidades. Natureza fotográfica própria, homologação visual/runtime, teste real de pagamento e publicação continuam pendentes.
