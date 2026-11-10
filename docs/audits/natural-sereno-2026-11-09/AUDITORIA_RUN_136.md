# Auditoria RUN 136 — Estilo 1: Natural Sereno

Data: 2026-11-09 (America/Sao_Paulo)

## Corrigido

- No player principal, a silhueta neutra recebia `currentStage.colorTheme.glow`. A definição compartilhada de etapas ainda contém brilhos índigo, esmeralda, amarelo, violeta, rosa e âmbar; isso fazia a luz do corpo mudar de cor conforme a etapa no Natural Sereno. A ramificação do Estilo 1 agora usa o valor fixo `rgba(200,157,82,.16)`, mantendo a luz dourada uniforme. Os temas compartilhados continuam intactos para os outros estilos.
- No protocolo Arcanjo, a barra de carregamento indeterminada ainda usava `via-[#d4af37]`. Foi acrescentada uma regra final exclusiva de `:root[data-layout="natural-sereno"]` para converter esse brilho em dourado refinado `rgba(200,157,82,.72)`.
- Atualizado `tests/natural-sereno-arcanjo-neutral.test.ts` para proteger a luz corporal uniforme e o brilho dourado do Arcanjo.

## Preservado

- Seletor obrigatório dos quatro estilos, sem pré-seleção e com confirmação explícita antes de aplicar o tema.
- Card Natural Sereno com a prancha versionada em `docs/visual-qa/natural-sereno/reference.jpg`, sem recorte; as decisões posteriores de paleta, corpo neutro e logo discreto continuam prevalecendo.
- Creme/marfim, café/marrom, dourado refinado e sálvia apenas como acento; paisagens realistas e enquadramentos responsivos já existentes.
- Logo oficial como assinatura sutil.
- Conteúdo dos seis estágios, roteiro do Arcanjo, voz neural, Solfeggio, Diário, sincronização por conta, player, animações e respiração 4–3–5.
- Estilos 2, 3 e 4, inclusive os seus temas de etapa, sem alteração.
- Regras server-side, locks e validações InfinitePay; nenhuma cobrança foi executada.

## Reauditoria

- Conferência estática após as alterações: a ramificação Natural Sereno usa o brilho fixo dourado e não referencia mais `currentStage.colorTheme.glow`.
- A regra RUN 136 está escopada ao Arcanjo no Natural Sereno; o token legado permanece apenas na classe compartilhada de origem e não foi removido dos demais estilos.
- Os testes correspondentes foram atualizados.
- **Não há GitHub Actions associada ao HEAD atual**; portanto, suíte completa, TypeScript e build não estão comprovados nesta rodada.
- O único status reportado no HEAD é Vercel em falha por `build-rate-limit`; não existe preview READY para inspeção renderizada.
- A verificação da referência original `1001196520.png / file_00000000317c820ebaad657dc3680de5` não recuperou os bytes originais independentemente. A derivação JPEG versionada permanece preservada, sem substituição.

## Pendências

1. CI completa no HEAD atualizado, incluindo testes, TypeScript e build.
2. Preview navegável e inspeção visual página a página em desktop e mobile.
3. Escuta real de Marianne, Solfeggio e ambiência; validar pausa, retomada, término e falha em dispositivo.
4. InfinitePay sandbox: checkout, confirmação e webhook.
5. Reconciliar os 12 commits posteriores de `main` por partes, preservando as aprovações dos Estilos 2, 3 e 4, a política de áudio, a sincronização por conta e as proteções financeiras.

## Estado

- Correções de código e testes registradas na branch da PR #79.
- Sem merge, publicação em produção ou cobrança real.
- A PR permanece em rascunho e divergida da `main`; a contagem final será atualizada na descrição após o commit deste relatório.
