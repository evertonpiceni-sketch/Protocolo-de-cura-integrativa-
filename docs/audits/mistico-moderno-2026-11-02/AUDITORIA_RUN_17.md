# Auditoria Estilo 4 — Místico Moderno — Run 17

## Referência e regra de preservação
- Referência visual: prancha oficial do Estilo 4 enviada pelo Everton (`1001196522.png` / `file_000000009978820eb49581883ae6340d`), subordinada às decisões aprovadas posteriores.
- Aprovado permanece congelado; versões antigas, reprovadas, substituídas ou marcadas como não usar não são reintroduzidas.
- Identidade preservada: fundo noturno sofisticado; azul-noturno/índigo/esmeralda/violeta; dourado/âmbar como acentos; marfim para leitura; verde natural apenas integrado à natureza; luminosidade elegante; logo oficial sutil/transparente como assinatura.

## Reauditoria funcional da árvore atual
### 1. Seletor dos quatro estilos — pendência estrutural confirmada
`src/App.tsx` ainda condiciona a montagem de `LayoutChoiceModal` à ausência de `userProfile.visualLayout`. Uma preferência persistida continua podendo pular a escolha explícita. A correção correta é separar preferência persistida (somente pré-seleção) da confirmação obrigatória da sessão.

### 2. Ajustes > Aparência — persistência prematura confirmada
Os cards de `OFFICIAL_LAYOUTS` continuam chamando `saveProfile({ ...userProfile, visualLayout: layout.id })` diretamente no clique. Isso persiste/aplica antes da confirmação. O clique deve alterar somente um estado temporário de pré-seleção; a gravação deve ocorrer exclusivamente no CTA de confirmação.

### 3. Áudio global x Arcanjo/Solfeggio — risco confirmado no dono global
O efeito global de áudio pausa para `activeSessionDay` e `showPersonalJourney`, mas ainda não inclui `showArcanjoView`. O desbloqueio por gesto repete a mesma omissão. A correção deve ser atômica no dono global do áudio, incluindo `!showArcanjoView` nas duas condições e `showArcanjoView` nas dependências, seguida de teste real do synth/Solfeggio para evitar dupla gestão.

### 4. Reintegração da Vida — preservado
A Reintegração já executa `audioEngine.stopSpeech()` e `audioEngine.stopBG()` ao abrir. Não alterar. O logo continua sob a regra oficial de baixa opacidade, compondo como assinatura e nunca competindo com corpo neutro, movimento da luz e mensagem terapêutica.

### 5. Pagamento — preservado
O retorno de pagamento continua passando por `/api/payment/confirm`; o perfil só é atualizado quando a resposta é bem-sucedida e `data.status === 'paid'`. Não reintroduzir liberação client-side antecipada.

### 6. Visual Místico Moderno — preservado nesta rodada
As camadas exclusivas já carregadas em `main.tsx` (`mistico-moderno-approved-overrides.css`, `mistico-moderno-modal-audit.css`, `mistico-moderno-dashboard-audit.css`, `mistico-moderno-header-audit.css`) permanecem isoladas do Estilo 1/2/3. Não foi aplicada recoloração global adicional.

## Corrigido / preservado / pendente
**Corrigido/consolidado:** reauditoria sobre a árvore atual; eliminada a hipótese de que os pontos do seletor já estariam resolvidos; delimitado o ponto único correto para a futura correção do áudio global.

**Preservado:** identidade visual Místico Moderno já isolada, logo sutil/transparente, Reintegração, confirmação server-side de pagamento e camadas específicas existentes.

**Pendente prioritário:** intervenção atômica em `App.tsx` para (1) exigir confirmação explícita do estilo mesmo com preferência salva, (2) transformar cards de Aparência em pré-seleção temporária + CTA de confirmação e (3) excluir `showArcanjoView` do áudio global e do desbloqueio por gesto. Depois: build/teste e validação desktop/mobile de player, Solfeggio, Diário e animações. Não substituir voz por alias/ID antigo sem comprovação da decisão de voz mais recente.

## Limitação desta rodada
O conector de escrita disponível substitui `App.tsx` integralmente, enquanto a leitura do arquivo central é truncada pelo limite de resposta. Por preservação do aprovado, não foi feita substituição parcial/incompleta do arquivo central. Nenhum workaround por CSS/DOM foi introduzido para mascarar um problema de estado React.
