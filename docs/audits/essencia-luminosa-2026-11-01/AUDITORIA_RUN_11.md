# Estilo 3 — Essência Luminosa — reauditoria 2026-11-01

Referência visual oficial: prancha Estilo 3 enviada pelo Everton (`1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`), subordinada às decisões aprovadas posteriores. Regra: aprovado = congelado; reprovado/substituído/não usar = descartado.

## Preservado / confirmado
- A camada `essencia-luminosa-approved-overrides.css` continua isolada por `data-layout="essencia-luminosa"`.
- Mantidos marfim/champagne, ouro suave e sálvia/oliva clara como acentos; sem recoloração global de outros estilos.
- Logo oficial permanece tratado como assinatura sutil/transparente.
- Tipografia mantém antialiasing/legibilidade na camada própria.
- Pagamento continua com confirmação server-side; não alterar o fluxo aprovado sem evidência de regressão.

## Regressões confirmadas na varredura
1. **Escolha explícita de estilo** — `App.tsx` ainda renderiza `LayoutChoiceModal` apenas quando `userProfile.visualLayout` está vazio. Um perfil com estilo salvo pula a escolha e aplica o layout persistido automaticamente. Isso viola a decisão posterior de exigir escolha explícita entre os quatro estilos antes da aplicação.
2. **Voz** — ainda existem fallbacks/aliases hard-coded para `Rachel` em componentes de experiência (`HooponoponoModal`, `ArcanjoProtocolView`, `ProfileSetup` e referências adicionais). Isso pode substituir ou divergir da voz selecionada. Não inventar ID de Maiara; corrigir na origem quando o identificador oficial estiver comprovado.
3. **Player/animação** — a estrutura genérica de `MeditationSession`/`SacredEnergyCanvas` continua exigindo validação contra o conceito aprovado: corpo neutro, movimento da luz, atuação na região do dia, integração e estado final perceptivelmente transformado.
4. **Solfeggio** — há lógica de parada, mas a ausência de sobreposição precisa ser validada em reprodução real ao entrar/sair do protocolo; inspeção estática não comprova ausência de instância global remanescente.

## Correção segura já vigente
A camada exclusiva do Estilo 3 permanece carregada e não deve ser ampliada para mascarar defeitos funcionais de componentes compartilhados. Correções de seletor, voz, player e animação devem ser feitas nos componentes proprietários, evitando overrides globais e preservando os quatro estilos.

## Próxima execução
Prioridade 1: corrigir o fluxo do seletor para exigir confirmação explícita sem apagar a preferência salva. Prioridade 2: eliminar fallbacks de voz que substituem a seleção do usuário, sem inventar voz/ID. Prioridade 3: teste visual e de reprodução real página por página para Home, Diário, Player, Reintegração, modais e pagamentos, confrontando com a prancha oficial e decisões posteriores.
