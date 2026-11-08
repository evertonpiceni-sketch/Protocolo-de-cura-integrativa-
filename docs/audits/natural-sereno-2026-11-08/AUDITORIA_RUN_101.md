# Auditoria RUN 101 — Estilo 1: Natural Sereno

**Data:** 08/11/2026  
**Branch:** `audit/natural-sereno-run97-mainline-2026-11-08`  
**HEAD validado:** `f0ce027ef28feb0f0021c97d51187852d9ee197e`  
**PR:** #74 — aberta, em rascunho, mergeable; 46 commits à frente e 6 atrás da `main`.

## Corrigido nesta rodada

### Persistência do perfil, Diário e progresso
A auditoria encontrou chamadas diretas de sincronização sem política uniforme de retry. Em falhas transitórias, o estado local podia permanecer atualizado enquanto o servidor não recebia a alteração.

- Criado `src/lib/userSync.ts`, com até 24 tentativas, backoff limitado, respeito a `Retry-After` e retry para rede e respostas transitórias 409, 423, 429, 500, 502, 503 e 504. Erros permanentes não são repetidos.
- `saveProfile` agora envia somente o perfil quando apenas o perfil muda. Envia perfil e progresso juntos somente quando ambos foram calculados a partir do mesmo snapshot.
- `saveProgress` envia somente o progresso, evitando sobrescrever perfil mais recente.
- Conclusão de sessão, reinício do programa e seleção de protocolo enviam snapshots compostos pelo helper.
- A confirmação do estilo salva apenas a preferência do perfil e aguarda a persistência antes de concluir a seleção.
- O cadastro inicial usa a mesma política com limite curto de três tentativas, preservando o fluxo de cadastro sem exigir novo registro quando a sincronização estiver temporariamente indisponível.

O patch legado `requiredLayoutChoiceEntryPatch.ts` continua fora do caminho ativo; não foi reativado.

## Preservado e reaudidado

- Seletor dos quatro estilos permanece sem seleção inicial; o botão de confirmação só habilita após escolha explícita.
- O Estilo 1 usa a prancha de referência otimizada em `docs/visual-qa/natural-sereno/reference.jpg`. A cópia de Biblioteca `Painel UX_UI Natural Sereno.png` foi inspecionada e corresponde à mesma composição. O identificador original informado no pedido não foi localizado como item de Biblioteca nesta execução; não houve substituição por uma prancha diferente.
- A prancha histórica contém escolhas visuais antigas de verde profundo e botões arredondados. Essas escolhas permanecem subordinadas às decisões posteriores: creme/marfim, café/marrom, dourado refinado, verde apenas como acento, botões premium e logo discreto.
- Varredura estática de 12 folhas CSS do Natural Sereno e da ordem de importação. Os estilos globais escuros do shell antigo não são renderizados no ramo Natural Sereno, que utiliza `TransformationHome`; não foram removidos globalmente para evitar regressões nos Estilos 2–4.
- Voz neural do Natural Sereno permanece sem fallback silencioso para SpeechSynthesis; a prévia neural bloqueia a seleção de frequências Solfeggio enquanto toca.
- Preservados player, seis etapas, animações e respiração 4–3–5.
- Estilos 2, 3 e 4, seus tokens, componentes e decisões posteriores não foram redesenhados.

## Validação automatizada

GitHub Actions **#42534455478**:

- 171/171 testes aprovados.
- `npm audit`: zero vulnerabilidades.
- TypeScript: aprovado.
- Build Vite: aprovado, 2.248 módulos transformados.
- Entry points Vercel/Express, JWT, segredos, autenticação administrativa, smoke tests e endpoints de pagamento fail-closed: aprovados.

## Pendências

1. Não há deployment/preview para o HEAD validado. O último deployment disponível de um commit anterior da branch terminou com `BUILD_FAILED — Resource provisioning failed`; sem preview não é possível homologar visualmente todas as páginas em desktop e mobile.
2. A reprodução real da voz escolhida e as transições entre narração, Solfeggio e ambiência ainda precisam ser escutadas em navegador.
3. A configuração `INFINITEPAY_API_KEY` não aparece entre as variáveis do projeto; `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL` estão presentes em produção. O checkout permanece fail-closed; sandbox e webhook pendentes.
4. A variável antiga `UPSTASH_DB_KEY` permanece limitada a uma branch de auditoria antiga e marcada como `readable-secret`; não foi alterada.
5. Revisão independente do HEAD atualizado ainda pendente.

**Sem merge, publicação em produção ou cobrança real.**
