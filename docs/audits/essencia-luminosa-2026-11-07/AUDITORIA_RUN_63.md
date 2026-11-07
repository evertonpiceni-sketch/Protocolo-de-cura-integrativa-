# Auditoria Run 63 — Estilo 3 · Essência Luminosa

**Data:** 7 de novembro de 2026  
**Branch:** `main`  
**Base auditada:** `cbb68335f80fc64580c68d2722f6b1ead95f5159`  
**Referência visual:** prancha oficial do Everton `1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`; o seletor React permanece ligado ao derivado versionado `public/brand/essencia-luminosa/prancha-oficial.webp`. Decisões aprovadas posteriores prevalecem.

## Corrigido

- Encontrada uma aplicação automática indevida do Natural Sereno antes da escolha: `approved-theme.css` combinava `:root` com `:root[data-layout="natural-sereno"]`, ativando tokens do Estilo 1 mesmo quando o App removia `data-layout`.
- Separado o Natural Sereno para ativação somente por `:root[data-layout="natural-sereno"]`.
- Criado estado neutro de pré-seleção em `:root:not([data-layout])`, com superfícies e tokens neutros, sem assumir a identidade de nenhum dos quatro estilos.
- A tela de cadastro/login `ProfileSetup` usava a classe `ep-auth-style-one` e a cena de natureza do Natural Sereno antes de qualquer escolha. A classe foi substituída por `ep-auth-prestyle`; os estilos neutros de acesso foram adicionados ao fim de `approved-theme.css`, sem reutilizar fotografia de outro estilo.
- Logo da tela de acesso mantido como assinatura discreta, com opacidade de 30%.
- Adicionado teste de regressão para impedir que a tela pré-seleção volte a ativar Natural Sereno ou qualquer tema oficial automaticamente.

## Preservado

- Seletor React único, quatro cards e confirmação explícita; seleção inicial continua vazia.
- Card de Essência Luminosa continua usando `/brand/essencia-luminosa/prancha-oficial.webp` em `object-contain`.
- Paleta do Estilo 3: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`.
- Logo oficial discreto nas telas do Estilo 3.
- Voz neural do Estilo 3 continua usando ID ElevenLabs válido salvo no perfil, com Marianne como fallback oficial.
- Política de áudio do player continua bloqueando retomada de Solfeggio tonal durante a narração; ambiência não tonal permanece permitida.
- Diário e Diário de Reconexão, conteúdo e dados preservados.
- InfinitePay e confirmação server-side preservados; nenhuma rota, preço, cupom ou condição de liberação alterada.
- Estilos 1, 2 e 4 preservados; Natural Sereno agora só recebe sua paleta após confirmação explícita.

## Varredura estática desta rodada

- Pré-login/cadastro e estado sem estilo: corrigidos.
- Seletor/prévia dos quatro estilos: conferidos; confirmação explícita preservada.
- Home/header/dock, sessão/player/canvas, onboarding, Anamnese, Numerologia, Mapa Astral, Ho'oponopono, Banhos, cursos, Diário, Diário de Reconexão, áudio, planos e pagamento: camadas e proteções existentes conferidas por import/escopo e testes existentes; sem alteração de conteúdo ou lógica nesta rodada.

## Validação e pendências

- O novo commit inclui um teste de regressão adicional; resultado de CI ainda depende da execução do GitHub Actions.
- Homologação visual com capturas reais de cada página em desktop e celular permanece pendente.
- Teste real de voz ElevenLabs, transições Solfeggio/player/animações e checkout/webhook InfinitePay em sandbox permanece pendente.
- A recuperação da prancha PNG original para nova transferência binária ao repositório não foi repetida nesta rodada; o card derivado WebP válido foi preservado.
- Atualização isolada das dependências vulneráveis e nova publicação Vercel continuam pendentes; o último status disponível indicava `build-rate-limit`.

**Status:** corrigida uma falha real de aplicação automática do Natural Sereno antes da escolha. A identidade dos quatro estilos e as decisões aprovadas foram preservadas. A homologação visual/funcional completa continua aberta.
