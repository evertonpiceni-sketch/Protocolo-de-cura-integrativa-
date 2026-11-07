# AUDITORIA_RUN_59 — Estilo 2 · Elegância Profunda
Data: 2026-11-07
Branch: main
Base de código: correções RUN_58 + commits desta rodada.

## Referência oficial e decisões vigentes
- A prancha original `1001194194.png` (1536 × 1152 px) foi recuperada e inspecionada. O seletor React utiliza a prévia `/brand/elegancia-profunda/prancha-oficial.svg` com `object-contain`.
- A prancha define atmosfera e composição visual; não substitui decisões posteriores. Permanecem vigentes a jornada de 21 dias, o corpo neutro da Reintegração e o logo oficial como assinatura sutil/transparente.
- Paleta do Estilo 2 preservada: verde profundo `#0B1712 / #132A1F`, verde natural `#2E6B4F`, ouro `#D4AF37`, champagne `#E5C365`, bronze e marfim `#F4F1EB`.

## Corrigido nesta rodada
- Encontrada herança cromática ativa no toast global do App: fundo indigo/slate/roxo, borda âmbar e texto escuro de superfície clara.
- O toast recebeu a classe `ep-app-toast` e semântica acessível `role="status"` / `aria-live="polite"`.
- Criada regra estritamente limitada a `:root[data-layout="elegancia-profunda"] .ep-app-toast`: superfície verde profunda, borda champagne, texto marfim, texto secundário verde-claro e ícone/hover dourado.
- O ajuste não altera o toast dos demais estilos nem a lógica de notificação.
- Adicionado teste de regressão para impedir que o toast volte a exibir a paleta indigo/roxa no Estilo 2.

## Preservado e revalidado — varredura estática por tela/fluxo
1. **Seletor/prévia:** quatro estilos; seleção inicial `null`; confirmação desabilitada até escolha explícita; prancha oficial do Estilo 2 na prévia.
2. **Aplicação do tema:** `layoutConfirmedThisSession` inicia em `false`; `data-layout` só é aplicado após escolha explícita e persistência aceita.
3. **Acolhimento/onboarding:** `OnboardingFlow` é o fluxo ativo; `WelcomeModal` e o CSS antigo de boas-vindas permanecem fora dos imports.
4. **Home/dashboard/cabeçalho/menu:** módulos próprios do Estilo 2 preservados; tokens de texto e superfície definidos na paleta; logo permanece assinatura discreta, sem fundo/sombra e sem opacidade dupla.
5. **Jornada/lista de dias:** jornada posterior aprovada de 21 dias preservada. A contagem ilustrativa de 12 dias da prancha não foi transplantada.
6. **Player principal:** camada `elegancia-profunda-player-audit.css` permanece importada após os módulos de dashboard; cobre cabeçalho, etapas, respiração, controles, portal de aceite, check-in, conclusão, bloqueio e drawer. Paleta explícita do Estilo 2 é enviada ao canvas.
7. **Reintegração da Vida:** jornada de 21 dias, corpo neutro, voz neural dedicada e relógio real do áudio preservados. Correções anteriores de Wake Lock e Media Session permanecem no código.
8. **Anamnese/resultado/Ho'oponopono/orações:** caminhos do Estilo 2 exigem ID neural ElevenLabs válido e não recorrem silenciosamente a SpeechSynthesis.
9. **Solfeggio/áudio:** oscilador exato preservado para 396, 417, 432, 528, 639, 741, 852 e 963 Hz; a política do protocolo impede reiniciar frequência tonal durante narração. Não há reativação do mapa MP3 legado.
10. **Diário/Diário de Reconexão:** folhas específicas do Estilo 2 permanecem importadas; registros e conteúdo não foram alterados.
11. **Ferramentas/mapas/cursos/banhos:** camadas específicas do Estilo 2 preservadas; nenhuma folha dos outros estilos foi modificada nesta rodada.
12. **Perfil/configurações de áudio:** validação de ID neural e controles salvos preservados.
13. **Comunidade:** não foi identificada como rota/componente ativo nesta varredura; nenhuma tela foi inventada.
14. **Pagamento:** checkout e confirmação server-side da InfinitePay preservados; handle `evertonterapeutareiki`; planos 7 dias (R$ 59,90) e 21 dias (R$ 99,90); sem PIX manual ou liberação local.

## CSS e componentes antigos
- RUN_58 identificou 22 folhas CSS relacionadas ao Estilo 2, com 21 importadas; a folha antiga de boas-vindas permanece inativa.
- `WelcomeModal.tsx`, `requiredLayoutChoiceEntryPatch.ts` e `layoutSettingsExplicitConfirmationPatch.ts` continuam fora do fluxo ativo. `LayoutChoiceModal` permanece o único seletor React.
- O toast global era uma exceção visual compartilhada; foi corrigido com escopo exclusivo do Estilo 2.

## Validação e pendências
- Revalidação estática dos arquivos alterados: classe do toast presente no App, regra de escopo presente no CSS, folha CSS importada em `main.tsx` e teste de regressão presente.
- A última execução de GitHub Actions comprovada é a RUN_58 (42362183295): TypeScript, testes, build, entrypoints Express, verificações de segurança da aplicação e endpoints de pagamento passaram; o job terminou reprovado na etapa final de auditoria de dependências, com 9 vulnerabilidades (3 moderadas e 6 altas). Não atualizei dependências/lockfile nesta correção.
- Não foi possível confirmar uma nova execução de Actions para os três commits desta rodada. Portanto, o novo teste ainda não está declarado como executado.
- O status atual de implantação permanece Vercel `failure` com `build-rate-limit`; não há publicação confirmada.
- Permanecem pendentes: fotografia independente de natureza aprovada para a superfície global; comparação visual do player em navegador contra a prancha, mantendo corpo neutro; reprodução real da voz e Solfeggio em dispositivos; testes desktop/mobile, Wake Lock e Media Session reais; transação controlada InfinitePay/webhook; revisão isolada das dependências vulneráveis.

## Commits desta rodada
- `9ecde5c` — classe/semântica acessível do toast.
- `b5c5652` — tratamento verde profundo/champagne/marfim/dourado, limitado ao Estilo 2.
- `3219d04` — teste de regressão para o toast.

Status: uma herança cromática global foi corrigida e protegida por teste. O Estilo 2 continua sem homologação integral de navegador/publicação.
