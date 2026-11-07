# Auditoria — Estilo 4 Místico Moderno — Run 22

Data: 07/11/2026  
Base: branch `main` vigente no início desta rodada  
Branch de correção: `fix/mistico-moderno-audit-run22-2026-11-07`

## Referência e precedência

- Referência visual oficial declarada: prancha do Estilo 4 `1001196522.png` / `file_000000009978820eb49581883ae6340d`.
- O arquivo exato não ficou disponível nos anexos acessíveis desta conversa nem foi localizado na busca da Biblioteca nesta execução. Nenhuma prancha antiga ou imagem substituta foi usada; a comparação visual fiel continua pendente.
- Decisões aprovadas posteriores prevalecem. A assinatura oficial da Reintegração da Vida permanece sutil/transparente, com opacidade reduzida, sem competir com a experiência.

## Corrigido

1. **Voz oficial Marianne — Meditação:** o ID aprovado `mJqP14JQFEK0PojR5lfV` agora é aplicado a todos os pontos de entrada de áudio do Místico Moderno: player de protocolo, meditação guiada, chamadas segmentadas e prévias de voz. Rachel, Marcus e nomes de vozes instaladas no dispositivo deixam de ser enviados como substitutos quando o Estilo 4 está ativo.
2. **Sem fallback robótico no Estilo 4:** `speakWithElevenLabsOrFallback` passou a aceitar política explícita de fallback. No Místico Moderno, falhas da ElevenLabs são reportadas e encerram a tentativa; não iniciam `SpeechSynthesis` do navegador. Os ajustes exibem Marianne como voz oficial e mostram erro quando a voz não está disponível.
3. **Solfeggio/Arcanjo:** a proteção de áudio global bloqueava também o synth porque `startSynth()` chamava `startBG()`. Foi acrescentado um marcador interno para distinguir a chamada do synth: o áudio de fundo global continua bloqueado enquanto Arcanjo está aberto, mas a frequência Solfeggio do próprio protocolo pode iniciar e retomar. A falha da voz segmentada não conclui falsamente o protocolo.
4. **Identidade do Arcanjo no Estilo 4:** adicionados pontos de ancoragem ao protocolo, ao fundo, ao palco dos chakras e à legenda; incluída folha CSS exclusiva com fundo noturno, índigo, violeta e dourado/âmbar. A folha é limitada a `data-layout="mistico-moderno"`.
5. **Seletor e sessão:** a aplicação já condicionava `data-layout` à confirmação explícita; essa regra foi preservada. Ao sair da conta, a confirmação da sessão e a solicitação pendente do seletor agora são reiniciadas. Foram removidas condições inalcançáveis da prévia React, sem alterar os quatro estilos.
6. **InfinitePay — Numerologia completa:** o modal enviava `productType: numerology_full`, mas o backend aceitava apenas assinatura e prática específica, rejeitando a compra. O backend agora cria checkout InfinitePay por valor fixo server-side de R$ 90,00 e concede `numerologyPurchased` somente após confirmação verificada do provedor. O valor enviado pelo cliente é ignorado; cupons não previstos para este produto são rejeitados.
7. **Testes:** atualizados os testes de falha do player, acrescentados testes para a voz Marianne sem fallback, preservação do synth Solfeggio e checkout/entitlement da Numerologia.

## Preservado

- Os quatro estilos oficiais e a exigência de escolha explícita antes de ativar qualquer tema.
- As 22 folhas CSS específicas já importadas para o Místico Moderno foram verificadas; todos os seletores de estilo encontrados estão condicionados ao atributo do Estilo 4. Nenhum seletor global não escopado foi encontrado nessa varredura.
- Diário, Journal, mapas, cursos, conquistas, modais, navegação, player e folhas específicas existentes; nenhuma alteração cosmética ampla foi feita.
- `SacredEnergyCanvas` permanece montado em `MeditationSession`, usa `requestAnimationFrame`, respeita `prefers-reduced-motion`, acompanha o tempo real do áudio e trata a visibilidade da página.
- A proteção de áudio da Reintegração e a assinatura oficial discreta não foram alteradas.
- Planos de 7 e 21 dias, cupons PROMO15/PROMO20, degustação VIP7 e checkout de prática específica permanecem com suas regras atuais. Nenhuma chave PIX manual foi reintroduzida.

## Pendente

1. Comparação visual com a prancha exata `1001196522.png`; o arquivo precisa estar acessível para confirmar imagens, alinhamento, tipografia, botões, prévias e assinatura.
2. Homologação renderizada em navegador, desktop e celular, incluindo todas as páginas, o Diário, o player, animações e responsividade. A inspeção desta rodada foi estática; não equivale a aprovação visual.
3. Audição real da voz Marianne e teste real das sete frequências Solfeggio com `ELEVENLABS_API_KEY` e áudio habilitados no ambiente. Os testes automatizados simulam falhas e verificam que não há substituição por voz do navegador.
4. Checkout real InfinitePay em ambiente de homologação/produção; os testes automatizados usam provedor simulado.
5. Build, lint e testes da branch após abertura do PR. Nenhum merge ou deploy de produção foi feito nesta rodada.

## Estado de entrega

As correções estão em branch baseada na `main` atual e serão submetidas em PR de rascunho. A homologação integral permanece aberta até a referência visual e os testes reais de navegador/áudio/pagamento serem concluídos.
