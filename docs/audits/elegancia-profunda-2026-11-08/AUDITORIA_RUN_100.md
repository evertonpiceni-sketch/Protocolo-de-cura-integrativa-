# Auditoria RUN 100 — Estilo 2: Elegância Profunda

**Data:** 08/11/2026  
**Branch:** `main`  
**HEAD validado:** `c03942c9e0bb0f3bbda0e4315d01c4c3240e152c`

## Corrigido

1. **Prancha oficial do Estilo 2**
   - Recuperada a fonte `1001194194(5).png`, identificador `file_00000000121c820e931b56bb6b1467e9`.
   - Fonte: 1536 × 1152 px, 564.029 bytes, SHA-256 `710d453140dada6ce057d1ae1d481d37d1a0e7382ca08fca21345bb575ae72ff`.
   - Recriada a prévia do card em WebP 300 × 225 px, proporção 4:3, redução Lanczos, sem recorte. SHA-256 `92f716e9268e51845c19171307f959e00ce60a381704f02fe01f2dd03a3437d5`.
   - O SVG `public/brand/elegancia-profunda/prancha-oficial.svg` foi atualizado e a prévia foi inspecionada visualmente. O componente usa `object-contain`, sem cortar a prancha.
   - O teste fixa hash e dimensões reais para impedir que uma imagem diferente ou truncada volte ao card.

2. **Cadastro neutro antes da escolha**
   - A auditoria encontrou regras globais antigas em `src/index.css` que aplicavam verde profundo/dourado ao cadastro antes da escolha do estilo e elevavam a opacidade do logo para 76%.
   - O bloco foi substituído por tratamento neutro marfim/areia, ativo somente com `:root:not([data-layout])` e `.ep-auth-prestyle`.
   - Campos, cartão, abas e botões receberam acabamento neutro; não há aplicação antecipada da Elegância Profunda.
   - Logo no cadastro: 30% de opacidade; wrapper transparente, sem borda ou sombra.
   - Corrigido comentário obsoleto em `LayoutChoiceModal.tsx` que identificava incorretamente a prancha como sendo do Natural Sereno.
   - Adicionado `tests/style2-prestyle-neutral.test.ts` para proteger o comportamento.

## Preservado e revalidado

- As 21 folhas CSS específicas do Estilo 2 permanecem importadas; 657 seletores examinados, zero seletores fora de `data-layout="elegancia-profunda"`.
- `elegancia-profunda-approved-overrides.css` permanece como última camada do Estilo 2 (import em `src/main.tsx`); a folha antiga `elegancia-profunda-welcome-audit.css` continua inativa.
- `LayoutChoiceModal` inicia com `selectedLayout = null`; confirmação desabilitada até a escolha. `App.tsx` só define `data-layout` depois da confirmação e persistência. Logout reinicia a confirmação. O React `LayoutChoiceModal` é o único seletor inicial ativo; o patch DOM legado de entrada não está importado.
- Identidade da Elegância Profunda: verde profundo somente no tema confirmado, ouro nobre/champagne/bronze/marfim, Playfair Display e Montserrat.
- Logo oficial no tema: 30% de opacidade e assinatura discreta.
- Jornada de 21 dias e corpo neutro preservados; mockups antigos da prancha (12 dias/corpo masculino) não foram reintroduzidos.
- Voz: Estilo 2 exige ID ElevenLabs válido e não permite fallback nativo silencioso. Solfeggio permanece bloqueado durante a prévia neural; ambiências não tonais permanecem permitidas. O ID/nome exato da voz aprovada não foi recuperado com segurança nesta auditoria; não foi inventada uma substituição.
- Diário, player, animações e regras de sessão não foram alterados nesta rodada.
- InfinitePay preserva confirmação server-side por `/payment_check`, validação do valor e proteção contra reutilização de `transaction_nsu`; nenhuma regra comercial foi alterada.

## Validação técnica

A execução GitHub Actions **#42527690698** terminou com sucesso no HEAD informado:
- 153 testes aprovados; 0 falhas.
- `npm audit`: zero vulnerabilidades.
- TypeScript aprovado.
- Build Vite aprovado (2.247 módulos transformados).

A CI ficou temporariamente bloqueada por erros de sintaxe em um teste do Estilo 3; o ajuste de aspas foi feito no commit separado `c03942c9`, sem alterar a implementação visual do Estilo 2. A execução final acima validou a árvore completa.

## Pendente

1. Integrar fotografia real de natureza exclusiva da Elegância Profunda. Não foram reutilizadas imagens pertencentes ao Natural Sereno ou a outro estilo; `--ep-scene:none` permanece intencional até existir imagem aprovada.
2. Comparação visual renderizada, página por página, em desktop e celular.
3. Homologação física de voz, frequências, ambiências, Diário, player e animações.
4. Transação InfinitePay em sandbox e validação real do webhook.
5. Publicação Vercel: o check do HEAD continua `build-rate-limit`; o time está no plano Hobby. O último deployment disponível (`fb34e3b`) está `ERROR / BUILD_FAILED / Resource provisioning failed`, sem eventos de build retornados. Não foi criado deployment para o HEAD atual.

## Commits desta rodada

- `fb34e3b2362caa45975f2dd37457d651bfd755db` — prévia fiel da prancha oficial.
- `940da0c8341d116da8338ecf9bcb160c36ba5793` — teste de hash e dimensões da prévia.
- `3e901ddb3a6f26b416506d7251cc58900a9ecb12` — cadastro neutro antes da escolha.
- `28996b0de01d9571cf1a292a13d7b9a3c758dd7e` — correção de escapes dos seletores CSS.
- `5454850d8b5ee03683399d8b728e0ca4058df65d` — comentário das referências visuais.
- `68ed1eb0ce6cd8ebef737f3cee8c7545abe2aeda` — teste de regressão do pré-estilo.

**Conclusão:** a prancha oficial está agora corretamente incorporada ao card, e o cadastro deixou de antecipar a identidade verde/dourada antes da escolha explícita. A base do Estilo 2 permanece isolada. A homologação final continua condicionada à fotografia de natureza aprovada, validação física, sandbox de pagamento e desbloqueio da publicação Vercel.
