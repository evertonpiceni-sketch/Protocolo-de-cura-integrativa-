# Auditoria Estilo 4 — Místico Moderno (Run 24)

Data: 07/11/2026  
Branch: `fix/mistico-moderno-audit-run21-2026-11-07`  
PR: #42 — rascunho; sem merge na `main` e sem deploy de produção.

## Corrigido

- Reconciliada a branch do PR com a `main` atual, preservando as 14 atualizações posteriores dos Estilos 2 e 3, inclusive `protocolSessionAudioPolicy.ts`, os estilos aprovados mais recentes e seus testes.
- Corrigido defeito real em `LayoutChoiceModal.tsx`: o cartão referenciava `isMystic` fora do escopo onde a variável havia sido declarada. Agora a variável é declarada no próprio `OFFICIAL_LAYOUTS.map`; o cartão do Estilo 4 recebe superfície noturna, texto marfim e indicador coerente.
- A prévia do Estilo 4 usa a derivação WebP da prancha original `1001196522.png`. As prévias aprovadas dos Estilos 1, 2 e 3 foram preservadas.
- Logout redefine `layoutConfirmedThisSession` e `layoutChoiceRequested`; a conta seguinte precisa escolher e confirmar novamente.
- O player do Místico usa o alias `mistico-moderno-oficial`, resolvido no servidor pelo `ELEVENLABS_VOICE_ID` configurado. IDs legados são recusados e não há fallback silencioso para Web Speech.
- Ajustes de áudio informa que o Místico usa a voz do servidor, sem apresentar vozes locais como substitutas. Arcanjo/Solfeggio recebeu tratamento noturno escopado ao Estilo 4.

## Preservado

- Os quatro estilos, escolha explícita, confirmação antes da aplicação e prévias mais recentes dos Estilos 2 e 3.
- Política recente do player: durante narração de protocolo, frequências Solfeggio não são reiniciadas como áudio de fundo; Arcanjo/Solfeggio mantém sua posse de áudio e impede sobreposição com o player global.
- Diário, roteiros, conteúdos, animações compartilhadas e `SacredEnergyCanvas`; nenhuma animação foi removida sem referência e aprovação específicas.
- Reintegração da Vida, logo oficial discreto, checkout InfinitePay, preços e regras de cupons. Nenhum arquivo de pagamento foi alterado nesta rodada.

## Varredura estática

- 23 folhas CSS do Místico Moderno (22 já importadas na `main` + a folha específica Arcanjo/Solfeggio): todos os seletores verificados estão condicionados a `data-layout="mistico-moderno"`; nenhum seletor global indevido foi encontrado.
- O seletor React permanece como único seletor montado; o seletor DOM legado continua fora do ponto de entrada.
- A seleção inicia sem cartão marcado e o botão de confirmação permanece desabilitado até uma escolha explícita.

## Validação executada

- Workflow GitHub Security Audit do commit `7817b1712121f0607e58c4629fc9439f7ef5b678`: TypeScript aprovado; 50/50 testes de regressão aprovados; build de produção aprovado (com aviso de chunk principal acima de 500 kB).
- Verificações de entrypoints Vercel, padrões de segredos, JWT, registro/admin, smoke test de saúde/registro e endpoints de pagamento fail-closed aprovadas.
- O workflow terminou em falha somente no gate final de dependências: `npm audit` encontrou 9 vulnerabilidades (3 moderadas e 6 altas). Nenhuma dependência foi atualizada nesta rodada, para evitar regressões fora do escopo visual/funcional.

## Pendente / limites desta rodada

1. A identidade audível da voz não pôde ser confirmada por escuta: o valor de `ELEVENLABS_VOICE_ID` é protegido no Vercel. Não foi presumida uma voz chamada “Maiara”, nem reintroduzidos Rachel, Marcus ou Marianne.
2. A homologação renderizada de todas as páginas autenticadas continua pendente. O Vercel bloqueou novas implantações por limite diário do plano (`api-deployments-free-per-day`); o preview não foi disponibilizado.
3. Não foi executada transação real InfinitePay. A auditoria de dependências requer rodada própria, com análise de compatibilidade antes de qualquer atualização.

## Reauditoria

- O seletor foi reconciliado com o código atual da `main` e o escopo de `isMystic` foi corrigido e coberto por teste.
- A sessão mantém a política recente de áudio e o roteamento específico de voz do Estilo 4.
- A branch permanece em PR rascunho; nada foi mesclado na `main` ou publicado em produção.
