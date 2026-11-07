# Auditoria — Estilo 3: Essência Luminosa — Run 72

**Data:** 7 de novembro de 2026  
**Branch:** `main`  
**HEAD de código desta rodada:** `ea12f016ca397e70c2747b5b392b3503ce69a93b`  
**Base antes das correções:** `2c4f5532160acd3eed0e7b056845cca3b478ad8e`

## Referência visual

A prancha `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6` continua definida como referência oficial, subordinada às decisões posteriores. A busca desta execução não disponibilizou o PNG original pelo nome ou identificador informado. O card React continua usando o derivado versionado `public/brand/essencia-luminosa/prancha-oficial.webp`; ele não foi substituído e não foi alegada comparação pixel a pixel.

## Corrigido

### Mapa Astral — herança cromática não coberta

A varredura encontrou um caso concreto que as camadas anteriores ainda não neutralizavam em `AstralMapModal.tsx`:

- ícone do cabeçalho com fundo verde profundo `#073b2b`;
- texto amarelo claro `#f2dda4` sobre esse fundo;
- botões, bordas, halos e etiquetas com o dourado legado `#B88736` / `#8F631E`;
- etiqueta PRO e estados com utilitários `amber-*`.

Foi adicionada uma camada estritamente escopada a `data-layout="essencia-luminosa" #astral-map-modal` em `src/essencia-luminosa-final-audit.css`:

- ícone passa a usar superfície clara de sálvia/champagne e texto grafite;
- CTAs sólidos passam a usar o gradiente ouro suave, com texto escuro;
- halos permanecem translúcidos;
- bordas e textos passam a consumir os tokens atuais;
- estados âmbar passam a champagne/ouro suave;
- foco visível usa contorno ouro suave.

A alteração é apenas visual. Cálculos, conteúdo, tabs, links, impressão e comportamento do Mapa Astral não foram modificados.

Foi acrescentado teste de regressão em `tests/essencia-luminosa.test.ts` cobrindo os hardcodes reais do componente e os overrides escopados. A regra para fundo sólido usa correspondência exata do token de classe (`class~=`), evitando que outras classes de opacidade no mesmo atributo impeçam a correção do botão.

## Preservado

- Paleta: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro aprovado `#A87E37`, areia e oliva clara.
- Logo oficial discreto/transparente; nenhuma opacidade ou escala foi aumentada.
- Quatro cards no seletor, escolha inicial vazia e confirmação explícita antes da aplicação.
- Estado neutro de acesso/cadastro antes da escolha.
- Diário, Diário de Reconexão, salvamento, histórico e exportação.
- Voz neural ElevenLabs e IDs válidos; sem fallback silencioso para voz do navegador nos fluxos que exigem voz neural.
- Política Solfeggio: frequências tonais não são reiniciadas como trilha durante a narração; ambiência não tonal continua permitida.
- Player, canvas, respiração, animações e progresso associado ao áudio.
- Conteúdo dos protocolos, Anamnese, Chakras, Banhos, Numerologia, Mapa Astral e Ho'oponopono.
- InfinitePay, checkout server-side e confirmação pelo provedor.
- Identidades dos Estilos 1, 2 e 4; nenhuma regra visual deles foi alterada.

## Varredura estática por página/área

| Área | Resultado |
|---|---|
| Acesso e cadastro | Estado neutro pré-seleção conferido; sem amostra de voz de outro estilo. |
| Seletor/prévias | Quatro estilos; escolha vazia e confirmação explícita preservadas; WebP oficial mantido. |
| Home/cabeçalho | Tokens e assinatura discreta conferidos; cena própria ainda desativada por falta de fotografia aprovada. |
| Onboarding/boas-vindas | Superfícies claras e logo discreto preservados. |
| Anamnese/Chakras/Banhos | Camadas específicas; cores simbólicas dos chakras não foram recoloridas. |
| Numerologia | Camada própria e tokens atuais preservados. |
| Mapa Astral | Corrigidas as heranças verde profundo, amarelo claro, dourado antigo e amber. |
| Ho'oponopono/orações/perguntas sistêmicas | Overrides específicos conferidos; conteúdo e lógica preservados. |
| Cursos/Biblioteca/Contato/Conquistas | Camadas específicas conferidas. |
| Diário/Diário de Reconexão | Estados semânticos, CTAs, salvamento e exportação preservados. |
| Ajustes de áudio/voz | Catálogo neural do Estilo 3 preservado; sem fallback robótico silencioso. |
| Player/canvas/animações | Política de áudio e paleta do canvas conferidas estaticamente. |
| Prática Individual | Selo recomendado em champagne; lógica e preço preservados. |
| Planos/pagamento | Checkout InfinitePay e confirmação server-side preservados. |
| Vídeo de apresentação | Overrides próprios preservados; sem reutilizar paleta de outros estilos. |

