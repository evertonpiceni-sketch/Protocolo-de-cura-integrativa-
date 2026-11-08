# Auditoria RUN 79 — Estilo 2: Elegância Profunda

Data: 2026-11-08  
Branch: `main`  
Commit de código: `1c873f7d2ed88ea30fe7c2aafa321fe84c490c09`  
Commit de teste validado: `771f74460243a6e5fd96779ff6791162ba9a1716`

## Resultado

A auditoria encontrou uma inconsistência no estado anterior à escolha do estilo: o botão de confirmação do seletor permanecia dourado/âmbar mesmo sem nenhuma opção selecionada. O botão estava desabilitado, mas sua aparência já antecipava uma paleta antes da decisão explícita.

A correção foi aplicada sem alterar a aparência dos estilos depois que uma opção é selecionada.

## Corrigido

### Seletor dos quatro estilos

Em `src/components/LayoutChoiceModal.tsx`:

- O CTA permanece em taupe neutro (`#A99B84`, `#B7AD9D`, `#817460`) enquanto `selectedLayout === null`.
- Depois da seleção explícita, o CTA volta a usar o tratamento correspondente já aprovado: champagne para Essência Luminosa e dourado para os demais estilos.
- O botão continua desabilitado até existir uma escolha e enquanto a persistência está em andamento.
- A confirmação continua sendo a única ação que chama `onSelect`.

Foi acrescentada proteção em `tests/elegancia-profunda-audit.test.ts` para impedir que o dourado de um estilo volte a aparecer no CTA antes da escolha.

### Fonte visual oficial recuperada

O arquivo solicitado foi recuperado pelo identificador `file_00000000121c820e931b56bb6b1467e9` e inspecionado visualmente:

- Nome retornado: `1001194194(5).png`.
- Dimensões reais: 1536 × 1152 px.
- Observação técnica: apesar da extensão `.png`, os bytes do arquivo têm assinatura JPEG/JFIF.
- A prancha foi mantida como referência visual oficial, subordinada às decisões posteriores.

A prancha contém referências antigas, incluindo a indicação de 12 dias e um logo mais dominante. Esses elementos são apenas parte da prancha de referência: não substituem a jornada funcional aprovada de 21 dias nem a regra atual de logo discreto/transparente.

A prévia incorporada ao repositório ainda é `/brand/elegancia-profunda/prancha-oficial.svg`, com WebP de 240 × 180 px. A derivação de maior densidade ainda não foi incorporada; não foi feita ampliação artificial.

## Preservado e reauditoria

### Escolha explícita e componentes

- `selectedLayout` inicia em `null`.
- O CTA não permite confirmação sem seleção.
- `data-layout` só é aplicado quando `layoutConfirmedThisSession` está confirmado.
- Sem confirmação, o atributo visual é removido.
- A preferência só é confirmada depois da persistência bem-sucedida no servidor (quando a conta está online).
- O logout limpa a confirmação para a próxima sessão.
- `ProfileSetup` permanece neutro antes da escolha.
- `OnboardingFlow` permanece ativo; `WelcomeModal` e o CSS legado de boas-vindas não foram reativados.

### Varredura visual estática página por página

As 21 folhas CSS específicas continuam importadas em `src/main.tsx`. O teste de regressão percorre todas as 21 e verifica o escopo `data-layout="elegancia-profunda"`; a execução final passou.

Áreas cobertas pela varredura:

- base visual, hero e assinatura do logo;
- modais e Prática Individual;
- Anamnese e oração de São Miguel;
- Contato e Banhos de Ervas;
- Mapas e Numerologia;
- Diário e Diário de Reconexão;
- detalhe do dia e Ho'oponopono;
- Promoção, Configurações e áudio;
- Cursos e Conquistas;
- navegação inferior e instalação mobile;
- cabeçalho, dashboard e player.

A comparação por capturas reais de cada página em desktop e celular ainda não foi executada.

### Identidade visual

- Verde profundo intencional, dourado nobre, champagne, bronze e marfim preservados.
- Logo oficial mantido como assinatura discreta, com opacidade específica de 30%.
- `--ep-scene:none` permanece até existir fotografia de natureza exclusiva e aprovada para o Estilo 2.
- A jornada de 21 dias e o corpo neutro da Reintegração permanecem intactos.

### Voz, Solfeggio, Diário e player

- Catálogo neural preservado para o Estilo 2, sem fallback silencioso para SpeechSynthesis.
- Prévia/narração neural não inicia Solfeggio; ambiências não tonais continuam permitidas.
- Voz dedicada da Reintegração preservada.
- Diário mantém o callback de salvamento conectado ao fluxo da aplicação.
- Wake Lock do player permanece condicionado à reprodução e é liberado ao pausar/concluir.
- Animações e sincronização com áudio não foram alteradas nesta rodada.

### Pagamentos

- Checkout InfinitePay e confirmação server-side preservados.
- Verificação do valor efetivamente pago e prevenção de reutilização da transação preservadas.
- Os testes de endpoints de pagamento passaram; uma transação real controlada, webhook e liberação de acesso em produção continuam pendentes.

## CI

GitHub Actions [run #42440315260](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42440315260), no commit `771f744`:

- `npm audit`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes de regressão: 112/112 aprovados.
- Build: aprovado.
- Entry points Express: aprovados.
- Verificações de segredos, JWT fail-closed e proteção administrativa: aprovadas.
- Smoke tests: aprovados.
- Endpoints de pagamento fail-closed: aprovados.

O status da Vercel permanece em falha por `build-rate-limit`. O CI do GitHub passou, mas não há implantação de produção homologada.

## Pendências

1. Gerar e incorporar uma prévia WebP de maior densidade a partir da fonte original recuperada, sem interpolação artificial; validar integridade e dimensões.
2. Obter/aprovar fotografia real de natureza exclusiva do Estilo 2; manter `--ep-scene:none` até aprovação.
3. Comparar visualmente todas as páginas em desktop e celular, incluindo o player e a silhueta corporal neutra.
4. Testar voz neural, Solfeggio, ambiências, animações e Diário em dispositivos reais.
5. Realizar transação controlada InfinitePay, verificar webhook e liberação do acesso.
6. Aguardar liberação do limite da Vercel e confirmar publicação.

## Commits desta rodada

- `1c873f7` — CTA neutro até a escolha explícita.
- `200dd62` — primeira versão do teste de regressão (falhou por escape incorreto na asserção).
- `771f744` — correção das asserções; CI final aprovado.

## Critério de continuidade

Não reabrir paleta, logo, seletor após confirmação, isolamento CSS, jornada de 21 dias, corpo neutro, voz dedicada ou checkout sem evidência de regressão. A próxima etapa deve avançar a prévia em alta densidade, fotografia aprovada, comparação visual real e homologação funcional/produção.
