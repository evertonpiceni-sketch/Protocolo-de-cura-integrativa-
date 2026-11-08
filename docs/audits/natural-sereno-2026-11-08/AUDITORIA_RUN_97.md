# Auditoria RUN 97 — Estilo 1: Natural Sereno

**Data:** 08/11/2026  
**Base:** `main` na revisão `8c8c9867aa38244b5ef6cb992edc8501c52bb841`  
**Branch:** `fix/natural-sereno-logo-onboarding-2026-11-08`

## Corrigido

A revisão cruzada do CSS encontrou uma regressão real no logo do acolhimento:

- `src/natural-sereno.css` definia `opacity: 1` em `.ep-care-onboarding-card .ep-brand-signature`, com especificidade maior que a regra geral de 24% de `natural-sereno-final-audit.css`.
- Por isso, o logo do onboarding podia aparecer com força total, apesar da regra geral de assinatura discreta.
- A camada final `natural-sereno-approved-overrides.css` agora vence explicitamente a regra antiga: 30% no desktop, 26% em telas de até 640px, sem `mix-blend-mode:multiply` e sem filtro.
- O wrapper transparente, sem disco/moldura/sombra, foi preservado.

Foi criado `tests/natural-sereno-logo-audit.test.ts` para impedir o retorno da opacidade total e confirmar a ordem de importação das camadas.

## Preservado

- Prancha e referência versionada existentes; nenhuma imagem foi substituída ou recriada.
- Seletor dos quatro estilos: estado inicial sem seleção, confirmação obrigatória e aplicação somente após salvar a escolha.
- Identidade Natural Sereno: creme/marfim, café/marrom, dourado refinado e verde-sálvia apenas como acento.
- Paisagens reais, enquadramento do player e superfícies claras.
- Home, Comunidade, Diário, Ajustes, Cursos, Mapa Astral, Numerologia, Banhos, Ho'oponopono, Anamnese, Planos e Contato.
- Voz neural: IDs ElevenLabs válidos salvos são preservados; o caminho Natural Sereno desativa fallback para SpeechSynthesis.
- Solfeggio: oscilador exato para as frequências permitidas e interrupção durante prévia neural.
- Diário, sincronização resiliente, seis etapas, animações e respiração 4–3–5.
- Pagamentos: escolha de benefício Semestral/Anual, validação server-side do valor pago e proteção contra reutilização de transação.
- Estilos 2, 3 e 4 sem alterações visuais nesta rodada.

## Reauditoria

- Confirmada a ordem de carregamento: CSS base → folhas de auditoria → `natural-sereno-approved-overrides.css` por último.
- Confirmado o conflito de especificidade no logo do onboarding e adicionada regra de maior especificidade na camada aprovada.
- Confirmada a escolha nula inicial e a confirmação explícita no `LayoutChoiceModal`.
- Revisados os caminhos de voz neural, Solfeggio, Diário e confirmação de pagamento no código da `main`.
- A branch anterior RUN 96 não contém commits exclusivos em relação à `main` atual; esta correção parte diretamente da linha principal vigente e não recupera a branch antiga.

**CI GitHub Actions #1876 — execução `42518553276`: aprovada.**
- `npm audit`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes: **152/152 aprovados**, incluindo o novo teste do logo no onboarding.
- Build Vite: aprovado; 2.247 módulos transformados.
- Entry points Vercel/Express, padrões de segredos, JWT fail-closed, cadastro/admin, smoke tests e endpoints de pagamento fail-closed: aprovados.
- Check externo Vercel: continua em falha `build-rate-limit`; preview READY não disponível.

## Pendente

1. Preview Vercel READY e capturas reais página a página em desktop/mobile.
2. Escuta da voz escolhida com conta autenticada e teste real das transições narração/Solfeggio/ambiência.
3. Verificação da variável de ambiente InfinitePay e homologação financeira segura; nenhuma credencial foi lida ou alterada nesta rodada.
4. Confirmar que o arquivo original `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` corresponde à prancha versionada no repositório. A busca na conversa/Biblioteca não recuperou esse identificador exato; nenhuma imagem alternativa foi promovida a referência oficial.

**Segurança:** sem merge, publicação em produção, alteração de credenciais ou cobrança real.
