# Auditoria — Estilo 4 · Místico Moderno — Run 12

**Data:** 08/11/2026  
**Branch:** `fix/mistico-moderno-current-main-2026-11-08-run12`  
**Base:** linha principal atual do repositório  
**Referência solicitada:** `1001196522.png` / `file_000000009978820eb49581883ae6340d`

## Corrigido nesta rodada

- O catálogo neural global do Estilo 4 agora reconhece somente a escolha confirmada e usa o ID ElevenLabs salvo no perfil. O identificador é normalizado com `trim()`; não há substituição por voz do navegador.
- Ajustes de Áudio passam a exigir ID neural válido no Místico Moderno. A prévia bloqueia a troca para frequências Solfeggio enquanto a voz está tocando, sem bloquear ambiências não tonais.
- Home e player principal passam a usar o ID neural salvo. Se estiver ausente ou inválido, a narração é interrompida com erro recuperável em vez de recorrer a voz robótica/local ou a um ID presumido.
- Arcanjo passa a exigir voz neural explícita. O Solfeggio não começa antes do evento real de início da narração; pausa, erro, conclusão, troca de dia, reinício e saída interrompem o oscilador.
- A tela Arcanjo recebeu camada noturna própria, escopada a `data-layout="mistico-moderno"`; o botão legado rosa de saída é neutralizado somente neste estilo.
- As camadas de boas-vindas e Arcanjo foram carregadas no ponto de entrada do app.
- Criados testes de regressão para voz neural, Solfeggio, seletor explícito, isolamento CSS, Diário e movimento reduzido.

## Varredura estática e preservado

- Seletor React dos quatro estilos: `selectedLayout` inicia em `null`; confirmar permanece desabilitado até uma escolha; o App não define `data-layout` antes da confirmação da sessão.
- Foram inspecionados os **22 módulos CSS Místico já importados**: **303 seletores** identificados, todos escopados a `data-layout="mistico-moderno"`. As duas novas camadas (boas-vindas e Arcanjo) também são isoladas.
- Logo oficial permanece assinatura discreta: 30% desktop e 26% em telas de até 640 px.
- Diário permanece fechado por padrão; callbacks e persistência não foram alterados. O canvas e o Diário continuam respeitando `prefers-reduced-motion`.
- Nenhum arquivo de pagamento foi alterado. Permanecem checkout InfinitePay e confirmação server-side por `/payment_check`, conferência do valor e proteção contra reutilização de transação. Catálogo atual preservado: acesso R$ 25,00/7 dias e R$ 50,00/21 dias; prática específica R$ 59,90/7 dias e R$ 99,90/21 dias; PROMO15/PROMO20; VIP7 somente como degustação de teste.

## Pendente — sem substituições não aprovadas

1. O PNG original `1001196522.png` não foi recuperado na conversa/Biblioteca nem na árvore atual do repositório. Não usei a derivação antiga de baixa resolução, não fiz upscale e não substituí por outra prancha. Por isso, o card do Estilo 4 continua sendo a prévia de paleta existente, não a prancha oficial.
2. Capturas renderizadas e comparação visual de todas as páginas em desktop/mobile dependem de preview funcional. O último retorno Vercel do projeto registra bloqueio por `build-rate-limit`; não há nova implantação ou homologação de produção confirmada.
3. Faltam teste auditivo com a voz neural realmente salva e credenciais ativas, reprodução/pausa/retomada do Solfeggio, teste físico do player/animações e verificação real da persistência do Diário.
4. Falta checkout InfinitePay ponta a ponta em sandbox, incluindo webhook e liberação de acesso. Não foi feita cobrança real.
5. A CI desta branch precisa concluir para validar os novos testes e o build sobre o HEAD atual.

**Status:** correções de código preparadas sobre a linha principal atual e protegidas por testes; não mesclado nem publicado. A homologação visual/funcional integral continua aberta.
