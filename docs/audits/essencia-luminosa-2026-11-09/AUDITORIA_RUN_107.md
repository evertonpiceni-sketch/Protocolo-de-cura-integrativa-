# Auditoria RUN 107 — Estilo 3: Essência Luminosa

Data: 2026-11-09  
Base auditada: `main` em `f60e28863375e9e5a7fd2ea42a796bb04a89e931`  
Branch de correção: `fix/essencia-luminosa-audit-run107-20261109`  
Pull request: #78 (rascunho, não mesclado)

## Referência oficial

O arquivo fornecido pelo Everton, `1001196521.png` (`file_0000000019d0820eb7a70b6c982619d6`), foi recuperado e inspecionado. Resolução: 1536 × 1152.

A prancha continua sendo a referência visual oficial do Estilo 3. O card já versionado em `public/brand/essencia-luminosa/prancha-oficial.webp` foi preservado, sem substituição. A prancha contém telas e amostras de uma versão anterior; suas referências antigas de 28 dias, destaque dominante do logo e códigos cromáticos não foram reintroduzidos. Prevalecem as decisões posteriores aprovadas.

## Corrigido

1. **Foco e teclado em diálogos compartilhados:** sete componentes que ainda ativavam `useDialogFocus` apenas para Natural Sereno agora também incluem Essência Luminosa: Anamnese, Cursos, Dashboard, Contato, Vídeo de Apresentação, Certificado/Relatório e Administração.
2. **Diálogos adicionais:** foco gerenciado também em Pausa do Dia, Boas-vindas, Celebração de Progresso, portão de acesso e conclusão da sessão, e Detalhe do Dia.
3. **Logo do acolhimento:** removida a imagem legada `/cura_integrada_brand_portal.png`; usado `APPROVED_LOGO_DATA_URI` dentro de `ep-brand-signature`. A camada própria do Estilo 3 garante opacidade de 30% no desktop e 26% em telas pequenas, com wrapper transparente e sem moldura/sombra.
4. **Detalhe do Dia:** adicionada camada CSS isolada por `data-layout="essencia-luminosa"`, com superfícies marfim/champagne e estados sálvia/ouro suave; neutraliza índigo, esmeralda e âmbar saturados desse modal.
5. **Celebração:** o ícone rosa residual passa a usar o acento sálvia do Estilo 3. O CTA WhatsApp é um link `a.bg-emerald-600`, já neutralizado pelo seletor específico existente; não foi criado override redundante para botão.
6. **Movimento reduzido:** microanimações do player, Pausa do Dia, Celebração e sessão respeitam `prefers-reduced-motion`.
7. **Regressão:** criado `tests/essencia-luminosa-dialog-focus.test.ts`, cobrindo foco, logo, seletor explícito, inventário das 24 folhas CSS, áudio/Solfeggio, Diário e contrato de pagamento.

## Preservado

- Paleta aprovada: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, ouro escuro `#A87E37`, areia e oliva clara como acentos.
- Card da prancha oficial e seletor dos quatro estilos com escolha explícita antes da aplicação.
- As 24 folhas CSS específicas do Estilo 3; a nova verificação mantém o inventário e a âncora de escopo.
- Natureza da Home e demais páginas aprovadas; nenhuma fotografia dos outros estilos foi reutilizada.
- Patch de voz oficial: IDs legados inválidos são normalizados para `OFFICIAL_PROTOCOL_VOICE_ID`; no Estilo 3 a chamada neural força `preferElevenLabs: true` e `fallbackToSpeechSynthesis: false`.
- Propriedade de áudio do Arcanjo: `OPEN_PROTOCOL_DAY` interrompe a trilha global antes da montagem da tela. A frequência específica do protocolo continua sob o controle do próprio fluxo do Arcanjo; nenhuma segunda lógica de parada foi introduzida.
- Oito frequências Solfeggio (396, 417, 432, 528, 639, 741, 852 e 963 Hz), bloqueio durante prévia neural e regra que exclui Solfeggio da trilha global da sessão.
- Diário, Diário de Reconexão, player e cadência respiratória 4–3–5.
- InfinitePay: confirmação server-side, valor efetivamente pago comparado ao valor do pedido, escolha de benefício para semestral/anual, cupons PROMO15/PROMO20 e VIP7 como degustação separada. Prática individual permanece em R$ 59,90 (7 dias) e R$ 99,90 (21 dias). Nenhuma regra comercial foi alterada.
- Estilos 1, 2 e 4 sem alterações nesta branch.

## Validação automatizada

Execução GitHub Actions: `42557055006` — sucesso.

- npm audit: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes: 165 aprovados, 0 falhas.
- Build: aprovado.
- Entry points Express/Vercel: aprovados.
- Verificações de segredos, JWT e registro/admin: aprovadas.
- Smoke test de saúde/registro: aprovado.
- Verificação fail-closed dos endpoints de pagamento: aprovada.

Durante a validação, foram corrigidos dois problemas do próprio patch antes do sucesso final: import ausente do hook em `App.tsx` e classe de movimento reduzido faltante no ícone do Raio Rosa. A execução final acima corresponde ao HEAD que contém essas correções.

## Pendente

- Homologação visual renderizada, página por página, em desktop e celular (recortes, contraste, tipografia, alinhamento, cartões e botões).
- Teste real de voz ElevenLabs/Marianne, frequências, ambiências, pausa, retomada e encerramento em dispositivos.
- Teste end-to-end de InfinitePay em sandbox, confirmação e webhook.
- A fotografia da Home permanece no CDN Unsplash; a página individual do fotógrafo não está vinculada no projeto. A licença geral do Unsplash permite uso comercial sem atribuição obrigatória, mas recomenda crédito quando possível; manter a imagem atual sem atribuição nova nesta correção.
- Publicação: o status Vercel continua em falha `build-rate-limit`. Nenhum deployment novo foi declarado e a produção não foi homologada.

## Controle de integração

A branch anterior do RUN 105 era divergente de `main`; ela não foi mesclada em bloco. Esta branch foi criada diretamente a partir do HEAD atual de `main` e contém somente as correções pontuais listadas acima.

PR #78 permanece em rascunho e não foi mesclado. O CI do GitHub passou; o check externo Vercel continua falhando por limite de build. Não houve alteração na produção.
