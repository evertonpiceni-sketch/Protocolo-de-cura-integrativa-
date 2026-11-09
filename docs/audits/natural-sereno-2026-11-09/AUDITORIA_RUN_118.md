# Auditoria RUN 118 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**HEAD de código/testes:** `8deea8f3c5535d0977bbbc05578ea949e15d353c`  
**HEAD atual da main:** `2d632fd8b274b80057e2e63616767d6fad92111e`

## Corrigido nesta rodada

- A CI anterior (#2129) executou 239 testes: 238 passaram e 1 falhou por uma expectativa obsoleta em `tests/natural-sereno-run97.test.ts`. O teste ainda exigia que o player aplicasse a cachoeira como shorthand de background no elemento `#meditation-session`.
- A implementação aprovada do player foi consolidada em outro arranjo: `MeditationSession.tsx` renderiza uma única imagem responsiva `cachoeira.webp` no backdrop; `natural-sereno-final-audit.css` mantém a base creme/marfim e o canvas flexível. A imagem não deve ser duplicada como background do contêiner.
- Atualizada a asserção para verificar a variável/asset da cachoeira, a imagem única no componente, a classe semântica da cena e a base clara do player. Nenhum CSS, conteúdo terapêutico ou comportamento de runtime foi alterado nesta rodada.
- O teste agora protege a arquitetura real do player e não uma implementação antiga que já foi substituída.

## Varredura visual estática

Foram examinadas as 12 folhas CSS específicas do Natural Sereno:
`natural-sereno.css`, `natural-sereno-refinement.css`, `natural-sereno-mobile-fixes.css`, `natural-sereno-final-audit.css`, `natural-sereno-home-latest-approved.css`, `natural-sereno-milestone-audit.css`, `natural-sereno-journal-dashboard-audit.css`, `natural-sereno-contact-audit.css`, `natural-sereno-home-surface-audit.css`, `natural-sereno-guides-semantic-audit.css`, `natural-sereno-legacy-green-audit.css` e `natural-sereno-approved-overrides.css`.

- Nenhuma declaração ativa de fundo/texto foi encontrada usando os tokens legados pesquisados de verde-floresta ou amarelo saturado.
- As ocorrências remanescentes de `#073B2B` aparecem em seletores que identificam classes antigas para neutralizá-las com superfícies creme/dourado; não são valores de fundo reintroduzidos.
- As regras examinadas permanecem sob o escopo `data-layout="natural-sereno"`. Regras globais específicas da Reintegração continuam separadas e não foram alteradas.
- Os quatro arquivos de paisagem existem no repositório: `vale-amanhecer.webp`, `cachoeira.webp`, `presenca.webp` e `acolhimento.webp`.
- No player, o foco da paisagem permanece em `center 16%` no desktop e `center 52%` no mobile. O corpo continua neutro (`NeutralBodyLightProgress`), sem `SacredEnergyCanvas` no ramo Natural Sereno.
- A camada final do logo é importada antes de `natural-sereno-approved-overrides.css`; o override aprovado posterior mantém 30% no desktop e 26% no mobile, sem fundo, moldura ou filtro dominante.

## Preservado

- Identidade creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento.
- Paisagem real do vale na Home e cachoeira no player; nenhum arquivo de imagem foi substituído.
- Player com cabeçalho no fluxo, conteúdo flexível centralizado e rodapé no fluxo; seis etapas, animação de entrada, movimento de luz e respiração 4–3–5.
- Seletor React com quatro opções — Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno — sem pré-seleção e com confirmação obrigatória antes de aplicar o tema ou abrir o acolhimento.
- Voz neural Marianne — Meditação / ID oficial ou ID neural válido salvo; sem fallback silencioso para SpeechSynthesis nos fluxos Natural Sereno.
- Solfeggio: frequências tonais bloqueadas durante a prévia neural; início/retomada somente após o evento real de reprodução da narração.
- Diário, fila de sincronização por conta, cancelamento após troca de sessão e proteção contra sobrescrita de snapshots.
- InfinitePay: catálogo, preços, cupons, benefícios e validação server-side preservados. O checkout público real continua bloqueado fora de produção até existir sandbox; nenhuma cobrança foi iniciada.
- Elegância Profunda, Essência Luminosa, Místico Moderno e Reintegração da Vida sem redesenho ou alteração de conteúdo nesta rodada.

## Validação técnica

GitHub Actions **Security Audit #2130**, execução [42609781728](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42609781728), no HEAD de código/testes `8deea8f3`:

- **239/239 testes aprovados**, 0 falhas.
- `npm audit`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Build Vite: aprovado, **2.251 módulos transformados**.
- Entry points Vercel/Express, JWT, segredos, autenticação administrativa, smoke tests e verificações fail-closed dos pagamentos: aprovados.

A execução anterior #2129 foi corrigida sem alterar o runtime; a nova execução passou integralmente.

## Pendências reais

1. **Preview Vercel:** o comentário mais recente do bot informa limite de 100 deployments/dia (`api-deployments-free-per-day`, tentativa às 11:16 UTC de 09/11/2026). Não foi disparada outra implantação. Sem deployment READY, não há capturas renderizadas para homologar todas as páginas em desktop e mobile.
2. **Áudio real:** falta escutar Marianne no navegador/dispositivo e validar narração, pausa/retomada, Solfeggio e ambiência. Os testes automatizados validam a política e os callbacks, não a audição humana.
3. **InfinitePay:** sandbox, checkout de teste, confirmação e webhook continuam pendentes. Nenhuma transação real foi feita.
4. **Prancha original:** a busca na Biblioteca pelo nome `1001196520.png` e pelo ID `file_00000000317c820ebaad657dc3680de5` não recuperou o item original nesta rodada. A cópia versionada `docs/visual-qa/natural-sereno/reference.jpg` permanece no projeto; nenhuma imagem semelhante foi promovida como substituta.
5. **Reconciliação com main:** a branch está 70 commits à frente e 7 atrás. Os sete commits posteriores da main são alterações de documentação/testes e ajustes aprovados de Elegância Profunda/Essência Luminosa, incluindo `src/elegancia-profunda-approved-overrides.css`, `tests/elegancia-profunda-audit.test.ts`, `tests/essencia-luminosa.test.ts` e uma condição compartilhada em `App.tsx`. Preservar esses commits na integração; não reverter nem substituir as decisões posteriores dos outros estilos.
6. **Revisão independente:** não há threads inline abertas nem parecer novo nesta rodada. A tentativa anterior de revisão automatizada foi interrompida pelo limite de uso do serviço de revisão.

## Estado da entrega

- PR #79 aberta, em rascunho e mergeable.
- 7 commits posteriores da main ainda precisam ser preservados na reconciliação.
- Sem merge, publicação em produção ou cobrança real.
- O código e os testes desta rodada estão validados; a homologação visual/auditiva/financeira permanece pendente.

**Conclusão:** a falha da CI era um teste preso à implementação antiga do fundo do player. A expectativa foi atualizada para a arquitetura atual de imagem única e canvas flexível. Não foi necessário alterar novamente o visual aprovado nesta rodada.
