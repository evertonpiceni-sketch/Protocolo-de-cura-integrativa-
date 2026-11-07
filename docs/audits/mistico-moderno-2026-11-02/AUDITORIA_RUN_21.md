# Auditoria — Estilo 4 Místico Moderno — Run 21
Data: 07/11/2026

## Corrigido nesta rodada
- Logout agora encerra também a confirmação visual da sessão e limpa a solicitação pendente. Ao entrar com outra conta na mesma aba, a preferência anterior não é tratada como consentimento: o seletor explícito volta a ser exigido.
- A tela Arcanjo/Solfeggio recebeu tratamento noturno próprio do Místico Moderno, limitado a `data-layout="mistico-moderno"`. O fundo creme/verde herdado foi substituído por azul-noturno/índigo, violeta discreto, dourado/âmbar e texto marfim. O indicador de dias não concluídos usa índigo no Estilo 4.
- O áudio global já estava protegido: `App.tsx` bloqueia o background durante Arcanjo e a proteção `arcanjoAudioOwnershipPatch` continua carregada. Nenhuma segunda camada de controle de áudio foi criada.
- Corrigidas duas comparações TypeScript inalcançáveis no preview do seletor: após o retorno antecipado da prancha do Estilo 2, removi apenas as condições redundantes para `elegancia-profunda`. O resultado visual não muda; o seletor deixa de gerar TS2367.
- Atualizados os testes de falha do player para refletir a decisão vigente: quando o stream oficial falha, o player informa erro e não muda silenciosamente para Web Speech/browser TTS. Também se testa que sair durante uma requisição pendente cancela o retorno e não inicia voz atrasada.

## Preservado
- Seletor React único, quatro estilos oficiais, escolha sem pré-seleção automática, CTA de confirmação e persistência antes de fechar.
- Camadas CSS do Místico Moderno: os 22 arquivos de estilo 4 examinados usam seletores escopados; nenhum seletor global foi encontrado nessa varredura.
- Diário, player, cabeçalho, navegação, mapas, cursos, modais e checkout existentes não foram reescritos.
- Reintegração da Vida permanece separada e aprovada; sua assinatura oficial continua com opacidade de 30%.
- Práticas, roteiros, frequências e conteúdo do Arcanjo não foram alterados.
- Pagamento: Prática Específica e Numerologia seguem pelo checkout `/api/payment/create-checkout`; não foi reintroduzida chave PIX manual. `PROMO15`, `PROMO20` e `VIP7` permanecem no fluxo de cupons próprio.

## Pendente / limitações
1. A prancha exata `1001196522.png` / `file_000000009978820eb49581883ae6340d` não ficou acessível nesta execução. O repositório contém apenas um fragmento incompleto que foi removido no commit `109d510`; ele não foi restaurado e nenhuma prancha alternativa foi usada. A prévia do Místico no seletor continua esquemática até a prancha original ser disponibilizada.
2. Voz: não alterei IDs nem aliases sem confirmação da voz aprovada. O código ainda usa `OFFICIAL_PROTOCOL_VOICE_ID` em caminhos do Místico, enquanto Ajustes expõe vozes instaladas no navegador; a correspondência com a voz escolhida e o resultado auditivo em pt-BR precisam ser homologados. Não foi feita troca especulativa para Marianne, Rachel ou outro identificador.
3. `SacredEnergyCanvas` mantém animações compartilhadas de geometria, partículas e cores por etapa. Não foram removidas sem confronto com a prancha e com a aprovação específica da animação.
4. O workflow `Security Audit` executou `npm audit` e encontrou vulnerabilidades preexistentes em `body-parser`, `ip-address`, `qs` (via ElevenLabs), `vite` e `zod`; por isso interrompeu regressões e build. O TypeScript também apontou as duas condições inalcançáveis do seletor, agora corrigidas nesta continuação. Na execução seguinte, o TypeScript passou; a suíte apontou três expectativas antigas de fallback nativo, agora atualizadas para o comportamento aprovado. O workflow será reexecutado pelo novo commit.
5. O preview Vercel do commit anterior falhou duas vezes com `BUILD_FAILED / Resource provisioning failed`, sem eventos de build disponíveis. Não há evidência de erro de compilação do Vercel; permanece necessária nova validação de preview.
6. Inspeção renderizada desktop/mobile, reprodução real do Solfeggio/voz e checkout InfinitePay ponta a ponta continuam pendentes.

## Reauditoria estática
- A escolha explícita continua condicionada a `layoutConfirmedThisSession`; o tema não é aplicado antes da confirmação.
- O logout agora redefine `layoutConfirmedThisSession` e `layoutChoiceRequested`.
- A folha Arcanjo nova é importada pelo ponto de entrada e todos os seus seletores estão limitados ao Místico Moderno.
- Nenhum arquivo dos Estilos 1–3 ou da Reintegração foi alterado.
