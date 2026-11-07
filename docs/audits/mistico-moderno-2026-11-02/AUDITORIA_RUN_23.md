# Auditoria Estilo 4 — Místico Moderno (Run 23)

Data: 2026-11-07  
Branch: `fix/mistico-moderno-audit-run21-2026-11-07`  
PR: #42 — rascunho, sem merge e sem deploy de produção.

## Corrigido

- Reconciliado `LayoutChoiceModal.tsx` com a versão mais recente da `main`: as prévias oficiais dos Estilos 2 e 3 foram preservadas junto à prancha do Estilo 4. O cartão Místico Moderno continua noturno, com tipografia marfim e moldura dourada/violeta.
- Confirmada a seleção explícita: estado inicial sem estilo escolhido, confirmação desabilitada até selecionar e preferência persistida antes de aplicar o tema. O logout reinicia a confirmação para a próxima conta.
- A proteção de voz agora rejeita também o antigo ID técnico de Marianne (`mJqP14JQFEK0PojR5lfV`). No endpoint ElevenLabs, o alias do Místico é validado antes da consulta ao cache; áudio legado em cache não pode contornar a lista de vozes descartadas. A falha continua sem fallback silencioso para Web Speech.
- Varredura estática dos 24 módulos CSS do Místico Moderno: todos os seletores de estilo estão condicionados a `data-layout="mistico-moderno"`. Foram incluídos cabeçalho, início/dashboard, guias, cursos, mapas, conquistas, Diário, histórico, sessões/player, Arcanjo/Solfeggio, ajustes de áudio, modais, práticas, contato, banhos, Ho'oponopono, promoções, certificados, estúdio, navegação e instalação mobile.

## Preservado

- Os quatro estilos e as alterações mais recentes dos Estilos 2 e 3; paleta noturna, índigo, violeta, esmeralda integrado, dourado/âmbar e leitura em marfim.
- Logo oficial discreto, com opacidade de 30%; conteúdos, roteiros, frequências, Diário, player e animações compartilhadas.
- Pagamentos InfinitePay: catálogo de assinatura mantém R$ 59,90/7 dias e R$ 99,90/21 dias; PROMO15/PROMO20 permanecem no catálogo de assinatura e VIP7 continua restrito à degustação de 7 dias. Prática específica mantém checkout próprio. Nenhum arquivo de pagamento foi alterado.

## Pendente / limitações

- O asset `public/brand/mistico-moderno/prancha-oficial.webp` está presente e foi inspecionado visualmente como prancha noturna do Estilo 4. A PNG original não foi reaberta diretamente nesta execução; a busca pela referência original não a localizou.
- Não há aprovação explícita recuperada para “Maiara”: esse nome apareceu em sugestão anterior do assistente, não como escolha do usuário. O ID antigo de Marianne foi bloqueado. O valor de `ELEVENLABS_VOICE_ID` no Vercel é protegido; a identidade audível ainda precisa de confirmação por reprodução real. As APIs do preview isolado haviam retornado 401.
- A inspeção dos 24 módulos foi estática, não uma homologação visual renderizada de todas as páginas. O preview Vercel está limitado pelo erro `api-deployments-free-per-day` (mais de 100 deployments no plano gratuito). O `SacredEnergyCanvas` e as animações compartilhadas foram preservados, sem alteração especulativa.
- Não foi feita transação real InfinitePay. O último Security Audit executado (run #1142, commit anterior) passou TypeScript, testes, build, smoke tests e verificações dos endpoints, mas falhou no gate final de `npm audit`: 9 vulnerabilidades (3 moderadas, 6 altas). As alterações deste Run 23 ainda aguardam nova execução integral de CI.

## Reauditoria

- Prévia do Estilo 4 e prévias mais recentes dos Estilos 2 e 3 coexistem no seletor.
- A escolha continua explícita e salva antes da aplicação.
- O alias de voz não aceita o ID antigo nem permite retorno de cache antes da validação.
- Nenhum arquivo dos estilos 1–3, da Reintegração ou dos pagamentos foi alterado nesta rodada.
- PR #42 permanece em rascunho; a branch ainda está divergente da `main`. Não foi feito merge nem deploy.
