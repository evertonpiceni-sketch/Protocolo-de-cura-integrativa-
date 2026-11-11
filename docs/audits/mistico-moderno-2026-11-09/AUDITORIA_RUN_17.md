# Auditoria Estilo 4 — Místico Moderno — Run 17

**Data:** 2026-11-09  
**Base:** `main` — `f60e28863375e9e5a7fd2ea42a796bb04a89e931`  
**Branch de validação:** `fix/mistico-moderno-run15-mainline-2026-11-09`  
**Escopo:** corrigir somente a propriedade de áudio do Arcanjo no caminho de assinatura de 7 dias e consolidar os testes de seleção explícita/voz. Sem merge ou deploy.

## Corrigido nesta rodada

- **Arcanjo e áudio global:** criado o estado derivado `isArcanjoViewActive`, que considera tanto a abertura explícita (`showArcanjoView`) quanto a montagem automática prevista para `subscriptionPlan === 'arcanjo_7d'`. O efeito global, o desbloqueio por gesto, a renderização do protocolo e as permissões de áudio agora usam a mesma condição.
- Isso evita que uma alteração de perfil com áudio global desativado ou trilha em `none` execute `stopBG()` sobre o Solfeggio que pertence ao protocolo Arcanjo no plano de 7 dias. Também impede que o desbloqueio por gesto tente iniciar a trilha global enquanto essa tela está montada.
- **Seleção dos estilos:** a reauditoria confirmou que a árvore atual já exige confirmação em cada sessão: estado inicial não confirmado, modal obrigatório, persistência somente no CTA de confirmação e reset no logout. Em Ajustes > Aparência, o clique apenas solicita a abertura do seletor; não grava `visualLayout`. As observações 1 e 2 da RUN 16 estavam desatualizadas em relação ao código atual; foram cobertas por regressão, sem reescrever o fluxo aprovado.
- **Voz:** o Místico Moderno continua usando somente um ID ElevenLabs válido salvo no perfil. O ramo de voz do dispositivo/automática não é apresentado nesse estilo e o fallback nativo permanece desativado. Nenhum nome ou ID de voz foi presumido ou substituído.
- **Solfeggio/Arcanjo:** a frequência própria só começa no `onplay` real da narração neural; pausa interrompe o synth e a retomada do áudio volta a passar pelo callback de início. A correção do estado derivado impede que o controle global interrompa essa frequência no caminho de assinatura.
- Comentários técnicos de áudio foram atualizados para refletir a política de voz neural nos quatro estilos, sem alterar os demais estilos.

## Preservado

- Prancha oficial do Estilo 4 no seletor, derivada para `public/brand/mistico-moderno/prancha-oficial-card.webp`, exibida com `object-contain` e sem recorte.
- Identidade Místico Moderno: fundo noturno, azul-noturno/índigo/esmeralda/violeta, dourado/âmbar como acentos e marfim para leitura.
- Logo oficial como assinatura transparente e discreta; não aumentar contraste nem opacidade.
- Estilos 1, 2 e 3, conteúdos, jornadas, corpo neutro e componentes compartilhados aprovados.
- Diário fechado por padrão e respeito a `prefers-reduced-motion`.
- Player, roteiros e política de áudio existentes; correções limitadas ao ownership do Arcanjo.
- InfinitePay, preços, cupons, checkout e confirmação server-side. Nenhum arquivo de pagamento foi alterado.

## Varredura estrutural — 12 superfícies

| # | Superfície | Resultado estrutural | Homologação renderizada |
|---|---|---|---|
| 1 | Splash / carregamento | Referência visual e assinatura preservadas | Pendente |
| 2 | Boas-vindas / áudio | Catálogo neural e bloqueio de fallback preservados | Pendente |
| 3 | Página inicial / Home | Fundo herdado da Reintegração removido do tema Místico | Pendente |
| 4 | Menu principal | Camadas próprias de navegação preservadas | Pendente |
| 5 | Jornada / lista de dias | Conteúdo e progresso preservados | Pendente |
| 6 | Player do dia | Voz salva exigida; controle de áudio preservado | Pendente |
| 7 | Anamnese | 639 Hz suspenso durante narração neural | Pendente |
| 8 | Resultado | Fluxo e conteúdo preservados | Pendente |
| 9 | Biblioteca Integrativa | Componentes e conteúdo preservados | Pendente |
| 10 | Ferramentas de apoio | Arcanjo, Ho'oponopono e oração; ownership de áudio corrigido | Pendente |
| 11 | Comunidade | Componentes de contato/vídeo/navegação preservados | Pendente |
| 12 | Perfil / Ajustes | Seletor explícito, voz neural e Diário fechado | Pendente |

Os testes estáticos existentes continuam verificando o isolamento das folhas CSS do Místico sob `data-layout="mistico-moderno"`; a suíte cobre as regras de voz, Solfeggio, player, Diário e movimento reduzido.

## Validação e pendências

- A execução atual `Security Audit #42559031582`, no head de código `f26d0cc93f6b07ffa7987b4376daa2fdb88e7657`, concluiu com sucesso: `npm audit` encontrou 0 vulnerabilidades; 172 testes passaram e 0 falharam; TypeScript, build, smoke tests, verificações de segurança e endpoints de pagamento fail-closed também passaram.
- O novo head passou pela CI completa; o resultado foi confirmado nos passos de npm audit, TypeScript, testes de regressão, build e verificações de segurança/pagamento.
- O check Vercel anterior retornou `build-rate-limit`; não forcei novo deployment.
- **Pendente:** inspeção visual renderizada das 12 superfícies em desktop e celular, incluindo alinhamento, nitidez, imagens, botões e animações.
- **Pendente:** audição real da voz salva no perfil e teste de início/pausa/retomada/encerramento do Solfeggio e player em navegador/dispositivo.
- **Pendente:** homologação ponta a ponta do checkout e webhook InfinitePay com fluxo de teste controlado. Nenhuma cobrança real foi feita.

**Estado:** manter PR em rascunho. Não mesclar nem publicar em produção até concluir a homologação visual, auditiva e de pagamento.