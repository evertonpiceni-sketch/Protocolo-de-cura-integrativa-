# Auditoria RUN 76 — Estilo 2: Elegância Profunda

Data: 2026-11-07  
Branch: `main`  
Base de código após a correção de dependências: `8dbf6f5e48b1138563e073eda0f445169693182f`

## Resultado da rodada

Não foi encontrada nova regressão visual ou funcional específica do Estilo 2 que justificasse sobrescrever componentes aprovados. A correção efetiva desta rodada foi resolver o bloqueio de segurança do repositório, mantendo o código visual e os fluxos do Estilo 2 intactos.

## Varredura página por página

Foram conferidos os 21 imports CSS do Estilo 2 em `src/main.tsx`, com inspeção individual dos seletores. Resultado: **21/21 folhas verificadas; 0 seletores sem isolamento** por `data-layout="elegancia-profunda"`.

1. Superfícies gerais e assinatura do logo — regra específica mantém opacidade de 30%; wrapper transparente, sem moldura, fundo ou sombra dominante.
2. Modais e Prática Individual — camada própria preservada.
3. Anamnese — camada própria preservada.
4. Oração de São Miguel — tratamento específico do Estilo 2 preservado.
5. Contato — assinatura discreta preservada.
6. Banhos de ervas — camada própria preservada.
7. Mapa astral e Numerologia — camada própria preservada.
8. Diário de Reconexão — camada própria preservada.
9. Diário diário — salvamento conectado ao callback aprovado.
10. Detalhe do dia — camada própria preservada.
11. Ho'oponopono — camada própria preservada.
12. Promoção — camada própria preservada.
13. Configurações — camada própria preservada.
14. Estados semânticos das Configurações — camada própria preservada.
15. Cursos — camada própria preservada.
16. Conquistas — camada própria preservada.
17. Navegação inferior — camada própria preservada.
18. Instalação mobile — camada própria preservada.
19. Cabeçalho — camada própria preservada.
20. Dashboard — camada própria preservada.
21. Player — fundo profundo, champagne e marfim isolados no Estilo 2.

Não foi encontrada regra CSS global sem escopo nas 21 folhas verificadas. Nenhum componente ou tratamento visual dos Estilos 1, 3 ou 4 foi alterado.

## Seletor, identidade e componentes antigos

- `OFFICIAL_LAYOUTS` mantém os quatro estilos oficiais.
- `LayoutChoiceModal` inicia com `selectedLayout = null`; confirmar permanece desabilitado até uma escolha explícita.
- `App.tsx` inicia a sessão sem confirmação e remove `data-layout` antes da escolha; o tema só é aplicado depois da persistência bem-sucedida.
- O logout limpa a confirmação e a solicitação de troca de estilo.
- `OnboardingFlow` permanece ativo; `WelcomeModal` e patches DOM legados continuam fora do fluxo ativo.
- A assinatura do logo permanece em 30%, com wrapper transparente.

### Prancha e natureza

O card continua apontando para `/brand/elegancia-profunda/prancha-oficial.svg`. O SVG contém WebP incorporado de **240 × 180 px**. A busca pelo nome `1001194194.png` e pelo identificador `file_00000000121c820e931b56bb6b1467e9` na Biblioteca e nos arquivos da conversa não localizou a fonte original. Não houve interpolação artificial nem substituição por outra prancha.

`--ep-scene:none` permanece intencional até existir fotografia de natureza exclusiva e aprovada para este estilo. Não foram reutilizadas cenas da Reintegração ou de outros estilos.

## Voz, Solfeggio, Diário, player e pagamento

