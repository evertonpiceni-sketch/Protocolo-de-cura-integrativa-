# Auditoria RUN 116 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**HEAD de código validado:** `f22579a85e859d8e1eadcf3cbec67584cf52dba5`  
**GitHub Actions:** [run 42601117646](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42601117646)

## Corrigido nesta rodada

A primeira execução no HEAD anterior falhou em dois testes, sem apontar regressão de runtime:

1. `tests/elegancia-profunda-audit.test.ts`: a asserção ainda esperava que Natural Sereno enviasse `dayNumber` ao `SacredEnergyCanvas`. O código atual separa corretamente o Natural Sereno em `NeutralBodyLightProgress`; o `SacredEnergyCanvas` recebe o contexto de dia apenas para Elegância Profunda e Essência Luminosa. A expectativa foi atualizada para refletir essa separação já existente, sem alterar comportamento.
2. `tests/natural-sereno-arcanjo-neutral.test.ts`: duas regexes tinham escape duplicado e não verificavam de fato os títulos da jornada de 7 dias. Corrigidos os padrões para detectar títulos de chakra e exigir o título aprovado “Segurança e Aterramento”. Nenhum conteúdo da jornada foi alterado.

## Preservado e reauditoria estática

- Paleta Natural Sereno: creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento.
- Paisagens reais e pontos focais responsivos registrados na RUN 115; os arquivos de imagem não foram substituídos.
- Logo oficial discreto/transparente, sem disco, moldura ou sombra dominante.
- Seletor explícito dos quatro estilos, sem pré-seleção, com confirmação obrigatória.
- Player Natural Sereno com corpo/progresso neutro; `SacredEnergyCanvas` não é usado no ramo Natural Sereno.
- Seis etapas, respiração 4–3–5 e animações aprovadas.
- Marianne — Meditação (`mJqP14JQFEK0PojR5lfV`) permanece como voz neural oficial dos protocolos Natural Sereno; IDs ElevenLabs válidos salvos no perfil são respeitados e não há fallback silencioso para SpeechSynthesis nesses fluxos.
- A Jornada Reintegração da Vida permanece em endpoint separado, com voz neural fixa própria e sem fallback de voz do dispositivo; não foi alterada nesta rodada.
- Solfeggio, Diário/sincronização por conta, componentes ativos e regras InfinitePay foram preservados.
- Nenhum preço, cupom, benefício, conteúdo terapêutico ou identidade dos Estilos 2, 3 e 4 foi alterado.

## Validação técnica

GitHub Actions `42601117646` — **concluída com sucesso**:

- `npm audit`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes: **236/236 aprovados**.
- Build Vite + Express: aprovado; 2.251 módulos transformados.
- Verificações de entrypoints, JWT, segredos, autenticação, smoke tests e pagamentos: aprovadas.
- Avisos não bloqueantes de tamanho de bundle e depreciações de ferramentas permanecem.

## Pendências reais

1. **Prévia Vercel:** não existe deployment para o HEAD `f22579a`. A última prévia localizada desta branch é anterior (`f657500`) e terminou em `ERROR`; a consulta dos eventos de build não retornou logs. Sem preview READY, não há inspeção renderizada/pixel a pixel de desktop e mobile.
2. **Homologação visual:** capturas reais página a página continuam pendentes.
3. **Áudio real:** falta escutar Marianne e verificar narração, Solfeggio, ambiência, pausa e retomada no navegador.
4. **InfinitePay:** sandbox e webhook continuam pendentes; nenhuma cobrança foi iniciada.
5. **Prancha original:** o PNG `1001196520.png` / ID informado não foi recuperado nesta rodada. A cópia versionada do repositório permanece preservada, sem substituição por arte semelhante.
6. **Reconciliação com main:** a branch está 62 commits à frente e 7 atrás. Os sete commits posteriores da main afetam `App.tsx`, CSS da Elegância Profunda e testes dos Estilos 2/3. Não foram mesclados automaticamente; devem ser reconciliados preservando as decisões mais recentes dos outros estilos.

## Estado da entrega

PR #79 permanece aberta, em rascunho e mergeable. Sem merge, deploy de produção ou cobrança real. Esta rodada corrigiu somente expectativas obsoletas de testes; não redesenhou nem alterou telas aprovadas.
