# Auditoria RUN 106 — Estilo 3: Essência Luminosa

**Data:** 08/11/2026 (America/Sao_Paulo)  
**Branch:** `fix/essencia-luminosa-dialog-focus-mainline-run12`  
**Base sincronizada:** `main` (sem commits pendentes de sincronização no momento da verificação)  
**Situação:** correções registradas em branch isolada; não mescladas nem homologadas em produção.

## Corrigido

### 1. Foco e teclado — 13 superfícies em 12 componentes

Sete diálogos antes condicionados apenas ao Natural Sereno agora também ativam o gerenciamento de foco na Essência Luminosa, preservando o suporte anterior:

- Anamnese Energética
- Cursos e Formações
- Dashboard de Progresso
- Contato
- Vídeo de Apresentação
- Relatório e Certificado
- Painel Administrativo

Outras seis superfícies receberam gerenciamento de foco específico do Estilo 3:

- Pausa do Dia / Daily Tip
- Acolhimento / Welcome
- Celebração de Progresso
- Player — bloqueio de acesso
- Player — sessão concluída
- Detalhe do Dia

O hook existente mantém foco inicial, contenção de Tab/Shift+Tab, fechamento por Escape e restauração do foco. Não foi criado um segundo mecanismo.

### 2. Logo do acolhimento

O `WelcomeModal` apontava para `/cura_integrada_brand_portal.png`, arquivo que não existe na raiz de `public/`. Substituí a referência quebrada pelo `APPROVED_LOGO_DATA_URI` e pelo wrapper `ep-brand-signature-wrap` / `ep-brand-signature`.

A camada aprovada do Estilo 3 mantém a assinatura com baixa opacidade (30% desktop / 26% mobile), sem fundo ou moldura dominante. O texto do acolhimento foi preservado.

### 3. Vazamento de cores em componentes compartilhados

- `#day-detail-modal` não possuía override específico do Estilo 3 e exibia acentos índigo, emerald e âmbar. Acrescentei regras na camada final `essencia-luminosa-approved-overrides.css`, convertendo esses estados para sálvia, champagne e ouro suave.
- A celebração de progresso já neutralizava o verde de um link, mas o componente usa um **button** `bg-emerald-600`. Corrigi o seletor para esse elemento e neutralizei também o ícone rose, sem alterar a semântica das ações.

### 4. Movimento reduzido

Acrescentei `motion-reduce:animate-none` ao pulso do player, indicador de etapa, entrada da Pausa do Dia e ícones animados da celebração. O `SacredEnergyCanvas` já interrompe seu loop de animação quando `prefers-reduced-motion` está ativo.

## Preservado e revalidado

- **Referência oficial:** o seletor continua apontando para `/brand/essencia-luminosa/prancha-oficial.webp` (320 × 240). Não recuperei pranchas antigas nem substituí o card por outra referência.
- **Paleta:** marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro `#A87E37`, areia e oliva clara.
- **Logo:** assinatura discreta, sem competir com a cena.
- **Seletor:** quatro opções; seleção inicial vazia; confirmação desabilitada até a escolha; tema aplicado somente após confirmação explícita. Preferência salva não equivale a consentimento de aplicação na sessão.
- **CSS:** 24 folhas específicas examinadas. Os seletores estão escopados ao Estilo 3; a busca por valores hex antigos conhecidos não encontrou declarações ativas desses valores nos corpos das regras. As classes legadas encontradas em componentes compartilhados são neutralizadas pelos overrides; os dois vazamentos descritos acima foram corrigidos.
- **Voz:** o Estilo 3 continua exigindo voz neural ElevenLabs. ID oficial de contingência permanece associado à Marianne; não há fallback silencioso para SpeechSynthesis nos fluxos protegidos.
- **Solfeggio:** oito frequências (396, 417, 432, 528, 639, 741, 852 e 963 Hz) continuam bloqueadas durante reprodução do protocolo e prévia neural; ambiências não tonais e silêncio permanecem disponíveis.
- **Diário:** `DailyDiaryModal` continua conectado ao callback `handleSaveDiaryDay` do `App.tsx`; exportação preservada.
- **Player:** sincronização e fluxo de sessão preservados; política de áudio impede Solfeggio durante fala do protocolo.
- **Pagamentos:** checkout InfinitePay, confirmação server-side, comparação do valor verificado com `order.cents` e webhook preservados. Nenhum preço, cupom ou regra comercial foi alterado.
- **Outros estilos:** nenhuma paleta ou composição visual dos Estilos 1, 2 e 4 foi alterada nesta correção. Os sete diálogos compartilhados mantêm o gerenciamento de foco anterior do Natural Sereno.

## Varredura página a página

As 24 folhas CSS examinadas cobrem:

1. Home/cena e acolhimento
2. Cabeçalho e navegação inferior
3. Jornada e player
4. Configurações e áudio
5. Anamnese
6. Numerologia
7. Ho'oponopono
8. Banhos de Ervas
9. Chakras
10. Diário e painel do diário
11. Pausa do Dia
12. Conquistas e celebrações
13. Cursos e formações
14. Contato
15. Vídeo de apresentação
16. Modais compartilhados
17. Instalação mobile
18. Seletor e prévias
19. Planos e checkout
20. Componentes de acolhimento e onboarding

A inspeção CSS foi estática; não equivale à homologação visual renderizada de cada rota.

## Validação e bloqueios

- O teste `tests/essencia-luminosa-dialog-focus.test.ts` foi ampliado para cobrir foco, seletor explícito, prancha, logo oficial, cores do detalhe do dia, celebração e movimento reduzido.
- **A suíte não foi executada nesta rodada.** O workflow atual só dispara em `pull_request` para `main` ou `workflow_dispatch`; não há run associado ao HEAD desta branch. A tentativa de clonar o repositório no executor falhou por indisponibilidade de resolução de `github.com`.
- A Vercel criou o deployment de preview `dpl_2eshfWUEYfxxYcFgq36B6jL1q2Vg` para o commit `25ceae8`, que terminou em `BUILD_FAILED — Resource provisioning failed`. A consulta de eventos de build não retornou logs. Não foi feita nova tentativa de deployment.
- O domínio de produção ainda aponta para o deployment READY do commit antigo `5bd202e`; os cinco deployments de produção mais recentes consultados estão em erro. O código desta auditoria não está publicado.
- A fotografia da Home continua servida por CDN externo; autoria/licença específica e cópia local versionada permanecem pendentes.
- O PNG original `1001196521.png` não foi recuperado pela Biblioteca nesta execução. O card versionado permanece em 320 × 240; a derivação maior disponível na conversa não foi substituída no repositório sem nova comparação com o original.

## Pendências

1. Executar CI, TypeScript, build e a nova suíte de testes.
2. Fazer homologação visual renderizada, página por página, em desktop e mobile.
3. Testar voz neural, Solfeggio, player, Diário e animações em dispositivos reais.
4. Homologar InfinitePay em sandbox e webhook.
5. Confirmar origem/licença da fotografia e decidir sobre cópia local.
6. Resolver o provisionamento da Vercel antes de publicar.

**Conclusão:** foram corrigidos vazamentos visuais e lacunas de foco em componentes compartilhados, sem reconstruir páginas aprovadas. A branch está separada da produção; não declarar concluído até CI, homologação visual, sandbox e publicação passarem.
