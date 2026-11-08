# Auditoria Run 89 — Estilo 3: Essência Luminosa

**Data:** 08/11/2026  
**Branch auditada:** `main`  
**HEAD de código antes deste registro:** `c114eaed7383ee26f33b3a255f9e7a0fcfb471e5`

## Corrigido / confirmado

1. **Ajustes da Prática:** a correção mais recente já está no HEAD `c114eaed`. A folha `src/essencia-luminosa-settings-audit.css` está importada em `src/main.tsx` e limitada a `:root[data-layout="essencia-luminosa"] #settings-view`. Ela neutraliza fundos, textos, bordas e estados de foco herdados de índigo, roxo, teal, sky, esmeralda e âmbar; o cartão de status recebe fundo marfim/champagne e os CTAs recebem o gradiente ouro suave. A inspeção do JSX confirmou que os controles legados existentes no painel são cobertos por essas regras. Nesta rodada não foi necessário repetir a correção nem acrescentar outro override.
2. **Seletor dos quatro estilos:** `LayoutChoiceModal` começa com `selectedLayout = null`, mantém o botão de confirmação desabilitado até uma escolha e informa que o estilo só é aplicado após confirmação. `App.tsx` começa com `layoutConfirmedThisSession = false`, remove `data-layout` antes da confirmação e só aplica o layout confirmado.
3. **Card oficial:** `public/brand/essencia-luminosa/prancha-oficial.webp` existe no repositório e continua sendo usado pela prévia React com `object-contain`. Não foi substituído.

## Preservado

- Paleta aprovada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, areia e oliva clara como acentos.
- Logo oficial como assinatura: opacidade de 30% (26% em telas pequenas), wrapper transparente, sem borda ou sombra dominante.
- Estilos 1, 2 e 4, conteúdo terapêutico, cálculos, estrutura e dados do Diário.
- Voz neural: IDs ElevenLabs válidos são preservados; aliases/valores legados inválidos são normalizados para a voz oficial. O Estilo 3 não usa fallback silencioso para SpeechSynthesis.
- Solfeggio: a troca de faixa fica bloqueada durante a prévia neural do Estilo 3; frequências tonais não reiniciam como trilha durante a narração. Ambiências não tonais permanecem permitidas.
- Diário: callbacks de salvamento de entrada/expectativas e exportação permanecem conectados.
- Player/animações: paleta ouro/sálvia preservada; o canvas respeita `prefers-reduced-motion`.
- InfinitePay: checkout permanece server-side, com conferência do valor em centavos e prevenção de reutilização de transação. Nenhuma regra de preço ou pagamento foi alterada.

## Pendências

1. **Natureza na Home:** `--ep-scene: none` permanece intencionalmente. Não há fotografia independente própria do Estilo 3 com aprovação comprovada. Imagens geradas em rodadas anteriores não foram incorporadas nem tratadas como aprovadas; nenhuma cena de Natural Sereno ou da Reintegração foi reutilizada.
2. **PNG-fonte da prancha:** a busca pelo nome `1001196521.png` e pelo ID `file_0000000019d0820eb7a70b6c982619d6` não recuperou o original nesta execução. O WebP versionado permanece como card; não foi feita comparação pixel a pixel.
3. **Benefício Semestral/Anual:** Numerologia Completa depende de `numerologyPurchased`; Mapa Astral Completo depende de `astralMapPurchased`. O plano PRO genérico não concede ambos. Ainda não foi encontrada tela/rota para registrar a escolha entre esses dois benefícios; não foi criada cobrança avulsa nem concessão automática.
4. **Homologação real:** faltam capturas e inspeção de todas as páginas em navegador desktop/mobile, teste real de áudio, persistência do Diário em conta e transação InfinitePay em sandbox.
5. **Publicação:** para o HEAD `c114eaed`, o Vercel registra deployment `ERROR`, código `BUILD_FAILED`, mensagem `Resource provisioning failed`. A consulta de eventos de build não retornou logs. Não é possível atribuir a falha ao código sem esses logs. O GitHub não retornou workflow runs associados a esse commit; portanto, não declaro testes/build aprovados para o HEAD atual. O último CI aprovado conhecido é do commit anterior `98e068e`, não deste HEAD.

## Ordem de continuidade

1. Recuperar o PNG-fonte e obter/aprovar uma fotografia independente para a Home; manter `--ep-scene: none` até isso acontecer.
2. Definir e implementar o registro server-side da escolha de benefício Semestral/Anual, sem liberar ambos automaticamente.
3. Fazer homologação visual página por página em desktop e celular e testes reais de voz, Solfeggio, Diário e player.
4. Resolver o erro de provisionamento no Vercel, obter CI do HEAD atual e confirmar a publicação antes de declarar conclusão.

**Conclusão:** a herança cromática do painel de Ajustes já está corrigida no HEAD atual e foi revalidada estaticamente. Não foi introduzida alteração adicional de interface nesta rodada, para evitar duplicar overrides ou reabrir componentes aprovados. O Estilo 3 permanece em andamento pelas pendências acima.
