# Auditoria Run 29 — Estilo 4 · Místico Moderno

**Data:** 07/11/2026  
**Branch:** `fix/mistico-moderno-mainline-2026-11-07`  
**Base atual da main conferida:** `d503057a37aee8f84fe5bcd8a01cde85acb468b2`  
**Head auditado:** `0f30b22685c42d4d988e6c843d6801f28e62666a`  
**PR:** #49 (rascunho, aberto, sem merge)

## Corrigido no PR e revalidado

- Card Místico Moderno com superfície azul-noturna, texto marfim, acentos violeta/dourado e prancha própria em `object-contain`; a prancha não é usada como fundo global.
- Seletor React começa sem opção selecionada; confirmação fica desabilitada até escolha. O logout limpa a confirmação e o atributo `data-layout`, exigindo nova escolha na próxima conta.
- Arcanjo/Solfeggio recebeu camada noturna isolada por `data-layout="mistico-moderno"`.
- Home, Ajustes, player e Arcanjo usam o ID neural salvo no perfil para o Estilo 4. ID ausente/inválido ou falha de serviço interrompe a fala; o patch impede fallback para Rachel, Marcus ou SpeechSynthesis do navegador.
- Player mantém a política que impede Solfeggio tonal global de reiniciar durante a narração; Arcanjo interrompe o oscilador em pausa/erro.
- Diário permanece fechado por padrão; canvas respeita `prefers-reduced-motion`.
- Logo oficial permanece assinatura transparente: 30% desktop e 26% mobile.
- InfinitePay e confirmação server-side permanecem sem alteração; não foi feita cobrança real.

## Referência visual — ressalva encontrada

- O card usa `public/brand/mistico-moderno/prancha-oficial.webp`, 256×192 px (4:3), 8.768 bytes.
- A inspeção da imagem efetivamente commitada mostra compressão forte e perda de legibilidade dos detalhes/textos quando renderizada. A proporção está correta, mas a qualidade não atende plenamente à exigência de tipografia nítida.
- O PNG original indicado pelo Everton (`1001196522.png`, 1536×1152 segundo o registro anterior) não aparece na árvore atual do repositório nem foi recuperado pela busca de arquivos acessíveis nesta execução. Não fiz upscale artificial nem substituí a referência por outra imagem.
- A prévia permanece usando a derivação 4:3 atual até que o original de alta resolução esteja disponível para gerar um derivado fiel e nítido.

## Preservado

- Quatro estilos oficiais e suas regras; nenhuma alteração nos Estilos 1, 2 ou 3.
- 23 módulos CSS específicos do Místico Moderno importados em `src/main.tsx`; os testes de isolamento/escopo do PR continuam aprovados.
- Conteúdo do Diário, roteiros, player, animações, Reintegração e política de áudio.
- Preços, cupons, endpoints e fluxo de confirmação InfinitePay.

## Validação do head auditado

- TypeScript: aprovado.
- Testes de regressão: **96 aprovados, 0 falhas**.
- Build: aprovado.
- Verificações de autenticação, segurança de endpoints e pagamentos: aprovadas no job.
- Gate final de dependências: reprovado por **9 vulnerabilidades (3 moderadas, 6 altas)**; o relatório do job aponta dependências transitivas incluindo `body-parser`, `ip-address`, `qs`, `vite`, `zod` e `launch-editor`. Não executei `npm audit fix` nem alterei o lockfile, pois isso não é uma correção visual e exige atualização controlada.
- Preview Vercel e homologação autenticada no navegador: não confirmados nesta execução.

## Pendente

1. Substituir a derivação 256×192 pela conversão de alta qualidade do PNG original, sem inventar nem reconstruir a prancha.
2. Capturar e comparar todas as páginas renderizadas em desktop e mobile; a varredura disponível continua estática.
3. Reproduzir a voz neural efetivamente salva no perfil e validar Home, player e Arcanjo com credenciais ativas.
4. Testar frequências, pausa/retomada/encerramento do Solfeggio e persistência do Diário.
5. Homologar InfinitePay ponta a ponta em sandbox, sem cobrança real.
6. Atualizar as dependências vulneráveis em trabalho separado e repetir CI; liberar/confirmar preview Vercel.

**Resultado:** as correções de código do PR #49 continuam tecnicamente aprovadas em TypeScript, testes e build. A inspeção da prancha derivada revelou uma pendência de qualidade visual que impede homologação integral. Nenhuma alteração foi mesclada na `main` e nenhum deploy de produção foi realizado.
