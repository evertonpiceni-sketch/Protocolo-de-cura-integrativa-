# Auditoria Run 87 — Estilo 3: Essência Luminosa

Data: 08/11/2026  
Branch: `main`

## Corrigido

- **Guia dos Chakras:** o cartão informativo “Quando percebido em desequilíbrio” deixou de usar fundo rosa/blush e passou a usar areia clara, borda neutra e título em ouro escuro. As cores simbólicas próprias dos sete chakras e o conteúdo foram preservados.
- **Diário de Reconexão:** o estado de humor baixo deixou de exibir rosa estrutural; agora usa superfície areia e texto grafite secundário. O valor, a classificação e os registros não foram alterados.
- Foram acrescentados dois testes de regressão para impedir que essas duas heranças cromáticas retornem.

## Preservado e revalidado estaticamente

- Card do Estilo 3 continua em `public/brand/essencia-luminosa/prancha-oficial.webp`; não foi substituído.
- Paleta marfim/champagne/ouro suave/sálvia/oliva clara/areia e assinatura discreta do logo permanecem.
- Seletor dos quatro estilos continua exigindo confirmação explícita na sessão; a preferência persistida não aplica o estilo sozinha. A entrada por Configurações também abre o seletor, em vez de aplicar diretamente.
- Voz neural: IDs ElevenLabs válidos são preservados; a camada do Estilo 3 exige voz neural e desativa fallback para SpeechSynthesis nos fluxos protegidos.
- Solfeggio: frequências tonais continuam bloqueadas durante a prévia neural; ambiências não tonais permanecem permitidas.
- Diário, exportação, player, canvas/animações e conteúdo terapêutico não foram modificados.
- InfinitePay, checkout e confirmação server-side foram preservados. O catálogo de acessos e práticas não foi alterado.
- As 23 folhas CSS do Estilo 3 foram inventariadas e os componentes ativos de acesso, seletor, Home, Anamnese, Chakras, Banhos, Numerologia, Mapa Astral, Ho'oponopono, Diário, áudio, player, planos e navegação foram rechecados estaticamente.
- Estilos 1, 2 e 4 não foram alterados.

## Pendente

1. **Natureza fotográfica da Home:** `--ep-scene` permanece `none`. Não inseri a prancha composta como fundo nem reutilizei imagens de outros estilos. Ainda falta um arquivo fotográfico independente aprovado para a cena; o card oficial permanece intacto.
2. **PNG original:** a busca em conversa/Biblioteca não recuperou `1001196521.png`; por isso não afirmo comparação pixel a pixel. O WebP versionado continua como card.
3. **Homologação visual:** faltam capturas e inspeção em navegador desktop/mobile de todas as páginas.
4. **Execução real:** faltam testes físicos de voz/Solfeggio, persistência do Diário e reprodução/animações.
5. **Benefício Semestral/Anual:** a escolha entre Mapa Astral Completo e Numerologia Completa ainda precisa de tela/rota de registro seguro; não foi inventada concessão automática.
6. **Pagamento e publicação:** InfinitePay em sandbox e publicação Vercel continuam pendentes de homologação.

## Validação desta rodada

- Correções limitadas a CSS do Estilo 3 e testes.
- Nenhuma regra de conteúdo, cálculo, plano ou pagamento foi alterada.
- A suíte e o build serão considerados aprovados somente após a execução do CI deste commit.
