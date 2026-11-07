# Auditoria — Estilo 1: Natural Sereno
**Data:** 07/11/2026  
**Base auditada:** `main` em `b447c847cff95b94f677cb2dca6c4a91ab83df50`  
**Branch de correção:** `fix/natural-sereno-visual-audit-2026-11-07-v2`

## Corrigido
- Acrescentada uma camada final, restrita a `data-layout="natural-sereno"`, para retirar verde-floresta residual dos ícones de Mapa Astral/Numerologia, filtro ativo de Banhos, abas ativas de Ho'oponopono/Instalação/Conquistas e ações do painel administrativo. As superfícies passam a usar creme/marfim e dourado refinado; os demais estilos não são afetados.
- Mantida a paisagem realista da Home. A camada responsiva existente conserva `cover` e enquadramentos distintos: desktop a 52% e mobile a 54%, com alturas fluidas por viewport.
- Adicionado `tests/natural-sereno-audit.test.ts` para proteger seletor, referência visual, responsividade, assinatura do logo, Diário, política de voz/Solfeggio, animação e checkout.



- Reforçado o acabamento dos CTAs do Natural Sereno: Home e autenticação deixam o raio de pílula legado e passam a cantos de 18 px; o botão de confirmação do seletor usa o mesmo acabamento somente quando Natural Sereno está selecionado. Os outros três estilos permanecem intactos.

## Preservado
- O seletor React continua sendo o único seletor oficial. A escolha começa sem opção pré-selecionada, exige confirmação e o tema só é aplicado depois da confirmação. As quatro opções permanecem disponíveis.
- A prévia Natural Sereno continua apontando para a prancha arquivada em `docs/visual-qa/natural-sereno/reference.jpg`; nenhuma arte aprovada foi substituída.
- Paleta creme/marfim, café, dourado refinado e verde-sálvia como acento; logo oficial discreto (opacidade de 30%, reduzida no mobile).
- Diário, player, cadência respiratória 4–3–5 e animação de seis etapas com respeito a `prefers-reduced-motion`.
- Solfeggio exato permanece impedido como trilha simultânea à fala do protocolo; a ambiência não tonal continua permitida.
- Fluxos de Numerologia e Prática Específica continuam no checkout InfinitePay, com confirmação de pagamento no servidor. Nenhuma transação real foi iniciada.

## Pendente
- **Voz escolhida:** o fluxo principal exige voz neural no Natural Sereno e não usa síntese do navegador. Ainda não há comprovação do identificador exato da voz escolhida pelo Everton. O preview feminino pré-login em `ProfileSetup.tsx` ainda usa o alias `Rachel` e fallback do navegador; não foi substituído por um ID presumido.
- **Validação visual real:** as regras desktop/mobile foram auditadas no código, mas falta captura de navegador nas duas larguras para homologar recorte, nitidez e alinhamento em cada página.
- **Validação de mídia e pagamento:** falta teste de reprodução real da voz/Solfeggio e teste de checkout em ambiente de teste, sem cobrança real.
- O patch `naturalSerenoHomeApprovedModel.ts` continua carregado por conter lógica de estado da jornada; as regras visuais antigas são neutralizadas pelas folhas aprovadas carregadas depois. Separar lógica e CSS exige uma refatoração própria, não necessária para esta correção pontual.

**Status:** correções visuais pontuais registradas; homologação integral permanece aberta até concluir os testes pendentes.


## Validação automatizada
- GitHub Actions run `1417`: verificação TypeScript passou.
- Os 7 testes novos do Natural Sereno passaram. A suíte completa ficou em **105 aprovados / 1 reprovado**: a falha é preexistente no teste do Estilo 2 (`tests/elegancia-profunda-audit.test.ts:23`), que exige altura de 288 px enquanto a prancha atual mede 180 px. Não alterei o Estilo 2.
- `npm audit --audit-level=moderate` encontrou **9 vulnerabilidades (3 moderadas, 6 altas)**. Por isso, o build e as etapas seguintes foram interrompidos pelo workflow.
- O PR `#55` permanece aberto e não foi mesclado; não contornei as verificações globais nem alterei dependências ou outro estilo fora do escopo.
