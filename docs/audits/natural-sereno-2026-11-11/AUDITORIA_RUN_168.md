# Auditoria RUN 168 — Estilo 1: Natural Sereno

**Data:** 11/11/2026 — 07:37 BRT  
**HEAD das correções de código e teste (antes do registro):** `d4fd6a72c4db03dadbd603782b4a95f550cb20f2`  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**Base verificada antes desta rodada:** `5d3dcafea92e7444cc60d4d80cd453a86a2034df`

## Corrigido

1. **Logo fixo que disputava espaço com os controles:** a assinatura estava presa no canto superior direito da jornada, na mesma região dos botões “Pausa Consciente” e “Ainda Há Algo em Mim”. Foi movida para o cabeçalho interno do painel, em tamanho discreto, sem moldura, disco ou halo.
2. **Logo ausente nos estados sobrepostos:** o logo principal ficava atrás dos overlays de z-index superior. Agora a assinatura oficial também aparece na sessão imersiva, no roteiro do dia, em Pausa Consciente e em Ainda Há Algo em Mim.
3. **Cascata visual:** a camada final do Natural Sereno força opacidade de 30%, fundo transparente, sem borda, filtro ou sombra para essas assinaturas.
4. **Proteção de regressão:** criado `tests/natural-sereno-run168-reintegration-brand-signature.test.ts` com quatro testes para as quatro áreas e a cascata.

## Preservado

- Logo oficial `APPROVED_LOGO_DATA_URI`; opacidade de 30% e função de assinatura visual.
- Prancha oficial do Estilo 1 no seletor, sem recorte; decisões posteriores continuam prevalecendo sobre elementos históricos da prancha.
- Paleta creme/marfim, café/marrom, dourado refinado e verde apenas como acento natural.
- Fotografias realistas, enquadramentos responsivos, corpo neutro e movimento da luz.
- Conteúdo dos 21 dias, roteiro, tempos, player, controles, animações, música e cues.
- Marianne `mJqP14JQFEK0PojR5lfV`, autenticação da narração e ausência de fallback robótico na Reintegração.
- Política Solfeggio/voz, sincronização e privacidade do Diário.
- InfinitePay em modo fail-closed; nenhuma regra de preço, cupom ou credencial foi alterada.
- Estilos 2, 3 e 4: nenhuma folha de tema ou componente de tema foi redesenhado. A assinatura de marca é uma regra geral já aprovada para a Reintegração.

## Reauditoria estática

Foram conferidos no código — **9/9 verificações estáticas passaram**:
- remoção do logo fixo que colidia com os controles superiores;
- assinatura presente no cabeçalho da jornada;
- assinatura presente na sessão imersiva e no roteiro;
- assinatura presente nos dois modais;
- opacidade de 30% e ausência de moldura/disco/fundo;
- seletor continua sem pré-seleção e exige confirmação;
- rota de voz da Reintegração continua com Marianne e autenticação;
- política Solfeggio continua bloqueando frequências tonais durante voz;
- checkout continua exigindo API Key e confirmação server-side.

O teste novo foi adicionado, mas **a suíte Node/TypeScript, TypeScript e build não foram executados**. Não declarar CI aprovada.

## Comparação seletiva com `main`

Na comparação de código, antes do commit de registro do relatório, a branch estava **290 commits à frente e 12 atrás** de `main`. Não foi feito merge/rebase automático. A comparação dos arquivos mostrou regressões que não podem ser recuperadas:
- `api/index.ts` em `main` volta a Rachel (`21m00Tcm4TlvDq8ikWAM`), remove a autenticação da rota e torna o áudio público/cacheável por um ano; a branch preserva Marianne, sessão autenticada e cache privado.
- `server.ts` em `main` remove a validação de identidade da conta na sincronização de perfil/progresso; a branch preserva a proteção contra gravação cruzada.
- `ArcanjoProtocolView.tsx` em `main` reintroduz nomes, posições e visualização de chakras; a decisão posterior aprovada exige corpo neutro.
- `paymentRoutes.ts` em `main` remove o bloqueio de ambiente de produção; a branch permanece fail-closed até existir configuração de sandbox verificável.
- `App.tsx` em `main` remove o fluxo de sincronização pendente por conta e volta ao fallback antigo de cor do navegador.

Essas alterações foram deliberadamente **não incorporadas**. A reconciliação futura deve continuar seletiva.

## Infraestrutura e pagamentos — pendente

- Vercel: projeto `protocolodecuraintegrativa` está `live=false`; o deployment mais recente do projeto está em `ERROR / BUILD_FAILED — Resource provisioning failed`, sem eventos de build disponíveis.
- O último deployment listado para a branch é de um ancestral (`9aca204f`), também em `ERROR`; não existe Preview READY para o HEAD desta rodada.
- O projeto está no plano Hobby; não forcei novo deployment durante o bloqueio de provisionamento/rate limit.
- O inventário de variáveis foi lido sem descriptografar segredos. Para esta branch há namespace Upstash isolado em Preview; `PUBLIC_APP_URL` não está configurada no Preview desta branch. Não foi identificada `INFINITEPAY_API_KEY` no inventário visível. O handle e URL canônicos permanecem apenas em Production.
- InfinitePay sandbox/webhook permanece pendente; nenhuma cobrança foi realizada.

## Pendente

- Executar CI, TypeScript, suíte completa e build no HEAD atualizado.
- Recuperar provisionamento da Vercel e gerar Preview READY.
- QA visual renderizado página a página em desktop e celular, incluindo os novos posicionamentos do logo.
- Escuta real da Marianne, transições Solfeggio/narração e player ponta a ponta.
- Diário ponta a ponta e homologação do checkout/webhook em sandbox.
- Reconciliar os 12 commits divergentes somente após revisão de cada diff, preservando as decisões aprovadas e rejeitando as regressões listadas.

Nenhum merge, publicação em Production, alteração de credenciais ou pagamento real foi realizado.
