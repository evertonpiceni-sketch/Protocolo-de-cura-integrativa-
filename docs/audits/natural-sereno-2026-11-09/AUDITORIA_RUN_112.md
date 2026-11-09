# Auditoria RUN 112 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**HEAD:** `f7c6fd71a630c8176978d67b4299304ef2ae4e62`  
**PR ativa:** #79 — baseada na main `41724715950186ba1715b61e1e921a2dcd30a7d6`

## Corrigido

1. **Sessão entre abas:** a troca de conta em outra aba agora invalida a interface privada antiga. Logout limpa perfil, progresso, modais e áudio; troca para outra conta recarrega a sessão já autenticada. Foram adicionados testes para troca, logout, `localStorage.clear()` e chaves não relacionadas.
2. **Logo no acolhimento:** removido o disco branco, a borda e a sombra do wrapper antigo. A imagem permanece como assinatura discreta: 30% desktop e 26% mobile.
3. **Voz neural:** o endpoint de stream do player (`/api/tts/stream`) agora exige autenticação e rate limit. O Natural Sereno continua sem fallback silencioso para SpeechSynthesis.
4. **InfinitePay em preview/dev:** o provedor configurado é o checkout público real, não um sandbox. Por isso, criação, confirmação, webhook e ativação de teste agora falham fechados fora de `VERCEL_ENV=production`. Isso impede que uma prévia sem URL isolada use o endereço/handle de produção. Preços, cupons, benefícios e verificação server-side não foram alterados.

## Varredura visual e referência

- Foram examinadas 12 folhas CSS do Natural Sereno. Não restaram os tokens legados de verde-floresta/amarelo saturado pesquisados. O `#6F7B55` remanescente é sálvia e aparece em pequenos acentos/controles, não em grandes superfícies.
- Os quatro arquivos de paisagem do estilo existem no repositório: `vale-amanhecer.webp`, `cachoeira.webp`, `presenca.webp` e `acolhimento.webp`. São fotografias de natureza; a prévia usa `vale-amanhecer.webp`.
- A prancha versionada em `docs/visual-qa/natural-sereno/reference.jpg` foi aberta e inspecionada. Ela contém elementos da versão visual antiga; estes permanecem apenas como referência de composição. Paleta, botões e demais decisões posteriores continuam prevalecendo. A busca atual da Biblioteca não confirmou independentemente o ID original `file_00000000317c820ebaad657dc3680de5`; portanto, não afirmo equivalência de ID.
- O seletor continua sem estilo pré-selecionado, exige escolha e confirmação explícita, e mostra a prancha subordinada às decisões posteriores.

## Preservado

- Creme/marfim, café/marrom, dourado refinado e verde-sálvia somente como acento.
- Paisagens realistas, tipografia, botões de 18px e assinatura oficial discreta.
- Diário, fila de sincronização, snapshots e proteção de identidade por conta.
- Voz oficial, bloqueio de fallback robótico, Solfeggio, player, seis etapas e respiração 4–3–5.
- Preços, cupons, benefícios e confirmação de pagamento com consulta ao provedor, valor em centavos e proteção contra transação reutilizada.
- Elegância Profunda, Essência Luminosa e Místico Moderno não receberam redesenho nesta rodada.

## Pagamentos e ambiente

- Em produção, foram encontrados `INFINITEPAY_HANDLE` e `PUBLIC_APP_URL`; o código usa o endpoint público de checkout e `/payment_check`. Não é necessária uma `INFINITEPAY_API_KEY` para esse fluxo.
- As variáveis sensíveis ElevenLabs estão cadastradas para produção/prévia; seus valores não foram lidos.
- Uma variável `UPSTASH_DB_KEY` de leitura simples continua marcada como `readable-secret` exclusivamente na antiga branch de prévia `audit/natural-sereno-infinitepay-2026-10-13`. Não foi alterada nesta rodada por pertencer a uma configuração histórica separada.

## Validação

GitHub Actions **#2057 / execução 42572977418 — success**:
- npm audit: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes: **211/211 aprovados**.
- Build: aprovado, 2.250 módulos transformados.
- Entry points, JWT, autenticação administrativa, smoke tests e verificações de pagamento: aprovados.

## Pendente

1. **Homologação visual:** não há preview READY. O status Vercel permanece em falha `build-rate-limit`; os últimos deployments consultados aparecem como `ERROR / Resource provisioning failed`. Não há capturas renderizadas para concluir a inspeção página a página em desktop e mobile.
2. **Áudio real:** falta escutar a voz escolhida e validar narração, Solfeggio, ambiência e retomada em navegador autenticado.
3. **Sandbox:** ainda não existe integração de sandbox InfinitePay. Enquanto isso, o código bloqueia operações de pagamento fora da produção.
4. **Integração entre estilos:** PR #78 (Essência Luminosa) está 28 commits à frente e 5 atrás da main e compartilha `src/App.tsx` e `src/components/AnamnesisModal.tsx` com esta PR. Reconciliar as alterações aprovadas do Estilo 3 antes de qualquer merge.
5. **Referência:** confirmar o arquivo original pelo ID fornecido, se necessário; a cópia versionada no repositório foi inspecionada.

**Estado da entrega:** PR #79 aberta, draft, mergeable, 23 commits à frente e zero atrás da main. Sem merge, deploy de produção ou cobrança real.
