# Reauditoria do Estilo 1 — Natural Sereno

23/10/2026 · Método informado por Everton: varredura completa → revisão individual → correção mínima → reauditoria → relatório breve. Referência: prancha `natural-sereno-2026-10-04/reference.jpg` e capturas enviadas pelo usuário. A skill pessoal não está disponível como arquivo; o método foi aplicado a partir das instruções fornecidas.

## Resultado e alterações

1. **Abertura e Home — corrigidas e conferidas.** Ampliada a composição no desktop, mantendo o mobile e os elementos existentes. A arte vertical do acolhimento aparece inteira com extensão ambiental da mesma imagem. Corrigido o retorno ao topo ao entrar na Home. O card do momento e os blocos PIX/ações indicados receberam a base creme/dourada do Modelo 1. Preservados os fundos de natureza e ícones verdes da referência.
2. **Varredura — 63 estados, 189 verificações.** Capturas em 320×568, 390×844 e 1365×768, incluindo rolagem, formulários, estados vazios, Configurações e diálogos. Nenhum erro JavaScript, overflow horizontal ou controle sem nome acessível nos estados verificados. Foco inicial, Tab e Escape passaram nos diálogos cobertos. [Inventário completo](coverage.md) · [Resultados](results.json).
3. **Players e animações — aprovados nos testes locais descritos.** Player principal: seis etapas e sete tamanhos, WAV real de teste, seek, pausa/retomada, volume, roteiro, resposta atrasada, troca de etapa em aba oculta, animação ambiental, Media Session e Wake Lock. Players de 7 e 21 dias: controles do sistema e saída. As cinco fases visuais do Dia 1 acompanharam o relógio do áudio. Corrigidos descarte de áudio atrasado, limpeza dos controles do sistema, sincronização da pausa e rolagem do player de Reintegração em telas baixas. O fixture de áudio suporta HTTP Range; sem isso, um seek de teste voltava a zero e produzia um falso resultado de animação estática. [Player principal](protocol-player/checks.json) · [Players adicionais](extra-players/checks.json).
4. **Pagamento — integração implementada e criação real validada, sem cobrança.** A rota anterior sempre retornava 503. Agora cria checkout InfinitePay para `evertonterapeutareiki`, com preços e cupons conferidos no servidor. Abrange planos e práticas individuais. Relatos privados não são enviados ao provedor. A confirmação consulta o provedor e confere o valor antes de conceder acesso; redirecionamento ou webhook isolados não liberam PRO. Acrescentada a rota já solicitada pela interface para VIP7, com bloqueio de reutilização. O retorno do checkout atualiza o perfil somente após confirmação segura; o teste de navegador passou de pendente para confirmado em duas consultas e removeu os parâmetros de retorno. [Teste do retorno](payment-return-ui.json). A rota real criada em servidor local isolado respondeu 200, retornou `checkout.infinitepay.io` e manteve a conta gratuita. [Evidência sem URL de cobrança](payment-live-route.json).
5. **Verificação técnica — aprovada.** `npm run lint`, 35 testes sem falhas/pulos, `npm run build` e teste de foco dos diálogos. Permanece o aviso preexistente de tamanho do bundle. Textos dos dias, conteúdo canônico, preços padrão, seleção e progresso preservados. Sem alteração de dependências/lockfile.

## Capturas

[Home desktop](screens/home-1365.png) · [Acolhimento desktop](screens/welcome-1365.png) · [Planos/PIX](screens/plans-390.png) · [Checkout na interface](screens/free-upgrade-390.png).

As três visões gerais e todas as capturas mobile dos 63 estados estão nesta pasta. As visões gerais representam a varredura; quando houve acabamento posterior, a captura individual final em `screens` prevalece.

## Limites reais

- A API InfinitePay aceitou a criação real de checkout. A página externa de pagamento não pôde ser conferida visualmente neste ambiente: Chromium acusou certificado não reconhecido e a solicitação HTTPS verificada por Python retornou 403. Não se desativou TLS. Não houve preenchimento de cartão, pagamento PIX, cobrança, estorno ou confirmação financeira real. O fluxo de confirmação foi testado com provedor simulado, incluindo valor divergente, compra de outra conta, repetição, cupons e relato privado. Isto não certifica liquidação real nem concorrência entre instâncias de produção.
- Login, cadastro, comunidade e ações administrativas das capturas usam dados sintéticos. Nenhuma conta real foi modificada para a auditoria.
- Segundo plano foi verificado com aba realmente oculta. Bloqueio físico da tela, teclado virtual, notch e política de energia em Android/iPhone dependem de aparelho real. Fallback Web Speech pode ser suspenso pelo sistema.
- As fontes oficiais foram obtidas por HTTPS com verificação TLS e servidas pelo fixture local quando necessário, sem alterar o armazenamento de confiança. A skill de configuração do ambiente foi utilizada; instalação e inicialização reproduzíveis foram salvas no rascunho. Revisar/salvar e publicar esse ambiente é uma ação distinta do deploy do aplicativo.

## Reprodução

`npm ci --cache /tmp/protocolo-npm-cache --no-audit --no-fund`; `npm run lint`; `npm test`; `npm run build`; `npm run preview -- --host 127.0.0.1 --port 4180`.

Para capturas: `python scripts/prepare-audit-fonts.py`, depois `PLAYER_QA_FONTS=/tmp/player-audit-fonts AUDIT_SCROLL=1 node scripts/audit-layout1.cjs`.

Player principal: `PLAYER_QA_FONTS=/tmp/player-audit-fonts JORNADA_QA_URL=http://127.0.0.1:4180 node scripts/audit-jornada-mobile.mjs after --audio --race --pending-pause`.

Players adicionais: `node scripts/audit-extra-players.cjs`. Todos esses scripts usam dados sintéticos e mídia de teste. Não simulam sucesso financeiro na aplicação publicada.

Compilação validada: index-BSfVmHdN.js, index-V3LUpK_S.css.

## Implantação ainda pendente

A implementação foi enviada ao `main` em `95684e0`. Na conferência após o push, o endereço público respondeu HTTP 200, mas continuou servindo os assets anteriores `index-7fZdwNcS.js` / `index-5Cu-5DaH.css`. A nova rota `/api/payment/confirm` respondeu 404 em produção; na versão corrigida, uma chamada sem sessão recebe 401. Portanto, as correções estão no GitHub e validadas localmente, mas **não foi confirmada sua implantação no site público**. [Verificação](production-status.json).

Não há credencial Vercel nem configuração local do projeto neste ambiente. O acesso à API de status do GitHub retornou Forbidden, e não há ferramenta de deploy Vercel conectada. Para concluir, é necessário executar o deploy do `main` no painel Vercel e verificar a abertura do checkout na versão implantada. Como alternativa para permitir a implantação por esta sessão, foi salva no rascunho a exigência `VERCEL_TOKEN`, a ser preenchida somente nas configurações seguras do ambiente, junto dos domínios necessários. Nenhum valor secreto foi solicitado em chat. O rascunho precisa ser revisado/salvo e o ambiente publicado para ativar a configuração; isso não publica automaticamente o aplicativo.
