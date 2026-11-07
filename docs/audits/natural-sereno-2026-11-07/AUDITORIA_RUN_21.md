# Auditoria — Estilo 1 Natural Sereno — Run 21

**Data:** 7 de novembro de 2026  
**Branch:** `fix/natural-sereno-marianne-voice-2026-11-07`  
**Base:** `fad7f79bcbd2cfbf39e4ed6e2afa9c46257f4bc4`  
**Referência visual:** prancha do Everton `1001196520.png` / `file_00000000317c820ebaad657dc3680de5`. A referência orienta composição e presença de natureza; as decisões posteriores aprovadas continuam prevalecendo para a paleta clara creme/marfim, café, dourado refinado e verde apenas como acento.

## Corrigido

- O ajuste de voz do Natural Sereno ainda permitia seleção de voz instalada no dispositivo e fallback silencioso para SpeechSynthesis. Isso podia substituir a voz neural aprovada por uma voz robótica do navegador.
- Removido o bloco global antigo de cadastro/login que ainda aplicava a arte da Reintegração, chapas verde-escuras e tratamento de logo forte. As regras `.ep-auth-style-one` obsoletas foram descartadas das folhas Natural Sereno; o fluxo atual permanece no shell neutro `ep-auth-prestyle`, com a assinatura discreta aprovada. Os assets da Reintegração fora do shell de autenticação foram preservados.
- As telas de chegada, player e acolhimento mantêm as fotografias aprovadas, mas os fallbacks sólidos e overlays verdes foram substituídos por café `#2A2421`; assim, a falha eventual de uma imagem não revela uma grande chapa verde.
- Natural Sereno agora carrega o catálogo ElevenLabs quando os ajustes de áudio são abertos.
- A página principal de Configurações também mostra e testa o mesmo ID neural resolvido; perfis com nome/URI antigo de voz do dispositivo passam a exibir Marianne, sem prévia divergente.
- A voz Marcus da tela TransformationHome (acolhimento e leitura de resultados) permanece separada; a correção não a mistura com a voz Marianne aprovada para o player do protocolo.
- A voz aprovada **Marianne — Meditação** (`mJqP14JQFEK0PojR5lfV`) passa a ser a seleção inicial quando o perfil não contém um ID ElevenLabs válido.
- O teste de voz do Natural Sereno não recorre silenciosamente à voz do dispositivo; falhas da voz neural são exibidas ao usuário.
- O player dos protocolos de 21 e 7 dias usa obrigatoriamente Marianne em português, conforme a decisão congelada no commit de 16/09/2026; para outros idiomas, mantém um ID neural válido salvo ou usa Marianne como padrão.
- Os dois seletores de voz (Configurações e Ajustes Avançados) exibem e bloqueiam a troca para Marianne quando o idioma ativo é português; para outros idiomas, o catálogo continua disponível.
- Marianne foi incluída no catálogo curado do endpoint de vozes, para continuar disponível mesmo quando a consulta dinâmica da conta ElevenLabs falhar.
- Criado teste de regressão para seleção, catálogo e ausência de fallback de dispositivo.

## Preservado

- Seletor React único dos quatro estilos, seleção inicial vazia e confirmação explícita antes da aplicação; preferência persistida não equivale a consentimento.
- Paleta vigente do Natural Sereno: creme/marfim `#FAF7F2`, café `#2A2421`, dourado `#C89D52` e verde natural apenas como acento.
- Prancha oficial continua como referência do card; paisagens realistas e os enquadramentos desktop/mobile existentes foram preservados.
- Logo oficial permanece como assinatura discreta/transparente (30% no cabeçalho desktop e 26% no mobile).
- Ordem das folhas CSS preservada; `natural-sereno-approved-overrides.css` continua como última camada temática do Estilo 1.
- Solfeggio exato, ownership de áudio do Arcanjo, pausa da trilha global durante sessões e Reintegração, Diário, player, animações e conteúdo aprovado não foram reescritos.
- Prática Individual e Numerologia continuam no checkout InfinitePay; nenhuma chave PIX manual foi reintroduzida. A liberação geral permanece condicionada à confirmação server-side `status === 'paid'`.

## Pendente

1. Executar build, TypeScript e testes automatizados no CI após o commit.
2. Testar reprodução real da Marianne em conta autenticada com ElevenLabs configurado; esta auditoria estática não comprova disponibilidade de chave/API em produção.
3. Homologar visualmente todas as páginas em navegador real, desktop e mobile; os artefatos anteriores foram consultados, mas novas capturas renderizadas não foram produzidas nesta rodada.
4. Executar checkout/webhook InfinitePay em sandbox; nenhum pagamento real foi iniciado.

**Status:** correção de voz implementada em branch de revisão. Homologação visual e validação de produção permanecem abertas.
