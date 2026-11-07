# Auditoria — Estilo 4 Místico Moderno — RUN 30
Data: 2026-11-07

## Base e critério
- A auditoria foi reaberta sobre a linha principal atual, não sobre os PRs antigos de Estilo 4.
- A branch de trabalho é `audit/mistico-moderno-run30-2026-11-07`.
- O PR #50 estava 45 commits atrás da linha principal quando foi inspecionado; o PR #49 também era uma base anterior. Nenhum deles foi mesclado ou reutilizado como base.
- A prancha `1001196522.png` foi recuperada do contexto de arquivos e inspecionada. O conteúdo é JPEG 1536×1152, apesar da extensão .png. O seletor agora usa o ativo oficial derivado `public/brand/mistico-moderno/prancha-oficial.svg`, com a mesma composição 4:3. A incorporação do original em densidade integral permanece pendente.

## Corrigido nesta rodada
1. **Paleta oficial do Estilo 4:** tokens alinhados para azul-noturno `#07111F`, índigo `#141D3A` / `#26355F`, esmeralda controlada `#176B5B`, violeta `#6C3FA0`, dourado/âmbar `#C89D52` / `#E2B96B` / `#A87E37`, marfim `#F4F1EB` e texto secundário `#9AA8BD`.
2. **Seletor:** o cartão Místico Moderno usa a prancha oficial, superfície noturna, texto marfim, borda âmbar e cinco amostras da paleta. A escolha continua vazia por padrão; o botão de confirmação permanece desabilitado até seleção explícita. O texto e os tratamentos dos outros três cartões foram preservados.
3. **Heranças visuais:** auditoria estática dos 22 módulos CSS existentes do Estilo 4; todos os seletores encontrados permanecem escopados a `data-layout="mistico-moderno"`. Foram alinhados fundos, bordas e acentos dos módulos de modais, cabeçalho, guias, superfícies compartilhadas e player. Uma camada final `mistico-moderno-final-palette.css`, carregada após os estilos de página, neutraliza superfícies claras e verdes genéricas dentro dos modais e do Diário, sem atingir os outros estilos.
4. **Arcanjo/Solfeggio:** adicionada camada noturna isolada; o verde foi limitado a um acento esmeralda discreto no contexto energético. A reprodução exige a voz neural oficial e não inicia fallback nativo do navegador.
5. **Voz:** Configurações gerais, modal de áudio, Home, player e Arcanjo convergem para Marianne — Meditação, ID oficial `mJqP14JQFEK0PojR5lfV`. No Estilo 4, falha do serviço encerra a narração com aviso em vez de trocar por voz robótica.
6. **Player/animações:** o canvas recebeu paleta própria de dourado/âmbar e esmeralda controlada; o brilho do palco foi reduzido de 0,82 para 0,62. A camada final respeita `prefers-reduced-motion`.
7. **Seleção entre contas:** a linha principal já limpava confirmação e tema no logout; essa proteção foi preservada e coberta pelos testes existentes, sem alteração desnecessária.
8. **Pagamento:** reauditoria de `paymentRoutes.ts`, `paymentCatalog.ts`, `ProUpgradeModal.tsx`, `SpecificTreatmentModal.tsx`, `NumerologyModal.tsx` e `tests/payment.test.ts`. Confirmados checkout InfinitePay, confirmação server-side, 7 dias R$ 59,90, 21 dias R$ 99,90, PROMO15/PROMO20 e VIP7 restrito à degustação. Não há chave PIX manual nem `handleCopyPix` nos dois modais de prática/numerologia. Nenhuma regra comercial foi alterada.

## Preservado
- Estilos 1, 2 e 3, suas prévias, componentes e paletas.
- Conteúdo terapêutico, roteiros, Diário, mapas, numerologia, animações existentes e regras do player que não precisavam de alteração.
- Logo oficial como assinatura discreta/transparente; nenhuma alteração de marca.
- InfinitePay, preços, cupons, confirmação de pagamento e liberação de acesso.
- Nenhuma alteração em produção; nenhuma mesclagem na `main`.

## Pendente / bloqueios de homologação
1. O card já usa a composição oficial, mas o ativo versionado é uma derivação 240×180; substituir por exportação de alta densidade do original 1536×1152 para leitura nítida em zoom.
2. Capturas reais e comparação visual página por página em desktop e celular; a varredura desta rodada foi estática, não uma homologação de navegador.
3. Teste auditivo com credenciais ElevenLabs ativas para Marianne; teste de transição Solfeggio, pausa, retomada e encerramento em dispositivo.
4. Teste de persistência do Diário e de animações em navegador/dispositivo.
5. Transação controlada de checkout, retorno e webhook InfinitePay em sandbox.
6. CI do novo PR ainda pendente. A auditoria de dependências e a publicação Vercel devem ser avaliadas após a execução; não foram feitas atualizações indiscriminadas do lockfile.

## Arquivos principais
- `src/approved-theme.css`
- `src/config/layouts.ts`
- `src/components/LayoutChoiceModal.tsx`
- `src/components/AudioSettingsModal.tsx`
- `src/components/ArcanjoProtocolView.tsx`
- `src/components/MeditationSession.tsx`
- `src/lib/misticoModernoOfficialVoicePatch.ts`
- `src/mistico-moderno-arcanjo-audit.css`
- `src/mistico-moderno-final-palette.css`
- `tests/mistico-moderno-audit.test.ts`

**Estado:** correções registradas em branch própria; aguardando CI e homologação visual/funcional.