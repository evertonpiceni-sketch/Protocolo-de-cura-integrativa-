# Auditoria Run 100 — Estilo 3: Essência Luminosa

Data: 2026-11-08  
Branch: `main`  
HEAD auditado antes deste registro: `145718928d1e7b8b5176e1bd5159ca6966aa4c22`

## Corrigido

- Acrescentado em `tests/essencia-luminosa.test.ts` um teste de regressão da cascata efetiva da cena: a variável fotográfica permanece `none`, e o overlay final é o gradiente claro marfim/champagne declarado em `essencia-luminosa-final-audit.css`. O teste passou na execução de CI consultada.
- Reconciliada a contagem atual: existem 24 folhas `essencia-luminosa-*.css`; a varredura estática extraiu 576 blocos de regra, sem seletor fora do escopo `data-layout="essencia-luminosa"`. Não foram encontradas declarações diretas dos valores hex legados rastreados para verde escuro/esmeralda e amarelo/âmbar saturado.
- A camada `essencia-luminosa-approved-overrides.css` continua depois das demais folhas de Estilo 3 e das camadas aprovadas dos outros temas.
- No teste adjacente do seletor, a dimensão esperada da prancha do Estilo 2 foi atualizada de 240×180 para 320×240, acompanhando o arquivo atualmente versionado. Nenhuma arte ou CSS do Estilo 2 foi alterado nesta auditoria.

## Preservado e revalidado

- Tokens do Estilo 3: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro `#A87E37`, areia e oliva clara.
- Logo como assinatura: wrapper transparente, sem moldura/sombra dominante; opacidade reduzida no desktop e no mobile.
- Seletor: quatro opções em `OFFICIAL_LAYOUTS`; `selectedLayout` começa em `null`; confirmação fica desabilitada sem escolha; `App.tsx` só aplica `data-layout` depois da confirmação e reinicia a exigência em novo login.
- Card do Estilo 3: `/brand/essencia-luminosa/prancha-oficial.webp` permanece associado exclusivamente à opção Essência Luminosa. O PNG-fonte indicado não foi recuperado pelo índice Files nesta execução; por isso não substituí o WebP versionado nem aleguei comparação pixel a pixel.
- Voz: IDs ElevenLabs válidos do perfil são preservados; valores legados inválidos são normalizados para a voz oficial Marianne; o patch ativo força ElevenLabs e desativa fallback silencioso para SpeechSynthesis. O caminho nativo de contingência do Arcanjo é bloqueado no Estilo 3.
- Solfeggio/áudio: as oito frequências são identificadas pelo oscilador exato; a prévia neural bloqueia as frequências tonais, mantendo ambiências não tonais. O áudio global é interrompido durante sessão ativa e na tela Arcanjo.
- Diário: `DailyDiaryModal` continua ligado a `handleSaveDiaryDay` e `handleSaveTreatmentExpectations`.
- Player/animações: estruturas, sincronização, tema do canvas e respeito a movimento reduzido foram preservados; não foi feito teste físico em dispositivo.
- InfinitePay: checkout e confirmação permanecem server-side, com consulta `/payment_check`, comparação do valor em centavos e rejeição de transação reutilizada. Planos Semestral/Anual exigem escolha de Mapa Astral ou Numerologia; apenas o benefício escolhido é registrado. VIP7 permanece fluxo separado de degustação de 7 dias, não cupom de desconto. Preços e cupons não foram alterados.
- Conteúdo, dados, roteiros, componentes aprovados e estilos 1, 2 e 4 não foram redesenhados.

## Pendências e limitações

1. **Fotografia própria da Home:** `--ep-scene` continua `none`; o CSS final aplica apenas um gradiente leve marfim/champagne. Não existe fotografia independente aprovada do Estilo 3 integrada à Home. As imagens de mockup encontradas no ambiente foram descartadas: são composições antigas de interface com amarelo/verde saturados e logo dominante, não fotografias de natureza utilizáveis.
2. **Referência PNG:** o PNG `1001196521.png` / ID indicado não foi recuperado pelo índice acessível nesta execução. O card WebP do repositório foi preservado.
3. **Homologação real:** faltam capturas de todas as páginas em desktop/mobile, testes reais de voz/frequências, persistência do Diário em conta e transação InfinitePay em sandbox.
4. **Falha adjacente no seletor — Estilo 2:** o arquivo `public/brand/elegancia-profunda/prancha-oficial.svg` contém uma carga `data:image/webp;base64` com 19.999 caracteres (resto 3 na divisão por 4); o teste de integridade acusa payload inválido. A falha é da prancha do Estilo 2, introduzida pela atualização de seu ativo, não do CSS ou do card do Estilo 3. O arquivo visual não foi modificado aqui para não sobrescrever decisões do outro estilo.
5. **CI atual:** no run `42523000446`, npm audit e TypeScript passaram; a suíte de regressão falhou apenas no teste de integridade da prancha do Estilo 2. O novo teste da cascata do Estilo 3 passou. Build e verificações posteriores foram pulados por causa da falha de regressão.
6. **Vercel:** o check continua retornando `Deployment rate limited — retry in 24 hours`; produção não está homologada.

## Ordem recomendada

1. Corrigir a integridade do ativo SVG do Estilo 2 na auditoria própria daquele estilo, sem trocar sua referência aprovada.
2. Integrar uma fotografia independente e aprovada da Essência Luminosa; não reutilizar mockups ou cenas de outros estilos.
3. Comparar a prancha-fonte com o WebP do seletor quando o PNG original estiver acessível.
4. Executar homologação visual página por página em desktop/mobile, depois áudio e InfinitePay sandbox.
5. Repetir CI e implantação quando o limite da Vercel permitir.

Conclusão: nesta rodada não foi necessária alteração funcional no Estilo 3. A identidade, a escolha explícita e os fluxos centrais permanecem preservados. A principal lacuna visual continua sendo a fotografia própria da Home; a suíte global está bloqueada por uma falha independente no ativo do Estilo 2.
