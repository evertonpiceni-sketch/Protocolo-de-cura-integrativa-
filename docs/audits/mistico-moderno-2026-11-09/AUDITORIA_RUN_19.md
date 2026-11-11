# Auditoria Estilo 4 — Místico Moderno — Run 19

**Data:** 09/11/2026  
**Base atual da main:** `41724715950186ba1715b61e1e921a2dcd30a7d6`  
**Código auditado nesta rodada:** `76114416d2e627585acedc239b22cd44c8451211`  
**Branch:** `fix/mistico-moderno-run15-mainline-2026-11-09`  
**Escopo:** auditoria estática página a página e correção de tokens semânticos que ainda podiam herdar a paleta Natural Sereno. Sem merge e sem publicação.

## Corrigido

- Encontrada uma lacuna no bloco `:root[data-layout="mistico-moderno"]` de `src/approved-theme.css`: faltavam aliases semânticos compartilhados (`--sage-subtle`, `--sage-border`, `--journey-*`) e tokens de apoio (`--layout-bg`, `--layout-accent-soft`, `--layout-gold-soft`, `--layout-text-soft`). Os aliases globais podiam conservar valores sálvia/café do tema base em componentes legados ou futuros.
- Mapeados esses tokens exclusivamente para a paleta Místico Moderno: azul-noturno, violeta, dourado/âmbar e marfim. Nenhuma regra dos Estilos 1–3 foi alterada.
- Acrescentado teste de regressão que confirma o mapeamento e rejeita no bloco ativo do Estilo 4 os valores Natural Sereno `#5E7153`, `#7E9473`, `#D5DDD1` e `#8F631E`.
- Confirmado que o seletor React usa estado inicial `null`, mantém a confirmação desabilitada até escolha, persiste apenas no CTA de confirmação e remove `data-layout` antes da confirmação. Logout reinicia a confirmação; Ajustes > Aparência abre o seletor, sem gravar diretamente o estilo.
- Confirmado que o card Místico Moderno usa `/brand/mistico-moderno/prancha-oficial-card.webp`, proporção 4:3 e `object-contain`, sem recorte.
- Reinspecionados os pontos de áudio: o Arcanjo exige ID ElevenLabs válido, a narração é servida por `playGuidedMeditation` sem fallback de voz do navegador, o Solfeggio inicia no `onplay` real e é interrompido em pausa; a retomada volta a disparar o evento de reprodução. A propriedade global de áudio continua bloqueada enquanto o Arcanjo está montado.
- Varredura estática das 25 folhas CSS do Místico: 366 blocos de regras identificados; 0 blocos sem o escopo `data-layout="mistico-moderno"`.

## Varredura estrutural — 12 superfícies

| # | Superfície | Conferência estrutural | Homologação renderizada |
|---|---|---|---|
| 1 | Splash / carregamento | Estado neutro antes da escolha; assinatura oficial discreta | Pendente |
| 2 | Boas-vindas / áudio | Camada Místico importada; voz neural salva exigida | Pendente |
| 3 | Página inicial / Home | Fundo noturno e tokens Místico; sem imagem herdada da Reintegração | Pendente |
| 4 | Cabeçalho / menu | Camada própria de cabeçalho e controles | Pendente |
| 5 | Jornada / lista de dias | Dashboard e marcos com CSS próprio; jornada aprovada de 21 dias preservada | Pendente |
| 6 | Player do dia | ID neural válido, sem fallback de SpeechSynthesis; conteúdo e fluxo preservados | Pendente |
| 7 | Anamnese | 639 Hz suspenso durante narração neural; camada noturna própria | Pendente |
| 8 | Resultado | Mesmo fluxo de Anamnese; dados e conteúdo preservados | Pendente |
| 9 | Biblioteca Integrativa | Cursos e mapas com folhas próprias | Pendente |
| 10 | Ferramentas de apoio | Arcanjo, oração, Ho'oponopono, chakras, banhos e tratamentos com escopo Místico | Pendente |
| 11 | Comunidade / contato / vídeo | Contato, promoção e estúdio com folhas próprias | Pendente |
| 12 | Perfil / Ajustes / Diário | Seletor explícito, áudio neural, Diário fechado por padrão | Pendente |

A varredura de CSS é estática; não substitui inspeção visual no navegador.

## Preservado

- Estilos 1, 2 e 3, incluindo a atualização de fotografia/proveniência da Elegância Profunda na `main`.
- Prancha do Estilo 4 como referência do card, subordinada às decisões posteriores: jornada de 21 dias, corpo neutro e logo como assinatura discreta.
- Logo oficial com opacidade final de 30% no desktop e 26% em telas pequenas; wrapper transparente no override final.
- Diário fechado por padrão, conteúdo, progresso e salvamento existentes.
- Player, animações e preferência `prefers-reduced-motion`.
- InfinitePay, preços, cupons, checkout, webhook e validação server-side. Nenhum arquivo de pagamento consta no diff deste PR.

## Pendente

1. **Imagens realistas próprias:** o repositório não contém um conjunto independente de fotografias aprovado para o Místico Moderno. Não reutilizei imagens dos outros estilos; o fundo permanece composto por camadas noturnas.
2. **Homologação visual:** capturas/renderização das 12 superfícies em desktop e mobile, conferindo alinhamento, nitidez, imagens, botões, logo e animações. O check Vercel continua falhando por `build-rate-limit`; não foi forçado novo deployment.
3. **Homologação auditiva:** ouvir a voz efetivamente salva no perfil e testar início, pausa, retomada, erro e encerramento do Solfeggio/player em navegador e dispositivo.
4. **Pagamento:** executar checkout e webhook InfinitePay em sandbox controlado. Nenhuma cobrança real foi realizada.

## Estado de validação e publicação

- A execução GitHub Actions **Security Audit #2067** foi iniciada no commit `76114416d2e627585acedc239b22cd44c8451211`; resultado ainda pendente no momento do registro.
- Comparação com a `main` atual: **15 commits à frente, 0 atrás**; PR tecnicamente integrável.
- PR permanece em rascunho. Sem merge e sem publicação em produção.
- Não declarar o Estilo 4 concluído até homologar visual, áudio e sandbox financeiro.
