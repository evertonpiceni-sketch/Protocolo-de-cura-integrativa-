# Auditoria — Estilo 3 Essência Luminosa — Run 53

Referência visual: prancha oficial 1001196521.png / file_0000000019d0820eb7a70b6c982619d6, subordinada às decisões aprovadas posteriores.

## Corrigido
- O player de protocolo (MeditationSession) agora respeita a voz personalizada salva no perfil também no Estilo 3. Antes, o Estilo 3 ignorava voiceId e forçava OFFICIAL_PROTOCOL_VOICE_ID; agora segue a mesma resolução segura já usada pelo Estilo 2, com a voz oficial como fallback para aliases legados.
- Corrigida a retomada indevida de Solfeggio ao iniciar a sessão: o efeito de áudio do player reiniciava bgMusicType mesmo quando era uma frequência (432/528/741/963 Hz etc.). Agora frequências Solfeggio permanecem interrompidas durante a narração do protocolo; ambiência não tonal, como ondas, continua permitida.
- Criada a política testável src/lib/protocolSessionAudioPolicy.ts e adicionados testes de regressão para voz salva e bloqueio de frequências no player.
- Corrigido comentário impreciso no seletor: a prancha exibida pertence ao Estilo 3, não ao Estilo 2.
- Confirmada a presença do asset public/brand/essencia-luminosa/prancha-oficial.webp (14.512 bytes) e sua utilização pelo seletor React em LayoutChoiceModal.tsx.

## Preservado
- Os quatro estilos e a confirmação explícita antes da aplicação. App.tsx mantém layoutConfirmedThisSession=false no início, retira data-layout antes da confirmação e aplica somente após a persistência ser aceita.
- Paleta do Estilo 3: marfim #FFFFF8, champagne #F7F3E8, ouro suave #C6A46A, sálvia #A6B49B.
- Logo oficial sutil/transparente como assinatura (30%; 26% em telas pequenas).
- Diário, Anamnese, Ho'oponopono, Numerologia, Mapa Astral, boas-vindas, apresentação, navegação, conquistas, cursos, banhos, canvas e camadas CSS isoladas já aprovadas.
- Seis etapas, texto, respiração, callbacks, controles e animações do player.
- Reintegração da Vida continua independente do tema e com ownership próprio de áudio.
- Checkout InfinitePay e confirmação server-side; não foi reintroduzido PIX manual, preço, cupom ou regra de acesso.

## Reauditoria de código
- main.tsx carrega as camadas específicas do Estilo 3 depois das folhas-base; as folhas dos outros estilos continuam limitadas por seus próprios seletores.
- LayoutChoiceModal permanece como seletor React único; o seletor DOM antigo não é montado.
- O áudio global do App já considera sessão ativa, Reintegração e Arcanjo antes de iniciar a trilha global.
- paymentRoutes.ts cria checkout InfinitePay e só libera acesso após confirmação do provedor. Os testes existentes cobrem autenticação, valor, webhook, idempotência e práticas específicas.
- As antigas rotinas de cópia de chave PIX não aparecem mais nos fluxos de Numerologia e Prática Individual; o e-mail de contato é funcionalidade separada, não pagamento.

## Pendente
- Executar npm run lint, npm test e npm run build em ambiente com dependências; o conector GitHub não executa esses comandos.
- Validar visualmente cada tela em desktop e mobile com capturas renderizadas; a existência da prancha no seletor não substitui a comparação de todas as páginas.
- Testar em runtime a voz escolhida via ElevenLabs, a interrupção/retomada de áudio, o player e as animações.
- Validar checkout e confirmação InfinitePay em ambiente de teste, sem transação real.
- Concluir a revisão das fotografias de natureza reais nas páginas, utilizando somente assets aprovados.
