# Auditoria — Estilo 4 Místico Moderno — Run 21
Data: 07/11/2026
Branch: `fix/mistico-moderno-audit-run21-2026-11-07`
Pull request: #42 (rascunho; não mesclado)

## Corrigido
- Logout agora redefine `layoutConfirmedThisSession` e `layoutChoiceRequested`. Ao entrar com outra conta na mesma aba, a confirmação da conta anterior não é reutilizada: a escolha explícita volta a ser exigida.
- A tela Arcanjo/Solfeggio recebeu identidade noturna Místico Moderno, com azul-noturno/índigo, violeta discreto, dourado/âmbar e texto marfim. O tratamento está limitado a `data-layout="mistico-moderno"`; os dias ainda não concluídos usam índigo, enquanto as cores semânticas dos chakras ativos/concluídos foram preservadas.
- Corrigidas duas comparações TypeScript inalcançáveis no preview do seletor. A remoção dos ramos mortos após o retorno antecipado da prévia Elegância Profunda não altera a aparência dos cartões.
- Atualizados os testes do player para a regra vigente: falha no stream oficial informa erro, não inicia Web Speech/browser TTS silenciosamente e não reproduz uma resposta atrasada depois que a sessão é encerrada.

## Preservado
- Seletor React único, quatro estilos oficiais, nenhum estilo pré-selecionado automaticamente, confirmação explícita e persistência antes de aplicar o tema.
- Os 22 módulos CSS do Místico Moderno examinados estão escopados por `data-layout="mistico-moderno"`; nenhum seletor global foi encontrado nessa varredura.
- Diário, player, cabeçalho, navegação, mapas, cursos, modais, conteúdo, roteiros e frequências foram preservados.
- Reintegração da Vida continua separada e congelada; a assinatura oficial permanece sutil, com opacidade de 30%.
- Áudio global já bloqueia o background durante Arcanjo; `arcanjoAudioOwnershipPatch` foi preservado.
- Pagamento: Prática Específica e Numerologia continuam usando `/api/payment/create-checkout`; não foi reintroduzida chave PIX manual. `PROMO15` e `PROMO20` seguem no catálogo de descontos. `VIP7` permanece exclusivo do acesso VIP de 7 dias e é rejeitado na prática individual.

## Pendente / limitações
1. A prancha exata `1001196522.png` / `file_000000009978820eb49581883ae6340d` não ficou acessível nesta execução nem na busca de arquivos. O histórico do repositório registra que um fragmento incompleto da prancha foi removido no commit `109d510`; ele não foi restaurado e nenhuma prancha antiga/alternativa foi usada. A prévia do Místico no seletor continua esquemática até a imagem oficial ser disponibilizada.
2. Voz: não alterei IDs nem aliases sem confirmação da voz aprovada. Ajustes lista vozes locais do navegador, enquanto o player principal chama `/api/tts/stream`, que espera um ID de voz ElevenLabs (ou aliases conhecidos); o Místico ainda usa `OFFICIAL_PROTOCOL_VOICE_ID`. A seleção exibida e a voz efetivamente reproduzida não têm um mapeamento verificável. Não foi feita troca especulativa para Marianne, Rachel ou outro identificador.
3. `SacredEnergyCanvas` mantém animações compartilhadas de geometria, partículas e cores por etapa. Não foram removidas sem confronto com a prancha e com aprovação específica da animação.
4. CI do commit `2900d5c` (workflow #1140): TypeScript passou; testes de regressão passaram `35/35`; build de produção passou; verificações de entrypoints Vercel, segredos, JWT, administração, endpoints de pagamento e smoke test de saúde/registro passaram. O workflow ficou marcado como falha somente na etapa final de `npm audit`, que encontrou 9 vulnerabilidades preexistentes (3 moderadas e 6 altas) em `body-parser`, `ip-address`, `qs` (via ElevenLabs), `vite` e `zod`. Não atualizei dependências fora do escopo visual/funcional sem uma auditoria própria de compatibilidade.
5. O preview Vercel falhou quatro vezes com `BUILD_FAILED / Resource provisioning failed`, sem eventos de build disponíveis. Como o build do GitHub Actions passou, o erro observado está na etapa de provisionamento do preview; a validação visual hospedada permanece indisponível.
6. Inspeção renderizada desktop/mobile, reprodução real da voz aprovada/Solfeggio e checkout InfinitePay ponta a ponta continuam pendentes.

## Reauditoria
- A escolha explícita continua condicionada a `layoutConfirmedThisSession`; o tema não é aplicado antes da confirmação.
- O logout redefine os dois estados de confirmação/solicitação.
- A nova folha Arcanjo está importada no ponto de entrada e seus seletores são exclusivos do Místico Moderno.
- Nenhum arquivo dos Estilos 1–3 ou da Reintegração foi alterado.
- O PR #42 está aberto como rascunho; nada foi mesclado nem publicado em produção.
