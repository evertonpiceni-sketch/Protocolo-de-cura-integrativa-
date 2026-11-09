# Auditoria Estilo 1 — Natural Sereno | RUN 107

**HEAD de código validado:** `69ec92e1218fb720c5decb7b7c102cf2311e89d2`  
**CI final:** #1995 — execução `42553269824`  
**Referência do card:** `docs/visual-qa/natural-sereno/reference.jpg`

## Corrigido

1. **Tokens globais ainda herdados do tema compartilhado.** A folha `approved-theme.css` mantinha para Natural Sereno acento verde-profundo (`#2D4A3E`), texto verde-escuro (`#202D24`) e a cena antiga da Reintegração. A última camada específica do Estilo 1 agora sobrescreve esses tokens com:
   - creme/marfim `#FAF7F2` / `#F5EFE5`;
   - café `#2A2421` e texto secundário `#6B625B`;
   - dourados `#E2B96B`, `#C89D52`, `#A87E37`;
   - sálvia apenas como acento;
   - cena natural `var(--ns-valley)`, overlay claro e texto de painel café.
   A mudança está escopada em `:root[data-layout="natural-sereno"]`; não altera os Estilos 2, 3 ou 4 nem a Reintegração da Vida.

2. **Progresso do player.** O componente compartilhado `MinimalPlayerControls` ainda tinha gradiente inline amarelo antigo (`#B88736 → #D4AF37`). O override específico do Natural Sereno agora aplica `#A87E37 → #C89D52`, trilho `#E8E0D5` e o mesmo dourado refinado ao estado de carregamento. Um teste de regressão cobre os dois estados.

3. **Reauditoria de áudio e voz.** O ID oficial configurado no código corresponde à voz disponível no workspace ElevenLabs: **Marianne — Meditação**, português brasileiro, perfil calmo/meditativo. Natural Sereno exige voz neural e não usa fallback silencioso para SpeechSynthesis nos fluxos auditados.

## Preservado

- Card do Natural Sereno continua usando a prancha versionada em `docs/visual-qa/natural-sereno/reference.jpg`. A descrição e os swatches do seletor refletem a paleta vigente; a prancha antiga permanece somente como referência visual, subordinada às decisões posteriores.
- O seletor começa sem estilo escolhido (`selectedLayout = null`), a confirmação fica desabilitada até a seleção e `data-layout` é removido até a confirmação explícita. Os quatro estilos continuam disponíveis.
- Home usa paisagem real `--ns-valley`; o player mantém a cena de natureza, seis etapas, animação e respiração 4–3–5.
- Logo oficial permanece como assinatura discreta: 30% desktop / 26% mobile.
- Diário, snapshot de perfil/progresso e sincronização resiliente preservados.
- Solfeggio não é reiniciado como trilha durante a sessão do protocolo; a prévia neural mantém a proteção de áudio.
- InfinitePay permanece no checkout público, com confirmação server-side, conferência de valor, deduplicação de transação e escolha de benefício validada.
- Nenhuma alteração de identidade visual nos Estilos 2, 3 e 4.

## Validação

- 14 folhas CSS examinadas (12 do Natural Sereno e 2 compartilhadas), além dos componentes de Home, seletor, Anamnese, player, áudio, Diário e pagamento.
- Os `border-radius:999px` restantes encontrados são trilhos de slider/interruptor; o botão circular do cabeçalho é um controle de ícone, não CTA em formato de pílula.
- CI #1995: **187/187 testes aprovados**, `npm audit` com zero vulnerabilidades, TypeScript aprovado, build Vite aprovado (2.249 módulos), entrypoints Vercel, JWT, autenticação/admin, smoke tests e verificações de pagamento aprovados.
- A primeira execução do novo teste de progresso apontou apenas escape incorreto na expressão de teste; corrigido antes da execução final #1995.

## Pendências

1. **Preview visual:** o último deployment da branch consultado (`dpl_BgxyzwVrimhbworJo1BXq2Vou14Y`, commit `788d473c72cfed30fa9f68183e0cf42aa85c69f6`) terminou em `BUILD_FAILED — Resource provisioning failed`. Não há deployment para o HEAD de código `69ec92e`; portanto, não foi possível homologar as páginas renderizadas em desktop e mobile.
2. **Áudio real:** a voz oficial existe no workspace e o código a seleciona, mas falta reproduzir o protocolo no navegador e ouvir as transições narração/Solfeggio/ambiência.
3. **InfinitePay:** `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` estão presentes em produção. O código atual usa o checkout público e não exige `INFINITEPAY_API_KEY`; sandbox e confirmação/webhook reais continuam pendentes. Nenhuma cobrança foi feita.
4. **Arquivo original:** a Library não revalidou nesta rodada o ID exato `file_00000000317c820ebaad657dc3680de5`. Foi localizada uma prancha intitulada `Painel UX_UI Natural Sereno.png`, mas ela não foi usada como substituta; a referência versionada do repositório foi preservada.
5. **Segredo legado:** `UPSTASH_DB_KEY` permanece em uma branch antiga de preview, marcada pela Vercel como `readable-secret`; não foi alterada por não pertencer à branch ativa.
6. **Integração:** PR #74 permanece draft, aberta e mergeable; branch 99 commits à frente e 10 atrás da `main`. Não houve merge nem publicação em produção.

**Conclusão:** duas heranças concretas foram corrigidas na origem: tokens globais verdes/Reintegração e o progresso amarelo legado do player. A validação automatizada passou; a homologação integral depende de preview navegável, reprodução real de áudio e sandbox financeiro.
