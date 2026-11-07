# Auditoria — Estilo 1 Natural Sereno — 2026-11-07

Referência visual examinada: prancha enviada nesta solicitação, `1001196520.png` (`file_00000000317c820ebaad657dc3680de5`). A prancha orienta a atmosfera e a composição; as decisões aprovadas posteriores de paleta e uso do logo prevalecem. O seletor já utiliza a prancha versionada em `docs/visual-qa/natural-sereno/reference.jpg`.

## Corrigido nesta rodada

- **Entrada sem abertura automática:** a assinatura `arcanjo_7d` deixa de forçar a tela do protocolo em todo login. O plano concede acesso; a tela só abre por ação explícita (ou pela rota de sucesso do pagamento já existente), e o botão de fechar volta a funcionar.
- **Ownership de áudio/Solfeggio:** `App.tsx` pausa a música global somente enquanto `showArcanjoView` está realmente aberto, inclusive no efeito principal, no desbloqueio por gesto e nos Ajustes de Áudio.
- **Regressão no guard Arcanjo:** o guard anterior interceptava `startBG`, método também usado por `startSynth`, e podia bloquear os próprios tons do protocolo. Agora permite somente os sete tons usados pelo Arcanjo (396, 417, 528, 639, 741, 852 e 963 Hz), bloqueia ambiências globais e interrompe o fundo uma única vez na entrada — não a cada mutação do React.
- **Teste de regressão:** criada política pura `src/lib/arcanjoAudioPolicy.ts` e teste `tests/arcanjo-audio-policy.test.ts` cobrindo os sete tons permitidos e o bloqueio das ambiências.
- **Logo:** a marca oficial do carregamento, que não tinha a classe de assinatura usada pelos outros pontos, agora recebe opacidade de 24% no Natural Sereno.

## Preservado e revalidado estaticamente

- **Seletor:** `layoutConfirmedThisSession` começa falso; o tema é removido do documento até a confirmação. O modal apresenta os quatro estilos, inicia sem seleção e mantém o botão de confirmação desabilitado até uma escolha. A preferência salva não pula a etapa.
- **Paleta:** creme `#FAF7F2`, café `#2A2421`, dourado `#C89D52` e verde natural `#6B7A4B` como acento. `natural-sereno-approved-overrides.css` continua sendo a última camada temática.
- **Paisagens e páginas:** preservadas as regras responsivas do hero, as fotografias da Home/Comunidade e a cachoeira contínua do player. Diário, Anamnese, Comunidade, Numerologia, checkout e Prática Individual mantêm correções escopadas ao Estilo 1.
- **Player/Diário:** controles continuam usando duração real, progresso real e busca apenas quando há duração conhecida; conteúdo, registros e exportação do Diário não foram alterados.
- **Pagamento:** checkout continua em InfinitePay, com confirmação server-side e conferência do valor pago. Valores da Prática Individual permanecem R$ 59,90/7 dias e R$ 99,90/21 dias; cupons PROMO15/PROMO20 preservados. Não foi reintroduzido PIX manual.
- **Componentes antigos:** o seletor React permanece como caminho ativo; patches DOM antigos de seleção não são importados por `main.tsx`.

## Pendente

1. **Voz escolhida:** o código preserva um `voiceId` ElevenLabs válido salvo no perfil; aliases/valores inválidos são normalizados para `OFFICIAL_PROTOCOL_VOICE_ID` (`mJqP14JQFEK0PojR5lfV`, Marianne). Não encontrei evidência suficiente de que esse ID seja a voz específica escolhida pelo Everton. Não substituí nem inventei outro ID. Falta conferir o ID efetivamente salvo e ouvir a amostra no navegador.
2. **Homologação visual/funcional:** ainda não foi executado navegador em desktop/mobile para conferir recortes, nitidez, animações e reprodução acústica real do Solfeggio.
3. **CI:** executar lint, testes e build via Pull Request; checkout real InfinitePay não foi disparado nesta auditoria.

## Base de trabalho

- Correções isoladas em `audit/estilo-1-natural-sereno-2026-11-07-mainline`, criada a partir de `main`.
- A antiga `integracao-infinitepay-protocolo` está divergente e muito atrás da árvore atual; não foi alterada nem usada como base.

## CI após o PR #52

- TypeScript check: passou no run final 1379/PR #52.
- Os dois novos testes — sete tons Solfeggio e ausência de autoabertura por assinatura — passaram.
- Suíte geral: 92/98 testes passaram; 6 falharam em asserções já existentes de Estilos 2 e 3 (prévia base64 do Estilo 2 e expectativas antigas de voz em `TransformationHome`, `AudioSettingsModal` e `App`). Nenhum dos arquivos dessas asserções foi alterado nesta PR.
- `npm audit`: 9 vulnerabilidades reportadas (3 moderadas, 6 altas); o workflow encerrou em falha e pulou build/smoke tests.
- O preview Vercel retornou `build-rate-limit`; não houve deploy de prévia nesta rodada.

Portanto, as duas correções de ownership/entrada passaram nos testes próprios e o TypeScript passou, mas o PR não está homologado integralmente. As falhas da suíte de outros estilos e as vulnerabilidades de dependências precisam ser tratadas separadamente, sem misturar uma atualização ampla de dependências a esta correção do Estilo 1. O build completo ainda não foi executado porque o workflow interrompeu a sequência após a suíte.
