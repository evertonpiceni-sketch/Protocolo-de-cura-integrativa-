# Auditoria — Estilo 3: Essência Luminosa — Run 81

Data: 08/11/2026  
Branch: `main`  
HEAD validado antes deste relatório: `8992111579f07f8f44afb468460799227b1100df`

## Escopo e método

Revisão estática página por página dos componentes compartilhados e das 22 folhas CSS da Essência Luminosa. As 22 folhas estão conectadas: 15 importadas por `src/main.tsx` e 7 importadas diretamente pelos componentes correspondentes. A revisão não substitui homologação visual em navegador.

A prancha `public/brand/essencia-luminosa/prancha-oficial.webp` permanece no seletor como referência visual do Estilo 3. O PNG original `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6` não foi localizado no índice acessível de arquivos desta execução; portanto, não foi possível fazer comparação pixel a pixel. Nenhuma prancha antiga foi recolocada.

## Corrigido

### Identidade visual e contraste

- `SpecificTreatmentModal`: o CTA principal usava gradiente verde-esmeralda/teal que não era alcançado pelos seletores anteriores, pois as classes eram `from-/to-`, não `bg-emerald`. Agora usa gradiente ouro suave, texto escuro legível, borda champagne e sombra discreta.
- `AnamnesisModal`: o CTA final herdava gradiente verde/índigo, mas o override genérico o clareava sem trocar o texto branco. Agora usa ouro suave com texto escuro e contraste consistente.
- `PromoVideoModal`: o botão de contato não fica mais com texto branco sobre fundo sálvia claro; recebeu composição sálvia/champagne com texto grafite. O CTA VIP âmbar saturado foi substituído pelo gradiente ouro suave. A barra âmbar do visualizador foi suavizada para ouro.
- Todas as novas regras CSS estão isoladas por `data-layout="essencia-luminosa"`; os Estilos 1, 2 e 4 não receberam alterações visuais.

### Acesso aos benefícios completos e pagamento

- `NumerologyModal`: removido o checkout avulso `numerology_full` e o preço R$ 90,00, que não tinham rota nem preço server-side aprovados. A tela agora explica que Numerologia Completa é uma das opções de benefício dos planos Semestral/Anual e direciona para Planos PRO ou suporte.
- Numerologia Completa só é liberada quando `numerologyPurchased` está explicitamente confirmado. O estado genérico `plan === 'pro'` deixou de conceder automaticamente o conteúdo completo.
- `AstralMapModal`: Planetas/Casas e impressão em PDF agora exigem `astralMapPurchased` confirmado, em vez de qualquer assinatura PRO. A versão compacta permanece disponível.
- `server.ts`: o sincronizador de perfil agora preserva `astralMapPurchased` do estado do servidor, assim como já preservava `numerologyPurchased`. O cliente não pode autoconceder esses dois benefícios enviando campos alterados no perfil.
- Os dois modais de mapa passaram a ativar o gerenciamento de foco em todos os estilos.

### Testes

Foram acrescentadas proteções para:
- ausência de checkout e preço avulso não aprovado da Numerologia;
- concessão de Mapa Astral/Numerologia somente por benefício confirmado;
- preservação server-side dos dois indicadores de benefício;
- contraste dos CTAs da Prática Individual, Anamnese e Apresentação.

## Preservado

- Paleta aprovada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, areia e oliva clara.
- Logo oficial sutil, com wrappers transparentes e baixa opacidade já aprovada.
- Card WebP atual da Essência Luminosa no seletor.
- Seletor com `selectedLayout = null`; confirmação desabilitada até a escolha; aplicação condicionada a `layoutConfirmedThisSession`.
- Valores de acesso avulso aprovados: R$ 25,00 / 7 dias e R$ 50,00 / 21 dias.
- Práticas individuais: catálogo server-side de R$ 59,90 / 7 dias e R$ 99,90 / 21 dias; cupons e confirmação InfinitePay permanecem server-side.
- Voz neural, IDs ElevenLabs, Solfeggio, ambiências não tonais, Diário, Diário de Reconexão, player, cadência e animações. Não foram alterados nesta rodada.
- Conteúdos, cálculos e roteiros terapêuticos.
- Estilos 1, 2 e 4: nenhuma alteração visual.

## Pendente

1. **Escolha do benefício semestral/anual:** os planos oferecem uma escolha entre Mapa Astral Completo e Numerologia Completa, mas ainda não há uma tela/rota aprovada para registrar essa escolha e definir `astralMapPurchased` ou `numerologyPurchased`. Por segurança, os dois mapas agora exigem a flag confirmada; não foi criada uma cobrança ou concessão automática.
2. **Natureza fotográfica própria:** `--ep-scene` continua sem fotografia própria integrada à Home. A pasta do Estilo 3 ainda não contém um conjunto independente de fotografias aprovado. Não foram reutilizadas imagens de outros estilos nem a composição da prancha como fundo.
3. **PNG de referência:** o arquivo original indicado não foi localizado no índice acessível; o WebP versionado permanece como card.
4. **Homologação visual e funcional:** ainda faltam capturas reais desktop/mobile, teste de áudio em dispositivo, teste InfinitePay em sandbox e confirmação de implantação.

## Validação técnica

GitHub Actions — execução 1653, run `42444969050`:
- `npm audit --audit-level=moderate`: 0 vulnerabilidades.
- TypeScript (`tsc --noEmit`): aprovado.
- Testes: 121/121 aprovados.
- Build Vite: aprovado.
- Bundle do servidor Express via esbuild: aprovado.
- Verificações de segurança do workflow: aprovadas.

O check Vercel do HEAD continua falhando com `build-rate-limit`. Portanto, o build do GitHub passou, mas não há confirmação de publicação ou homologação em produção.

## Commits desta rodada

- `7df447e` — remove checkout avulso não aprovado da Numerologia e exige benefício explícito.
- `470be3b` — condiciona Mapa Astral Completo ao benefício confirmado.
- `c9e9f5f` — protege `astralMapPurchased` no sincronizador server-side.
- `38825b2` — corrige CTA verde da Prática Individual.
- `25842c3` — corrige CTA e contraste da Anamnese.
- `4694ba3` — corrige CTAs e visualizador da Apresentação.
- `8992111` — atualiza asserções e validações finais.

## Conclusão

As heranças de verde saturado/âmbar nos três CTAs identificados foram corrigidas. Os acessos completos de Mapa Astral e Numerologia deixaram de depender apenas de uma assinatura PRO genérica, e os indicadores de benefício são protegidos no servidor. O checkout avulso não aprovado da Numerologia foi retirado sem criar preço ou rota novos.

O Estilo 3 permanece parcialmente concluído: natureza fotográfica própria, registro da escolha do benefício semestral/anual, homologação real e publicação continuam pendentes.
