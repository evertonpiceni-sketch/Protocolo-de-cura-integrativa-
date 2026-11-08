# Auditoria RUN 80 — Estilo 2: Elegância Profunda

Data: 2026-11-08  
Branch auditada: `main`  
HEAD auditado: `40bf74a175f2f0c82825057039ff736e44c2b1ed`

## Resultado executivo

A auditoria não encontrou regressão nova que justificasse alteração de código do Estilo 2. A decisão correta nesta rodada foi preservar o código aprovado, concluir a reauditoria estática e registrar as pendências reais, sem criar sobrescritas ou retrabalho.

Desde a RUN 79, a branch recebeu dois commits voltados à Essência Luminosa e a fluxos compartilhados de planos/pagamentos. O diff foi revisado. As mudanças compartilhadas não removeram a confirmação explícita do seletor nem alteraram as 21 folhas CSS específicas da Elegância Profunda.

## Corrigido nesta rodada

- Nenhuma alteração funcional ou visual foi necessária no Estilo 2: não foi identificada regressão comprovada.
- A reauditoria confirmou o escopo das 21 folhas CSS específicas, todas importadas em `src/main.tsx` e com seletores limitados a `data-layout="elegancia-profunda"`.
- A revisão do seletor confirmou estado inicial sem seleção, CTA neutro e desabilitado antes da escolha, confirmação explícita e persistência antes de ativar o estilo.
- A conferência dos fluxos de pagamento confirmou a separação entre acesso avulso e acompanhamento individual, protegendo contra mistura de preços.

## Preservado e revalidado

### Identidade e páginas

- Paleta Elegância Profunda: verde profundo intencional, dourado nobre, champagne, bronze e marfim.
- Logo oficial como assinatura discreta; regras específicas mantêm opacidade de 30% e wrapper transparente.
- 21 folhas CSS específicas verificadas: base/hero, modais e Prática Individual, Anamnese, oração de São Miguel, Contato, Banhos de Ervas, Mapas/Numerologia, Diário, Diário de Reconexão, detalhe do dia, Ho'oponopono, Promoção, Configurações/áudio, Cursos, Conquistas, navegação inferior, instalação mobile, cabeçalho, dashboard e player.
- Nenhum seletor sem escopo do Estilo 2 foi encontrado na varredura estática.
- `--ep-scene:none` permanece até haver fotografia real de natureza exclusiva e aprovada. Não foi reutilizada imagem da Reintegração ou de outro estilo.
- Jornada funcional de 21 dias e corpo neutro permanecem intactos.

### Seletor e componentes antigos

- `selectedLayout` inicia em `null`.
- O CTA permanece neutro e desabilitado antes da escolha.
- `onSelect` só é chamado após confirmação.
- `layoutConfirmedThisSession` inicia em `false`; preferência persistida não equivale a consentimento nesta sessão.
- Logout limpa a confirmação.
- `OnboardingFlow` permanece ativo.
- `WelcomeModal` e `elegancia-profunda-welcome-audit.css` permanecem fora do fluxo ativo.

### Voz, Solfeggio, Diário e player

- Estilo 2 exige ID ElevenLabs válido e salvo; não usa fallback silencioso para SpeechSynthesis.
- A prévia neural suspende frequências Solfeggio; ambiências não tonais podem continuar.
- O player do protocolo usa a política de áudio por fase e não reinicia Solfeggio durante a fala.
- Wake Lock permanece condicionado à reprodução e é liberado ao pausar/concluir.
- Diário mantém callback de salvamento conectado.
- Não houve alteração na cadência, scripts ou animações aprovadas.

### Pagamentos

- Acessos avulsos: 7 dias = R$ 25,00; 21 dias = R$ 50,00.
- Acompanhamentos individuais: 7 dias = R$ 59,90; 21 dias = R$ 99,90.
- Cupons promocionais dos catálogos: PROMO15 e PROMO20; VIP7 permanece como fluxo de teste temporário, não como cupom de desconto de checkout.
- Checkout InfinitePay, validação server-side do valor confirmado e concessão única do acesso permanecem cobertos pelos testes.
- Não há retorno ao PIX manual nos fluxos de Prática Individual/Numerologia.

## CI e implantação

Execução mais recente associada ao HEAD: GitHub Actions [#42441588324](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42441588324).

- Security Audit: sucesso.
- `npm audit`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes: 117.
- Build Vite + bundle Express: aprovado.
- Entry points Express: aprovados.
- Verificações de segredos, JWT fail-closed e proteção administrativa: aprovadas.
- Smoke tests e endpoints de pagamento fail-closed: aprovados.

O status combinado do commit no GitHub ainda registra Vercel como `failure`, com destino `build-rate-limit`. Portanto, CI verde não equivale a implantação de produção homologada.

## Pendências

1. Incorporar prévia de maior densidade da prancha original, usando a fonte original sem interpolação artificial.
2. A fonte original `1001194194.png` / `file_00000000121c820e931b56bb6b1467e9` foi registrada e inspecionada na RUN 79; nesta execução, a busca de arquivos acessíveis não retornou o original. A prévia no repositório continua em `public/brand/elegancia-profunda/prancha-oficial.svg`, com WebP incorporado de 240 × 180 px. Não foi substituída.
3. Obter/aprovar fotografia real de natureza exclusiva do Estilo 2; manter `--ep-scene:none` até aprovação.
4. Executar comparação visual real de todas as páginas em desktop e celular, incluindo player e silhueta neutra.
5. Testar voz neural, Solfeggio, ambiências, animações e Diário em dispositivos reais.
6. Realizar transação controlada InfinitePay em ambiente apropriado e verificar webhook e liberação de acesso.
7. Resolver o bloqueio de implantação Vercel `build-rate-limit` e confirmar a versão publicada.

## Critério de continuidade

Não reabrir paleta, logo, seletor após confirmação, isolamento CSS, jornada de 21 dias, corpo neutro, catálogo de voz ou checkout sem evidência concreta de regressão. A próxima rodada deve priorizar a fonte visual em alta densidade, fotografia aprovada, QA visual real e homologação funcional/produção.