A varredura incluiu as 22 folhas CSS específicas da Essência Luminosa e os componentes compartilhados relevantes. Esta é uma auditoria estática por código/imports/testes, não uma homologação visual em navegador.

## Validação automatizada

GitHub Actions — execução `42417519178` para a primeira versão do patch (`757d473d9c6209c814835cf157629b4d4bcca153`):

- TypeScript: aprovado.
- Testes de regressão: aprovados.
- Build Vite + Express: aprovado.
- Verificação dos entrypoints Vercel: aprovada.
- Verificação de padrões de segredo: aprovada.
- Configuração JWT fail-closed: aprovada.
- Proteção contra criação pública de Admin: aprovada.
- Smoke test de saúde/cadastro: aprovado.
- Verificação dos endpoints de pagamento: aprovada.
- Enforcement final de dependências: reprovado por resultado não limpo do `npm audit`.

O workflow da primeira versão do patch terminou em falha somente na etapa de enforcement do audit de dependências; as etapas de TypeScript, testes, build e verificações funcionais listadas acima passaram. A revisão final do seletor foi validada na execução `42417700777` (HEAD de código `ea12f016ca397e70c2747b5b392b3503ce69a93b`) e novamente na execução `42417715309` (HEAD `c2a7a9196931ec8490bb00fe55944a4a300e8af1`). Em ambas, TypeScript, testes de regressão, build e verificações funcionais passaram; o workflow permaneceu vermelho somente na etapa de enforcement do audit de dependências. O status Vercel continua em falha por `build-rate-limit`; não há deploy de produção homologado. Execuções: [Run 72 — código](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42417700777) e [Run 72 — relatório](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42417715309).

## Pendente

1. Integrar fotografias realistas próprias da Essência Luminosa. `--ep-scene: none` permanece deliberado para não reutilizar imagens do Natural Sereno ou da Reintegração.
2. Recuperar o PNG original da prancha para comparação pixel a pixel; o WebP versionado permanece no seletor.
3. Capturar e homologar visualmente todas as páginas em desktop e celular.
4. Testar em dispositivos reais a voz neural escolhida, Solfeggio, pausa/retomada, player, animações e persistência do Diário.
5. Testar checkout, retorno e webhook InfinitePay em sandbox.
6. Resolver vulnerabilidades de dependências sem atualizações indiscriminadas.
7. Regularizar o limite de build da Vercel e homologar a publicação.

## Commits desta rodada

- `73ea45a1cc9d52d5d46c721f0715d58dd2b2cac7` — neutraliza heranças do Mapa Astral.
- `757d473d9c6209c814835cf157629b4d4bcca153` — primeira versão do teste de regressão do Mapa Astral.
- `559c1d170d2aa103c95465d6f14c67abd94b12b0` — usa correspondência exata para a classe de fundo sólido.
- `ea12f016ca397e70c2747b5b392b3503ce69a93b` — atualiza o teste para exigir o seletor exato.

**Conclusão:** uma herança cromática concreta do Mapa Astral foi corrigida e protegida por teste. O restante da identidade e das funcionalidades aprovadas foi preservado. A Essência Luminosa ainda não deve ser considerada concluída enquanto faltarem natureza própria, homologação visual em navegador, testes de runtime e publicação validada.
