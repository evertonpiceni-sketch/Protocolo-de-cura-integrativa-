# Auditoria — Estilo 4: Místico Moderno
**Data:** 2026-11-07  
**Base:** `main` atual  
**Branch:** `fix/mistico-moderno-mainline-run11c-2026-11-07`  
**Status:** correções em validação; não mesclado e não publicado.

## Corrigido nesta rodada

- **Seletor:** o cartão Místico agora usa a prancha visual versionada, em fundo noturno, com imagem em `object-contain` (sem recorte), tipografia marfim e contorno violeta/dourado. A paleta do seletor passou a expor noite, índigo, esmeralda, violeta, dourado e âmbar.
- **Escolha explícita:** confirmado no código que nenhuma opção começa selecionada, o botão de confirmação permanece desabilitado sem escolha e a aplicação só ocorre após confirmação. O estado de confirmação é reiniciado no logout; a troca nas configurações continua passando pela confirmação explícita.
- **Voz:** Místico passou a exigir um ID ElevenLabs válido salvo no perfil. Ajustes de áudio, Home, player, Arcanjo, Anamnese, Perguntas Sistêmicas, Ho'oponopono e oração de São Miguel não usam Rachel/Marcus, voz fixa Marianne ou voz nativa como fallback. Sem ID neural válido, a reprodução é interrompida e o usuário recebe orientação para selecionar a voz em Ajustes de áudio.
- **Solfeggio:** 639 Hz pausa durante a narração neural do Místico na Anamnese e nas Perguntas Sistêmicas; retoma quando a narração termina. Fechar Perguntas Sistêmicas também interrompe a fala. A frequência própria do protocolo Arcanjo permanece sincronizada com a narração e é interrompida em pausa/erro.
- **Player e animações:** o player recebeu paleta própria Místico (azul noturno, violeta e dourado), identificação do dia e respeito a `prefers-reduced-motion`. O canvas mantém os efeitos discretos quando o movimento reduzido não está ativo.
- **Arcanjo:** incluída e carregada a camada CSS específica do Místico, sem alterar os demais estilos.
- **CSS por página:** os 23 módulos Místico importados foram verificados; todos têm escopo `data-layout="mistico-moderno"` e a varredura não encontrou seletores globais simples vazando para os outros estilos.
- **Marca:** preservada a assinatura oficial discreta, com opacidade 30% no desktop e 26% no mobile.
- **Pagamento:** incorporada a implementação atual do checkout InfinitePay: host `api.checkout.infinitepay.io`, chave de API obrigatória, links de pagamento único, recuperação idempotente e confirmação server-side pelo valor exato. O produto `numerology_full` usa preço fixo de R$ 90,00 (9000 centavos), sem aceitar valor informado pelo navegador.

## Preservado

- Conteúdo, roteiros, ciclos, jornadas e componentes aprovados.
- Diário e persistência existentes; o módulo visual do Diário permanece carregado e isolado.
- Identidade visual base do Místico, logo oficial, botões dourados e estilos 1, 2 e 3.
- Regras de assinatura, cupons e preços já definidos no catálogo de pagamentos.
- Política de áudio do Arcanjo e os controles existentes do player.

## Pendente / limitações

1. **Prancha original:** o PNG `1001196522.png` não está disponível como anexo montado nem na Biblioteca nesta execução. Foi recuperada a derivação WebP versionada no histórico do projeto (base64 de 44.388 caracteres, assinatura RIFF/WEBP), exibida sem corte. A derivação tem 384 × 288 px; a conferência pixel a pixel e a troca por exportação de alta resolução dependem do PNG original.
2. **Credencial InfinitePay:** o checkout agora falha de forma segura se `INFINITEPAY_API_KEY` não estiver configurada no ambiente Vercel. A chave é um segredo e não foi criada nem alterada nesta execução.
3. **Pagamento real:** nenhum pagamento foi realizado. A InfinitePay não oferece sandbox de transação equivalente ao ambiente de produção; a confirmação final requer credencial configurada e uma compra controlada de baixo valor.
4. **Homologação visual e auditiva:** a CI e o preview precisam concluir para conferir as telas renderizadas em desktop/mobile e ouvir a voz neural efetivamente salva no perfil. O código não fixa um nome/ID de voz; ele respeita o ID salvo.
5. **Produção:** nenhuma mesclagem em `main`, alteração de segredo ou publicação foi executada.

## Validação estática

- 23/23 módulos CSS Místico importados e isolados.
- Seletor com escolha explícita e prancha em `object-contain`.
- Testes de regressão adicionados em `tests/mistico-moderno-mainline-audit.test.ts`.
- Testes de pagamento atualizados para checkout de uso único, valor fixo de numerologia e confirmação server-side.
- CI/preview: aguardando execução após abertura do PR.
