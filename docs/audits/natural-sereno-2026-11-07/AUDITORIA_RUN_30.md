# Reauditoria — Estilo 1: Natural Sereno — RUN 30

**Data:** 08/11/2026 (horário local)  
**Branch de homologação:** `fix/natural-sereno-mainline-2026-11-08-rebased`  
**PR vigente:** #64 — aberto, sem merge  
**Commit de código auditado:** `c80572bdf2de2416f1a2163dd740a85a87067b0e`

## Corrigido nesta rodada

### Acesso ao Arcanjo sem abertura automática
- A assinatura `arcanjo_7d` continua concedendo acesso, mas não força mais a abertura do protocolo no login.
- A Home e o evento `OPEN_PROTOCOL_DAY` agora verificam o acesso antes de abrir; sem acesso, encaminham ao modal de planos.
- A compra recém-confirmada ainda abre a prática solicitada, pois essa transição decorre de uma ação explícita de pagamento.

### Ownership de áudio e Solfeggio
- A guarda de áudio bloqueia chamadas globais `startBG` enquanto o Arcanjo é dono da superfície de áudio, sem chamar `stopBG` em cada tentativa bloqueada.
- O observador interrompe áudio global apenas na entrada da tela, não em toda mutação do React.
- O timer de abertura apenas libera a trava; não interrompe novamente o áudio cinco segundos depois.
- O oscilador próprio do protocolo continua independente via `audioEngine.startSynth`, preservando as sete frequências aprovadas: 396, 417, 528, 639, 741, 852 e 963 Hz.
- Foram adicionados dois testes de regressão para impedir autoabertura e interrupção indevida do Solfeggio.

## Preservado

- Prancha Natural Sereno versionada no seletor; as decisões posteriores continuam prevalecendo sobre a prancha.
- Escolha explícita entre Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno, sem aplicar tema antes da confirmação.
- Creme/marfim, café, dourado refinado, verde-sálvia apenas como acento, paisagens realistas, enquadramento responsivo e logo discreto.
- Home, Diário e persistência, Numerologia, Mapa Astral, Banhos, Chakras, Ho'oponopono, cursos, contato e administração: nenhuma alteração visual não solicitada nesta rodada.
- Player de seis etapas, sincronização pelo áudio real, movimento reduzido e cadência respiratória 4–3–5.
- Voz neural: IDs válidos salvos no perfil continuam preservados; Marianne permanece como ID oficial de normalização para valores legados. Nenhuma voz foi trocada nesta rodada.
- Pagamentos: checkout InfinitePay, preços e cupons definidos no servidor, confirmação server-side, lock renovável de Numerologia e limite de um replay idêntico por pedido.

## Reauditoria automatizada

GitHub Actions — **Security Audit #1629**, execução `42439768840`, commit `c80572bdf2de2416f1a2163dd740a85a87067b0e`:
- `npm audit`: **0 vulnerabilidades**.
- TypeScript: aprovado.
- Testes: **125/125 aprovados** (0 falhas).
- Build: aprovado.
- Entry points Vercel, verificação de segredos, JWT, cadastro/admin e smoke tests: aprovados.
- Endpoints de pagamento: fail-closed, aprovados.

## Varredura por área

| Área | Resultado da revisão estática |
|---|---|
| Acesso/cadastro e seletor | Escolha explícita e neutra antes da confirmação preservadas |
| Home, cabeçalho, assinatura e paisagens | Tokens aprovados e CSS responsivo preservados |
| Anamnese e acolhimento | Camadas atuais preservadas |
| Diário e progresso | Persistência e superfícies claras preservadas |
| Numerologia e Mapa Astral | Checkout/rotas e tokens atuais preservados |
| Banhos, Chakras e Ho'oponopono | Sem reintrodução de chapas verdes ou amarelo saturado nas camadas Natural Sereno |
| Player e animações | Seis etapas, áudio real, 4–3–5 e movimento reduzido preservados |
| Voz e ajustes de áudio | IDs neurais salvos preservados; fallback robótico não reintroduzido no protocolo |
| Arcanjo/Solfeggio | Autoabertura removida; áudio global isolado do oscilador próprio |
| Planos e pagamentos | InfinitePay server-side e recuperação limitada preservados |

A tabela acima registra revisão de código e testes. Não equivale a homologação visual/auditiva em navegador.

## Pendências externas

- A implantação de prévia da Vercel para o commit `c80572bdf2de2416f1a2163dd740a85a87067b0e` terminou em **ERROR / BUILD_FAILED — “Resource provisioning failed”**. Não houve URL de prévia utilizável; portanto, faltam capturas reais de todas as páginas em desktop e mobile e escuta real da voz/ambiência.
- A listagem de variáveis Vercel confirma `INFINITEPAY_HANDLE` em produção, mas **não existe `INFINITEPAY_API_KEY`** em produção nem em preview. O checkout permanece fail-closed até a chave ser cadastrada no ambiente correto.
- Uma variável de preview antiga, `UPSTASH_DB_KEY`, está marcada pela Vercel com `readable-secret`; o valor não foi lido nem reproduzido e a variável não foi alterada nesta auditoria.
- Falta executar checkout em sandbox e validar retorno/webhook, sem cobrança real.

## Controle de versões

- PR #62 foi fechado como substituído pelo PR #64. Não mesclar a branch antiga.
- PR #64 permanece aberto e mergeable; não houve merge nem deploy de produção.
- Nenhuma alteração foi aplicada aos estilos 2, 3 ou 4 nesta rodada.

**Status:** correções de acesso e ownership de áudio implementadas e CI verde. Natural Sereno ainda não está homologado visualmente/auditivamente nem financeiramente até existir prévia navegável, voz/ambiência escutadas e chave InfinitePay configurada.