- **Voz geral:** exige ID ElevenLabs válido e não permite fallback silencioso para SpeechSynthesis. O ID nominal da voz geral escolhida pelo usuário não foi recuperado nesta execução; nenhum ID foi inventado.
- **Reintegração:** mantém a voz neural dedicada `21m00Tcm4TlvDq8ikWAM`, sem fallback nativo.
- **Solfeggio:** `audio.ts` mantém o oscilador na frequência nominal exata.
- **Diário:** `DailyDiaryModal` encaminha a entrada ao handler de salvamento; `JournalLog` mantém pesquisa e exportação. Persistência ponta a ponta em sessão/dispositivo real ainda requer homologação.
- **Player/animações:** Wake Lock só é solicitado durante reprodução e é liberado ao pausar/concluir/desmontar. A cadência 4–3–5 e a sincronização visual com o áudio permanecem protegidas por testes. A jornada continua com 21 dias e corpo neutro.
- **InfinitePay:** checkout e confirmação server-side preservados; a confirmação compara o valor do provedor ao pedido e impede reutilização de transação. Não foi realizada transação real nesta rodada.

## Segurança de dependências — corrigido

O bloqueio do `npm audit` foi resolvido com atualização controlada de `package.json` e regeneração integral de `package-lock.json`:

| Pacote | Antes | Depois |
|---|---:|---:|
| body-parser | 1.20.8 | 1.20.9 |
| ip-address | 10.7.3 | 10.7.4 |
| qs | 6.16.0 | 6.16.1 |
| vite | 6.4.3 | 6.4.5 |
| zod | 4.5.4 | 4.6.7 |
| puppeteer | 25.9.0 | 25.16.0 |
| chromium-bidi | 17.0.2 | 157.0.8090-0 |

A atualização do Puppeteer/Chromium BiDi removeu a cópia transitiva vulnerável de Zod 3. Nenhuma atualização major de dependência de runtime foi introduzida nos fluxos de aplicação.

## CI e publicação

PR de validação: [#60](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/pull/60), integrado por squash no commit `8dbf6f5e48b1138563e073eda0f445169693182f`.

GitHub Actions [run #42427431353](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42427431353):

- `npm ci`: aprovado.
- `npm audit --audit-level=moderate`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes de regressão: **109/109 aprovados**.
- Build: aprovado.
- Entry points Express, verificação de segredos, JWT fail-closed, proteção de administrador, smoke test de saúde/cadastro e endpoints de pagamento: aprovados.

O status Vercel do commit continua em falha por `build-rate-limit`. O build do CI passou, mas não há implantação de produção homologada.

## Preservado

- Identidade Elegância Profunda: verde profundo intencional, dourado nobre, champagne, bronze e marfim.
- Logo oficial como assinatura sutil/transparente.
- Escolha explícita dos quatro estilos antes da aplicação.
- Isolamento das 21 folhas CSS.
- Onboarding ativo, jornada de 21 dias e corpo neutro.
- Voz neural sem fallback robótico, voz dedicada da Reintegração, Solfeggio exato, Diário, player e fluxo server-side InfinitePay.
- Conteúdo, preços, cupons e identidades dos outros estilos.

## Pendente

1. Recuperar a fonte original da prancha para gerar uma prévia de maior densidade sem interpolação artificial.
2. Obter e aprovar fotografia real de natureza exclusiva para o Estilo 2; manter `--ep-scene:none` até lá.
3. Finalizar a composição do player com a silhueta neutra aprovada e homologar visualmente em desktop e celular.
4. Testar voz geral, voz dedicada, Solfeggio, animações e persistência do Diário em dispositivos/sessões reais.
5. Realizar transação controlada InfinitePay e verificar webhook e liberação de acesso.
6. Aguardar a liberação do limite Vercel e confirmar publicação.

## Critério de continuidade

Não reabrir seletor, logout, logo, isolamento CSS, jornada, corpo neutro, voz dedicada, Solfeggio, Diário, Wake Lock, checkout ou confirmação server-side sem evidência de regressão. As próximas alterações visuais devem depender da fonte original da prancha e de uma fotografia de natureza aprovada; a homologação funcional deve ocorrer em ambiente real antes de declarar o Estilo 2 concluído.
