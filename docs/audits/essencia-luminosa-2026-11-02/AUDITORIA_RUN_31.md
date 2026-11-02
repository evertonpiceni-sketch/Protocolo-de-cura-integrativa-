# Auditoria Estilo 3 — Essência Luminosa — Run 31

## Corrigido nesta passagem
- Nenhum override visual novo foi adicionado sem alvo comprovado. A camada atual do Estilo 3 já cobre a Prática Individual e as superfícies auditadas anteriormente; ampliar CSS agora esconderia defeitos funcionais em vez de corrigi-los.
- A auditoria avançou para a lógica de pagamento e áudio, separando regressão funcional de herança meramente visual.

## Preservado
- Identidade Essência Luminosa: marfim/champagne/ouro suave, sálvia/oliva clara/areia natural, tipografia nítida e logo oficial discreto/transparente.
- Correções congeladas de header, boas-vindas, Diário, Mapa Astral, Numerologia, Contato, Apresentação, Prática Individual, barra de ações e canvas.
- Proteções de áudio existentes: `App.tsx` contém `stopBG()` durante sessão ativa/Reintegração e `PersonalJourney21.tsx` possui guarda defensiva com `stopBG()` ao iniciar a meditação.
- Confirmação segura do pagamento continua server-side; não foi substituída por liberação local.

## Achados comprovados / pendentes
1. **Prática Individual — PIX manual legado:** `SpecificTreatmentModal.tsx` ainda copia `evertonpiceni@gmail.com`, mostra a chave na interface e informa que ela é copiada automaticamente. Isso conflita com a decisão vigente de usar InfinitePay; deve ser removido na origem, deixando PIX apenas como método solicitado ao checkout.
2. **Prática Individual — valor divergente na interface:** o cálculo usa R$ 59,90 para 7 dias e R$ 99,90 para 21 dias, mas a seção “Valor da prática” ainda exibe texto fixo `R$ 70,00`. É regressão funcional/UX e precisa ser substituída pelo `formattedFinalPrice`/preço-base correspondente.
3. **Solfeggio:** `App.tsx` e `PersonalJourney21.tsx` já têm guardas estáticas para interromper o fundo durante sessão. A Anamnese, porém, reinicia `userProfile.bgMusicType` no cleanup após parar 639 Hz; é necessário validar em execução a sequência Anamnese → protocolo para garantir que esse restart não dispute com a guarda da sessão.
4. **Seletor de estilos:** permanece necessária confirmação explícita antes da aplicação, inclusive quando existe preferência persistida.
5. **Voz:** não substituir aliases/fallbacks por ID presumido. A voz feminina oficial aprovada deve ser ligada somente com identificador comprovado.
6. **Player/animações:** validação executada desktop/mobile continua necessária; proteção estática não equivale a aceite visual/auditivo.

## Próxima correção segura
Prioridade: remover da origem o bloco de PIX manual e o auto-copy em `SpecificTreatmentModal.tsx`, mantendo `paymentMethod='pix'` apenas como parâmetro para `/api/payment/create-checkout`; na mesma edição, eliminar o `R$ 70,00` fixo e usar o preço calculado. Depois reauditar checkout, confirmação server-side e liberação de acesso antes de tocar em outro componente.