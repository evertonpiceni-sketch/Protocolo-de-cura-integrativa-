# Auditoria — Estilo 1 Natural Sereno — Run 17

## Referência e regra de preservação
- Referência visual oficial: prancha do Estilo 1 enviada pelo Everton (`1001196520.png` / `file_00000000317c820ebaad657dc3680de5`), sempre subordinada às decisões aprovadas posteriores.
- Aprovado permanece congelado; versões antigas, reprovadas, substituídas ou marcadas como não usar não são reintroduzidas.
- Identidade preservada: natureza realista; base clara creme/marfim; café/marrom; dourados refinados; verde somente como acento natural; logo oficial sutil/transparente como assinatura.

## Reauditoria da árvore atual
### 1. Seletor dos quatro estilos — regressão estrutural ainda ativa
`src/App.tsx` continua renderizando `LayoutChoiceModal` somente sob `!userProfile.visualLayout`. Assim, um perfil com preferência persistida ainda pode entrar sem receber a escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno.

A correção aprovada deve separar duas responsabilidades: a preferência persistida serve apenas como pré-seleção; a aplicação na sessão depende de confirmação explícita do usuário.

### 2. Ajustes > Aparência — persistência prematura
A auditoria cruzada confirma que os cards de aparência ainda persistem `visualLayout` diretamente no clique. Isso conflita com a decisão de mostrar prévia/seleção antes de aplicar. O clique deve alimentar estado temporário; somente o CTA de confirmação deve chamar `saveProfile`.

### 3. Solfeggio / áudio global — nova regressão funcional confirmada
O efeito global de áudio em `App.tsx` interrompe música para `activeSessionDay` e `showPersonalJourney`, mas não considera `showArcanjoView`. O desbloqueio por gesto repete a mesma omissão. Isso mantém risco real de o áudio global continuar/reiniciar enquanto a experiência do Arcanjo/Solfeggio está ativa.

A correção correta é atômica no dono global do áudio: incluir `!showArcanjoView` nas duas condições `shouldPlay` e incluir `showArcanjoView` nas dependências dos efeitos correspondentes. Depois, validar em execução para garantir que o synth/Solfeggio do protocolo continue sendo o único dono do áudio durante a experiência.

### 4. Reintegração da Vida — preservada
A Reintegração já executa `audioEngine.stopSpeech()` e `audioEngine.stopBG()` ao abrir. Não alterar. O logo deve permanecer em baixa opacidade, como assinatura visual, sem competir com corpo neutro, movimento da luz e mensagem terapêutica.

### 5. Pagamento — preservado
O retorno continua passando por `/api/payment/confirm`, e o perfil só é atualizado após resposta bem-sucedida com `data.status === 'paid'`. Não reintroduzir liberação client-side antecipada.

### 6. Visual Natural Sereno — preservado nesta rodada
As correções já consolidadas na camada `natural-sereno-approved-overrides.css` permanecem válidas, inclusive neutralização de heranças índigo/verde-escuro em cabeçalho, Ajustes e CTAs auditados. Não foi introduzida recoloração global adicional.

## Corrigido / preservado / pendente
**Corrigido/consolidado:** reauditoria sobre a árvore atual e identificação precisa da omissão de `showArcanjoView` no dono global do áudio, evitando atacar o Solfeggio no componente errado.

**Preservado:** Natural Sereno já refinado, logo sutil/transparente, Diário e conteúdo terapêutico sem regressão comprovada, Reintegração e confirmação server-side de pagamento.

**Pendente prioritário:** intervenção atômica em `src/App.tsx` para (1) exigir confirmação explícita dos quatro estilos mesmo com preferência salva, (2) transformar Aparência em pré-seleção + confirmação e (3) impedir áudio global durante `showArcanjoView`. Depois executar build/teste e validação desktop/mobile de paisagens, player, animações, voz e Solfeggio.

## Limitação desta rodada
O conector de escrita disponível substitui `src/App.tsx` integralmente, enquanto a leitura do arquivo central é truncada pelo limite de resposta. Para não apagar código aprovado, não foi feita substituição incompleta nem workaround por CSS/DOM. A intervenção deve ser realizada quando houver edição segura por patch ou acesso integral ao arquivo.