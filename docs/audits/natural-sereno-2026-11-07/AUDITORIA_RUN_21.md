# Auditoria — Estilo 1: Natural Sereno
**Data:** 07/11/2026  
**Base auditada:** `main` em `b1dec95feb008e3a615a2c28bbdf9c5b8b112a36`  
**Branch de correção:** `fix/natural-sereno-visual-audit-2026-11-07-v2`

## Corrigido
- Acrescentada uma camada final, restrita a `data-layout="natural-sereno"`, para retirar verde-floresta residual dos ícones de Mapa Astral/Numerologia, filtro ativo de Banhos, abas ativas de Ho'oponopono/Instalação/Conquistas e ações do painel administrativo. As superfícies passam a usar creme/marfim e dourado refinado; os demais estilos não são afetados.
- CTAs da Home e da autenticação deixam o raio de pílula legado e passam a cantos de 18 px. O botão de confirmação do seletor usa o mesmo acabamento somente quando Natural Sereno está selecionado; os outros três estilos permanecem intactos.
- Adicionado `tests/natural-sereno-audit.test.ts` para proteger seletor, referência visual, responsividade, assinatura do logo, Diário, política de voz/Solfeggio, animação e checkout.

## Preservado
- O seletor React continua sendo o único seletor oficial. A escolha começa sem opção pré-selecionada, exige confirmação e o tema só é aplicado depois da confirmação. As quatro opções permanecem disponíveis.
- A prancha oficial enviada como `1001196520.png` / `file_00000000317c820ebaad657dc3680de5` permanece vinculada à cópia versionada `docs/visual-qa/natural-sereno/reference.jpg`, usada na prévia do seletor. Nenhuma arte aprovada foi substituída.
- Paisagem realista da Home preservada; a camada responsiva mantém `cover`, enquadramento desktop a 52% e mobile a 54%, com alturas fluidas por viewport.
- Paleta creme/marfim, café, dourado refinado e verde-sálvia como acento; logo oficial discreto (opacidade de 30%, reduzida no mobile).
- Diário, player, cadência respiratória 4–3–5 e animação de seis etapas com respeito a `prefers-reduced-motion`.
- Solfeggio exato permanece impedido como trilha simultânea à fala do protocolo; a ambiência não tonal continua permitida.
- Numerologia e Prática Específica seguem no checkout InfinitePay, com confirmação de pagamento no servidor. Nenhuma transação real foi iniciada.

## Pendente
- **Voz escolhida:** o fluxo principal exige voz neural no Natural Sereno e não usa síntese do navegador; um ID ElevenLabs salvo e válido é preservado. Ainda não há comprovação do identificador exato da voz escolhida pelo Everton. O preview feminino pré-login em `ProfileSetup.tsx` ainda usa o alias `Rachel` e fallback do navegador; não foi substituído por um ID presumido.
- **Validação visual real:** as regras desktop/mobile foram auditadas no código, mas falta captura de navegador nas duas larguras para homologar recorte, nitidez e alinhamento em cada página.
- **Validação de mídia e pagamento:** falta teste de reprodução real da voz/Solfeggio e teste de checkout em ambiente de teste, sem cobrança real.
- O patch `naturalSerenoHomeApprovedModel.ts` continua carregado por conter lógica de estado da jornada; as regras visuais antigas são neutralizadas pelas folhas aprovadas carregadas depois. Separar lógica e CSS exige refatoração própria, não necessária para esta correção pontual.

## Validação automatizada
- GitHub Actions run `1423`: TypeScript passou; a suíte de regressão passou **106/106**; build, verificações de segurança/entrypoints, smoke test e validação dos endpoints de pagamento passaram.
- O bloqueio restante é o gate final de dependências: `npm audit --audit-level=moderate` encontrou **9 vulnerabilidades (3 moderadas, 6 altas)**. Não alterei dependências, por estarem fora do escopo do Estilo 1.
- O PR `#55` permanece aberto e não foi mesclado enquanto o gate de segurança estiver vermelho.

**Status:** correções pontuais preparadas e testadas; homologação integral aguarda validação visual/auditiva em navegador e resolução do gate de dependências.
