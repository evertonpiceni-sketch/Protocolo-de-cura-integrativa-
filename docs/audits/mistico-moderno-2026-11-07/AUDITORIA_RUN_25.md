# Auditoria — Estilo 4 · Místico Moderno — Run 25
Data: 07/11/2026
Branch: `fix/mistico-moderno-audit-run25-2026-11-07`
Base: `main` em `65a042bef15a9a12e08dd1f46d98f39c75c068b4`
Referência visual: prancha original `1001196522.png` / `file_000000009978820eb49581883ae6340d`; decisões aprovadas posteriores prevalecem.

## Corrigido
- A prévia do Místico Moderno usa a prancha oficial como card de referência, em SVG com imagem WebP incorporada, cartão noturno, texto marfim e moldura violeta.
- Logout limpa a confirmação de estilo da sessão anterior; a próxima conta precisa escolher e confirmar explicitamente.
- Player principal e Arcanjo/Solfeggio usam o alias `mistico-moderno-oficial`, resolvido no servidor pelo `ELEVENLABS_VOICE_ID`. Rachel, Marcus, Marianne, Sofia e IDs antigos conhecidos são recusados. Falha de voz não inicia Web Speech do navegador.
- Ajustes de áudio informa a voz configurada no servidor apenas no Estilo 4 e não oferece vozes locais como substitutas; os seletores neurais dos Estilos 2 e 3 foram preservados.
- Arcanjo/Solfeggio recebe tratamento noturno isolado: azul-noturno/índigo, violeta discreto, dourado/âmbar e marfim. Dias não concluídos usam índigo; cores semânticas dos dias ativos/concluídos permanecem.

## Preservado
- Estilos 1, 2 e 3, pranchas/prévias aprovadas e seletor React único.
- Diário, roteiros, player, animações compartilhadas e `SacredEnergyCanvas`.
- Política de áudio: frequências Solfeggio não reiniciam como trilha de fundo durante a narração principal; Arcanjo mantém a posse de áudio.
- Reintegração da Vida e assinatura oficial sutil/transparente.
- Checkout InfinitePay, preços, cupons, confirmação server-side e regras de acesso. Nenhum arquivo de pagamento foi alterado.

## Reauditoria estática
- O servidor resolve/rejeita o alias antes da consulta ao cache.
- Cliente e servidor compartilham `fallbackToSpeechSynthesis`; Místico Moderno falha fechado.
- A nova folha Arcanjo é restrita a `data-layout="mistico-moderno"`.
- Testes de regressão adicionados para prancha, seleção explícita, logout, voz, Solfeggio e escopo visual.

## Pendente
- CI completo no novo PR; build/testes ainda não declarados aprovados.
- O workflow anterior encontrou 9 vulnerabilidades de dependências (3 moderadas, 6 altas); nenhuma dependência foi atualizada sem análise de compatibilidade.
- Homologação renderizada de todas as páginas autenticadas em desktop/mobile e audição da voz real. O ID do servidor é protegido; o alias está implementado, mas a identidade audível exige escuta.
- Vercel bloqueou deploys pelo limite diário `api-deployments-free-per-day`; sem preview não há homologação visual runtime.
- Transação real InfinitePay não executada; o código de pagamento foi preservado.

## Situação
Branch isolada e PR de rascunho; sem merge na `main` e sem deploy de produção.
