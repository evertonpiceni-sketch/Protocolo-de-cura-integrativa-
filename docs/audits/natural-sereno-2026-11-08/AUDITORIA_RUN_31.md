# Reauditoria — Estilo 1: Natural Sereno — RUN 31

**Data:** 08/11/2026 (horário local)  
**Branch:** `fix/natural-sereno-mainline-2026-11-08-rebased`  
**PR vigente:** #64 — aberto, sem merge  
**Commit de código/testes mais recente:** `ac0c9b656aab83cf98f0e9da494f9ca97c048d0e`

## Corrigido nesta rodada

### Concorrência de checkout padrão (assinatura e prática específica)
- Generalizada a trava distribuída de criação de checkout, com Redis `SET NX PX`, renovação periódica por Lua e liberação condicionada ao token proprietário.
- A rota padrão adquire a trava por usuário e tipo de produto antes de consultar pedidos pendentes e a mantém durante recuperação/criação do link.
- A posse é revalidada antes da persistência e da chamada à InfinitePay. Duas instâncias não podem consumir simultaneamente o mesmo replay.
- A trava de Numerologia passou a usar o helper compartilhado, mas manteve o namespace Redis anterior para não quebrar a interoperabilidade com instâncias ainda ativas da versão anterior.

### Falha na persistência antes do replay
- A contagem `checkoutRecoveryAttempts` agora é revertida em memória se a gravação prévia falhar antes da chamada ao provedor.
- O pedido em recuperação não é marcado como falho nessa condição; continua pendente e recuperável.
- A chamada ao provedor só começa depois de a tentativa estar persistida e a posse da trava ser confirmada.
- O mesmo rollback foi aplicado à recuperação da Numerologia.

### Testes de regressão
- Novo teste simula duas instâncias independentes compartilhando Redis e comprova que apenas uma adquire a trava de recuperação padrão.
- Novo cenário simula interrupção inicial do provedor, falha da gravação prévia, ausência de incremento/URL adicional e recuperação posterior com o mesmo pedido/NSU.
- Os testes existentes de heartbeat, perda de lease, Numerologia, pagamento único e recuperação pós-criação foram preservados.
- Prévia do seletor: o CTA ilustrativo do card Natural Sereno também deixou o formato de pílula e passou a usar cantos de 18 px; os demais cards mantêm seu acabamento próprio. Foi adicionada asserção de regressão.

## Verificação estática visual

- As 175 regras do override aprovado e as 16 regras da camada de superfícies da Home permanecem escopadas a `data-layout="natural-sereno"`; não foi encontrado seletor global nessas duas folhas.
- Valores de saída encontrados são creme/marfim, café, dourado e sálvia. Referências a classes antigas verdes/amarelas aparecem como seletores de captura e são remapeadas; não são cores de saída. O modelo de Home também permanece com seletores escopados e tokens atuais.

## Preservado
- Prancha oficial Natural Sereno versionada no seletor, subordinada às decisões posteriores.
- Escolha explícita entre os quatro estilos, sem aplicar tema antes da confirmação.
- Paleta creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento; natureza realista e enquadramento responsivo.
- Logo oficial discreto/transparente.
- Diário, player de seis etapas, animações, respiração 4–3–5 e movimento reduzido.
- Voz neural aprovada e IDs válidos salvos no perfil; sem fallback silencioso para voz nativa.
- Ownership do Arcanjo/Solfeggio e as sete frequências aprovadas.
- Conteúdos, preços e cupons aprovados. Estilos 2, 3 e 4 não receberam alteração visual nesta rodada.

## Estado da validação

- Última execução completa anterior às alterações desta rodada: Security Audit #1630 no commit documental `d91e763a00ef60cc29d0382a04500883b9808369`, sucesso; a execução de código #1629 registrou `npm audit` com zero vulnerabilidades, TypeScript/build aprovados e 125/125 testes.
- Para o head atual da PR (que inclui os commits de código, testes e relatório), o conector ainda não retornou uma execução nova do GitHub Actions. Portanto, os novos testes e as alterações desta rodada **aguardam CI atualizado**.
- O status Vercel do novo commit está em falha com indicação `build-rate-limit`; não existe prévia navegável para capturas renderizadas página a página.
- A consulta de metadados das variáveis Vercel (sem descriptografar valores) confirmou `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` em produção, mas não encontrou `INFINITEPAY_API_KEY` em produção nem em preview. A rota permanece fail-closed; nenhum checkout ou cobrança foi iniciado.
- A variável antiga `UPSTASH_DB_KEY` de um preview legado continua sinalizada como `readable-secret`. Seu valor não foi lido nem alterado; exige revisão/rotação controlada separada.

## Pendente
1. **Atualização segura da branch:** a comparação com `main` mostrou divergência: a PR está 13 commits atrás de `main` e divergente do merge-base (`c6eb1bba`). Os 13 commits novos de `main` incluem decisões aprovadas de Estilo 2 (CTA neutro antes da escolha) e Estilo 3 (acessos avulsos de 7/21 dias por R$ 25/R$ 50, novo tipo `jornada_21d` e pré-seleção do plano no checkout). A `main` também retirou o checkout avulso de Numerologia de R$ 90,00: `NumerologyModal` agora libera o mapa completo somente quando `numerologyPurchased` está confirmado, e `paymentRoutes` não aceita `numerology_full`. A branch #64 ainda contém esse fluxo antigo; ele deve ser descartado durante a atualização, nunca reintroduzido. Há sobreposição em `App.tsx`, `LayoutChoiceModal.tsx`, `paymentRoutes.ts` e testes compartilhados. A PR está marcada `mergeable: false`; **não mesclar nem forçar atualização** até reaplicar as correções do Natural Sereno sobre a `main` atual e revalidar os arquivos compartilhados.
2. CI completo no head atualizado, incluindo TypeScript, suíte de testes, build e `npm audit`.
3. Capturas reais página a página em desktop e mobile e conferência da prancha no navegador.
4. Escuta real da voz selecionada e da transição entre narração, Solfeggio e ambiência.
5. Cadastrar a API Key oficial da InfinitePay no ambiente correto e homologar retorno/webhook dos produtos ainda aprovados; o checkout de Numerologia avulsa de R$ 90,00 permanece descartado conforme a `main` atual.
6. Revisar a variável de preview legada sinalizada pela Vercel, sem expor seu valor.
7. Nova revisão dos dois threads P2 do PR #64 após CI atualizado.

**Status:** os dois achados P2 e o acabamento de pílula da prévia foram corrigidos no código e cobertos por regressões. A PR não pode ser mesclada com segurança enquanto estiver divergente da `main`; a atualização precisa preservar as decisões aprovadas recentes dos Estilos 2 e 3. A homologação integral também depende de CI, preview visual/auditivo e configuração segura da InfinitePay. Nenhum merge, deploy de produção ou pagamento foi realizado.
