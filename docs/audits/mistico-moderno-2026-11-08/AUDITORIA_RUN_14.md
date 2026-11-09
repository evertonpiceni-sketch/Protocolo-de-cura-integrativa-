# Auditoria — Estilo 4 · Místico Moderno — Run 14

**Data:** 08/11/2026  
**Base:** `main` em `cbb6f0acae6aea90daabfbc7b38b64e5eb62df03`.  
**Branch:** `fix/mistico-moderno-run14-current-main-2026-11-08`.  
**Referência visual oficial:** `1001196522.png` (`file_000000009978820eb49581883ae6340d`), inspecionada em 1536 × 1152 px (4:3), com 12 superfícies e paleta no próprio quadro.

## Corrigido

- A prancha oficial foi incorporada ao seletor como miniatura WebP de 320 × 240, derivada diretamente do arquivo original. O cartão do Estilo 4 usa a prancha completa, superfície noturna, borda violeta/dourada, texto marfim e CTA dourado/âmbar.
- O catálogo neural passa a incluir o Místico Moderno em Home, Ajustes, player, Arcanjo e práticas guiadas. A voz deve ser o ID neural salvo no perfil; não há fallback para SpeechSynthesis/navegador nem substituição silenciosa por Rachel, Marcus ou outra voz. ID ausente/inválido gera erro explícito.
- O Solfeggio não se sobrepõe à prévia neural. No Arcanjo, a frequência começa somente no evento real `onStart`; pausa, erro, reinício, troca de dia, conclusão e saída interrompem o oscilador.
- Anamnese e perguntas sistêmicas bloqueiam a sobreposição de 639 Hz com a voz neural e não reiniciam a frequência durante o teardown do modal.
- A reprodução global respeita a posse de áudio do protocolo Arcanjo, inclusive quando a conta tem o plano `arcanjo_7d`; o áudio global não inicia por gesto do navegador nesse estado.
- As camadas CSS do Arcanjo permanecem escopadas ao Estilo 4.

## Preservado e revalidado estaticamente

- O seletor dos quatro estilos exige escolha explícita e confirmação; não há pré-seleção automática. Logout volta a exigir confirmação e a troca de estilo nos Ajustes reabre o seletor.
- Estilos 1, 2 e 3, conteúdo, jornadas, dados e componentes aprovados permanecem sem redesenho.
- Diário permanece fechado por padrão; animações respeitam `prefers-reduced-motion`.
- Logo oficial permanece discreto/transparente, como assinatura.
- Arquivos de pagamento, preços, cupons, endpoints e webhook InfinitePay não foram alterados.

## Varredura das 12 superfícies da prancha

1. Splash/carregamento — identidade noturna e assinatura sutil.
2. Boas-vindas — imagem realista, narração neural e controles de áudio.
3. Home — voz salva, cards e navegação.
4. Menu principal — hierarquia, ícones e contraste.
5. Jornada/lista de dias — cards, progresso e cores.
6. Player do dia — voz, Solfeggio, pausa, retomada e encerramento.
7. Anamnese/teste — 639 Hz, narração e encerramento sem reinício indevido.
8. Resultado — leitura, frequência e componentes de apoio.
9. Biblioteca Integrativa — busca, cards e identidade.
10. Ferramentas de apoio — práticas e voz.
11. Comunidade — cards, imagens e navegação.
12. Perfil — dados, Diário e configurações.

A inspeção desta execução é estática e baseada no código, testes e prancha; não equivale à homologação visual em navegador.

## Pendente

- Executar CI deste novo branch (TypeScript, testes, build e auditoria de dependências).
- Homologar em navegador desktop/mobile as 12 superfícies, imagens reais, alinhamento, nitidez tipográfica, animações e opacidade do logo.
- Ouvir a voz neural selecionada e testar Solfeggio em reprodução real.
- Validar checkout e webhook InfinitePay em sandbox. Nenhuma cobrança real foi feita.
- A miniatura é uma derivação leve para o card; o arquivo original 1536 × 1152 permanece a fonte de referência.

**Regra de publicação:** manter o PR em rascunho, sem merge e sem deploy, até a homologação visual, auditiva e de pagamento.
