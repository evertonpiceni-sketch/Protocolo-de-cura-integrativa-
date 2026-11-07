# Auditoria Estilo 4 — Místico Moderno (Run 22)

Data: 2026-11-07  
Branch: `fix/mistico-moderno-audit-run21-2026-11-07`  
PR: #42 (rascunho; sem merge e sem deploy de produção)

## Corrigido

- Recuperada a prancha original `1001196522.png` da Biblioteca de arquivos do Everton. Foi criada uma derivação WebP otimizada para o cartão do seletor em `public/brand/mistico-moderno/prancha-oficial.webp`; a imagem original permaneceu intacta.
- O cartão do Estilo 4 agora mostra a prancha oficial, com moldura noturna, dourado e violeta. O desenho esquemático anterior foi removido. Os cartões dos outros estilos foram preservados; o indicador do Místico Moderno mostra apenas o círculo quando não selecionado, sem um falso check.
- A narração do Místico Moderno agora usa o alias interno `mistico-moderno-oficial`, resolvido no servidor pelo `ELEVENLABS_VOICE_ID` já configurado no Vercel. O ID não é exposto ao cliente nem foi alterado; o cache de áudio também passou a separar os resultados pelo ID efetivo da voz, evitando reutilizar áudio de outra voz.
- O Místico Moderno não troca silenciosamente para Web Speech do navegador quando a narração ElevenLabs falha. O player Arcanjo/Solfeggio interrompe a frequência e informa a indisponibilidade, em vez de iniciar a voz nativa.
- A renderização mobile do Arcanjo revelou um botão de saída rosa herdado; ele foi condicionado ao estilo e agora usa fundo noturno, borda dourada discreta e ícone dourado somente no Místico Moderno.
- Ajustes de áudio deixa de apresentar as vozes locais como se controlassem o player do Místico Moderno; a lista local permanece disponível nos demais estilos.
- Adicionados testes para a prancha do seletor, confirmação explícita, resolução do alias e bloqueio do fallback robótico.

## Preservado

- Os quatro estilos oficiais, a confirmação explícita antes de aplicar o tema e o reset de confirmação ao trocar de conta.
- Paleta noturna do Místico Moderno, acentos dourados/âmbar, leitura em marfim e assinatura do logo com baixa opacidade.
- Conteúdos, roteiros, Diário, Solfeggio, estrutura do player, animações compartilhadas, Reintegração da Vida e checkout InfinitePay.
- Nenhum arquivo dos Estilos 1–3 ou da Reintegração foi alterado nesta rodada.

## Reauditoria e pendências

- Foram inspecionados estaticamente 24 módulos CSS do Místico Moderno; as regras permanecem escopadas ao atributo `data-layout="mistico-moderno"`.
- O catálogo conectado do ElevenLabs não retornou uma voz chamada “Maiara”. O Vercel confirma que `ELEVENLABS_VOICE_ID` existe em produção e preview, mas seu valor é protegido; não foi lido nem alterado. O código usa essa configuração existente. A identidade audível como Maiara ainda precisa ser confirmada por escuta real.
- Os previews Vercel desta branch continuam retornando `BUILD_FAILED / Resource provisioning failed`, sem eventos de build. A inspeção renderizada página por página em desktop e celular continua pendente.
- A última execução do GitHub Actions antes desta rodada passou TypeScript, testes e build, mas a etapa final de `npm audit` permaneceu vermelha por vulnerabilidades em dependências. O novo commit aguarda CI.
- Não foi realizada transação real InfinitePay. Nenhum preço, cupom ou endpoint de pagamento foi alterado.
- `SacredEnergyCanvas` e demais animações não foram modificados sem evidência visual suficiente.

## Critério de conclusão

O Estilo 4 ainda não está homologado integralmente. A aprovação final depende de preview navegável, comparação página por página com a prancha e audição da voz configurada.
