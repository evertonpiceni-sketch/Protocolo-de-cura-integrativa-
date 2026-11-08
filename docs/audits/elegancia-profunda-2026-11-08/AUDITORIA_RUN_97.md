# Auditoria RUN 97 — Estilo 2: Elegância Profunda

**Data:** 08/11/2026  
**Branch:** `main`  
**HEAD de código:** `46a330da8ed3ecb97ed45e9a5ea16da26bf896ed`

## Corrigido

- A CI do HEAD anterior (`b0f400c`) falhava em 1 de 151 testes. A falha identificou duas regras mortas de autenticação em `src/natural-sereno.css`, ainda vinculadas à classe retirada `ep-auth-style-one`.
- Removidas somente essas duas regras antigas de foco/rádio do shell de cadastro. `ProfileSetup` usa `ep-auth-prestyle` e não contém mais `ep-auth-style-one`; portanto, a remoção elimina uma herança inativa sem alterar o cadastro neutro nem o Natural Sereno aprovado.
- A nova execução GitHub Actions **#42507067190** passou: **151/151 testes**, 0 falhas, `npm audit` com 0 vulnerabilidades, TypeScript e build aprovados, além das verificações de segurança, entrypoints, smoke tests e pagamentos.

## Varredura e preservado

- `src/main.tsx`: **21 folhas CSS do Estilo 2 importadas**; a folha antiga `elegancia-profunda-welcome-audit.css` continua fora dos imports.
- Inspeção estática individual das 21 folhas ativas: **657 seletores examinados, 0 fora do escopo** `data-layout="elegancia-profunda"`.
- `elegancia-profunda-approved-overrides.css` permanece como última camada CSS de tema; não há folha de tema posterior que recupere precedência.
- Seletor: `selectedLayout` inicia em `null`; CTA fica desabilitado até a escolha; `App.tsx` remove `data-layout` antes da confirmação e só aplica o estilo depois de salvar a preferência. `LayoutChoiceModal` é o seletor ativo; `OnboardingFlow` é o acolhimento ativo. `WelcomeModal` e os antigos patches DOM de escolha não são importados.
- Identidade preservada: verde profundo intencional, ouro nobre, champagne, bronze e marfim; Playfair Display/Montserrat; logo oficial com 30% de opacidade, wrapper transparente e sem moldura/sombra dominante.
- Jornada de **21 dias** e corpo neutro preservados. Nenhum mockup antigo da prancha foi copiado para o produto.
- Voz neural: validação de ID ElevenLabs preservada; fallback robótico silencioso continua bloqueado.
- Solfeggio: oito frequências reconhecidas; bloqueio durante prévia neural e oscilador exato preservados. Ambiências não tonais continuam permitidas; `waves` está identificada como “Ondas do Mar”, coerente com o motor.
- Diário: `DailyDiaryModal` recebe `onSaveEntry` e `onSaveExpectations` conectados aos handlers da aplicação.
- Player/animações: cadência 4–3–5, jornada e progressão visual do Dia 1 preservadas; testes correspondentes passaram.
- InfinitePay: confirmação server-side consulta o provedor, valida sucesso/estado/valor em centavos, rejeita transação reutilizada e registra apenas o benefício escolhido. Preços e regras comerciais não foram alterados.

## Prancha oficial

- A fonte foi localizada na Biblioteca pelo ID `file_00000000121c820e931b56bb6b1467e9`, nome exibido `1001194194(5).png`, dimensões **1536 × 1152 px**.
- A assinatura interna do arquivo é JPEG/JFIF, apesar da extensão PNG.
- A imagem foi inspecionada. Seus mockups antigos mostram 12 dias e corpo masculino; servem somente como referência de atmosfera, paleta e composição. As decisões posteriores — 21 dias, corpo neutro e logo discreto — prevalecem.
- O card ativo em `LayoutChoiceModal.tsx` continua apontando para `/brand/elegancia-profunda/prancha-oficial.svg`. Esse derivado versionado ainda incorpora WebP de **240 × 180 px**. A fonte original foi recuperada, mas ainda não foi incorporada ao repositório em alta densidade; não houve ampliação artificial nem substituição por outra prancha.

## Pendente

1. Incorporar uma derivação de alta densidade da prancha original ao card, sem alterar o conteúdo de referência.
2. Integrar fotografia real de natureza exclusiva da Elegância Profunda. `--ep-scene:none` permanece intencional até existir imagem aprovada; não reutilizar fundos de outros estilos.
3. Capturar e comparar as páginas renderizadas em desktop e celular; a auditoria CSS desta rodada é estática.
4. Homologar voz, Solfeggio, ambiências, Diário, player e animações em dispositivos reais.
5. Executar transação InfinitePay em sandbox e validar webhook/liberação de acesso.
6. Resolver o provisionamento da Vercel e homologar a produção.

## CI e publicação

- GitHub Actions #42507067190, no HEAD `46a330da`: **success**, 151 testes aprovados, 0 vulnerabilidades e build aprovado.
- Não há deployment Vercel registrado para o HEAD `46a330da`.
- O deployment mais recente consultado para código anterior (`49c8cfed`) está em `ERROR / BUILD_FAILED`, mensagem `Resource provisioning failed`; a consulta de eventos de build retornou vazia. O time Vercel está no plano Hobby e o status anterior também expôs `build-rate-limit`. A produção continua sem homologação; nenhuma implantação foi forçada.

## Commit desta rodada

- `46a330da8ed3ecb97ed45e9a5ea16da26bf896ed` — remoção das duas regras legadas do shell de cadastro.
- A execução #42507067190 validou esse commit.

**Conclusão:** a única regressão comprovada nesta rodada era um par de seletores antigos de autenticação que mantinha o teste de regressão vermelho. Foram removidos sem tocar na identidade ou na lógica da Elegância Profunda. A base do Estilo 2 permanece isolada; a CI atual está verde. Asset em alta densidade, fotografia própria, homologação física e publicação continuam pendentes.
