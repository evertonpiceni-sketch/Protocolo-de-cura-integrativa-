# Auditoria RUN 97 — Estilo 3: Essência Luminosa

**Data:** 08/11/2026  
**Branch:** `main`  
**HEAD de código verificado:** `ec7249dee778d9629e135c45eca735b3c3839e90`

## Corrigido nesta rodada

- **Regressão na precedência da cascata:** a auditoria mais recente do Estilo 2 havia colocado `elegancia-profunda-approved-overrides.css` depois da camada aprovada da Essência Luminosa. Isso invalidava a garantia anterior de que o Estilo 3 era a última camada temática.
- **Ordem final consolidada:** Natural Sereno permanece depois de suas próprias auditorias; Elegância Profunda permanece depois de suas próprias auditorias; Essência Luminosa agora é a última camada CSS temática, depois das outras camadas aprovadas e imediatamente antes do `ErrorBoundary`.
- **Escopo preservado:** os overrides de Elegância Profunda e Essência Luminosa continuam isolados por seus respectivos `data-layout`; a camada final do Estilo 3 não recolore nem altera o Estilo 2.
- **Testes de regressão atualizados:** o teste do Estilo 3 confirma que sua camada aprovada vem depois das auditorias e das camadas finais dos outros estilos. O teste do Estilo 2 agora verifica que sua camada continua depois de todas as suas próprias auditorias e permanece isolada, sem exigir que dois estilos diferentes sejam simultaneamente a última folha CSS global.

## Referência visual oficial

- Recuperado e inspecionado o arquivo enviado: `1001196521(1).png`, ID `file_0000000019d0820eb7a70b6c982619d6`.
- Dimensões verificadas: **1536 × 1152 px**.
- O seletor React continua apontando para `/brand/essencia-luminosa/prancha-oficial.webp`.
- A prancha foi usada como referência de atmosfera, composição e identidade visual. Os detalhes antigos que aparecem nela — como a indicação de 28 dias, o perfil masculino de demonstração e elementos de conteúdo anteriores — não substituem decisões posteriores aprovadas. Não foram reintroduzidos no produto.
- Não substituí, recortei nem redesenhei o card nesta rodada; a comparação pixel a pixel entre PNG e WebP permanece pendente.

## Preservado e revalidado estaticamente

- **Seletor dos quatro estilos:** `selectedLayout` começa em `null`; o botão de confirmação fica desabilitado até uma escolha; `LayoutChoiceModal` só chama `onSelect` depois da confirmação.
- **Aplicação do tema:** `layoutConfirmedThisSession` começa em `false`; enquanto não houver confirmação, `data-layout` é removido. Uma preferência persistida não é consentimento para aplicar o estilo automaticamente nesta sessão.
- **17 imports CSS diretos do Estilo 3 em `main.tsx`:** a camada aprovada foi reposicionada depois deles. O teste existente também percorre os arquivos `src/essencia-luminosa*.css` e verifica o escopo dos seletores.
- **Paleta atual aprovada:** marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro `#A87E37`, areia e oliva clara. Valores antigos da prancha não substituem os tokens posteriores.
- **Logo:** assinatura discreta, sem fundo/moldura dominante, opacidade de 30% e redução para 26% em telas pequenas.
- **Voz e áudio:** a Home do Estilo 3 exige ID neural ElevenLabs válido e não habilita fallback para SpeechSynthesis; a prévia neural bloqueia as frequências Solfeggio e mantém ambiências não tonais disponíveis.
- **Player e animações:** tema do canvas continua em ouro suave/sálvia; conteúdo, sincronização e política de movimento reduzido não foram alterados.
- **Diário e componentes antigos:** fluxos existentes preservados; o seletor React permanece a única entrada ativa, sem reativar o chooser DOM legado.
- **InfinitePay:** catálogo e valores não foram alterados. Semestral/Anual exigem escolha entre `astral_map` e `numerology`; a rota server-side valida a opção e registra somente o benefício escolhido após a confirmação do pagamento.
- Estilos 1, 2 e 4 não receberam alterações visuais ou funcionais nesta rodada.

## Pendente

1. **Natureza fotográfica na Home:** `--ep-scene: none` continua deliberado porque não há fotografia independente da Essência Luminosa aprovada para produção. A imagem gerada nesta execução veio como composição de interface, não como fotografia limpa; não foi incorporada ao repositório.
2. **Comparação do card:** conferir visualmente PNG original e WebP versionado, inclusive nitidez em telas de alta densidade.
3. **Homologação visual:** capturas e inspeção real de todas as páginas em desktop e celular.
4. **Homologação funcional:** executar voz neural, bloqueio/retomada Solfeggio, ambiências, persistência do Diário, player e animações em dispositivos reais.
5. **InfinitePay:** transação controlada em sandbox e validação do webhook/liberação de acesso.
6. **CI/publicação:** o status combinado do HEAD mostra apenas o check Vercel em falha por `build-rate-limit`. A consulta de workflow runs não retornou execução associada; portanto, os testes e o build deste HEAD **não estão confirmados**. Produção não está homologada.

## Commits desta rodada

- `95952970f363a3e831914b95431ddbc8f90ab655` — ordem final da cascata temática, com Essência Luminosa por último.
- `845a09354845838870cb9b232729cb81598cfbce` — teste de regressão da precedência do Estilo 3.
- `ec7249dee778d9629e135c45eca735b3c3839e90` — teste de isolamento e precedência da Elegância Profunda.

**Conclusão:** foi corrigida uma regressão de precedência introduzida por uma atualização posterior de outro estilo. As camadas finais agora têm uma ordem única e verificável, mantendo cada identidade isolada. A Essência Luminosa permanece tecnicamente mais protegida, mas a fotografia própria, a homologação real e a publicação continuam pendentes.
