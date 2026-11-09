# Auditoria RUN 133 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**Commit de código:** `1fd4fe278218bee49da8b8e7105eb2fb67c3f813`  
**PR:** #79 — aberta, em rascunho.

## Corrigido

1. **Cor da barra do navegador após a escolha do estilo.** A branch da PR não continha o efeito já presente na `main`. Ao alternar estilos, a barra do navegador poderia permanecer com a cor anterior. Agora ela fica neutra (`#F8F4EC`) enquanto a escolha ainda não foi confirmada e acompanha a primeira cor aprovada do estilo somente depois da confirmação explícita. Nenhuma paleta de página foi alterada.
2. **Proteção do fluxo de áudio do Arcanjo.** O código já interrompia Solfeggio antes de retomar a narração neural e permitia a frequência durante a pausa, respeitando `audioEnabled`. Acrescentei teste de regressão para impedir sobreposição futura.

Arquivos de código/teste:
- `src/App.tsx`
- `tests/natural-sereno-layout-reference.test.ts`
- `tests/natural-sereno-arcanjo-neutral.test.ts`

## Varredura realizada

Revisados os 12 arquivos CSS do Natural Sereno e as superfícies/fluxos principais: seletor, acolhimento, Home, menu, jornada, recursos, perfil, Anamnese, Perguntas Sistêmicas, Diário, Ho'oponopono, oração, Ajustes de áudio, Arcanjo, player, corpo neutro, Mapa Astral, Numerologia, Banhos, Prática Específica, planos e checkout.

Também conferidos:
- `NaturalSerenoHome` é o componente ativo do Estilo 1; a tela genérica antiga de `TransformationHome` retorna antes para os outros estilos e não é montada no Natural Sereno.
- O seletor React inicia com `selectedLayout = null`, exige escolha e confirmação; `data-layout` só é aplicado após confirmação e persistência.
- A prancha oficial está referenciada pelo nome e identificador informados, usa `object-contain` e mantém a cópia versionada `docs/visual-qa/natural-sereno/reference.jpg`.
- As imagens de acolhimento, vale, cachoeira, ondas e biblioteca Natural Sereno estão presentes na branch.
- A voz neural oficial é obrigatória no Natural Sereno; o patch bloqueia fallback para SpeechSynthesis.
- Solfeggio respeita a configuração global, é suspenso durante narração neural e é interrompido antes da retomada.
- Diário, sincronização por conta, corpo neutro, animações e respiração 4–3–5 permanecem preservados.
- As correções de cores antigas permanecem restritas a `data-layout="natural-sereno"`; não identifiquei nova chapa verde/amarela ativa nas camadas finais examinadas.

## Preservado

- Creme/marfim, café/marrom, dourado refinado e verde-sálvia somente como acento.
- Paisagens realistas e regras de enquadramento desktop/mobile já versionadas.
- Logo oficial sutil/transparente como assinatura.
- Card da prancha oficial e decisões posteriores que prevalecem sobre a arte de referência.
- Seletor explícito dos quatro estilos: Natural Sereno, Elegância Profunda, Essência Luminosa e Místico Moderno.
- Conteúdo terapêutico, player, Diário, áudio e regras comerciais.
- Estilos 2, 3 e 4 sem redesenho; nenhum componente rejeitado foi recuperado.

## Reauditoria e limites

- As alterações foram conferidas novamente nos arquivos e os testes de regressão foram adicionados.
- **Ainda não há execução GitHub Actions associada ao novo commit**; não declaro testes, TypeScript ou build aprovados nesta rodada. A última execução bem-sucedida conhecida (#2183) é anterior a este commit.
- Não há preview READY confirmado nesta rodada. Sem renderização navegável, a conferência visual pixel a pixel em desktop/mobile e a escuta real em dispositivo continuam pendentes.
- O deployment Vercel anterior da branch havia falhado por provisionamento/limite; precisa ser consultado novamente quando houver capacidade de implantação.
- InfinitePay permanece sem homologação sandbox de checkout, confirmação e webhook. Nenhuma cobrança foi feita.
- A branch ainda precisa reconciliar 9 commits posteriores da `main`; não foi feito merge ou atualização cega. O trabalho aprovado da Elegância Profunda e da Essência Luminosa deve ser preservado.

## Estado da entrega

- PR #79 aberta e em rascunho.
- Sem merge e sem publicação em produção.
- Sem cobrança real.
- Próximo passo: aguardar CI do novo commit; depois obter preview READY e concluir homologação visual, auditiva e financeira antes de qualquer integração.
