# Auditoria Run 95 — Estilo 3: Essência Luminosa

**Data:** 08/11/2026  
**Branch:** `main`  
**HEAD final:** `b456799ff419927c871d8a2e71f577bf690a44c0`

## Corrigido nesta rodada

- **Ordem da cascata CSS:** `essencia-luminosa-approved-overrides.css` estava sendo importado antes de outras folhas do Estilo 3. Foi movido para a última posição entre os imports de CSS de `main.tsx`, depois de todas as 24 folhas específicas e imediatamente antes do `ErrorBoundary`. Assim, decisões aprovadas mais recentes não perdem precedência para folhas de auditoria antigas.
- **Regressão protegida:** adicionado teste que exige a camada aprovada como último CSS do Estilo 3 e confirma que existe apenas um import.
- **Validação do Diário:** o estado de humor baixo do Diário de Reconexão já está neutralizado em areia/marfim, sem rosa; mantido sem alteração.
- **Pagamentos:** a apresentação do modal de planos já possui regras específicas do Estilo 3 no CSS final; a escolha Semestral/Anual e a concessão do benefício continuam protegidas no servidor. Nenhuma regra comercial foi alterada.

## Varredura e preservado

- **24 folhas CSS** específicas inspecionadas; nenhuma regra seletora fora do escopo `data-layout="essencia-luminosa"` foi encontrada.
- **17 folhas** são importadas em `main.tsx`; as outras sete são carregadas pelos componentes correspondentes (Conquistas, Chakras, Contato, Cursos, Banhos de Ervas, Acolhimento e Boas-vindas).
- Seletor dos quatro estilos: estado inicial sem seleção, confirmação explícita e aplicação do tema somente após confirmação da sessão.
- Card do Estilo 3 preservado em `/brand/essencia-luminosa/prancha-oficial.webp`; o componente continua usando a prancha como card de referência, não como fundo de página.
- Paleta marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro `#A87E37`, areia e oliva clara preservada.
- Logo oficial continua como assinatura discreta, com baixa opacidade e sem fundo/moldura dominante.
- Voz neural ElevenLabs, bloqueio de Solfeggio durante narração, ambiências não tonais, Diário, player, sincronização e animações foram revalidados estaticamente; sem alteração funcional nesta rodada.
- InfinitePay: `ProUpgradeModal`, `paymentRoutes`, catálogo e testes conferidos. Semestral/Anual exigem exatamente um benefício; o servidor valida a escolha e registra somente o benefício escolhido após confirmação do pagamento.
- Estilos 1, 2 e 4 não foram alterados.

## Pendente

1. **Natureza na Home:** `--ep-scene: none` continua intencional até existir fotografia independente aprovada para a Essência Luminosa. Não reutilizar imagens de outros estilos nem transformar a prancha de telas em fundo fotográfico.
2. **Referência original:** nesta rodada não foi reaberto o PNG `1001196521.png` para comparação pixel a pixel com o WebP versionado.
3. **Homologação visual:** capturas e inspeção real página por página em desktop e celular ainda pendentes.
4. **Homologação funcional:** testes em dispositivo de voz, Solfeggio/ambiências, persistência do Diário e player pendentes.
5. **InfinitePay:** transação controlada em sandbox pendente.
6. **Publicação:** o CI passou, mas o check Vercel permanece bloqueado por `Deployment rate limited — retry in 24 hours`; produção não está homologada.

## Validação

GitHub Actions **42502251627** — concluído com sucesso no HEAD `b456799`. Passaram instalação, `npm audit`, TypeScript, testes de regressão, build, entrypoints Vercel/Express, verificações de segredos/JWT, smoke test e proteção dos endpoints de pagamento.

O status de implantação da Vercel para o commit atual continua em falha por limite de provisionamento. Isso foi registrado como bloqueio externo, não como aprovação de produção.

## Commits

- `a436e563636ca362d2f33e445860b34d5c8cd7f7` — ordem final da camada aprovada do Estilo 3.
- `42ae90e86dcafa60c405b2a316193f7a13f1a188` — inclusão inicial do teste de precedência.
- `b456799ff419927c871d8a2e71f577bf690a44c0` — ajuste do teste e validação final.

**Conclusão:** a última camada CSS aprovada agora vence as folhas antigas; as 24 folhas continuam isoladas; o CI do HEAD final passou. A Essência Luminosa permanece incompleta até integrar fotografia própria e concluir homologação visual/funcional e publicação.
