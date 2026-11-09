# Auditoria RUN 104 — Estilo 3: Essência Luminosa

**Data:** 08/11/2026 22:06 (America/Sao_Paulo)  
**Repositório:** `evertonpiceni-sketch/Protocolo-de-cura-integrativa-`  
**Base:** `main` em `36ca2cad51a78c34151819a1410a02661bae4899`  
**Último commit de código:** `f2bff9f0a2e0d7b6cf2271f77262337037089eda`  
**Branch deste registro:** `audit/essencia-luminosa-run104-2026-11-09`

## Corrigido nesta rodada

- Nenhuma alteração funcional ou visual foi necessária: a comparação entre o último commit de código e o HEAD atual da `main` mostra apenas a inclusão documental da RUN 103. Não houve mudança de fonte depois do código já validado.
- Não foi iniciada outra implantação, para não gerar mais tentativas enquanto o check Vercel continua em falha de provisionamento/limite.
- Este relatório registra a reauditoria e separa o que foi efetivamente conferido do que ainda exige navegador, dispositivo ou sandbox.

## Preservado e revalidado

### Referência e identidade

- O seletor React continua apontando o Estilo 3 para `/brand/essencia-luminosa/prancha-oficial.webp`.
- O WebP versionado foi recuperado do HEAD e inspecionado visualmente nesta rodada: 320 × 240 px, proporção 4:3, composição de prancha. SHA do blob Git: `8036829793883f27749787efb3f250093d80e509`.
- A prancha permanece card/referência, não fundo de página. Amostras cromáticas e elementos antigos visíveis nela não substituem as decisões posteriores.
- A busca na Biblioteca por `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6` não retornou uma cópia utilizável nesta execução. A RUN 103 registra a recuperação anterior; nesta rodada não foi possível fazer nova comparação pixel a pixel com o PNG original.
- Paleta atual preservada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro `#A87E37`, com areia natural e oliva clara como acentos.
- Logo oficial permanece como assinatura transparente e discreta: 30% no desktop e 26% em telas pequenas. Nenhuma alteração de logo foi feita.

### Varredura CSS página por página

As 24 folhas específicas do Estilo 3 foram recuperadas do HEAD e analisadas individualmente. O parser de seletores respeitou vírgulas dentro de `:is()`, `:not()` e funções CSS.

- 24 folhas examinadas.
- 577 blocos de regras CSS contabilizados.
- 0 seletores fora do escopo `data-layout="essencia-luminosa"`.
- 0 declarações ativas encontradas para a lista de hex antigos rastreados nas propriedades de cor, fundo, borda e contorno.
- Classes Tailwind antigas ainda aparecem em alguns seletores como alvos de neutralização; isso não equivale à aplicação das cores antigas.

Áreas cobertas: Home/cena, canvas, acolhimento, boas-vindas, cabeçalho, navegação inferior, Anamnese, Guia dos Chakras, Banhos de Ervas, Ho'oponopono, Numerologia, Diário, Diário de Reconexão, Pausa do Dia, marcos, cursos, contato, instalação mobile, sessão/player, Configurações/áudio, modais compartilhados e overrides finais.

### Ordem da cascata e seletor

- `src/main.tsx` mantém as folhas específicas e importa `essencia-luminosa-approved-overrides.css` como última camada de tema.
- `App.tsx` inicia `layoutConfirmedThisSession` como `false`; remove `data-layout` enquanto não há confirmação.
- `LayoutChoiceModal` inicia com seleção nula, botão de confirmação desabilitado sem escolha e só chama `onSelect` após confirmação.
- Preferência persistida não é tratada como consentimento automático; logout reinicia a confirmação.
- Os quatro estilos permanecem disponíveis. O card do Estilo 3 usa o WebP próprio; não foram recuperados seletores DOM legados.

### Natureza na Home

