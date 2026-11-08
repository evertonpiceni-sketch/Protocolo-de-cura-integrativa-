# Auditoria RUN 96 — Estilo 2: Elegância Profunda

**Data:** 08/11/2026  
**Branch:** `main`  
**HEAD de código auditado:** `8b979bbb665287d66f89ac67748b222c1c9bf3b5`

## Corrigido nesta rodada

- **Precedência da camada aprovada:** `elegancia-profunda-approved-overrides.css` estava importada antes das folhas específicas de modal, Anamnese, oração, Diário, configurações, player e demais páginas. Foi movida para a última posição entre todas as folhas CSS de tema, imediatamente antes do `ErrorBoundary`. Assim, tipografia Playfair Display/Montserrat, assinatura do logo, paleta e decisões aprovadas do Estilo 2 não perdem precedência para camadas antigas.
- **Proteção contra regressão:** adicionado teste que exige a camada aprovada depois das 21 folhas do Estilo 2 e depois das camadas aprovadas dos demais estilos; também verifica que exista um único import.
- **Pré-seleção neutra:** removido um comentário obsoleto em `natural-sereno.css` que ainda dizia que o cadastro pertencia ao Natural Sereno. Agora fica explícito que o cadastro permanece neutro até a confirmação de um dos quatro estilos. O componente usa `ep-auth-prestyle`; as regras antigas `ep-auth-style-one` foram retiradas das folhas legadas nas alterações recentes.
- **Teste do cadastro:** reforçada a verificação para impedir que a orientação antiga de pré-seleção do Estilo 1 retorne.

## Varredura e preservado

- **21 folhas CSS** específicas do Estilo 2 importadas em `main.tsx).
- **657 seletores individuais** examinados com parser que separa grupos e percorre blocos aninhados.
- **0 seletores sem isolamento** por `data-layout="elegancia-profunda"`.
- Páginas/camadas verificadas: base aprovada, modais, Anamnese, oração, contato, Banhos de Ervas, Mapa Astral/Numerologia, Diário, Diário do Dia, detalhe do dia, Ho'oponopono, promoção, Ajustes de Áudio, semântica dos ajustes, cursos, conquistas, navegação inferior, instalação mobile, cabeçalho, dashboard e player.
- Seletor: quatro IDs oficiais confirmados; estado inicial sem seleção; CTA desabilitado até a escolha; confirmação e persistência antes de aplicar o tema. Nenhum estilo é aplicado automaticamente antes da confirmação.
- Pré-seleção/cadastro: `ProfileSetup` usa `ep-auth-prestyle`, neutro e independente do tema; o fluxo ativo monta `OnboardingFlow`.
- Identidade preservada: verde profundo intencional, ouro nobre, champagne, bronze e marfim; tipografia Playfair Display/Montserrat; logo oficial como assinatura a 30% de opacidade, sem fundo ou moldura dominante.
- Jornada de 21 dias e corpo neutro preservados. A prancha é referência de atmosfera, paleta e composição; seus mockups antigos de 12 dias e corpo masculino não substituem as decisões posteriores.
- Voz: catálogo neural usa IDs ElevenLabs de 20 caracteres; o Estilo 2 exige ID válido e não usa fallback silencioso para SpeechSynthesis.
- Solfeggio: bloqueio durante a prévia neural preservado; o patch interrompe o oscilador durante a narração; frequências usam o oscilador exato. Ambiência `waves` está identificada como “Ondas do Mar”, coerente com o gerador de ondas.
- Diário: `DailyDiaryModal` mantém callbacks de salvamento para texto e humor.
- Player/animações: contexto do dia preservado; abertura do Dia 1 do Estilo 2 usa progresso do canal de luz e raízes, sem anéis ou retângulos; respeita redução de movimento.
- InfinitePay: confirmação server-side consulta `/payment_check`, confere sucesso, estado pago e valor em centavos; transação reutilizada é rejeitada; o servidor registra somente o benefício escolhido.
- Nenhum preço, conteúdo terapêutico, roteiro, duração ou regra comercial foi alterado.

## Prancha oficial

- Arquivo original recuperado e inspecionado: `1001194194.png`, ID `file_00000000121c820e931b56bb6b1467e9`.
- Dimensões do original: **1536 × 1152 px**.
- Apesar da extensão `.png`, a assinatura interna é JPEG/JFIF; o arquivo foi preservado sem recompressão durante a inspeção.
- O card do seletor continua apontando para `/brand/elegancia-profunda/prancha-oficial.svg`, que contém um WebP incorporado de **240 × 180 px**. A referência visual está correta, mas a substituição desse derivado por um asset de maior densidade ainda não foi incorporada ao repositório.

## Pendente

1. Atualizar o asset do card para uma derivação de alta densidade da prancha original, sem redesenhar nem alterar a referência.
2. Integrar fotografia real de natureza exclusiva da Elegância Profunda. `--ep-scene:none` permanece intencional até existir imagem aprovada; não reutilizar fundos de outros estilos ou da Reintegração.
3. Fazer capturas e comparação visual real de todas as páginas em desktop e celular.
4. Homologar voz, Solfeggio, ambiências, Diário, player e animações em dispositivos reais.
5. Executar transação controlada InfinitePay em sandbox e validar webhook/liberação de acesso.
6. Obter CI de testes para o HEAD atual e resolver a publicação.

## CI e publicação

- O status combinado do HEAD atual expõe somente o check Vercel em falha: `build-rate-limit`.
- A consulta de workflow runs para o HEAD não retornou execuções; portanto, **não há novo resultado de testes automatizados confirmado para este HEAD**.
- O build/produção não está homologado. Não foi forçada implantação nem alterada configuração da conta.

## Commits desta rodada

- `49c8cfed7e22c7f500e609361b7cde479b60857e` — camada aprovada do Estilo 2 movida para o fim da cascata.
- `c29b017b85b2d478f552c109d20c3afa3d6944c7` — comentário de pré-seleção neutralizado.
- `8b979bbb665287d66f89ac67748b222c1c9bf3b5` — teste de precedência corrigido e registrado.

**Conclusão:** a correção funcional desta rodada foi a precedência da camada aprovada, que agora vence todas as folhas de tema sem afetar os demais estilos graças ao escopo. As 21 folhas do Estilo 2 permanecem isoladas. A identidade e as decisões posteriores estão preservadas. A homologação visual, o asset em alta densidade, a fotografia própria, o sandbox e a publicação continuam pendentes.
