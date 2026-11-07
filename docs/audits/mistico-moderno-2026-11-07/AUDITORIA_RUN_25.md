# Auditoria Estilo 4 — Místico Moderno
**Data:** 2026-11-07  
**Base:** `main` — revisão `a74e2d7`  
**Branch:** `audit/estilo4-mistico-2026-11-07`

## Corrigido

- O seletor dos quatro estilos agora apresenta a prancha oficial do Místico Moderno, em vez de uma prévia sintética. A imagem interna foi preservada e apenas reembalada em SVG para uso no card.
- A confirmação visual é descartada no logout: o tema anterior é removido e a próxima conta precisa escolher e confirmar novamente. A preferência salva não é tratada como autorização automática.
- A voz do Estilo 4 foi fixada em **Marianne — Meditação** (`mJqP14JQFEK0PojR5lfV`). Ajustes de áudio apresentam a voz oficial; os caminhos de player e narração forçam o ID aprovado e desabilitam `speechSynthesis` como substituto. Em falha, o sistema informa o erro em vez de tocar uma voz robótica.
- A tela Arcanjo/Solfeggio recebeu fundo noturno, painéis índigo, acentos dourados discretos e texto marfim. O verde genérico dos dias inativos foi substituído por índigo; as cores semânticas dos chakras foram preservadas.
- O player passou a usar uma paleta própria de dourado e esmeralda, com intensidade do backdrop reduzida para 62%, evitando brilho excessivo.

## Preservado e reauditado

- Os quatro estilos, as decisões visuais congeladas e a separação dos estilos 1, 2 e 3.
- As 23 folhas CSS do Místico Moderno importadas em `main.tsx`, todas com escopo `data-layout="mistico-moderno"`; nenhuma regra foi ampliada para os demais estilos.
- Diário, histórico, navegação, cursos, mapas, conquistas, relatórios, banhos, tratamentos, contato, vídeo, instalação móvel e modais existentes.
- Frequências Solfeggio exatas (396, 417, 432, 528, 639, 741, 852 e 963 Hz) e a política de propriedade do áudio durante sessões e Arcanjo.
- Checkout InfinitePay, validação de cupons no servidor e ausência de chave PIX manual. Nenhuma regra de preço ou pagamento foi alterada.
- Logo oficial como assinatura discreta, com opacidade aproximada de 28–30%.

## Validação técnica concluída

- TypeScript: aprovado.
- Regressão: **97/97 testes aprovados**.
- Build de produção: aprovado.
- Verificação de entrypoints Vercel, autenticação, registro e endpoints de pagamento: aprovadas.
- O PR está baseado na revisão atual de `main`, sem commits atrás; não houve merge nem deploy.

## Pendente

- Homologar visualmente todas as páginas em desktop e celular; a auditoria atual dos 23 CSS é estática.
- Ouvir Marianne — Meditação no player, no Arcanjo e no teste de voz, inclusive o tratamento de falha do serviço.
- O PNG original do anexo não ficou disponível para leitura direta nesta execução; foi usada a cópia WebP da prancha oficial recuperada no histórico do projeto, sem substituir por outra referência.
- O preview Vercel não foi provisionado: o status retornou `build-rate-limit`. O build de produção no CI passou.
- O gate de dependências permanece bloqueado por **9 vulnerabilidades (3 moderadas e 6 altas)** em `body-parser`, `ip-address`, `qs`, `vite` e `zod`. Não atualizei dependências neste escopo para evitar regressões fora do Estilo 4.

**Escopo de segurança:** nenhuma alteração foi feita em produção ou nos estilos 1, 2 e 3. O branch parte da revisão atual de `main`, não do PR #42 antigo, que permanece sem merge.