- A fotografia costeira permanece aplicada somente pelas regras finais do Estilo 3; a camada-base continua neutra para não herdar cenas dos outros temas.
- A Home usa véu marfim/champagne sobre a imagem. Em telas de até 640 px, `background-attachment` passa para `scroll`.
- A imagem continua vindo do CDN Unsplash. A autoria/licença específica desse ativo não foi confirmada e não há cópia local versionada; não atribuir fotógrafo sem comprovação.

### Voz, Solfeggio, Diário e player

- IDs ElevenLabs válidos escolhidos no perfil são preservados; IDs legados inválidos são normalizados para `OFFICIAL_PROTOCOL_VOICE_ID` (Marianne — Meditação).
- No fluxo da Essência Luminosa, `playGuidedMeditation` exige ID explícito e o erro encerra a reprodução sem acionar a voz nativa do navegador.
- O fallback legado Rachel/Marcus permanece restrito ao caminho genérico de outros estilos; o ramo de erro do Estilo 3 retorna antes dele.
- Oito frequências Solfeggio permanecem previstas: 396, 417, 432, 528, 639, 741, 852 e 963 Hz; a prévia neural bloqueia a reprodução simultânea.
- Ambiências não tonais e silêncio permanecem separados das frequências.
- Diário e Diário de Reconexão mantêm callbacks de persistência; player mantém respiração 4–3–5; animações respeitam `prefers-reduced-motion`.

### Pagamentos

- Checkout InfinitePay e confirmação server-side permanecem no fluxo.
- Semestral/Anual mantêm escolha explícita entre Mapa Astral Completo e Numerologia Completa.
- VIP7 continua como degustação separada de sete dias, com resgate único, não cupom comum.
- Nenhum preço, cupom, conteúdo terapêutico ou regra comercial foi alterado.

## Validação técnica

- GitHub Actions `42537090862`, no último commit de código `f2bff9f`: job `audit` concluído com sucesso.
- A comparação `f2bff9f...36ca2cad` confirma um único commit posterior, adicionando apenas `AUDITORIA_RUN_103.md`; não há alteração de código depois da execução aprovada.
- O check de status do HEAD atual `36ca2cad` permanece `failure`, contexto Vercel.
- Deployment de produção associado ao commit `f2bff9f`: estado `ERROR`, código `BUILD_FAILED`, mensagem `Resource provisioning failed`. A consulta de eventos de build não retornou logs.
- Não foi possível homologar a produção. O HEAD auditado não deve ser considerado publicado.

## Pendente

1. Recuperar novamente o PNG original da Biblioteca e fazer comparação pixel a pixel com o WebP do seletor.
2. Confirmar a origem/licença específica da fotografia externa e decidir se será armazenada localmente.
3. Homologar todas as páginas renderizadas em desktop e celular; esta rodada confirma isolamento CSS, mas não substitui inspeção no navegador.
4. Testar voz neural, oito frequências, ambiências, Diário, player, Media Session e animações em dispositivos reais.
5. Executar transação InfinitePay em sandbox e validar webhook.
6. Resolver o provisionamento/limite da Vercel e publicar o HEAD atual; conferir o alias de produção depois da publicação.

## Evidências

- HEAD atual: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/commit/36ca2cad51a78c34151819a1410a02661bae4899
- Último commit de código: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/commit/f2bff9f0a2e0d7b6cf2271f77262337037089eda
- CI do código: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42537090862
- Deployment com erro: https://vercel.com/evertonpiceni-sketch/protocolodecuraintegrativa/3o3ayVGcgMazXBFcP5xRQ5FG8mfA

**Conclusão:** a varredura das 24 folhas CSS não encontrou vazamento de escopo nem declarações ativas dos hex antigos rastreados. O seletor explícito, a paleta, a assinatura do logo, os fluxos neurais e as regras de áudio/pagamento permanecem preservados. Não foi feito patch de código porque não houve regressão nova no HEAD. A homologação global continua aberta por comparação do PNG, inspeção renderizada, testes físicos, sandbox e publicação Vercel.
