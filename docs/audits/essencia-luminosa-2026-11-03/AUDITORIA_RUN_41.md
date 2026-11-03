# Auditoria — Estilo 3 Essência Luminosa — Run 41

Referência visual oficial: prancha Estilo 3 enviada pelo Everton (`1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`), sempre subordinada às decisões aprovadas posteriores. Regra aplicada: aprovado = congelado; reprovado/substituído/não usar = descartado.

## Reauditado e preservado
- Identidade do Estilo 3 mantida clara, leve e expansiva: marfim/champagne/ouro suave com sálvia/oliva clara/areia natural como acentos.
- Logo oficial permanece sutil/transparente como assinatura, sem competir com a experiência visual.
- Camadas já aprovadas do Estilo 3 para canvas, header, Diário, Numerologia, instalação móvel e vídeo de apresentação não foram reabertas nem substituídas por estilos antigos.
- Pagamento continua com confirmação server-side antes de atualizar o perfil; não reintroduzir PIX manual.
- A proteção runtime `src/lib/arcanjoAudioOwnershipPatch.ts` continua sendo a guarda ativa contra reinício da trilha global durante Arcanjo/Solfeggio; não duplicar comportamento sem necessidade.

## Achados comprovados na árvore atual
1. **Seletor dos quatro estilos — ainda incorreto:** `src/App.tsx` continua montando `LayoutChoiceModal` somente quando `!userProfile.visualLayout`. Assim, uma preferência persistida ainda pode pular a escolha explícita. O próprio `LayoutChoiceModal` já exige seleção + confirmação quando é montado; o defeito está na condição de montagem do App. A preferência salva deve ser, no máximo, pré-seleção; não confirmação automática.
2. **Aplicação automática do tema:** `App.tsx` continua sincronizando `document.documentElement.dataset.layout` diretamente de `userProfile.visualLayout`, antes de uma confirmação explícita da sessão. Esse fluxo deve ser desacoplado da preferência persistida quando a correção do seletor for aplicada.
3. **Áudio / Solfeggio:** o cálculo principal de `shouldPlay` e o desbloqueio por gesto em `App.tsx` ainda não incluem `showArcanjoView`. Existe proteção runtime específica já carregada para o Arcanjo, portanto a experiência está protegida por essa guarda; ainda assim, consolidar a regra diretamente no ownership do App reduzirá fragilidade futura.
4. **Voz:** `ArcanjoProtocolView.tsx` ainda usa fallback nominal genérico `Rachel`/`Marcus` e, no fallback nativo, `preferElevenLabs: false`. Não substituir por outro ID inventado. A voz feminina BR aprovada deve ser ligada somente ao identificador oficial comprovado.

## Correção segura desta rodada
- Nenhum CSS global ou recoloração adicional foi aplicado: a varredura não justificou nova camada visual e isso poderia reintroduzir contaminação entre estilos.
- Nenhum conteúdo terapêutico, preço, gate de acesso, roteiro, Diário ou componente aprovado foi reescrito.
- Não foi feita substituição integral de `App.tsx`: a ação disponível de escrita substitui o arquivo inteiro e a leitura do conector é entregue truncada; sobrescrever nessas condições criaria risco real de apagar alterações aprovadas concorrentes. A correção estrutural ficou isolada e especificada acima para aplicação atômica quando houver edição por patch/diff.

## Pendente
- Aplicar patch atômico no `App.tsx` para exigir confirmação explícita dos quatro estilos e separar preferência persistida de aplicação confirmada.
- Consolidar `showArcanjoView` no ownership de áudio do `App.tsx`, preservando a guarda runtime já existente até validação.
- Validar em execução desktop/mobile: voz feminina BR oficial, Solfeggio, player, animações, proporção das imagens e ausência de heranças cromáticas em estados interativos.
- Validar build/deploy após os patches funcionais; não marcar como validado sem execução real.
