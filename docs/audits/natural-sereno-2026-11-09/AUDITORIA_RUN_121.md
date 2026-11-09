# Auditoria RUN 121 — Estilo 1 · Natural Sereno

Data: 9 de novembro de 2026  
Projeto: `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
Branch: `fix/natural-sereno-mainline-run111-2026-11-09`

## Corrigido

- A frequência 639 Hz era iniciada nas telas Anamnese e Perguntas Sistêmicas mesmo quando o áudio global estava desativado.
- A mesma frequência podia permanecer sobreposta à narração neural.
- Centralizada a regra `shouldPlayInlineSolfeggio`: só permite Solfeggio com a tela aberta, áudio habilitado e sem carregamento/reprodução de voz.
- Anamnese e Perguntas Sistêmicas agora pausam 639 Hz antes da narração neural, marcam o estado global de preview para bloquear novas partidas de Solfeggio e retomam a frequência somente após o término/erro/cancelamento da voz, respeitando o controle do usuário.
- Removido o temporizador fixo de 12 segundos que podia declarar a narração encerrada antes do áudio real.
- O controle de 639 Hz da Anamnese ainda usava um botão verde-esmeralda. Foi convertido para creme/café/dourado, com estado visual coerente quando o áudio está desligado ou a narração está ativa.
- Acrescentados testes de política de áudio e de integração dos dois componentes.

## Preservado

- Paleta, paisagens, tipografia, botões premium e assinatura discreta do Natural Sereno.
- Marianne/voz neural oficial; sem fallback para SpeechSynthesis no Natural Sereno.
- Diário, progresso, player, corpo neutro, seis etapas e animações.
- Regras de checkout, preços, cupons e confirmação server-side da InfinitePay.
- Identidade e regras dos Estilos 2, 3 e 4; não houve redesenho nem integração com a main.

## Pendente

- CI do novo commit: aguardando execução; não declarar aprovação antes do resultado.
- Vercel: último estado consultado sem deployment READY; provisionamento limitado por quota diária. Nenhum deployment manual foi forçado.
- Homologação visual renderizada, página por página em desktop/mobile.
- Escuta real da voz, Solfeggio, ambiência e retomadas em navegador/dispositivo.
- Sandbox InfinitePay, confirmação e webhook.
- O arquivo original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` não foi recuperado pela busca da Biblioteca nesta rodada; a referência versionada existente no repositório foi preservada, sem substituição por outra arte.

Nenhum merge, publicação em produção ou cobrança foi realizado nesta auditoria.
