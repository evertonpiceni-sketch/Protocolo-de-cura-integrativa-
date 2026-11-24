# Auditoria RUN 126 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Base atual:** `main` em `bd62eadd2bdd2421213f395f2ffef57c3cf4b811`  
**Branch de correção:** `fix/arcanjo-audio-ownership-stable-root-2026-11-09`  
**Escopo:** compatibilidade da posse de áudio do protocolo Arcanjo com o player neutro do Natural Sereno.

## Achado e correção

O guardião de áudio global ainda procurava a imagem retirada do player antigo:

`img[alt="Pessoa em meditação com os sete chakras"]`.

Na implementação Natural Sereno da PR #79, o protocolo usa `NeutralBodyLightProgress` e mantém o contêiner estável `#arcanjo-protocol-view`, sem aquela imagem. Depois do intervalo de abertura de cinco segundos, o guardião podia deixar de reconhecer a tela montada e não bloquear uma chamada externa a `audioEngine.startBG`.

Ajustei `src/lib/arcanjoAudioOwnershipPatch.ts` para identificar o protocolo pelo ID estável `#arcanjo-protocol-view`. O bloqueio continua limitado à superfície Arcanjo, preserva a proteção contra o dashboard e não altera a narração nem o sintetizador do Solfeggio.

Adicionei `tests/arcanjo-audio-ownership.test.ts` para proteger o contrato e impedir o retorno do seletor dependente da imagem antiga.

## Preservado

- A neutralidade visual do corpo e o protocolo de sete dias existentes na branch Natural Sereno.
- A sequência aprovada de voz neural e Solfeggio; nenhuma regra de frequência foi redesenhada.
- A identidade Natural Sereno: creme/marfim, café/marrom, dourado refinado, sálvia como acento, paisagens realistas e logo discreto.
- O seletor explícito dos quatro estilos e as decisões posteriores já aprovadas.
- Os tratamentos da Elegância Profunda, Essência Luminosa e Místico Moderno; nenhuma folha visual foi alterada.
- Diário, sincronização por conta, player, animações e regras da InfinitePay.

## Validação e limites

O HEAD anterior da PR #79 (`4e17fff292adee4a2a23b7f086a7ae6a8a4715da`) possui uma execução GitHub Actions concluída com sucesso: run `42677230012`, 247/247 testes, npm audit sem vulnerabilidades, TypeScript e build aprovados. A nova correção ainda depende da execução CI desta branch.

A consulta real ao GitHub mostra a PR #79 aberta em rascunho, mas **mergeable=false**. A comparação atual é 87 commits à frente e 8 atrás de `main`. Os oito commits da main incluem alterações compartilhadas em `App.tsx`, `ArcanjoProtocolView.tsx`, CSS e testes da Elegância Profunda. A versão Natural Sereno da PR substitui a estrutura antiga do Arcanjo por corpo neutro e sete dias; essa reconciliação exige preservar os comportamentos de ambos os estilos. Não fazer merge automático.

A Vercel não possui deployment para o SHA atual da PR #79. O deployment mais recente localizado para a branch Natural Sereno, no commit `bbdafc9d028fd3bb335a556cad8b7937f691f862`, terminou em `ERROR / BUILD_FAILED — Resource provisioning failed`; a consulta de eventos de build retornou vazia. Não há preview READY.

Continuam pendentes: inspeção visual renderizada página por página em desktop/mobile; escuta real de Marianne, Solfeggio e ambiência; homologação InfinitePay em sandbox, confirmação e webhook; recuperação independente do PNG original `1001196520.png`. A cópia versionada da prancha permanece sem substituição.

**Nenhum merge, publicação em produção ou cobrança real foi realizado.**
