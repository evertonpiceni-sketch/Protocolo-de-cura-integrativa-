# Auditoria Run 98 — Estilo 3: Essência Luminosa

**Data:** 8 de novembro de 2026  
**Branch:** `main`  
**Base:** estado posterior à Run 97, com correção de isolamento visual e teste de regressão.

## Referência e decisões vigentes

- A prancha original `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6` foi reaberta e inspecionada (1536 × 1152 px).
- O card React continua apontando para `/brand/essencia-luminosa/prancha-oficial.webp`. O WebP versionado foi inspecionado: é uma prancha composta de telas, não uma fotografia de fundo.
- O derivado atualmente versionado mede 320 × 240 px (14.512 bytes), enquanto a fonte original mede 1536 × 1152 px. Foi preparada uma nova derivação WebP 768 × 576 px, por redução direta da fonte e sem alteração de conteúdo; ela ainda não substitui o ativo do repositório. A prévia de baixa resolução permanece como pendência de incorporação binária.
- A prancha orienta a atmosfera e a composição do card. Textos, valores, telas demonstrativas e escolhas antigas nela representadas não substituem decisões posteriores aprovadas.
- Paleta ativa preservada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro `#A87E37`, areia e oliva clara como acentos.
- Logo oficial preservado como assinatura discreta/transparente; não foi aumentado nem transformado em elemento dominante.

## Corrigido

1. **Isolamento explícito da cena:** o bloco `:root[data-layout="essencia-luminosa"]` em `src/approved-theme.css` não declarava `--ep-scene` nem `--ep-scene-overlay`, embora relatórios anteriores descrevessem a cena como `none`. Foram adicionados explicitamente:
   - `--ep-scene:none;`
   - `--ep-scene-overlay:none;`

   Isso impede que uma futura regra compartilhada introduza por acidente a paisagem do Natural Sereno ou a arte da Reintegração no Estilo 3. A cena própria permanece suspensa até existir fotografia independente aprovada.

2. **Regressão automatizada:** `tests/essencia-luminosa.test.ts` agora exige os dois tokens neutros e verifica que o bloco do Estilo 3 não referencia Natural Sereno nem `reintegracao-presenca-arte.png`.

## Varredura página a página

Foram localizadas e inspecionadas as 24 folhas CSS específicas do Estilo 3:
- 17 importadas diretamente por `src/main.tsx`;
- 7 importadas pelos componentes correspondentes.

Áreas cobertas: acesso/onboarding, boas-vindas, seletor, Home/cabeçalho, navegação inferior, canvas, jornada/sessão/player, Anamnese, Chakras, Banhos de Ervas, Ho'oponopono, Numerologia, Mapa Astral e modais compartilhados, Diário, Diário de Reconexão, Pausa do Dia, conquistas, celebração de progresso, instalação mobile, cursos, contato, vídeo de apresentação, Configurações/áudio e checkout.

Resultado da inspeção estática das 24 folhas:
- 0 seletores sem escopo `data-layout="essencia-luminosa"`;
- 0 declarações diretas das cores saturadas examinadas (verdão/esmeralda, amarelo/âmbar saturado e verde profundo);
- referências a classes legadas como `emerald-*` e `amber-*` permanecem apenas como alvos de overrides isolados, cujas declarações mapeiam esses estados para sálvia, champagne ou ouro suave. Não foram removidas classes semânticas de sucesso nem cores simbólicas dos chakras.

## Preservado e revalidado estaticamente

- Seletor React único: quatro estilos, seleção local inicialmente vazia, confirmação obrigatória e aplicação de `data-layout` somente após a escolha. Preferência persistida não equivale a confirmação da sessão.
- A camada `essencia-luminosa-approved-overrides.css` continua no fim da sequência CSS específica do Estilo 3.
- Voz neural: IDs ElevenLabs válidos do perfil são preservados; valores legados inválidos são normalizados para o ID oficial. O patch carregado em `main.tsx` força `preferElevenLabs: true` e `fallbackToSpeechSynthesis: false` nos fluxos protegidos do Estilo 3.
- Solfeggio: as oito frequências continuam bloqueadas durante a prévia neural em Ajustes; ondas, chuva e floresta permanecem como ambiências não tonais. O protocolo Arcanjo mantém seu oscilador nominal por dia, conforme o teste de reprodução existente.
- Diário: salvamento e exportação permanecem implementados; não houve alteração de conteúdo ou dados.
- Player/animações: cadência visual 4-3-5, sincronização e mapeamento das seis etapas permanecem protegidos pelos testes existentes.
- InfinitePay: catálogo, valores, cupons, validação server-side, confirmação do valor e idempotência foram preservados. Semestral/Anual exigem escolha explícita entre Mapa Astral Completo e Numerologia Completa; somente o benefício escolhido é registrado.
- Estilos 1, 2 e 4, conteúdo terapêutico, roteiros, dados e componentes aprovados não foram alterados.

## Pendente

1. **Fotografia própria da Home:** `public/brand/essencia-luminosa/` continua contendo somente a prancha WebP. Não há fotografia independente aprovada. A imagem produzida nesta execução veio como composição de interface, não como fotografia limpa; não foi incorporada. Nenhuma imagem do Natural Sereno ou da Reintegração foi reutilizada.
2. **Homologação visual real:** capturas e comparação de todas as páginas em navegador, desktop e celular continuam pendentes.
3. **Homologação funcional em dispositivos:** reprodução real de voz, Solfeggio/ambiências, Diário, player, Media Session e animações.
4. **InfinitePay sandbox:** testes de transação real permanecem pendentes.
5. **Publicação:** o check Vercel do commit de código permanece em falha. A razão detalhada não foi exposta pelo status do GitHub nesta execução; a produção não está homologada. O CI do GitHub, por sua vez, passou.

## Commits e validação

- Tema — `fca3bfb4f5db447dd586d53e8f2e3f95b390b662`
- Teste — `c7be65d32469505f1fe9e53e874ac43650dced54`
- GitHub Actions Security Audit do commit de teste: Run `42512411410` — sucesso em npm audit, TypeScript, testes de regressão, build, entrypoints, verificações de segurança, smoke test e endpoints de pagamento.

**Correções:** [commit do isolamento da cena](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/commit/fca3bfb4f5db447dd586d53e8f2e3f95b390b662) · [commit do teste](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/commit/c7be65d32469505f1fe9e53e874ac43650dced54)

**CI:** [GitHub Actions — Run 42512411410](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42512411410)

**Vercel:** [check associado ao commit](https://vercel.com/evertonpiceni-sketch/protocolodecuraintegrativa/Fpufk1KbYX2qXNQkUihAaDtVazAH)

## Conclusão

A única correção de código necessária nesta rodada foi tornar explícito o isolamento da cena do Estilo 3 e protegê-lo por teste. A varredura das 24 folhas não encontrou novos vazamentos cromáticos diretos nem seletores fora do escopo. O estilo permanece visualmente preservado; a fotografia própria e a homologação de ponta a ponta continuam pendentes.
